import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INITIAL_AUCTIONS } from '../api/mockData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { CardSkeleton } from '../components/ui/Skeleton';
import {
  Gavel,
  Package,
  Trophy,
  History,
  TrendingUp,
  ArrowRight,
  Clock,
  Zap,
  Building2,
} from 'lucide-react';

export const DashboardOverviewPage = () => {
  const { user, activeTenant, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  const [liveAuctions, setLiveAuctions] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchAuctions = async () => {
      try {
        const { default: apiClient } = await import('../api/axios');
        const res = await apiClient.get('/auctions');
        if (isMounted && res.data?.success) {
          const auctions = res.data.data;
          setLiveAuctions(auctions.filter(a => a.status === 'LIVE' || a.status === 'live'));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAuctions();
    return () => { isMounted = false; };
  }, []);

  const adminStats = [
    { label: 'ACTIVE LIVE AUCTIONS', value: liveAuctions.length, icon: Gavel, color: 'text-emerald-400' },
    { label: 'PROTECTED STOCK UNITS', value: '18 Units', icon: Package, color: 'text-blue-400' }, // Hardcoded mock
    { label: 'TOTAL REVENUE', value: '$12,450', icon: TrendingUp, color: 'text-emerald-400' }, // Hardcoded mock
    { label: 'SUCCESSFUL AUCTIONS', value: '4', icon: Trophy, color: 'text-amber-400' }, // Hardcoded mock
  ];

  const bidderStats = [
    { label: 'ACTIVE LIVE AUCTIONS', value: liveAuctions.length, icon: Gavel, color: 'text-emerald-400' },
    { label: 'MY TOTAL BIDS PLACED', value: '14 Bids', icon: History, color: 'text-brand' }, // Hardcoded mock
    { label: 'WON INVENTORY ALLOCATIONS', value: '2 Items', icon: Trophy, color: 'text-amber-400' }, // Hardcoded mock
  ];

  const stats = isAdmin ? adminStats : bidderStats;

  if (loading) {
    return (
      <div className="space-y-8 w-full">
        <div className="space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-48" />
          <div className="h-8 bg-zinc-800 rounded w-72" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {/* Dashboard Page Header Hierarchy */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-dark-border pb-6">
        <div className="space-y-1">
          {/* Eyebrow / Namespace */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-brand/15 border border-brand/40 font-mono text-[11px] font-bold uppercase text-brand">
              {activeTenant?.name || 'TENANT'}
            </span>
            <span className="text-xs font-mono text-slate-400">Namespace Dashboard</span>
          </div>

          {/* Primary Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Welcome Back, {user?.name || 'Bidder'}
          </h1>

          {/* Supporting Description */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Monitor real-time auction streams, active bidding history, and protected inventory allocations.
          </p>
        </div>

        {/* Primary Header CTA */}
        <div className="shrink-0">
          <Link to="/auctions">
            <Button variant="primary" size="md" icon={Gavel}>
              Browse Auctions
            </Button>
          </Link>
        </div>
      </div>

      {/* 100% Fluid Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <Card key={idx} className="p-5 flex items-center gap-4 hover:border-brand/50 transition-all w-full">
              <div className="w-12 h-12 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center shrink-0">
                <Icon className={`w-6 h-6 ${st.color}`} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 truncate">
                  {st.label}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-100 mt-0.5 tracking-tight">
                  {st.value}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Fluid Two-Column Grid: Live Streams (60%) + Recent Bidding Log (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* Left: Live Bidding Streams (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand" /> Live Bidding Streams
            </h2>
            <Link to="/auctions" className="text-xs font-bold text-brand hover:underline font-mono">
              View All →
            </Link>
          </div>

          <div className="space-y-4 w-full">
            {liveAuctions.map((auc) => (
              <Card
                key={auc.id}
                hoverEffect
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <LiveIndicator size="sm" />
                    <span className="text-xs font-mono text-slate-400">
                      <strong className="text-slate-200">{auc.remainingStock}</strong> stock remaining
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 leading-snug line-clamp-1">
                    {auc.title}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono">
                    Leading Bid: <strong className="text-brand font-bold">${auc.currentBid?.toLocaleString()}</strong> ({auc.highestBidder})
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <Link to={`/auctions/${auc.id}`}>
                    <Button variant="secondary" size="sm" icon={ArrowRight}>
                      Enter Room
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Recent Bidding Log (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" /> Recent Bidding Log
            </h2>
          </div>

          <Card className="p-0 overflow-hidden w-full">
            <div className="divide-y divide-dark-border/60">
              {[
                { title: 'NVIDIA RTX 4090', bid: 1450, status: 'Leading', time: '2m ago' },
                { title: 'MacBook Pro M3 Max', bid: 2600, status: 'Outbid', time: '15m ago' },
                { title: 'Sony Alpha A7 IV', bid: 1800, status: 'Leading', time: '1h ago' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-800/40 transition-colors">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200">{item.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{item.time}</div>
                  </div>
                  <div className="text-right font-mono space-y-1">
                    <div className="font-bold text-slate-100 text-sm">${item.bid.toLocaleString()}</div>
                    <Badge variant={item.status === 'Leading' ? 'bidder' : 'upcoming'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
