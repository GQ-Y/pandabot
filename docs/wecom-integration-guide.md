# 企业微信渠道集成技术方案

## 一、技术方案概述

### 1.1 目标

将企业微信作为 Pandabot 的新消息渠道，实现：
- 接收企业微信应用消息（单聊、群聊）
- 发送各类消息（文本、图文、卡片）
- 白名单与配对管理
- 完整的 onboarding 流程

### 1.2 参考实现

本方案完全参照 `extensions/msteams/` 的实现模式，确保与现有架构保持一致。

## 二、企业微信 API 调研

### 2.1 核心 API

| API | 用途 | 频率限制 |
|-----|------|---------|
| `GET /cgi-bin/gettoken` | 获取 access_token | 建议缓存 7200s |
| `POST /cgi-bin/message/send` | 发送应用消息 | 100次/分钟 |
| `POST /cgi-bin/agent/get` | 获取应用信息 | - |
| `GET /cgi-bin/user/get` | 获取用户信息 | - |

### 2.2 回调配置

企业微信需要配置回调 URL，用于接收消息事件：

- **回调 URL**：`https://your-domain.com/wecom/callback`
- **Token**：用于验签
- **EncodingAESKey**：用于加解密消息

### 2.3 消息格式

#### 接收消息（XML 格式）

```xml
<xml>
  <ToUserName><![CDATA[toUser]]></ToUserName>
  <FromUserName><![CDATA[fromUser]]></FromUserName>
  <CreateTime>1348831860</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[this is a test]]></Content>
  <MsgId>1234567890123456</MsgId>
  <AgentID>1</AgentID>
</xml>
```

#### 发送消息（JSON 格式）

```json
{
  "touser": "UserID",
  "msgtype": "text",
  "agentid": 1000002,
  "text": {
    "content": "Hello World"
  }
}
```

## 三、实现架构

### 3.1 目录结构

```
extensions/wecom/
├── package.json
├── pandabot.plugin.json
├── index.ts                          # 插件入口
├── README.md
├── src/
│   ├── channel.ts                   # ChannelPlugin 实现
│   ├── token.ts                     # access_token 管理
│   ├── send.ts                      # 发送消息 API
│   ├── monitor.ts                   # 回调监听器
│   ├── monitor-handler.ts           # 消息处理
│   ├── inbound.ts                   # 入站消息解析
│   ├── outbound.ts                  # 出站消息处理
│   ├── onboarding.ts                # 引导配置
│   ├── probe.ts                     # 配置检测
│   ├── resolve-allowlist.ts         # 白名单解析
│   ├── crypto.ts                    # 加解密工具
│   ├── types.ts                     # 类型定义
│   └── errors.ts                    # 错误处理
└── test/
    ├── channel.test.ts
    └── crypto.test.ts
```

### 3.2 核心模块设计

#### 3.2.1 Channel Plugin (channel.ts)

