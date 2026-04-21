"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

export function TaskStream() {
  const activities = [
    { text: "Draft #2 submitted for Nike Q3", status: "Live", time: "Just now" },
    { text: "Asset verification for Starbucks", status: "Edit", time: "12m ago" },
    { text: "New editor onboarded: 'vfx_pro'", status: "Sys", time: "1h ago" },
    { text: "Revision requested by Tesla", status: "Rev", time: "2h ago" },
    { text: "Payout initiated for alex_edits", status: "Fin", time: "5h ago" },
  ];

  return (
    <GlassCard className="h-full border-white/5 flex flex-col p-0 overflow-hidden relative">
      <div className="p-6 border-b border-white/5 bg-[#0A0A0A]/40">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Activity size={14} className="text-[#833ab4]" />
          Production Stream
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
        {activities.map((a, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i} 
            className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all flex justify-between items-center group"
          >
            <div className="flex-1 mr-4">
              <p className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{a.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-gray-600 font-bold uppercase">{a.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                a.status === 'Live' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 
                a.status === 'Edit' ? 'bg-[#fd1d1d] shadow-[0_0_8px_#fd1d1d]' : 
                'bg-gray-600'
              }`} />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{a.status}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
