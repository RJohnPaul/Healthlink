import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env

// Initialize the GoTrueClient instance
const supabase = createClient(
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL,
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export { supabase }; 