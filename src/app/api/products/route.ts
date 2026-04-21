import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/products-repo";
import { validateProductPayload } from "@/lib/product-validation";
import type { CreateProductInput } from "@/types/product";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ data: products });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateProductInput>;
    const validated = validateProductPayload(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 422 });
    }
    const product = await createProduct(validated.data);

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
