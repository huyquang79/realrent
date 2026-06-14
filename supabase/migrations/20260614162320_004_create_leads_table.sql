-- Leads table for CRM
CREATE TABLE leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sale_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  customer_note TEXT,
  status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'consulting', 'scheduled', 'viewed', 'deposited', 'success', 'cancelled')),
  source VARCHAR(50),
  interested_districts TEXT[],
  interested_price_range VARCHAR(50),
  interested_area_range VARCHAR(50),
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_leads_sale ON leads(sale_id);
CREATE INDEX idx_leads_room ON leads(room_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_customer_phone ON leads(customer_phone);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies for leads
CREATE POLICY "leads_select_own" ON leads FOR SELECT
  TO authenticated USING (sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM rooms WHERE rooms.id = leads.room_id AND rooms.owner_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "leads_insert_sale" ON leads FOR INSERT
  TO authenticated WITH CHECK (sale_id = auth.uid());

CREATE POLICY "leads_update_sale" ON leads FOR UPDATE
  TO authenticated USING (sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  ) WITH CHECK (sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "leads_delete_own" ON leads FOR DELETE
  TO authenticated USING (sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );