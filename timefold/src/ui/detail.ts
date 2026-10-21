import { eraContent, eras, objects, type ArchiveId } from "../archive";
import { imageData } from "../art";
import { escapeText, twoDigits } from "./format";
import { mountPanelControls } from "./panel-controls";
import { renderPanel, type PanelContext } from "./panels";
import { renderResources } from "./resources";

function renderStageButtons(selectedEra: number): string {
  return eras.map((era, index) => `
    <button data-stage="${index}" class="${index === selectedEra ? "active" : ""}"
      aria-pressed="${index === selectedEra}" aria-label="View ${era.year} version">
      <strong>${era.year}</strong><small>${escapeText(era.phase)}</small>
    </button>`).join("");
}

function renderDetailMarkup(id: ArchiveId, context: PanelContext): string {
  const object = objects.find((candidate) => candidate.id === id)!;
  const { eraIndex, era, memory, state } = context;
  return `
    <div class="detail-heading">
      <span class="eyebrow">OBJECT ${object.mark} / ${escapeText(object.category.toUpperCase())}</span>
      <h2 id="detail-title">${escapeText(state.name)}<span class="heading-period">.</span></h2>
      <p>${escapeText(state.description)}</p>
      <span class="era-object-spec">${era.year} / ${escapeText(state.form.toUpperCase())}</span>
    </div>
    <div class="object-time-controls">
      <div class="detail-section-label">SAME OBJECT / ANOTHER MOMENT <span>AGE ${era.person.age}</span></div>
      <div class="phase-buttons">${renderStageButtons(eraIndex)}</div>
    </div>
    ${renderPanel(id, context)}
    ${renderResources(memory.resources?.[id] ?? [], era.year)}
    <div class="detail-footer">
      <span>FICTIONAL ARCHIVE / ${era.year}</span><span>${object.mark} — ${twoDigits(objects.length)}</span>
    </div>
  `;
}

/** Own replaceable detail content and its listeners/game for one application. */
export function createDetailView(
  container: HTMLElement,
  onSelectEra: (eraIndex: number) => void,
) {
  const photoImages = eraContent.map((memory, eraIndex) =>
    memory.photos.items.map((photo) => photo.src ?? imageData(eraIndex, false, photo.art)),
  );
  const foodImages = eraContent.map((memory, eraIndex) => memory.food.src ?? imageData(eraIndex, true));
  let listeners: AbortController | undefined;
  let cleanupPanel: (() => void) | undefined;

  function clear() {
    listeners?.abort();
    listeners = undefined;
    cleanupPanel?.();
    cleanupPanel = undefined;
  }

  function render(id: ArchiveId, eraIndex: number) {
    clear();
    const era = eras[eraIndex];
    const context: PanelContext = {
      eraIndex,
      era,
      memory: eraContent[eraIndex],
      state: era.objectStates[id],
      photoImages: photoImages[eraIndex],
      foodImage: foodImages[eraIndex],
    };
    container.innerHTML = renderDetailMarkup(id, context);
    listeners = new AbortController();
    const signal = listeners.signal;
    container.querySelectorAll<HTMLButtonElement>("button[data-stage]").forEach((button) => {
      button.addEventListener("click", () => {
        const selectedEra = Number(button.dataset.stage);
        onSelectEra(selectedEra);
        container.querySelector<HTMLButtonElement>(`button[data-stage="${selectedEra}"]`)?.focus();
      }, { signal });
    });
    cleanupPanel = mountPanelControls(id, container, context, signal);
  }

  return { render, clear };
}
