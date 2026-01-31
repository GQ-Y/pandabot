import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, FileCode } from 'lucide-react';
import { Item } from '../types';
import { Button, ModalBackdrop } from './Common';
import { useToast } from './Toast';

interface InstallModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

const InstallModal: React.FC<InstallModalProps> = ({ item, isOpen, onClose }) => {
  const toast = useToast();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSkill = item.type === 'skill';
  const installCommand = isSkill 
    ? `pandabot skill install ${item.name}` 
    : `pandabot mcp install ${item.name}`;

  const configContent = isSkill 
    ? `skills:
  allow:
    - ${item.name}` 
    : `mcpServers:
  ${item.name}:
    command: "npx"
    args: ["-y", "@pandabot/${item.name}"]`;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(label);
      toast.success('已复制到剪贴板');
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      toast.error('复制失败');
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <div 
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSkill ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-dark-text">
                安装 {item.displayName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-dark-muted">
                {isSkill ? 'Skill' : 'MCP Server'} · v{item.version}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-dark-text dark:hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* CLI Install */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Terminal size={16} className="text-slate-500 dark:text-dark-muted" />
              <span className="text-sm font-medium text-slate-700 dark:text-dark-text">
                在终端中运行
              </span>
            </div>
            <div 
              className="terminal-bg rounded-xl p-4 flex items-center justify-between group cursor-pointer hover:ring-1 hover:ring-purple-500/50 transition-all"
              onClick={() => copyToClipboard(installCommand, 'command')}
            >
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                <span className="terminal-prompt select-none">$</span>
                <code className="terminal-text whitespace-nowrap">{installCommand}</code>
              </div>
              <button 
                className={`ml-3 p-2 rounded-lg transition-all flex-shrink-0 ${
                  copiedCommand === 'command' 
                    ? 'bg-green-600 text-white' 
                    : 'text-dark-muted hover:text-white hover:bg-dark-hover'
                }`}
              >
                {copiedCommand === 'command' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-100 dark:bg-dark-border" />
            <span className="text-xs text-slate-400 dark:text-dark-muted">或</span>
            <div className="flex-1 h-px bg-slate-100 dark:bg-dark-border" />
          </div>

          {/* Config File */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileCode size={16} className="text-slate-500 dark:text-dark-muted" />
              <span className="text-sm font-medium text-slate-700 dark:text-dark-text">
                添加到配置文件
              </span>
              <span className="text-xs text-slate-400 dark:text-dark-muted">
                ({isSkill ? 'config.yaml' : 'mcp_config.json'})
              </span>
            </div>
            <div 
              className="terminal-bg rounded-xl p-4 group cursor-pointer hover:ring-1 hover:ring-purple-500/50 transition-all"
              onClick={() => copyToClipboard(configContent, 'config')}
            >
              <div className="flex justify-between items-start">
                <pre className="terminal-text text-sm overflow-x-auto no-scrollbar flex-1">
                  {configContent}
                </pre>
                <button 
                  className={`ml-3 p-2 rounded-lg transition-all flex-shrink-0 ${
                    copiedCommand === 'config' 
                      ? 'bg-green-600 text-white' 
                      : 'text-dark-muted hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  {copiedCommand === 'config' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-dark-hover border-t border-slate-100 dark:border-dark-border flex items-center justify-between">
          <a 
            href="#" 
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-purple-600 dark:text-dark-muted dark:hover:text-purple-400 transition-colors"
          >
            <ExternalLink size={14} />
            查看完整文档
          </a>
          <Button variant="primary" onClick={onClose}>
            完成
          </Button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

export default InstallModal;
