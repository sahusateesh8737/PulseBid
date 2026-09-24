import React from 'react';

export const Badge = ({
  children,
  variant = 'neutral', // live, upcoming, ended, admin, bidder, tenant, neutral, brand
  size = 'md',
  className = '',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-mono font-semibold rounded-full tracking-wide uppercase shadow-2xs';

  const variants = {
    live: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    upcoming: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    ended: 'bg-zinc-800 text-zinc-400 border border-zinc-700',
    brand: 'bg-brand/15 text-brand border border-brand/40',
    admin: 'bg-purple-500/15 text-purple-300 border border-purple-500/30',
    bidder: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    tenant: 'bg-dark-surface text-slate-200 border border-dark-border',
    neutral: 'bg-zinc-800/80 text-slate-300 border border-zinc-700/80',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.neutral} ${sizes[size]} ${className}`}>
      {variant === 'live' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      )}
      {children}
    </span>
  );
};
