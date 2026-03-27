import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data: users, error: userError } = await supabase.from('profiles').select('*').limit(1);
  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }
  
  if (!users || users.length === 0) {
    console.log('No users found.');
    return;
  }
  
  const user = users[0];
  console.log('User:', user.id, user.full_name);

  // Check user_subject_progress
  const { data: usp, error: uspError } = await supabase
    .from('user_subject_progress')
    .select('*')
    .eq('user_id', user.id);
    
  console.log('user_subject_progress:', usp);
  
  // Check user_chapter_progress
  const { data: ucp, error: ucpError } = await supabase
    .from('user_chapter_progress')
    .select('*')
    .eq('user_id', user.id);
    
  console.log('user_chapter_progress:', ucp);

  // Check chapters
  const { data: ch, error: chError } = await supabase
    .from('chapters')
    .select('id, subject_id, name');
    
  console.log('Total chapters in DB:', ch?.length);
}

check();
