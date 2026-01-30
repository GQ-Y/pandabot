import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
  resolveDefaultConfigCandidates,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers PANDA_OAUTH_DIR over PANDA_STATE_DIR", () => {
    const env = {
      PANDA_OAUTH_DIR: "/custom/oauth",
      PANDA_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from PANDA_STATE_DIR when unset", () => {
    const env = {
      PANDA_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  it("uses PANDA_STATE_DIR when set", () => {
    const env = {
      PANDA_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("orders default config candidates with panda first then legacy", () => {
    const home = "/home/test";
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    expect(candidates).toHaveLength(3);
    expect(candidates[0]).toBe(path.join(home, ".panda", "panda.json"));
    expect(candidates[1]).toBe(path.join(home, ".pandabot", "panda.json"));
    expect(candidates[2]).toBe(path.join(home, ".pandabot", "pandabot.json"));
  });

  it("returns ~/.panda as default state dir", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "panda-state-"));
    try {
      const pandaDir = path.join(root, ".panda");
      await fs.mkdir(pandaDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(pandaDir);
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });

  it("CONFIG_PATH uses ~/.panda/panda.json when present", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "panda-config-"));
    const previousHome = process.env.HOME;
    const previousUserProfile = process.env.USERPROFILE;
    const previousHomeDrive = process.env.HOMEDRIVE;
    const previousHomePath = process.env.HOMEPATH;
    const previousConfig = process.env.PANDA_CONFIG_PATH;
    const previousState = process.env.PANDA_STATE_DIR;
    try {
      const pandaDir = path.join(root, ".panda");
      await fs.mkdir(pandaDir, { recursive: true });
      const configPath = path.join(pandaDir, "panda.json");
      await fs.writeFile(configPath, "{}", "utf-8");

      process.env.HOME = root;
      if (process.platform === "win32") {
        process.env.USERPROFILE = root;
        const parsed = path.win32.parse(root);
        process.env.HOMEDRIVE = parsed.root.replace(/\\$/, "");
        process.env.HOMEPATH = root.slice(parsed.root.length - 1);
      }
      delete process.env.PANDA_CONFIG_PATH;
      delete process.env.PANDA_STATE_DIR;

      vi.resetModules();
      const { CONFIG_PATH } = await import("./paths.js");
      expect(CONFIG_PATH).toBe(configPath);
    } finally {
      if (previousHome === undefined) delete process.env.HOME;
      else process.env.HOME = previousHome;
      if (previousUserProfile === undefined) delete process.env.USERPROFILE;
      else process.env.USERPROFILE = previousUserProfile;
      if (previousHomeDrive === undefined) delete process.env.HOMEDRIVE;
      else process.env.HOMEDRIVE = previousHomeDrive;
      if (previousHomePath === undefined) delete process.env.HOMEPATH;
      else process.env.HOMEPATH = previousHomePath;
      if (previousConfig === undefined) delete process.env.PANDA_CONFIG_PATH;
      else process.env.PANDA_CONFIG_PATH = previousConfig;
      if (previousState === undefined) delete process.env.PANDA_STATE_DIR;
      else process.env.PANDA_STATE_DIR = previousState;
      await fs.rm(root, { recursive: true, force: true });
      vi.resetModules();
    }
  });

  it("respects state dir overrides when config is missing", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "panda-config-override-"));
    try {
      const overrideDir = path.join(root, "override");
      await fs.mkdir(overrideDir, { recursive: true });
      const env = { PANDA_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "panda.json"));
    } finally {
      await fs.rm(root, { recursive: true, force: true });
    }
  });
});
