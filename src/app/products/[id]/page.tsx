import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products-repo";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id).catch(() => null);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <img src={product.imageUrl} alt={product.title} className="h-72 w-full object-cover" />
        <div className="p-8">
          <h1 className="text-4xl font-semibold">{product.title}</h1>
          <p className="mt-4 text-lg text-cyan-200">{product.shortDescription}</p>
          <p className="mt-6 whitespace-pre-line text-[var(--text-muted)]">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
