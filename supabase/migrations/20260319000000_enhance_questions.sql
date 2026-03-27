-- Enhance questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'conceptual' CHECK (type IN ('conceptual', 'numerical', 'assertion_reason', 'case_based', 'match_following'));
ALTER TABLE questions ADD COLUMN IF NOT EXISTS case_text TEXT;

-- Update existing questions to have a type
UPDATE questions SET type = 'conceptual' WHERE type IS NULL;