```typescript
import type { ChannelPlugin, PandaConfig } from "pandabot/plugin-sdk";
import {
  buildChannelConfigSchema,
  DEFAULT_ACCOUNT_ID,
  WecomConfigSchema,
  PAIRING_APPROVED_MESSAGE,
} from "pandabot/plugin-sdk";

type ResolvedWecomAccount = {
  accountId: string;
  enabled: boolean;
  configured: boolean;
};

export const wecomPlugin: ChannelPlugin<ResolvedWecomAccount> = {
  id: "wecom",
  meta: {
    id: "wecom",
    label: "企业微信",
    selectionLabel: "企业微信（Enterprise WeChat）",
    docsPath: "/channels/wecom",
    docsLabel: "wecom",
    blurb: "企业微信应用集成；支持单聊、群聊、应用消息。",
    aliases: ["wechat-work", "wxwork"],
    order: 65,
  },
  
  onboarding: wecomOnboardingAdapter,
  
  pairing: {
    idLabel: "wecomUserId",
    normalizeAllowEntry: (entry) => entry.replace(/^(wecom|user):/i, ""),
    notifyApproval: async ({ cfg, id }) => {
      await sendMessageWecom({
        cfg,
        to: id,
        text: PAIRING_APPROVED_MESSAGE,
      });
    },
  },
  
  capabilities: {
    chatTypes: ["direct", "channel"],
    polls: false,
    threads: false,
    media: true,
  },
  
  agentPrompt: {
    messageToolHints: () => [
      "- 企业微信支持文本、图文、Markdown 卡片等消息类型",
      "- 目标格式：`user:UserID` (单聊) 或 `chat:ChatID` (群聊)",
    ],
  },
  
  reload: { configPrefixes: ["channels.wecom"] },
  
  configSchema: buildChannelConfigSchema(WecomConfigSchema),
  
  config: {
    listAccountIds: () => [DEFAULT_ACCOUNT_ID],
    
    resolveAccount: (cfg) => ({
      accountId: DEFAULT_ACCOUNT_ID,
      enabled: cfg.channels?.wecom?.enabled !== false,
      configured: Boolean(resolveWecomCredentials(cfg.channels?.wecom)),
    }),
    
    defaultAccountId: () => DEFAULT_ACCOUNT_ID,
    
    setAccountEnabled: ({ cfg, enabled }) => ({
      ...cfg,
      channels: {
        ...cfg.channels,
        wecom: { ...cfg.channels?.wecom, enabled },
      },
    }),
  },
  
  pairing: {
    // ... (白名单管理)
  },
  
  outbound: wecomOutbound,
  
  gateway: {
    routes: [
      {
        method: "POST",
        path: "/wecom/callback",
        handler: wecomCallbackHandler,
      },
      {
        method: "GET",
        path: "/wecom/callback",
        handler: wecomVerifyHandler, // 企业微信 URL 验证
      },
    ],
  },
  
  probe: probeWecom,
};
```

#### 3.2.2 Access Token 管理 (token.ts)

```typescript
/**
 * 企业微信 access_token 管理
 * 
 * access_token 有效期为 7200 秒，需要缓存并自动刷新
 */

interface TokenCache {
  accessToken: string;
  expiresAt: number;
}

const tokenCaches = new Map<string, TokenCache>();

export async function getAccessToken(config: WecomConfig): Promise<string> {
  const cacheKey = `${config.corpId}:${config.agentId}`;
  const cached = tokenCaches.get(cacheKey);
  
  // 提前 5 分钟刷新
  if (cached && cached.expiresAt > Date.now() + 300_000) {
    return cached.accessToken;
  }
  
  // 请求新 token
  const response = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.corpId}&corpsecret=${config.secret}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get access_token: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.errcode !== 0) {
    throw new Error(`WeChat API error: ${data.errmsg} (${data.errcode})`);
  }
  
  const token = data.access_token;
  const expiresIn = data.expires_in || 7200;
  
  tokenCaches.set(cacheKey, {
    accessToken: token,
    expiresAt: Date.now() + expiresIn * 1000,
  });
  
  return token;
}
```

#### 3.2.3 发送消息 (send.ts)

```typescript
export async function sendMessageWecom(params: {
  cfg: PandaConfig;
  to: string; // user:UserID 或 chat:ChatID
  text?: string;
  markdown?: string;
  image?: { mediaId: string };
  accountId?: string;
}): Promise<void> {
  const config = resolveWecomConfig(params.cfg, params.accountId);
  const accessToken = await getAccessToken(config);
  
  const { type, id } = parseTarget(params.to);
  
  const message: any = {
    agentid: config.agentId,
  };
  
  if (type === "user") {
    message.touser = id;
  } else if (type === "chat") {
    message.chatid = id;
  }
  
  // 构造消息内容
  if (params.text) {
    message.msgtype = "text";
    message.text = { content: params.text };
  } else if (params.markdown) {
    message.msgtype = "markdown";
    message.markdown = { content: params.markdown };
  }
  
  // 发送
  const response = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    }
  );
  
  const result = await response.json();
  
  if (result.errcode !== 0) {
    throw new Error(`Failed to send message: ${result.errmsg}`);
  }
}

function parseTarget(to: string): { type: "user" | "chat"; id: string } {
  if (to.startsWith("user:")) {
    return { type: "user", id: to.slice(5) };
  } else if (to.startsWith("chat:")) {
    return { type: "chat", id: to.slice(5) };
  }
  // 默认当作 user
  return { type: "user", id: to };
}
```

