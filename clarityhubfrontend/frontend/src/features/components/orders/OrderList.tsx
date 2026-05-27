
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import { Link } from "react-router-dom";

interface OrderItem {
  productId: string; // or expanded object
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  products: OrderItem[]; // Depending on backend response
}

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get("/orders/my-orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
     )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-xl font-medium text-white">No orders yet</h3>
        <p className="mt-2 text-gray-400">Start shopping to see your orders here.</p>
        <Link to="/" className="mt-6 inline-block bg-rose-600 text-white px-6 py-2 rounded-md hover:bg-rose-700">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-rose-400 mb-6">My Orders</h2>
      {orders.map((order) => (
        <OrderItemCard key={order._id} order={order} />
      ))}
    </div>
  );
};

const OrderItemCard = ({ order }: { order: Order }) => {
    const [expanded, setExpanded] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending": return "text-yellow-400";
            case "processing": return "text-blue-400";
            case "shipped": return "text-indigo-400";
            case "delivered": return "text-rose-400";
            case "cancelled": return "text-red-400";
            default: return "text-gray-400";
        }
    };
    
    const getStatusIcon = (status: string) => {
         switch (status) {
            case "pending": return <Clock className="h-5 w-5 mr-2 text-yellow-500" />;
            case "processing": return <Package className="h-5 w-5 mr-2 text-blue-500" />;
            case "shipped": return <Truck className="h-5 w-5 mr-2 text-indigo-500" />;
            case "delivered": return <CheckCircle className="h-5 w-5 mr-2 text-rose-500" />;
            case "cancelled": return <XCircle className="h-5 w-5 mr-2 text-red-500" />;
            default: return <Clock className="h-5 w-5 mr-2" />;
        }
    };

    return (
        <motion.div 
            layout
            className="border border-gray-700 rounded-lg bg-gray-800 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer" 
                 onClick={() => setExpanded(!expanded)}>
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                         {getStatusIcon(order.status)}
                         <span className={`font-semibold capitalize ${getStatusColor(order.status)}`}>
                             {order.status}
                         </span>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Order ID: <span className="text-white font-mono">{order._id}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center">
                    <span className="text-xl font-bold text-white mr-4">
                        ${order.totalAmount?.toFixed(2)}
                    </span>
                    {expanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                </div>
            </div>

            {expanded && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-gray-700 bg-gray-900/50 p-4 sm:p-6"
                >
                    <h4 className="text-sm font-medium text-gray-300 mb-4">Items</h4>
                    <ul className="space-y-4">
                        {order.products?.map((product, idx) => (
                             <li key={idx} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <img src={product.image} alt={product.name} className="h-12 w-12 object-cover rounded mr-4 bg-gray-700" />
                                    <div>
                                        <p className="text-white font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-400">Qty: {product.quantity}</p>
                                    </div>
                                </div>
                                <span className="text-white font-medium">${product.price?.toFixed(2)}</span>
                             </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </motion.div>
    );
}

export default OrderList;
