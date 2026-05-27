import { config } from "dotenv";

config();

const isProd = process.env.NODE_ENV === "production";

const requiredEnvVars = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "CLIENT_URL",
];

const productionOnlyEnvVars = [
  "UPSTASH_REDIS_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "STRIPE_SECRET_KEY",
];

const missingEnvVars = [...requiredEnvVars, ...(isProd ? productionOnlyEnvVars : [])].filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  const message = `Missing critical environment variables: ${missingEnvVars.join(", ")}`;
  if (isProd) {
    throw new Error(message);
  } else {
    console.warn(`[env] ${message}. Using safe development defaults where possible.`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/claritystore",
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || "",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "dev_access_secret",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "dev_refresh_secret",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "sk_test_dummy",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  SMTP: {
    HOST: process.env.SMTP_HOST,
    SERVICE: process.env.SMTP_SERVICE,
    PORT: process.env.SMTP_PORT,
    MAIL: process.env.SMTP_MAIL,
    API_KEY: process.env.BREVO_API_KEY,
    SENDER: process.env.BREVO_SENDER_EMAIL,
    PASSWORD: process.env.SMTP_PASSWORD,
  },
  TWILIO: {
    SID: process.env.TWILIO_SID,
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  },
};
