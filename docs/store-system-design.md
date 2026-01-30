# Skills/MCP Store 系统设计方案

## 一、系统概述

### 1.1 目标

构建一个 Skills 和 MCP Server 的集中收录平台，支持：
- 用户无需注册即可提交 Skills/MCP
- 管理后台统一审核
- Pandabot 自动查找并安装
- 版本管理与依赖检查

### 1.2 系统架构

```
┌─────────────────┐         ┌─────────────────┐
│   Pandabot      │────────▶│  Store Backend  │
│   Client        │◀────────│   (Hono API)    │
└─────────────────┘         └─────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
              ┌─────▼─────┐   ┌─────▼─────┐   ┌─────▼─────┐
              │  Database  │   │  Storage  │   │   Admin   │
              │  (SQLite)  │   │   (FS)    │   │    UI     │
              └────────────┘   └───────────┘   └───────────┘
```

## 二、数据库设计

### 2.1 Skills 表

```sql
CREATE TABLE skills (
  id TEXT PRIMARY KEY,                    -- UUID
  name TEXT NOT NULL UNIQUE,              -- Skill 名称
  display_name TEXT,                      -- 显示名称
  description TEXT,                       -- 描述
  author TEXT,                            -- 作者
  author_email TEXT,                      -- 作者邮箱
  version TEXT NOT NULL,                  -- 当前版本
  category TEXT,                          -- 分类
  tags TEXT,                              -- 标签（JSON 数组）
  content TEXT NOT NULL,                  -- SKILL.md 内容
  requirements TEXT,                      -- 依赖（JSON）
  status TEXT NOT NULL DEFAULT 'pending', -- pending/approved/rejected
  downloads INTEGER DEFAULT 0,            -- 下载次数
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by TEXT,                       -- 审核人
  rejection_reason TEXT
);

CREATE INDEX idx_skills_name ON skills(name);
CREATE INDEX idx_skills_status ON skills(status);
CREATE INDEX idx_skills_category ON skills(category);
```

### 2.2 Skills 版本表

```sql
CREATE TABLE skill_versions (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  version TEXT NOT NULL,
  content TEXT NOT NULL,
  changelog TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skills(id),
  UNIQUE(skill_id, version)
);
```

### 2.3 MCP Servers 表

```sql
CREATE TABLE mcp_servers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,              -- MCP Server 名称
  display_name TEXT,
  description TEXT,
  author TEXT,
  author_email TEXT,
  version TEXT NOT NULL,
  category TEXT,
  tags TEXT,                              -- JSON 数组
  npm_package TEXT,                       -- npm 包名
  install_command TEXT,                   -- 安装命令
  config_template TEXT,                   -- 配置模板（JSON）
  capabilities TEXT,                      -- 功能描述（JSON）
  status TEXT NOT NULL DEFAULT 'pending',
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by TEXT,
  rejection_reason TEXT
);

CREATE INDEX idx_mcps_name ON mcp_servers(name);
CREATE INDEX idx_mcps_status ON mcp_servers(status);
```

### 2.4 提交记录表

```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,                     -- 'skill' | 'mcp'
  target_id TEXT,                         -- skills.id 或 mcp_servers.id
  submitter_email TEXT NOT NULL,          -- 提交者邮箱
  payload TEXT NOT NULL,                  -- 提交数据（JSON）
  status TEXT NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  processed_by TEXT,
  notes TEXT
);
```

## 三、API 设计

### 3.1 Skills API

#### 3.1.1 搜索 Skills

```
GET /api/skills/search?q={keyword}&category={category}&page={page}&limit={limit}

Response:
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "results": [
    {
      "id": "uuid",
      "name": "coding-helper",
      "displayName": "Coding Helper",
      "description": "Helps with coding tasks",
      "author": "John Doe",
      "version": "1.0.0",
      "category": "development",
      "tags": ["coding", "helper"],
      "downloads": 1234,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### 3.1.2 获取 Skill 详情

```
GET /api/skills/{id}

