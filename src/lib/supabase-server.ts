import { createClient } from "@supabase/supabase-js";

function readEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function normalizeSupabaseUrl(rawUrl: string) {
  const unquoted = rawUrl.trim().replace(/^['"]|['"]$/g, "");
  const withProtocol = /^https?:\/\//i.test(unquoted) ? unquoted : `https://${unquoted}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new Error("SUPABASE_URL format is invalid");
  }

  // Always keep only origin; ignore accidental path like /rest/v1 or others.
  return parsed.origin;
}

export function getSupabaseAdminClient() {
  const url = normalizeSupabaseUrl(readEnv("SUPABASE_URL"));
  const serviceRoleKey = readEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

