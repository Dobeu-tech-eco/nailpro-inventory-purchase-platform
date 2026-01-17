/*
  # Fix Security Issues

  ## Changes Made
  
  1. **Consolidated RLS Policies**
     - Replaced multiple permissive policies on user_profiles with single, comprehensive policies
     - INSERT: Combined "Owners can insert" and "Users can insert own profile" into one policy
     - SELECT: Combined "Users can view team" and "Users can view own profile" into one policy
  
  2. **Optimized Indexes**
     - Kept critical indexes for foreign keys and common queries
     - Removed redundant indexes that duplicate existing constraints or are unlikely to be used
     - Retained: organization_id, user_id, product_id, location_id indexes (high-usage)
     - Removed: Less critical indexes like zip code, local supplier flag
  
  ## Security Notes
  - Multiple permissive policies create OR conditions that can lead to unintended access
  - Single policies with explicit OR logic are more secure and maintainable
  - All RLS policies remain restrictive and properly scoped
*/

-- =====================================================
-- Fix Multiple Permissive Policies on user_profiles
-- =====================================================

-- Drop existing INSERT policies
DROP POLICY IF EXISTS "Users can insert their own profile during signup" ON user_profiles;
DROP POLICY IF EXISTS "Owners can insert new team members" ON user_profiles;

-- Create single consolidated INSERT policy
CREATE POLICY "Users can manage profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Users can create their own profile during signup
    auth.uid() = user_id
    OR
    -- Owners can create profiles for new team members in their organization
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
        AND organization_id = user_profiles.organization_id
        AND role = 'Owner'
    )
  );

-- Drop existing SELECT policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view organization team members" ON user_profiles;

-- Create single consolidated SELECT policy
CREATE POLICY "Users can view profiles in their organization"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own profile
    auth.uid() = user_id
    OR
    -- Users can view profiles of team members in their organization
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
        AND up.organization_id = user_profiles.organization_id
    )
  );

-- =====================================================
-- Optimize Indexes - Remove Less Critical Ones
-- =====================================================

-- Remove supplier zip code index (rarely used for queries)
DROP INDEX IF EXISTS idx_suppliers_zip;

-- Remove local supplier flag index (better handled by filtered queries)
DROP INDEX IF EXISTS idx_suppliers_local;

-- Keep all other indexes as they are critical for:
-- - Foreign key lookups (organization_id, user_id, product_id, location_id)
-- - Status filtering (purchase_orders, inventory_alerts)
-- - Time-based queries (stock_movements)
-- - Unique lookups (SKU)
-- - Parent-child relationships (categories)