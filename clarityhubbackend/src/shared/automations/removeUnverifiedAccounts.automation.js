import cron from "node-cron";
import User from "../../database/models/user.model.js";

export const removeUnverifiedAccounts = () => {
  cron.schedule("*/30 * * * *", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    try {
      const deleted = await User.deleteMany({
        accountVerified: false,
        createdAt: { $lt: thirtyMinutesAgo },
      });
      if (deleted.deletedCount > 0) {
        console.log(`[Automation] Removed ${deleted.deletedCount} unverified accounts.`);
      }
    } catch (error) {
      console.error("[Automation] Error removing unverified accounts:", error.message);
    }
  });
};
