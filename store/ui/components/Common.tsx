import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'purple';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'secondary', className = '' }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-1";
  const variants = {
    primary: "bg-blue-600 text-white dark:bg-blue-500",
    secondary: "bg-slate-100 text-slate-600 dark:bg-dark-hover dark:text-dark-text",
    outline: "border border-slate-200 text-slate-500 dark:border-dark-border dark:text-dark-muted",
    success: "bg-green-50 text-green-700 border border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    warning: "bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    error: "bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    purple: "bg-[#F3E8FF] text-[#7C3AED] dark:bg-purple-900/30 dark:text-purple-400", 
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className = '', 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all btn-press disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#6366F1] text-white hover:bg-[#4F46E5] dark:bg-secondary-400 dark:hover:bg-secondary-500",
    secondary: "bg-white text-slate-700 border border-slate-100 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200 dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-dark-hover dark:hover:border-dark-border",
    outline: "border border-slate-200 text-slate-700 bg-transparent hover:bg-slate-50 dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-hover",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-dark-muted dark:hover:bg-dark-hover dark:hover:text-dark-text",
    danger: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className={`${children ? 'mr-2' : ''}`} />}
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hover = false }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-slate-100 rounded-xl p-5 dark:bg-dark-card dark:border-dark-border ${hover ? 'card-hover cursor-pointer hover:border-purple-200 dark:hover:border-purple-800' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-dark-text mb-1.5">{label}</label>}
      <input
        className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg placeholder-slate-400 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm dark:bg-dark-hover dark:border-dark-border dark:text-dark-text dark:placeholder-dark-muted dark:focus:bg-dark-card dark:focus:ring-purple-400 dark:focus:border-purple-400 ${error ? 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

// --- Modal Backdrop ---
interface ModalBackdropProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({ onClick, children }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" 
        onClick={onClick}
      />
      <div className="relative z-10 animate-fade-in-scale">
        {children}
      </div>
    </div>
  );
};

// --- Code Block ---
interface CodeBlockProps {
  children: string;
  showPrompt?: boolean;
  onCopy?: () => void;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  children, 
  showPrompt = false, 
  onCopy,
  className = '' 
}) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    onCopy?.();
  };

  return (
    <div className={`terminal-bg rounded-lg p-4 font-mono text-sm flex items-center justify-between group ${className}`}>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {showPrompt && <span className="terminal-prompt select-none">$</span>}
        <span className="terminal-text whitespace-pre">{children}</span>
      </div>
      <button 
        onClick={handleCopy}
        className="ml-3 p-1.5 text-dark-muted hover:text-white rounded transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
        title="复制"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      </button>
    </div>
  );
};
