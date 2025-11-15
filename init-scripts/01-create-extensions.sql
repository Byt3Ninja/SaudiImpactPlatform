-- PostgreSQL initialization script
-- Creates necessary extensions for the application

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for additional cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'PostgreSQL extensions initialized successfully';
END $$;