Response:
{
  "id": "uuid",
  "name": "coding-helper",
  "displayName": "Coding Helper",
  "description": "Helps with coding tasks",
  "author": "John Doe",
  "authorEmail": "john@example.com",
  "version": "1.0.0",
  "category": "development",
  "tags": ["coding", "helper"],
  "content": "# Coding Helper\n...",  // SKILL.md 内容
  "requirements": {
    "pandabotVersion": ">=2026.1.0",
    "plugins": ["some-plugin"]
  },
  "downloads": 1234,
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-15T00:00:00Z"
}
```

#### 3.1.3 提交 Skill

```
POST /api/skills/submit

Request:
{
  "name": "my-skill",
  "displayName": "My Skill",
  "description": "A cool skill",
  "author": "Jane Doe",
  "authorEmail": "jane@example.com",
  "version": "1.0.0",
  "category": "development",
  "tags": ["cool", "skill"],
  "content": "# My Skill\n...",
  "requirements": {
    "pandabotVersion": ">=2026.1.0"
  }
}

Response:
{
  "submissionId": "uuid",
  "status": "pending",
  "message": "Submission received. It will be reviewed shortly."
}
```

#### 3.1.4 下载 Skill

```
GET /api/skills/{id}/download

Response:
{
  "id": "uuid",
  "name": "coding-helper",
  "version": "1.0.0",
  "content": "# Coding Helper\n...",
  "files": [
    {
      "path": "SKILL.md",
      "content": "..."
    },
    {
      "path": "helpers/utils.py",
      "content": "..."
    }
  ]
}
```

### 3.2 MCP API

#### 3.2.1 搜索 MCP Servers

```
GET /api/mcps/search?q={keyword}&category={category}&page={page}&limit={limit}

Response:
{
  "total": 50,
  "page": 1,
  "limit": 20,
  "results": [
    {
      "id": "uuid",
      "name": "database-mcp",
      "displayName": "Database MCP",
      "description": "MCP for database operations",
      "author": "Alice",
      "version": "1.0.0",
      "npmPackage": "@pandabot/mcp-database",
      "downloads": 567
    }
  ]
}
```

#### 3.2.2 获取 MCP 详情

```
GET /api/mcps/{id}

Response:
{
  "id": "uuid",
  "name": "database-mcp",
  "displayName": "Database MCP",
  "description": "MCP for database operations",
  "author": "Alice",
  "version": "1.0.0",
  "npmPackage": "@pandabot/mcp-database",
  "installCommand": "npm install @pandabot/mcp-database",
  "configTemplate": {
    "mcps": {
      "database": {
        "command": "npx",
        "args": ["@pandabot/mcp-database"],
        "env": {
          "DB_URL": "postgresql://..."
        }
      }
    }
  },
  "capabilities": {
    "tools": ["query_database", "execute_sql"],
    "resources": ["database_schema"]
  }
}
```

#### 3.2.3 提交 MCP

```
POST /api/mcps/submit

Request:
{
  "name": "my-mcp",
  "displayName": "My MCP",
  "description": "A cool MCP server",
  "author": "Bob",
  "authorEmail": "bob@example.com",
  "version": "1.0.0",
  "npmPackage": "@me/my-mcp",
  "installCommand": "npm install @me/my-mcp",
  "configTemplate": { ... },
  "capabilities": { ... }
}
```

### 3.3 管理 API（需要认证）

```
GET  /api/admin/submissions               # 获取待审核列表
POST /api/admin/submissions/{id}/approve  # 批准
POST /api/admin/submissions/{id}/reject   # 拒绝
```

## 四、Pandabot 集成

### 4.1 自动查找逻辑

#### 4.1.1 Skills 查找

```typescript
// src/agents/skills/store-integration.ts

