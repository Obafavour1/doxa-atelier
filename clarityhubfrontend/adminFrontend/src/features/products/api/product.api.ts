// src/features/products/api/product.api.ts
// import axiosInstance from "../../../shared/lib/apiClient";
import axiosInstance from "../../../api/client";
import type { IProduct } from "./product.types";

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

type ProductsPayload = { products: IProduct[] };
type ProductPayload = { product: IProduct };

export const productApi = {
  getProducts: () => axiosInstance.get<ApiEnvelope<ProductsPayload>>("/products"),
  getProductsByCategory: (category: string) =>
    axiosInstance.get<ApiEnvelope<ProductsPayload>>(`/products/category/${category}`),
  getFeaturedProducts: () => axiosInstance.get<ApiEnvelope<ProductsPayload>>("/products/featured"),
  getRecommendations: () => axiosInstance.get<ApiEnvelope<ProductsPayload>>("/products/recommendations"),
  createProduct: (data: Partial<IProduct>) =>
    axiosInstance.post<ApiEnvelope<ProductPayload>>("/products", data),
  deleteProduct: (id: string) => axiosInstance.delete(`/products/${id}`),
  toggleFeatured: (id: string) =>
    axiosInstance.patch<ApiEnvelope<ProductPayload>>(`/products/${id}`),
};
