
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axiosInstance from "../../../lib/axios";

// Types
interface AnalyticsData {
  users: number;
  products: number;
  totalSales: number;
  totalRevenue: number;
}

interface DailySalesData {
  name: string; // date
  sales: number;
  revenue: number;
}

const AnalyticsDashboard = () => {
    // Assuming backend returns { analyticsData: ..., salesData: ... } or similar
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    users: 0,
    products: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [dailySalesData, setDailySalesData] = useState<DailySalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await axiosInstance.get("/analytics");
        // Adjust based on actual API response structure
        // If API returns directly the object or nested
        if (response.data.analyticsData) {
            setAnalyticsData(response.data.analyticsData);
            setDailySalesData(response.data.dailySalesData || []);
        } else {
            // Fallback if structure is flat or different
             setAnalyticsData({
                users: response.data.users || 0,
                products: response.data.products || 0,
                totalSales: response.data.totalSales || 0,
                totalRevenue: response.data.totalRevenue || 0,
             });
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (isLoading) {
    return (
       <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
       </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={analyticsData.users.toLocaleString()}
          icon={Users}
          color="from-rose-500 to-teal-700"
        />
        <AnalyticsCard
          title="Total Products"
          value={analyticsData.products.toLocaleString()}
          icon={Package}
          color="from-rose-500 to-rose-700"
        />
        <AnalyticsCard
          title="Total Sales"
          value={analyticsData.totalSales.toLocaleString()}
          icon={ShoppingCart}
          color="from-rose-500 to-cyan-700"
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="from-rose-500 to-lime-700"
        />
      </div>

      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <h3 className="text-xl font-semibold text-rose-400 mb-4">Sales & Revenue Overview</h3>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis yAxisId="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip 
                    contentStyle={{ backgroundColor: "#1F2937", borderColor: "#374151", color: "#F3F4F6" }}
                    itemStyle={{ color: "#F3F4F6" }}
                />
                <Legend />
                <Line
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#10B981"
                activeDot={{ r: 8 }}
                name="Sales"
                strokeWidth={2}
                />
                <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                activeDot={{ r: 8 }}
                name="Revenue"
                strokeWidth={2}
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}

const AnalyticsCard = ({ title, value, icon: Icon, color }: AnalyticsCardProps) => (
  <motion.div
    className={`bg-gray-800 rounded-lg p-6 shadow-lg overflow-hidden relative border border-gray-700`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center relative z-10">
      <div>
        <p className="text-rose-400 text-sm mb-1 font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-white text-3xl font-bold">{value}</h3>
      </div>
       <div className={`p-3 rounded-full bg-gradient-to-br ${color} bg-opacity-20`}>
          <Icon className="h-8 w-8 text-white" />
       </div>
    </div>
      {/* Decorative background element */}
       <div className={`absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-10 blur-xl`} />
  </motion.div>
);

export default AnalyticsDashboard;
