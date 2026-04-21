"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp, Users } from "lucide-react";

export function SalesPulse() {
  return (
    <GlassCard className="h-full p-4 border-white/5 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <TrendingUp size={14} className="text-[#fcb045]" />
          Sales Pulse 24h
        </h3>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-black text-white">+14</span>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">New Signups</p>
        </div>
        <div className="p-2 rounded-full bg-green-500/10 text-green-500">
           <Users size={18} />
        </div>
      </div>
    </GlassCard>
  );
}
