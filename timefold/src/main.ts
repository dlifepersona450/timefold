import "./style.css";
import { eras, type ArchiveId } from "./archive";
import { mountAmbientAudio } from "./audio";
import { chapterCount, sampleTimeline, timeForEra } from "./timeline";
import { createWorld, type World } from "./world";
import { createDetailView } from "./ui/detail";
import { collectInterfaceElements, requireElement } from "./ui/dom";
import { escapeText } from "./ui/format";
import { renderShell } from "./ui/shell";
import { createTimelineView } from "./ui/timeline-view";

// The controller owns selection and input; UI modules own markup and DOM painting.
let motionEnabled = !matchMedia("(prefers-reduced-motion: reduce)").matches;
requireElement<HTMLElement>("#app").innerHTML = renderShell(motionEnabled);
const elements = collectInterfaceElements();
const listeners = new AbortController();
const signal = listeners.signal;
const dialogs = [elements.archiveDialog, elements.detailDialog, elements.aboutDialog];
const timelineView = createTimelineView(elements);
const detailView = createDetailView(elements.detailContent, selectDetailEra);
const disposeAudio = mountAmbientAudio(elements.soundButton, elements.soundLabel);

let world: World | undefined;
let timelineProgress = 0;
let selectedEra = 0;
let activeObject: ArchiveId | null = null;
let returnFocusTarget: HTMLElement | null = null;
let loadingTimeout: ReturnType<typeof setTimeout> | undefined;
let touchStartX = 0;
let touchStartY = 0;

/** Send the target to WebGL immediately and batch DOM updates once per frame. */
function setTime(value: number) {
  const sample = sampleTimeline(value);
  timelineProgress = sample.progress;
  selectedEra = sample.index;
  world?.setTime(timelineProgress);
  timelineView.schedule(sample);
}

function hasOpenDialog(): boolean {
  return dialogs.some((dialog) => dialog.open);
}

function showDialog(dialog: HTMLDialogElement) {
  returnFocusTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  dialog.showModal();
}

function closeDialog(dialog: HTMLDialogElement) {
  dialog.close();
  if (dialog === elements.detailDialog) {
    detailView.clear();
    activeObject = null;
    world?.focus(null);
    document.body.classList.remove("inspecting");
  }
  const canRestoreFocus = returnFocusTarget?.isConnected
    && !returnFocusTarget.closest("dialog:not([open])");
  if (canRestoreFocus) returnFocusTarget!.focus();
  else elements.archiveButton.focus();
}

function openIndex() {
  if (elements.detailDialog.open) closeDialog(elements.detailDialog);
  timelineView.flush();
  showDialog(elements.archiveDialog);
}

function openObject(id: ArchiveId) {
  if (elements.archiveDialog.open) elements.archiveDialog.close();
  // Snap to a chapter so the focused object, age, costume and content agree.
  setTime(timeForEra(selectedEra));
  timelineView.flush();
  activeObject = id;
  world?.focus(id);
  detailView.render(id, selectedEra);
  document.body.classList.add("inspecting");
  if (!elements.detailDialog.open) showDialog(elements.detailDialog);
}

function selectDetailEra(eraIndex: number) {
  if (!activeObject) return;
  setTime(timeForEra(eraIndex));
  timelineView.flush();
  world?.focus(activeObject);
  detailView.render(activeObject, selectedEra);
}

function previousEra() {
  setTime(timeForEra(Math.ceil(timelineProgress * chapterCount - 0.01) - 1));
}

function nextEra() {
  setTime(timeForEra(Math.floor(timelineProgress * chapterCount + 0.01) + 1));
}

function handleWheel(event: WheelEvent) {
  if (hasOpenDialog() || event.ctrlKey) return;
  event.preventDefault();
  // Browsers report pixels, lines or pages; normalize before applying sensitivity.
  const pixelsPerUnit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1;
  setTime(timelineProgress + event.deltaY * pixelsPerUnit * 0.00015);
}

function handleKeyDown(event: KeyboardEvent) {
  const target = event.target;
  const editingText = target instanceof HTMLElement
    && (target.matches("input, textarea, select") || target.isContentEditable);
  if (hasOpenDialog() || editingText) return;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") {
    event.preventDefault();
    nextEra();
  } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
    event.preventDefault();
    previousEra();
  }
}

