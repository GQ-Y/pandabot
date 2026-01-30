# Pandabot 国产化开发路线图

## 项目概述

基于对 Pandabot 项目的全面分析，本文档制定了完整的国产化开发计划，包括企业微信集成、Skills/MCP Store 系统、多智能体集群调度以及国产 LLM 适配等四大核心模块。

## 一、项目架构分析

### 1.1 核心架构特点

Pandabot 采用插件化架构，核心组件包括：

- **Plugin SDK**：插件系统，支持 Extensions 和 Skills
- **Gateway**：统一网关，处理所有入站/出站消息
- **Agent System**：基于 `@mariozechner/pi-coding-agent` 的智能体系统
- **Config System**：基于 Zod 的配置验证系统
- **Channels**：多渠道支持（Telegram、Discord、Slack、MS Teams 等）

### 1.2 现有扩展机制

- **Extensions**：位于 `extensions/` 目录，每个扩展包含 `pandabot.plugin.json`
- **Skills**：位于 `skills/` 目录，使用 `SKILL.md` 定义
- **MCP Servers**：通过 MCP 协议集成外部工具
- **Channels**：通过 ChannelPlugin 接口注册新渠道

## 二、国产化开发四大模块

### 2.1 模块一：企业微信渠道集成

**目标**：新增企业微信作为消息渠道，支持单聊、群聊、应用消息与回调。

**参考实现**：`extensions/msteams/`

**开发要点**：
1. 创建 `extensions/wecom/` 目录结构
2. 实现 ChannelPlugin 接口
3. 对接企业微信开放平台 API
4. 实现回调验签与消息解析
5. 支持 access_token 管理与自动刷新

**关键文件**：
```
extensions/wecom/
├── package.json
├── pandabot.plugin.json
├── index.ts                    # 注册 channel
├── src/
│   ├── channel.ts             # ChannelPlugin 实现
│   ├── token.ts               # access_token 管理
│   ├── send.ts                # 发送消息 API
│   ├── monitor.ts             # 回调处理
│   ├── inbound.ts             # 入站消息解析
│   ├── outbound.ts            # 出站消息处理
│   ├── onboarding.ts          # 引导配置
│   ├── probe.ts               # 配置检测
│   └── resolve-allowlist.ts   # 白名单解析
```

**优先级**：P0  
**预估工期**：2-3周

### 2.2 模块二：Skills/MCP Store 系统

**目标**：构建一个 Skills 和 MCP 收录平台，支持用户自主提交和自动安装。

#### 2.2.1 Store 后端系统

**技术栈建议**：
- **Framework**：Hono (已在项目中使用)
- **Database**：SQLite (轻量级) 或 PostgreSQL
- **Storage**：文件系统 / OSS
- **Auth**：无需注册，基于提交审核机制

**核心功能**：
1. **Skills 收录**
   - 提交 SKILL.md 及相关文件
   - 管理后台审核
   - 版本管理
   - 搜索与分类

2. **MCP 收录**
   - 提交 MCP Server 信息
   - 配置模板管理
   - 依赖检查

3. **API 接口**
   ```typescript
   GET  /api/skills/search?q={keyword}
   GET  /api/skills/{id}
   POST /api/skills/submit
   GET  /api/mcps/search?q={keyword}
   GET  /api/mcps/{id}
   POST /api/mcps/submit
   ```

#### 2.2.2 Pandabot 集成

**实现位置**：`src/agents/skills/` 和 `src/plugins/`

**核心功能**：
1. **自动查找**
   - Skill 未找到时查询 Store API
   - MCP 未安装时查询 Store API
   
2. **询问安装**
   - CLI：使用 `@clack/prompts` 询问用户
   - Gateway：推送确认消息到前端
   
3. **自动安装**
   - Skills：下载到 `~/.pandabot/skills/` 或 workspace
   - MCP：执行安装脚本并更新配置

**关键代码修改**：
```typescript
// src/agents/skills/config.ts
async function resolveSkillNotFound(skillName: string) {
  // 1. 查询 Store
  const result = await fetch(`${STORE_URL}/api/skills/search?q=${skillName}`);
  
  // 2. 询问用户
  const confirmed = await promptUserToInstall(result);
  
  // 3. 安装
  if (confirmed) {
    await installSkillFromStore(result.id);
  }
}
```

**优先级**：P0  
**预估工期**：3-4周

### 2.3 模块三：多智能体集群调度

**目标**：让 Pandabot 能够接收复杂任务，自动拆解并并行调度多个子 Agent 执行。

**现有基础**：
- ✅ `sessions_spawn` 工具（子 Agent 生成）
- ✅ `subagent-registry.ts`（子 Agent 注册与管理）
- ✅ `broadcast` 机制（多 Agent 并行/串行）

#### 2.3.1 指挥官 Agent 模式

**实现思路**：
1. **任务拆解 Prompt**
   - 在 System Prompt 中指示 Agent 输出结构化任务列表
   - 格式：JSON 数组，每项包含 task、label、agentId、model

2. **并行调度**
   - 解析 Agent 输出的任务列表
   - 使用 `Promise.all` + `sessions_spawn` 并行执行
   - 使用 `subagent-registry` 追踪状态

3. **结果汇总**
   - 等待所有子任务完成
   - 将结果注入指挥官上下文
   - 生成最终回复

**实现位置**：`src/agents/coordinator.ts`

