"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, ShieldCheck, AlertCircle } from "lucide-react";

export function WorkloadPulse() {
  const editors = [
    { name: "Editor Alex", load: 5, max: 5, status: "maxed" },
    { name: "Editor Sarah", load: 3, max: 5, status: "available" },
    { name: "Editor Mike", load: 4, max: 5, status: "near-limit" },
    { name: "Editor Emma", load: 1, max: 5, status: "idle" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-zinc-950">
      <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Zap size={14} className="text-yellow-500" />
          Editor Workload Pulse
        </h3>
        <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/30 px-2 py-0.5 rounded bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
          Auto-Assign ON
        </button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
        {editors.map((editor, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">{editor.name}</span>
                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  editor.status === 'maxed' ? 'bg-red-500/10 text-red-500' :
                  editor.status === 'near-limit' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                }`}>
                  {editor.status}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">{editor.load}/{editor.max} Tasks</span>
            </div>
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  editor.status === 'maxed' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                  editor.status === 'near-limit' ? 'bg-orange-500' : 'bg-green-500'
                }`} 
                style={{ width: `${(editor.load / editor.max) * 100}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 px-6 bg-black/60 border-t border-white/5 flex items-center gap-3">
         <ShieldCheck size={16} className="text-zinc-600" />
         <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
            Average capacity utilized: <span className="text-zinc-300">65%</span>
         </p>
      </div>
    </GlassCard>
  );
}
