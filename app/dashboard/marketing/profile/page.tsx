"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, 
  Mail, 
  Phone, 
  Building, 
  User, 
  Save, 
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { db, storage } from "@/firebase/config";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const LinkedInIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function MarketingProfilePage() {
  const { user, role: userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    brandName: "",
    instagram: "",
    linkedin: "",
    photoURL: "",
  });

  // 1. Fetch User Data from Firestore on Load
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            displayName: data.displayName || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            brandName: data.brandName || "",
            instagram: data.instagram || "",
            linkedin: data.linkedin || "",
            photoURL: data.photoURL || user.photoURL || "",
          });
        }
      } catch (error) {
        console.error("FETCH_ERROR:", error);
        toast.error("Failed to sync profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  // 2. Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large (Max 2MB)");
      return;
    }

    setIsUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: downloadURL,
        updatedAt: serverTimestamp(),
      });

      await updateProfile(user, { photoURL: downloadURL });

      setFormData(prev => ({ ...prev, photoURL: downloadURL }));
      toast.success("Profile photo updated");
    } catch (error: any) {
      console.error("UPLOAD_ERROR:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Save Form Data
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName });
      }

      toast.success("Marketing Identity Updated");
    } catch (error: any) {
      console.error("SAVE_ERROR:", error);
      toast.error("Verification failed. Check connectivity.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 text-[#1A4848] animate-spin" />
      </div>
    );
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#1A4848] transition-all placeholder:text-zinc-700";

  return (
    <div className="h-full w-full bg-[#0A0A0A] overflow-hidden flex flex-col gap-8 animate-in fade-in duration-1000">
      
      {/* Main Single Column Profile Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-2xl mx-auto w-full space-y-10 pb-20">
           
           {/* Glass-morphism Card */}
           <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A4848]/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="space-y-12 relative z-10">
                 
                 {/* Avatar Section */}
                 <div className="flex flex-col items-center gap-6">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                       <div className="w-36 h-36 rounded-full border-4 border-[#0A0A0A] ring-2 ring-[#1A4848] overflow-hidden bg-zinc-800 shadow-2xl relative">
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10 animate-in fade-in">
                               <Loader2 className="w-8 h-8 text-[#1A8080] animate-spin" />
                            </div>
                          )}
                          <img 
                            src={formData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <Camera size={24} className="text-white" />
                          </div>
                       </div>
                       <button className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[#1A4848] text-white flex items-center justify-center border-4 border-[#0A0A0A] shadow-lg hover:scale-110 transition-transform">
                          <Camera size={16} />
                       </button>
                       <input 
                         type="file" 
                         ref={fileInputRef} 
                         onChange={handleImageUpload} 
                         className="hidden" 
                         accept="image/*" 
                       />
                    </div>
                    <div className="text-center">
                       <h2 className="text-2xl font-black text-white tracking-tight uppercase">{formData.displayName || "PixFlow Marketer"}</h2>
                       <div className="flex flex-col items-center gap-1 mt-1">
                          <div className="flex items-center gap-2">
                             <CheckCircle2 size={12} className="text-[#1A8080]" />
                             <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Verified Growth Node</p>
                          </div>
                          <span className="text-[10px] font-black text-[#1A8080] uppercase tracking-widest mt-1 bg-[#1A4848]/20 px-3 py-1 rounded-full border border-[#1A4848]/30">
                             Marketing
                          </span>
                       </div>
                    </div>
                 </div>

                 {/* Form Fields */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                    {/* Left Column Fields */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <User size={12} className="text-[#1A4848]" /> Full Name
                          </label>
                          <input 
                            value={formData.displayName}
                            onChange={(e) => setFormData(p => ({ ...p, displayName: e.target.value }))}
                            className={inputCls}
                            placeholder="Enter your full name"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <Mail size={12} className="text-[#1A4848]" /> Email Address
                          </label>
                          <input 
                            value={formData.email}
                            readOnly
                            className={cn(inputCls, "opacity-40 cursor-not-allowed bg-transparent")}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <Phone size={12} className="text-[#1A4848]" /> WhatsApp Number
                          </label>
                          <input 
                            value={formData.phone}
                            onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className={inputCls}
                            placeholder="+1 (555) 000-0000"
                          />
                       </div>
                    </div>

                    {/* Right Column Fields */}
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <Building size={12} className="text-[#1A4848]" /> Company / Brand
                          </label>
                          <input 
                            value={formData.brandName}
                            onChange={(e) => setFormData(p => ({ ...p, brandName: e.target.value }))}
                            className={inputCls}
                            placeholder="PixFlow Studio"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <InstagramIcon size={12} className="text-[#1A4848]" /> Instagram
                          </label>
                          <input 
                            value={formData.instagram}
                            onChange={(e) => setFormData(p => ({ ...p, instagram: e.target.value }))}
                            className={inputCls}
                            placeholder="@username"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                             <LinkedInIcon size={12} className="text-[#1A4848]" /> LinkedIn
                          </label>
                          <input 
                            value={formData.linkedin}
                            onChange={(e) => setFormData(p => ({ ...p, linkedin: e.target.value }))}
                            className={inputCls}
                            placeholder="linkedin.com/in/username"
                          />
                       </div>
                    </div>
                 </div>

                 {/* Centered Save Button */}
                 <div className="pt-8 flex flex-col items-center gap-4">
                    <button 
                      onClick={handleSave}
                      disabled={saving || isUploading}
                      className={cn(
                        "w-full max-w-sm py-5 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-[1.25rem] font-black text-sm uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-4 shadow-[0_0_40px_rgba(26,72,72,0.3)] hover:shadow-[0_0_60px_rgba(26,128,128,0.5)] disabled:opacity-50 group",
                        saving && "animate-pulse"
                      )}
                    >
                       {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
                       {saving ? "Transmitting..." : "Update Marketing Identity"}
                    </button>
                    <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Global Sync Enabled • Secure Data Transmission</p>
                 </div>

              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
