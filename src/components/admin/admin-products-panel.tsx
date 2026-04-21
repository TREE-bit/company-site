"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductForm } from "@/components/admin/product-form";
import type { Product } from "@/types/product";

type ProductsResponse = {
  data: Product[];
  error?: string;
};

export function AdminProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const result = (await response.json()) as ProductsResponse;
      if (!response.ok) {
        throw new Error(result.error ?? "加载失败");
      }
      setProducts(result.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function onDelete(id: string) {
    setDeletingId(id);
    setError("");
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "删除失败");
      }
      setProducts((prev) => prev.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "删除失败");
    } finally {
      setDeletingId(null);
    }
  }

  function onEdit(id: string) {
    setEditingProductId(id);
    setError("");
  }

  function onCancelEdit() {
    setEditingProductId(null);
  }

  async function onSaved() {
    await loadProducts();
    setEditingProductId(null);
  }

  const editingProduct = products.find((item) => item.id === editingProductId) ?? null;

  return (
    <div className="space-y-8">
      <ProductForm editingProduct={editingProduct} onCancelEdit={onCancelEdit} onSaved={onSaved} />

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-2xl font-medium">已创建商品</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">支持在后台快速删除商品。</p>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        {loading ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">加载中...</p>
        ) : products.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--text-muted)]">暂无商品数据。</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {products.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[rgba(6,11,26,0.45)] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{item.shortDescription}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded-lg border border-cyan-400/40 px-4 py-2 text-sm text-cyan-200 transition hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    修改
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="rounded-lg border border-rose-400/40 px-4 py-2 text-sm text-rose-200 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingId === item.id ? "删除中..." : "删除"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
