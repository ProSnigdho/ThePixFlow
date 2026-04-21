"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Megaphone, Send, History, Trash2, Edit3 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function NoticesPage() {
  const { role } = useAuth();
  const [notice, setNotice] = useState("");

  if (role !== "admin") return null;

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tighter text-white">BROADCAST<span className="text-gradient underline">STATION</span></h1>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Global Communications Management</p>
      </div>

      <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
        {/* Composer */}
        <div className="col-span-12 lg:col-span-5 h-fit">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Megaphone className="text-[#fcb045]" size={20} />
            Write Announcement
          </h2>
          <GlassCard className="border-white/5 bg-white/[0.02] p-8">
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message Content</label>
                <textarea 
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fcb045]/30 min-h-[250px] resize-none transition-all"
                  placeholder="Communicate with all clients and editors simultaneously..."
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                  required
                />
              </div>
              <GradientButton type="submit" className="w-full py-4 flex items-center justify-center gap-2 group shadow-xl shadow-[#fcb045]/10">
                <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                Push to Live Infrastructure
              </GradientButton>
            </form>
          </GlassCard>
        </div>

        {/* History */}
        <div className="col-span-12 lg:col-span-7 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <History className="text-[#833ab4]" size={20} />
              Transmission History
            </h2>
          </div>
          <GlassCard className="flex-1 border-white/5 bg-white/[0.01] p-0 overflow-hidden flex flex-col">
             <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
                {[
                  "System maintenance scheduled for 02:00 UTC.",
                  "New project management guidelines uploaded to DRIVE.",
                  "Welcome to our 14 new approved editors!",
                ].map((txt, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-start group hover:bg-white/[0.04] transition-all"
                  >
                    <div className="space-y-2 max-w-[80%]">
                      <p className="text-sm font-medium text-gray-400 group-hover:text-gray-200 transition-colors">"{txt}"</p>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">Broadcasted {i+1}d ago • 14:00</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-colors">
                        <Edit3 size={14} />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/5 text-red-500/50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
