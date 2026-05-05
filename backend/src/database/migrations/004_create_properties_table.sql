-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    price DECIMAL(12,2),
    property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'commercial', 'land')),
    bedrooms INTEGER,
    bathrooms INTEGER,
    square_feet INTEGER,
    year_built INTEGER,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold', 'pending', 'rented', 'off_market')),
    listed_by INTEGER, -- User ID who listed this property
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (listed_by) REFERENCES users2(id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_listed_by ON properties(listed_by);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
