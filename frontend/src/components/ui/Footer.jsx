import React from 'react';
import { Gavel, ShieldCheck, Zap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark-surface border-t border-dark-border text-slate-400 text-xs py-6 mt-auto w-full">
      <div className="w-full px-4 md:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-xl bg-brand text-dark-bg flex items-center justify-center font-bold">
            <Gavel className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold text-slate-200 text-sm">PulseBid</span>
          <span className="text-slate-400">— Real-time Multi-tenant Auction Engine</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-brand" /> Redis Pub/Sub Distributed
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Postgres Row-Lock Protection
          </span>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Production Hackathon MVP
        </div>
      </div>
    </footer>
  );
};
