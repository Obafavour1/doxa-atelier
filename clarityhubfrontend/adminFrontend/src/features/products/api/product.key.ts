// src/features/products/api/product.key.ts
export const productKeys = {
  all: ["products"] as const,
  list: () => [...productKeys.all, "list"] as const,
  category: (cat: string) => [...productKeys.all, "category", cat] as const,
  featured: () => [...productKeys.all, "featured"] as const,
};