#### 3.2.4 消息监控 (monitor.ts)

企业微信支持两种消息接收模式：

**模式一：轮询模式（推荐用于开发）**

```typescript
import type { Request, Response } from "express";
import { parseInboundMessage } from "./inbound.js";

/**
 * 企业微信轮询监控
 * 类似 Telegram 的 getUpdates，主动拉取消息
 */
export async function monitorWecomPolling(opts: {
  config: WecomConfig;
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
}): Promise<void> {
  const { config, abortSignal } = opts;
  const pollInterval = config.polling?.interval ?? 3000; // 默认3秒
  let lastSeq = 0; // 消息序号，用于增量拉取
  
  while (!abortSignal?.aborted) {
    try {
      const accessToken = await getAccessToken(config);
      
      // 使用客服会话接口拉取消息
      const response = await fetch(
        `https://qyapi.weixin.qq.com/cgi-bin/kf/sync_msg?access_token=${accessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cursor: lastSeq.toString(),
            token: "",
            limit: 100,
          }),
        }
      );
      
      if (!response.ok) {
        console.error(`WeChat polling failed: ${response.status}`);
        await sleep(pollInterval);
        continue;
      }
      
      const data = await response.json();
      
      if (data.errcode !== 0) {
        console.error(`WeChat API error: ${data.errmsg} (${data.errcode})`);
        await sleep(pollInterval);
        continue;
      }
      
      // 处理新消息
      const messages = data.msg_list || [];
      for (const msg of messages) {
        try {
          // 解析消息
          const parsedMsg = await parsePollingMessage(msg);
          
          // 检查白名单
          const allowed = await checkAllowlist(parsedMsg.from, config);
          if (!allowed) {
            console.warn(`Message from ${parsedMsg.from} not in allowlist`);
            continue;
          }
          
          // 构造 MsgContext 并触发 Agent
          const msgContext = buildMsgContext(parsedMsg, config);
          await triggerAgent(msgContext);
        } catch (err) {
          console.error("Failed to process message:", err);
        }
      }
      
      // 更新 cursor
      if (data.next_cursor) {
        lastSeq = parseInt(data.next_cursor);
      }
      
      // 如果有新消息，立即拉取下一批；否则等待轮询间隔
      const hasMore = data.has_more === 1;
      if (!hasMore) {
        await sleep(pollInterval);
      }
    } catch (error) {
      console.error("WeChat polling error:", error);
      await sleep(pollInterval);
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function parsePollingMessage(msg: any): ParsedMessage {
  // 解析客服消息格式
  return {
    msgId: msg.msgid,
    from: msg.external_userid || msg.open_kfid,
    content: msg.text?.content || "",
    msgType: msg.msgtype,
    timestamp: msg.send_time,
  };
}
```

**模式二：回调模式（推荐用于生产）**

```typescript
/**
 * 企业微信 URL 验证（GET 请求）
 */
export async function wecomVerifyHandler(req: Request, res: Response) {
  const { msg_signature, timestamp, nonce, echostr } = req.query;
  
  const config = resolveWecomConfig(loadConfig());
  
  try {
    const decrypted = decryptMessage({
      signature: msg_signature as string,
      timestamp: timestamp as string,
      nonce: nonce as string,
      encryptedMsg: echostr as string,
      token: config.token,
      encodingAesKey: config.encodingAesKey,
    });
    
    res.send(decrypted);
  } catch (error) {
    console.error("WeChat URL verification failed:", error);
    res.status(400).send("Verification failed");
  }
}

/**
 * 企业微信消息回调（POST 请求）
 */
export async function wecomCallbackHandler(req: Request, res: Response) {
  const { msg_signature, timestamp, nonce } = req.query;
  const body = req.body; // 需要 body-parser 中间件
  
  const config = resolveWecomConfig(loadConfig());
  
  try {
    // 1. 解密消息
    const decrypted = decryptMessage({
      signature: msg_signature as string,
      timestamp: timestamp as string,
      nonce: nonce as string,
      encryptedMsg: body, // XML 格式
      token: config.token,
      encodingAesKey: config.encodingAesKey,
    });
    
    // 2. 解析消息
    const message = await parseInboundMessage(decrypted);
    
    // 3. 检查白名单
    const allowed = await checkAllowlist(message.from, config);
    if (!allowed) {
      console.warn(`Message from ${message.from} not in allowlist`);
      res.send("success");
      return;
    }
    
    // 4. 构造 MsgContext 并触发 Agent
    const msgContext = buildMsgContext(message, config);
    await triggerAgent(msgContext);
    
    res.send("success");
  } catch (error) {
    console.error("WeChat callback error:", error);
    res.status(500).send("Internal error");
  }
}

/**
 * 主监控入口，根据配置选择模式
 */
export async function monitorWecom(opts: {
  config: WecomConfig;
  runtime?: RuntimeEnv;
  abortSignal?: AbortSignal;
}): Promise<void> {
  const mode = opts.config.mode ?? "polling";
  
  if (mode === "polling") {
    return monitorWecomPolling(opts);
  } else {
    // Webhook 模式在 gateway 中通过路由处理
    // 这里只需要保持 Promise 不 resolve，直到 abort
    return new Promise((resolve) => {
      opts.abortSignal?.addEventListener("abort", () => resolve());
    });
  }
}
```

#### 3.2.5 加解密 (crypto.ts)

企业微信使用 AES-256-CBC 加密消息，需要实现：

```typescript
import crypto from "node:crypto";

export function decryptMessage(params: {
  signature: string;
  timestamp: string;
  nonce: string;
  encryptedMsg: string;
  token: string;
  encodingAesKey: string;
}): string {
  // 1. 验签
  const msgSignature = computeSignature(
    params.token,
    params.timestamp,
    params.nonce,
    params.encryptedMsg
  );
  
  if (msgSignature !== params.signature) {
    throw new Error("Signature verification failed");
  }
  
  // 2. Base64 解码
  const aesKey = Buffer.from(params.encodingAesKey + "=", "base64");
  const encryptedBuffer = Buffer.from(params.encryptedMsg, "base64");
  
  // 3. AES 解密
  const iv = aesKey.slice(0, 16);
  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);
  decipher.setAutoPadding(false);
  
  let decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);
  
  // 4. 去除填充
  decrypted = PKCS7Decode(decrypted);
  
  // 5. 解析内容
  const msgLen = decrypted.readUInt32BE(16);
  const msg = decrypted.slice(20, 20 + msgLen).toString("utf8");
  
  return msg;
}

