-- Clerk Auth Migration
-- Changes profiles.id from UUID to TEXT to accept Clerk user IDs
-- Removes FK constraints to auth.users (which no longer exists)

-- Step 1: Drop all RLS policies dynamically (exact policy names vary)
DO $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN (
        SELECT tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', rec.policyname, rec.tablename);
    END LOOP;
END $$;

-- Step 2: Disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE couples DISABLE ROW LEVEL SECURITY;
ALTER TABLE couple_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE listen_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE focus_participants DISABLE ROW LEVEL SECURITY;

-- Step 3: Drop FK constraints
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE couples DROP CONSTRAINT IF EXISTS couples_created_by_fkey;
ALTER TABLE couple_members DROP CONSTRAINT IF EXISTS couple_members_user_id_fkey;
ALTER TABLE quiz_categories DROP CONSTRAINT IF EXISTS quiz_categories_created_by_fkey;
ALTER TABLE quiz_questions DROP CONSTRAINT IF EXISTS quiz_questions_created_by_fkey;
ALTER TABLE quiz_sessions DROP CONSTRAINT IF EXISTS quiz_sessions_created_by_fkey;
ALTER TABLE quiz_responses DROP CONSTRAINT IF EXISTS quiz_responses_user_id_fkey;
ALTER TABLE listen_sessions DROP CONSTRAINT IF EXISTS listen_sessions_created_by_fkey;
ALTER TABLE focus_sessions DROP CONSTRAINT IF EXISTS focus_sessions_created_by_fkey;
ALTER TABLE focus_participants DROP CONSTRAINT IF EXISTS focus_participants_user_id_fkey;

-- Step 4: Change key columns to TEXT to accept Clerk IDs
-- Using USING to cast existing UUID values to TEXT
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE couples ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE couple_members ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE quiz_questions ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE quiz_sessions ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE quiz_responses ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE listen_sessions ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE focus_sessions ALTER COLUMN created_by TYPE TEXT;
ALTER TABLE focus_participants ALTER COLUMN user_id TYPE TEXT;

-- Step 5: Drop the helper function (no longer needed)
DROP FUNCTION IF EXISTS public.get_user_couple_ids();
