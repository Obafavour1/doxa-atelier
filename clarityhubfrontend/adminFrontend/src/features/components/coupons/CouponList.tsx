
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Copy, Check } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
}

const CouponList = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await axiosInstance.get("/coupons");
                setCoupons(res.data);
            } catch (error) {
                console.error("Failed to fetch coupons");
            } finally {
                setLoading(false);
            }
        };
        fetchCoupons();
    }, []);

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Coupon code copied!");
    };

    if (loading) return <div className="text-center py-10 text-gray-400">Loading coupons...</div>;

    if (coupons.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                <Ticket className="mx-auto h-12 w-12 mb-4 opacity-50" />
                No active coupons at the moment.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
                <CouponCard key={coupon._id} coupon={coupon} onCopy={copyToClipboard} />
            ))}
        </div>
    );
};

const CouponCard = ({ coupon, onCopy }: { coupon: Coupon, onCopy: (code: string) => void }) => (
    <motion.div 
        className="relative bg-gradient-to-r from-rose-600 to-teal-600 rounded-lg p-6 shadow-lg overflow-hidden border border-rose-500/50"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
    >
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-2xl font-bold text-white mb-1">{coupon.discount}% OFF</h3>
                <p className="text-rose-100 text-sm">Valid until {new Date(coupon.expiryDate).toLocaleDateString()}</p>
            </div>
            <Ticket className="text-rose-200 h-8 w-8" />
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-md p-3 flex justify-between items-center border border-white/30 border-dashed">
            <span className="font-mono text-lg font-bold text-white tracking-wider">{coupon.code}</span>
            <button 
                onClick={() => onCopy(coupon.code)}
                className="text-white hover:text-rose-200 transition-colors p-1"
                title="Copy Code"
            >
                <Copy className="h-5 w-5" />
            </button>
        </div>
        <div className="mt-2 text-xs text-rose-200 text-center">
            *Terms and conditions apply
        </div>
    </motion.div>
);

export default CouponList;
