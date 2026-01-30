import type { PandaConfig } from "../../../config/config.js";
import type { DmPolicy } from "../../../config/types.js";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId } from "../../../routing/session-key.js";
import {
  listTelegramAccountIds,
  resolveDefaultTelegramAccountId,
  resolveTelegramAccount,
} from "../../../telegram/accounts.js";
import { formatDocsLink } from "../../../terminal/links.js";
import { formatCliCommand } from "../../../cli/command-format.js";
import type { WizardPrompter } from "../../../wizard/prompts.js";
import type { ChannelOnboardingAdapter, ChannelOnboardingDmPolicy } from "../onboarding-types.js";
import { addWildcardAllowFrom, promptAccountId } from "./helpers.js";

const channel = "telegram" as const;

function setTelegramDmPolicy(cfg: PandaConfig, dmPolicy: DmPolicy) {
  const allowFrom =
    dmPolicy === "open" ? addWildcardAllowFrom(cfg.channels?.telegram?.allowFrom) : undefined;
  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      telegram: {
        ...cfg.channels?.telegram,
        dmPolicy,
        ...(allowFrom ? { allowFrom } : {}),
      },
    },
  };
}

async function noteTelegramTokenHelp(prompter: WizardPrompter): Promise<void> {
  await prompter.note(
    [
      "1) 打开 Telegram 并与 @BotFather 对话",
      "2) 运行 /newbot（或 /mybots）",
      "3) 复制 token（格式如：123456:ABC...）",
      "提示：也可在环境变量中设置 TELEGRAM_BOT_TOKEN。",
      `文档：${formatDocsLink("/telegram")}`,
      "官网：https://pandabot.cc",
    ].join("\n"),
    "Telegram 机器人 Token",
  );
}

async function noteTelegramUserIdHelp(prompter: WizardPrompter): Promise<void> {
  await prompter.note(
    [
      `1) 给你的机器人发私信，然后在 \`${formatCliCommand("panda logs --follow")}\` 中查看 from.id（最安全）`,
      "2) 或调用 https://api.telegram.org/bot<bot_token>/getUpdates 读取 message.from.id",
      "3) 第三方：私信 @userinfobot 或 @getidsbot",
      `文档：${formatDocsLink("/telegram")}`,
      "官网：https://pandabot.cc",
    ].join("\n"),
    "Telegram 用户 ID",
  );
}

