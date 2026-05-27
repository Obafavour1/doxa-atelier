import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.config.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Clarity Store API",
      version: "1.0.0",
      description: "Comprehensive E-commerce API Documentation for Clarity Store",
      contact: {
        name: "Clarity Support",
        email: "support@claritystore.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT || 5000}/api`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "Access token stored in HttpOnly cookie",
        },
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ["./src/modules/**/*.js"], // Scan for annotations in JS files
};

export const swaggerSpec = swaggerJSDoc(options);
