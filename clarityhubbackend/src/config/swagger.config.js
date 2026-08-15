import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env.config.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DOXA Atelier API",
      version: "1.0.0",
      description: "E-commerce API documentation for DOXA Atelier",
      contact: {
        name: "DOXA Atelier Support",
        email: "doxagiftatelier@gmail.com",
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