export async function findSkillInStore(
  skillName: string
): Promise<StoreSkill | null> {
  const storeUrl = getStoreUrl();
  
  try {
    const response = await fetch(
      `${storeUrl}/api/skills/search?q=${encodeURIComponent(skillName)}&limit=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.results.length === 0) return null;
    
    return data.results[0];
  } catch (error) {
    console.warn(`Failed to search skill in store: ${error}`);
    return null;
  }
}

export async function promptAndInstallSkill(
  skill: StoreSkill,
  config: PandaConfig
): Promise<boolean> {
  // CLI 模式
  if (!config.gateway?.enabled) {
    const confirmed = await confirm({
      message: `Skill "${skill.displayName}" not found locally. Install from store?`,
      active: "Yes",
      inactive: "No",
    });
    
    if (!confirmed) return false;
    
    return await installSkillFromStore(skill.id);
  }
  
  // Gateway 模式 - 通过 Gateway 推送确认请求
  // TODO: 实现 Gateway 确认流程
  return false;
}

async function installSkillFromStore(skillId: string): Promise<boolean> {
  const storeUrl = getStoreUrl();
  
  try {
    // 1. 下载 Skill 内容
    const response = await fetch(`${storeUrl}/api/skills/${skillId}/download`);
    if (!response.ok) throw new Error(`Failed to download skill`);
    
    const skill = await response.json();
    
    // 2. 写入本地目录
    const managedSkillsDir = resolveManagedSkillsDir();
    const skillDir = path.join(managedSkillsDir, skill.name);
    
    await fs.mkdir(skillDir, { recursive: true });
    
    for (const file of skill.files) {
      const filePath = path.join(skillDir, file.path);
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, file.content);
    }
    
    // 3. 更新配置（可选加入白名单）
    // await addSkillToAllowlist(skill.name);
    
    console.log(`✅ Skill "${skill.name}" installed successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to install skill: ${error}`);
    return false;
  }
}
```

#### 4.1.2 集成到 Skill 加载流程

```typescript
// src/agents/skills/config.ts

export async function buildWorkspaceSkillSnapshot(params: {
  config: PandaConfig;
  // ...
}): Promise<WorkspaceSkillSnapshot> {
  // 现有加载逻辑
  const entries = await loadSkillEntries(/* ... */);
  
  // 如果启用了 Store 集成
  if (params.config.skills?.storeIntegration?.enabled) {
    // 检查是否有缺失的 Skills 被请求
    const requestedSkills = params.config.skills?.allow || [];
    
    for (const skillName of requestedSkills) {
      const found = entries.find(e => e.skill.name === skillName);
      
      if (!found) {
        // 尝试从 Store 查找并安装
        const storeSkill = await findSkillInStore(skillName);
        
        if (storeSkill) {
          const installed = await promptAndInstallSkill(storeSkill, params.config);
          
          if (installed) {
            // 重新加载 Skills
            const newEntries = await loadSkillEntries(/* ... */);
            entries.push(...newEntries.filter(e => e.skill.name === skillName));
          }
        }
      }
    }
  }
  
  // 继续现有流程...
  return buildSnapshot(entries);
}
```

### 4.2 MCP 自动安装

```typescript
// src/plugins/mcp-store-integration.ts

export async function findMcpInStore(
  mcpName: string
): Promise<StoreMcp | null> {
  const storeUrl = getStoreUrl();
  
  try {
    const response = await fetch(
      `${storeUrl}/api/mcps/search?q=${encodeURIComponent(mcpName)}&limit=1`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.results[0] || null;
  } catch (error) {
    console.warn(`Failed to search MCP in store: ${error}`);
    return null;
  }
}

export async function installMcpFromStore(
  mcp: StoreMcp
): Promise<boolean> {
  try {
    // 1. 执行安装命令
    const { execa } = await import('execa');
    await execa('sh', ['-c', mcp.installCommand], { stdio: 'inherit' });
    
    // 2. 更新配置
    const config = loadConfig();
    const newConfig = {
      ...config,
      mcps: {
        ...config.mcps,
        ...mcp.configTemplate.mcps,
      },
    };
    
    await writeConfig(newConfig);
    
    console.log(`✅ MCP "${mcp.name}" installed successfully`);
    return true;
  } catch (error) {
    console.error(`Failed to install MCP: ${error}`);
    return false;
  }
}
```

## 五、管理后台

### 5.1 技术栈

- **Framework**：Next.js (React)
- **UI Library**：shadcn/ui
- **Auth**：简单的 Basic Auth 或 JWT

### 5.2 功能页面

1. **待审核列表**
   - 显示所有 pending 状态的提交
   - 快速预览内容
   - 批准/拒绝操作

2. **已发布列表**
   - 显示所有已批准的 Skills/MCPs
   - 编辑/删除功能
   - 下载统计

3. **审核详情页**
   - 完整内容预览
   - 代码高亮
   - 依赖检查
   - 安全扫描结果

## 六、安全机制

### 6.1 提交审核

- **人工审核**：所有提交需人工审核后才能发布
- **代码扫描**：检查恶意代码、后门
- **依赖检查**：验证依赖包安全性

### 6.2 安装安全

- **Checksum 验证**：下载后验证文件完整性
- **沙箱测试**：在隔离环境中测试
- **用户确认**：明确告知安装内容

### 6.3 版本管理

- **语义化版本**：强制 semver 格式
- **兼容性检查**：验证 Pandabot 版本要求
- **回滚机制**：支持回退到旧版本

## 七、部署方案

### 7.1 推荐架构

```
┌──────────────┐
│   Cloudflare │  (CDN + DDoS 防护)
│   Workers    │
└──────┬───────┘
       │
┌──────▼───────┐
│   Backend    │  (Hono + SQLite)
│  (Fly.io)    │
└──────────────┘
```

### 7.2 环境变量

```bash
# Store Backend
STORE_DATABASE_URL=file:./data/store.db
STORE_ADMIN_PASSWORD=<hashed-password>
STORE_JWT_SECRET=<secret>

# Pandabot Client
PANDABOT_STORE_URL=https://store.pandabot.io
PANDABOT_STORE_INTEGRATION_ENABLED=true
```

## 八、开发里程碑

### Phase 1：MVP（Week 1-2）

- [ ] 数据库 Schema 设计与实现
- [ ] Skills CRUD API
- [ ] 基础搜索功能
- [ ] 简单的提交表单

### Phase 2：核心功能（Week 3-4）

- [ ] MCP API
- [ ] 版本管理
- [ ] 下载统计
- [ ] Pandabot 集成

### Phase 3：管理后台（Week 5-6）

- [ ] 审核界面
- [ ] 内容预览
- [ ] 批准/拒绝操作
- [ ] 统计面板

### Phase 4：完善与上线（Week 7-8）

- [ ] 安全扫描
- [ ] 性能优化
- [ ] 文档编写
- [ ] 部署与测试

## 九、配置示例

### 9.1 Pandabot 配置

```yaml
# config.yaml
skills:
  storeIntegration:
    enabled: true
    storeUrl: "https://store.pandabot.io"
    autoInstall: true              # 自动安装（跳过确认）
    preferStore: false             # 优先从 Store 加载
  allow:
    - "coding-helper"
    - "web-scraper"

mcps:
  storeIntegration:
    enabled: true
    storeUrl: "https://store.pandabot.io"
```

### 9.2 Store Backend 配置

```yaml
# store-config.yaml
database:
  type: "sqlite"
  path: "./data/store.db"

storage:
  type: "filesystem"
  path: "./data/storage"

security:
  adminPassword: "$2a$10$..."        # bcrypt hash
  requireEmailVerification: false   # MVP 阶段不需要
  maxSubmissionsPerDay: 10
  
审核:
  autoReject:
    - "eval("
    - "exec("
    - "__import__"
```

## 十、总结

Skills/MCP Store 系统是 Pandabot 生态的重要组成部分，通过集中化的收录和分发机制，能够：

1. **降低使用门槛**：用户无需手动查找和安装
2. **提升安全性**：统一审核机制
3. **促进生态发展**：鼓励社区贡献
4. **简化维护**：集中管理版本和依赖

建议优先实现 MVP 版本，快速验证核心功能，然后逐步完善。
