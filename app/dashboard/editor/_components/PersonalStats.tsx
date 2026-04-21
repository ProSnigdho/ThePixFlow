"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, RotateCcw, Award } from "lucide-react";

interface StatsProps {
  avgDelivery: number; // in hours
  revisionRate: number; // in percentage
  performanceScore: number;
}

export function PersonalStats({ avgDelivery, revisionRate, performanceScore }: StatsProps) {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-zinc-950">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Personal Stats</h3>
        <p className="text-[10px] text-zinc-600">Performance Metrics</p>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-around gap-4">
        {/* Delivery Time */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <Zap size={12} className="text-yellow-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Avg Delivery</span>
            </div>
            <span className="text-xs font-black text-white">{avgDelivery}h</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-yellow-500 rounded-full" 
              style={{ width: `${Math.min(100, (1 - avgDelivery/48) * 100)}%` }} 
            />
          </div>
        </div>

        {/* Revision Rate */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <RotateCcw size={12} className="text-blue-500" />
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Revision Rate</span>
            </div>
            <span className="text-xs font-black text-white">{revisionRate}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${100 - revisionRate}%` }} 
            />
          </div>
        </div>

        {/* Global Performance */}
        <div className="mt-2 p-3 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-purple-500" />
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">Performance Score</span>
              <span className="text-[10px] font-black text-white uppercase italic">Elite Tier Editor</span>
            </div>
          </div>
          <div className="text-xl font-black text-purple-500">
            {performanceScore}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
