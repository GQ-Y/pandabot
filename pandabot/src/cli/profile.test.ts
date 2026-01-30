import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "panda",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "panda", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "panda", "--dev", "gateway"]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "panda", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "panda", "--profile", "work", "status"]);
    if (!res.ok) throw new Error(res.error);
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "panda", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "panda", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (dev first)", () => {
    const res = parseCliProfileArgs(["node", "panda", "--dev", "--profile", "work", "status"]);
    expect(res.ok).toBe(false);
  });

  it("rejects combining --dev with --profile (profile first)", () => {
    const res = parseCliProfileArgs(["node", "panda", "--profile", "work", "--dev", "status"]);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join("/home/peter", ".pandabot-dev");
    expect(env.PANDA_PROFILE).toBe("dev");
    expect(env.PANDA_STATE_DIR).toBe(expectedStateDir);
    expect(env.PANDA_CONFIG_PATH).toBe(path.join(expectedStateDir, "panda.json"));
    expect(env.PANDA_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      PANDA_STATE_DIR: "/custom",
      PANDA_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.PANDA_STATE_DIR).toBe("/custom");
    expect(env.PANDA_GATEWAY_PORT).toBe("19099");
    expect(env.PANDA_CONFIG_PATH).toBe(path.join("/custom", "panda.json"));
  });
});

describe("formatCliCommand", () => {
  it("returns command unchanged when no profile is set", () => {
    expect(formatCliCommand("panda doctor --fix", {})).toBe("panda doctor --fix");
  });

  it("returns command unchanged when profile is default", () => {
    expect(formatCliCommand("panda doctor --fix", { PANDA_PROFILE: "default" })).toBe(
      "panda doctor --fix",
    );
  });

  it("returns command unchanged when profile is Default (case-insensitive)", () => {
    expect(formatCliCommand("panda doctor --fix", { PANDA_PROFILE: "Default" })).toBe(
      "panda doctor --fix",
    );
  });

  it("returns command unchanged when profile is invalid", () => {
    expect(formatCliCommand("panda doctor --fix", { PANDA_PROFILE: "bad profile" })).toBe(
      "panda doctor --fix",
    );
  });

  it("returns command unchanged when --profile is already present", () => {
    expect(
      formatCliCommand("panda --profile work doctor --fix", { PANDA_PROFILE: "work" }),
    ).toBe("panda --profile work doctor --fix");
  });

  it("returns command unchanged when --dev is already present", () => {
    expect(formatCliCommand("panda --dev doctor", { PANDA_PROFILE: "dev" })).toBe(
      "panda --dev doctor",
    );
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("panda doctor --fix", { PANDA_PROFILE: "work" })).toBe(
      "panda --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(formatCliCommand("panda doctor --fix", { PANDA_PROFILE: "  jbclawd  " })).toBe(
      "panda --profile jbclawd doctor --fix",
    );
  });

  it("handles command with no args after panda", () => {
    expect(formatCliCommand("panda", { PANDA_PROFILE: "test" })).toBe(
      "panda --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm panda doctor", { PANDA_PROFILE: "work" })).toBe(
      "pnpm panda --profile work doctor",
    );
  });
});
