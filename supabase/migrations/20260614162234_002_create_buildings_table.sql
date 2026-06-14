-- Buildings table
CREATE TABLE buildings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  district VARCHAR(100) NOT NULL,
  description TEXT,
  total_floors INTEGER DEFAULT 1,
  total_rooms INTEGER DEFAULT 0,
  amenities TEXT[],
  images TEXT[],
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  occupancy_rate DECIMAL(5, 2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_buildings_owner ON buildings(owner_id);
CREATE INDEX idx_buildings_district ON buildings(district);
CREATE INDEX idx_buildings_status ON buildings(status);

-- Enable RLS
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- Policies for buildings
CREATE POLICY "buildings_select_published" ON buildings FOR SELECT
  TO authenticated USING (status = 'active' OR owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'sale'))
  );

CREATE POLICY "buildings_insert_owner" ON buildings FOR INSERT
  TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY "buildings_update_owner" ON buildings FOR UPDATE
  TO authenticated USING (owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "buildings_delete_owner" ON buildings FOR DELETE
  TO authenticated USING (owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );