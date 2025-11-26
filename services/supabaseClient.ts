
import { createClient } from '@supabase/supabase-js';

// Helper to safely get env vars in both Vite (import.meta.env) and Standard (process.env) environments
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseKey = getEnv('VITE_SUPABASE_KEY');

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase keys are missing. Authentication will fail. Check VITE_SUPABASE_URL and VITE_SUPABASE_KEY.');
}
