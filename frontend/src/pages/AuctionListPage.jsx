import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INITIAL_AUCTIONS } from '../api/mockData';
import apiClient from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CardSkeleton } from '../components/ui/Skeleton';
import { Search, Gavel, Package, Clock, Users, ArrowRight, LayoutGrid, List } from 'lucide-react';

export const AuctionListPage = () => {
  const { tenantId, activeTenant } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchAuctions = async () => {
      try {
        const response = await apiClient.get('/auctions', { params: { tenantId } });
        if (isMounted) {
          const rawData = response.data?.data || response.data || response;
          const dataArray = Array.isArray(rawData) ? rawData : [];
          const mapped = dataArray.map(a => ({
            ...a,
            id: a.id,
            title: a.title || 'Live Auction',
            description: a.description || 'Exclusive inventory drop',
            status: (a.status || 'LIVE').toUpperCase(),
            currentBid: parseFloat(a.current_bid || a.currentBid || 0),
            minIncrement: a.min_increment || a.minIncrement || 25,
            remainingStock: a.remaining_stock || a.remainingStock || 1,
            totalStock: a.total_stock || a.totalStock || 1,
            totalBids: parseInt(a.total_bids || a.totalBids || 0, 10),
            endTime: a.end_time || a.endTime,
          }));
          setAuctions(mapped);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const tenantFiltered = INITIAL_AUCTIONS.filter((a) => a.tenantId === tenantId);
          setAuctions(tenantFiltered.length > 0 ? tenantFiltered : INITIAL_AUCTIONS);
          setLoading(false);
        }
      }
    };

    fetchAuctions();
    return () => { isMounted = false; };
  }, [tenantId]);

  const filteredAuctions = auctions.filter((auc) => {
    const matchesFilter = filter === 'ALL' || auc.status === filter;
    const matchesSearch =
      auc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner Header */}
      <div className="border border-dark-border bg-dark-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full shadow-soft-sm">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge variant="brand">{activeTenant.name}</Badge>
            <span className="text-xs font-mono text-slate-400">Partition Namespace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Live Inventory Auction Feeds
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time multi-tenant bidding stream. PostgreSQL row-level locks protect stock allocations while Redis distributes sub-second bid updates.
          </p>
        </div>

        <div className="flex items-center gap-3 self-stretch md:self-auto shrink-0">
          <div className="px-4 py-3 bg-dark-surface border border-dark-border rounded-2xl text-center flex-1 md:flex-none font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Active Streams</div>
            <div className="text-lg font-bold text-emerald-400">
              {auctions.filter((a) => a.status === 'LIVE').length} LIVE
            </div>
          </div>
          <div className="px-4 py-3 bg-dark-surface border border-dark-border rounded-2xl text-center flex-1 md:flex-none font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Total Inventory</div>
            <div className="text-lg font-bold text-slate-200">
              {auctions.reduce((acc, a) => acc + (a.remainingStock || 0), 0)} Units
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-dark-card p-4 border border-dark-border rounded-2xl w-full">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search inventory, title, tags..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'LIVE', 'UPCOMING', 'ENDED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                filter === status
                  ? 'bg-brand text-dark-bg shadow-soft-sm'
                  : 'bg-dark-surface text-slate-400 border border-dark-border hover:text-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAuctions.length === 0 && (
        <div className="min-h-[280px] flex flex-col items-center justify-center p-8 text-center border border-dashed border-dark-border rounded-3xl bg-dark-card/40 w-full">
          <Package className="w-10 h-10 text-brand mb-3" />
          <h3 className="text-base font-bold text-slate-200">No Auctions Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            There are currently no auctions matching your filter criteria under tenant namespace <span className="font-mono text-slate-300">{tenantId}</span>.
          </p>
        </div>
      )}

      {/* Fluid Responsive Auction Grid */}
      {!loading && filteredAuctions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          {filteredAuctions.map((auction) => (
            <Card
              key={auction.id}
              hoverEffect
              className="flex flex-col justify-between group border-dark-border hover:border-brand/40 transition-all duration-200 w-full"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={auction.status.toLowerCase()}>{auction.status}</Badge>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong className="text-slate-200">{auction.remainingStock}</strong> / {auction.totalStock} left
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-brand transition-colors line-clamp-1">
                    {auction.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {auction.description}
                  </p>
                </div>

                <div className="p-3 bg-dark-surface rounded-2xl border border-dark-border flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Current Highest Bid</div>
                    <div className="text-lg font-bold font-mono text-brand">
                      ${auction.currentBid?.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-mono text-slate-400">Min Step</div>
                    <div className="text-xs font-mono text-slate-300">
                      +${auction.minIncrement}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> {auction.totalBids || 0} bids
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {auction.status === 'LIVE' ? 'Ends soon' : auction.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-dark-border/60">
                <Link to={`/auctions/${auction.id}`} className="w-full">
                  <Button
                    variant={auction.status === 'LIVE' ? 'primary' : 'outline'}
                    className="w-full justify-between"
                    icon={Gavel}
                  >
                    <span>{auction.status === 'LIVE' ? 'Enter Live Room' : 'View Details'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
