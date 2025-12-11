-- Create policies to allow reading approved agents and inserting as service role
DROP POLICY IF EXISTS "Admin and service role can manage agents" ON agents;
DROP POLICY IF EXISTS "Public read approved agents" ON agents;

CREATE POLICY "Public read approved agents" ON agents
  FOR SELECT
  USING (approved = true);

-- Allow anyone to insert (will be restricted by application logic)
CREATE POLICY "Allow insert agents" ON agents
  FOR INSERT
  WITH CHECK (true);

-- Allow updates
CREATE POLICY "Allow update agents" ON agents
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

