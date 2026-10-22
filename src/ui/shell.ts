import { eras, objects } from "../archive";
import { escapeText, twoDigits } from "./format";

const foldedMark = `
  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <path d="m8 12 16-4 8 8-4 16-16-4Z M15 17l9-2 3 9-10 2Z M8 12l7 5m9-9v7m8 1-5 8m1 8-11-6m-5 2 3-11"
      stroke="currentColor" stroke-width="1.2"/>
  </svg>`;

function renderEraButtons(): string {
  return eras.map((era, index) => `
    <button data-era="${index}" class="${index === 0 ? "active" : ""}"
      aria-label="Travel to ${era.year}: ${escapeText(era.name)}" aria-pressed="${index === 0}">
      <span>${era.year}</span><small>${escapeText(era.phase)}</small>
    </button>`).join("");
}

function renderObjectRows(): string {
  return objects.map((object) => `
    <button class="object-row" data-object="${object.id}">
      <span class="object-number">${object.mark}</span>
      <span class="object-icon">${object.icon}</span>
      <span><strong>${escapeText(object.name)}</strong><small>${escapeText(object.category)}</small></span>
      <span class="row-arrow">↗</span>
    </button>`).join("");
}

/** Permanent page markup. Behavior belongs to main.ts and the panel controllers. */
export function renderShell(motionEnabled: boolean): string {
  const firstEra = eras[0];
  const objectCount = twoDigits(objects.length);
  return `
    <canvas id="world" aria-label="Interactive 3D liminal archive. Use the archive index to explore all seven objects with a keyboard."></canvas>
    <div class="scene-shade" aria-hidden="true"></div>
    <div class="grain" aria-hidden="true"></div>

    <header class="header">
      <a class="brand" href="#" aria-label="Timefold, return to the first moment">
        ${foldedMark}<span>TIMEFOLD<small>A PERSONAL UNIVERSE</small></span>
      </a>
      <button class="archive-button" id="archive-open">
        <span class="index-icon">⊞</span> Archive index <span class="count">${objectCount}</span>
      </button>
      <div class="header-actions">
        <button id="sound" class="utility" aria-pressed="false" aria-label="Enable ambient sound">
          <span class="sound-bars"><i></i><i></i><i></i><i></i></span><span class="sound-label">Sound off</span>
        </button>
        <button id="about-open" class="utility about-button">About <span aria-hidden="true">↗</span></button>
      </div>
    </header>

    <main>
      <section class="intro" aria-labelledby="headline">
        <p class="eyebrow"><span class="live-dot"></span> AN ARCHIVE BETWEEN MOMENTS</p>
        <h1 id="headline">Nothing is lost.<br>Just <em>folded.</em></h1>
        <p class="intro-copy">A few things I’ve made.<br>A few places I’ve been.<br>All the versions in between.</p>
        <button class="explore-button" id="explore">Step into a memory <span>↗</span></button>
        <p class="small-note">Move your cursor. There’s more than one dimension.</p>
      </section>
      <div class="scene-caption" aria-hidden="true">
        <span class="cross">+</span><span>THE FOLDED WORLDS<br><small>2.5D OBJECTS / A 4D STATE OF MIND</small></span>
      </div>
      <div class="room-marker">
        <span class="room-number" id="room-number">01</span>
        <div>
          <span id="era-name">${escapeText(firstEra.name)}</span>
          <small id="era-note">${escapeText(firstEra.note)}</small>
          <span class="traveller-readout" id="traveller-readout">AGE ${firstEra.person.age} / ${escapeText(firstEra.person.outfit)}</span>
        </div>
      </div>
      <div id="tooltip" class="tooltip" hidden></div>
      <div class="loading" id="loading">
        <span class="loading-symbol">${foldedMark}</span><span>Unfolding a little universe…</span>
      </div>
      <div class="fallback" id="fallback" hidden>
        <span>THE ROOM IS TAKING A DIFFERENT SHAPE</span><h2>Your archive is still here.</h2>
        <p>This browser couldn’t open the WebGL room.<br>Explore every object through the archive index.</p>
        <button id="fallback-index" class="explore-button">Open the archive ↗</button>
      </div>
    </main>

    <footer class="timeline" aria-label="Time navigation">
      <div class="time-label">
        <span class="eyebrow">YOU ARE HERE</span><span class="time-year" id="time-year">${firstEra.year}<span>·</span></span>
      </div>
      <div class="timeline-track">
        <div class="track-heading">
          <span><span id="spectral-label">PAST / WARM LIGHT</span></span><span id="phase-label">01 / IDEA</span>
        </div>
        <input type="range" id="time" min="0" max="1000" value="0" step="1"
          aria-label="Travel through the archive timeline" aria-valuetext="${firstEra.year}: ${escapeText(firstEra.name)}">
        <div class="era-buttons">${renderEraButtons()}</div>
      </div>
      <div class="timeline-navigation">
        <button id="prev-era" aria-label="Previous moment" disabled>←</button>
        <button id="next-era" aria-label="Next moment">→</button><span>SCROLL TO TRAVEL</span>
      </div>
    </footer>

    <dialog id="archive-dialog" class="drawer">
      <div class="drawer-top">
        <span class="eyebrow">THE COLLECTION / ${objectCount} OBJECTS</span>
        <button class="close-button" data-close aria-label="Close archive index">✕</button>
      </div>
      <h2>Little things.<br><em>Entire worlds.</em></h2>
      <p class="drawer-intro">Choose an object. See how it changes with time.</p>
      <div class="object-list">${renderObjectRows()}</div>
      <p class="drawer-foot">SEVEN OBJECTS. FOUR CHAPTERS. THE SAME PERSON.</p>
    </dialog>
    <dialog id="detail-dialog" class="drawer detail-drawer" aria-labelledby="detail-title">
      <div class="drawer-top">
        <button id="back-index" class="text-button">← All objects</button>
        <button class="close-button" data-close aria-label="Return to the room">✕</button>
      </div>
      <div id="detail-content"></div>
    </dialog>
    <dialog id="about-dialog" class="about-dialog">
      <button class="close-button" data-close aria-label="Close about">✕</button>
      <span class="eyebrow">A NOTE ON THIS LITTLE UNIVERSE</span>
      <h2>Time doesn’t pass.<br><em>It collects.</em></h2>
      <p>TIMEFOLD combines <strong>The Folded Worlds</strong>, a layered 2.5D life archive, with a spatial timeline. The room is the fourth dimension. The objects are the memories inside it.</p>
      <p>Travel from 1998 to an imagined 2056. A family computer becomes an interface made of light. A child grows older, changes clothes, and keeps the same curiosity.</p>
      <p>Warm red marks the past; cool blue marks the future. It is an artistic palette inspired by redshift and blueshift, rather than a physical law assigning colors to time.</p>
      <p class="demo-note">This is a creative coding prototype. The dates, person, costumes, and memories form a fictional sample life. Replace them with your own story.</p>
      <div class="about-bottom">
        <span>BUILT WITH THREE.JS + A LITTLE CURIOSITY</span>
        <button id="motion" class="text-button" aria-pressed="${motionEnabled}">Ambient motion: ${motionEnabled ? "on" : "off"}</button>
      </div>
    </dialog>
    <div class="sr-only" id="announcement" role="status" aria-live="polite"></div>
  `;
}
