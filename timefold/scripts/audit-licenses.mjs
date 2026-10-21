/**
 * Read local lock/package/license metadata. No network requests or source edits.
 * `node scripts/audit-licenses.mjs` prints JSON without changing files.
 * `node scripts/audit-licenses.mjs --write` refreshes docs/rights inventories and
 * exact installed-package notice copies under docs/rights/licenses/.
 * See docs/rights/dependencies.md for every field, helper, and limitation.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const outputRoot = join(projectRoot, "docs/rights");
const lock = JSON.parse(readFileSync(join(projectRoot, "package-lock.json"), "utf8"));
const manifest = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
const shouldWrite = process.argv.includes("--write");

function packageName(packagePath) {
  return packagePath.slice(packagePath.lastIndexOf("node_modules/") + 13);
}

function repositoryUrl(repository) {
  const value = typeof repository === "string" ? repository : repository?.url;
  return value?.replace(/^git\+/, "").replace(/\.git$/, "") ?? null;
}

function readNotice(packagePath, filename, name, version) {
  const source = join(projectRoot, packagePath, filename);
  const content = readFileSync(source);
  const destination = `licenses/${name.replaceAll("/", "__").replaceAll("@", "")}-${version}-${filename}`;
  if (shouldWrite) {
    mkdirSync(dirname(join(outputRoot, destination)), { recursive: true });
    writeFileSync(join(outputRoot, destination), content);
  }
  return {
    source: relative(projectRoot, source).replaceAll("\\", "/"),
    copy: destination,
    sha256: createHash("sha256").update(content).digest("hex"),
  };
}

const packages = Object.entries(lock.packages)
  .filter(([packagePath]) => packagePath !== "")
  .sort(([left], [right]) => left.localeCompare(right, "en"))
  .map(([packagePath, entry]) => {
    const name = packageName(packagePath);
    const metadataPath = join(projectRoot, packagePath, "package.json");
    const installed = existsSync(metadataPath);
    const metadata = installed ? JSON.parse(readFileSync(metadataPath, "utf8")) : null;
    const noticeFiles = installed
      ? readdirSync(join(projectRoot, packagePath)).filter((filename) =>
          /^(licen[sc]e|copying|notice)(\..*)?$|^ThirdPartyNoticeText\.txt$/i.test(filename),
        ).sort()
      : [];
    return {
      name,
      version: entry.version,
      path: packagePath,
      declaredLicense: entry.license ?? metadata?.license ?? null,
      role: manifest.dependencies?.[name] ? "direct runtime"
        : manifest.devDependencies?.[name] ? "direct development"
        : entry.dev ? "development transitive/optional" : "runtime transitive",
      optional: Boolean(entry.optional),
      os: entry.os ?? null,
      cpu: entry.cpu ?? null,
      resolved: entry.resolved ?? null,
      integrity: entry.integrity ?? null,
      installed,
      installedVersion: metadata?.version ?? null,
      repository: repositoryUrl(metadata?.repository),
      homepage: metadata?.homepage ?? null,
      dependencies: entry.dependencies ?? {},
      optionalDependencies: entry.optionalDependencies ?? {},
      notices: noticeFiles.map((filename) => readNotice(packagePath, filename, name, entry.version)),
    };
  });

const inventory = {
  schemaVersion: 1,
  source: "package-lock.json plus installed package root metadata/license files",
  lockfileVersion: lock.lockfileVersion,
  lockfileSha256: createHash("sha256").update(readFileSync(join(projectRoot, "package-lock.json"))).digest("hex"),
  platform: { os: process.platform, cpu: process.arch },
  packageCount: packages.length,
  installedCount: packages.filter((entry) => entry.installed).length,
  packages,
};

function markdown() {
  const rows = packages.map((entry) => {
    const notices = entry.notices.length
      ? entry.notices.map((notice) => `[${notice.source.split("/").at(-1)}](${notice.copy})`).join(", ")
      : entry.installed ? "Metadata only; no package-root notice file" : "Not installed on this machine";
    return `| \`${entry.name}\` | ${entry.version} | ${entry.declaredLicense ?? "Undeclared"} | ${entry.role}${entry.optional ? "; optional" : ""} | ${entry.installed ? "Yes" : "No"} | ${notices} |`;
  });
  return [
    "# Complete lockfile dependency inventory",
    "",
    "[Documentation home](../README.md) · [Rights guide](README.md) · [Dependency explanation](dependencies.md)",
    "",
    "Generated from local files by `node scripts/audit-licenses.mjs --write`. This table records declared licenses, not a determination of rights for every file. Exact copies preserve package-root license and notice files when present. Platform packages absent locally are recorded from lockfile metadata only. Bundled code notices inside Vite, Rollup, and TypeScript are preserved in those packages' full notice files.",
    "",
    `Lockfile SHA-256: \`${inventory.lockfileSha256}\`. ${inventory.packageCount} locked package paths; ${inventory.installedCount} installed on ${process.platform}/${process.arch}.`,
    "",
    "| Package | Locked version | Declared license | Role | Installed | Local license/notice evidence |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
    "For repository URLs, registry archives, package integrity hashes, dependency edges, platform constraints, exact notice-copy hashes, and installed-version comparisons, open [dependency-inventory.json](dependency-inventory.json). A package's presence here does not mean it is included in the browser bundle. See the [dependency explanation](dependencies.md).",
    "",
  ].join("\n");
}

if (shouldWrite) {
  mkdirSync(outputRoot, { recursive: true });
  writeFileSync(join(outputRoot, "dependency-inventory.json"), `${JSON.stringify(inventory, null, 2)}\n`);
  writeFileSync(join(outputRoot, "lock-inventory.md"), markdown());
  process.stdout.write(`Recorded ${inventory.packageCount} package paths, ${inventory.installedCount} installed; refreshed docs/rights inventories and exact local notice copies.\n`);
} else {
  process.stdout.write(`${JSON.stringify(inventory, null, 2)}\n`);
}
