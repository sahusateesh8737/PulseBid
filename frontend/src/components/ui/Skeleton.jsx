import React from 'react';

export const Skeleton = ({ className = '', variant = 'rectangular', width, height }) => {
  const baseStyles = 'shimmer-bg bg-zinc-800/60 rounded-xl overflow-hidden';

  const variants = {
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
    pill: 'rounded-full',
  };

  const style = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant] || variants.rectangular} ${className}`}
      style={style}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-dark-surface border border-dark-border rounded-2xl p-5 space-y-4 shadow-soft-sm">
    <div className="flex justify-between items-center">
      <Skeleton variant="pill" className="w-20 h-6" />
      <Skeleton variant="pill" className="w-16 h-4" />
    </div>
    <Skeleton className="w-full h-40 rounded-xl" />
    <Skeleton className="w-3/4 h-6" />
    <Skeleton className="w-1/2 h-4" />
    <div className="pt-2 flex items-center justify-between">
      <Skeleton className="w-24 h-8" />
      <Skeleton variant="pill" className="w-24 h-10" />
    </div>
  </div>
);
