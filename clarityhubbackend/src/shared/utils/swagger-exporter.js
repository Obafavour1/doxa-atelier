import fs from "fs";
import path from "path";
import { swaggerSpec } from "../../config/swagger.config.js";
import { env } from "../../config/env.config.js";

/**
 * @desc Exports the current Swagger/OpenAPI spec to the docs folder
 */
export const exportSwaggerSpec = () => {
  // Only export in development to avoid issues with ephemeral storage in production
  if (env.NODE_ENV !== "development") {
    return;
  }

  try {
    const docsDir = path.resolve(process.cwd(), "docs");
    
    // Ensure directory exists
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const filePath = path.join(docsDir, "openapi_spec.json");
    const newContent = JSON.stringify(swaggerSpec, null, 2);
    
    // Only write if content has changed to prevent unnecessary nodemon restarts
    if (fs.existsSync(filePath)) {
      const oldContent = fs.readFileSync(filePath, "utf8");
      if (oldContent === newContent) {
        return;
      }
    }
    
    fs.writeFileSync(filePath, newContent);
    console.log("📝 Swagger spec exported to docs/openapi_spec.json");
  } catch (error) {
    console.error("❌ Failed to export Swagger spec:", error.message);
  }
};
