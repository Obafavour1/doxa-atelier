import mongoose from "mongoose";

const shippingZoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    regions: [String],
    rates: [
      {
        name: String,
        price: Number,
        minOrderAmount: Number,
        maxOrderAmount: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ShippingZone = mongoose.model("ShippingZone", shippingZoneSchema);

export default ShippingZone;
