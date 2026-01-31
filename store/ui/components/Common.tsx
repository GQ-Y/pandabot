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
    primary: "bg-blue-600 text-white",
    secondary: "bg-slate-100 text-slate-600",
    outline: "border border-slate-200 text-slate-500",
    success: "bg-green-50 text-green-700 border border-green-100",
    warning: "bg-amber-50 text-amber-700 border border-amber-100",
    error: "bg-red-50 text-red-700 border border-red-100",
    purple: "bg-[#F3E8FF] text-[#7C3AED]", 
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
  // Removed focus rings and heavy shadows for a flatter look
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Flattened primary button: no shadow, just solid color
    primary: "bg-[#6366F1] text-white hover:bg-[#4F46E5]",
    // Flattened secondary: very light border or just background
    secondary: "bg-white text-slate-700 border border-slate-100 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-200",
    outline: "border border-slate-200 text-slate-700 bg-transparent hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-600 text-white hover:bg-red-700",
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
      {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className={`mr-2 ${children ? '' : 'mr-0'}`} />}
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
      // Extremely light border (slate-100) and minimal shadow
      className={`bg-white border border-slate-100 rounded-xl p-5 ${hover ? 'hover:border-purple-200 hover:shadow-sm cursor-pointer transition-all duration-200' : ''} ${className}`}
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
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <input
        // Flat input style: bg-slate-50, border-transparent (until focus)
        className={`w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg placeholder-slate-400 text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${error ? 'border-red-300 bg-red-50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};
