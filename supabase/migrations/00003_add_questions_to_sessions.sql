-- Add questions array to quiz_sessions
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS questions UUID[] DEFAULT '{}';
