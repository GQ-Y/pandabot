import React from 'react';
import { Home, Terminal, Box, Upload } from 'lucide-react';
import { PageView } from '../types';

interface MobileNavProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

interface NavItem {
  id: PageView;
  label: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'skills', label: 'Skills', icon: Terminal },
  { id: 'mcp', label: 'MCP', icon: Box },
  { id: 'submit', label: '提交', icon: Upload },
];

const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onNavigate }) => {
  // Determine which nav item is active (detail page maps to skills/mcp based on context)
  const getActiveId = (): PageView => {
    if (currentPage === 'detail') return 'skills';
    if (currentPage === 'admin') return 'home';
    return currentPage;
  };

  const activeId = getActiveId();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border pb-safe backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = activeId === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-slate-400 dark:text-dark-muted hover:text-slate-600 dark:hover:text-dark-text'
              }`}
            >
              <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                <Icon size={22} />
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400" />
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
