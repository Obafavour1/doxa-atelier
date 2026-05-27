import Order from "../../database/models/order.model.js";
import Product from "../../database/models/product.model.js";
import User from "../../database/models/user.model.js";

export const getAnalyticsStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        refundedAmount: { $sum: { $ifNull: ["$refundDetails.amount", 0] } },
      },
    },
  ]);

  const { totalOrders, totalRevenue, refundedAmount } = salesData[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    refundedAmount: 0,
  };

  const netRevenue = totalRevenue - refundedAmount;
  const aov = totalOrders > 0 ? netRevenue / totalOrders : 0;

  return {
    users: totalUsers,
    products: totalProducts,
    totalOrders,
    totalRevenue: totalRevenue / 100,
    netRevenue: netRevenue / 100,
    refundedAmount: refundedAmount / 100,
    aov: aov / 100,
    conversionRate: 0,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  const dailySalesData = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const dateArray = getDateInRange(startDate, endDate);

  return dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);
    return {
      date,
      totalOrders: foundData?.totalOrders || 0,
      totalRevenue: (foundData?.totalRevenue || 0) / 100,
    };
  });
};

export const getTopSellingProducts = async (limit = 5) => {
  return await Order.aggregate([
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.product",
        totalSold: { $sum: "$products.quantity" },
        revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productDetails" } },
    { $unwind: "$productDetails" },
    { $project: { name: "$productDetails.name", totalSold: 1, revenue: { $divide: ["$revenue", 100] } } },
  ]);
};

export const getSalesByCategory = async () => {
  return await Order.aggregate([
    { $unwind: "$products" },
    { $lookup: { from: "products", localField: "products.product", foreignField: "_id", as: "productInfo" } },
    { $unwind: "$productInfo" },
    {
      $group: {
        _id: "$productInfo.category",
        count: { $sum: "$products.quantity" },
        revenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
      },
    },
    { $project: { category: "$_id", count: 1, revenue: { $divide: ["$revenue", 100] } } },
  ]);
};

const getDateInRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
