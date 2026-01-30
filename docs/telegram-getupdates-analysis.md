# Telegram getUpdates API 详解

## 一、能拉取哪些消息？

根据 Pandabot 的实现（`src/telegram/allowed-updates.ts`），Telegram getUpdates API **支持拉取以下所有类型的消息**：

### 1.1 支持的更新类型

```typescript
// 基于 grammy 的 API_CONSTANTS.DEFAULT_UPDATE_TYPES
const updates = [
  "message",              // ✅ 普通消息
  "edited_message",       // ✅ 编辑的消息
  "channel_post",         // ✅ 频道消息
  "edited_channel_post",  // ✅ 编辑的频道消息
  "inline_query",         // ✅ 内联查询
  "chosen_inline_result", // ✅ 选中的内联结果
  "callback_query",       // ✅ 回调查询（按钮点击）
  "shipping_query",       // ✅ 物流查询
  "pre_checkout_query",   // ✅ 预结账查询
  "poll",                 // ✅ 投票
  "poll_answer",          // ✅ 投票答案
  "my_chat_member",       // ✅ Bot 在群组中的状态变化
  "chat_member",          // ✅ 群组成员变化
  "chat_join_request",    // ✅ 加群请求
  "message_reaction",     // ✅ 消息反应（Pandabot 额外添加）
];
```

### 1.2 覆盖的聊天类型

| 类型 | 支持 | 说明 |
|------|-----|------|
| **私聊 (DM)** | ✅ | 一对一消息 |
| **群组 (Group)** | ✅ | 普通群组和超级群组 |
| **频道 (Channel)** | ✅ | 公开和私有频道 |
| **论坛 (Forum)** | ✅ | 论坛话题（Topics）|

**结论**：getUpdates API 可以拉取**所有类型**的聊天消息！

## 二、频率限制

### 2.1 Telegram 官方限制

根据 Telegram Bot API 文档：

| 参数 | 限制 | Pandabot 配置 |
|------|------|--------------|
| **轮询超时** | 最长 60 秒 | 30 秒（`timeout: 30`）|
| **请求频率** | 无硬性限制 | 使用长轮询，实际接近实时 |
| **并发请求** | 单个 Bot 不能同时多个 getUpdates | 自动处理冲突（409错误）|

### 2.2 Pandabot 的实现细节

**长轮询机制**（`src/telegram/monitor.ts:31-50`）：

```typescript
{
  runner: {
    fetch: {
      timeout: 30,  // 👈 30秒长轮询
      allowed_updates: resolveTelegramAllowedUpdates(),
    },
    silent: true,
    maxRetryTime: 5 * 60 * 1000,  // 5分钟最大重试
    retryInterval: "exponential",  // 指数退避
  }
}
```

**工作原理**：
1. Bot 发起 getUpdates 请求，设置 `timeout=30`
2. Telegram 服务器**等待最多 30 秒**，如果有新消息立即返回
3. 如果 30 秒内无消息，返回空数组
4. Bot 收到响应后**立即发起下一次**请求

**实际效果**：
- ⚡ **接近实时**：新消息通常在 1 秒内送达
- 🔄 **高效**：无消息时服务器挂起，不占用资源
- 💪 **可靠**：自动重试网络错误

### 2.3 错误处理和重试

```typescript
// 409 冲突检测（多个实例同时轮询）
const isGetUpdatesConflict = (err) => {
  return err.error_code === 409 && 
         err.description.includes("getUpdates");
};

// 重启策略（网络错误时）
{
  initialMs: 2000,    // 首次 2 秒
  maxMs: 30_000,      // 最多 30 秒
  factor: 1.8,        // 指数增长
  jitter: 0.25,       // 25% 随机抖动
}
```

## 三、实际性能表现

### 3.1 消息延迟

| 场景 | 延迟 | 说明 |
|------|-----|------|
| **有新消息** | < 1 秒 | 长轮询立即返回 |
| **无新消息** | 30 秒一轮 | 等待超时后重新请求 |
| **高频消息** | 接近实时 | 持续处理，无等待 |

