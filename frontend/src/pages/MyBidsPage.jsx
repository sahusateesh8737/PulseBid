import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { Gavel, TrendingUp, AlertCircle, ArrowRight, History } from 'lucide-react';

export const MyBidsPage = () => {
  const myBids = [
    {
      id: 'auc_001',
      title: 'NVIDIA RTX 4090 Founder Edition',
      myMaxBid: 1450,
      currentBid: 1450,
      status: 'Leading',
      auctionStatus: 'LIVE',
      lastBidTime: '10m ago',
    },
    {
      id: 'auc_002',
      title: 'Apple MacBook Pro M3 Max 64GB',
      myMaxBid: 2600,
      currentBid: 2650,
      status: 'Outbid',
      auctionStatus: 'LIVE',
      lastBidTime: '1h ago',
    },
    {
      id: 'auc_004',
      title: 'Rolex Submariner Date 41mm',
      myMaxBid: 11200,
      currentBid: 11200,
      status: 'Won',
      auctionStatus: 'ENDED',
      lastBidTime: '3h ago',
    },
  ];

  const columns = [
    { header: 'Auction Title', key: 'title', render: (r) => <strong className="text-slate-100">{r.title}</strong> },
    { header: 'My Highest Bid', key: 'myMaxBid', render: (r) => <span className="font-mono font-bold text-slate-100">${r.myMaxBid.toLocaleString()}</span> },
    { header: 'Current Highest', key: 'currentBid', render: (r) => <span className="font-mono font-bold text-brand">${r.currentBid.toLocaleString()}</span> },
    {
      header: 'My Status',
      key: 'status',
      render: (r) => (
        <Badge variant={r.status === 'Leading' || r.status === 'Won' ? 'bidder' : 'upcoming'}>
          {r.status}
        </Badge>
      ),
    },
    {
      header: 'Action',
      key: 'id',
      render: (r) => (
        <Link to={`/auctions/${r.id}`}>
          <Button variant={r.status === 'Outbid' ? 'primary' : 'outline'} size="sm">
            {r.status === 'Outbid' ? 'Counter Bid' : 'View Room'}
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-dark-border pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">My Bidding Activity</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Track active real-time auction streams where you have submitted bids.
        </p>
      </div>

      {myBids.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Active Bids Recorded"
          description="You have not submitted bids on any live auction streams in this tenant partition."
          actionLabel="Explore Live Auctions"
          onAction={() => window.location.href = '/auctions'}
        />
      ) : (
        <Table columns={columns} data={myBids} pageSize={10} />
      )}
    </div>
  );
};
