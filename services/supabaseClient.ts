import { createClient } from '@supabase/supabase-js';

// Retrieve env vars directly
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_KEY || '';

// Create client independently of whether keys exist initially to prevent build crashes,
// but operations will fail gracefully if keys are missing.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase keys are missing in environment variables. Database features will not work.');
}