**核心代码框架**：
```typescript
export async function runCoordinatorMode(params: {
  task: string;
  sessionKey: string;
  channel?: string;
}): Promise<CoordinatorResult> {
  // 1. 运行指挥官 Agent，获取任务列表
  const tasks = await runCoordinatorAgent(params);
  
  // 2. 并行 spawn 子任务
  const spawnPromises = tasks.map(task => 
    spawnSubagentTask({
      task: task.description,
      label: task.label,
      agentId: task.agentId,
      model: task.model,
    })
  );
  
  // 3. 等待所有任务完成
  const results = await Promise.all(spawnPromises);
  
  // 4. 汇总结果
  return aggregateResults(results);
}
```

**配置示例**：
```yaml
agents:
  coordinator:
    enabled: true
    maxConcurrentTasks: 5
    taskTimeoutSeconds: 300
    model: "anthropic/claude-3-5-sonnet"
```

**优先级**：P1  
**预估工期**：2-3周

### 2.4 模块四：国产 LLM 适配与余额监控

**目标**：集成主流国产 LLM，并实现余额监控与动态调度。

详见 `domestic-development-spec.md` 第五章。

**核心任务**：
1. 新增 Provider 配置（DeepSeek、通义千问、智谱 AI 等）
2. 实现余额检查器（各厂商 API）
3. 实现余额缓存与监控服务
4. 集成到 model-selection 流程

**优先级**：P0  
**预估工期**：3-4周

## 三、开发路线图

### Phase 1：基础调研与准备（Week 1-2）

- [x] 项目架构分析
- [ ] 企业微信 API 调研
- [ ] 国产 LLM API 调研
- [ ] Store 系统技术方案设计
- [ ] 制定详细开发计划

### Phase 2：核心模块开发（Week 3-8）

**Week 3-4：企业微信集成**
- [ ] 创建 `extensions/wecom/` 基础结构
- [ ] 实现回调验签与消息解析
- [ ] 实现 token 管理
- [ ] 实现发送消息 API
- [ ] 测试单聊、群聊场景

**Week 5-6：国产 LLM 集成**
- [ ] 添加 DeepSeek、通义千问、智谱 AI provider
- [ ] 实现余额缓存机制
- [ ] 实现 3 个厂商的余额检查器
- [ ] 测试模型调用与余额查询

**Week 7-8：多智能体调度**
- [ ] 实现 Coordinator Agent 逻辑
- [ ] 集成 sessions_spawn 并行调度
- [ ] 实现结果汇总机制
- [ ] 测试任务拆解与执行

### Phase 3：Store 系统开发（Week 9-12）

**Week 9-10：Store 后端**
- [ ] 设计数据库 Schema
- [ ] 实现 Skills/MCP 提交 API
- [ ] 实现搜索与查询 API
- [ ] 实现管理后台

**Week 11-12：Pandabot 集成**
- [ ] 实现自动查找逻辑
- [ ] 实现用户确认流程
- [ ] 实现自动安装功能
- [ ] 端到端测试

### Phase 4：完善与优化（Week 13-14）

- [ ] 余额监控服务完善
- [ ] 告警机制实现
- [ ] CLI 命令完善
- [ ] 文档编写
- [ ] 性能测试与优化
- [ ] 安全审计

## 四、技术风险与应对

### 4.1 企业微信集成

**风险**：
- 回调 URL 需公网可访问
- access_token 有效期管理
- 限流与重试机制

**应对**：
- 提供 ngrok/内网穿透指引
- 实现 token 自动刷新与缓存
- 参考 MS Teams 的限流处理逻辑

### 4.2 余额监控

**风险**：
- 各厂商 API 不统一
- 限流可能导致检查失败
- 缓存过期策略

**应对**：
- 设计通用的 BalanceChecker 接口
- 实现指数退避重试
- 可配置的 TTL 和阈值

### 4.3 多智能体调度

**风险**：
- 任务拆解可能不准确
- 并发过多导致资源耗尽
- 子任务超时处理

**应对**：
- 优化 Coordinator Prompt
- 限制最大并发数
- 实现超时自动终止

### 4.4 Store 系统

**风险**：
- 恶意提交与安全审核
- 版本兼容性管理
- 分发稳定性

**应对**：
- 实现人工审核机制
- 版本号强制校验
- CDN 加速与备份

## 五、测试策略

### 5.1 单元测试

- 所有新增模块编写单元测试
- 覆盖率目标：> 70%
- 使用 Vitest 框架

### 5.2 集成测试

- 企业微信端到端消息流程
- Store 系统 API 集成
- 多智能体调度场景

### 5.3 性能测试

- 余额监控服务性能
- 多智能体并发调度
- Store API 响应时间

## 六、文档与培训

### 6.1 开发文档

- [ ] 企业微信集成指南
- [ ] Store 系统 API 文档
- [ ] 多智能体使用指南
- [ ] 国产 LLM 配置手册

### 6.2 用户文档

- [ ] 企业微信快速开始
- [ ] Skills/MCP 安装指南
- [ ] 多智能体使用示例
- [ ] 余额监控配置

## 七、总结

国产化开发计划涵盖四大核心模块，预计总工期 12-14 周。各模块按优先级依次推进：

1. **P0 任务**（6-8周）：企业微信集成、国产 LLM 适配、Store 系统
2. **P1 任务**（2-3周）：多智能体调度、余额监控服务
3. **P2 任务**（1-2周）：完善与优化

建议采用敏捷开发模式，每 2 周一个迭代，持续交付可用功能。
