"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { PlusCircle, Clock, CheckCircle, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ClientOperations({ userId, actionRequired }: { userId: string, actionRequired: any[] }) {
  const [formData, setFormData] = useState({ title: "", link: "", brief: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.link) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        ...formData,
        clientId: userId,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      setFormData({ title: "", link: "", brief: "" });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-[70%_30%] gap-6 h-full min-h-0 overflow-hidden">
      {/* Submission Card */}
      <GlassCard className="p-6 flex flex-col h-full overflow-hidden min-h-0">
        <div className="flex items-center gap-2 mb-4 flex-none">
          <PlusCircle size={16} className="text-[#fcb045]" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Quick Task Submission</h3>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="grid grid-cols-2 gap-4">
             <input 
               type="text" 
               placeholder="PROJECT TITLE"
               className="bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-bold text-white placeholder:text-gray-600 focus:border-[#fcb045] outline-none transition-colors"
               value={formData.title}
               onChange={e => setFormData({ ...formData, title: e.target.value })}
             />
             <input 
               type="text" 
               placeholder="FOOTAGE LINK (DRIVE/WETRANSFER)"
               className="bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-bold text-white placeholder:text-gray-600 focus:border-[#fcb045] outline-none transition-colors"
               value={formData.link}
               onChange={e => setFormData({ ...formData, link: e.target.value })}
             />
          </div>
          <textarea 
            placeholder="EDITING BRIEF / INSTRUCTIONS..."
            className="flex-1 bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-bold text-white placeholder:text-gray-600 focus:border-[#fcb045] outline-none transition-colors resize-none"
            value={formData.brief}
            onChange={e => setFormData({ ...formData, brief: e.target.value })}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="p-3 bg-gradient-to-r from-[#833ab4] to-[#fd1d1d] rounded-lg text-xs font-black uppercase tracking-widest text-white hover:opacity-90 transition-opacity flex-none"
          >
            {loading ? "INITIALIZING PRODUCTION..." : "LAUNCH TASK"}
          </button>
        </form>
      </GlassCard>

      {/* Action Required Card */}
      <GlassCard className="p-6 flex flex-col h-full overflow-hidden min-h-0">
        <div className="flex items-center gap-2 mb-4 flex-none">
          <Clock size={16} className="text-[#fd1d1d]" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Action Required</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-0">
          {actionRequired.length > 0 ? actionRequired.map((task, i) => (
            <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-[#fd1d1d]/30 transition-colors flex items-center justify-between">
               <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-200 truncate">{task.title}</p>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{task.status}</p>
               </div>
               <button className="p-1 px-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-gray-400" />
               </button>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center gap-2">
               <CheckCircle size={24} className="text-green-500/20" />
               <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">System Operational</span>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
