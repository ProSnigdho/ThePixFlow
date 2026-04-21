"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, Compass, Target, Hash } from "lucide-react";

export function DiscoverySearch() {
  return (
    <GlassCard className="p-6 border-[#27272a]/50 bg-black/40 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Compass size={16} className="text-blue-500" />
          Lead Discovery Node
        </h3>
        <div className="flex gap-4">
           <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Database: Global Instagram</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="relative col-span-2">
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 pr-10 uppercase tracking-widest font-bold"
              placeholder="Search hashtags or accounts..."
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
         </div>
         <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
            <button className="flex-1 text-[9px] font-black uppercase text-white bg-white/10 rounded-lg">Hashtags</button>
            <button className="flex-1 text-[9px] font-black uppercase text-zinc-600 hover:text-white transition-colors">Locations</button>
         </div>
         <button className="bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            Hunt Potential Leads
         </button>
      </div>

      <div className="flex items-center gap-6 pt-2 border-t border-white/[0.03]">
         <div className="flex items-center gap-2">
            <Hash size={12} className="text-zinc-700" />
            <span className="text-[9px] font-black text-zinc-500 uppercase">Trending: #fitnessmotivation</span>
         </div>
         <div className="flex items-center gap-2">
            <Target size={12} className="text-zinc-700" />
            <span className="text-[9px] font-black text-zinc-500 uppercase">Quality: High Potential</span>
         </div>
      </div>
    </GlassCard>
  );
}
