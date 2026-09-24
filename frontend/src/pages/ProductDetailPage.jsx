import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft, Package, ShieldCheck, Lock, CheckCircle2, Gavel, X } from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [durationMinutes, setDurationMinutes] = useState('60');
  const [isCreatingAuction, setIsCreatingAuction] = useState(false);

  const isAdmin = user?.role === 'tenant_admin' || user?.role === 'admin';

  const handleCreateAuction = async (e) => {
    e.preventDefault();
    setIsCreatingAuction(true);
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + parseInt(durationMinutes, 10) * 60 * 1000).toISOString();
    
    try {
      await apiClient.post('/auctions', {
        productId: id,
        startTime,
        endTime,
      });
      setShowAuctionModal(false);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Failed to create auction:', err);
      alert('Failed to create auction. Please check your inputs and try again.');
    } finally {
      setIsCreatingAuction(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const [productRes, seatsRes] = await Promise.all([
          apiClient.get(`/products/${id}`),
          apiClient.get(`/products/${id}/seats`)
        ]);
        
        const data = productRes.data?.data || productRes.data;
        const seatsData = seatsRes.data?.data || seatsRes.data || [];
        
        setProduct(data);
        setSeats(seatsData);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setError('Failed to load product data.');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-10 text-slate-400">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="text-red-400">{error || 'Product not found'}</div>
        <Link to="/inventory">
          <Button variant="outline">Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const totalQty = seats.length;
  const availableQty = seats.filter(s => s.status === 'available').length;
  const reservedQty = totalQty - availableQty;

  const specs = [
    { label: 'Created At', value: new Date(product.created_at).toLocaleDateString() },
    { label: 'Updated At', value: new Date(product.updated_at).toLocaleDateString() },
    { label: 'Postgres Protection', value: 'SELECT FOR UPDATE Lock' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-dark-border pb-4">
        <Link to="/inventory" className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Stock Inventory
        </Link>
        <div className="flex items-center gap-3">
          <Badge variant="brand">{product.id.substring(0, 8)}</Badge>
          {isAdmin && (
            <Button variant="primary" size="sm" onClick={() => setShowAuctionModal(true)} icon={Gavel}>
              Create Auction
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <Card className="p-6 space-y-4">
          <div className="w-full h-56 rounded-2xl bg-zinc-800/60 border border-dark-border flex items-center justify-center text-slate-400 overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-16 h-16 text-brand" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">{product.name}</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{product.description || 'No description available.'}</p>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-dark-border pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Current Unit Valuation</div>
              <div className="text-2xl font-extrabold font-mono text-brand">${parseFloat(product.starting_price || 0).toLocaleString()}</div>
            </div>
            <Badge variant="bidder">{product.status || 'AVAILABLE'}</Badge>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Stock Allocation Ledger</h3>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Total</div>
                <div className="text-base font-bold text-slate-200">{totalQty}</div>
              </div>
              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Reserved</div>
                <div className="text-base font-bold text-amber-400">{reservedQty}</div>
              </div>
              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border">
                <div className="text-[10px] text-slate-400">Available</div>
                <div className="text-base font-bold text-emerald-400">{availableQty}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-dark-border">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-400">Technical Specifications</h3>
            <div className="divide-y divide-dark-border/60 text-xs font-mono">
              {specs.map((s, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between">
                  <span className="text-slate-400">{s.label}</span>
                  <span className="text-slate-100 font-bold">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Create Auction Modal */}
      {showAuctionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="p-6 max-w-md w-full bg-dark-card border border-dark-border shadow-2xl relative">
            <button 
              onClick={() => setShowAuctionModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-white mb-2">Create Auction</h2>
            <p className="text-xs text-slate-400 mb-4">Set the duration to start bidding for this product.</p>
            
            <div className="flex items-center gap-4 p-3 bg-dark-surface border border-dark-border rounded-xl mb-6">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center shrink-0">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-slate-500" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-200 truncate">{product.name}</h3>
                <div className="text-xs font-mono text-brand font-bold mt-1">Starting at ${parseFloat(product.starting_price || 0).toLocaleString()}</div>
              </div>
            </div>

            <form onSubmit={handleCreateAuction} className="space-y-4">
              <Input
                label="Duration (Minutes)"
                type="number"
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-4 border-t border-dark-border">
                <Button type="button" variant="outline" onClick={() => setShowAuctionModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isCreatingAuction}>
                  Start Auction
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
