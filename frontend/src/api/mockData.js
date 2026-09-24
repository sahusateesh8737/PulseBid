/**
 * Demo / Local Fallback Data Store for PulseBid MVP
 * Allows full real-time interactive testing during hackathon review
 */

export const DEMO_TENANTS = [
  { id: 'tenant-alpha', name: 'Apex Electronics', code: 'APEX' },
  { id: 'tenant-beta', name: 'Vanguard Luxury', code: 'VANG' },
  { id: 'tenant-gamma', name: 'Titan Tech Outlet', code: 'TTKN' },
];

export const MOCK_USERS = [
  {
    id: 'usr_admin_1',
    name: 'Sarah Connor',
    email: 'admin@apex.com',
    role: 'ADMIN',
    tenantId: 'tenant-alpha',
    tenantName: 'Apex Electronics',
  },
  {
    id: 'usr_bidder_1',
    name: 'Alex Vance',
    email: 'alex@bidder.io',
    role: 'BIDDER',
    tenantId: 'tenant-alpha',
    tenantName: 'Apex Electronics',
  },
  {
    id: 'usr_bidder_2',
    name: 'Marcus Brody',
    email: 'marcus@bidder.io',
    role: 'BIDDER',
    tenantId: 'tenant-alpha',
    tenantName: 'Apex Electronics',
  },
];

export const INITIAL_AUCTIONS = [
  {
    id: 'auc_001',
    tenantId: 'tenant-alpha',
    title: 'NVIDIA RTX 4090 Founder Edition (Limited Batch)',
    description: 'Flash inventory liquidation auction. High-demand GPU with factory warranty.',
    startingPrice: 1200,
    currentBid: 1450,
    minIncrement: 25,
    totalStock: 5,
    remainingStock: 3,
    status: 'LIVE', // UPCOMING, LIVE, ENDED
    startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // Started 15m ago
    endTime: new Date(Date.now() + 1000 * 60 * 25).toISOString(), // Ends in 25m
    highestBidder: 'Alex Vance',
    highestBidderId: 'usr_bidder_1',
    totalBids: 18,
    bids: [
      { id: 'b_18', amount: 1450, bidderName: 'Alex Vance', timestamp: new Date(Date.now() - 1000 * 30).toISOString() },
      { id: 'b_17', amount: 1425, bidderName: 'Marcus Brody', timestamp: new Date(Date.now() - 1000 * 90).toISOString() },
      { id: 'b_16', amount: 1400, bidderName: 'Elena Rostova', timestamp: new Date(Date.now() - 1000 * 180).toISOString() },
      { id: 'b_15', amount: 1375, bidderName: 'Alex Vance', timestamp: new Date(Date.now() - 1000 * 300).toISOString() },
    ],
    reservations: [
      { id: 'res_1', userId: 'usr_bidder_3', qty: 1, bidPrice: 1400, status: 'RESERVED', createdAt: new Date(Date.now() - 1000 * 400).toISOString() },
      { id: 'res_2', userId: 'usr_bidder_4', qty: 1, bidPrice: 1375, status: 'RESERVED', createdAt: new Date(Date.now() - 1000 * 600).toISOString() },
    ]
  },
  {
    id: 'auc_002',
    tenantId: 'tenant-alpha',
    title: 'Apple MacBook Pro M3 Max 64GB',
    description: 'Refurbished Grade A enterprise workstation stock clearance.',
    startingPrice: 2400,
    currentBid: 2650,
    minIncrement: 50,
    totalStock: 3,
    remainingStock: 1,
    status: 'LIVE',
    startTime: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    endTime: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    highestBidder: 'Elena Rostova',
    highestBidderId: 'usr_bidder_5',
    totalBids: 12,
    bids: [
      { id: 'b_22', amount: 2650, bidderName: 'Elena Rostova', timestamp: new Date(Date.now() - 1000 * 60).toISOString() },
      { id: 'b_21', amount: 2600, bidderName: 'Alex Vance', timestamp: new Date(Date.now() - 1000 * 240).toISOString() },
    ],
    reservations: [
      { id: 'res_3', userId: 'usr_bidder_2', qty: 1, bidPrice: 2550, status: 'RESERVED', createdAt: new Date(Date.now() - 1000 * 800).toISOString() },
      { id: 'res_4', userId: 'usr_bidder_6', qty: 1, bidPrice: 2500, status: 'RESERVED', createdAt: new Date(Date.now() - 1000 * 1200).toISOString() },
    ]
  },
  {
    id: 'auc_003',
    tenantId: 'tenant-alpha',
    title: 'Sony Alpha A7 IV Mirrorless Body',
    description: 'Upcoming scheduled inventory release for registered VIP accounts.',
    startingPrice: 1800,
    currentBid: 1800,
    minIncrement: 20,
    totalStock: 10,
    remainingStock: 10,
    status: 'UPCOMING',
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(), // Starts in 2 hours
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    highestBidder: null,
    highestBidderId: null,
    totalBids: 0,
    bids: [],
    reservations: []
  },
  {
    id: 'auc_004',
    tenantId: 'tenant-beta',
    title: 'Rolex Submariner Date 41mm',
    description: 'Certified pre-owned luxury timepiece auction.',
    startingPrice: 9500,
    currentBid: 11200,
    minIncrement: 100,
    totalStock: 1,
    remainingStock: 0,
    status: 'ENDED',
    startTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    highestBidder: 'Jonathan Wick',
    highestBidderId: 'usr_bidder_9',
    totalBids: 34,
    bids: [
      { id: 'b_99', amount: 11200, bidderName: 'Jonathan Wick', timestamp: new Date(Date.now() - 1000 * 60 * 16).toISOString() },
    ],
    reservations: [
      { id: 'res_99', userId: 'usr_bidder_9', qty: 1, bidPrice: 11200, status: 'RESERVED', createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString() }
    ]
  }
];
