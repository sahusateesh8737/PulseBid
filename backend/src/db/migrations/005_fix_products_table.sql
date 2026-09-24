DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'title'
    ) THEN
        ALTER TABLE products RENAME COLUMN title TO name;
    END IF;
END $$;

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'available';
