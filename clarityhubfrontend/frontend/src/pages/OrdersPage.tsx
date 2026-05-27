import React from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle,
  ShoppingBag,
  ArrowRight
} from "lucide-react";
import { orderService } from "../services/order.service";
import type { Order } from "../types/api";

const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const configs = {
    pending: { color: 'text-amber-500 bg-amber-500/10', icon: Clock },
    processing: { color: 'text-blue-500 bg-blue-500/10', icon: Truck },
    shipped: { color: 'text-purple-500 bg-purple-500/10', icon: Truck },
    delivered: { color: 'text-rose-500 bg-rose-500/10', icon: CheckCircle2 },
    cancelled: { color: 'text-rose-500 bg-rose-500/10', icon: XCircle },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${config.color} text-[10px] font-bold uppercase tracking-wider`}>
      <Icon size={12} /> {status}
    </span>
  );
};

const UserOrdersPage = () => {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-screen py-24 flex items-center justify-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Your <span className="text-rose-400">Orders</span></h1>
          <p className="text-gray-400 mt-2">Track your shipments and view order history.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
              <ShoppingBag size={40} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">No orders yet</h3>
              <p className="text-gray-400">Your shopping adventures haven't started. Go explore our collections!</p>
            </div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-black font-black rounded-2xl hover:bg-rose-400 transition-all"
            >
              Start Shopping <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-rose-500/30 transition-all group">
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                      <Package size={32} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Order #ORD-{order.id.slice(-6).toUpperCase()}</p>
                      <h4 className="text-lg font-bold text-white mb-1">Placing on {new Date(order.createdAt).toLocaleDateString()}</h4>
                      <p className="text-sm text-gray-400">{order.items.length} items • <span className="text-rose-400 font-bold">$ {order.totalAmount.toFixed(2)}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                    <StatusBadge status={order.status} />
                    <button className="p-3 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                
                {/* Expandable item thumbnails? */}
                <div className="px-8 pb-8 flex gap-3 overflow-x-auto">
                   {order.items.map((item, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden shrink-0">
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrdersPage;
