import type { PersonState } from "./archive";

// A matching editorial portrait for the selectable procedural figure in the room.
export function personPortrait(person: PersonState): string {
  const child = person.stage === "child",
    young = person.stage === "young-adult",
    elder = person.stage === "elder";
  const scale = child ? 0.76 : elder ? 0.88 : 0.9,
    head = child ? 27 : 23;
  const clothes = child
    ? `<g stroke="#f4d4b3" stroke-width="7" opacity=".7"><path d="M-34 28H34M-36 47H36M-37 66H37"/></g><g fill="none" stroke="#413b41" stroke-width="7"><path d="M-28 3Q-17 36-26 69M28 3Q17 36 26 69"/></g>`
    : young
      ? `<path d="M-23 2Q0-22 23 2L9 23H-9Z" fill="#384e43"/><path d="M-7 16V46M7 16V46" stroke="#d6cdb5" stroke-width="2"/><path d="M-20 68H20L24 90H-24Z" fill="#293f3838"/>`
      : elder
        ? `<path d="M-36 12L-43 142H43L36 12Z" fill="${person.top}"/><g stroke="var(--accent)" stroke-width="2" fill="none" opacity=".9"><path d="M-24 8L-15 25V131M24 8L15 25V131M-35 116H35"/></g><path d="M-14 0L0 24L14 0" fill="#e1e9e5"/><g fill="#b5ced8"><circle cy="47" r="2"/><circle cy="66" r="2"/></g>`
        : `<path d="M-22-3L0 24L22-3L15 24L0 34L-15 24Z" fill="#c3d1be"/><path d="M0 34V100M-28 45H-9M9 45H28" stroke="#314d45" stroke-width="2"/>`;
  return `<svg class="person-portrait" viewBox="0 0 400 390" role="img" aria-label="Stylized ${person.stage}, age ${person.age}, wearing ${person.outfit}"><defs><linearGradient id="portrait-light" x2="0" y2="1"><stop stop-color="var(--accent)" stop-opacity=".13"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs><path d="M115 329V42H285V329" fill="url(#portrait-light)" stroke="var(--accent)" stroke-opacity=".25"/><path d="M102 329H298M85 346H315M65 365H335" stroke="var(--accent)" stroke-opacity=".14"/><ellipse cx="200" cy="330" rx="68" ry="10" fill="#080f172e"/><g transform="translate(200 330) scale(${scale}) translate(0 -270) ${elder ? "rotate(-3 0 100)" : ""}"><path d="M-28 90L-30 257H-7L0 142L7 257H30L28 90Z" fill="${person.bottom}"/><path d="M-31 251H-7V266H-42Q-43 257-31 251M7 251H31Q43 257 42 266H7Z" fill="#24343b"/><path d="M-31 1Q-42 6-46 26L-55 96L-43 100L-30 48L-33 108H33L30 48L43 100L55 96L46 26Q42 6 31 1Z" fill="${person.top}"/><g fill="${person.skin}"><ellipse cx="-48" cy="104" rx="7" ry="11"/><ellipse cx="48" cy="104" rx="7" ry="11"/><path d="M-11-25V8Q0 18 11 8V-25Z"/></g>${clothes}<ellipse cy="-43" rx="${head}" ry="${head * 1.2}" fill="${person.skin}"/><path d="M-${head} -40Q-${head + 6} -80 0 -77Q${head + 10} -79 ${head} -36L${head - 7} -53Q0 -47 -${head - 5} -58Z" fill="${person.hair}"/><g fill="#4b342f"><circle cx="-9" cy="-43" r="1.8"/><circle cx="9" cy="-43" r="1.8"/></g><path d="M-5-28Q0-24 5-28" fill="none" stroke="#704b40" stroke-width="1.5"/>${elder ? '<g stroke="#795c51" stroke-width="1" fill="none"><path d="M-16-35L-11-33M11-33L16-35M-9-55H8M-7-59H7"/></g><g fill="none" stroke="#c9dfeb" stroke-width="1.5"><rect x="-19" y="-49" width="15" height="12" rx="4"/><rect x="4" y="-49" width="15" height="12" rx="4"/><path d="M-4-44H4"/></g>' : ""}</g><text x="26" y="34" fill="var(--accent)" font-family="monospace" font-size="9" letter-spacing="2">THE SAME PERSON</text><text x="26" y="367" fill="var(--accent)" font-family="monospace" font-size="9">AGE ${String(person.age).padStart(2, "0")} / ${person.stage.toUpperCase()}</text></svg>`;
}
