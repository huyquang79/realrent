-- Deposits table
CREATE TABLE deposits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
  sale_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_cccd_front_url TEXT,
  customer_cccd_back_url TEXT,
  deposit_amount DECIMAL(12, 2) NOT NULL,
  transfer_receipt_url TEXT,
  notes TEXT,
  owner_notes TEXT,
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'refunded')),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_deposits_room ON deposits(room_id);
CREATE INDEX idx_deposits_sale ON deposits(sale_id);
CREATE INDEX idx_deposits_owner ON deposits(owner_id);
CREATE INDEX idx_deposits_status ON deposits(status);
CREATE INDEX idx_deposits_lead ON deposits(lead_id);

-- Enable RLS
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;

-- Policies for deposits
CREATE POLICY "deposits_select_own" ON deposits FOR SELECT
  TO authenticated USING (sale_id = auth.uid() OR owner_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "deposits_insert_sale" ON deposits FOR INSERT
  TO authenticated WITH CHECK (sale_id = auth.uid());

CREATE POLICY "deposits_update_owner" ON deposits FOR UPDATE
  TO authenticated USING (owner_id = auth.uid() OR sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (owner_id = auth.uid() OR sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );