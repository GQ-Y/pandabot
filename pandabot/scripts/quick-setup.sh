#!/bin/bash
# Pandabot 快速启动脚本

set -e

echo "🐼 Pandabot 快速配置向导"
echo "================================"
echo ""

# 检查是否已有配置
if [ -f ~/.panda/panda.json ]; then
    echo "⚠️  检测到已有配置: ~/.panda/panda.json"
    read -p "是否继续并覆盖? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "已取消"
        exit 0
    fi
fi

# 生成 Gateway Token
echo ""
echo "📝 生成 Gateway Token..."
TOKEN=$(openssl rand -hex 32)
echo "✅ Token 已生成: ${TOKEN:0:16}...${TOKEN: -8}"

# 设置环境变量
export PANDA_GATEWAY_TOKEN="$TOKEN"
echo ""
echo "✅ 已设置环境变量: PANDA_GATEWAY_TOKEN"

# 创建配置目录
mkdir -p ~/.panda
echo ""
echo "✅ 创建配置目录: ~/.panda"

# 创建基础配置文件
cat > ~/.panda/panda.json <<EOF
{
  "gateway": {
    "mode": "local",
    "port": 18789,
    "auth": {
      "token": "$TOKEN"
    }
  },
  "agents": {
    "defaults": {
      "workspace": "~/panda"
    }
  }
}
EOF

echo "✅ 创建配置文件: ~/.panda/panda.json"

# 设置权限
chmod 600 ~/.panda/panda.json
echo "✅ 设置文件权限: 600"

# 显示配置信息
echo ""
echo "================================"
echo "🎉 配置完成！"
echo "================================"
echo ""
echo "配置信息:"
echo "  配置目录: ~/.panda"
echo "  配置文件: ~/.panda/panda.json"
echo "  Gateway 端口: 18789"
echo "  Gateway Token: ${TOKEN:0:16}...${TOKEN: -8}"
echo ""
echo "启动命令:"
echo "  panda gateway              # 启动 Gateway"
echo "  panda status               # 查看状态"
echo "  panda dashboard            # 打开控制面板"
echo ""
echo "环境变量 (添加到 ~/.zshrc 或 ~/.bashrc):"
echo "  export PANDA_GATEWAY_TOKEN=\"$TOKEN\""
echo ""
echo "建议: 将以下内容添加到 shell 配置文件:"
echo "----------------------------------------"
echo "# Pandabot 配置"
echo "export PANDA_GATEWAY_TOKEN=\"$TOKEN\""
echo "export PANDA_STATE_DIR=\"\$HOME/.panda\""
echo "----------------------------------------"
