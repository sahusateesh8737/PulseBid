import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ArrowLeft, Gavel, Package, DollarSign, Clock, Layers } from 'lucide-react';

export const CreateAuctionPage = () => {
  const navigate = useNavigate();
  const { tenantId, activeTenant } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingPrice, setStartingPrice] = useState('100');
  const [minIncrement, setMinIncrement] = useState('10');
  const [totalStock, setTotalStock] = useState('1');
  const [durationMinutes, setDurationMinutes] = useState('60');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !startingPrice || !totalStock) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + parseInt(durationMinutes, 10) * 60 * 1000).toISOString();

    const payload = {
      tenantId,
      title,
      description,
      startingPrice: parseFloat(startingPrice),
      currentBid: parseFloat(startingPrice),
      minIncrement: parseFloat(minIncrement),
      totalStock: parseInt(totalStock, 10),
      remainingStock: parseInt(totalStock, 10),
      status: 'LIVE',
      startTime,
      endTime,
    };

    try {
      await apiClient.post('/admin/auctions', payload);
      navigate('/admin/dashboard');
    } catch (err) {
      navigate('/admin/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between border-b border-dark-border pb-4 w-full">
        <Link to="/admin/dashboard" className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Admin Console
        </Link>
        <Badge variant="tenant">{activeTenant.name}</Badge>
      </div>

      <Card className="bg-dark-card border-dark-border shadow-soft-lg p-6 sm:p-8 w-full">
        <div className="border-b border-dark-border pb-4 mb-6">
          <h1 className="text-2xl font-extrabold text-white">Create New Inventory Auction</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish a real-time auction stream protected by backend row-level locking.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Product Title"
            placeholder="e.g. Sony Playstation 5 Pro Limited Edition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono">
              Inventory Description
            </label>
            <textarea
              rows={3}
              placeholder="Details regarding stock specs, warranty, delivery terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-dark-surface border border-dark-border text-slate-100 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Starting Price (USD)"
              type="number"
              min="1"
              icon={DollarSign}
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              required
            />

            <Input
              label="Minimum Step Increment ($)"
              type="number"
              min="1"
              icon={DollarSign}
              value={minIncrement}
              onChange={(e) => setMinIncrement(e.target.value)}
              required
            />

            <Input
              label="Total Inventory Units"
              type="number"
              min="1"
              icon={Package}
              value={totalStock}
              onChange={(e) => setTotalStock(e.target.value)}
              required
            />

            <Input
              label="Duration (Minutes)"
              type="number"
              min="5"
              icon={Clock}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
            />
          </div>

          <div className="pt-6 border-t border-dark-border flex justify-end gap-3">
            <Link to="/admin/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit" variant="primary" isLoading={isSubmitting} icon={Gavel}>
              Publish & Start Stream
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
