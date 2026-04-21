import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "node:fs";
import path from "node:path";

function parseEnv(content) {
  const result = {};
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    result[key] = value;
  }
  return result;
}

async function loadLocalEnv(projectRoot) {
  const envPath = path.join(projectRoot, ".env.local");
  try {
    const raw = await fs.readFile(envPath, "utf8");
    return parseEnv(raw);
  } catch {
    return {};
  }
}

function readRequired(name, env) {
  const value = process.env[name] || env[name];
  if (!value) {
    throw new Error(`${name} 未配置，请先填写 .env.local`);
  }
  return value;
}

async function main() {
  const projectRoot = process.cwd();
  const localEnv = await loadLocalEnv(projectRoot);
  const supabaseUrl = readRequired("SUPABASE_URL", localEnv);
  const serviceRoleKey = readRequired("SUPABASE_SERVICE_ROLE_KEY", localEnv);
  const dataPath = path.join(projectRoot, "data", "products.json");
  const raw = await fs.readFile(dataPath, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    console.log("未发现可迁移商品，已跳过。");
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const rows = parsed.map((item) => ({
    id: item.id,
    title: item.title,
    short_description: item.shortDescription,
    description: item.description,
    image_url: item.imageUrl,
    created_at: item.createdAt || new Date().toISOString(),
    updated_at: item.updatedAt || new Date().toISOString()
  }));

  const { error } = await supabase.from("products").upsert(rows, { onConflict: "id" });
  if (error) {
    throw new Error(`迁移失败: ${error.message}`);
  }

  console.log(`迁移完成，共处理 ${rows.length} 条商品。`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "迁移失败");
  process.exit(1);
});

