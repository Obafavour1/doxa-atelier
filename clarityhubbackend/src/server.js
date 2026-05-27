import app from "./app.js";
import { connectDB } from "./database/db.config.js";
import { env } from "./config/env.config.js";
import { removeUnverifiedAccounts } from "./shared/automations/removeUnverifiedAccounts.automation.js";
import { exportSwaggerSpec } from "./shared/utils/swagger-exporter.js";

const PORT = Number(env.PORT) || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT} || 5000`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Swagger API Docs available at: http://localhost:${PORT}/docs`);

    removeUnverifiedAccounts();
    exportSwaggerSpec();
  });
};

startServer().catch((error) => {
  console.error("Fatal startup error:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  process.exit(1);
});
