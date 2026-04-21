"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, Info } from "lucide-react";

export function LimitTracker() {
  const current = 38;
  const limit = 50;
  const percentage = (current / limit) * 100;

  return (
    <GlassCard className="p-4 border-[#27272a]/50 bg-black/40 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl ${percentage > 80 ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
           <AlertTriangle size={18} />
        </div>
        <div>
           <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Safety Constraint Monitor</h4>
           <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase">DM Health:</span>
              <span className={`text-[9px] font-black uppercase italic ${percentage > 80 ? 'text-red-500' : 'text-blue-500'}`}>
                 {current} / {limit} Sent Today
              </span>
           </div>
        </div>
      </div>

      <div className="flex-1 max-w-md ml-10">
         <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-blue-500'}`} 
              style={{ width: `${percentage}%` }} 
            />
         </div>
      </div>

      <div className="flex items-center gap-2 px-6">
         <Info size={12} className="text-zinc-700" />
         <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">Limits reset in 6h 12m</p>
      </div>
    </GlassCard>
  );
}
