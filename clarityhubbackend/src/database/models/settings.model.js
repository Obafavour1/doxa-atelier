import mongoose from "mongoose";

const storeSettingSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "DOXA Atelier",
    },
    logo: String,
    contactEmail: String,
    contactPhone: String,
    currency: {
      code: { type: String, default: "USD" },
      symbol: { type: String, default: "$" },
    },
    taxConfiguration: {
      enabled: { type: Boolean, default: false },
      taxRate: { type: Number, default: 0 },
    },
    shippingFreeThreshold: {
      type: Number,
      default: 10000,
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },
  },
  { timestamps: true }
);

const StoreSetting = mongoose.model("StoreSetting", storeSettingSchema);

export default StoreSetting;
