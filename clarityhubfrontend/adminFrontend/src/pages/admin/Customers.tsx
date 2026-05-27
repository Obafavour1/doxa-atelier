import React, { useState, useEffect } from "react";
import { 
  Search, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Filter,
  Download,
  Calendar,
  CreditCard,
  Package,
  ShieldAlert,
  Ban,
  CheckCircle2,
  X,
  ArrowUpDown,
  MoreVertical,
  Activity
} from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { User } from "../../types/api";
import { toast } from "react-hot-toast";

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === 'active';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${isActive ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
      {isActive ? <CheckCircle2 size={12} /> : <Ban size={12} />}
      {status || 'Unknown'}
    </span>
  );
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Detail Panel State
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const openCustomerDetails = async (id: string) => {
    setIsModalOpen(true);
    setSelectedCustomer(null);
    try {
      const details = await adminService.getCustomerDetails(id);
      setSelectedCustomer(details);
    } catch {
      toast.error("Failed to load customer profile");
      setIsModalOpen(false);
    }
  };

  const handleUpdateStatus = async (newStatus: 'active' | 'blocked') => {
    if (!selectedCustomer?.profile) return;
    setStatusUpdating(true);
    try {
      await adminService.updateCustomerStatus(selectedCustomer.profile._id, newStatus);
      const updatedProfile = { ...selectedCustomer.profile, status: newStatus };
      setSelectedCustomer({ ...selectedCustomer, profile: updatedProfile });
      
      // Update local grid state
      setCustomers(customers.map(c => c._id === updatedProfile._id ? updatedProfile : c));
      toast.success(`Customer account has been ${newStatus}.`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    if(!search) return true;
    const s = search.toLowerCase();
    return c.email?.toLowerCase().includes(s) || c.firstName?.toLowerCase().includes(s) || c.lastName?.toLowerCase().includes(s) || c._id?.toLowerCase().includes(s);
  });

  return (
    <div className="space-y-8 h-full flex flex-col">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest mb-2">
            <UserIcon size={14} className="text-[#3b82f6]" /> CRM
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">Customers</h1>
          <p className="text-[var(--text-secondary)] mt-1 font-medium">Manage user profiles, viewing habits, and restrictions.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="admin-btn bg-[var(--bg-sidebar)] border border-white/10 text-white hover:border-[#3b82f6]/50 hover:text-[#3b82f6] transition-all font-bold">
             <Download size={18} /> Export List
           </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 bg-[#0A0A0A] rounded-2xl border border-white/10 shadow-xl shrink-0">
         <div className="flex items-center gap-2 flex-grow max-w-xl px-2">
            <div className="relative flex-grow group">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#3b82f6] transition-colors" size={16} />
               <input 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 type="text" 
                 placeholder="Search by name, email, or user ID..." 
                 className="w-full outline-none bg-transparent pl-10 pr-4 py-2 text-sm text-white transition-all font-medium"
               />
            </div>
            <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
               <Filter size={14} /> Filter Segment
            </button>
         </div>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center py-32"><div className="animate-spin w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full" /></div>
      ) : filteredCustomers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/5">
          <UserIcon className="text-gray-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-white">No customers found</h3>
          <p className="text-gray-400 text-sm mt-1">Adjust your search or wait for new sign-ups.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden flex-1 flex flex-col bg-[#0A0A0A] shadow-2xl border-white/10">
           <div className="overflow-x-auto flex-1">
             <table className="w-full text-left whitespace-nowrap">
               <thead className="sticky top-0 bg-[#0A0A0A] z-10 border-b border-white/10 shadow-sm">
                 <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                   <th className="px-6 py-4 cursor-pointer hover:text-white transition-colors group">Customer <ArrowUpDown size={12} className="inline ml-1 opacity-0 group-hover:opacity-100" /></th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4">Joined Date</th>
                   <th className="px-6 py-4">Account Verified</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {filteredCustomers.map(customer => {
                   const date = new Date(customer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
                   return (
                   <tr 
                     key={customer._id} 
                     onClick={() => openCustomerDetails(customer._id)}
                     className="hover:bg-white/5 cursor-pointer transition-all"
                   >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center font-bold text-sm uppercase shrink-0">
                             {customer.firstName?.[0]}{customer.lastName?.[0]}
                           </div>
                           <div className="min-w-0">
                             <p className="text-sm font-bold text-white truncate">{customer.firstName} {customer.lastName}</p>
                             <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5"><Mail size={10}/> {customer.email}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <StatusBadge status={customer.status} />
                      </td>
                      <td className="px-6 py-4 font-medium text-xs text-gray-400">
                         {date}
                      </td>
                      <td className="px-6 py-4">
                         {customer.accountVerified ? (
                           <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500"><CheckCircle2 size={14}/> Verified</span>
                         ) : (
                           <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500"><ShieldAlert size={14}/> Pending</span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 rounded-lg bg-transparent text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                           <MoreVertical size={16} />
                        </button>
                      </td>
                   </tr>
                 )})}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {/* Customer Profile Slideover */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl h-full bg-[#0A0A0A] border-l border-white/10 flex flex-col shadow-2xl animate-slide-left">
            {!selectedCustomer ? (
              <div className="flex-1 flex justify-center items-center"><div className="animate-spin w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full" /></div>
            ) : (
              <>
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/20 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6]/20 text-[#3b82f6] flex items-center justify-center font-bold text-lg uppercase shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                     {selectedCustomer.profile?.firstName?.[0]}{selectedCustomer.profile?.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-black flex items-center gap-2">
                       {selectedCustomer.profile?.firstName} {selectedCustomer.profile?.lastName}
                       <StatusBadge status={selectedCustomer.profile?.status} />
                    </h2>
                    <p className="text-xs text-gray-500 font-mono mt-1">ID: {selectedCustomer.profile?._id}</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors pointer-events-auto">
                  <X size={20} className="text-gray-400 hover:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide relative pointer-events-auto">
                {statusUpdating && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-[#3b82f6] border-t-transparent rounded-full" />
                  </div>
                )}

                {/* KPI Stats */}
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                     <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6] rounded-xl"><Package size={20}/></div>
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Orders</p>
                       <p className="text-2xl font-black mt-1">{selectedCustomer.stats?.totalOrders || 0}</p>
                     </div>
                   </div>
                   <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                     <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl"><CreditCard size={20}/></div>
                     <div>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lifetime Value</p>
                       <p className="text-2xl font-black mt-1 text-rose-500">${(selectedCustomer.stats?.totalSpent || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                     </div>
                   </div>
                </div>

                {/* Profile Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><UserIcon size={14} /> Contact Details</h3>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Email Address</p>
                        <p className="text-sm font-bold flex items-center gap-2"><Mail size={14} className="text-[#3b82f6]"/> {selectedCustomer.profile?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                        <p className="text-sm font-bold flex items-center gap-2"><Phone size={14} className="text-[#3b82f6]"/> {selectedCustomer.profile?.phone || 'Not Provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Created At</p>
                        <p className="text-sm font-bold flex items-center gap-2"><Calendar size={14} className="text-[#3b82f6]"/> {new Date(selectedCustomer.profile?.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Settings / Actions */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={14} /> Security & Actions</h3>
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-full flex flex-col justify-between space-y-4">
                       <div className="space-y-3 text-sm font-medium text-gray-300">
                          <div className="flex justify-between items-center">
                            <span>Email Verified</span>
                            {selectedCustomer.profile?.accountVerified ? <CheckCircle2 size={16} className="text-rose-500"/> : <Ban size={16} className="text-rose-500"/>}
                          </div>
                          <div className="flex justify-between items-center">
                            <span>2FA Enabled</span>
                            {selectedCustomer.profile?.twoFactorEnabled ? <CheckCircle2 size={16} className="text-rose-500"/> : <Ban size={16} className="text-rose-500"/>}
                          </div>
                       </div>
                       
                       {/* Control Panel */}
                       <div className="pt-4 border-t border-white/10">
                         {selectedCustomer.profile?.status === 'active' ? (
                           <button onClick={() => handleUpdateStatus('blocked')} className="w-full py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                             <Ban size={16}/> Block Account
                           </button>
                         ) : (
                           <button onClick={() => handleUpdateStatus('active')} className="w-full py-2 bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                             <CheckCircle2 size={16}/> Activate Account
                           </button>
                         )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Order History Trace */}
                <div className="space-y-3 pb-12">
                   <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Activity size={14} /> Recent Orders</h3>
                   <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                     {(selectedCustomer.orderHistory || []).length === 0 ? (
                       <div className="p-8 text-center text-gray-500 text-sm font-medium">No order history available for this user.</div>
                     ) : (
                       <table className="w-full text-left text-sm whitespace-nowrap">
                         <tbody className="divide-y divide-white/5">
                           {selectedCustomer.orderHistory.map((order: any) => (
                             <tr key={order._id} className="hover:bg-white/5">
                               <td className="p-4 font-mono text-xs font-bold text-gray-400">#{order._id.slice(-8).toUpperCase()}</td>
                               <td className="p-4 font-bold text-rose-500">${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                               <td className="p-4 text-xs font-bold uppercase tracking-widest text-gray-500"><span className="px-2 py-1 bg-white/5 rounded uppercase">{order.status}</span></td>
                               <td className="p-4 text-right text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     )}
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

export default AdminCustomers;
