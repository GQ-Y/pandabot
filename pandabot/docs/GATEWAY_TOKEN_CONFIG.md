# Gateway Token 配置指南

Pandabot Gateway 使用 Token 进行认证，确保只有授权的客户端可以连接。

## 配置方式（按优先级）

### 1. 环境变量（推荐用于开发/测试）
```bash
export PANDA_GATEWAY_TOKEN="your_secure_token_here"
panda gateway
```

### 2. 配置文件（推荐用于生产）
编辑 `~/.panda/panda.json`：
```json
{
  "gateway": {
    "auth": {
      "token": "your_secure_token_here"
    }
  }
}
```

### 3. 命令行参数
```bash
panda gateway --token your_secure_token_here
```

## 生成安全的 Token

### 使用 OpenSSL（推荐）
```bash
openssl rand -hex 32
# 输出: abcd1234567890...（64字符）
```

### 使用 Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 使用 Python
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

## 完整配置示例

### 本地模式（Local Mode）
```bash
# 1. 生成 token
export PANDA_GATEWAY_TOKEN=$(openssl rand -hex 32)

# 2. 启动 Gateway
panda gateway --port 18789

# 3. 客户端连接使用相同的 token
```

### 远程模式（Remote Mode）
```json
{
  "gateway": {
    "mode": "remote",
    "remote": {
      "url": "wss://your-gateway.example.com:18789",
      "token": "your_secure_token_here"
    }
  }
}
```

## 初始化配置

### 交互式向导
```bash
panda onboard
# 或
panda setup --wizard
```

### 非交互式设置
```bash
panda setup --non-interactive --mode local
```

## 安全建议

1. **Token 长度**: 建议至少 32 字节（64 个十六进制字符）
2. **定期更换**: 生产环境建议定期更换 token
3. **权限控制**: 配置文件权限应设为 600 (只读/写所有者)
   ```bash
   chmod 600 ~/.panda/panda.json
   ```
4. **不要提交**: 确保 `.env` 和含 token 的配置文件不被提交到版本控制
5. **HTTPS/WSS**: 生产环境使用 WSS (WebSocket Secure) 连接

## 验证配置

```bash
# 检查状态
panda status

# 健康检查
panda health

# 启动 Gateway 测试
PANDA_SKIP_CHANNELS=1 panda gateway --allow-unconfigured
```

## 常见问题

### Q: Gateway 提示 "no token is configured"
A: 设置 `PANDA_GATEWAY_TOKEN` 环境变量或在配置文件中设置 `gateway.auth.token`

### Q: Token 存储在哪里？
A: 
- 配置文件: `~/.panda/panda.json`
- 环境变量: `PANDA_GATEWAY_TOKEN`
- 命令行参数: `--token`

### Q: 如何重置 token？
A: 
1. 生成新 token: `openssl rand -hex 32`
2. 更新配置文件或环境变量
3. 重启 Gateway: `panda gateway restart`

## 相关命令

```bash
panda setup                    # 初始化配置
panda configure                # 配置向导
panda config get gateway.auth.token  # 查看当前 token
panda config set gateway.auth.token "new_token"  # 设置新 token
panda gateway                  # 启动 Gateway
panda gateway --force          # 强制重启 Gateway
panda dashboard                # 打开控制面板
```