### 3.2 并发处理

```typescript
sink: {
  concurrency: resolveAgentMaxConcurrent(cfg),  // 可配置
}
```

- 支持**并发处理**多条消息
- 避免单条消息阻塞队列
- 可通过配置调整并发数

### 3.3 消息去重

Pandabot 实现了完善的消息处理机制：

1. **Media Group 缓冲**：多图消息聚合处理
2. **文本分片处理**：长文本自动合并
3. **回调去重**：防止重复处理按钮点击
4. **更新偏移管理**：持久化 update_id，避免重复拉取

## 四、与企业微信对比

| 特性 | Telegram getUpdates | 企业微信轮询 |
|------|-------------------|------------|
| **支持类型** | 私聊+群组+频道+论坛 | 私聊+群组（需不同API）|
| **长轮询** | ✅ 支持（30秒） | ⚠️ 需短轮询（3-5秒）|
| **实时性** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **资源消耗** | 低（长轮询） | 中（短轮询） |
| **复杂度** | 低 | 中 |
| **频率限制** | 无硬性限制 | 待确认 |

## 五、开发建议

### 5.1 Telegram 模式（已验证可行）

```yaml
channels:
  telegram:
    enabled: true
    botToken: "your_bot_token"
    # 无需配置轮询参数，使用默认长轮询
```

**优势**：
- ✅ 开箱即用
- ✅ 本地环境直接可用
- ✅ 接近实时推送
- ✅ 无需公网 IP

### 5.2 企业微信建议配置

```yaml
channels:
  wecom:
    mode: "polling"
    corpId: "xxx"
    agentId: 1000002
    secret: "xxx"
    polling:
      interval: 3000  # 👈 建议 3-5 秒
      timeout: 30000  # 请求超时
      api: "kf"       # 使用客服API轮询
```

**原因**：
- 企业微信不支持长轮询
- 需要主动短轮询
- 3秒间隔是延迟和性能的平衡点

## 六、FAQ

### Q1: getUpdates 会丢消息吗？

**不会**。通过 `offset` 参数实现增量拉取：
- 每次请求带上上次的最大 `update_id + 1`
- Telegram 保证按顺序返回所有更新
- Pandabot 持久化 offset，重启不丢失

### Q2: 多个实例同时运行会怎样？

会收到 **409 Conflict** 错误：
```
{
  "error_code": 409,
  "description": "Conflict: terminated by other getUpdates request"
}
```

Pandabot 会**自动重试**（`monitor.ts:176-194`）

### Q3: 长轮询会不会占用连接？

不会过度占用：
- 单个 HTTP 连接，30秒超时
- 有消息立即返回，释放连接
- 无消息等待后自动重连

### Q4: 能否调整轮询频率？

可以通过 grammY 的配置调整：
```typescript
runner: {
  fetch: {
    timeout: 30,  // 👈 可改为 10-60 之间
  }
}
```

但**不建议**改动，30秒是最佳实践。

## 七、总结

### Telegram getUpdates API 的优势

1. ✅ **全类型支持**：私聊、群组、频道、论坛全覆盖
2. ✅ **长轮询机制**：高效、实时、低资源消耗
3. ✅ **无硬性频率限制**：可持续轮询
4. ✅ **开发友好**：无需公网环境
5. ✅ **可靠性高**：增量拉取，不丢消息

### 对企业微信的启示

企业微信虽然不支持长轮询，但可以通过**短轮询**实现类似效果：
- 使用 3-5 秒的轮询间隔
- 使用客服 API（`sync_msg`）拉取消息
- 实现增量拉取机制（cursor）
- 在开发环境提供与 Telegram 一致的体验

---

**参考文档**：
- Telegram Bot API: https://core.telegram.org/bots/api#getupdates
- grammy 框架: https://grammy.dev/
- Pandabot 实现: `src/telegram/monitor.ts`
