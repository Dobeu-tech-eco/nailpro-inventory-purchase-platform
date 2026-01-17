/*
  # Optimize RLS Performance

  ## Performance Improvements
  
  1. **RLS Query Optimization**
     - Wrap all `auth.uid()` calls in `(SELECT auth.uid())` 
     - This prevents PostgreSQL from re-evaluating the function for each row
     - Significantly improves query performance at scale
  
  2. **Policy Reconstruction**
     - Rebuild the two user_profiles policies with optimized auth calls
     - All other policies already use the optimized pattern from previous migrations
  
  ## Technical Details
  - Without SELECT wrapper: auth.uid() is called once per row (N times)
  - With SELECT wrapper: auth.uid() is called once per query (1 time)
  - Performance impact grows linearly with number of rows scanned
*/

-- =====================================================
-- Optimize user_profiles RLS Policies
-- =====================================================

-- Drop existing policies that need optimization
DROP POLICY IF EXISTS "Users can manage profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON user_profiles;

-- Create optimized INSERT policy
CREATE POLICY "Users can manage profiles"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Users can create their own profile during signup
    (SELECT auth.uid()) = user_id
    OR
    -- Owners can create profiles for new team members in their organization
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = (SELECT auth.uid())
        AND organization_id = user_profiles.organization_id
        AND role = 'Owner'
    )
  );

-- Create optimized SELECT policy
CREATE POLICY "Users can view profiles in their organization"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    -- Users can view their own profile
    (SELECT auth.uid()) = user_id
    OR
    -- Users can view profiles of team members in their organization
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = (SELECT auth.uid())
        AND up.organization_id = user_profiles.organization_id
    )
  );