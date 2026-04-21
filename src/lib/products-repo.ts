import { randomUUID } from "node:crypto";
import { getSupabaseAdminClient } from "@/lib/supabase-server";
import type { CreateProductInput, Product, UpdateProductInput } from "@/types/product";

type ProductRow = {
  id: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    imageUrl: row.image_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export async function listProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,title,short_description,description,image_url,created_at,updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to list products: ${error.message}`);
  }

  return (data ?? []).map((row) => mapRowToProduct(row as ProductRow));
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,title,short_description,description,image_url,created_at,updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to get product: ${error.message}`);
  }

  return data ? mapRowToProduct(data as ProductRow) : null;
}

function assertNonEmpty(value: string, fieldName: string) {
  if (!value.trim()) {
    throw new Error(`${fieldName} is required`);
  }
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  assertNonEmpty(input.title, "title");
  assertNonEmpty(input.shortDescription, "shortDescription");
  assertNonEmpty(input.description, "description");
  assertNonEmpty(input.imageUrl, "imageUrl");

  const supabase = getSupabaseAdminClient();
  const now = new Date().toISOString();
  const productId = randomUUID();
  const payload = {
    id: productId,
    title: input.title.trim(),
    short_description: input.shortDescription.trim(),
    description: input.description.trim(),
    image_url: input.imageUrl.trim(),
    created_at: now,
    updated_at: now
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id,title,short_description,description,image_url,created_at,updated_at")
    .single();

  if (error || !data) {
    throw new Error(`Failed to create product: ${error?.message ?? "unknown error"}`);
  }

  return mapRowToProduct(data as ProductRow);
}

export async function deleteProductById(id: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("products").delete().eq("id", id).select("id").maybeSingle();

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }

  return Boolean(data?.id);
}

export async function updateProductById(id: string, input: UpdateProductInput): Promise<Product | null> {
  assertNonEmpty(input.title, "title");
  assertNonEmpty(input.shortDescription, "shortDescription");
  assertNonEmpty(input.description, "description");
  assertNonEmpty(input.imageUrl, "imageUrl");

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      title: input.title.trim(),
      short_description: input.shortDescription.trim(),
      description: input.description.trim(),
      image_url: input.imageUrl.trim(),
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("id,title,short_description,description,image_url,created_at,updated_at")
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update product: ${error.message}`);
  }

  return data ? mapRowToProduct(data as ProductRow) : null;
}
