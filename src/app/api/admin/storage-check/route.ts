import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

export async function GET() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET;
  if (!bucket || !bucket.trim()) {
    return NextResponse.json(
      { ok: false, error: "SUPABASE_STORAGE_BUCKET 未配置，请在环境变量中补充。" },
      { status: 500 }
    );
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase.storage.from(bucket).list("uploads", { limit: 1 });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: `Storage 访问失败: ${error.message}`,
          bucket
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      bucket,
      uploadsPrefixReachable: true,
      sampleCount: data?.length ?? 0
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Storage 检查失败";
    return NextResponse.json({ ok: false, error: message, bucket }, { status: 500 });
  }
}

