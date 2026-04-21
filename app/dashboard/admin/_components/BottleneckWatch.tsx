"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, Clock, RotateCcw, UserMinus, ChevronRight } from "lucide-react";

export function BottleneckWatch() {
  const issues = [
    { id: "p1", title: "Amazon Campaign", issue: "Unassigned", severity: "high", time: "24h overdue" },
    { id: "p2", title: "Tesla Tutorial", issue: "5+ Revisions", severity: "medium", time: "Client frustrated" },
    { id: "p3", title: "Nike Promo", issue: "Delayed Intake", severity: "low", time: "Awaiting footage" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <h3 className="text-xs font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
          <AlertTriangle size={14} strokeWidth={3} />
          The Bottleneck Watch
        </h3>
        <span className="text-[10px] font-bold text-zinc-600 uppercase italic">Admin Attention</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-0">
        <div className="flex flex-col">
          {issues.map((item, idx) => (
            <div 
              key={item.id} 
              className={`p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group cursor-pointer flex items-center justify-between ${
                item.severity === 'high' ? 'bg-red-500/[0.01]' : ''
              }`}
            >
              <div className="flex items-center gap-4 shrink-0">
                <div className={`p-2 rounded-lg ${
                  item.severity === 'high' ? 'bg-red-500/10 text-red-500' : 
                  item.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' : 'bg-white/5 text-zinc-500'
                }`}>
                  {item.issue === 'Unassigned' ? <UserMinus size={16} /> : <RotateCcw size={16} />}
                </div>
                <div>
                  <h4 className="text-[11px] font-black text-white uppercase tracking-tight">{item.title}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                    item.severity === 'high' ? 'text-red-500' : 'text-zinc-500'
                  }`}>
                    {item.issue} • {item.time}
                  </p>
                </div>
              </div>
              <ChevronRight size={14} className="text-zinc-800 group-hover:text-white transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-red-500/5 border-t border-red-500/10 flex items-center gap-4">
        <div className="p-2 rounded-full bg-red-500/10">
           <Clock size={16} className="text-red-500" />
        </div>
        <div>
           <p className="text-[10px] font-black text-white uppercase italic leading-none">Global Latency: 4.2h</p>
           <p className="text-[8px] text-zinc-500 font-bold uppercase mt-1">Resolution of high-priority tickets required</p>
        </div>
      </div>
    </GlassCard>
  );
}
