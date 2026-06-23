-- Optional seed: 2-3 questions per mode to get started
-- Get category IDs first (run this separately to get the IDs)
-- SELECT id, slug FROM quiz_categories;

-- Replace the category_id values below with actual UUIDs from your quiz_categories table
-- Run: SELECT id, slug FROM quiz_categories; to find the IDs

-- Example questions for 'truth' mode
INSERT INTO quiz_questions (category_id, mode, question, difficulty)
VALUES
  ((SELECT id FROM quiz_categories WHERE slug = 'romantic'), 'truth', 'What was the moment you knew you had feelings for me?', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'romantic'), 'truth', 'What is one thing you wish we did more often?', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'deep'), 'truth', 'What is something you''ve never told anyone?', 'medium'),
  ((SELECT id FROM quiz_categories WHERE slug = 'funny'), 'truth', 'What is your most embarrassing memory?', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'flirty'), 'truth', 'What is something you find irresistible about me?', 'easy');

-- Example questions for 'would_you_rather' mode
INSERT INTO quiz_questions (category_id, mode, question, options, difficulty)
VALUES
  ((SELECT id FROM quiz_categories WHERE slug = 'funny'), 'would_you_rather', 'Would you rather have a pet dinosaur or a pet dragon?', '["Pet dinosaur", "Pet dragon"]', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'funny'), 'would_you_rather', 'Would you rather be able to fly but only 3 feet off the ground, or run at 100mph but only in circles?', '["Fly 3 feet off ground", "Run 100mph in circles"]', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'romantic'), 'would_you_rather', 'Would you rather have a romantic dinner every night or a surprise adventure every weekend?', '["Romantic dinner every night", "Surprise adventure every weekend"]', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'deep'), 'would_you_rather', 'Would you rather know the future or change the past?', '["Know the future", "Change the past"]', 'medium');

-- Example questions for 'never_have_i_ever' mode
INSERT INTO quiz_questions (category_id, mode, question, difficulty)
VALUES
  ((SELECT id FROM quiz_categories WHERE slug = 'funny'), 'never_have_i_ever', 'Never have I ever sung in the shower today', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'funny'), 'never_have_i_ever', 'Never have I ever pretended to laugh at a joke I did not get', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'spicy'), 'never_have_i_ever', 'Never have I ever done something embarrassing trying to impress someone', 'medium');

-- Example questions for 'this_or_that' mode
INSERT INTO quiz_questions (category_id, mode, question, options, difficulty)
VALUES
  ((SELECT id FROM quiz_categories WHERE slug = 'romantic'), 'this_or_that', 'Which do you prefer?', '["Sunset on the beach", "Cozy night by the fireplace"]', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'romantic'), 'this_or_that', 'Which date sounds better?', '["Fancy restaurant", "Homemade picnic"]', 'easy'),
  ((SELECT id FROM quiz_categories WHERE slug = 'movies'), 'this_or_that', 'Which do you prefer?', '["Marathon movies at home", "Opening night in theaters"]', 'easy');

-- Example questions for 'classic' mode (with correct answers)
INSERT INTO quiz_questions (category_id, mode, question, options, correct_answer, difficulty)
VALUES
  ((SELECT id FROM quiz_categories WHERE slug = 'romantic'), 'classic', 'What is the most spoken love language in the world?', '["Words of affirmation", "Quality time", "Physical touch", "Acts of service"]', 'Quality time', 'medium'),
  ((SELECT id FROM quiz_categories WHERE slug = 'movies'), 'classic', 'Which movie won the first-ever Academy Award for Best Picture?', '["Wings", "Sunrise", "The Broadway Melody", "All Quiet on the Western Front"]', 'Wings', 'hard');
