import cloudinary from "../../config/cloudinary.config.js";
import { redis } from "../../database/redis.config.js";
import Product from "../../database/models/product.model.js";

export const uploadProductImage = async (image, folder = "products") => {
  if (!image) return "";
  const uploadResult = await cloudinary.uploader.upload(image, { folder });
  return uploadResult.secure_url;
};

export const uploadGalleryImages = async (images) => {
  const gallery = [];
  if (images && Array.isArray(images)) {
    for (const img of images) {
      const res = await cloudinary.uploader.upload(img, { folder: "products/gallery" });
      gallery.push({ url: res.secure_url, public_id: res.public_id });
    }
  }
  return gallery;
};

export const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.error("❌ Error updating Redis cache:", error.message);
  }
};

export const deleteCloudinaryImage = async (imageUrl, folder = "products") => {
  if (!imageUrl) return;
  const publicId = imageUrl.split("/").pop().split(".")[0];
  try {
    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch (error) {
    console.error("❌ Error deleting image from Cloudinary:", error);
  }
};
