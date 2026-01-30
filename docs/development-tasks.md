# Pandabot 国产化开发任务清单

## 📋 任务总览

- **总计**: 4大模块, 约60个任务
- **工期**: 12-14周
- **当前状态**: 准备阶段

## ✅ 准备阶段 (Week 1-2)

### 项目分析 ✅

- [x] 阅读 Pandabot 源代码
- [x] 分析项目架构
- [x] 确定技术方案
- [x] 编写设计文档

### 环境准备

- [ ] 开发团队组建
- [ ] 企业微信开发者账号申请
- [ ] 国产 LLM API Key 申请 (DeepSeek、通义千问、智谱 AI)
- [ ] 服务器环境准备
- [ ] Fork 代码仓库
- [ ] 搭建本地开发环境

## 🏢 模块一: 企业微信集成 (Week 3-4)

### Week 3: 基础框架

**文件创建** (2天)
- [ ] `extensions/wecom/package.json`
- [ ] `extensions/wecom/pandabot.plugin.json`
- [ ] `extensions/wecom/index.ts`
- [ ] `extensions/wecom/README.md`
- [ ] `extensions/wecom/src/types.ts`
- [ ] `extensions/wecom/src/errors.ts`

**加解密模块** (3天)
- [ ] `src/crypto.ts` - AES-256-CBC 解密
- [ ] `src/crypto.ts` - 签名验证
- [ ] `src/crypto.ts` - PKCS7 填充处理
- [ ] 单元测试 `test/crypto.test.ts`

**配置模块** (2天)
- [ ] `src/config/zod-schema.wecom.ts`
- [ ] 配置类型定义
- [ ] 配置验证逻辑

### Week 4: 核心功能

**Token 管理** (2天)
- [ ] `src/token.ts` - getAccessToken 实现
- [ ] Token 缓存机制
- [ ] Token 自动刷新
- [ ] 单元测试

**消息发送** (3天)
- [ ] `src/send.ts` - sendMessageWecom 实现
- [ ] 文本消息支持
- [ ] Markdown 消息支持
- [ ] 图片消息支持
- [ ] 目标解析 (user/chat)
- [ ] 限流处理
- [ ] 单元测试

**回调处理** (3天)
- [ ] `src/monitor.ts` - URL 验证 (GET)
- [ ] `src/monitor.ts` - 消息回调 (POST)
- [ ] `src/inbound.ts` - XML 解析
- [ ] `src/monitor-handler.ts` - 消息处理
- [ ] 白名单检查
- [ ] 单元测试

**其他模块** (2天)
- [ ] `src/channel.ts` - ChannelPlugin 实现
- [ ] `src/outbound.ts` - 出站消息处理
- [ ] `src/resolve-allowlist.ts` - 白名单解析
- [ ] `src/onboarding.ts` - 引导配置
- [ ] `src/probe.ts` - 配置检测

### 测试与文档 (Week 4 末)

- [ ] 集成测试
- [ ] E2E 测试
- [ ] API 文档
- [ ] 使用指南

**验收标准**:
- ✅ 能接收企业微信消息
- ✅ 能发送各类消息
- ✅ 白名单正常工作
- ✅ Onboarding 流程完整

---

## 🤖 模块二: 国产 LLM 集成 (Week 5-6)

### Week 5: Provider 配置

**DeepSeek** (1天)
- [ ] `src/agents/models-config.providers.ts` - buildDeepSeekProvider
- [ ] 模型配置 (deepseek-v3, deepseek-coder)
- [ ] 测试调用

**通义千问** (1天)
- [ ] buildQwenProvider (DashScope)
- [ ] 模型配置 (qwen-max, qwen-plus, qwen-turbo)
- [ ] 测试调用

**智谱 AI** (1天)
- [ ] buildZhipuProvider
- [ ] 模型配置 (glm-4, glm-4-plus, glm-4-turbo)
- [ ] 测试调用

**百度文心** (1天)
- [ ] buildWenxinProvider
- [ ] 模型配置 (ernie-4.0, ernie-3.5)
- [ ] 测试调用

**腾讯混元** (1天)
- [ ] buildHunyuanProvider
- [ ] 模型配置 (hunyuan-standard, hunyuan-lite)
- [ ] 测试调用

### Week 6: 余额监控

**余额缓存** (2天)
- [ ] `src/agents/balance/cache.ts`
- [ ] 内存缓存实现
- [ ] 文件缓存实现 (可选)
- [ ] TTL 机制
- [ ] 单元测试

