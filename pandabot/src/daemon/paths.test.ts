import path from "node:path";

import { describe, expect, it } from "vitest";

import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".pandabot"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", PANDA_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".pandabot-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", PANDA_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".pandabot"));
  });

  it("uses PANDA_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", PANDA_STATE_DIR: "/var/lib/panda" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/panda"));
  });

  it("expands ~ in PANDA_STATE_DIR", () => {
    const env = { HOME: "/Users/test", PANDA_STATE_DIR: "~/panda-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/panda-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { PANDA_STATE_DIR: "C:\\State\\panda" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\panda");
  });
});
