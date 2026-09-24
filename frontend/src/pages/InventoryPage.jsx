import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Package, Search, LayoutGrid, List, Lock, CheckCircle2 } from 'lucide-react';

export const InventoryPage = () => {
  const { activeTenant } = useAuth();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState('');

  const inventoryItems = [
    {
      id: 'inv_001',
      sku: 'SKU-RTX4090-FE',
      title: 'NVIDIA RTX 4090 Founder Edition',
      category: 'Electronics',
      totalQty: 5,
      reservedQty: 2,
      availableQty: 3,
      unitPrice: 1599,
      status: 'AVAILABLE',
    },
    {
      id: 'inv_002',
      sku: 'SKU-MBP-M3MAX',
      title: 'Apple MacBook Pro M3 Max 64GB',
      category: 'Computers',
      totalQty: 3,
      reservedQty: 2,
      availableQty: 1,
      unitPrice: 3499,
      status: 'AVAILABLE',
    },
    {
      id: 'inv_003',
      sku: 'SKU-SONY-A7IV',
      title: 'Sony Alpha A7 IV Mirrorless Body',
      category: 'Cameras',
      totalQty: 10,
      reservedQty: 0,
      availableQty: 10,
      unitPrice: 2499,
      status: 'AVAILABLE',
    },
    {
      id: 'inv_004',
      sku: 'SKU-ROLEX-SUB41',
      title: 'Rolex Submariner Date 41mm',
      category: 'Luxury',
      totalQty: 1,
      reservedQty: 1,
      availableQty: 0,
      unitPrice: 11200,
      status: 'SOLD',
    },
  ];

  const filteredItems = inventoryItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'SKU Code', key: 'sku', sortable: true, render: (r) => <span className="font-mono text-brand font-semibold">{r.sku}</span> },
    { header: 'Product Name', key: 'title', sortable: true, render: (r) => <strong className="text-slate-100">{r.title}</strong> },
    { header: 'Category', key: 'category', sortable: true },
    { header: 'Available / Total', key: 'availableQty', render: (r) => <span className="font-mono font-bold text-emerald-400">{r.availableQty} / {r.totalQty}</span> },
    { header: 'Unit Price', key: 'unitPrice', sortable: true, render: (r) => <span className="font-mono font-bold">${r.unitPrice.toLocaleString()}</span> },
    {
      header: 'Status',
      key: 'status',
      render: (r) => (
        <Badge variant={r.status === 'AVAILABLE' ? 'bidder' : r.status === 'RESERVED' ? 'upcoming' : 'ended'}>
          {r.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      key: 'id',
      render: (r) => (
        <Link to={`/inventory/${r.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="brand">{activeTenant?.name}</Badge>
            <span className="text-xs font-mono text-slate-400">PostgreSQL Transaction Protected</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 mt-1">Tenant Stock & Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical stock allocation ledger with PostgreSQL row-level locks.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-card p-4 border border-dark-border rounded-2xl">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by product name or SKU..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 font-medium transition-colors ${
              viewMode === 'grid'
                ? 'bg-brand text-dark-bg border-brand font-bold'
                : 'bg-dark-surface border-dark-border text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-xl border text-xs flex items-center gap-1.5 font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-brand text-dark-bg border-brand font-bold'
                : 'bg-dark-surface border-dark-border text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" /> Table
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {viewMode === 'table' ? (
        <Table columns={columns} data={filteredItems} pageSize={10} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} hoverEffect className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant={item.status === 'AVAILABLE' ? 'bidder' : 'ended'}>{item.status}</Badge>
                  <span className="font-mono text-xs text-brand font-bold">{item.sku}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-400">Category: {item.category}</p>
              </div>

              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border flex items-center justify-between font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Available Stock</div>
                  <div className="text-emerald-400 font-bold text-sm">{item.availableQty} / {item.totalQty} Units</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Valuation</div>
                  <div className="text-slate-100 font-bold text-sm">${item.unitPrice.toLocaleString()}</div>
                </div>
              </div>

              <Link to={`/inventory/${item.id}`} className="w-full">
                <Button variant="secondary" size="sm" className="w-full">
                  View Stock Ledger
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