async function promptTelegramAllowFrom(params: {
  cfg: PandaConfig;
  prompter: WizardPrompter;
  accountId: string;
}): Promise<PandaConfig> {
  const { cfg, prompter, accountId } = params;
  const resolved = resolveTelegramAccount({ cfg, accountId });
  const existingAllowFrom = resolved.config.allowFrom ?? [];
  await noteTelegramUserIdHelp(prompter);

  const token = resolved.token;
  if (!token) {
    await prompter.note("Telegram token 缺失，无法查找用户名。", "Telegram");
  }

  const resolveTelegramUserId = async (raw: string): Promise<string | null> => {
    const trimmed = raw.trim();
    if (!trimmed) return null;
    const stripped = trimmed.replace(/^(telegram|tg):/i, "").trim();
    if (/^\d+$/.test(stripped)) return stripped;
    if (!token) return null;
    const username = stripped.startsWith("@") ? stripped : `@${stripped}`;
    const url = `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(username)}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        result?: { id?: number | string };
      } | null;
      const id = data?.ok ? data?.result?.id : undefined;
      if (typeof id === "number" || typeof id === "string") return String(id);
      return null;
    } catch {
      // Network error during username lookup - return null to prompt user for numeric ID
      return null;
    }
  };

  const parseInput = (value: string) =>
    value
      .split(/[\n,;]+/g)
      .map((entry) => entry.trim())
      .filter(Boolean);

  let resolvedIds: string[] = [];
  while (resolvedIds.length === 0) {
    const entry = await prompter.text({
      message: "Telegram 允许列表（用户名或用户 ID）",
      placeholder: "@username",
      initialValue: existingAllowFrom[0] ? String(existingAllowFrom[0]) : undefined,
      validate: (value) => (String(value ?? "").trim() ? undefined : "必填"),
    });
    const parts = parseInput(String(entry));
    const results = await Promise.all(parts.map((part) => resolveTelegramUserId(part)));
    const unresolved = parts.filter((_, idx) => !results[idx]);
    if (unresolved.length > 0) {
      await prompter.note(
        `无法解析：${unresolved.join(", ")}。请使用 @username 或数字 ID。`,
        "Telegram 允许列表",
      );
      continue;
    }
    resolvedIds = results.filter(Boolean) as string[];
  }

  const merged = [
    ...existingAllowFrom.map((item) => String(item).trim()).filter(Boolean),
    ...resolvedIds,
  ];
  const unique = [...new Set(merged)];

  if (accountId === DEFAULT_ACCOUNT_ID) {
    return {
      ...cfg,
      channels: {
        ...cfg.channels,
        telegram: {
          ...cfg.channels?.telegram,
          enabled: true,
          dmPolicy: "allowlist",
          allowFrom: unique,
        },
      },
    };
  }

  return {
    ...cfg,
    channels: {
      ...cfg.channels,
      telegram: {
        ...cfg.channels?.telegram,
        enabled: true,
        accounts: {
          ...cfg.channels?.telegram?.accounts,
          [accountId]: {
            ...cfg.channels?.telegram?.accounts?.[accountId],
            enabled: cfg.channels?.telegram?.accounts?.[accountId]?.enabled ?? true,
            dmPolicy: "allowlist",
            allowFrom: unique,
          },
        },
      },
    },
  };
}

async function promptTelegramAllowFromForAccount(params: {
  cfg: PandaConfig;
  prompter: WizardPrompter;
  accountId?: string;
}): Promise<PandaConfig> {
  const accountId =
    params.accountId && normalizeAccountId(params.accountId)
      ? (normalizeAccountId(params.accountId) ?? DEFAULT_ACCOUNT_ID)
      : resolveDefaultTelegramAccountId(params.cfg);
  return promptTelegramAllowFrom({
    cfg: params.cfg,
    prompter: params.prompter,
    accountId,
  });
}

const dmPolicy: ChannelOnboardingDmPolicy = {
  label: "Telegram",
  channel,
  policyKey: "channels.telegram.dmPolicy",
  allowFromKey: "channels.telegram.allowFrom",
  getCurrent: (cfg) => cfg.channels?.telegram?.dmPolicy ?? "pairing",
  setPolicy: (cfg, policy) => setTelegramDmPolicy(cfg, policy),
  promptAllowFrom: promptTelegramAllowFromForAccount,
};

export const telegramOnboardingAdapter: ChannelOnboardingAdapter = {
  channel,
  getStatus: async ({ cfg }) => {
    const configured = listTelegramAccountIds(cfg).some((accountId) =>
      Boolean(resolveTelegramAccount({ cfg, accountId }).token),
    );
    return {
      channel,
      configured,
      statusLines: [`Telegram：${configured ? "已配置" : "需要 token"}`],
      selectionHint: configured ? "推荐 · 已配置" : "推荐 · 新手友好",
      quickstartScore: configured ? 1 : 10,
    };
  },
  configure: async ({
    cfg,
    prompter,
    accountOverrides,
    shouldPromptAccountIds,
    forceAllowFrom,
  }) => {
    const telegramOverride = accountOverrides.telegram?.trim();
    const defaultTelegramAccountId = resolveDefaultTelegramAccountId(cfg);
    let telegramAccountId = telegramOverride
      ? normalizeAccountId(telegramOverride)
      : defaultTelegramAccountId;
    if (shouldPromptAccountIds && !telegramOverride) {
      telegramAccountId = await promptAccountId({
        cfg,
        prompter,
        label: "Telegram",
        currentId: telegramAccountId,
        listAccountIds: listTelegramAccountIds,
        defaultAccountId: defaultTelegramAccountId,
      });
    }

    let next = cfg;
    const resolvedAccount = resolveTelegramAccount({
      cfg: next,
      accountId: telegramAccountId,
    });
    const accountConfigured = Boolean(resolvedAccount.token);
    const allowEnv = telegramAccountId === DEFAULT_ACCOUNT_ID;
    const canUseEnv = allowEnv && Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim());
    const hasConfigToken = Boolean(
      resolvedAccount.config.botToken || resolvedAccount.config.tokenFile,
    );

    let token: string | null = null;
    if (!accountConfigured) {
      await noteTelegramTokenHelp(prompter);
    }
    if (canUseEnv && !resolvedAccount.config.botToken) {
      const keepEnv = await prompter.confirm({
        message: "检测到 TELEGRAM_BOT_TOKEN。使用环境变量？",
        initialValue: true,
      });
      if (keepEnv) {
        next = {
          ...next,
          channels: {
            ...next.channels,
            telegram: {
              ...next.channels?.telegram,
              enabled: true,
            },
          },
        };
      } else {
        token = String(
          await prompter.text({
            message: "输入 Telegram 机器人 Token",
            validate: (value) => (value?.trim() ? undefined : "必填"),
          }),
        ).trim();
      }
    } else if (hasConfigToken) {
      const keep = await prompter.confirm({
        message: "Telegram token 已配置。保留？",
        initialValue: true,
      });
      if (!keep) {
        token = String(
          await prompter.text({
            message: "输入 Telegram 机器人 Token",
            validate: (value) => (value?.trim() ? undefined : "必填"),
          }),
        ).trim();
      }
    } else {
      token = String(
        await prompter.text({
          message: "Enter Telegram bot token",
          validate: (value) => (value?.trim() ? undefined : "Required"),
        }),
      ).trim();
    }

    if (token) {
      if (telegramAccountId === DEFAULT_ACCOUNT_ID) {
        next = {
          ...next,
          channels: {
            ...next.channels,
            telegram: {
              ...next.channels?.telegram,
              enabled: true,
              botToken: token,
            },
          },
        };
      } else {
        next = {
          ...next,
          channels: {
            ...next.channels,
            telegram: {
              ...next.channels?.telegram,
              enabled: true,
              accounts: {
                ...next.channels?.telegram?.accounts,
                [telegramAccountId]: {
                  ...next.channels?.telegram?.accounts?.[telegramAccountId],
                  enabled: next.channels?.telegram?.accounts?.[telegramAccountId]?.enabled ?? true,
                  botToken: token,
                },
              },
            },
          },
        };
      }
    }

    if (forceAllowFrom) {
      next = await promptTelegramAllowFrom({
        cfg: next,
        prompter,
        accountId: telegramAccountId,
      });
    }

    return { cfg: next, accountId: telegramAccountId };
  },
  dmPolicy,
  disable: (cfg) => ({
    ...cfg,
    channels: {
      ...cfg.channels,
      telegram: { ...cfg.channels?.telegram, enabled: false },
    },
  }),
};
