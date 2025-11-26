import { createClient } from '@supabase/supabase-js';

// Support both standard Vite env vars and potential direct process.env usage
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing. Please check your Vercel Environment Variables (VITE_SUPABASE_URL, VITE_SUPABASE_KEY).');
}

export const supabase = createClient(supabaseUrl, supabaseKey);