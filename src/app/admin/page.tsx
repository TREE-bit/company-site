import { AdminProductsPanel } from "@/components/admin/admin-products-panel";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-semibold">商品管理后台</h1>
      <p className="mt-4 text-[var(--text-muted)]">
        第二版最小增强：支持新增商品与删除商品，继续使用本地 JSON 存储。
      </p>
      <div className="mt-8">
        <AdminProductsPanel />
      </div>
    </div>
  );
}