function handleTouchStart(event: TouchEvent) {
  const touch = event.touches[0];
  if (!touch) return;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

function handleTouchEnd(event: TouchEvent) {
  if (hasOpenDialog()) return;
  const touch = event.changedTouches[0];
  if (!touch) return;
  const deltaX = touchStartX - touch.clientX;
  const deltaY = touchStartY - touch.clientY;
  const distance = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
  if (Math.abs(distance) > 35) setTime(timelineProgress + distance * 0.0009);
}

function toggleMotion() {
  motionEnabled = !motionEnabled;
  world?.setMotion(motionEnabled);
  elements.motionButton.textContent = `Ambient motion: ${motionEnabled ? "on" : "off"}`;
  elements.motionButton.setAttribute("aria-pressed", String(motionEnabled));
  document.body.classList.toggle("reduced-motion", !motionEnabled);
}

function showTooltip(id: ArchiveId | null, x: number, y: number) {
  const tooltip = elements.tooltip;
  tooltip.hidden = !id;
  if (!id) return;
  const era = eras[selectedEra];
  const state = era.objectStates[id];
  tooltip.innerHTML = `
    <span>${escapeText(state.name)}</span>
    <small>${era.year} / ${escapeText(state.form)} ↗</small>
  `;
  tooltip.style.left = `${Math.min(x + 18, window.innerWidth - 220)}px`;
  tooltip.style.top = `${Math.max(10, Math.min(y + 18, window.innerHeight - 85))}px`;
}

function bindDialogControls() {
  elements.closeButtons.forEach((button) => {
    button.addEventListener("click", () => closeDialog(button.closest("dialog")!), { signal });
  });
  dialogs.forEach((dialog) => {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeDialog(dialog);
    }, { signal });
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) closeDialog(dialog);
    }, { signal });
  });
}

function bindNavigationControls() {
  [elements.archiveButton, elements.fallbackButton, elements.backButton].forEach((button) => {
    button.addEventListener("click", openIndex, { signal });
  });
  elements.aboutButton.addEventListener("click", () => showDialog(elements.aboutDialog), { signal });
  elements.brand.addEventListener("click", (event) => {
    event.preventDefault();
    setTime(0);
  }, { signal });
  elements.timeInput.addEventListener("input", () => setTime(Number(elements.timeInput.value) / 1000), { signal });
  elements.eraButtons.forEach((button) => {
    button.addEventListener("click", () => setTime(timeForEra(Number(button.dataset.era))), { signal });
  });
  elements.previousButton.addEventListener("click", previousEra, { signal });
  elements.nextButton.addEventListener("click", nextEra, { signal });
  elements.exploreButton.addEventListener("click", () => openObject("projects"), { signal });
  elements.objectRows.forEach(({ button }) => {
    button.addEventListener("click", () => openObject(button.dataset.object as ArchiveId), { signal });
  });
  elements.motionButton.addEventListener("click", toggleMotion, { signal });
  window.addEventListener("wheel", handleWheel, { passive: false, signal });
  window.addEventListener("keydown", handleKeyDown, { signal });
  elements.canvas.addEventListener("touchstart", handleTouchStart, { passive: true, signal });
  elements.canvas.addEventListener("touchend", handleTouchEnd, { passive: true, signal });
}

function initializeWorld() {
  try {
    world = createWorld(elements.canvas, openObject, showTooltip);
    world.setTime(timelineProgress);
    world.setMotion(motionEnabled);
    elements.loading.classList.add("loaded");
    loadingTimeout = setTimeout(() => elements.loading.remove(), 650);
  } catch (error) {
    console.warn("WebGL room unavailable:", error);
    elements.loading.remove();
    elements.fallback.hidden = false;
    document.body.classList.add("webgl-unavailable");
  }
}

function dispose() {
  listeners.abort();
  if (loadingTimeout !== undefined) clearTimeout(loadingTimeout);
  timelineView.dispose();
  detailView.clear();
  disposeAudio();
  world?.dispose();
  dialogs.forEach((dialog) => { if (dialog.open) dialog.close(); });
  document.body.classList.remove("inspecting", "reduced-motion", "webgl-unavailable");
}

document.body.classList.toggle("reduced-motion", !motionEnabled);
bindDialogControls();
bindNavigationControls();
setTime(0);
timelineView.flush();
initializeWorld();

// Remove every controller listener, pending paint and owned resource during HMR.
if (import.meta.hot) import.meta.hot.dispose(dispose);
