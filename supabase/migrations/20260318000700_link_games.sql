-- ==========================================
-- LINKING PHASER GAMES TO CHAPTERS
-- ==========================================

DO $$ 
DECLARE 
    v_motion10_id uuid;
    v_motion12_id uuid;
BEGIN
    SELECT id INTO v_motion10_id FROM chapters WHERE name = 'Motion' LIMIT 1;
    SELECT id INTO v_motion12_id FROM chapters WHERE name = 'Motion in a Plane' LIMIT 1;

    -- Link Projectile Lab to Class 10 Motion
    IF v_motion10_id IS NOT NULL THEN
        UPDATE chapters SET content = jsonb_set(
            COALESCE(content, '{}'::jsonb),
            '{challenge,game}',
            '{"type": "projectile_motion", "config": {"title": "Projectile Lab"}}'::jsonb
        ) WHERE id = v_motion10_id;
    END IF;

    -- Link Projectile Lab to Class 12 Motion in a Plane
    IF v_motion12_id IS NOT NULL THEN
        UPDATE chapters SET content = jsonb_set(
            COALESCE(content, '{}'::jsonb),
            '{challenge,game}',
            '{"type": "projectile_motion", "config": {"title": "Advanced Ballistics Lab"}}'::jsonb
        ) WHERE id = v_motion12_id;
    END IF;

END $$;
