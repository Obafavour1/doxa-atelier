import { useForm } from "react-hook-form";
import { 
  User as UserIcon, 
  Phone,
  Bell, 
  Save, 
  Lock,
  Camera,
  CheckCircle2
} from "lucide-react";
import { authService } from "../services/auth.service";
import { useMe } from "../features/auth/api/hooks/hooks";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
  const { data: user, refetch } = useMe();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await authService.updateProfile(data);
      await refetch();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            <h1 className="text-2xl font-black text-white mb-6 uppercase tracking-wider">Settings</h1>
            {[
              { label: 'Profile Info', icon: UserIcon, active: true },
              { label: 'Security', icon: Lock },
              { label: 'Notifications', icon: Bell },
            ].map(item => (
              <button key={item.label} className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all ${item.active ? 'bg-rose-500 text-black shadow-xl shadow-rose-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
                 <UserIcon size={160} />
               </div>

               <div className="relative z-10 space-y-10">
                 <div className="flex items-center gap-6">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-3xl bg-rose-500/10 border-2 border-dashed border-rose-500/30 flex items-center justify-center text-rose-500">
                        {user?.avatar ? <img src={user.avatar} className="w-full h-full rounded-3xl object-cover" /> : <UserIcon size={48} />}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-3 rounded-xl bg-rose-500 text-black shadow-lg hover:scale-110 transition-transform">
                        <Camera size={20} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white">{user?.firstName} {user?.lastName}</h3>
                      <p className="text-gray-400 font-medium">{user?.email}</p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={12} /> Verified Member
                      </div>
                    </div>
                 </div>

                 <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">First Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <UserIcon size={20} />
                        </div>
                        <input 
                          {...register("firstName")}
                          className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-rose-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <UserIcon size={20} />
                        </div>
                        <input 
                          {...register("lastName")}
                          className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-rose-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-400 ml-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <Phone size={20} />
                        </div>
                        <input 
                          {...register("phone")}
                          className="w-full bg-gray-950 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-rose-500/50 outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 pt-6">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-rose-500 text-black font-black py-5 rounded-2xl hover:bg-rose-400 transition-all shadow-xl shadow-rose-500/20 disabled:opacity-50"
                      >
                        <Save size={24} /> {isSubmitting ? "Saving Changes..." : "Save Profile Details"}
                      </button>
                    </div>
                 </form>
               </div>
            </div>

            {/* Account Status / Danger Zone? */}
            <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/10">
               <div className="flex items-center justify-between">
                 <div>
                   <h4 className="text-rose-500 font-bold">Account Deactivation</h4>
                   <p className="text-sm text-gray-500 mt-1">Permanently remove your account and all data.</p>
                 </div>
                 <button className="text-rose-500 font-black text-sm uppercase tracking-widest hover:underline">Delete Account</button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
