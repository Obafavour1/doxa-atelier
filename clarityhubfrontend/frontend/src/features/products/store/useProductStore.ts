import { create } from "zustand";
import type { AxiosError } from "axios";
import axiosInstance from "../../../shared/lib/apiClient";
import toast from "react-hot-toast";

export interface ICategory {
  _id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  isFeatured?: boolean;
  category?: string;
}

interface ProductStore {
  products: ICategory[];
  loading: boolean;
  setProducts: (products: ICategory[]) => void;
  createProduct: (productData: ICategory) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchProductsByCategory: (category: string) => Promise<void>;
  deleteProduct: (productId: string | undefined) => Promise<void>;
  toggleFeaturedProduct: (productId: string | undefined) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/products", productData);
      console.log(res);
      set((state) => ({
        products: [...state.products, res.data],
      }));
      toast.success("Product created successfully");
    } catch (err) {
      handleAxiosError(err, "Failed to create product");
    } finally {
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products");
      set({ products: res.data.products });
      console.log(res);
    } catch (err) {
      handleAxiosError(err, "Failed to fetch products");
    } finally {
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/products/category/${category}`);
      set({ products: res.data.products });
    } catch (err) {
      handleAxiosError(err, "Failed to fetch products by category");
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axiosInstance.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
      }));
      toast.success("Product deleted successfully");
    } catch (err) {
      handleAxiosError(err, "Failed to delete product");
    } finally {
      set({ loading: false });
    }
  },

  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.patch(`/products/${productId}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: res.data.isFeatured }
            : product
        ),
      }));
      toast.success("Product updated successfully");
    } catch (err) {
      handleAxiosError(err, "Failed to update product");
    } finally {
      set({ loading: false });
    }
  },

  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/products/featured");
      set({ products: res.data.products });
    } catch (err) {
      handleAxiosError(err, "Failed to fetch featured products");
    } finally {
      set({ loading: false });
    }
  },
}));

// Common error handler for cleaner code
function handleAxiosError(err: unknown, defaultMessage: string) {
  const error = err as AxiosError<{ message: string }>;
  toast.error(error.response?.data?.message || defaultMessage);
}
