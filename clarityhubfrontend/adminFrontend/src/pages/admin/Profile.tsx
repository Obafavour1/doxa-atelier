import React, { useState, useEffect } from "react";
import { 
  User as UserIcon, 
  ShieldCheck, 
  Bell, 
  Key, 
  Activity, 
  Smartphone,
  Globe,
  Save,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LogOut,
  Plus
} from "lucide-react";
import { adminService } from "../../services/admin.service";
import { toast } from "react-hot-toast";

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'sessions' | 'logs'>('general');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  // Form States
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });
  const [notifications, setNotifications] = useState({ emailNotifications: false, orderAlerts: false, refundAlerts: false });
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileData, authLogs, authSessions] = await Promise.all([
        adminService.getProfileOverview(),
        adminService.getAuditLogs(),
        adminService.getSessions()
      ]);
      
      setProfile(profileData);
      setFormData({ firstName: profileData?.firstName || '', lastName: profileData?.lastName || '' });
      setNotifications(profileData?.notificationPreferences || { emailNotifications: false, orderAlerts: false, refundAlerts: false });
      
      setLogs(authLogs);
      setSessions(authSessions);
    } catch {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateAdminProfile(formData);
      toast.success("Profile updated perfectly.");
      fetchData();
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handleToggleNotification = async (key: keyof typeof notifications) => {
    const nextState = { ...notifications, [key]: !notifications[key] };
    setNotifications(nextState);
    try {
      await adminService.updateNotifications(nextState);
      toast.success("Notification preferences updated.");
    } catch {
      toast.error("Failed to update preferences.");
      setNotifications(notifications); // revert
    }
  };

  const handleToggle2FA = async () => {
    const isEnabling = !profile?.twoFactorEnabled;
    const msg = isEnabling ? "Enable 2FA?" : "Disable 2FA? This reduces account security.";
    if(!window.confirm(msg)) return;
    
    try {
      await adminService.toggleTwoFactor(isEnabling);
      setProfile({ ...profile, twoFactorEnabled: isEnabling });
      toast.success(isEnabling ? "2FA Enabled" : "2FA Disabled");
    } catch {
      toast.error("Failed to toggle 2FA.");
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newKeyName.trim()) return;
    try {
      const res = await adminService.createApiKey(newKeyName);
      // Assuming res.data.apiKey contains the unhashed string
      setGeneratedKey(res.data?.apiKey || res.apiKey || "API_KEY_GENERATED");
      toast.success("API Key generated.");
      setNewKeyName("");
      fetchData();
    } catch {
      toast.error("Failed to create API key.");
    }
  };

  const handleRevokeApiKey = async (id: string) => {
    if(!window.confirm("Disconnect apps using this key?")) return;
    try {
      await adminService.revokeApiKey(id);
      toast.success("Key revoked.");
      fetchData();
    } catch {
      toast.error("Failed to revoke key.");
    }
  };

  const handleRevokeSession = async (id: string, isCurrent: boolean) => {
    if(isCurrent) {
      toast.error("You cannot revoke your current active session from here.");
      return;
    }
    if(!window.confirm("Revoke access for this device?")) return;
    try {
      await adminService.revokeSession(id);
      toast.success("Session terminated.");
      fetchData();
    } catch {
      toast.error("Failed to terminate session.");
    }
  };

  if (loading) return <div className="h-full flex items-center justify-center py-32"><div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="space-y-8 h-full flex flex-col max-w-6xl mx-auto w-full pb-12">
      <header className="shrink-0 space-y-1 block relative z-10 px-2 lg:px-0 mt-6 lg:mt-0 pt-4 lg:pt-0">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          Account Settings
          {profile?.accountVerified && <CheckCircle2 size={24} className="text-rose-500" />}
        </h1>
        <p className="text-gray-400 font-medium">Manage your administrator identity, security credentials, and system sessions.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         <aside className="w-full lg:w-64 space-y-2 shrink-0">
            <button onClick={() => setActiveTab('general')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'general' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <UserIcon size={18} /> General Profile
            </button>
            <button onClick={() => setActiveTab('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <ShieldCheck size={18} /> Security & Keys
            </button>
            <button onClick={() => setActiveTab('sessions')} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'sessions' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <span className="flex items-center gap-3"><Smartphone size={18} /> Sessions</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[10px]">{sessions.length}</span>
            </button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'logs' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <Activity size={18} /> Audit Trail
            </button>
         </aside>

         <main className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 lg:p-10 shadow-2xl">
            {activeTab === 'general' && (
              <div className="space-y-10 animate-fade-in">
                 <section className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-white">Public Identity</h3>
                      <p className="text-sm text-gray-500">This information is used across the dashboard to identify you.</p>
                    </div>
                    <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                         <input value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition-colors" />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                         <input value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-rose-500 outline-none transition-colors" />
                       </div>
                       <div className="space-y-2 md:col-span-2">
                         <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                            Email Address 
                            <span className="text-rose-500 flex items-center gap-1"><CheckCircle2 size={12}/> Verified</span>
                         </label>
                         <input disabled value={profile?.email || ''} className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed outline-none" />
                       </div>
                       <div className="md:col-span-2 pt-2">
                         <button type="submit" className="w-full md:w-auto px-8 py-3 rounded-xl bg-rose-500 text-black font-black hover:bg-rose-400 transition-colors shadow-lg flex items-center justify-center gap-2">
                           <Save size={18}/> Save Changes
                         </button>
                       </div>
                    </form>
                 </section>

                 <div className="w-full h-px bg-white/10" />

                 <section className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">Alert Preferences <Bell size={20} className="text-gray-500"/></h3>
                      <p className="text-sm text-gray-500">Configure what dashboard events should trigger external pings.</p>
                    </div>
                    <div className="space-y-4 max-w-xl">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive daily system performance summaries.' },
                        { key: 'orderAlerts', label: 'Order Alerts', desc: 'Real-time push notifications for new sales.' },
                        { key: 'refundAlerts', label: 'Refund Warnings', desc: 'Notify instantly on dispute or refund creation.' }
                      ].map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                          <div>
                            <p className="font-bold text-sm text-white">{pref.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                          </div>
                          <button 
                            onClick={() => handleToggleNotification(pref.key as any)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${notifications[pref.key as keyof typeof notifications] ? 'bg-rose-500' : 'bg-gray-600'}`}
                          >
                            <span className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${notifications[pref.key as keyof typeof notifications] ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10 animate-fade-in">
                 <section className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-white">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-500">Add an additional layer of security to your administrator account.</p>
                    </div>
                    <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${profile?.twoFactorEnabled ? 'bg-rose-500/5 border-rose-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                       <div>
                         <p className={`font-black text-lg ${profile?.twoFactorEnabled ? 'text-rose-500' : 'text-amber-500'}`}>
                           {profile?.twoFactorEnabled ? '2FA is Enabled' : '2FA is Disabled'}
                         </p>
                         <p className="text-sm text-gray-400 mt-1">If enabled, you will be required to pass an MFA check on every login attempt.</p>
                       </div>
                       <button 
                         onClick={handleToggle2FA}
                         className={`shrink-0 px-6 py-2.5 rounded-xl font-bold transition-all ${profile?.twoFactorEnabled ? 'bg-gray-800 text-white hover:bg-rose-500/10 hover:text-rose-500' : 'bg-rose-500 text-black hover:bg-rose-400 shadow-lg'}`}
                       >
                         {profile?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                       </button>
                    </div>
                 </section>

                 <div className="w-full h-px bg-white/10" />

                 <section className="space-y-6">
                    <div>
                      <h3 className="text-xl font-black text-white flex items-center gap-2">API Keys <Key size={20} className="text-gray-500"/></h3>
                      <p className="text-sm text-gray-500">Manage permanent access tokens for remote integrations.</p>
                    </div>

                    {generatedKey && (
                      <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                        <p className="text-rose-500 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Key Generated Successfully</p>
                        <p className="text-sm text-gray-400 mb-4">You MUST copy this key now. You will never be able to see it again.</p>
                        <div className="p-4 bg-black rounded-lg border border-rose-500/50 text-rose-400 font-mono text-sm break-all select-all">
                           {generatedKey}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Form */}
                      <form onSubmit={handleCreateApiKey} className="flex gap-3">
                         <input value={newKeyName} onChange={e=>setNewKeyName(e.target.value)} placeholder="Integration name (e.g. Zapier, ERP)" required className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-rose-500 outline-none" />
                         <button type="submit" className="px-6 py-2.5 rounded-xl bg-white text-black font-black hover:bg-gray-200 transition-colors flex items-center gap-2">
                           <Plus size={18} /> Generate
                         </button>
                      </form>
                      
                      {/* Active Keys List */}
                      {profile?.apiKeys?.length > 0 && (
                        <div className="mt-6 border border-white/10 rounded-2xl overflow-hidden">
                           <table className="w-full text-left text-sm whitespace-nowrap">
                             <thead className="bg-white/5 border-b border-white/10">
                               <tr>
                                 <th className="px-5 py-3 font-bold text-gray-500 uppercase tracking-widest text-xs">Name</th>
                                 <th className="px-5 py-3 font-bold text-gray-500 uppercase tracking-widest text-xs">Key Mask</th>
                                 <th className="px-5 py-3 text-right font-bold text-gray-500 uppercase tracking-widest text-xs">Action</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-white/5">
                               {profile.apiKeys.map((k: any) => (
                                 <tr key={k._id} className="hover:bg-white/5">
                                   <td className="px-5 py-4 font-bold text-white">{k.name}</td>
                                   <td className="px-5 py-4 font-mono text-gray-400">{k.key}</td>
                                   <td className="px-5 py-4 text-right">
                                     <button onClick={()=>handleRevokeApiKey(k._id)} className="text-rose-500 hover:text-rose-400 font-bold text-xs uppercase tracking-widest">Revoke</button>
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                      )}
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="space-y-6 animate-fade-in">
                 <div>
                   <h3 className="text-xl font-black text-white flex items-center gap-2">Active Sessions</h3>
                   <p className="text-sm text-gray-500">Devices currently logged into your administrator account.</p>
                 </div>
                 
                 <div className="grid gap-4 mt-6">
                   {sessions.map((session, i) => (
                     <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between ${session.isCurrent ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/5 border-white/10'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-xl ${session.isCurrent ? 'bg-rose-500/10 text-rose-500' : 'bg-gray-800 text-gray-400'}`}>
                             {session.userAgent.includes('Mobile') ? <Smartphone size={24}/> : <Globe size={24}/>}
                           </div>
                           <div>
                             <p className="font-bold text-white text-sm max-w-[200px] md:max-w-md truncate" title={session.userAgent}>{session.userAgent}</p>
                             <div className="flex items-center gap-3 mt-1">
                               <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleString()}</p>
                               {session.isCurrent && <span className="text-[10px] bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Current Device</span>}
                             </div>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleRevokeSession(session.sessionId, session.isCurrent)}
                          disabled={session.isCurrent}
                          className="p-2 rounded-lg text-gray-500 hover:bg-rose-500/10 hover:text-rose-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <LogOut size={20} />
                        </button>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="space-y-6 animate-fade-in">
                 <div>
                   <h3 className="text-xl font-black text-white flex items-center gap-2">Security Audit Trail</h3>
                   <p className="text-sm text-gray-500">A permanent ledger of all critical actions performed by your account.</p>
                 </div>
                 
                 <div className="border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#0A0A0A] border-b border-white/10">
                        <tr>
                          <th className="px-5 py-4 font-bold text-gray-500 uppercase tracking-widest text-[#10px]">Action Segment</th>
                          <th className="px-5 py-4 font-bold text-gray-500 uppercase tracking-widest text-[#10px]">Event Details</th>
                          <th className="px-5 py-4 text-right font-bold text-gray-500 uppercase tracking-widest text-[#10px]">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#050505]">
                        {logs.slice(0, 50).map((log, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-5 py-4">
                               <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                 {log.module || 'System'}
                               </span>
                            </td>
                            <td className="px-5 py-4 font-medium text-white max-w-xs md:max-w-md truncate">{log.action || log.deviceInfo}</td>
                            <td className="px-5 py-4 text-right font-mono text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
                 {logs.length === 0 && <div className="p-8 text-center text-gray-500">No logs found.</div>}
              </div>
            )}
         </main>
      </div>
    </div>
  );
};

export default AdminProfile;
