/*
  # Initial Schema: Organizations and Users

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key) - Unique identifier for the organization
      - `name` (text) - Business name
      - `slug` (text) - URL-friendly unique identifier
      - `zip_code` (text) - Primary business ZIP code for local supplier discovery
      - `phone` (text, nullable) - Business phone number
      - `email` (text, nullable) - Business contact email
      - `created_at` (timestamptz) - When the organization was created
      - `updated_at` (timestamptz) - Last update timestamp

    - `locations`
      - `id` (uuid, primary key) - Unique identifier for the location
      - `organization_id` (uuid, foreign key) - Reference to organization
      - `name` (text) - Location name (e.g., "Main Store", "Downtown Branch")
      - `address` (text, nullable) - Street address
      - `city` (text, nullable) - City
      - `state` (text, nullable) - State
      - `zip_code` (text, nullable) - ZIP code
      - `phone` (text, nullable) - Location phone number
      - `is_primary` (boolean) - Whether this is the primary location
      - `created_at` (timestamptz) - When created
      - `updated_at` (timestamptz) - Last update

    - `user_profiles`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - Reference to auth.users
      - `organization_id` (uuid, foreign key) - Reference to organization
      - `first_name` (text) - User's first name
      - `last_name` (text) - User's last name
      - `role` (text) - User role: 'owner', 'manager', 'staff'
      - `created_at` (timestamptz) - When created
      - `updated_at` (timestamptz) - Last update

  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to access their organization's data
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  zip_code text NOT NULL,
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  city text,
  state text,
  zip_code text,
  phone text,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'manager', 'staff')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_locations_organization ON locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_organization ON user_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their organization"
  ON organizations
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their organization if owner or manager"
  ON organizations
  FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Users can insert organizations during signup"
  ON organizations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their organization locations"
  ON locations
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert locations if owner or manager"
  ON locations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Users can update locations if owner or manager"
  ON locations
  FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'manager')
    )
  );

CREATE POLICY "Users can delete locations if owner"
  ON locations
  FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view organization team members"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM user_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own profile during signup"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can insert new team members"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM user_profiles 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );
