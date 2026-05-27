import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Globe, 
  Truck, 
  CreditCard, 
  Bell, 
  ShieldCheck, 
  Save,
  Plus,
  Trash2,
  X,
  Edit2
} from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { StoreSettings, ShippingZone } from "../../types/api";
import { toast } from "react-hot-toast";

const AdminSettingsPage = () => {
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({ storeName: "", currency: "USD" });
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);

  // Zone Management State
  const [isAddingZone, setIsAddingZone] = useState(false);
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [zoneFormData, setZoneFormData] = useState({ name: "", regions: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, zones] = await Promise.all([
          adminService.getStoreSettings(),
          adminService.getShippingZones()
        ]);
        
        // Handle currency if it's an object from the backend
        const currencyValue = typeof settings.currency === "object" 
          ? (settings.currency as any).code 
          : settings.currency || "USD";

        setStoreSettings({
          storeName: settings.storeName || "",
          currency: currencyValue
        });
        setShippingZones(zones);
      } catch (error) {
        console.error("Failed to fetch settings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateStoreSettings(storeSettings);
      toast.success("Store settings updated successfully");
    } catch (error) {
      toast.error("Failed to update store settings");
    }
  };

  const handleDeleteZone = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this shipping zone?")) return;
    try {
      await adminService.deleteShippingZone(id);
      setShippingZones(shippingZones.filter(z => z.id && z.id !== id && (z as any)._id !== id));
      toast.success("Shipping zone deleted");
    } catch (error) {
      toast.error("Failed to delete shipping zone");
    }
  };

  const handleSaveZone = async () => {
    if (!zoneFormData.name.trim()) {
      toast.error("Zone name is required");
      return;
    }
    
    try {
      const regionsArray = zoneFormData.regions.split(",").map(r => r.trim()).filter(Boolean);
      
      if (editingZoneId) {
        // Update existing branch
        await adminService.updateShippingZone(editingZoneId, { name: zoneFormData.name });
        setShippingZones(shippingZones.map(z => 
          (z.id || (z as any)._id) === editingZoneId ? { ...z, name: zoneFormData.name } : z
        ));
        toast.success("Shipping zone updated");
      } else {
        // Create new branch
        if (regionsArray.length === 0) {
          toast.error("At least one region is required");
          return;
        }
        await adminService.createShippingZone({ name: zoneFormData.name, regions: regionsArray });
        const refreshedZones = await adminService.getShippingZones();
        setShippingZones(refreshedZones);
        toast.success("Shipping zone created");
      }
      
      // Reset form
      setIsAddingZone(false);
      setEditingZoneId(null);
      setZoneFormData({ name: "", regions: "" });
    } catch (error) {
      toast.error("Failed to save shipping zone");
    }
  };

  const startEditZone = (zone: ShippingZone) => {
    setEditingZoneId(zone.id || (zone as any)._id);
    setZoneFormData({ name: zone.name, regions: zone.regions?.join(", ") || "" });
    setIsAddingZone(true);
  };

  const cancelEditZone = () => {
    setIsAddingZone(false);
    setEditingZoneId(null);
    setZoneFormData({ name: "", regions: "" });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your store's global parameters and rules.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings */}
        <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Globe className="text-rose-500" size={20} />
            <h2 className="font-bold text-xl">General Store Settings</h2>
          </div>
          <form onSubmit={handleUpdateStore} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Store Name</label>
                <input 
                  type="text" 
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500/50 outline-none transition-colors"
                  placeholder="e.g. DOXA Store"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Default Currency</label>
                <select 
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-rose-500/50 outline-none appearance-none transition-colors"
                >
                  <option value="USD" className="bg-gray-900">USD - US Dollar</option>
                  <option value="EUR" className="bg-gray-900">EUR - Euro</option>
                  <option value="GBP" className="bg-gray-900">GBP - British Pound</option>
                  <option value="NGN" className="bg-gray-900">NGN - Nigerian Naira</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-rose-500 text-black font-bold rounded-xl hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/10 active:scale-95"
              >
                <Save size={18} /> Save General Changes
              </button>
            </div>
          </form>
        </section>

        {/* Shipping Zones */}
        <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="text-rose-500" size={20} />
              <h2 className="font-bold text-xl">Shipping Zones</h2>
            </div>
            {!isAddingZone && (
              <button 
                onClick={() => setIsAddingZone(true)}
                className="text-rose-500 text-sm font-bold flex items-center gap-1 hover:underline transition-all"
              >
                <Plus size={16} /> Add Zone
              </button>
            )}
          </div>
          <div className="p-8 space-y-4">
            {isAddingZone && (
              <div className="bg-white/5 border border-rose-500/30 rounded-2xl p-5 space-y-4 mb-6">
                <div className="flex items-center justify-between">
                   <h3 className="font-bold text-rose-500">{editingZoneId ? "Edit Zone" : "Create New Zone"}</h3>
                   <button onClick={cancelEditZone} className="text-gray-500 hover:text-white transition-colors">
                     <X size={18} />
                   </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Zone Name</label>
                    <input 
                      type="text" 
                      value={zoneFormData.name}
                      onChange={(e) => setZoneFormData({...zoneFormData, name: e.target.value})}
                      placeholder="e.g. North America" 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-rose-500/50 outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Regions (comma separated)</label>
                    <input 
                      type="text" 
                      disabled={!!editingZoneId}
                      value={zoneFormData.regions}
                      onChange={(e) => setZoneFormData({...zoneFormData, regions: e.target.value})}
                      placeholder={editingZoneId ? "Regions cannot be edited" : "e.g. US, CA, MX"} 
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm focus:border-rose-500/50 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button 
                    onClick={handleSaveZone}
                    className="bg-rose-500 text-black px-5 py-2 rounded-lg font-bold text-sm hover:bg-rose-400 transition-colors"
                  >
                    Save Zone
                  </button>
                </div>
              </div>
            )}

            {shippingZones.length === 0 && !isAddingZone ? (
              <div className="text-center py-8 text-gray-500 text-sm">No shipping zones configured yet.</div>
            ) : (
              shippingZones.map(zone => (
                <div key={zone.id || (zone as any)._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-rose-500/30 transition-all">
                  <div>
                    <h4 className="font-bold text-white">{zone.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{zone.regions?.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => startEditZone(zone)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteZone(zone.id || (zone as any)._id)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Security & Access */}
        <section className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <ShieldCheck className="text-rose-500" size={20} />
            <h2 className="font-bold text-xl">Security & API Access</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
              <div>
                <h4 className="font-bold">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security to your admin account.</p>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out bg-gray-700">
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>
            <div className="pt-4">
               <h4 className="font-bold mb-4">Master API Keys</h4>
               <div className="space-y-3">
                 <div className="p-4 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-between">
                    <code className="text-rose-500 text-sm">cs_live_************************</code>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Secret Key</span>
                 </div>
               </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
