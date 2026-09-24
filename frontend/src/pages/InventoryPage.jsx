import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import { Table } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Package, Search, LayoutGrid, List, Plus } from 'lucide-react';

export const InventoryPage = () => {
  const { activeTenant } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add product modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', startingPrice: '', imageFile: null });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/products');
      const data = res.data?.data || res.data;
      setInventoryItems(data?.products || data || []);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.startingPrice) return;
    
    try {
      setIsAdding(true);
      let imageUrl = null;
      if (newProduct.imageFile) {
        const formData = new FormData();
        formData.append('image', newProduct.imageFile);
        const uploadRes = await apiClient.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data?.data?.url || uploadRes.data?.url;
      }

      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        startingPrice: parseFloat(newProduct.startingPrice),
      };
      if (imageUrl) payload.imageUrl = imageUrl;

      await apiClient.post('/products', payload);
      setIsAddModalOpen(false);
      setNewProduct({ name: '', description: '', startingPrice: '', imageFile: null });
      fetchProducts();
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const filteredItems = inventoryItems.filter((item) =>
    (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { header: 'Product ID', key: 'id', render: (r) => <span className="font-mono text-brand font-semibold text-xs">{r.id?.substring(0, 8)}...</span> },
    { header: 'Product Name', key: 'name', render: (r) => <strong className="text-slate-100">{r.name}</strong> },
    { header: 'Starting Price', key: 'starting_price', render: (r) => <span className="font-mono font-bold">${parseFloat(r.starting_price || 0).toLocaleString()}</span> },
    { header: 'Status', key: 'status', render: (r) => <Badge variant="bidder">{r.status || 'AVAILABLE'}</Badge> },
    {
      header: 'Action',
      key: 'actions',
      render: (r) => (
        <Link to={`/inventory/${r.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
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
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-dark-card p-4 border border-dark-border rounded-2xl">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by product name..."
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
      {isLoading ? (
        <div className="text-center py-10 text-slate-400">Loading inventory...</div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 text-slate-400">No inventory found. Add a product to get started!</div>
      ) : viewMode === 'table' ? (
        <Table columns={columns} data={filteredItems} pageSize={10} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} hoverEffect className="p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="bidder">{item.status || 'AVAILABLE'}</Badge>
                  <span className="font-mono text-xs text-brand font-bold">{item.id?.substring(0, 8)}...</span>
                </div>
                {(item.image_url || item.imageUrl) && (
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-dark-surface border border-dark-border mt-2 mb-2">
                    <img src={item.image_url || item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="text-base font-bold text-slate-100">{item.name}</h3>
                <p className="text-xs text-slate-400">{item.description}</p>
              </div>

              <div className="p-3 bg-dark-surface rounded-xl border border-dark-border flex items-center justify-between font-mono text-xs">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase">Valuation (Starting Price)</div>
                  <div className="text-slate-100 font-bold text-sm">${parseFloat(item.starting_price || 0).toLocaleString()}</div>
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

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-dark-card border border-dark-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-slate-100 mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Product Name</label>
                <Input
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Vintage Rolex"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Description</label>
                <Input
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Brief product description"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Starting Price ($)</label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProduct.startingPrice}
                  onChange={(e) => setNewProduct({ ...newProduct, startingPrice: e.target.value })}
                  placeholder="100.00"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Product Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, imageFile: e.target.files[0] })}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand file:text-dark-bg hover:file:bg-brand/80"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border">
                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

