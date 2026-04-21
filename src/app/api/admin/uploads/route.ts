import { randomUUID } from "node:crypto";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif"
};

function sanitizeFilenameBase(filename: string) {
  const base = path.basename(filename || "", path.extname(filename || ""));
  const normalized = base.normalize("NFKD").replace(/[^\x00-\x7F]/g, "");
  const safe = normalized
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return safe || "image";
}

function getSafeExtension(file: File) {
  const nameExt = path.extname(file.name || "").replace(".", "").toLowerCase();
  const mimeExt = MIME_TO_EXT[file.type];
  const picked = nameExt || mimeExt || "jpg";
  return picked.replace(/[^a-z0-9]/g, "") || "jpg";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "未检测到图片文件" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "仅支持 JPG/PNG/WEBP/GIF 图片" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "图片大小不能超过 5MB" }, { status: 400 });
    }

    const bucket = process.env.SUPABASE_STORAGE_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: "SUPABASE_STORAGE_BUCKET 未配置" }, { status: 500 });
    }

    const extension = getSafeExtension(file);
    const originalBase = sanitizeFilenameBase(file.name || "");
    const timestamp = Date.now();
    const random = randomUUID().replace(/-/g, "").slice(0, 12);
    const objectPath = `uploads/${timestamp}-${random}-${originalBase}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const supabase = getSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: `上传失败: ${uploadError.message}` }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return NextResponse.json(
      {
        data: {
          imageUrl: data.publicUrl,
          path: objectPath,
          filename: `${originalBase}.${extension}`,
          contentType: file.type,
          size: file.size
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "上传失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

