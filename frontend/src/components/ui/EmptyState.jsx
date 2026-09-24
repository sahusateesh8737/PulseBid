import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no active auctions or inventory records matching your request.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="min-h-[280px] flex flex-col items-center justify-center p-8 text-center border border-dashed border-dark-border rounded-3xl bg-dark-card/40 my-4">
      <div className="w-14 h-14 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-slate-400 mb-4 shadow-soft-sm">
        <Icon className="w-7 h-7 text-brand" />
      </div>
      <h3 className="text-base font-bold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400 mt-1.5 max-w-md leading-relaxed">{description}</p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
