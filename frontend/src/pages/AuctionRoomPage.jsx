import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';
import { INITIAL_AUCTIONS } from '../api/mockData';
import apiClient from '../api/axios';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import {
  Gavel,
  Package,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  History,
  ShieldCheck,
  Zap,
  Lock,
} from 'lucide-react';

export const AuctionRoomPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, tenantId } = useAuth();
  const { socket, joinAuctionRoom, leaveAuctionRoom, placeBid: socketPlaceBid } = useSocket();
  const { addToast, notifyOutbid } = useToast();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(null);
  const [bidFeedback, setBidFeedback] = useState(null);
  const [flashPrice, setFlashPrice] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadAuction = async () => {
      try {
        const response = await apiClient.get(`/auctions/${id}`);
        if (isMounted) {
          setAuction(response.data || response);
          setBidAmount(String((response.data?.currentBid || 0) + (response.data?.minIncrement || 25)));
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const found = INITIAL_AUCTIONS.find((a) => a.id === id) || INITIAL_AUCTIONS[0];
          setAuction(found);
          setBidAmount(String((found.currentBid || 0) + (found.minIncrement || 25)));
          setLoading(false);
        }
      }
    };

    loadAuction();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    joinAuctionRoom(id);

    if (socket) {
      const handleBidPlaced = (data) => {
        if (data.auctionId === id) {
          setAuction((prev) => {
            if (!prev) return prev;
            const isNewHighest = data.amount > prev.currentBid;

            // Trigger outbid notification if user was leading previously
            if (isNewHighest && prev.highestBidderId === user?.id && data.bidderId !== user?.id) {
              notifyOutbid({
                auctionTitle: prev.title,
                newAmount: data.amount,
                auctionId: id,
              });
            }

            return {
              ...prev,
              currentBid: isNewHighest ? data.amount : prev.currentBid,
              highestBidder: data.bidderName,
              highestBidderId: data.bidderId,
              totalBids: (prev.totalBids || 0) + 1,
              bids: [
                {
                  id: data.id || `b_${Date.now()}`,
                  amount: data.amount,
                  bidderName: data.bidderName,
                  timestamp: data.timestamp || new Date().toISOString(),
                },
                ...(prev.bids || []),
              ],
            };
          });

          setFlashPrice(true);
          setTimeout(() => setFlashPrice(false), 800);
        }
      };

      const handleInventoryUpdate = (data) => {
        if (data.auctionId === id) {
          setAuction((prev) => (prev ? { ...prev, remainingStock: data.remainingStock } : prev));
        }
      };

      const handleReservationConfirmed = (data) => {
        if (data.auctionId === id && data.userId === user?.id) {
          setReservationSuccess({
            reservationId: data.reservationId,
            qty: data.qty || 1,
            amount: data.bidPrice,
            timestamp: new Date().toISOString(),
          });
          addToast({
            title: '🎉 Stock Reserved Successfully!',
            message: `Unit reservation #${data.reservationId.slice(-6)} locked via PostgreSQL.`,
            type: 'success',
          });
        }
      };

      socket.on('bid:placed', handleBidPlaced);
      socket.on('inventory:update', handleInventoryUpdate);
      socket.on('reservation:confirmed', handleReservationConfirmed);

      return () => {
        leaveAuctionRoom(id);
        socket.off('bid:placed', handleBidPlaced);
        socket.off('inventory:update', handleInventoryUpdate);
        socket.off('reservation:confirmed', handleReservationConfirmed);
      };
    }
  }, [socket, id, joinAuctionRoom, leaveAuctionRoom, user?.id, notifyOutbid, addToast]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(bidAmount);

    if (!numAmount || isNaN(numAmount)) {
      setBidFeedback({ type: 'error', text: 'Please enter a valid numeric bid.' });
      return;
    }

    const minRequired = (auction?.currentBid || 0) + (auction?.minIncrement || 25);
    if (numAmount < minRequired) {
      setBidFeedback({
        type: 'error',
        text: `Bid must be at least $${minRequired.toLocaleString()} (Min increment: +$${auction.minIncrement})`,
      });
      return;
    }

    setIsSubmitting(true);
    setBidFeedback(null);

    try {
      await socketPlaceBid(id, numAmount);

      const newBid = {
        id: `bid_${Date.now()}`,
        amount: numAmount,
        bidderName: user?.name || 'You',
        timestamp: new Date().toISOString(),
      };

      setAuction((prev) => ({
        ...prev,
        currentBid: numAmount,
        highestBidder: user?.name || 'You',
        highestBidderId: user?.id,
        totalBids: (prev.totalBids || 0) + 1,
        bids: [newBid, ...(prev.bids || [])],
      }));

      setBidAmount(String(numAmount + (auction?.minIncrement || 25)));
      setBidFeedback({ type: 'success', text: `Bid of $${numAmount.toLocaleString()} submitted successfully!` });
      addToast({
        title: 'Bid Submitted',
        message: `Highest bid updated to $${numAmount.toLocaleString()}`,
        type: 'success',
      });
      setFlashPrice(true);
      setTimeout(() => setFlashPrice(false), 800);
    } catch (err) {
      try {
        await apiClient.post(`/auctions/${id}/bids`, { amount: numAmount });
        setBidFeedback({ type: 'success', text: 'Bid recorded via backend REST API!' });
      } catch (restErr) {
        setBidFeedback({
          type: 'error',
          text: restErr.message || 'Bid rejected by server. Higher bid already exists.',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetIncrement = (stepMultiplier) => {
    const minStep = (auction?.minIncrement || 25) * stepMultiplier;
    const current = parseFloat(bidAmount) || (auction?.currentBid || 0);
    setBidAmount(String(current + minStep));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 w-full">
        <div className="w-10 h-10 rounded-full border-3 border-brand border-t-transparent animate-spin" />
        <p className="text-xs font-mono text-slate-400">Loading live auction stream #{id}...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center w-full">
        <h2 className="text-xl font-bold text-slate-100">Auction Room Not Found</h2>
        <p className="text-xs text-slate-400 mt-2 mb-4">
          The specified auction ID does not exist in tenant partition <span className="font-mono text-slate-300">{tenantId}</span>.
        </p>
        <Link to="/auctions">
          <Button variant="outline" icon={ArrowLeft}>Back to Discovery</Button>
        </Link>
      </div>
    );
  }

  const isUserHighestBidder = auction.highestBidderId === user?.id || auction.highestBidder === user?.name;
  const minRequiredBid = (auction.currentBid || 0) + (auction.minIncrement || 25);

  return (
    <div className="space-y-6 w-full">
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-dark-border pb-4 w-full">
        <Link to="/auctions" className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Return to Discovery
        </Link>

        <div className="flex items-center gap-3">
          <Badge variant={auction.status.toLowerCase()}>{auction.status}</Badge>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Room ID: {auction.id}</span>
        </div>
      </div>

      {/* Main Fluid Grid: Left Console (7 cols) & Right Stream Activity (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
        
        {/* Left Column: Product Details & Bidding Hero Console (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 w-full">
          
          {/* Title & Stock Lock Header */}
          <div className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft-sm w-full">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {auction.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {auction.description}
              </p>
            </div>

            {/* Inventory Count Bar */}
            <div className="p-4 bg-dark-surface rounded-2xl border border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-slate-200 shrink-0">
                  <Package className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase text-slate-400">Protected Stock Remaining</div>
                  <div className="text-base font-bold text-slate-100 flex items-baseline gap-2">
                    <span className="text-xl font-mono text-emerald-400 font-bold">{auction.remainingStock}</span>
                    <span className="text-xs font-mono text-slate-400">/ {auction.totalStock} units available</span>
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-dark-card px-3 py-1.5 rounded-full border border-dark-border">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> PostgreSQL Row Lock
              </div>
            </div>
          </div>

          {/* Current Bid Hero Box */}
          <motion.div
            animate={{ borderColor: flashPrice ? '#FFC107' : '#2A2A2A' }}
            className={`bg-dark-card border rounded-3xl p-6 sm:p-8 space-y-6 shadow-soft-md transition-all duration-300 w-full ${
              flashPrice ? 'shadow-yellow-glow' : ''
            }`}
          >
            <div className="grid grid-cols-2 gap-4 border-b border-dark-border pb-6">
              {/* Price Display */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Current Highest Bid
                </div>
                <div className="text-3xl sm:text-5xl font-extrabold font-mono text-brand tracking-tight">
                  ${auction.currentBid?.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-mono">
                  <span>Leading:</span>
                  <span className={`font-bold ${isUserHighestBidder ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {auction.highestBidder || 'No bids yet'} {isUserHighestBidder && '(You)'}
                  </span>
                </div>
              </div>

              {/* Countdown Display */}
              <div className="border-l border-dark-border pl-6 flex flex-col justify-center">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Time Remaining
                </div>
                <div className="pt-1">
                  <CountdownTimer endTime={auction.endTime} size="lg" />
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-2">
                  {auction.totalBids || 0} competitive bids logged
                </div>
              </div>
            </div>

            {/* Bid Form & Step Buttons */}
            {auction.status === 'LIVE' ? (
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span>Enter Next Bid Amount (USD)</span>
                    <span className="text-slate-400">
                      Minimum required: <strong className="text-emerald-400">${minRequiredBid.toLocaleString()}</strong>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      type="number"
                      step={auction.minIncrement}
                      min={minRequiredBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min $${minRequiredBid}`}
                      className="font-mono text-lg font-bold py-3 bg-dark-surface rounded-full"
                      required
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      icon={Gavel}
                      className="shrink-0 px-8 font-extrabold"
                    >
                      Place Real-Time Bid
                    </Button>
                  </div>
                </div>

                {/* Preset Step Increment Pills */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Quick Increment:</span>
                  {['+1x', '+2x', '+5x'].map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handlePresetIncrement(idx === 0 ? 1 : idx === 1 ? 2 : 5)}
                      className="px-3 py-1 rounded-full bg-dark-surface border border-dark-border text-xs font-mono text-slate-300 hover:text-brand hover:border-brand/40 transition-colors"
                    >
                      +{label} (+${auction.minIncrement * (idx === 0 ? 1 : idx === 1 ? 2 : 5)})
                    </button>
                  ))}
                </div>

                {/* Feedback Toast Banner */}
                {bidFeedback && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs font-medium border flex items-center gap-2 ${
                      bidFeedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}
                  >
                    {bidFeedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span>{bidFeedback.text}</span>
                  </div>
                )}
              </form>
            ) : (
              <div className="p-4 bg-dark-surface border border-dark-border rounded-2xl text-center text-xs text-slate-400 font-mono">
                Bidding is currently closed for this item.
              </div>
            )}
          </motion.div>

          {/* Reservation Confirmed Card */}
          {reservationSuccess && (
            <div className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-emerald-200 shadow-soft-sm">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>PostgreSQL Inventory Lock Confirmed</span>
              </div>
              <p className="text-xs text-emerald-300/90">
                Your winning bid of <strong className="font-mono text-emerald-200">${reservationSuccess.amount.toLocaleString()}</strong> successfully reserved unit reservation #{reservationSuccess.reservationId.slice(-6)}.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Live Socket Activity Log (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 w-full">
          
          <Card className="bg-dark-card border-dark-border p-0 overflow-hidden w-full">
            <div className="p-5 border-b border-dark-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> Live Stream Activity
              </h2>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Zap className="w-3 h-3 text-brand animate-pulse" /> Socket.IO Connected
              </span>
            </div>

            {(!auction.bids || auction.bids.length === 0) ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono">
                No bids recorded yet. Be the first to place a bid!
              </div>
            ) : (
              <div className="divide-y divide-dark-border/60 max-h-[460px] overflow-y-auto">
                {auction.bids.map((bid, index) => {
                  const isUser = bid.bidderName === user?.name || bid.bidderId === user?.id;
                  return (
                    <div
                      key={bid.id || index}
                      className={`p-4 flex items-center justify-between transition-colors ${
                        index === 0 ? 'bg-dark-surface font-medium' : 'hover:bg-zinc-800/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                          isUser ? 'bg-brand text-dark-bg font-bold' : 'bg-dark-surface border border-dark-border text-slate-300'
                        }`}>
                          {bid.bidderName ? bid.bidderName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="text-xs text-slate-200 flex items-center gap-1.5 font-bold">
                            <span>{bid.bidderName || 'Bidder'}</span>
                            {isUser && <span className="text-[10px] font-mono text-emerald-400 font-bold">(You)</span>}
                            {index === 0 && <Badge variant="brand" size="sm">Top</Badge>}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {bid.timestamp ? new Date(bid.timestamp).toLocaleTimeString() : 'Just now'}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="text-base font-extrabold text-slate-100">
                          ${bid.amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
};
