"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Camera, 
  Music, 
  Video, 
  Clock, 
  Play
} from "lucide-react";

export function ContentCalendar() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = Array.from({ length: 35 }, (_, i) => i + 1);

  const posts = {
    "12": { title: "Nike Promo V2", platform: "Instagram", time: "18:00" },
    "15": { title: "Gym Vlog #4", platform: "TikTok", time: "20:30" },
    "18": { title: "Founders Talk", platform: "YouTube", time: "10:00" },
    "22": { title: "Brand Assets", platform: "Instagram", time: "19:15" },
  };

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      {/* Calendar Header */}
      <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
             <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all"><ChevronLeft size={16} /></button>
             <h3 className="text-sm font-black text-white uppercase tracking-tighter">April 2026</h3>
             <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all"><ChevronRight size={16} /></button>
          </div>
          <div className="h-6 w-px bg-white/5" />
          <div className="flex bg-white/5 rounded-xl border border-white/10 p-1">
             <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase text-white bg-white/10">Calendar</button>
             <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase text-zinc-600 hover:text-zinc-300">Timeline</button>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
           Manual Pulse <Plus size={14} />
        </button>
      </div>

      {/* Days Legend */}
      <div className="grid grid-cols-7 border-b border-white/5 bg-zinc-950/50">
        {days.map(day => (
          <div key={day} className="py-3 text-[10px] font-black text-zinc-700 uppercase tracking-widest text-center border-r border-white/5 last:border-r-0">{day}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-hidden">
        {dates.map((date, idx) => {
          const post = posts[date.toString() as keyof typeof posts];
          return (
            <div key={idx} className="border-r border-b border-white/[0.03] p-2 hover:bg-white/[0.01] transition-colors relative flex flex-col gap-2 min-h-0 last:border-r-0">
               <span className={`text-[10px] font-black ${date === 12 ? 'text-blue-500' : 'text-zinc-800'}`}>{date}</span>
               
               {post && (
                 <div className="flex-1 rounded-xl bg-gradient-to-br from-[#0A0A0A] to-blue-900/10 border border-blue-500/20 p-2 cursor-pointer group hover:bg-blue-500/10 transition-all flex flex-col gap-2 min-h-0">
                    <div className="flex justify-between items-center">
                       <div className="p-1 rounded bg-black/40 border border-white/5">
                          {post.platform === 'Instagram' ? <Camera size={10} className="text-pink-500" /> : 
                           post.platform === 'TikTok' ? <Music size={10} className="text-cyan-400" /> : <Video size={10} className="text-red-500" />}
                       </div>
                       <Clock size={10} className="text-zinc-700" />
                    </div>
                    <p className="text-[9px] font-black text-white uppercase truncate tracking-tighter">{post.title}</p>
                    <div className="flex-1 rounded-lg bg-zinc-900 border border-white/5 relative overflow-hidden flex items-center justify-center">
                       <Play size={10} className="text-zinc-800 group-hover:scale-125 transition-transform" />
                       <div className="absolute top-1 right-1 flex gap-0.5">
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                          <div className="w-1 h-1 rounded-full bg-blue-500" />
                       </div>
                    </div>
                    <div className="text-[8px] font-black text-blue-500/80 uppercase italic tracking-widest">{post.time} SET</div>
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
