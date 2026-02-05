-- Simple Schema - No Complex Constraints
-- Copy and paste this into Supabase SQL Editor

-- 1. Trips Table
CREATE TABLE trips (
  id TEXT PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  destination TEXT NOT NULL,
  country TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'THB',
  notes TEXT,
  cover_image TEXT,
  status TEXT DEFAULT 'planning',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Day Plans Table
CREATE TABLE day_plans (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  user_id UUID,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activities Table
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  day_plan_id TEXT,
  user_id UUID,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  description TEXT,
  estimated_cost NUMERIC,
  booking_required BOOLEAN DEFAULT FALSE,
  booking_url TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Expenses Table
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  user_id UUID,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'THB',
  description TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Documents Table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  user_id UUID,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  confirmation_number TEXT,
  file_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Packing Items Table
CREATE TABLE packing_items (
  id TEXT PRIMARY KEY,
  trip_id TEXT,
  user_id UUID,
  category TEXT NOT NULL,
  item TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  packed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes
CREATE INDEX idx_trips_user_id ON trips(user_id);
CREATE INDEX idx_day_plans_trip_id ON day_plans(trip_id);
CREATE INDEX idx_activities_day_plan_id ON activities(day_plan_id);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX idx_documents_trip_id ON documents(trip_id);
CREATE INDEX idx_packing_items_trip_id ON packing_items(trip_id);
