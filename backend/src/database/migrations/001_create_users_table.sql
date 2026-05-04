-- Create users2 table for User2 entity
CREATE TABLE IF NOT EXISTS users2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    last_login DATETIME
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users2_username ON users2(username);
CREATE INDEX IF NOT EXISTS idx_users2_email ON users2(email);
CREATE INDEX IF NOT EXISTS idx_users2_status ON users2(status);
