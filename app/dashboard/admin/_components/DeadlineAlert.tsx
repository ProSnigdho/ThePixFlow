"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function DeadlineAlert() {
  const deadlines = [
    { title: "Nike Q3 Promo", progress: 85, time: "2h", status: "Critical" },
    { title: "Tesla Brand Film", progress: 60, time: "8h", status: "Active" },
    { title: "Starbucks Winter", progress: 40, time: "1d", status: "Draft" },
    { title: "Apple Event Clip", progress: 20, time: "3d", status: "Queued" },
  ];

  return (
    <GlassCard className="h-full p-8 border-white/5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Zap size={14} className="text-[#fd1d1d]" />
          Timeline Pulse
        </h3>
      </div>
      <div className="flex-1 space-y-8">
        {deadlines.map((d, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold text-white tracking-tight">{d.title}</span>
              <span className="text-[10px] font-black text-gray-500 uppercase">{d.time} left</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${d.progress}%` }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
                className={`h-full rounded-full ${
                  d.status === "Critical" ? "bg-gradient-to-r from-[#fd1d1d] to-[#fcb045]" : "bg-white/20"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
        View Master Schedule
      </button>
    </GlassCard>
  );
}
