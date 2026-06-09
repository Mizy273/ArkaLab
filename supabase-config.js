const SUPABASE_URL = "https://izhpnxnhpswvlxbltvqn.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aHBueG5ocHN3dmx4Ymx0dnFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5OTY2MTIsImV4cCI6MjA5NjU3MjYxMn0.GUnrw14BFgJK6nAfYZTyZcWlldcupj6x59UwGkq1xR0"; 

window.ARKALAB_SUPABASE_CONFIGURED =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_URL.includes(".supabase.co") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

window.supabaseClient = window.ARKALAB_SUPABASE_CONFIGURED
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
