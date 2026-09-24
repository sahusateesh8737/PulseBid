-- 002_add_bidding_fields.sql

-- Add concurrency control and bid tracking fields to seats
ALTER TABLE seats
ADD COLUMN current_bid DECIMAL(10, 2) DEFAULT 0.00,
ADD COLUMN current_bidder_id UUID REFERENCES users(id),
ADD COLUMN version INT DEFAULT 0;

-- Add idempotency key to bids
ALTER TABLE bids
ADD COLUMN idempotency_key VARCHAR(255),
ADD CONSTRAINT unique_idempotency_key UNIQUE (idempotency_key);
