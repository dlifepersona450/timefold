import { eras, type ArchiveId, type Era, type EraContent, type ObjectState } from "../archive";
import { personPortrait } from "../portrait";
import { escapeText, twoDigits } from "./format";

/** One chapter's immutable inputs, shared by its seven panel renderers. */
export interface PanelContext {
  eraIndex: number;
  era: Era;
  memory: EraContent;
  state: ObjectState;
  photoImages: string[];
  foodImage: string;
}

function renderProjects({ eraIndex, era, memory, state }: PanelContext): string {
  const project = memory.project;
  return `
    <div class="project-visual era-project-${eraIndex}">
      <div class="code-top"><span>● ● ●</span><span>${escapeText(state.form)} / ${era.year}</span></div>
      <div class="code-art">${project.code.map(escapeText).join("<br>")}</div>
      <span class="project-coordinate">ARCHIVE ${era.year} / ${escapeText(era.phase.toUpperCase())}</span>
    </div>
    <h3>${escapeText(project.title)}</h3><p>${escapeText(project.description)}</p>
    <div class="tags">${project.tags.map((tag) => `<span>${escapeText(tag)}</span>`).join("")}</div>
  `;
}

function renderPhotos({ eraIndex, memory, photoImages }: PanelContext): string {
  const photos = memory.photos;
  const firstPhoto = photos.items[0];
  const thumbnails = photoImages.map((source, index) => `
    <button data-photo="${index}" aria-label="View ${escapeText(photos.items[index].title)}"
      aria-pressed="${index === 0}" class="${index === 0 ? "active" : ""}">
      <img src="${escapeText(source)}" alt="">
    </button>`).join("");
  return `
    <div class="gallery era-photo-${eraIndex}">
      <img id="gallery-image" src="${escapeText(photoImages[0])}" alt="${escapeText(firstPhoto.alt)}">
      <span class="image-badge">${escapeText(photos.medium)}</span>
    </div>
    <div class="gallery-navigation">
      <span id="gallery-count">01 / ${twoDigits(photos.items.length)}</span>
      <div><button id="photo-prev" aria-label="Previous image">←</button><button id="photo-next" aria-label="Next image">→</button></div>
    </div>
    <h3 id="photo-title">${escapeText(firstPhoto.title)}</h3><p id="photo-caption">${escapeText(firstPhoto.caption)}</p>
    <div class="photo-thumbs">${thumbnails}</div>
  `;
}

function renderGame({ memory }: PanelContext): string {
  return `
    <div id="mini-game"></div>
    <div class="detail-section-label">${escapeText(memory.game.note)}</div>
    <h3>${escapeText(memory.game.title)}</h3><p>${escapeText(memory.game.description)}</p>
    <div class="tags"><span>Arrow keys / WASD</span><span>6 × 6 little world</span></div>
  `;
}

function renderJournal({ eraIndex, era, memory }: PanelContext): string {
  const journal = memory.journal;
  return `
    <article class="journal-page journal-era-${eraIndex}">
      <span class="journal-date">A NOTE FROM ${era.year} / AGE ${era.person.age}</span>
      <h3>${escapeText(journal.title)}</h3><p>${escapeText(journal.text)}</p>
      <span class="journal-sign">— the same person, another time</span><div class="journal-rule"></div>
      <p class="journal-postscript">Things to remember:<br>${journal.reminders.map(escapeText).join("<br>")}</p>
    </article>
  `;
}

function renderFood({ era, memory, state, foodImage }: PanelContext): string {
  const food = memory.food;
  return `
    <div class="gallery">
      <img src="${escapeText(foodImage)}" alt="${escapeText(food.alt)}">
      <span class="image-badge">${escapeText(state.form.toUpperCase())} / ${era.year}</span>
    </div>
    <h3>${escapeText(food.title)}</h3><p>${escapeText(food.description)}</p>
    <div class="memory-meta"><span>ILLUSTRATIVE MEMORY</span><span>${escapeText(food.time)} / ${era.year}</span></div>
    <div class="food-note">${escapeText(food.note)}</div>
  `;
}

function renderPlaces({ memory }: PanelContext): string {
  const pins = memory.places.map((place, index) => `
    <g class="map-place" data-pin="${index}" style="opacity:${index === 0 ? 1 : 0.45}">
      <circle cx="${100 + index * 192}" cy="${140 + index * 13}" r="${index === 0 ? 9 : 5}" fill="currentColor"/>
      <text x="${65 + index * 192}" y="${115 + index * 13}" fill="currentColor" font-family="monospace" font-size="11">${twoDigits(index + 1)}</text>
    </g>`).join("");
  const places = memory.places.map((place, index) => `
    <button data-place="${index}" class="place-row ${index === 0 ? "active" : ""}" aria-pressed="${index === 0}">
      <span>${twoDigits(index + 1)}</span>
      <span><strong>${escapeText(place.name)}</strong><small>${escapeText(place.note)}</small></span><span>↗</span>
    </button>`).join("");
  return `
    <div class="travel-map">
      <svg viewBox="0 0 600 350" role="img" aria-label="An illustrative map of this era's memories">
        <defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="currentColor" stroke-width=".5" opacity=".35"/>
        </pattern></defs>
        <rect width="600" height="350" fill="url(#grid)"/>
        <path d="M70 170 Q160 40 270 140 T500 175" stroke="currentColor" stroke-width="1" stroke-dasharray="5 6" fill="none"/>
        ${pins}
      </svg>
      <span class="map-coordinate">${escapeText(memory.places[0].coordinates)}</span>
    </div>
    <div class="place-list">${places}</div>
  `;
}

function renderPerson({ eraIndex, era }: PanelContext): string {
  const lifeThread = eras.map((chapter, index) => `
    <div class="${index === eraIndex ? "active" : ""}"><span>${chapter.person.age}</span><small>${chapter.year}</small></div>
  `).join("");
  const birthYear = Number(eras[0].year) - eras[0].person.age;
  return `
    <div class="person-study">
      ${personPortrait(era.person)}
      <div class="person-age"><strong>${era.person.age}</strong><span>YEARS OLD<br>${era.year}</span></div>
    </div>
    <div class="person-costume"><span class="eyebrow">THE CLOTHES CHANGE, TOO</span><strong>${escapeText(era.person.outfit)}</strong></div>
    <h3>${escapeText(era.name)}</h3><p>${escapeText(era.person.description)}</p>
    <div class="life-thread">${lifeThread}</div>
    <p class="demo-note">One fictional person, born in ${birthYear}. Each chapter has its own age, proportions, hair, posture, and clothes. The future is imagined.</p>
  `;
}

/** TypeScript requires a renderer for every stable archive ID. */
const panelRenderers: Record<ArchiveId, (context: PanelContext) => string> = {
  projects: renderProjects,
  photos: renderPhotos,
  game: renderGame,
  journal: renderJournal,
  food: renderFood,
  places: renderPlaces,
  person: renderPerson,
};

export function renderPanel(id: ArchiveId, context: PanelContext): string {
  return panelRenderers[id](context);
}
