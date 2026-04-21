"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Megaphone } from "lucide-react";

export function NoticeBox() {
  return (
    <GlassCard className="h-full p-4 border-white/5 relative overflow-hidden flex flex-col gap-2">
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#fcb045]/10 rounded-full blur-2xl" />
      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
        <Megaphone size={14} className="text-[#fcb045]" />
        Global Notice
      </h3>
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex-1 flex flex-col justify-center">
        <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed">
          "New payout schedule starting Monday! Please ensure all finished task links are verified before 
          submitting for final approval."
        </p>
        <span className="text-[9px] text-gray-600 font-bold uppercase mt-2">Posted 2h ago by Admin</span>
      </div>
    </GlassCard>
  );
}
