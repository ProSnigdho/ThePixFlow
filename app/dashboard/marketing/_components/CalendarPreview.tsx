"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Calendar, Play, Clock, Share2 } from "lucide-react";

export function CalendarPreview() {
  const days = [
    { name: "Today", posts: 2 },
    { name: "Tomorrow", posts: 1 },
    { name: "Mon", posts: 3 },
    { name: "Tue", posts: 0 },
    { name: "Wed", posts: 2 },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-zinc-950">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-purple-500" />
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Content Calendar Preview</h3>
        </div>
        <div className="flex gap-2">
           <span className="text-[9px] font-black text-zinc-600 uppercase border border-white/5 px-2 py-0.5 rounded">Weekly Slot: 14/20</span>
        </div>
      </div>

      <div className="flex-1 p-6 flex gap-4 overflow-x-auto no-scrollbar">
         {days.map((day, idx) => (
           <div key={idx} className="flex-1 min-w-[140px] flex flex-col gap-3 group">
              <div className="flex items-center justify-between px-2">
                 <span className={`text-[10px] font-black uppercase tracking-widest ${idx === 0 ? 'text-white' : 'text-zinc-600'}`}>{day.name}</span>
                 {day.posts > 0 && <span className="text-[9px] font-mono text-purple-500 font-black">{day.posts} Slots</span>}
              </div>
              
              <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden transition-all duration-500 ${
                day.posts > 0 ? 'border-purple-500/20 bg-purple-500/[0.02] group-hover:bg-purple-500/[0.05]' : 'border-white/[0.03] bg-transparent opacity-40'
              }`}>
                 {day.posts > 0 ? (
                   <div className="flex-1 flex flex-col p-4 gap-3">
                      <div className="flex-1 rounded-xl bg-zinc-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
                         <Play size={16} className="text-white opacity-20" />
                         <div className="absolute top-2 right-2 flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-orange-500" />
                            <div className="w-1 h-1 rounded-full bg-orange-500" />
                         </div>
                      </div>
                      <div className="space-y-1">
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-tighter">IG REEL #1</span>
                            <Clock size={10} className="text-zinc-700" />
                         </div>
                         <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[70%]" />
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="flex-1 flex items-center justify-center">
                      <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest rotate-90">Empty</span>
                   </div>
                 )}
              </div>
           </div>
         ))}
      </div>

      <div className="p-3 px-6 bg-black/60 border-t border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Share2 size={12} className="text-zinc-600" />
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Cross-Platform Sync Enabled</span>
         </div>
         <button className="text-[9px] font-black text-white uppercase italic hover:underline">Open Planner →</button>
      </div>
    </GlassCard>
  );
}
