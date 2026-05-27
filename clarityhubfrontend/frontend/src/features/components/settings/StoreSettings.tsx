
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

interface StoreSettingsData {
  storeName: string;
  currency: string;
}

const StoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettingsData>({
    storeName: "",
    currency: "USD",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get("/settings/store");
        setSettings(res.data);
      } catch (error) {
        // console.error(error);
        // Fallback or ignore if not set
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put("/settings/store", settings);
      toast.success("Store settings updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-10 text-gray-400">Loading settings...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-rose-400 mb-6">Store Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-300">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
              placeholder="My Awesome Store"
            />
          </div>

          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-300">
              Currency
            </label>
            <select
              id="currency"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              {/* Add more currencies as needed */}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default StoreSettings;
