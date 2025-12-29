import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// NOTE:
// We intentionally do NOT import from "@/integrations/supabase/client" here.
// That file is auto-generated and depends on env vars that can briefly be missing
// during provisioning, causing a hard crash on app load.

const FALLBACK_PROJECT_REF = "vstjekfociouizfmuvrj"; // Public project ref (not a secret)
const FALLBACK_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzdGpla2ZvY2lvdWl6Zm11dnJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMDk3NDUsImV4cCI6MjA4MjU4NTc0NX0.ConicQPj64ToBtSnSLyEs_7vujbbw7266TFeMZb0s2Y";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID || FALLBACK_PROJECT_REF;

const url =
  import.meta.env.VITE_SUPABASE_URL ||
  (projectRef ? `https://${projectRef}.supabase.co` : "");

const key =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  // some environments expose this name
  (import.meta.env as any).VITE_SUPABASE_ANON_KEY ||
  FALLBACK_PUBLISHABLE_KEY;

export const isCloudConfigured = Boolean(url && key);

export const cloud: SupabaseClient<Database> = createClient<Database>(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
