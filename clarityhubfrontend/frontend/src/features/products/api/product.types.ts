// src/features/products/api/product.types.ts
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isFeatured?: boolean;
  category: string;
}

export interface ProductsResponse {
  products: IProduct[];
}
