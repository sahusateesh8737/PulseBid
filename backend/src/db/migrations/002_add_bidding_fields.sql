-- 002_add_bidding_fields.sql

-- Add concurrency control and bid tracking fields to seats
ALTER TABLE seats ADD COLUMN IF NOT EXISTS current_bid DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE seats ADD COLUMN IF NOT EXISTS current_bidder_id UUID REFERENCES users(id);
ALTER TABLE seats ADD COLUMN IF NOT EXISTS version INT DEFAULT 0;

-- Add idempotency key to bids
ALTER TABLE bids ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'unique_idempotency_key'
    ) THEN
        ALTER TABLE bids ADD CONSTRAINT unique_idempotency_key UNIQUE (idempotency_key);
    END IF;
END $$;
