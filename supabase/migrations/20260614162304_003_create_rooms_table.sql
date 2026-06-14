-- Rooms table
CREATE TABLE rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  floor INTEGER DEFAULT 1,
  area DECIMAL(10, 2) NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  room_type VARCHAR(50) DEFAULT 'studio' CHECK (room_type IN ('chung_cu_mini', 'studio', '1n1k', '2n1k', 'ccmn_cao_cap', 'can_ho_dich_vu')),
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'deposited', 'rented', 'maintenance')),
  amenities TEXT[],
  images TEXT[],
  description TEXT,
  video_url TEXT,
  deposit_amount DECIMAL(12, 2),
  monthly_fee DECIMAL(12, 2),
  electricity_price DECIMAL(10, 2),
  water_price DECIMAL(10, 2),
  internet_price DECIMAL(10, 2),
  available_date DATE,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(building_id, room_number)
);

-- Create indexes
CREATE INDEX idx_rooms_building ON rooms(building_id);
CREATE INDEX idx_rooms_owner ON rooms(owner_id);
CREATE INDEX idx_rooms_status ON rooms(status);
CREATE INDEX idx_rooms_price ON rooms(price);
CREATE INDEX idx_rooms_area ON rooms(area);
CREATE INDEX idx_rooms_room_type ON rooms(room_type);

-- Enable RLS
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;

-- Policies for rooms
CREATE POLICY "rooms_select_published" ON rooms FOR SELECT
  TO authenticated USING (status IN ('available', 'deposited', 'rented') OR owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'sale'))
  );

CREATE POLICY "rooms_insert_owner" ON rooms FOR INSERT
  TO authenticated WITH CHECK (owner_id = auth.uid());

CREATE POLICY "rooms_update_owner" ON rooms FOR UPDATE
  TO authenticated USING (owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "rooms_delete_owner" ON rooms FOR DELETE
  TO authenticated USING (owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );