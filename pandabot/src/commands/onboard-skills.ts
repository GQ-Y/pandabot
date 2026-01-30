import { installSkill } from "../agents/skills-install.js";
import { buildWorkspaceSkillStatus } from "../agents/skills-status.js";
import { formatCliCommand } from "../cli/command-format.js";
import type { PandaConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { detectBinary, resolveNodeManagerOptions } from "./onboard-helpers.js";

function summarizeInstallFailure(message: string): string | undefined {
  const cleaned = message.replace(/^Install failed(?:\s*\([^)]*\))?\s*:?\s*/i, "").trim();
  if (!cleaned) return undefined;
  const maxLen = 140;
  return cleaned.length > maxLen ? `${cleaned.slice(0, maxLen - 1)}…` : cleaned;
}

function formatSkillHint(skill: {
  description?: string;
  install: Array<{ label: string }>;
}): string {
  const desc = skill.description?.trim();
  const installLabel = skill.install[0]?.label?.trim();
  const combined = desc && installLabel ? `${desc} — ${installLabel}` : desc || installLabel;
  if (!combined) return "install";
  const maxLen = 90;
  return combined.length > maxLen ? `${combined.slice(0, maxLen - 1)}…` : combined;
}

function upsertSkillEntry(
  cfg: PandaConfig,
  skillKey: string,
  patch: { apiKey?: string },
): PandaConfig {
  const entries = { ...cfg.skills?.entries };
  const existing = (entries[skillKey] as { apiKey?: string } | undefined) ?? {};
  entries[skillKey] = { ...existing, ...patch };
  return {
    ...cfg,
    skills: {
      ...cfg.skills,
      entries,
    },
  };
}

export async function setupSkills(
  cfg: PandaConfig,
  workspaceDir: string,
  runtime: RuntimeEnv,
  prompter: WizardPrompter,
): Promise<PandaConfig> {
  const report = buildWorkspaceSkillStatus(workspaceDir, { config: cfg });
  const eligible = report.skills.filter((s) => s.eligible);
  const missing = report.skills.filter((s) => !s.eligible && !s.disabled && !s.blockedByAllowlist);
  const blocked = report.skills.filter((s) => s.blockedByAllowlist);

  const needsBrewPrompt =
    process.platform !== "win32" &&
    report.skills.some((skill) => skill.install.some((option) => option.kind === "brew")) &&
    !(await detectBinary("brew"));

  await prompter.note(
    [
      `可用：${eligible.length}`,
      `缺少依赖：${missing.length}`,
      `被允许列表阻止：${blocked.length}`,
    ].join("\n"),
    "技能状态",
  );

  const shouldConfigure = await prompter.confirm({
    message: "现在配置技能？（推荐）",
    initialValue: true,
  });
  if (!shouldConfigure) return cfg;

  if (needsBrewPrompt) {
    await prompter.note(
      [
        "许多技能依赖通过 Homebrew 分发。",
        "若无 brew，需手动从源码编译或下载发行版。",
      ].join("\n"),
      "推荐安装 Homebrew",
    );
    const showBrewInstall = await prompter.confirm({
      message: "显示 Homebrew 安装命令？",
      initialValue: true,
    });
    if (showBrewInstall) {
      await prompter.note(
        [
          "运行：",
          '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        ].join("\n"),
        "Homebrew 安装",
      );
    }
  }

  const nodeManager = (await prompter.select({
    message: "技能安装使用的 Node 包管理器",
    options: resolveNodeManagerOptions(),
  })) as "npm" | "pnpm" | "bun";

  let next: PandaConfig = {
    ...cfg,
    skills: {
      ...cfg.skills,
      install: {
        ...cfg.skills?.install,
        nodeManager,
      },
    },
  };

  const installable = missing.filter(
    (skill) => skill.install.length > 0 && skill.missing.bins.length > 0,
  );
  if (installable.length > 0) {
    const toInstall = await prompter.multiselect({
      message: "安装缺失的技能依赖",
      options: [
        {
          value: "__skip__",
          label: "暂时跳过",
          hint: "不安装依赖继续",
        },
        ...installable.map((skill) => ({
          value: skill.name,
          label: `${skill.emoji ?? "🧩"} ${skill.name}`,
          hint: formatSkillHint(skill),
        })),
      ],
    });

    const selected = (toInstall as string[]).filter((name) => name !== "__skip__");
    for (const name of selected) {
      const target = installable.find((s) => s.name === name);
      if (!target || target.install.length === 0) continue;
      const installId = target.install[0]?.id;
      if (!installId) continue;
      const spin = prompter.progress(`Installing ${name}…`);
      const result = await installSkill({
        workspaceDir,
        skillName: target.name,
        installId,
        config: next,
      });
      if (result.ok) {
        spin.stop(`Installed ${name}`);
      } else {
        const code = result.code == null ? "" : ` (exit ${result.code})`;
        const detail = summarizeInstallFailure(result.message);
        spin.stop(`Install failed: ${name}${code}${detail ? ` — ${detail}` : ""}`);
        if (result.stderr) runtime.log(result.stderr.trim());
        else if (result.stdout) runtime.log(result.stdout.trim());
        runtime.log(
          `Tip: run \`${formatCliCommand("panda doctor")}\` to review skills + requirements.`,
        );
        runtime.log("Docs: https://docs.pandabot.cc/skills");
      }
    }
  }

  for (const skill of missing) {
    if (!skill.primaryEnv || skill.missing.env.length === 0) continue;
    const wantsKey = await prompter.confirm({
      message: `Set ${skill.primaryEnv} for ${skill.name}?`,
      initialValue: false,
    });
    if (!wantsKey) continue;
    const apiKey = String(
      await prompter.text({
        message: `Enter ${skill.primaryEnv}`,
        validate: (value) => (value?.trim() ? undefined : "Required"),
      }),
    );
    next = upsertSkillEntry(next, skill.skillKey, { apiKey: apiKey.trim() });
  }

  return next;
}
