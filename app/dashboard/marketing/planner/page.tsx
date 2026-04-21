"use client";

import React from "react";
import { ContentCalendar } from "../_components/ContentCalendar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Info, Play, Send, Hash, Type, Link as LinkIcon, Save } from "lucide-react";

export default function MarketingPlannerPage() {
  return (
    <div className="h-full grid grid-cols-[1fr_360px] gap-6 p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Calendar Area */}
      <div className="min-h-0 overflow-hidden">
        <ContentCalendar />
      </div>

      {/* Post Detail Sidebar */}
      <div className="flex flex-col gap-6 overflow-hidden">
         <GlassCard className="flex-1 flex flex-col border-[#27272a]/50 overflow-hidden bg-[#0A0A0A]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
               <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Posting Detail Node</h3>
               <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest italic">Slot Locked</span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
               <div className="aspect-[9/16] w-full rounded-2xl bg-zinc-900 border border-white/10 relative overflow-hidden group cursor-pointer shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                     <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} className="text-white fill-white ml-1" />
                     </div>
                     <p className="text-xs font-black text-white uppercase italic tracking-tighter">Nike Promo V2 Final.mp4</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                     <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                        <Type size={10} /> Caption Core
                     </label>
                     <textarea 
                       className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-zinc-300 min-h-[100px] focus:outline-none focus:border-blue-500/50"
                       defaultValue="Leveling up the game with the new Nike Summer Reel. Visuals by @ThePixFlow. Full breakdown in stories! 🚀"
                     />
                  </div>

                  <div className="space-y-1.5 text-left">
                     <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                        <Hash size={10} /> Hashtag Cluster
                     </label>
                     <input 
                       className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs text-blue-500/80 font-bold focus:outline-none focus:border-blue-500/50"
                       defaultValue="#nike #vfx #cinematic #fitness #reels"
                     />
                  </div>

                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-4">
                     <div className="p-2 rounded-lg bg-blue-500/10">
                        <Info size={16} className="text-blue-500" />
                     </div>
                     <p className="text-[10px] text-zinc-500 leading-tight">
                        Post scheduled via <span className="text-white font-bold">Official IG API</span> for April 12 at 18:00 EST.
                     </p>
                  </div>
               </div>
            </div>

            <div className="p-4 bg-black border-t border-white/5 grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center gap-2 bg-white text-black text-[10px] font-black uppercase py-3 rounded-xl hover:scale-105 transition-all">
                  Apply Changes <Save size={14} />
               </button>
               <button className="flex items-center justify-center gap-2 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase py-3 rounded-xl hover:bg-white/5 transition-all">
                   Test Pulse <LinkIcon size={14} />
               </button>
            </div>
         </GlassCard>
      </div>
    </div>
  );
}
