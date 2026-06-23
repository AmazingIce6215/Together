-- Fix RLS recursion in couple_members policy
-- Creates a SECURITY DEFINER helper function to break the recursion

CREATE OR REPLACE FUNCTION public.get_user_couple_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT couple_id FROM couple_members WHERE user_id = auth.uid();
$$;

-- Drop the recursive policy
DROP POLICY IF EXISTS "Members can view couple members" ON couple_members;
DROP POLICY IF EXISTS "Members can view their couple" ON couples;

-- Recreate with non-recursive implementation
CREATE POLICY "Members can view their couple"
  ON couples FOR SELECT
  USING (
    id IN (SELECT get_user_couple_ids())
  );

CREATE POLICY "Members can view couple members"
  ON couple_members FOR SELECT
  USING (
    couple_id IN (SELECT get_user_couple_ids())
  );
