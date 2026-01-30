import path from "node:path";

import { describe, expect, it } from "vitest";

import { detectLegacyWorkspaceDirs } from "./doctor-workspace.js";

describe("detectLegacyWorkspaceDirs", () => {
  it("ignores ~/panda when it doesn't look like a workspace (e.g. install dir)", () => {
    const home = "/home/user";
    const workspaceDir = "/home/user/panda";
    const candidate = path.join(home, "panda");

    const detection = detectLegacyWorkspaceDirs({
      workspaceDir,
      homedir: () => home,
      exists: (value) => value === candidate,
    });

    expect(detection.activeWorkspace).toBe(path.resolve(workspaceDir));
    expect(detection.legacyDirs).toEqual([]);
  });

  it("flags ~/panda when it contains workspace markers", () => {
    const home = "/home/user";
    const workspaceDir = "/home/user/other";
    const candidate = path.join(home, "panda");
    const agentsPath = path.join(candidate, "AGENTS.md");

    const detection = detectLegacyWorkspaceDirs({
      workspaceDir,
      homedir: () => home,
      exists: (value) => value === candidate || value === agentsPath,
    });

    expect(detection.legacyDirs).toEqual([candidate]);
  });
});
