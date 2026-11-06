/* ============================================================
   js/supabase-config.js
   ============================================================
   HOW TO SET UP:
   1. Go to https://supabase.com and create a free project
   2. Dashboard → Project Settings → API
   3. Copy "Project URL" → paste as _SUPABASE_URL below
   4. Copy "anon / public" key → paste as _SUPABASE_KEY below
   5. Run supabase-schema.sql in Dashboard → SQL Editor
   6. Go to Dashboard → Authentication → Users → Add User
      (create your first admin account with email + password)
   7. Then in SQL Editor run:
      INSERT INTO public.admin_profiles (id, email, full_name, role)
      SELECT id, email, 'Your Name', 'super_admin'
      FROM auth.users WHERE email = 'your@email.com';
   ============================================================ */

const _SUPABASE_URL  = 'https://qabochjvuvtdxzlawags.supabase.co';
const _SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYm9jaGp2dXZ0ZHh6bGF3YWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODc2MDQsImV4cCI6MjA5ODA2MzYwNH0.6pt5uX1iBNy6vQWmqCcaP8EEfSUJtzqV8emvWXERoOM';

(function () {
  if (typeof supabase === 'undefined') {
    console.error('[supabase-config] supabase-js not loaded. Make sure the CDN script tag comes before this file.');
    return;
  }
  const { createClient } = supabase;
  window._sb = createClient(_SUPABASE_URL, _SUPABASE_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession:   true,
      detectSessionInUrl: true
    }
  });
})();