-- Migration to add game_progress column to user_chapter_progress
ALTER TABLE user_chapter_progress 
ADD COLUMN IF NOT EXISTS game_progress JSONB DEFAULT '{}'::jsonb;