**余额检查器** (3天)
- [ ] `src/agents/balance/checkers/minimax.ts`
- [ ] `src/agents/balance/checkers/deepseek.ts`
- [ ] `src/agents/balance/checkers/qwen.ts`
- [ ] `src/agents/balance/checkers/zhipu.ts`
- [ ] `src/agents/balance/checkers/index.ts`
- [ ] 单元测试

**配置支持** (2天)
- [ ] `src/config/types.models.ts` - BalanceMonitorConfig
- [ ] `src/config/zod-schema.providers.ts` - Schema 更新
- [ ] 配置文档

### 测试 (Week 6 末)

- [ ] 各厂商模型调用测试
- [ ] 余额查询测试
- [ ] 缓存机制测试
- [ ] 文档更新

**验收标准**:
- ✅ 5+ 国产 LLM 可调用
- ✅ 余额查询正常工作
- ✅ 缓存机制正常

---

## 🧠 模块三: 多智能体调度 (Week 7-8)

### Week 7: Coordinator 实现

**核心逻辑** (3天)
- [ ] `src/agents/coordinator.ts` - runCoordinatorMode
- [ ] 任务拆解 Prompt 设计
- [ ] 任务列表解析
- [ ] 并行调度逻辑 (Promise.all + sessions_spawn)
- [ ] 结果汇总机制

**配置支持** (1天)
- [ ] `src/config/types.agents.ts` - CoordinatorConfig
- [ ] `src/config/zod-schema.agents.ts` - Schema
- [ ] 默认配置

**集成** (2天)
- [ ] 与 auto-reply 集成
- [ ] 与 gateway 集成
- [ ] Agent 选择逻辑

### Week 8: 测试与优化

**功能测试** (2天)
- [ ] 单任务拆解测试
- [ ] 多任务并行测试
- [ ] 超时处理测试
- [ ] 错误处理测试

**性能优化** (2天)
- [ ] 并发数限制
- [ ] 资源控制
- [ ] 超时机制

**文档** (1天)
- [ ] 使用指南
- [ ] 配置示例
- [ ] 最佳实践

**验收标准**:
- ✅ 能拆解复杂任务
- ✅ 并行执行子任务
- ✅ 正确汇总结果
- ✅ 错误处理健壮

---

## 🏪 模块四: Skills/MCP Store 系统 (Week 9-12)

### Week 9-10: Store 后端

**数据库** (2天)
- [ ] 设计 Schema (SQLite)
- [ ] skills 表
- [ ] skill_versions 表
- [ ] mcp_servers 表
- [ ] submissions 表
- [ ] 迁移脚本

**API 实现 - Skills** (3天)
- [ ] `GET /api/skills/search` - 搜索
- [ ] `GET /api/skills/:id` - 详情
- [ ] `POST /api/skills/submit` - 提交
- [ ] `GET /api/skills/:id/download` - 下载
- [ ] 单元测试

**API 实现 - MCPs** (2天)
- [ ] `GET /api/mcps/search`
- [ ] `GET /api/mcps/:id`
- [ ] `POST /api/mcps/submit`
- [ ] 单元测试

**管理 API** (2天)
- [ ] `GET /api/admin/submissions` - 待审核列表
- [ ] `POST /api/admin/submissions/:id/approve` - 批准
- [ ] `POST /api/admin/submissions/:id/reject` - 拒绝
- [ ] 认证中间件
- [ ] 单元测试

**管理后台** (3天)
- [ ] Next.js 项目搭建
- [ ] 待审核列表页面
- [ ] 审核详情页面
- [ ] 已发布列表页面

### Week 11-12: Pandabot 集成

**Skills 自动查找** (3天)
- [ ] `src/agents/skills/store-integration.ts`
- [ ] findSkillInStore 实现
- [ ] promptAndInstallSkill 实现
- [ ] installSkillFromStore 实现
- [ ] 集成到 buildWorkspaceSkillSnapshot

**MCP 自动安装** (2天)
- [ ] `src/plugins/mcp-store-integration.ts`
- [ ] findMcpInStore 实现
- [ ] installMcpFromStore 实现
- [ ] 配置更新逻辑

**CLI 集成** (2天)
- [ ] `panda skills search` 命令
- [ ] `panda skills install` 命令
- [ ] `panda mcps search` 命令
- [ ] `panda mcps install` 命令

**配置支持** (1天)
- [ ] `src/config/types.skills.ts` - StoreIntegrationConfig
- [ ] Schema 更新
- [ ] 配置文档

