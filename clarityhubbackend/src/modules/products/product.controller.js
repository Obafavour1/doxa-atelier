import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { successResponse } from "../../shared/utils/response.util.js";
import Product from "../../database/models/product.model.js";
import AuditLog from "../../database/models/auditLog.model.js";
import { redis } from "../../database/redis.config.js";
import * as productService from "./product.service.js";

// --- Admin Controllers ---

export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments();
  const products = await Product.find({}).skip(skip).limit(limit).sort("-createdAt");

  return successResponse(res, "Products fetched", {
    products,
    total,
    pages: Math.ceil(total / limit),
  });
});

export const getLowStockProducts = asyncHandler(async (req, res) => {
  const threshold = Number(req.query.threshold) || 10;
  const products = await Product.find({ stock: { $lte: threshold }, status: "active" });
  return successResponse(res, "Low stock products fetched", { products });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, stock, category, sku, status, tags, variants, seo, image, images } = req.body;

  const imageUrl = await productService.uploadProductImage(image);
  const gallery = await productService.uploadGalleryImages(images);

  const product = await Product.create({
    name, description, price: Number(price), discountPrice: discountPrice ? Number(discountPrice) : undefined,
    stock: Number(stock) || 0, category, sku, status: status || "active", tags, variants, seo, image: imageUrl, images: gallery,
  });

  await AuditLog.create({ user: req.user._id, action: `Created product: ${name}`, module: "Products", ipAddress: req.ip });

  return successResponse(res, "Product created successfully", { product }, 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, stock, category, sku, status, tags, variants, seo, image } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  if (name) product.name = name;
  if (description) product.description = description;
  if (category) product.category = category;
  if (sku) product.sku = sku;
  if (price !== undefined) product.price = Number(price);
  if (discountPrice !== undefined) product.discountPrice = Number(discountPrice);
  if (stock !== undefined) product.stock = Number(stock);
  if (status) product.status = status;
  if (tags) product.tags = tags;
  if (variants) product.variants = variants;
  if (seo) product.seo = seo;

  if (image && image.startsWith("data:image")) {
    product.image = await productService.uploadProductImage(image);
  }

  await product.save();
  await AuditLog.create({ user: req.user._id, action: `Updated product: ${product.name}`, module: "Products", ipAddress: req.ip });

  return successResponse(res, "Product updated successfully", { product });
});

export const getAdminProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ErrorHandler("Product not found", 404);
  return successResponse(res, "Product details fetched", { product });
});

export const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { ids, update } = req.body;
  if (!ids || !Array.isArray(ids)) throw new ErrorHandler("Please provide an array of product IDs", 400);

  await Product.updateMany({ _id: { $in: ids } }, { $set: update });
  await AuditLog.create({ user: req.user._id, action: `Bulk updated ${ids.length} products`, module: "Products", ipAddress: req.ip });

  return successResponse(res, `Bulk update successful for ${ids.length} products`);
});

export const bulkDeleteProducts = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) throw new ErrorHandler("Please provide an array of product IDs", 400);

  await Product.deleteMany({ _id: { $in: ids } });
  await AuditLog.create({ user: req.user._id, action: `Bulk deleted ${ids.length} products`, module: "Products", ipAddress: req.ip });

  return successResponse(res, `Bulk delete successful for ${ids.length} products`);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  await productService.deleteCloudinaryImage(product.image);
  await Product.findByIdAndDelete(req.params.id);
  await productService.updateFeaturedProductsCache();

  return successResponse(res, "Product deleted successfully");
});

export const toggleFeaturedProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ErrorHandler("Product not found", 404);

  product.isFeatured = !product.isFeatured;
  await product.save();
  await productService.updateFeaturedProductsCache();

  return successResponse(res, `Product is now ${product.isFeatured ? "featured" : "not featured"}`, { product });
});

// --- Public Controllers ---

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  let cached = await redis.get("featured_products");
  if (cached) return successResponse(res, "Featured products fetched (cache)", { products: JSON.parse(cached) });

  const products = await Product.find({ isFeatured: true }).lean();
  if (!products.length) throw new ErrorHandler("No featured products found", 404);

  await redis.set("featured_products", JSON.stringify(products));
  return successResponse(res, "Featured products fetched", { products });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const products = await Product.find({
    $or: [{ name: { $regex: keyword, $options: "i" } }, { description: { $regex: keyword, $options: "i" } }, { category: { $regex: keyword, $options: "i" } }],
  });
  return successResponse(res, "Search results fetched", { products });
});

export const getRecommendedProducts = asyncHandler(async (req, res) => {
  const products = await Product.aggregate([
    { $sample: { size: 4 } },
    { $project: { _id: 1, name: 1, slug: 1, description: 1, image: 1, price: 1, discountPrice: 1, category: 1 } },
  ]);
  return successResponse(res, "Recommended products fetched", { products });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const total = await Product.countDocuments({ category });
  const products = await Product.find({ category }).skip(skip).limit(limit).sort("-createdAt");

  return successResponse(res, "Category products fetched", { products, total, pages: Math.ceil(total / limit) });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: "active" });
  if (!product) throw new ErrorHandler("Product not found", 404);
  return successResponse(res, "Product details fetched", { product });
});
