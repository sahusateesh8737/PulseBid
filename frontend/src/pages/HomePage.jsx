import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LiveIndicator } from '../components/ui/LiveIndicator';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import {
  Gavel,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Package,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Building2,
  BellRing,
  Activity,
  Server,
  Banknote,
  Trophy,
  Database,
  ShieldAlert
} from 'lucide-react';

export const HomePage = () => {
  // Demo interactive ticking preview card
  const [demoBid, setDemoBid] = useState(48500);
  const [bids, setBids] = useState([
    { id: 'BL_001', user: 'USER_142 (UK)', amount: 48500, time: 'Just now', isWinning: true },
    { id: 'BL_002', user: 'USER_88 (Tokyo)', amount: 48000, time: '12s ago', isWinning: false },
    { id: 'BL_003', user: 'USER_7 (New York)', amount: 47500, time: '21s ago', isWinning: false },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoBid((prev) => prev + 500);
      setBids(prev => {
        const newBid = {
          id: `BL_00${prev.length + 1}`,
          user: ['USER_142 (UK)', 'USER_88 (Tokyo)', 'USER_7 (New York)', 'USER_23 (Dubai)'][Math.floor(Math.random() * 4)],
          amount: demoBid + 500,
          time: 'Just now',
          isWinning: true
        };
        const updated = [newBid, ...prev.slice(0, 2)].map((b, i) => ({ ...b, isWinning: i === 0 }));
        return updated;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [demoBid]);

  return (
    <div className="mx-auto max-w-[1440px] py-6 px-4 md:px-6 lg:px-8">
      
      {/* MINIMALIST HOME NAVBAR */}
      <header className="flex items-center justify-between w-full mb-6 sm:mb-8">
        <Link to="/" className="flex items-center gap-2">
           <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-brand text-dark-bg font-bold">
             <Gavel className="w-4 h-4" />
           </div>
           <span className="font-extrabold text-2xl tracking-tight text-white">BidPulse</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/signup">
            <Button variant="primary" size="sm" className="font-bold rounded-full px-6 py-2 text-sm shadow-yellow-glow">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left side: Copy */}
        <div className="space-y-6">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight leading-tight"
          >
            Bid in Real Time. <br />
            <span className="text-brand">Never Miss a Deal.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 max-w-lg leading-relaxed"
          >
            High throughput, multi-tenant inventory management & zero race condition real-time auction bidding. Engineered specifically for high frequency luxury, auto, and enterprise asset exchanges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/auctions" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={ArrowRight}>
                Explore Live Auctions
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto" icon={Building2}>
                Enterprise Tenant Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-6 text-xs font-mono text-slate-400"
          >
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand" /> Deterministic Outcomes</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand" /> Tenant Data Isolation</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-brand" /> Zero Dropouts</span>
          </motion.div>
        </div>

        {/* Right side: Interactive Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative lg:ml-auto w-full max-w-lg"
        >
          {/* Glow backdrop */}
          <div className="absolute inset-0 bg-brand/10 blur-[80px] rounded-full pointer-events-none -z-10" />

          <div className="bg-dark-card border border-dark-border rounded-[24px] p-5 shadow-soft-xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LiveIndicator />
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand font-bold">Live Bids - Lot #949</span>
              </div>
              <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 04m 23s
              </div>
            </div>

            {/* Image */}
            <div className="w-full h-48 sm:h-56 bg-zinc-900 rounded-[16px] mb-5 overflow-hidden relative border border-dark-border">
              <img src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80" alt="Watch" className="w-full h-full object-cover opacity-80 mix-blend-screen" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-dark-bg/90 to-transparent p-4">
                <Badge variant="brand" className="mb-1 bg-brand text-dark-bg text-[9px] uppercase border-none">Swiss Classic Horology</Badge>
                <div className="flex items-end justify-between">
                  <h3 className="text-lg font-bold text-white leading-tight">Audemars Piguet Royal Oak 41mm</h3>
                  <span className="text-[10px] font-mono text-slate-300">Est: $42,000</span>
                </div>
              </div>
            </div>

            {/* Bidding Info */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">Current Highest Bid</div>
                <div className="text-3xl font-extrabold font-mono text-brand">${demoBid.toLocaleString()} <span className="text-sm text-slate-400">USD</span></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">Direct Reserve</div>
                <div className="text-sm font-bold font-mono text-emerald-400">Buy: $65,000</div>
              </div>
            </div>

            {/* Progress/Accelerators */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                <span>Smart Bid Accelerators</span>
                <span className="text-brand">Max Limit: $65k</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-dark-border text-xs font-mono font-bold transition-colors">+$250</button>
                <button className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-dark-border text-xs font-mono font-bold transition-colors">+$500</button>
                <button className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-dark-border text-xs font-mono font-bold transition-colors">+$1,000</button>
              </div>
              <Button variant="primary" className="w-full mt-2 py-3 rounded-xl shadow-yellow-glow text-sm font-bold">
                <Gavel className="w-4 h-4 mr-2" />
                Place Next Bid: ${(demoBid + 500).toLocaleString()}
              </Button>
            </div>

            {/* Index Node Order Feed */}
            <div className="border-t border-dark-border pt-4">
              <div className="flex items-center justify-between mb-3 text-[9px] font-mono uppercase text-slate-500 tracking-widest">
                <span>Index Node Order Feed</span>
                <span className="text-brand flex items-center gap-1"><Zap className="w-3 h-3" /> Streaming</span>
              </div>
              <div className="space-y-2">
                {bids.map((b, i) => (
                  <motion.div
                    key={b.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-center justify-between text-[11px] font-mono px-3 py-2 rounded-lg ${b.isWinning ? 'bg-brand/10 border border-brand/30' : 'bg-zinc-900 border border-dark-border/50'}`}
                  >
                    <span className="text-slate-400 w-16">{b.id}</span>
                    <span className="text-slate-200 flex-1">{b.user}</span>
                    <span className={`font-bold ${b.isWinning ? 'text-brand' : 'text-slate-300'}`}>${b.amount.toLocaleString()}</span>
                    <span className="text-slate-500 w-16 text-right">{b.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 2. STATS GRID SECTION */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { icon: Users, val: '10,000+', label: 'Active Global Bidders', subLabel: 'Concurrent Sessions', subVal: '14,000+ EA' },
          { icon: Zap, val: '500+', label: 'Concurrent Live Auctions', subLabel: 'Active Tenants', subVal: '44 Proven' },
          { icon: ShieldCheck, val: '0 Oversell', label: 'Strict Event Sourced Mutex', subLabel: 'Race Condition Rate', subVal: '0.000%' },
          { icon: Banknote, val: '$42.8M', label: 'GMV Cleared This Month', subLabel: 'Revenue Run Rate', subVal: '$40m+' }
        ].map((s, i) => (
          <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-soft-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <s.icon className="w-5 h-5 text-brand" />
                <span className="text-[10px] font-mono text-brand uppercase px-2 py-0.5 rounded-full bg-brand/10">Live Data</span>
              </div>
              <div className="text-3xl font-extrabold font-mono tracking-tight text-white">{s.val}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">{s.label}</div>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase">
              <span>{s.subLabel}</span>
              <strong className="text-slate-300">{s.subVal}</strong>
            </div>
          </div>
        ))}
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-12 border-t border-dark-border">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-[10px] font-mono text-brand uppercase tracking-widest mb-3">Deterministic Workflow</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">How PulseBid Engine Works</h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            From multi-tenant ledger onboarding to sub-micro settlement, every action executes on immutable Kafka event logs and distributed consensus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { num: '01', title: 'Sign Up & Verify Tenant', desc: 'Declare a namespace ID, request allocation, and custom multi-tenant namespaces provisioning in under 5 minutes.', subText: 'Auto-Issued Auth Key', icon: Building2 },
            { num: '02', title: 'Multi-Tenant Catalogs', desc: 'Configure dynamic reserve lists, anti-sniping rules, and inventory state across independent catalog pipelines.', subText: 'Distributed Ref Logs', icon: Database },
            { num: '03', title: 'Zero Race Condition Bid', desc: 'Sub-20ms WebSocket streaming backed by Redis cluster locks and Apache Kafka event sourcing queues.', subText: 'Deterministic Millisecond Timestamps', icon: Lock },
            { num: '04', title: 'Instant Settlement', desc: 'Automated escrow execution, instant invoice dispatch, and immutable ledger provenance recording.', subText: 'Automated Tier-1 Ledger', icon: ShieldCheck }
          ].map((st, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-[24px] p-6 sm:p-8 hover:border-brand/40 transition-colors shadow-soft-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-extrabold font-mono text-brand">{st.num}</span>
                <div className="w-8 h-8 rounded-full border border-dark-border bg-dark-bg flex items-center justify-center text-brand">
                  <st.icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{st.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-grow">{st.desc}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-brand">
                <CheckCircle2 className="w-3 h-3" /> {st.subText}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ENGINEERED FOR CERTAINTY */}
      <section className="bg-zinc-900 border border-dark-border rounded-[32px] p-8 sm:p-12 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="text-[10px] font-mono text-brand uppercase tracking-widest mb-3">Core Architecture</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mb-4 max-w-2xl">
          Engineered for Split-Second Certainty
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mb-12">
          Standard ecommerce backends collapse during live bidding spikes. PulseBid uses memory-mapped event streams and transaction logs to guarantee zero ghost bids.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: 'Real-Time WebSocket Bidding',
              desc: 'Sub-50ms bid updates directly to client browsers via multiplexed persistent sockets with synchronized microsecond-resolution clocks.',
              tags: ['TCP Multiplex', '<50ms P99'],
              icon: Zap
            },
            {
              title: 'Multi-Tenant Isolation',
              desc: 'PostgreSQL row-level security combined with dynamic tenant namespaces, isolated fair-use tables, custom reserve rules, and brand skinning.',
              tags: ['Row-Level RLS', 'Tenant Shards'],
              icon: Building2
            },
            {
              title: 'Zero Race Conditions',
              desc: 'Strict immutable event streaming ensures that simultaneous bids are serialized deterministically. Accidental double-sells are mathematically impossible.',
              tags: ['Kafka Log', 'Distributed Mutex'],
              icon: ShieldCheck
            },
            {
              title: 'Instant Outbid Alerts',
              desc: 'Real-time Pub/Sub, SMS, & in-app sound triggers, and instant 1-tap re-bid mechanics to keep participants active without screen fatigue.',
              tags: ['WebPush API', 'Audio Synthesizer'],
              icon: BellRing
            }
          ].map((f, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:bg-zinc-800/50 transition-colors flex gap-5 items-start">
              <div className="w-10 h-10 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center shrink-0 text-brand mt-1">
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100 mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map(t => (
                    <span key={t} className="px-2 py-1 rounded-md bg-brand/10 text-brand text-[9px] font-mono uppercase font-bold border border-brand/20">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED LIVE LOTS */}
      <section className="py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-[10px] font-mono text-brand uppercase tracking-widest mb-3">Active Cross-Tenant</div>
            <h2 className="text-3xl font-extrabold text-slate-100">Featured Live Lots</h2>
          </div>
          <Link to="/auctions" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-hover transition-colors">
            View All 500+ Active Lots <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: 'https://images.unsplash.com/photo-1503376712394-6d9b0d4bb8e3?auto=format&fit=crop&q=80',
              tag: 'Sotheby\'s Motor Cars',
              title: 'Rare 1968 Porsche 911 S Coupé',
              desc: 'Classic matching numbers, comprehensive rotisserie restoration with original factory certificate.',
              bid: '$142,000',
              est: '$150k - $175k',
              timeLeft: '02h 45m left'
            },
            {
              img: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&q=80',
              tag: 'Christie\'s Editions Ltd',
              title: 'Banksy \'Girl with Balloon\' (2004)',
              desc: 'Numbered edition of 150, hand-signed in pencil. Unframed, authenticated by Pest Control Office.',
              bid: '$34,200',
              est: '$40k - $60k',
              timeLeft: '45m 12s left'
            },
            {
              img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80',
              tag: 'Heritage Wine Vaults',
              title: '1992 Romanée-Conti Grand Cru',
              desc: 'Pristine provenance, cold-cellared since initial French allocation. Extremely rare.',
              bid: '$19,500',
              est: '$22k - $30k',
              timeLeft: '48m 30s left'
            }
          ].map((lot, i) => (
            <div key={i} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden shadow-soft-sm group hover:border-brand/30 transition-all flex flex-col">
              <div className="relative h-48 sm:h-56 overflow-hidden bg-zinc-900 border-b border-dark-border">
                <img src={lot.img} alt={lot.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 bg-dark-bg/80 backdrop-blur text-[9px] font-mono uppercase text-brand px-2 py-1 rounded-md border border-brand/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" /> Live Auction
                </div>
                <div className="absolute top-3 right-3 bg-red-500/90 text-white text-[9px] font-bold uppercase px-2 py-1 rounded-md border border-red-400">
                  {lot.timeLeft}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">{lot.tag}</div>
                <h3 className="text-lg font-bold text-slate-100 leading-tight mb-2">{lot.title}</h3>
                <p className="text-xs text-slate-500 mb-6 flex-grow">{lot.desc}</p>
                <div className="flex items-end justify-between pt-4 border-t border-dark-border mb-6">
                  <div>
                    <div className="text-[9px] font-mono uppercase text-slate-400 mb-1">Current Leading Bid</div>
                    <div className="text-2xl font-extrabold font-mono text-brand">{lot.bid}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono uppercase text-slate-400 mb-1">Estimate</div>
                    <div className="text-xs font-mono font-bold text-slate-300">{lot.est}</div>
                  </div>
                </div>
                {/* For demo purposes, we will make the middle button Yellow to match screenshot design */}
                <Link to="/auctions/demo-lot" className="w-full mt-auto">
                  <Button variant={i === 1 ? 'primary' : 'outline'} className="w-full text-xs py-2.5">
                    <Gavel className="w-3.5 h-3.5 mr-2" /> 
                    {i === 1 ? 'Place Next Bid' : 'Enter Auction Room'}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center sm:hidden">
          <Link to="/auctions" className="text-xs font-bold text-brand flex items-center justify-center gap-1.5">
            View All 500+ Active Lots <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. LOGOS & TESTIMONIAL */}
      <section className="py-8">
        <div className="text-center text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-8">
          Powering High-Frequency Infrastructure For Premier Auction Houses
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-40 grayscale pb-12 border-b border-dark-border">
          <span className="text-sm font-extrabold tracking-widest uppercase font-serif">Barrett-Jackson</span>
          <span className="text-sm font-extrabold tracking-widest uppercase font-serif">Sotheby's</span>
          <span className="text-sm font-extrabold tracking-widest uppercase font-serif">Heritage</span>
          <span className="text-sm font-extrabold tracking-widest uppercase font-serif">Bonhams</span>
          <span className="text-sm font-extrabold tracking-widest uppercase font-serif">Phillips</span>
          <span className="text-sm font-extrabold tracking-widest uppercase font-serif">Wright</span>
        </div>
        
        <div className="max-w-4xl mx-auto mt-16 bg-dark-card border border-dark-border rounded-3xl p-8 sm:p-12 text-center relative">
          <div className="text-6xl text-zinc-800 absolute top-4 left-6 font-serif">"</div>
          <div className="text-6xl text-zinc-800 absolute bottom-[-10px] right-6 font-serif">"</div>
          <p className="text-base sm:text-lg text-slate-300 font-medium italic max-w-2xl mx-auto leading-relaxed relative z-10">
            When a bespoke Patek Philippe crossed $2.4M with 60 bids in 40 seconds, PulseBid handled the micro-ticks with zero socket latency. No collisions, no phantom bids. It's the financial tech stack standard applied to luxury auctions.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="text-brand font-bold">Marcus Vance</span> — Chief Technology Officer, Vance & Horology Fine Arts - London
          </div>
        </div>
      </section>

      {/* 7. FOOTER CTA */}
      <section className="bg-dark-card border border-dark-border rounded-[32px] p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-xl text-center lg:text-left">
          <div className="text-[10px] font-mono text-brand uppercase tracking-widest mb-3 flex items-center justify-center lg:justify-start gap-2">
            <Server className="w-3.5 h-3.5" /> API First Infrastructure
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 mb-4">
            Launch Your Custom Auction Room Today.
          </h2>
          <p className="text-sm text-slate-400">
            Provision dedicated Kafka consumer groups, customize orderbook parameters, or connect via our native TypeScript and Python Webhook SDKs.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <Link to="/signup">
            <Button variant="primary" size="xl" className="w-full sm:w-auto px-8">
              Deploy Free Partition
            </Button>
          </Link>
          <Button variant="outline" size="xl" className="w-full sm:w-auto px-8">
            Read Engine API Docs
          </Button>
        </div>
      </section>
      </div>

    </div>
  );
};
