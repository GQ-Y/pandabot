import type { PandaConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import type { WizardPrompter } from "../wizard/prompts.js";
import { buildWorkspaceHookStatus } from "../hooks/hooks-status.js";
import { resolveAgentWorkspaceDir, resolveDefaultAgentId } from "../agents/agent-scope.js";
import { formatCliCommand } from "../cli/command-format.js";

export async function setupInternalHooks(
  cfg: PandaConfig,
  runtime: RuntimeEnv,
  prompter: WizardPrompter,
): Promise<PandaConfig> {
  await prompter.note(
    [
      "钩子可让你在代理命令执行时自动触发操作。",
      "示例：在你执行 /new 时将会话上下文保存到记忆。",
      "",
      "了解更多：https://docs.pandabot.cc/hooks",
    ].join("\n"),
    "钩子",
  );

  // Discover available hooks using the hook discovery system
  const workspaceDir = resolveAgentWorkspaceDir(cfg, resolveDefaultAgentId(cfg));
  const report = buildWorkspaceHookStatus(workspaceDir, { config: cfg });

  // Show every eligible hook so users can opt in during onboarding.
  const eligibleHooks = report.hooks.filter((h) => h.eligible);

  if (eligibleHooks.length === 0) {
    await prompter.note(
      "未找到可用钩子。稍后可在配置中添加钩子。",
      "无可用钩子",
    );
    return cfg;
  }

  const toEnable = await prompter.multiselect({
    message: "启用钩子？",
    options: [
      { value: "__skip__", label: "暂时跳过" },
      ...eligibleHooks.map((hook) => ({
        value: hook.name,
        label: `${hook.emoji ?? "🔗"} ${hook.name}`,
        hint: hook.description,
      })),
    ],
  });

  const selected = toEnable.filter((name) => name !== "__skip__");
  if (selected.length === 0) {
    return cfg;
  }

  // Enable selected hooks using the new entries config format
  const entries = { ...cfg.hooks?.internal?.entries };
  for (const name of selected) {
    entries[name] = { enabled: true };
  }

  const next: PandaConfig = {
    ...cfg,
    hooks: {
      ...cfg.hooks,
      internal: {
        enabled: true,
        entries,
      },
    },
  };

  await prompter.note(
    [
      `Enabled ${selected.length} hook${selected.length > 1 ? "s" : ""}: ${selected.join(", ")}`,
      "",
      "You can manage hooks later with:",
      `  ${formatCliCommand("panda hooks list")}`,
      `  ${formatCliCommand("panda hooks enable <name>")}`,
      `  ${formatCliCommand("panda hooks disable <name>")}`,
    ].join("\n"),
    "Hooks Configured",
  );

  return next;
}
