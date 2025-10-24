// Custom Supabase client that forces the correct configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Force the correct Supabase project URL - this should override any environment variables
const SUPABASE_URL = 'https://zstxmjpmkhtcqmbladva.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzdHhtanBta2h0Y3FtYmxhZHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMjc1MjEsImV4cCI6MjA3NjkwMzUyMX0.JFvYBj05Yr08tDU_przHMi2fL_M40gBy514SMaFOneg';

console.log('🔧 Custom Supabase Client Configuration:');
console.log('📍 URL:', SUPABASE_URL);
console.log('🔗 Redirect URI:', `${SUPABASE_URL}/auth/v1/callback`);

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Verify the configuration
console.log('✅ Custom Supabase client created');
console.log('🔍 Client URL:', supabase.supabaseUrl);
