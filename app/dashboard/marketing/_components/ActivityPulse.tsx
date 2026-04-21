"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Heart, MessageSquare, UserPlus, Zap } from "lucide-react";

export function ActivityPulse() {
  const activities = [
    { label: "Likes Processed", val: 142, icon: <Heart size={14} className="text-red-500" />, goal: 200 },
    { label: "Global Comments", val: 38, icon: <MessageSquare size={14} className="text-blue-500" />, goal: 50 },
    { label: "New Follows", val: 24, icon: <UserPlus size={14} className="text-green-500" />, goal: 50 },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-zinc-950/20">
      <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} className="text-yellow-500" />
          Marketing Activity Pulse
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {activities.map((item, idx) => (
          <div key={idx} className="space-y-2.5">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                 {item.icon}
                 <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{item.label}</span>
              </div>
              <span className="text-xs font-black text-white italic">{item.val} / {item.goal}</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
               <div 
                 className={`h-full rounded-full transition-all duration-1000 ${
                    idx === 0 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                    idx === 1 ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                    'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                 }`} 
                 style={{ width: `${(item.val / item.goal) * 100}%` }} 
               />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-white/[0.03] space-y-3">
           <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none">Global Engagement Node</p>
           <div className="flex flex-wrap gap-2">
              <span className="text-[8px] font-bold text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded cursor-pointer hover:border-blue-500 transition-colors">#fitness</span>
              <span className="text-[8px] font-bold text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded cursor-pointer hover:border-blue-500 transition-colors">#entrepreneur</span>
              <span className="text-[8px] font-bold text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded cursor-pointer hover:border-blue-500 transition-colors">#motivation</span>
           </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-black border-t border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
           <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest italic outline-none">Node Sync: Active</span>
        </div>
      </div>
    </GlassCard>
  );
}
