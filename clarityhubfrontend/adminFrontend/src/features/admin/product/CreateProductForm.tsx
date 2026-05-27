import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "../../products/api/hooks";
import type { IProduct } from "../../products/api/product.types";
import React from "react";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
];

type ProductForm = Omit<IProduct, "_id">;

const CreateProductForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductForm>();

  const createProductMutation = useCreateProduct();

  const handleCreateProduct = async (data: ProductForm) => {
    createProductMutation.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setValue("image", result, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
  };

  const isLoading = createProductMutation.isPending;

  return (
    <motion.div
      className="bg-gray-800 shadow-xl rounded-2xl p-8 mb-8 max-w-xl mx-auto border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-rose-400">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit(handleCreateProduct)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            {...register("name", { required: "Product name is required" })}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all outline-none"
            placeholder="e.g. Premium Denim Jeans"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={3}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all outline-none"
            placeholder="Tell us about the product..."
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              step="0.01"
              {...register("price", { required: "Price is required", valueAsNumber: true })}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-8 pr-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all outline-none"
              placeholder="0.00"
            />
          </div>
          {errors.price && (
            <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all outline-none appearance-none"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="flex items-center justify-center w-full cursor-pointer bg-gray-700/50 py-3 px-4 border-2 border-dashed border-gray-600 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-700 hover:border-rose-500/50 transition-all group"
          >
            <Upload className="h-5 w-5 mr-2 group-hover:text-rose-400 transition-colors" />
            Upload Product Image
          </label>
          {errors.image && (
            <p className="text-red-400 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-5 w-5 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Product
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateProductForm;
