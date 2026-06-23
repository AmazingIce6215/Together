-- Clerk Auth Migration
-- Changes profiles.id from UUID to TEXT to accept Clerk user IDs
-- Removes FK constraints to auth.users (which no longer exists)

-- Step 1: Drop all RLS policies BEFORE altering columns (policies reference columns)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Members can view their couple" ON couples;
DROP POLICY IF EXISTS "Creator can update their couple" ON couples;
DROP POLICY IF EXISTS "Members can view couple members" ON couple_members;
DROP POLICY IF EXISTS "Users can join a couple" ON couple_members;
DROP POLICY IF EXISTS "Anyone can view quiz categories" ON quiz_categories;
DROP POLICY IF EXISTS "Anyone can view quiz questions" ON quiz_questions;
DROP POLICY IF EXISTS "Members can view their quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Members can insert quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Members can update their quiz sessions" ON quiz_sessions;
DROP POLICY IF EXISTS "Members can view responses in their sessions" ON quiz_responses;
DROP POLICY IF EXISTS "Players can insert their own responses" ON quiz_responses;
DROP POLICY IF EXISTS "Members can view their listen sessions" ON listen_sessions;
DROP POLICY IF EXISTS "Members can manage their listen sessions" ON listen_sessions;
DROP POLICY IF EXISTS "Members can view their focus sessions" ON focus_sessions;
DROP POLICY IF EXISTS "Members can manage their focus sessions" ON focus_sessions;
DROP POLICY IF EXISTS "Members can view focus participants" ON focus_participants;
DROP POLICY IF EXISTS "Members can manage their own participation" ON focus_participants;

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
