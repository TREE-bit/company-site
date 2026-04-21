import Link from "next/link";
import { listProducts } from "@/lib/products-repo";

export default async function ProductsPage() {
  const products = await listProducts().catch(() => []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl font-semibold">产品列表</h1>
      <p className="mt-4 max-w-3xl text-[var(--text-muted)]">
        这里展示通过后台新增的全部商品。点击卡片可查看商品详情。
      </p>

      {products.length === 0 ? (
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
