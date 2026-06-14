-- Sale assignments table (for linking sales to buildings/owners)
CREATE TABLE sale_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sale_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  is_primary BOOLEAN DEFAULT false,
  total_deals INTEGER DEFAULT 0,
  total_commission DECIMAL(12, 2) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  response_rate DECIMAL(5, 2) DEFAULT 100.00,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sale_id, building_id)
);

-- Create indexes
CREATE INDEX idx_sale_assignments_sale ON sale_assignments(sale_id);
CREATE INDEX idx_sale_assignments_building ON sale_assignments(building_id);
CREATE INDEX idx_sale_assignments_owner ON sale_assignments(owner_id);
CREATE INDEX idx_sale_assignments_status ON sale_assignments(status);

-- Enable RLS
ALTER TABLE sale_assignments ENABLE ROW LEVEL SECURITY;

-- Policies for sale_assignments
CREATE POLICY "sale_assignments_select_own" ON sale_assignments FOR SELECT
  TO authenticated USING (sale_id = auth.uid() OR owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "sale_assignments_insert_sale" ON sale_assignments FOR INSERT
  TO authenticated WITH CHECK (sale_id = auth.uid());

CREATE POLICY "sale_assignments_update_owner" ON sale_assignments FOR UPDATE
  TO authenticated USING (owner_id = auth.uid() OR sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );