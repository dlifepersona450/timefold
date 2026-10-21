import { eras, type ArchiveId } from "../archive";
import type { sampleTimeline } from "../timeline";
import type { InterfaceElements } from "./dom";
import { twoDigits } from "./format";

type TimelineSample = ReturnType<typeof sampleTimeline>;

/** Coalesce rapid input into one DOM paint; world targets update separately. */
export function createTimelineView(elements: InterfaceElements) {
  let pendingSample: TimelineSample | undefined;
  let animationFrame: number | undefined;
  let paintedEra = -1;
  let announcedEra = 0;

  function paint(sample: TimelineSample) {
    const era = eras[sample.index];
    const theme = sample.theme;
    const properties: Record<string, string> = {
      "--accent": theme.accent,
      "--lime": theme.accent,
      "--cream": theme.text,
      "--muted": theme.muted,
      "--theme-bg": theme.background,
      "--panel": theme.panel,
      "--theme-paper": theme.paper,
      "--theme-ink": theme.shadow,
      "--line": theme.accent + "30",
      "--ambient": theme.ambient,
    };
    Object.entries(properties).forEach(([property, color]) => {
      document.documentElement.style.setProperty(property, color);
    });
    elements.themeColor?.setAttribute("content", theme.panel);
    elements.timeInput.value = String(Math.round(sample.progress * 1000));
    elements.timeInput.style.setProperty("--progress", `${sample.progress * 100}%`);
    elements.timeInput.setAttribute("aria-valuetext", `${sample.year}: ${era.name}, traveller age ${sample.age}`);
    // Keep the decorative dot node instead of replacing the year markup each frame.
    elements.timeYear.firstChild!.textContent = String(sample.year);
    elements.travellerReadout.textContent = `AGE ${sample.age} / ${era.person.outfit}`;
    elements.phaseLabel.textContent = `${sample.wavelengthNm} nm / COLOR STUDY`;
    elements.previousButton.disabled = sample.progress <= 0;
    elements.nextButton.disabled = sample.progress >= 1;

    // Object names and chapter labels only change when a chapter boundary is crossed.
    if (paintedEra !== sample.index) {
      paintedEra = sample.index;
      document.body.dataset.era = String(sample.index);
      elements.roomNumber.textContent = twoDigits(sample.index + 1);
      elements.eraName.textContent = era.name;
      elements.eraNote.textContent = era.note;
      elements.spectralLabel.textContent = era.direction;
      elements.eraButtons.forEach((button) => {
        const selected = Number(button.dataset.era) === sample.index;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      elements.objectRows.forEach((row) => {
        const state = era.objectStates[row.button.dataset.object as ArchiveId];
        row.name.textContent = state.name;
        row.form.textContent = state.form;
      });
    }
    if (announcedEra !== sample.index) {
      announcedEra = sample.index;
      elements.announcement.textContent = `${era.year}. ${era.name}. Traveller age ${era.person.age}. ${era.person.outfit}.`;
    }
  }

  function flush() {
    if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
    if (!pendingSample) return;
    const sample = pendingSample;
    pendingSample = undefined;
    paint(sample);
  }

  function schedule(sample: TimelineSample) {
    pendingSample = sample;
    if (animationFrame === undefined) animationFrame = requestAnimationFrame(flush);
  }

  function dispose() {
    if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
    pendingSample = undefined;
  }

  return { schedule, flush, dispose };
}
