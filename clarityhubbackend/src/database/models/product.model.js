import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Product stock is required"],
      default: 0,
    },
    image: {
      type: String,
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Product category is required"],
    },
    tags: [String],
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        name: String,
        options: [
          {
            value: String,
            price: Number,
            stock: Number,
          },
        ],
      },
    ],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

// Slugify name before validation
productSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^\w-]+/g, "");
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
