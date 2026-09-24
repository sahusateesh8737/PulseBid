import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Package, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();

  const product = {
    id: id || 'inv_001',
    sku: 'SKU-RTX4090-FE',
    title: 'NVIDIA RTX 4090 Founder Edition',
    category: 'Graphics Processors',
    totalQty: 5,
    reservedQty: 2,
    availableQty: 3,
    unitPrice: 1599,
    status: 'AVAILABLE',
    description: 'Factory sealed flagship GPU release with official manufacturer 3-year warranty.',
    specs: [
      { label: 'VRAM', value: '24GB GDDR6X' },
      { label: 'Bus Width', value: '384-bit' },
      { label: 'Architecture', value: 'Ada Lovelace' },
      { label: 'Postgres Protection', value: 'SELECT FOR UPDATE Lock' },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <Link to="/inventory" className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Stock Inventory
        </Link>
        <Badge variant="brand">{product.sku}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-4">
          <div className="w-full h-56 rounded-2xl bg-zinc-800/60 border border-dark-border flex items-center justify-center text-slate-400">
            <Package className="w-16 h-16 text-brand" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">{product.title}</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{product.description}</p>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Current Unit Valuation</div>
              <div className="text-2xl font-extrabold font-mono text-brand">${product.unitPrice.toLocaleString()}</div>
            </div>
            <Badge variant="bidder">{product.status}</Badge>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Stock Allocation Ledger</h3>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Total</div>
                <div className="text-base font-bold text-slate-200">{product.totalQty}</div>
              </div>
              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Reserved</div>
                <div className="text-base font-bold text-amber-400">{product.reservedQty}</div>
              </div>
              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Available</div>
                <div className="text-base font-bold text-emerald-400">{product.availableQty}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-dark-border">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Technical Specifications</h3>
            <div className="divide-y divide-dark-border/60 text-xs font-mono">
              {product.specs.map((s, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="text-slate-100 font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
