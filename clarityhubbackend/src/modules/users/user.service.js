import User from "../../database/models/user.model.js";
import Order from "../../database/models/order.model.js";

export const getRepeatCustomerIds = async () => {
  const results = await Order.aggregate([
    { $group: { _id: "$user", count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
  ]);
  return results.map((r) => r._id);
};

export const getHighValueCustomerIds = async (threshold = 50000) => {
  const results = await Order.aggregate([
    { $group: { _id: "$user", totalSpent: { $sum: "$totalAmount" } } },
    { $match: { totalSpent: { $gt: threshold } } },
  ]);
  return results.map((r) => r._id);
};

export const calculateLTV = (orders) => {
  return orders.reduce((total, order) => total + (order.totalAmount || 0), 0);
};
