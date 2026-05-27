import React from "react";
import { 
  Plus, 
  Ticket, 
  Trash2, 
  Calendar, 
  Percent, 
  ChevronRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { couponService } from "../../services/admin.service";
import type { Coupon } from "../../types/api";

const AdminCoupons = () => {
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponService.adminGetAll();
        setCoupons(data);
      } catch (error) {
        console.error("Failed to fetch coupons", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await couponService.adminDelete(id);
        setCoupons(coupons.filter(c => c.id !== id));
      } catch (error) {
        console.error("Failed to delete coupon", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-gray-400 mt-1">Manage discount codes and promotional offers.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-500 text-black font-bold hover:bg-rose-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-20 text-gray-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-500">No coupons active.</div>
        ) : (
          coupons.map(coupon => (
            <div key={coupon.id} className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <Ticket size={24} />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${coupon.isActive ? 'bg-rose-500/10 text-rose-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {coupon.isActive ? 'Active' : 'Expired'}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tighter text-white uppercase">{coupon.code}</h3>
                <p className="text-rose-500 font-bold flex items-center gap-1">
                  <Percent size={14} /> {coupon.discount}% Discount
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Expires on</span>
                  <span className="text-sm text-gray-300 font-medium flex items-center gap-1.5">
                    <Calendar size={14} /> {new Date(coupon.expiryDate).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
