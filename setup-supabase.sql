const SUPABASE_URL = "PASTE_PROJECT_URL_KAU";
const SUPABASE_ANON_KEY = "PASTE_ANON_OR_PUBLISHABLE_KEY_KAU";

window.ARKALAB_SUPABASE_CONFIGURED =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_URL.includes(".supabase.co") &&
  !SUPABASE_URL.includes("PASTE_") &&
  !SUPABASE_ANON_KEY.includes("PASTE_");

window.supabaseClient = window.ARKALAB_SUPABASE_CONFIGURED
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
