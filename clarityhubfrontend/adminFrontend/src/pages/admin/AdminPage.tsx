import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

// import CreateProductForm from "../features/products/components/CreateProductForm";
// import ProductsList from "../features/products/components/ProductsList";
// import AnalyticsTab from "../features/admin/analytics/AnalyticsTab";

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen relative overflow-hidden pt-20">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-4xl font-bold mb-8 text-rose-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Admin Dashboard
        </motion.h1>

        <div className="flex justify-center flex-wrap gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-rose-600 text-white shadow-lg shadow-rose-500/20 scale-105"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />} */}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
