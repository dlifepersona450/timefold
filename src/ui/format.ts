/** Escape plain archive text before inserting it into an HTML template. */
export function escapeText(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

/** Resource links may be relative URLs or HTTP(S), never executable URLs. */
export function safeResourceUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function twoDigits(value: number): string {
  return String(value).padStart(2, "0");
}
