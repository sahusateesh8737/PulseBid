import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INITIAL_AUCTIONS } from '../api/mockData';
import apiClient from '../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Shield, PlusCircle, Package, Gavel, Layers, AlertCircle, RefreshCw } from 'lucide-react';

export const AdminDashboardPage = () => {
  const { tenantId, activeTenant } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadAuctions = async () => {
      try {
        const res = await apiClient.get('/auctions', { params: { tenantId } });
        if (isMounted) {
          const rawData = res.data?.data || res.data || res;
          setAuctions(Array.isArray(rawData) ? rawData : []);
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
    loadAuctions();
    return () => { isMounted = false; };
  }, [tenantId]);

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="admin">Tenant Admin Console</Badge>
            <span className="text-xs font-mono text-slate-400">{activeTenant.name} ({tenantId})</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Auction & Stock Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage product inventory releases, monitor live bids, and protect PostgreSQL stock allocations.
          </p>
        </div>

        <Link to="/admin/create">
          <Button variant="primary" icon={PlusCircle} className="font-semibold">
            Create New Auction
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-zinc-900/80 p-4">
          <div className="text-[10px] font-mono uppercase text-slate-400">Total Tenant Auctions</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{auctions.length}</div>
        </Card>

        <Card className="bg-zinc-900/80 p-4">
          <div className="text-[10px] font-mono uppercase text-slate-400">Live Active Rooms</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {auctions.filter((a) => a.status === 'LIVE').length} Active
          </div>
        </Card>

        <Card className="bg-zinc-900/80 p-4">
          <div className="text-[10px] font-mono uppercase text-slate-400">Allocated Inventory Stock</div>
          <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
            {auctions.reduce((acc, a) => acc + (a.remainingStock || 0), 0)} Units
          </div>
        </Card>
      </div>

      {/* Admin Table */}
      <Card className="bg-zinc-900/90 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Tenant Auction Inventory Inventory</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-slate-400">Loading admin metrics...</div>
          ) : auctions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No auctions created yet for tenant namespace {tenantId}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-zinc-950 text-slate-400 uppercase font-mono border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3">Auction Title</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Stock Units</th>
                    <th className="px-4 py-3">Current Bid</th>
                    <th className="px-4 py-3">Total Bids</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {auctions.map((auc) => (
                    <tr key={auc.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="px-4 py-3 font-sans font-semibold text-slate-100">
                        {auc.title}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={auc.status.toLowerCase()} size="sm">{auc.status}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-emerald-400 font-bold">{auc.remainingStock}</span> / {auc.totalStock}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-100">
                        ${auc.currentBid?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {auc.totalBids || 0}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/auctions/${auc.id}`}>
                          <Button variant="outline" size="sm">
                            Open Room
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