function computeSignature(
  token: string,
  timestamp: string,
  nonce: string,
  msg: string
): string {
  const arr = [token, timestamp, nonce, msg].sort();
  const str = arr.join("");
  return crypto.createHash("sha1").update(str).digest("hex");
}

function PKCS7Decode(buffer: Buffer): Buffer {
  const pad = buffer[buffer.length - 1];
  return buffer.slice(0, buffer.length - pad);
}
```

#### 3.2.6 Onboarding (onboarding.ts)

```typescript
import { intro, text, confirm, outro } from "@clack/prompts";

export async function wecomOnboardingAdapter(params: {
  cfg: PandaConfig;
}): Promise<PandaConfig> {
  intro("企业微信配置向导");
  
  const corpId = await text({
    message: "请输入企业 ID (CorpID):",
    placeholder: "ww1234567890abcdef",
    validate: (value) => {
      if (!value.trim()) return "CorpID 不能为空";
      return undefined;
    },
  });
  
  const agentId = await text({
    message: "请输入应用 ID (AgentID):",
    placeholder: "1000002",
    validate: (value) => {
      if (!value.trim()) return "AgentID 不能为空";
      return undefined;
    },
  });
  
  const secret = await text({
    message: "请输入应用 Secret:",
    placeholder: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    validate: (value) => {
      if (!value.trim()) return "Secret 不能为空";
      return undefined;
    },
  });
  
  const token = await text({
    message: "请输入回调 Token:",
    placeholder: "用于消息验签",
  });
  
  const encodingAesKey = await text({
    message: "请输入 EncodingAESKey:",
    placeholder: "用于消息加解密（43位字符）",
  });
  
  const callbackUrl = await text({
    message: "请输入回调 URL:",
    placeholder: "https://your-domain.com/wecom/callback",
  });
  
  // 测试配置
  const shouldTest = await confirm({
    message: "是否测试配置?",
    initialValue: true,
  });
  
  if (shouldTest) {
    try {
      await testWecomConfig({
        corpId,
        agentId,
        secret,
      });
      console.log("✅ 配置测试成功");
    } catch (error) {
      console.error("❌ 配置测试失败:", error);
      const continueAnyway = await confirm({
        message: "仍要保存配置吗?",
        initialValue: false,
      });
      if (!continueAnyway) {
        throw new Error("配置已取消");
      }
    }
  }
  
  outro("企业微信配置完成！");
  
  return {
    ...params.cfg,
    channels: {
      ...params.cfg.channels,
      wecom: {
        enabled: true,
        corpId,
        agentId: Number(agentId),
        secret,
        token,
        encodingAesKey,
        callbackUrl,
      },
    },
  };
}

