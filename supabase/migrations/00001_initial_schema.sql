-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================
-- HELPER FUNCTIONS (bypass RLS to avoid recursion)
-- =====================

CREATE OR REPLACE FUNCTION public.get_user_couple_ids()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT couple_id FROM couple_members WHERE user_id = auth.uid();
$$;

-- =====================
-- TABLES
-- =====================

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Couples (rooms)
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id) NOT NULL
);

-- Couple members (junction)
CREATE TABLE couple_members (
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (couple_id, user_id)
);

-- Quiz categories
CREATE TABLE quiz_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INT DEFAULT 0,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES quiz_categories(id) ON DELETE CASCADE NOT NULL,
  mode TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  difficulty TEXT DEFAULT 'medium',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz sessions (game instances)
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES quiz_categories(id),
  mode TEXT NOT NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'completed')),
  current_question_index INT DEFAULT 0,
  scores JSONB DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Quiz responses (player answers)
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES quiz_sessions(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES quiz_questions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  answer TEXT NOT NULL,
  is_correct BOOLEAN,
  answered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, question_id, user_id)
);

-- Listen together sessions
CREATE TABLE listen_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'playing', 'paused')),
  current_track_id TEXT,
  current_ambient_id TEXT,
  progress_ms INT DEFAULT 0,
  queue JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus together sessions
CREATE TABLE focus_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'focus', 'break', 'completed')),
  focus_duration INT DEFAULT 25,
  break_duration INT DEFAULT 5,
  long_break_duration INT DEFAULT 15,
  sessions_before_long_break INT DEFAULT 4,
  current_session INT DEFAULT 0,
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Focus participants
CREATE TABLE focus_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES focus_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'focusing', 'on_break', 'completed')),
  task TEXT,
  goal TEXT,
  daily_goal_minutes INT DEFAULT 120,
  focus_minutes_today INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- ROW LEVEL SECURITY
-- =====================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE listen_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_participants ENABLE ROW LEVEL SECURITY;

-- =====================
-- POLICIES
-- =====================

-- Profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Couples
CREATE POLICY "Members can view their couple"
  ON couples FOR SELECT
  USING (
    id IN (SELECT get_user_couple_ids())
  );

CREATE POLICY "Creator can update their couple"
  ON couples FOR UPDATE
  USING (auth.uid() = created_by);

-- Couple members
CREATE POLICY "Members can view couple members"
  ON couple_members FOR SELECT
  USING (
    couple_id IN (SELECT get_user_couple_ids())
  );

CREATE POLICY "Users can join a couple"
  ON couple_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Quiz categories
CREATE POLICY "Anyone can view quiz categories"
  ON quiz_categories FOR SELECT
  TO authenticated
  USING (true);

-- Quiz questions
CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- Quiz sessions
CREATE POLICY "Members can view their quiz sessions"
  ON quiz_sessions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = quiz_sessions.couple_id
    )
  );

CREATE POLICY "Members can insert quiz sessions"
  ON quiz_sessions FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = quiz_sessions.couple_id
    )
  );

CREATE POLICY "Members can update their quiz sessions"
  ON quiz_sessions FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = quiz_sessions.couple_id
    )
  );

-- Quiz responses
CREATE POLICY "Members can view responses in their sessions"
  ON quiz_responses FOR SELECT
  USING (
    auth.uid() IN (
      SELECT cm.user_id FROM couple_members cm
      JOIN quiz_sessions qs ON qs.couple_id = cm.couple_id
      WHERE qs.id = quiz_responses.session_id
    )
  );

CREATE POLICY "Players can insert their own responses"
  ON quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Listen sessions
CREATE POLICY "Members can view their listen sessions"
  ON listen_sessions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = listen_sessions.couple_id
    )
  );

CREATE POLICY "Members can manage their listen sessions"
  ON listen_sessions FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = listen_sessions.couple_id
    )
  );

-- Focus sessions
CREATE POLICY "Members can view their focus sessions"
  ON focus_sessions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = focus_sessions.couple_id
    )
  );

CREATE POLICY "Members can manage their focus sessions"
  ON focus_sessions FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM couple_members WHERE couple_id = focus_sessions.couple_id
    )
  );

-- Focus participants
CREATE POLICY "Members can view focus participants"
  ON focus_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM focus_sessions fs
      JOIN couple_members cm ON cm.couple_id = fs.couple_id
      WHERE fs.id = focus_participants.session_id
      AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can manage their own participation"
  ON focus_participants FOR ALL
  USING (auth.uid() = user_id);

-- =====================
-- REAL-TIME
-- =====================

ALTER PUBLICATION supabase_realtime ADD TABLE quiz_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE quiz_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE listen_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE focus_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE focus_participants;
