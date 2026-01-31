import React from 'react';

export type PageView = 'home' | 'skills' | 'mcp' | 'detail' | 'submit' | 'admin';

export interface Tag {
  label: string;
  type: 'category' | 'license' | 'default';
}

export interface Item {
  id: string;
  type: 'skill' | 'mcp'; 
  name: string;          // Internal ID name, e.g., 'coding-helper'
  displayName: string;   // Display name, e.g., 'Coding Assistant'
  description: string;
  
  category: string;      // e.g., 开发工具, 数据处理
  version: string;       // e.g., 1.2.0
  license: string;
  author: string;        // e.g., Pandabot Team
  
  downloads: number;
  likes: number;
  updatedAt: string;
  tags: string[];        // e.g., python, automation
  
  status: 'published' | 'pending' | 'rejected';
  content?: string;      // Markdown content
}

export interface Category {
  id: string;
  label: string;
  description?: string;
  count: number;
  icon?: React.ReactNode;
}