async function testWecomConfig(config: {
  corpId: string;
  agentId: string;
  secret: string;
}): Promise<void> {
  // 尝试获取 access_token
  const response = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${config.corpId}&corpsecret=${config.secret}`
  );
  
  const data = await response.json();
  
  if (data.errcode !== 0) {
    throw new Error(`API 错误: ${data.errmsg} (${data.errcode})`);
  }
}
```

## 四、配置 Schema

### 4.1 Zod Schema

```typescript
// src/config/zod-schema.wecom.ts

import { z } from "zod";

export const WecomPollingConfigSchema = z.object({
  interval: z.number().min(1000).max(60000).optional().default(3000), // 1-60秒
  timeout: z.number().min(5000).max(120000).optional().default(30000), // 5-120秒
});

export const WecomWebhookConfigSchema = z.object({
  url: z.string().url("回调 URL 格式错误").optional(),
  token: z.string().min(1, "Token 不能为空"),
  encodingAesKey: z.string().length(43, "EncodingAESKey 必须为 43 位"),
});

export const WecomConfigSchema = z.object({
  enabled: z.boolean().optional(),
  mode: z.enum(["polling", "webhook"]).optional().default("polling"),
  corpId: z.string().min(1, "CorpID 不能为空"),
  agentId: z.number().int().positive("AgentID 必须为正整数"),
  secret: z.string().min(1, "Secret 不能为空"),
  
  // 轮询模式配置
  polling: WecomPollingConfigSchema.optional(),
  
  // 回调模式配置（仅在 mode="webhook" 时必需）
  webhook: WecomWebhookConfigSchema.optional(),
  
  allowFrom: z.array(z.string()).optional(),
  denyFrom: z.array(z.string()).optional(),
}).refine(
  (data) => {
    // 如果是 webhook 模式，必须提供 webhook 配置
    if (data.mode === "webhook") {
      return data.webhook?.token && data.webhook?.encodingAesKey;
    }
    return true;
  },
  {
    message: "Webhook mode requires webhook.token and webhook.encodingAesKey",
  }
);

export type WecomConfig = z.infer<typeof WecomConfigSchema>;
```

### 4.2 配置示例

#### 4.2.1 轮询模式（推荐用于开发）

```yaml
channels:
  wecom:
    enabled: true
    mode: "polling"  # 轮询模式，无需公网 IP
    corpId: "ww1234567890abcdef"
    agentId: 1000002
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    polling:
      interval: 3000    # 每3秒拉取一次消息
      timeout: 30000    # 请求超时30秒
    allowFrom:
      - "user:UserID1"
      - "user:UserID2"
```

#### 4.2.2 回调模式（推荐用于生产）

```yaml
channels:
  wecom:
    enabled: true
    mode: "webhook"  # 回调模式，需要公网 IP + HTTPS
    corpId: "ww1234567890abcdef"
    agentId: 1000002
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    webhook:
      url: "https://your-domain.com/wecom/callback"
      token: "your_callback_token"
      encodingAesKey: "your_43_char_encoding_aes_key"
    allowFrom:
      - "user:UserID1"
      - "user:UserID2"
```

#### 4.2.3 混合模式（开发/生产分离）

```yaml
# 开发环境 (dev.yaml)
channels:
  wecom:
    enabled: true
    mode: "polling"
    corpId: "ww1234567890abcdef"
    agentId: 1000002
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# 生产环境 (prod.yaml)
channels:
  wecom:
    enabled: true
    mode: "webhook"
    corpId: "ww1234567890abcdef"
    agentId: 1000002
    secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    webhook:
      url: "https://prod.your-domain.com/wecom/callback"
      token: "${WECOM_WEBHOOK_TOKEN}"
      encodingAesKey: "${WECOM_ENCODING_AES_KEY}"
```

## 五、部署与配置

### 5.1 企业微信应用创建

1. 登录企业微信管理后台
2. 进入「应用管理」→「自建」→「创建应用」
3. 记录「AgentId」和「Secret」
4. 配置「接收消息」回调 URL（仅回调模式需要）
5. 配置「企业可信 IP」（服务器 IP）

### 5.2 两种接入模式对比

#### 5.2.1 轮询模式 vs 回调模式

与 Telegram 类似，企业微信也支持两种消息接收方式：

| 特性 | 轮询模式 (Polling) | 回调模式 (Webhook) |
|------|------------------|------------------|
| **原理** | 主动拉取消息 | 企业微信推送消息 |
| **网络要求** | ❌ 无需公网 IP | ✅ 需要公网 IP + HTTPS |
| **实时性** | 轮询间隔决定(1-5秒) | 实时推送 |
| **开发环境** | ✅ 本地直接可用 | ❌ 需要内网穿透 |
| **生产环境** | ⚠️ 频繁请求 | ✅ 推荐使用 |
| **配置复杂度** | 低 | 中 |
| **Telegram对比** | ✅ 使用 getUpdates API | ✅ 使用 setWebhook API |

**关键发现**：
- **Telegram 为什么能在本地工作**：因为 Pandabot 默认使用轮询模式（polling），通过主动调用 `getUpdates` API 拉取消息，无需公网 IP
- **企业微信也可以轮询**：企业微信提供了类似的 API，可以实现轮询模式

#### 5.2.2 企业微信轮询模式实现

企业微信虽然官方文档主要介绍回调模式，但实际上可以通过以下方式实现轮询：

**方案一：使用「获取会话内容存档」API** (推荐)
```typescript
// 定期拉取会话消息
async function pollMessages() {
  const messages = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/msgaudit/groupchat?access_token=${token}`,
    {
      method: 'POST',
      body: JSON.stringify({
        roomid: 'roomid',
        seq: lastSeq,
      }),
    }
  );
  // 处理消息...
}
```

**方案二：客服会话接口轮询**
```typescript
// 适用于客服场景
async function pollKfMessages() {
  const messages = await fetch(
    `https://qyapi.weixin.qq.com/cgi-bin/kf/sync_msg?access_token=${token}`,
    {
      method: 'POST',
      body: JSON.stringify({
        cursor: lastCursor,
        token: syncToken,
      }),
    }
  );
}
```

**方案三：混合模式** (推荐用于开发)
- 开发环境：使用轮询模式，方便本地调试
- 生产环境：使用回调模式，提升性能和实时性

### 5.3 回调模式配置（可选）

**仅在需要使用回调模式时配置**：

企业微信回调 URL 要求：
- 使用 HTTPS（生产环境）
- 公网可访问
- 响应 GET 请求的 URL 验证

**开发环境**：可使用 ngrok 等工具内网穿透

```bash
ngrok http 3000
# 将生成的 URL 填入企业微信后台
```

### 5.4 防火墙配置

企业微信的回调请求来自以下 IP 段，需要在防火墙中放行：

- `183.3.226.0/24`
- `183.3.227.0/24`
- `...` （参见企业微信官方文档）

### 5.5 推荐配置策略

```yaml
channels:
  wecom:
    enabled: true
    mode: "polling"  # 或 "webhook"
    corpId: "ww1234567890abcdef"
    agentId: 1000002
    secret: "xxxxx"
    
    # 轮询模式配置
    polling:
      interval: 3000  # 3秒轮询一次
      timeout: 30000  # 请求超时
    
    # 回调模式配置（可选）
    webhook:
      url: "https://your-domain.com/wecom/callback"
      token: "your_callback_token"
      encodingAesKey: "your_43_char_key"