**测试** (2天)
- [ ] 端到端测试
- [ ] 集成测试
- [ ] 性能测试

**验收标准**:
- ✅ Store API 正常工作
- ✅ 管理后台可用
- ✅ Pandabot 能自动查找并安装
- ✅ 用户体验流畅

---

## 🔄 模块五: 余额监控服务 (Week 13)

### 监控服务实现 (3天)

- [ ] `src/agents/balance/service.ts` - BalanceMonitorService
- [ ] start/stop 方法
- [ ] 定期检查逻辑
- [ ] 事件监听器
- [ ] 单元测试

### Model Selection 集成 (2天)

- [ ] `src/agents/balance/integration.ts`
- [ ] filterProvidersByBalance 实现
- [ ] 集成到 model-selection.ts
- [ ] 集成到 model-fallback
- [ ] 测试

### CLI 命令 (2天)

- [ ] `panda models balance` - 查看余额状态
- [ ] `panda models balance check` - 立即检查
- [ ] `panda models balance providers` - 列出所有厂商
- [ ] 输出格式化

**验收标准**:
- ✅ 监控服务稳定运行
- ✅ 余额过滤正常工作
- ✅ CLI 命令可用

---

## 🎨 模块六: 完善与优化 (Week 14)

### 告警机制 (2天)

- [ ] 日志告警
- [ ] Webhook 告警 (可选)
- [ ] 告警冷却机制
- [ ] 配置支持

### 文档完善 (2天)

- [ ] API 文档
- [ ] 用户指南
- [ ] 配置手册
- [ ] 最佳实践
- [ ] FAQ

### 性能优化 (2天)

- [ ] 余额监控性能优化
- [ ] Store API 性能优化
- [ ] 多智能体并发优化
- [ ] 性能测试

### 安全审计 (1天)

- [ ] 代码安全扫描
- [ ] 依赖安全检查
- [ ] 配置安全审查
- [ ] 安全文档

---

## 📊 进度追踪

### 完成度统计

```
准备阶段:      [████████░░] 80%
企业微信集成:  [░░░░░░░░░░]  0%
国产LLM集成:   [░░░░░░░░░░]  0%
多智能体调度:  [░░░░░░░░░░]  0%
Store系统:     [░░░░░░░░░░]  0%
余额监控服务:  [░░░░░░░░░░]  0%
完善与优化:    [░░░░░░░░░░]  0%

总体进度:      [█░░░░░░░░░] 10%
```

### 里程碑

- [ ] **M1**: 企业微信集成完成 (Week 4)
- [ ] **M2**: 国产 LLM 可用 (Week 6)
- [ ] **M3**: 多智能体调度可用 (Week 8)
- [ ] **M4**: Store 系统上线 (Week 12)
- [ ] **M5**: 余额监控完整 (Week 13)
- [ ] **M6**: 全部模块完成 (Week 14)

---

## 🎯 本周任务 (根据当前进度更新)

### Week 1 - 准备阶段

**高优先级**:
- [ ] 企业微信开发者账号申请
- [ ] DeepSeek API Key 申请
- [ ] 通义千问 API Key 申请
- [ ] 智谱 AI API Key 申请

**中优先级**:
- [ ] Fork 代码仓库
- [ ] 搭建本地开发环境
- [ ] 阅读详细设计文档

**低优先级**:
- [ ] 服务器环境准备 (可推迟到 Store 开发前)

---

## 📝 备注

### 任务依赖关系

1. **无依赖** (可并行):
   - 企业微信集成
   - 国产 LLM 集成
   - 多智能体调度

2. **有依赖**:
   - Store 集成 → Store 后端完成
   - 余额监控服务 → 余额检查器完成
   - Model Selection 集成 → 余额监控服务完成

### 人员分配建议

**团队规模**: 3-4 人

- **开发者 A**: 企业微信集成 + 多智能体调度
- **开发者 B**: 国产 LLM 集成 + 余额监控
- **开发者 C**: Store 后端 + 管理后台
- **开发者 D**: Pandabot 集成 + 测试

### 风险提示

⚠️ **高风险**:
- 企业微信加解密实现复杂
- 各厂商余额 API 可能不稳定
- Store 系统安全审核机制

⚠️ **中风险**:
- 多智能体任务拆解准确度
- Store 系统性能
- 文档完善度

---

**最后更新**: 2026-01-31  
**文档版本**: v1.0
