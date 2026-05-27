
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, UserCheck, UserX, User, Mail, ShieldAlert } from "lucide-react";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  status: "active" | "blocked";
  createdAt: string;
}

const CustomerList = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axiosInstance.get("/users/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "active" | "blocked") => {
      try {
          await axiosInstance.patch(`/users/customers/${id}/status`, { status });
          toast.success(`User ${status} successfully`);
          setCustomers(customers.map(c => c._id === id ? { ...c, status } : c));
      } catch (error: any) {
          toast.error(error.response?.data?.message || "Failed to update status");
      }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-center mb-6"
      >
        <h2 className="text-2xl font-bold text-rose-400">Customers</h2>
        
        <div className="relative mt-4 sm:mt-0 w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-gray-600 focus:border-rose-500 focus:ring-rose-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 shadow overflow-hidden border-b border-gray-700 sm:rounded-lg"
        >
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                >
                  Joined
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {filteredCustomers.map((customer) => (
                <motion.tr 
                    key={customer._id}
                    layoutId={customer._id}
                    className="hover:bg-gray-700 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-rose-100 rounded-full flex items-center justify-center">
                        <span className="text-rose-800 font-bold text-lg">
                            {customer.firstName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">{customer.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 flex items-center mb-1">
                        <Mail className="h-4 w-4 mr-2" /> {customer.email}
                    </div>
                    {customer.phone && (
                        <div className="text-sm text-gray-400 flex items-center">
                           <ShieldAlert className="h-4 w-4 mr-2" /> {customer.phone}
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.status === "active"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                     {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     {customer.status === "active" ? (
                         <button 
                            onClick={() => updateStatus(customer._id, "blocked")}
                            className="text-red-400 hover:text-red-300 flex items-center justify-end w-full"
                         >
                            <UserX className="h-4 w-4 mr-1" /> Block
                         </button>
                     ): (
                        <button 
                            onClick={() => updateStatus(customer._id, "active")}
                            className="text-rose-400 hover:text-rose-300 flex items-center justify-end w-full"
                        >
                            <UserCheck className="h-4 w-4 mr-1" /> Activate
                        </button>
                     )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerList;
