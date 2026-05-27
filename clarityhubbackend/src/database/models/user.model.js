import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters"],
      maxLength: [64, "Password cannot have more than 64 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["customer", "admin", "manager", "support"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    lastLogin: {
      type: Date,
    },
    preferredLanguage: {
      type: String,
      default: "en",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    // Two-Factor Authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    recoveryCodes: {
      type: [String],
      select: false,
    },
    // Notification Preferences
    notificationPreferences: {
      emailNotifications: { type: Boolean, default: true },
      orderAlerts: { type: Boolean, default: true },
      refundAlerts: { type: Boolean, default: true },
      weeklySummary: { type: Boolean, default: false },
    },
    // API Keys
    apiKeys: [
      {
        key: { type: String, unique: true, sparse: true },
        name: String,
        createdAt: { type: Date, default: Date.now },
        lastUsedAt: Date,
      },
    ],
    accountVerified: { type: Boolean, default: false },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    // Account Security
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Verification Code
userSchema.methods.generateVerificationCode = function () {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
  return verificationCode;
};

// Generate Reset Password Token
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;
