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

function buildSafeStoragePath(file: File) {
  const extension = getSafeExtension(file);
  // Keep processing original filename to avoid trusting raw file.name directly.
  sanitizeFilenameBase(file.name || "");
  const timestamp = Date.now();
  const random = randomUUID().replace(/-/g, "").slice(0, 12);
  return `uploads/${timestamp}-${random}.${extension}`;
}

function isInvalidStoragePath(storagePath: string) {
  return (
    !storagePath ||
    storagePath.startsWith("/") ||
    storagePath.includes("://") ||
    storagePath.includes("\\")
  );
}

function mapUploadError(message: string) {
  const lowered = message.toLowerCase();

  if (lowered.includes("invalid path specified in request url")) {
    return {
      status: 500,
      code: "STORAGE_INVALID_URL",
      message: "上传失败：Supabase URL 配置异常，请检查 SUPABASE_URL 是否为项目根地址。"
    };
  }

  if (lowered.includes("bucket") && lowered.includes("not found")) {
    return {
      status: 500,
      code: "STORAGE_BUCKET_NOT_FOUND",
      message: "上传失败：Storage bucket 不存在，请检查 SUPABASE_STORAGE_BUCKET 配置。"
    };
  }

  if (lowered.includes("row-level security") || lowered.includes("permission")) {
    return {
      status: 403,
      code: "STORAGE_PERMISSION_DENIED",
      message: "上传失败：Storage 权限不足，请检查 service role key 或 bucket 策略。"
    };
  }

  if (lowered.includes("duplicate")) {
    return {
      status: 409,
      code: "STORAGE_DUPLICATE_OBJECT",
      message: "上传失败：同名文件已存在，请重试。"
    };
  }

  return {
    status: 500,
    code: "STORAGE_UPLOAD_FAILED",
    message: `上传失败：${message}`
  };
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

    const objectPath = buildSafeStoragePath(file);
    if (isInvalidStoragePath(objectPath)) {
      return NextResponse.json({ error: "上传失败：生成了非法存储路径", errorCode: "STORAGE_INVALID_OBJECT_PATH" }, { status: 500 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    console.info(
      `[upload-image] bucket=${bucket} objectPath=${objectPath} contentType=${file.type} size=${file.size}`
    );

    const supabase = getSupabaseAdminClient();

    const { error: uploadError } = await supabase.storage.from(bucket).upload(objectPath, buffer, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      const mapped = mapUploadError(uploadError.message);
      console.error(
        `[upload-image] failed bucket=${bucket} objectPath=${objectPath} code=${mapped.code} raw=${uploadError.message}`
      );
      return NextResponse.json(
        { error: mapped.message, errorCode: mapped.code, rawError: uploadError.message },
        { status: mapped.status }
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
    return NextResponse.json(
      {
        data: {
          imageUrl: data.publicUrl,
          path: objectPath,
          filename: path.basename(objectPath),
          contentType: file.type,
          size: file.size
        }
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "上传失败";
    const mapped = mapUploadError(message);
    return NextResponse.json({ error: mapped.message, errorCode: mapped.code, rawError: message }, { status: mapped.status });
  }
}

