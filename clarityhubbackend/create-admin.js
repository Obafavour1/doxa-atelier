import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

import { env } from "./src/config/env.config.js";
import User from "./src/database/models/user.model.js";

const ADMIN_EMAIL = "admin@doxa-atelier.com";
const ADMIN_PASSWORD = "Admin@123";

const createAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected.");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`Admin already exists with email ${ADMIN_EMAIL}.`);
      process.exit(0);
    }

    await User.create({
      firstName: "Store",
      lastName: "Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
      status: "active",
      accountVerified: true,
    });

    console.log(`Admin account created: ${ADMIN_EMAIL}`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();
