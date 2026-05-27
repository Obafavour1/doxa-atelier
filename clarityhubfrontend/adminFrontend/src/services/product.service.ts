import axiosInstance from "../api/client";
import type { Product } from "../types/api";
export const productService = {
  getFeatured: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products/featured");
    return response.data.data?.products || response.data.products || response.data.data || response.data || [];
  },
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products");
    return response.data.data?.products || response.data.products || response.data.data || response.data || [];
  },
  getRecommendations: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products/recommendations");
    return response.data.data?.products || response.data.products || response.data.data || response.data || [];
  },
  search: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get("/products/search", { params: { q: query } });
    return response.data.data?.products || response.data.products || response.data.data || response.data || [];
  },
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/category/${category}`);
    return response.data.data?.products || response.data.products || response.data.data || response.data || [];
  },
  getBySlug: async (slug: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/slug/${slug}`);
    return response.data.data?.product || response.data.product || response.data.data || response.data;
  },
  getById: async (id: string): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data.data?.product || response.data.product || response.data.data || response.data;
  },
  create: async (data: any) => {
    const response = await axiosInstance.post("/products", data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
  toggleFeatured: async (id: string) => {
    const response = await axiosInstance.patch(`/products/${id}/featured`);
    return response.data;
  },
  getLowStock: async (): Promise<Product[]> => {
    const response = await axiosInstance.get("/products/low-stock");
    return response.data.data?.products || response.data.products || response.data.data || response.data || [];
  },
  bulkUpdate: async (data: any[]) => {
    const response = await axiosInstance.patch("/products/bulk", data);
    return response.data;
  },
  bulkDelete: async (ids: string[]) => {
    const response = await axiosInstance.delete("/products/bulk", { data: { ids } });
    return response.data;
  },
};
