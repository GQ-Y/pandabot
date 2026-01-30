# 🐼 Pandabot - 智能 AI Agent 平台

> 原名 Panda/Pandabot，已全面迁移为 Pandabot

## 快速开始

### 1. 安装依赖

```bash
cd pandabot
pnpm install
```

### 2. 构建项目

```bash
pnpm build
```

### 3. 配置 Gateway Token

#### 方式一：快速配置脚本（推荐）

```bash
bash scripts/quick-setup.sh
```

#### 方式二：手动配置

```bash
# 生成 Token
export PANDA_GATEWAY_TOKEN=$(openssl rand -hex 32)

# 或编辑配置文件
mkdir -p ~/.panda
cat > ~/.panda/panda.json <<EOF
{
  "gateway": {
    "auth": {
      "token": "$(openssl rand -hex 32)"
    }
  }
}
EOF
```

详细配置说明: [docs/GATEWAY_TOKEN_CONFIG.md](docs/GATEWAY_TOKEN_CONFIG.md)

### 4. 运行

```bash
# 查看版本
node panda.mjs --version

# 查看帮助
node panda.mjs --help

# 启动 Gateway
node panda.mjs gateway

# 查看状态
node panda.mjs status
```

## 核心命令

```bash
panda setup              # 初始化配置
panda onboard            # 交互式向导
panda gateway            # 启动 Gateway 服务
panda status             # 查看系统状态
panda health             # 健康检查
panda agent              # 执行 AI Agent 任务
panda models             # 模型管理
panda channels           # 渠道管理（WhatsApp, Telegram 等）
panda dashboard          # 打开 Web 控制面板
```

## 项目结构

```
pandabot/
├── panda.mjs              # CLI 入口文件
├── package.json           # 包配置（命令: panda）
├── src/                   # 源代码
│   ├── cli/              # CLI 相关
│   ├── gateway/          # Gateway 服务
│   ├── agents/           # Agent 系统
│   ├── config/           # 配置管理
│   └── ...
├── dist/                  # 构建输出
├── extensions/            # 扩展插件（28个）
├── scripts/               # 工具脚本
│   ├── quick-setup.sh    # 快速配置脚本
│   ├── migrate-env-vars.py
│   └── migrate-paths.py
└── docs/                  # 文档
    └── GATEWAY_TOKEN_CONFIG.md
```

## 配置文件

### 主配置

- **位置**: `~/.panda/panda.json`
- **环境变量**: `PANDA_CONFIG_PATH`

### 状态目录

- **位置**: `~/.panda/`
- **环境变量**: `PANDA_STATE_DIR`
- **内容**:
  - `agents/` - Agent 数据
  - `sessions/` - 会话记录
  - `plugins/` - 插件数据

### 环境变量

```bash
# 核心配置
PANDA_STATE_DIR=~/.panda                    # 状态目录
PANDA_CONFIG_PATH=~/.panda/panda.json       # 配置文件

# Gateway 配置
PANDA_GATEWAY_TOKEN=<token>                 # Gateway 认证 Token
PANDA_GATEWAY_PORT=18789                    # Gateway 端口
PANDA_GATEWAY_HOST=127.0.0.1                # Gateway 主机

# 开发模式
PANDA_SKIP_CHANNELS=1                       # 跳过渠道初始化
PANDA_NIX_MODE=1                            # Nix 模式
PANDA_NO_RESPAWN=1                          # 禁用进程重启

# 运行时
PANDA_CLI_NAME=panda                        # CLI 名称
PANDA_NODE_OPTIONS_READY=1                  # Node 选项就绪
```

## 开发命令

```bash
# 开发服务器
pnpm gateway:dev         # 开发模式 Gateway
pnpm --dev gateway       # 使用独立配置

# 构建
pnpm build               # 构建项目
pnpm canvas:a2ui:bundle  # 构建 UI

# 测试
pnpm test                # 运行测试
pnpm test:e2e            # E2E 测试

# 代码检查
pnpm lint                # Lint 检查
pnpm type-check          # 类型检查
```

## 迁移说明

从 Panda/Pandabot 迁移到 Pandabot 的变更:

### 命令变更
- `panda` → `panda`
- `pandabot` → `panda`

### 环境变量变更
- `PANDABOT_*` → `PANDA_*`
- `PANDA_*` → `PANDA_*`

### 配置路径变更
- `~/.pandabot/` → `~/.panda/`
- `~/.panda/` → `~/.panda/`
- `panda.json` → `panda.json`

### 向后兼容
系统会自动检测并迁移旧配置（仅读取，不修改原文件）

## 常见问题

### Q: 如何生成 Gateway Token?
```bash
openssl rand -hex 32
```

### Q: Gateway 无法启动
检查配置:
```bash
panda status
panda doctor
```

### Q: 如何配置 API Keys?
```bash
panda configure
# 或编辑 ~/.panda/agents/main/agent/auth-profiles.json
```

### Q: 如何更新?
```bash
git pull
pnpm install
pnpm build
```

## 文档链接

- [Gateway Token 配置](docs/GATEWAY_TOKEN_CONFIG.md)
- [国产化开发方案](docs/domestic-development-spec.md)
- 更多文档请查看 `docs/` 目录

## 技术栈

- **语言**: TypeScript / Node.js
- **包管理**: pnpm
- **框架**: WebSocket (Gateway), Commander (CLI)
- **AI 模型**: Anthropic Claude, OpenAI, 国产大模型（通义千问、智谱等）
- **渠道**: WhatsApp, Telegram, 钉钉等

## 许可证

查看项目根目录的 LICENSE 文件

## 贡献

欢迎提交 Issue 和 Pull Request！

---

**🎉 Pandabot - 让 AI Agent 工作更轻松！**
