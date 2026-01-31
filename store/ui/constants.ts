import { Item, Category } from './types';
import { Terminal, Database, Wrench, Globe, Cpu, Zap } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: 'dev-tools', label: '开发工具', description: '代码辅助、Git集成、调试工具与CLI增强', count: 45 },
  { id: 'data-ai', label: '数据与AI', description: '数据库连接、MCP服务器、AI模型集成', count: 32 },
  { id: 'productivity', label: '办公效率', description: '文档处理、日程管理、自动化工作流', count: 28 },
  { id: 'system', label: '系统运维', description: '文件系统、Shell操作、系统监控工具', count: 15 },
];

export const MOCK_ITEMS: Item[] = [
  {
    id: '1',
    type: 'skill',
    name: 'coding-assistant',
    displayName: 'Coding Assistant Pro',
    description: '一个强大的代码编写助手，支持 Python、TypeScript 等多种语言的代码补全与重构。',
    category: '开发工具',
    version: '2.1.0',
    license: 'MIT',
    author: 'Pandabot Official',
    downloads: 12500,
    likes: 890,
    updatedAt: '2026.02.10',
    tags: ['coding', 'ai', 'refactor'],
    status: 'published',
    content: `# Coding Assistant Pro\n\n提升你的编码效率...\n\n## 特性\n- 智能补全\n- 代码解释`
  },
  {
    id: '2',
    type: 'mcp',
    name: 'postgres-mcp',
    displayName: 'PostgreSQL MCP Server',
    description: '标准 PostgreSQL MCP 服务器，允许 LLM 直接查询和操作数据库结构。',
    category: '数据与AI',
    version: '1.0.5',
    license: 'Apache 2.0',
    author: 'Database Guild',
    downloads: 8900,
    likes: 450,
    updatedAt: '2026.01.25',
    tags: ['database', 'sql', 'mcp'],
    status: 'published'
  },
  {
    id: '3',
    type: 'skill',
    name: 'web-scraper',
    displayName: 'Universal Web Scraper',
    description: '通用的网页抓取工具，支持动态渲染页面和结构化数据提取。',
    category: '数据与AI',
    version: '1.3.2',
    license: 'GPLv3',
    author: 'DataMiner',
    downloads: 5600,
    likes: 210,
    updatedAt: '2026.02.01',
    tags: ['crawler', 'automation'],
    status: 'published'
  },
  {
    id: '4',
    type: 'mcp',
    name: 'filesystem-mcp',
    displayName: 'Secure FileSystem MCP',
    description: '提供安全的文件系统访问能力的 MCP 服务器，支持沙箱模式。',
    category: '系统运维',
    version: '1.1.0',
    license: 'MIT',
    author: 'SecOps Team',
    downloads: 3200,
    likes: 120,
    updatedAt: '2026.01.15',
    tags: ['fs', 'security', 'system'],
    status: 'published'
  },
  {
    id: '5',
    type: 'skill',
    name: 'daily-brief',
    displayName: 'Daily Briefing Bot',
    description: '自动汇总 Google Calendar 和 Gmail 的每日简报 Skill。',
    category: '办公效率',
    version: '0.9.5',
    license: 'Proprietary',
    author: 'Productivity Inc.',
    downloads: 1500,
    likes: 85,
    updatedAt: '2026.02.05',
    tags: ['calendar', 'email', 'assistant'],
    status: 'published'
  },
  {
    id: '6',
    type: 'mcp',
    name: 'github-mcp',
    displayName: 'GitHub Integration MCP',
    description: '官方 GitHub MCP 服务器，支持 Issue 管理、PR 审查和仓库搜索。',
    category: '开发工具',
    version: '2.0.0',
    license: 'MIT',
    author: 'OpenSource Contrib',
    downloads: 15600,
    likes: 1200,
    updatedAt: '2026.02.12',
    tags: ['git', 'github', 'version-control'],
    status: 'published'
  }
];
