import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number, // cents
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentAmount: {
      type: Number,
      min: 0,
    },
    paymentCurrency: {
      type: String,
      uppercase: true,
      trim: true,
    },
    exchangeRate: {
      type: Number,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paystackReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentMethod: {
      type: String,
      enum: ["stripe", "paystack"],
      default: "stripe",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    shippingDetails: {
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
      trackingNumber: String,
      carrier: String,
    },
    timeline: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    refundDetails: {
      status: { type: String, enum: ["none", "requested", "partial", "full"], default: "none" },
      amount: Number,
      reason: String,
      processedAt: Date,
    },
  },
  { timestamps: true }
);

// Auto-fill timeline on save
orderSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    this.timeline.push({
      status: this.status,
      message: `Order status changed to ${this.status}`,
    });
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
