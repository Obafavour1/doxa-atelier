// src/features/products/api/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productApi } from "./product.api";
import { productKeys } from "./product.key";
import type { IProduct } from "./product.types";
import { toast } from "react-hot-toast";

export const useProducts = () => {
  return useQuery<IProduct[]>({
    queryKey: productKeys.list(),
    queryFn: () => productApi.getProducts().then((res) => res.data.data.products),
    staleTime: 1000 * 60 * 10,
  });
};

export const useProductsByCategory = (category: string) => {
  return useQuery<IProduct[]>({
    queryKey: productKeys.category(category),
    queryFn: () =>
      productApi.getProductsByCategory(category).then((res) => res.data.data.products),
    staleTime: 1000 * 60 * 10,
    enabled: Boolean(category),
  });
};

export const useFeaturedProducts = () => {
  return useQuery<IProduct[]>({
    queryKey: productKeys.featured(),
    queryFn: () => productApi.getFeaturedProducts().then((res) => res.data.data.products),
    staleTime: 1000 * 60 * 10,
  });
};

export const useRecommendations = () => {
  return useQuery<IProduct[]>({
    queryKey: [...productKeys.all, "recommendations"],
    queryFn: () => productApi.getRecommendations().then((res) => res.data.data.products),
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<IProduct>) => productApi.createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created successfully");
    },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted successfully");
    },
  });
};

export const useToggleFeatured = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.toggleFeatured(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product updated successfully");
    },
  });
};
