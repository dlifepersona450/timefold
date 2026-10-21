import type { ArchiveId } from "../archive";
import { mountGame } from "../game";
import { requireElement } from "./dom";
import { twoDigits } from "./format";
import type { PanelContext } from "./panels";

function mountGallery(container: HTMLElement, context: PanelContext, signal: AbortSignal) {
  const photos = context.memory.photos.items;
  const image = requireElement<HTMLImageElement>("#gallery-image", container);
  const countLabel = requireElement<HTMLElement>("#gallery-count", container);
  const title = requireElement<HTMLElement>("#photo-title", container);
  const caption = requireElement<HTMLElement>("#photo-caption", container);
  const thumbnails = [...container.querySelectorAll<HTMLButtonElement>("button[data-photo]")];
  let selectedIndex = 0;

  function selectPhoto(index: number) {
    selectedIndex = (index + photos.length) % photos.length;
    const photo = photos[selectedIndex];
    image.src = context.photoImages[selectedIndex];
    image.alt = photo.alt;
    countLabel.textContent = `${twoDigits(selectedIndex + 1)} / ${twoDigits(photos.length)}`;
    title.textContent = photo.title;
    caption.textContent = photo.caption;
    thumbnails.forEach((button, thumbnailIndex) => {
      const selected = thumbnailIndex === selectedIndex;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  requireElement<HTMLButtonElement>("#photo-prev", container).addEventListener("click", () => selectPhoto(selectedIndex - 1), { signal });
  requireElement<HTMLButtonElement>("#photo-next", container).addEventListener("click", () => selectPhoto(selectedIndex + 1), { signal });
  thumbnails.forEach((button, index) => {
    button.addEventListener("click", () => selectPhoto(index), { signal });
  });
}

function mountPlaces(container: HTMLElement, context: PanelContext, signal: AbortSignal) {
  const coordinate = requireElement<HTMLElement>(".map-coordinate", container);
  const buttons = [...container.querySelectorAll<HTMLButtonElement>("button[data-place]")];
  const pins = [...container.querySelectorAll<SVGGElement>("[data-pin]")].map((element) => ({
    element,
    circle: requireElement<SVGCircleElement>("circle", element),
  }));

  function selectPlace(index: number) {
    coordinate.textContent = context.memory.places[index].coordinates;
    buttons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    pins.forEach((pin, pinIndex) => {
      const selected = pinIndex === index;
      pin.element.style.opacity = selected ? "1" : ".45";
      pin.circle.setAttribute("r", selected ? "9" : "5");
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => selectPlace(index), { signal });
  });
}

/** Attach behavior only after panel markup exists; return non-DOM cleanup. */
export function mountPanelControls(
  id: ArchiveId,
  container: HTMLElement,
  context: PanelContext,
  signal: AbortSignal,
): (() => void) | undefined {
  if (id === "photos") mountGallery(container, context, signal);
  if (id === "places") mountPlaces(container, context, signal);
  if (id === "game") {
    return mountGame(requireElement<HTMLElement>("#mini-game", container), {
      theme: context.era.theme,
      year: context.era.year,
    });
  }
}
