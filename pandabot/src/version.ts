import { createRequire } from "node:module";

declare const __PANDA_VERSION__: string | undefined;

function readVersionFromPackageJson(): string | null {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../package.json") as { version?: string };
    return pkg.version ?? null;
  } catch {
    return null;
  }
}

// Single source of truth for the current panda version.
// - Embedded/bundled builds: injected define or env var.
// - Dev/npm builds: package.json.
export const VERSION =
  (typeof __PANDA_VERSION__ === "string" && __PANDA_VERSION__) ||
  process.env.PANDA_BUNDLED_VERSION ||
  readVersionFromPackageJson() ||
  "0.0.0";
