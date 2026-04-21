"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare, Send, Clock, ChevronRight, User } from "lucide-react";

export function OutreachQueue() {
  const queue = [
    { id: "1", username: "@fitness_legend", type: "Follow-up", status: "Warm", lastContact: "2d ago" },
    { id: "2", username: "@tech_founder", type: "First DM", status: "Hot", lastContact: "Found today" },
    { id: "3", username: "@realestate_pro", type: "Closing", status: "Interested", lastContact: "3h ago" },
    { id: "4", username: "@vlog_queen", type: "Follow-up", status: "Cold", lastContact: "4d ago" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
          <Send size={14} className="text-blue-500" />
          Today's Outreach Queue
        </h3>
        <span className="text-[10px] font-bold text-zinc-600 uppercase italic bg-white/5 px-2 py-0.5 rounded">12 Pending</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-0">
        <div className="flex flex-col">
          {queue.map((item, idx) => (
            <div key={item.id} className="p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer flex items-center justify-between">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:border-blue-500/50 transition-colors">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{item.username}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none ${
                        item.status === 'Hot' ? 'bg-red-500/10 text-red-500' : 
                        item.status === 'Warm' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'
                    }`}>
                        {item.status}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest whitespace-nowrap">{item.type} • {item.lastContact}</span>
                  </div>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-blue-500 group-hover:text-black transition-all">
                 <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-500/5 border-t border-blue-500/10 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black text-zinc-500 uppercase">Lead Health: Optimal</span>
         </div>
         <span className="text-[10px] font-bold text-white uppercase tracking-tighter italic">Batch Send →</span>
      </div>
    </GlassCard>
  );
}
