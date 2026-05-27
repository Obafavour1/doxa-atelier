import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { successResponse } from "../../shared/utils/response.util.js";
import * as analyticsService from "./analytics.service.js";

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const { period = 7 } = req.query;
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - Number(period) * 24 * 60 * 60 * 1000);

  const [stats, dailySales, topProducts, categorySales] = await Promise.all([
    analyticsService.getAnalyticsStats(),
    analyticsService.getDailySalesData(startDate, endDate),
    analyticsService.getTopSellingProducts(),
    analyticsService.getSalesByCategory(),
  ]);

  return successResponse(res, "Dashboard analytics fetched", {
    stats,
    dailySales,
    topProducts,
    categorySales,
  });
});
