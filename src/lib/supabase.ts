import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://atxaeburtcznrtkmkyzv.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_5Of6wMtWBB0EP2ObEGeLFQ_usoUx4DY';

// Check if credentials are placeholders or empty
const isConfigured = 
  supabaseUrl && 
  supabaseUrl !== 'MY_SUPABASE_URL' && 
  supabaseAnonKey && 
  supabaseAnonKey !== 'MY_SUPABASE_ANON_KEY';

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isConfigured) {
  console.warn('Supabase credentials not fully configured. Using localStorage fallback.');
}
