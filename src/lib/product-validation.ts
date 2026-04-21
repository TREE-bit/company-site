import type { CreateProductInput, UpdateProductInput } from "@/types/product";

type ProductPayload = Partial<CreateProductInput | UpdateProductInput>;

export function validateProductPayload(payload: ProductPayload) {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const shortDescription =
    typeof payload.shortDescription === "string" ? payload.shortDescription.trim() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const imageUrl = typeof payload.imageUrl === "string" ? payload.imageUrl.trim() : "";

  if (!title) {
    return { ok: false as const, error: "标题不能为空" };
  }
  if (title.length > 120) {
    return { ok: false as const, error: "标题长度不能超过 120 个字符" };
  }
  if (!shortDescription) {
    return { ok: false as const, error: "简短描述不能为空" };
  }
  if (shortDescription.length > 240) {
    return { ok: false as const, error: "简短描述长度不能超过 240 个字符" };
  }
  if (!description) {
    return { ok: false as const, error: "详细描述不能为空" };
  }
  if (description.length > 8000) {
    return { ok: false as const, error: "详细描述长度不能超过 8000 个字符" };
  }
  if (!imageUrl) {
    return { ok: false as const, error: "商品图片 URL 不能为空" };
  }

  try {
    const url = new URL(imageUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { ok: false as const, error: "图片地址必须是 http/https 链接" };
    }
  } catch {
    return { ok: false as const, error: "图片地址格式不正确" };
  }

  return {
    ok: true as const,
    data: {
      title,
      shortDescription,
      description,
      imageUrl
    }
  };
}

