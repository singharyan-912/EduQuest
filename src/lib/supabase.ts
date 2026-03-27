import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  role?: string;
  class: '10' | '12';
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  class: '10' | '12';
  icon: string;
  description: string;
  created_at: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  description: string;
  order_num: number;
  topics: string[];
  content?: any;
  learning_slides?: any[];
  pyq_url?: string;
  created_at: string;
}

export interface UserSubjectProgress {
  id: string;
  user_id: string;
  subject_id: string;
  chapters_completed: number;
  total_chapters: number;
  progress_percentage: number;
  updated_at: string;
}

export interface UserChapterProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  completed: boolean;
  xp_earned: number;
  completed_at?: string;
}
