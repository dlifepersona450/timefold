/** Render original SVG sources into GitHub-uploadable PNGs using local Chrome. */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assets = path.join(workspace, "dlifepersona450/assets");
const targets = [
  { name: "avatar", width: 1024, height: 1024 },
  { name: "social-preview", width: 1280, height: 640 },
  { name: "explorer-banner", width: 1400, height: 500 },
  { name: "explorer-banner-dark", width: 1400, height: 500 },
  { name: "explorer-banner-mobile", width: 700, height: 700 },
];

function parseArguments(args) {
  let browser = process.env.DLIFE_CHROME_BIN;
  let noSandbox = false;
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--no-sandbox") noSandbox = true;
    else if (args[index] === "--browser" && args[index + 1]) browser = args[++index];
    else throw new Error("Usage: node scripts/export-profile-assets.mjs [--browser /path/to/chrome] [--no-sandbox]");
  }
  return { browser, noSandbox };
}

function findBrowser(preferred) {
  const candidates = preferred ? [preferred] : [
    "google-chrome", "chromium", "chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  ];
  for (const candidate of candidates) {
    const result = spawnSync(candidate, ["--version"], { encoding: "utf8", timeout: 5000 });
    if (!result.error && result.status === 0) return candidate;
  }
  throw new Error("Chrome/Chromium was not found. Set DLIFE_CHROME_BIN or pass --browser with its executable path.");
}

function inspectPng(filename, target) {
  const bytes = fs.readFileSync(filename);
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) {
    throw new Error(`${target.name}: browser did not produce a PNG.`);
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== target.width || height !== target.height) {
    throw new Error(`${target.name}: expected ${target.width}×${target.height}, received ${width}×${height}.`);
  }
  if (bytes.length >= 1_000_000) throw new Error(`${target.name}: PNG exceeds the 1 MB export limit.`);
  return { width, height, bytes: bytes.length };
}

function renderAsset(browser, options, temporary, target) {
  const source = path.join(assets, `${target.name}.svg`);
  if (!fs.existsSync(source)) throw new Error(`Missing SVG source: ${source}`);
  const output = path.join(temporary, `${target.name}.png`);
  const page = path.join(temporary, `${target.name}.html`);
  // Serialize the local URL as an attribute; the SVG itself stays unmodified.
  const imageUrl = pathToFileURL(source).href.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  fs.writeFileSync(page, `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}img{display:block;width:100%;height:100%}</style><img src="${imageUrl}" alt="">`);
  const args = [
    "--headless=new", "--disable-gpu", "--disable-extensions", "--hide-scrollbars",
    "--force-device-scale-factor=1", "--default-background-color=00000000",
    `--user-data-dir=${path.join(temporary, "browser")}`,
    `--window-size=${target.width},${target.height}`,
    "--virtual-time-budget=1500", `--screenshot=${output}`,
    ...(options.noSandbox ? ["--no-sandbox"] : []), pathToFileURL(page).href,
  ];
  const result = spawnSync(browser, args, { encoding: "utf8", timeout: 30000, maxBuffer: 2_000_000 });
  if (result.error || result.status !== 0 || !fs.existsSync(output)) {
    throw new Error(`${target.name}: Chrome export failed. ${result.error?.message ?? result.stderr.trim()}`);
  }
  return { output, target, ...inspectPng(output, target) };
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const browser = findBrowser(options.browser);
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "dlife-assets-"));
  try {
    // Validate every export before replacing any of the committed PNG files.
    const renders = targets.map((target) => renderAsset(browser, options, temporary, target));
    for (const render of renders) {
      const destination = path.join(assets, `${render.target.name}.png`);
      fs.copyFileSync(render.output, destination);
      console.log(`${path.relative(workspace, destination)} · ${render.width}×${render.height} · ${render.bytes} bytes`);
    }
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}

try { main(); }
catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
