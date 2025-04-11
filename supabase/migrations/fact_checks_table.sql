-- Create fact_checks table
CREATE TABLE IF NOT EXISTS fact_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE fact_checks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own fact checks
CREATE POLICY "Users can view their own fact checks"
  ON fact_checks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own fact checks
CREATE POLICY "Users can insert their own fact checks"
  ON fact_checks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own fact checks
CREATE POLICY "Users can update their own fact checks"
  ON fact_checks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own fact checks
CREATE POLICY "Users can delete their own fact checks"
  ON fact_checks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX fact_checks_user_id_idx ON fact_checks (user_id);
CREATE INDEX fact_checks_created_at_idx ON fact_checks (created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_fact_checks_updated_at
BEFORE UPDATE ON fact_checks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
