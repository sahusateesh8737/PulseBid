import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost, brand
  size = 'md', // sm, md, lg, xl
  isLoading = false,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed rounded-full cursor-pointer select-none';

  const variants = {
    primary: 'bg-brand text-dark-bg hover:bg-brand-hover active:bg-brand-dark shadow-soft-sm hover:shadow-yellow-glow font-bold border border-brand/50',
    brand: 'bg-brand text-dark-bg hover:bg-brand-hover active:bg-brand-dark shadow-soft-sm hover:shadow-yellow-glow font-bold border border-brand/50',
    secondary: 'bg-dark-surface text-slate-100 hover:bg-zinc-800 active:bg-zinc-900 border border-dark-border shadow-soft-sm',
    outline: 'bg-transparent text-slate-200 hover:bg-white/5 border border-zinc-700 hover:border-brand/60 hover:text-brand',
    danger: 'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-soft-sm border border-red-500',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-bold',
    xl: 'px-8 py-4 text-lg gap-3 font-extrabold',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </motion.button>
  );
};
