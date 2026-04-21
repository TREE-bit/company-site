"use client";

import { FormEvent, useState } from "react";
import { useEffect } from "react";
import type { Product } from "@/types/product";

type FormState = {
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
};

const initialState: FormState = {
  title: "",
  shortDescription: "",
  description: "",
  imageUrl: ""
};

type ProductFormProps = {
  editingProduct?: Product | null;
  onCancelEdit?: () => void;
  onSaved?: () => void;
};

type UploadResponse = {
  error?: string;
  errorCode?: string;
  rawError?: string;
  data?: { imageUrl?: string };
};

function getUploadErrorHint(errorCode?: string, fallback?: string) {
  switch (errorCode) {
    case "STORAGE_INVALID_URL":
      return "上传失败：请检查线上 SUPABASE_URL，必须是 https://<project-ref>.supabase.co（不能带 /rest/v1）。";
    case "STORAGE_BUCKET_NOT_FOUND":
      return "上传失败：未找到 Storage bucket，请检查 SUPABASE_STORAGE_BUCKET 与 Supabase 控制台 bucket 名是否一致。";
    case "STORAGE_PERMISSION_DENIED":
      return "上传失败：Storage 权限不足，请检查 SUPABASE_SERVICE_ROLE_KEY 或 bucket 策略。";
    case "STORAGE_DUPLICATE_OBJECT":
      return "上传失败：文件对象重名，请重试。";
    default:
      return fallback ?? "图片上传失败";
  }
}

export function ProductForm({ editingProduct, onCancelEdit, onSaved }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isEditMode = Boolean(editingProduct);

  useEffect(() => {
    if (!editingProduct) {
      setForm(initialState);
      setSelectedFile(null);
      setMessage("");
      setError("");
      return;
    }

    setForm({
      title: editingProduct.title,
      shortDescription: editingProduct.shortDescription,
      description: editingProduct.description,
      imageUrl: editingProduct.imageUrl
    });
    setSelectedFile(null);
    setMessage("");
    setError("");
  }, [editingProduct]);

  async function onUploadImage() {
    if (!selectedFile) {
      setError("请先选择图片文件");
      return;
    }

    setUploading(true);
    setMessage("");
    setError("");
    try {
      const payload = new FormData();
      payload.set("file", selectedFile);
      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: payload
      });
      const result = (await response.json()) as UploadResponse;
      if (!response.ok || !result.data?.imageUrl) {
        throw new Error(getUploadErrorHint(result.errorCode, result.error));
      }
      setForm((prev) => ({ ...prev, imageUrl: result.data?.imageUrl ?? "" }));
      setMessage("图片上传成功");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "图片上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(isEditMode ? `/api/products/${editingProduct?.id ?? ""}` : "/api/products", {
        method: isEditMode ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "提交失败");
      }

      setMessage(isEditMode ? "商品更新成功" : "商品创建成功");
      if (!isEditMode) {
        setForm(initialState);
      }
      onSaved?.();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <div>
        <h2 className="text-2xl font-medium">{isEditMode ? "修改商品信息" : "新增商品"}</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {isEditMode ? "可重新编辑商品内容并更新图片地址。" : "填写以下信息即可创建新商品。"}
        </p>
      </div>

      <div>
        <label htmlFor="title" className="mb-2 block text-sm text-[var(--text-muted)]">
          标题
        </label>
        <input
          id="title"
          value={form.title}
          onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-white outline-none focus:border-cyan-400"
          placeholder="输入商品标题"
          required
        />
      </div>

      <div>
        <label htmlFor="shortDescription" className="mb-2 block text-sm text-[var(--text-muted)]">
          简短描述
        </label>
        <input
          id="shortDescription"
          value={form.shortDescription}
          onChange={(event) => setForm((prev) => ({ ...prev, shortDescription: event.target.value }))}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-white outline-none focus:border-cyan-400"
          placeholder="一句话描述商品价值"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-2 block text-sm text-[var(--text-muted)]">
          详细描述
        </label>
        <textarea
          id="description"
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="min-h-36 w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-white outline-none focus:border-cyan-400"
          placeholder="输入详细说明"
          required
        />
      </div>

      <div>
        <label htmlFor="imageUrl" className="mb-2 block text-sm text-[var(--text-muted)]">
          商品图片 URL
        </label>
        <input
          id="imageUrl"
          value={form.imageUrl}
          onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
          className="w-full rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 text-white outline-none focus:border-cyan-400"
          placeholder="https://..."
          required
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              setSelectedFile(file);
            }}
            className="max-w-full text-sm text-[var(--text-muted)] file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-400/20 file:px-4 file:py-2 file:text-cyan-100"
          />
          <button
            type="button"
            onClick={onUploadImage}
            disabled={!selectedFile || uploading}
            className="rounded-lg border border-cyan-400/40 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? "上传中..." : "上传图片"}
          </button>
        </div>
      </div>

      {message ? <p className="text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-medium text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "提交中..." : isEditMode ? "保存修改" : "新增商品"}
        </button>
        {isEditMode ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm text-[var(--text-muted)] transition hover:bg-white/5"
          >
            取消修改
          </button>
        ) : null}
      </div>
    </form>
  );
}
