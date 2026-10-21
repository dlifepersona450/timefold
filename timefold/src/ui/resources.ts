import type { ArchiveResource } from "../archive";
import { escapeText, safeResourceUrl } from "./format";

function renderResource(resource: ArchiveResource): string {
  const href = safeResourceUrl(resource.url);
  const progress = resource.progress === undefined
    ? null
    : Math.max(0, Math.min(100, resource.progress));
  return `
    <article class="resource-card" data-resource-id="${escapeText(resource.id)}">
      <div class="resource-meta">
        <span>${escapeText(resource.type.toUpperCase())}</span>
        <time datetime="${escapeText(resource.date)}">${escapeText(resource.date)}</time>
      </div>
      <h4>${escapeText(resource.title)}</h4><p>${escapeText(resource.summary)}</p>
      ${resource.status ? `<span class="resource-status">${escapeText(resource.status)}</span>` : ""}
      ${progress === null ? "" : `
        <label class="resource-progress">
          <span>PROGRESS <b>${progress}%</b></span>
          <progress value="${progress}" max="100" aria-label="${escapeText(resource.title)} progress">${progress}%</progress>
        </label>`}
      ${href ? `
        <a class="resource-link" href="${escapeText(href)}" target="_blank" rel="noopener noreferrer">
          Open ${escapeText(resource.type)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span>
        </a>` : ""}
    </article>
  `;
}

export function renderResources(resources: ArchiveResource[], year: string): string {
  if (!resources.length) return "";
  return `
    <section class="linked-archive" aria-label="Projects and posts connected to this moment">
      <div class="detail-section-label">CONNECTED TO THIS MOMENT / ${year}</div>
      ${resources.map(renderResource).join("")}
    </section>
  `;
}
