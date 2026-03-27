-- Progress Recalculation Trigger

-- Function to update subject progress
CREATE OR REPLACE FUNCTION handle_chapter_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_subject_id uuid;
    v_total_chapters integer;
    v_completed_chapters integer;
BEGIN
    -- Get subject_id for this chapter
    SELECT subject_id INTO v_subject_id FROM chapters WHERE id = NEW.chapter_id;
    
    -- Count total chapters for this subject
    SELECT COUNT(*) INTO v_total_chapters FROM chapters WHERE subject_id = v_subject_id;
    
    -- Count completed chapters for this user and subject
    SELECT COUNT(*) INTO v_completed_chapters 
    FROM user_chapter_progress ucp
    JOIN chapters c ON c.id = ucp.chapter_id
    WHERE ucp.user_id = NEW.user_id 
    AND c.subject_id = v_subject_id
    AND ucp.completed = true;
    
    -- Update or Insert subject progress
    INSERT INTO user_subject_progress (user_id, subject_id, chapters_completed, total_chapters, progress_percentage, updated_at)
    VALUES (
        NEW.user_id, 
        v_subject_id, 
        v_completed_chapters, 
        v_total_chapters, 
        CASE WHEN v_total_chapters > 0 THEN (v_completed_chapters * 100 / v_total_chapters) ELSE 0 END,
        NOW()
    )
    ON CONFLICT (user_id, subject_id) DO UPDATE SET
        chapters_completed = EXCLUDED.chapters_completed,
        total_chapters = EXCLUDED.total_chapters,
        progress_percentage = EXCLUDED.progress_percentage,
        updated_at = NOW();
        
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_chapter_completion ON user_chapter_progress;
CREATE TRIGGER on_chapter_completion
AFTER INSERT OR UPDATE OF completed ON user_chapter_progress
FOR EACH ROW
EXECUTE FUNCTION handle_chapter_completion();
