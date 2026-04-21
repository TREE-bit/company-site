"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/types/product";

type ProductsResponse = {
  data?: Product[];
  error?: string;
};

export function ProductsClientView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      const result = (await response.json()) as ProductsResponse;
      if (!response.ok) {
        throw new Error(result.error ?? "加载商品失败");
      }
      setProducts(result.data ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "加载商品失败");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
    const onFocus = () => void loadProducts();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadProducts]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-semibold">产品列表</h1>
      <p className="mt-4 max-w-3xl text-[var(--text-muted)]">这里展示通过后台新增的全部商品。点击卡片可查看商品详情。</p>

      {error ? <p className="mt-6 text-sm text-rose-300">{error}</p> : null}

      {loading ? (
        <p className="mt-8 text-sm text-[var(--text-muted)]">加载中...</p>
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-[var(--text-muted)]">
          暂无商品。请先前往后台 `/admin` 新增商品。
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((item) => (
            <Link
              key={item.id}
              href={`/products/${item.id}`}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition hover:border-cyan-400/40"
            >
              <img src={item.imageUrl} alt={item.title} className="h-44 w-full object-cover" />
              <article className="p-6">
                <h2 className="text-xl font-medium text-cyan-200">{item.title}</h2>
                <p className="mt-3 text-sm text-[var(--text-muted)]">{item.shortDescription}</p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

