// ISI DENGAN URL DAN KEY SEBENAR DARI DASHBOARD SUPABASE ANDA
const SUPABASE_URL = "https://gantidengancodeanda.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI..."; 

window.ARKALAB_SUPABASE_CONFIGURED =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_URL.includes(".supabase.co") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

window.supabaseClient = window.ARKALAB_SUPABASE_CONFIGURED
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
