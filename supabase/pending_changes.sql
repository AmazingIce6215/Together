-- 1. Add questions array to quiz_sessions
ALTER TABLE quiz_sessions ADD COLUMN IF NOT EXISTS questions UUID[] DEFAULT '{}';

-- 2. Seed quiz categories
INSERT INTO quiz_categories (slug, name, description, icon, color, sort_order)
VALUES
  ('romantic', 'Romantic', 'Questions about love and romance', 'heart', '#FF6B9D', 1),
  ('funny', 'Funny', 'Hilarious questions to make you laugh', 'laugh', '#FFD93D', 2),
  ('deep', 'Deep', 'Thoughtful questions for meaningful conversations', 'brain', '#6C5CE7', 3),
  ('flirty', 'Flirty', 'Playful and teasing questions', 'sparkles', '#FF6B9D', 4),
  ('spicy', 'Spicy', 'Bold and adventurous questions', 'flame', '#FF4757', 5),
  ('movies', 'Movies', 'Test your film knowledge', 'film', '#2ED573', 6),
  ('gaming', 'Gaming', 'For the gamers at heart', 'gamepad-2', '#5352ED', 7),
  ('cars', 'Cars', 'Everything about automobiles', 'car', '#FFA502', 8),
  ('medicine', 'Medicine', 'Medical knowledge challenge', 'stethoscope', '#1E90FF', 9),
  ('architecture', 'Architecture', 'Design and building knowledge', 'building-2', '#A3A3A3', 10),
  ('random-knowledge', 'Random Knowledge', 'General trivia and facts', 'globe', '#2ED573', 11),
  ('ai-generated', 'AI Generated', 'Questions created by artificial intelligence', 'cpu', '#FF6B9D', 12),
  ('custom', 'Custom Quiz', 'Create your own questions', 'edit', '#FFFFFF', 13)
ON CONFLICT (slug) DO NOTHING;

-- 3. Allow authenticated users to insert questions
CREATE POLICY "Users can insert quiz questions"
  ON quiz_questions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);
