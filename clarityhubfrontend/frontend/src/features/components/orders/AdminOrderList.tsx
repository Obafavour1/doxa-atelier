
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash, Check, X, Truck } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

interface AdminOrder {
  _id: string;
  user: {
      name: string;
      email: string;
  };
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

const AdminOrderList = () => {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get("/orders");
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch admin orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await axiosInstance.patch(`/orders/${id}/status`, { status });
            setOrders(orders.map(o => o._id === id ? { ...o, status: status as any } : o));
            toast.success("Order status updated");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (loading) return <div className="text-center text-gray-400 py-10">Loading orders...</div>;

    return (
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
             <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order ID</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {orders.map((order) => (
                        <tr key={order._id}>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{order._id.substring(0, 8)}...</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                 <div>{order.user?.name}</div>
                                 <div className="text-xs text-gray-500">{order.user?.email}</div>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-rose-400 font-medium">${order.totalAmount.toFixed(2)}</td>
                             <td className="px-6 py-4 whitespace-nowrap">
                                 <select 
                                    className="bg-gray-700 text-white text-xs rounded p-1 border border-gray-600 focus:ring-rose-500 focus:border-rose-500"
                                    value={order.status}
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                 >
                                     <option value="pending">Pending</option>
                                     <option value="processing">Processing</option>
                                     <option value="shipped">Shipped</option>
                                     <option value="delivered">Delivered</option>
                                     <option value="cancelled">Cancelled</option>
                                 </select>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                 <button className="text-blue-400 hover:text-blue-300 mr-2"><Edit className="h-4 w-4" /></button>
                             </td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
    );
};

export default AdminOrderList;
