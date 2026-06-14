-- Sale rankings table for gamification
CREATE TABLE sale_rankings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sale_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  rank VARCHAR(20) DEFAULT 'ctv' CHECK (rank IN ('ctv', 'bronze', 'silver', 'gold', 'platinum', 'diamond')),
  score INTEGER DEFAULT 0,
  successful_deals INTEGER DEFAULT 0,
  total_leads INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5, 2) DEFAULT 0,
  total_commission_earned DECIMAL(12, 2) DEFAULT 0,
  monthly_leads_target INTEGER DEFAULT 10,
  monthly_deals_target INTEGER DEFAULT 2,
  current_month_leads INTEGER DEFAULT 0,
  current_month_deals INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  promoted_at TIMESTAMPTZ,
  demoted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_sale_rankings_sale ON sale_rankings(sale_id);
CREATE INDEX idx_sale_rankings_rank ON sale_rankings(rank);
CREATE INDEX idx_sale_rankings_score ON sale_rankings(score DESC);

-- Enable RLS
ALTER TABLE sale_rankings ENABLE ROW LEVEL SECURITY;

-- Policies for sale_rankings
CREATE POLICY "sale_rankings_select_own" ON sale_rankings FOR SELECT
  TO authenticated USING (sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "sale_rankings_insert_own" ON sale_rankings FOR INSERT
  TO authenticated WITH CHECK (sale_id = auth.uid());

CREATE POLICY "sale_rankings_update_own" ON sale_rankings FOR UPDATE
  TO authenticated USING (sale_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );