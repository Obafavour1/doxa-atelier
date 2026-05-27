import mongoose from "mongoose";
import { env } from "../config/env.config.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (retryCount = 5) => {
  let attemptsLeft = retryCount;

  while (attemptsLeft > 0) {
    try {
      const conn = await mongoose.connect(env.MONGO_URI);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      attemptsLeft -= 1;

      if (attemptsLeft <= 0) {
        console.error("Fatal: Could not connect to MongoDB after multiple attempts:", error.message);
        throw error;
      }

      console.warn(
        `MongoDB connection failed. Retrying in 5 seconds... (${attemptsLeft} retries left)`
      );
      await sleep(5000);
    }
  }
};
