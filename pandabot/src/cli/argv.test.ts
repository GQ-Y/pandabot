import { describe, expect, it } from "vitest";

import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "panda", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "panda", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "panda", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "panda", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "panda", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "panda", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "panda", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "panda"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "panda", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "panda", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "panda", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "panda", "status", "--timeout=2500"], "--timeout")).toBe("2500");
    expect(getFlagValue(["node", "panda", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "panda", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "panda", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "panda", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "panda", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "panda", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "panda", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "panda", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "panda", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "panda", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["node", "panda", "status"],
    });
    expect(nodeArgv).toEqual(["node", "panda", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["node-22", "panda", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "panda", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["node-22.2.0.exe", "panda", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "panda", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["node-22.2", "panda", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "panda", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["node-22.2.exe", "panda", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "panda", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["/usr/bin/node-22.2.0", "panda", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "panda", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["nodejs", "panda", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "panda", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["node-dev", "panda", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "panda", "node-dev", "panda", "status"]);

    const directArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["panda", "status"],
    });
    expect(directArgv).toEqual(["node", "panda", "status"]);

    const bunArgv = buildParseArgv({
      programName: "panda",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "panda",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "panda", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "panda", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "panda", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "panda", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "panda", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "panda", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "panda", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "panda", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
