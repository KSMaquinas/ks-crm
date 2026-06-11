import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string
  || 'https://qqlzrysddfiskeejzgrl.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string
  || 'sb_publishable_q8L0k4vYmGOb0qz2ziyZEw_TtRCRT8y';

export const supabase = createClient(url, key);
