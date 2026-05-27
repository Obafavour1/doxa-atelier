import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MoreVertical,
  Calendar,
  CreditCard,
  RefreshCcw,
  X,
  MapPin,
  ExternalLink,
  Ban
} from "lucide-react";
import { orderService } from "../../services/order.service";
import type { Order } from "../../types/api";
import { toast } from "react-hot-toast";

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    processing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    shipped: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    delivered: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    returned: "bg-gray-500/10 text-gray-400 border-gray-500/20"
  };

  const icons = {
    pending: <Clock size={12} />,
    processing: <RefreshCcw size={12} />,
    shipped: <Truck size={12} />,
    delivered: <CheckCircle2 size={12} />,
    cancelled: <XCircle size={12} />,
    returned: <Ban size={12} />
  };

  const defaultStyle = "bg-gray-500/10 text-gray-400 border-gray-500/20";
  const st = status?.toLowerCase() || "pending";
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${styles[st as keyof typeof styles] || defaultStyle}`}>
      {icons[st as keyof typeof icons] || <Package size={12} />}
      {status}
    </span>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const isPaid = status === "paid";
  const isRefunded = status === "refunded";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${isPaid ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : isRefunded ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
      <CreditCard size={12} /> {status || 'Pending'}
    </span>
  )
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Single Order Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderUpdating, setOrderUpdating] = useState(false);

  // Status & Actions State
  const [shippingData, setShippingData] = useState({ trackingNumber: "", carrier: "" });
  const [refundData, setRefundData] = useState({ amount: 0, reason: "" });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDetails = async (id: string) => {
    setIsModalOpen(true);
    setSelectedOrder(null);
    try {
      const fullOrder = await orderService.getById(id);
      setSelectedOrder(fullOrder);
      setShippingData({ 
        trackingNumber: fullOrder.shippingDetails?.trackingNumber || "", 
        carrier: fullOrder.shippingDetails?.carrier || "" 
      });
      setRefundData({ amount: fullOrder.totalAmount || 0, reason: "" });
    } catch {
      toast.error("Failed to load order details");
      setIsModalOpen(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setOrderUpdating(true);
    try {
      await orderService.updateStatus(selectedOrder._id, newStatus);
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: newStatus } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setOrderUpdating(false);
    }
  };

  const handleUpdateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setOrderUpdating(true);
    try {
      await orderService.updateShipping(selectedOrder._id, shippingData);
      toast.success("Shipping info updated");
      openOrderDetails(selectedOrder._id); // Refresh
    } catch {
      toast.error("Failed to update shipping");
    } finally {
      setOrderUpdating(false);
    }
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !window.confirm(`Issue a refund of $${refundData.amount}?`)) return;
    setOrderUpdating(true);
    try {
      await orderService.processRefund(selectedOrder._id, refundData);
      toast.success("Refund processed successfully!");
      openOrderDetails(selectedOrder._id); // Refresh
    } catch {
      toast.error("Failed to process refund");
    } finally {
      setOrderUpdating(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await orderService.exportOrders();
      const url = window.URL.createObjectURL(new Blob([blob as any]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders_export_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast.success("Export successful");
    } catch {
      toast.error("Failed to export orders");
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(new Set(orders.map(o => o._id)));
    else setSelectedIds(new Set());
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const filteredOrders = orders.filter(o => {
    if(!search) return true;
    const s = search.toLowerCase();
    return o._id?.toLowerCase().includes(s) || o.user?.email?.toLowerCase().includes(s) || o.user?.firstName?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-8 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
            <ShoppingCart size={14} className="text-rose-500" /> Fulfillment
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Orders</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage transactions, fulfillment, and returns.</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={handleExport} className="admin-btn bg-[var(--bg-sidebar)] border border-white/10 text-white hover:border-rose-500/50 hover:text-rose-500 transition-all font-bold">
             <Download size={18} /> Export CSV
           </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-xl shrink-0">
         <div className="flex items-center gap-2 flex-grow max-w-xl px-2">
            <div className="relative flex-grow group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-rose-500 transition-colors" size={16} />
               <input 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 type="text" 
                 placeholder="Search by Order ID, Customer Email processing..." 
                 className="w-full outline-none bg-transparent pl-10 pr-4 py-2 text-sm text-white transition-all font-medium"
               />
            </div>
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
               <Filter size={14} /> Filters
            </button>
         </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center py-32"><div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5">
          <ShoppingCart className="text-gray-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-white">No orders found</h3>
          <p className="text-gray-400 text-sm mt-1">Wait for your next sale to arrive.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden flex-1 flex flex-col bg-[#0A0A0A] shadow-2xl border-white/10">
           <div className="overflow-x-auto flex-1">
             <table className="w-full text-left whitespace-nowrap">
               <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-white/10 shadow-sm">
                 <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                   <th className="px-6 py-4 w-12">
                     <input 
                       type="checkbox" 
                       checked={selectedIds.size === filteredOrders.length && filteredOrders.length > 0}
                       onChange={handleSelectAll}
                       className="w-4 h-4 rounded border-gray-600 text-rose-500 bg-transparent cursor-pointer"
                     />
                   </th>
                   <th className="px-4 py-4 cursor-pointer hover:text-white transition-colors group">Order <ArrowUpDown size={12} className="inline ml-1 opacity-0 group-hover:opacity-100" /></th>
                   <th className="px-4 py-4">Customer</th>
                   <th className="px-4 py-4">Date</th>
                   <th className="px-4 py-4">Payment</th>
                   <th className="px-4 py-4">Fulfillment</th>
                   <th className="px-6 py-4 text-right">Total</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {filteredOrders.map(order => {
                   const isSelected = selectedIds.has(order._id);
                   const date = new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                   return (
                   <tr 
                     key={order._id} 
                     onClick={() => openOrderDetails(order._id)}
                     className={`hover:bg-white/5 cursor-pointer transition-all ${isSelected ? 'bg-rose-500/5' : ''}`}
                   >
                      <td className="px-6 py-4" onClick={(e) => toggleSelect(order._id, e)}>
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-gray-600 text-rose-500 bg-transparent cursor-pointer pointer-events-none"
                        />
                      </td>
                      <td className="px-4 py-4 font-mono text-xs font-bold text-gray-300">
                        #{order._id?.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                             {order.user?.firstName?.[0]}{order.user?.lastName?.[0]}
                           </div>
                           <div className="min-w-0">
                             <p className="text-sm font-bold text-white truncate">{order.user?.firstName} {order.user?.lastName}</p>
                             <p className="text-[10px] text-gray-500 truncate">{order.user?.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                           <Calendar size={14} /> {date}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                         <PaymentBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-4">
                         <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-black text-white">
                        ${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                   </tr>
                 )})}
               </tbody>
             </table>
           </div>
           
           <footer className="flex border-t border-white/10 items-center justify-between p-4 bg-black/20 shrink-0">
             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Showing {filteredOrders.length} records</p>
             <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors"><ChevronLeft size={16} /></button>
                <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors"><ChevronRight size={16} /></button>
             </div>
           </footer>
        </div>
      )}

      {/* Order Details Slideover */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-[#0A0A0A] border-l border-white/10 flex flex-col shadow-2xl animate-slide-left">
            {!selectedOrder ? (
              <div className="flex-1 flex justify-center items-center"><div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>
            ) : (
              <>
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-black">Order #{selectedOrder._id?.slice(-8).toUpperCase()}</h2>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{selectedOrder._id}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto">
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide relative pointer-events-auto">
                {orderUpdating && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
                  </div>
                )}
                
                {/* Status Updater */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                   <div>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Update Status</p>
                     <p className="text-sm font-medium text-gray-300">Change fulfillment stage</p>
                   </div>
                   <select 
                     value={selectedOrder.status || 'pending'}
                     onChange={(e) => handleUpdateStatus(e.target.value)}
                     className="bg-black border border-white/10 text-white text-sm font-bold rounded-xl px-4 py-2 outline-none focus:border-rose-500"
                   >
                     <option value="pending">Pending</option>
                     <option value="processing">Processing</option>
                     <option value="shipped">Shipped</option>
                     <option value="delivered">Delivered</option>
                     <option value="cancelled">Cancelled</option>
                     <option value="returned">Returned</option>
                   </select>
                </div>

                {/* Grid Layout info */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Customer Card */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><ShoppingCart size={14} /> Customer</h3>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 border-l-4 border-l-rose-500">
                      <p className="font-bold text-lg mb-1">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                      <p className="text-sm text-rose-500 font-medium">{selectedOrder.user?.email}</p>
                      {selectedOrder.user?.phone && <p className="text-sm text-gray-400 mt-1">{selectedOrder.user.phone}</p>}
                    </div>
                  </div>

                  {/* Payment Card */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><CreditCard size={14} /> Payment Details</h3>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex flex-col justify-between h-full">
                       <div>
                         <p className="text-xs text-gray-400 mb-1">Method: <span className="font-bold text-white uppercase">{selectedOrder.paymentMethod}</span></p>
                         <p className="text-xs text-gray-400">Total: <span className="font-black text-rose-500 text-xl">${selectedOrder.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></p>
                       </div>
                       <div className="mt-4"><PaymentBadge status={selectedOrder.paymentStatus} /></div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                   <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Package size={14} /> Line Items</h3>
                   <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                     <table className="w-full text-left text-sm">
                       <tbody className="divide-y divide-white/5">
                         {(selectedOrder.products || selectedOrder.items || []).map((item: any, i: number) => {
                           const prod = item.product || {};
                           return (
                           <tr key={i} className="hover:bg-white/5">
                             <td className="p-4">
                               <div className="flex items-center gap-3">
                                  <img src={prod.image || `https://placehold.co/100x100/png?text=ITM`} className="w-10 h-10 rounded-lg object-cover bg-black" />
                                  <span className="font-bold">{prod.name || 'Unknown Product'}</span>
                               </div>
                             </td>
                             <td className="p-4 font-bold text-gray-400 text-center">x{item.quantity}</td>
                             <td className="p-4 font-black text-right">${((item.price || prod.price || 0) * (item.quantity || 1)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                           </tr>
                         )})}
                       </tbody>
                       <tfoot className="bg-black/20">
                         <tr>
                           <td colSpan={2} className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Subtotal</td>
                           <td className="px-4 py-3 text-right font-black">${selectedOrder.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                         </tr>
                       </tfoot>
                     </table>
                   </div>
                </div>

                {/* Shipping & Refund Control Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                   <div className="space-y-3">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Truck size={14} /> Shipping Tracker</h3>
                      <form onSubmit={handleUpdateShipping} className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                         <div>
                           <label className="text-xs font-bold text-gray-400 block mb-1">Carrier Name</label>
                           <input value={shippingData.carrier} onChange={e=>setShippingData({...shippingData, carrier: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-rose-500 outline-none" placeholder="e.g. UPS, FedEx..." />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-gray-400 block mb-1">Tracking Code</label>
                           <input value={shippingData.trackingNumber} onChange={e=>setShippingData({...shippingData, trackingNumber: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:border-rose-500 outline-none" placeholder="1Z9999999..." />
                         </div>
                         <button type="submit" className="w-full py-2 rounded-lg bg-white/10 font-bold text-sm hover:bg-rose-500 hover:text-black transition-colors">Update Shipping</button>
                      </form>
                   </div>

                   <div className="space-y-3">
                      <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Ban size={14} /> Issue Refund</h3>
                      <form onSubmit={handleRefund} className="bg-rose-500/5 rounded-2xl p-5 border border-rose-500/20 space-y-4">
                         <div>
                           <label className="text-xs font-bold text-rose-500/70 block mb-1">Refund Amount ($)</label>
                           <input type="number" step="0.01" max={selectedOrder.totalAmount} value={refundData.amount} onChange={e=>setRefundData({...refundData, amount: parseFloat(e.target.value)})} className="w-full bg-black/50 border border-rose-500/20 rounded-lg px-3 py-2 text-sm text-rose-500 focus:border-rose-500 outline-none" />
                         </div>
                         <div>
                           <label className="text-xs font-bold text-rose-500/70 block mb-1">Reason</label>
                           <input value={refundData.reason} onChange={e=>setRefundData({...refundData, reason: e.target.value})} required className="w-full bg-black/50 border border-rose-500/20 rounded-lg px-3 py-2 text-sm focus:border-rose-500 outline-none" placeholder="Customer request, damaged..." />
                         </div>
                         <button type="submit" disabled={selectedOrder.refundDetails?.status === 'full' || selectedOrder.paymentStatus === 'refunded'} className="w-full py-2 rounded-lg bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Process Refund</button>
                      </form>
                   </div>
                </div>

              </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
