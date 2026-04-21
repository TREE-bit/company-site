import { NextResponse } from "next/server";

type EnvStatus = {
  exists: boolean;
  hint: string;
};

function maskValue(name: string, value: string | undefined): EnvStatus {
  if (!value || !value.trim()) {
    return { exists: false, hint: "EMPTY" };
  }

  if (name === "SUPABASE_URL") {
    try {
      const url = new URL(value);
      return { exists: true, hint: `${url.protocol}//${url.host}` };
    } catch {
      return { exists: true, hint: "INVALID_URL_FORMAT" };
    }
  }

  if (name === "SUPABASE_STORAGE_BUCKET") {
    return { exists: true, hint: value };
  }

  return { exists: true, hint: `SET(length=${value.length})` };
}

export async function GET() {
  const statuses = {
    SUPABASE_URL: maskValue("SUPABASE_URL", process.env.SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: maskValue("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_STORAGE_BUCKET: maskValue("SUPABASE_STORAGE_BUCKET", process.env.SUPABASE_STORAGE_BUCKET),
    ADMIN_PASSCODE: maskValue("ADMIN_PASSCODE", process.env.ADMIN_PASSCODE)
  };

  for (const [key, status] of Object.entries(statuses)) {
    console.info(`[env-check] ${key}: ${status.exists ? `OK ${status.hint}` : "MISSING"}`);
  }

  return NextResponse.json({ data: statuses });
}

