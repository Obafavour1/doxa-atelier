import axios from "axios";
import { env } from "./env.config.js";

export const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    Authorization: `Bearer ${env.PAYSTACK.SECRET_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});
