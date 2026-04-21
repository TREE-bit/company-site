# ABC Pay Company Site

基于 Next.js + TypeScript + Tailwind CSS 的企业官网项目，包含可部署的商品后台管理能力。

## 功能概览

- 官网页面：`/`、`/products`、`/products/[id]`、`/about`、`/contact`
- 管理后台：`/admin`（基础口令保护）
- 数据存储：Supabase Postgres（`products` 表）
- 图片存储：Supabase Storage（`products` bucket）
- 商品字段：标题、简短描述、详细描述、商品图片 URL

## 本地启动

1. 安装依赖

```bash
npm install
```

2. 配置环境变量

复制 `.env.example` 为 `.env.local`，并配置：

```bash
ADMIN_PASSCODE=your-passcode
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=products
```

3. 启动开发环境

```bash
npm run dev
```

## Supabase 初始化

### 1) 创建数据表

在 Supabase SQL Editor 执行：

```sql
create table if not exists public.products (
  id uuid primary key,
  title text not null,
  short_description text not null,
  description text not null,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_created_at_idx
  on public.products (created_at desc);
```

### 2) 创建图片 Bucket

- 进入 Supabase Storage
- 创建 bucket：`products`（或你在 `SUPABASE_STORAGE_BUCKET` 中配置的名称）
- 建议设置为 Public（便于前台直接展示图片）

## 历史数据迁移（可选）

如果你之前已经在 `data/products.json` 里有商品，可运行：

```bash
npm run migrate:products
```

- 脚本会读取本地 `data/products.json` 并写入 Supabase `products` 表
- 使用 `upsert`（按 `id` 去重），可重复执行
- 执行前请确保 `.env.local` 已配置 `SUPABASE_URL` 与 `SUPABASE_SERVICE_ROLE_KEY`

## 后台访问说明

- 打开 `/admin` 时会触发浏览器基础认证弹窗。
- 用户名可填任意值，密码需等于 `ADMIN_PASSCODE`。
- 支持新增、编辑、删除商品。
- 支持后台上传图片到 Supabase Storage，并自动回填图片 URL。

## 数据流

1. 在 `/admin` 管理商品，调用 `/api/products` 与 `/api/products/:id` 完成 CRUD。
2. 上传图片调用 `/api/admin/uploads`，文件写入 Supabase Storage。
3. `/products` 从 Supabase 读取并展示商品列表。
4. `/products/[id]` 从 Supabase 读取并展示商品详情。

## 线上自检清单

当线上上传图片报错时，建议按以下顺序排查：

1) 访问环境变量检查接口（需后台鉴权）

```bash
GET /api/admin/env-check
```

- 确认 `SUPABASE_URL`、`SUPABASE_SERVICE_ROLE_KEY`、`SUPABASE_STORAGE_BUCKET`、`ADMIN_PASSCODE` 均为 `exists: true`
- `SUPABASE_URL` 应显示为 `https://<project-ref>.supabase.co`（不应包含 `/rest/v1`）

2) 访问 Storage 连通性检查接口（需后台鉴权）

```bash
GET /api/admin/storage-check
```

- 返回 `ok: true` 表示 bucket 可访问
- 若失败会返回明确错误，例如 bucket 名错误或权限问题

3) 再测试后台上传

- 从 `/admin` 选择图片并点击“上传图片”
- 若仍失败，优先检查 Vercel 环境变量是否与本地一致，并确认已重新部署
