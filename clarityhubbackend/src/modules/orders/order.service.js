export const generateOrdersCSV = (orders) => {
  let csv = "Order ID,Customer,Email,Total,Status,Date\n";
  orders.forEach((o) => {
    csv += `${o._id},${o.user?.firstName} ${o.user?.lastName},${o.user?.email},${o.totalAmount / 100},${o.status},${o.createdAt.toISOString()}\n`;
  });
  return csv;
};