```

## 六、测试计划

### 6.1 单元测试

```typescript
// test/crypto.test.ts
describe("WeChat Crypto", () => {
  it("should decrypt message correctly", () => {
    const decrypted = decryptMessage({
      signature: "...",
      timestamp: "...",
      nonce: "...",
      encryptedMsg: "...",
      token: "...",
      encodingAesKey: "...",
    });
    expect(decrypted).toBe("expected content");
  });
});

// test/send.test.ts
describe("sendMessageWecom", () => {
  it("should send text message", async () => {
    await sendMessageWecom({
      cfg: mockConfig,
      to: "user:UserID",
      text: "Hello",
    });
    // 验证 API 调用
  });
});
```

### 6.2 集成测试

1. **配置测试**：验证 onboarding 流程
2. **消息接收测试**：模拟企业微信回调
3. **消息发送测试**：验证各类消息格式
4. **白名单测试**：验证 allowFrom/denyFrom

### 6.3 E2E 测试

1. 在企业微信中发送消息
2. Agent 接收并处理
3. 回复消息显示在企业微信中

## 七、开发里程碑

### Week 1：基础框架

- [x] 项目结构搭建
- [ ] ChannelPlugin 骨架实现
- [ ] 配置 Schema 定义
- [ ] 加解密模块实现

### Week 2：核心功能

- [ ] Token 管理
- [ ] 发送消息 API
- [ ] 回调处理
- [ ] 入站消息解析

### Week 3：完善与测试

- [ ] Onboarding 流程
- [ ] 白名单管理
- [ ] Probe 检测
- [ ] 单元测试与集成测试

## 八、注意事项

### 8.1 限流处理

企业微信 API 有频率限制，需要实现：
- 消息发送限流（100次/分钟）
- 失败重试（指数退避）
- 错误码处理（token 过期自动刷新）

### 8.2 安全注意

- Secret 不要硬编码，使用环境变量
- 回调消息必须验签
- 敏感信息需加密存储

### 8.3 兼容性

- 企业微信 API 版本变化
- 不同企业版本的功能差异
- 国际版（WeChat Work）与国内版的区别

## 九、参考文档

- [企业微信 API 文档](https://developer.work.weixin.qq.com/document/)
- [消息加解密说明](https://developer.work.weixin.qq.com/document/path/90930)
- [应用管理指南](https://developer.work.weixin.qq.com/document/path/90665)

## 十、总结

企业微信集成方案完全遵循 Pandabot 的 ChannelPlugin 架构，通过参考 Telegram 和 MS Teams 的实现，提供了两种灵活的接入方式：

### 关键特性

1. **双模式支持**
   - **轮询模式**：类似 Telegram polling，无需公网 IP，适合开发环境
   - **回调模式**：高性能推送，适合生产环境

2. **参考实现对比**

| 特性 | Telegram | MS Teams | 企业微信 |
|------|----------|----------|---------|
| 轮询支持 | ✅ getUpdates | ❌ 仅 Webhook | ✅ 客服API轮询 |
| 回调支持 | ✅ setWebhook | ✅ Bot Framework | ✅ 应用回调 |
| 加密方式 | 无需加密 | TLS | AES-256-CBC |
| 开发友好度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

3. **实现要点**
   - ✅ 加解密处理：正确实现企业微信的 AES-256-CBC 加解密
   - ✅ Token 管理：缓存 access_token 并自动刷新
   - ✅ 双模式监控：轮询模式 + 回调模式灵活切换
   - ✅ 限流控制：遵守 API 频率限制

### 开发建议

**开发阶段**：
```bash
# 使用轮询模式，无需配置公网域名
panda channels add wecom --mode polling
```

**生产部署**：
```bash
# 切换到回调模式，提升性能
panda channels configure wecom --mode webhook --url https://your-domain.com/wecom/callback
```

### 预计工期

- **基础轮询模式**：1.5-2 周（无需加解密，优先完成）
- **完整回调模式**：0.5-1 周（加解密实现）
- **总计**：2-3 周达到生产可用状态

### 技术优势

通过引入轮询模式，企业微信集成的开发体验与 Telegram 一致，大幅降低了开发和调试的复杂度，同时保留了生产环境的高性能回调模式选项。
