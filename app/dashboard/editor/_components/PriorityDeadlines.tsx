"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertTriangle, Clock } from "lucide-react";

interface Deadline {
  id: string;
  projectTitle: string;
  timeRemaining: string;
  severity: "critical" | "warning" | "on-track";
}

interface DeadlineProps {
  deadlines: Deadline[];
}

export function PriorityDeadlines({ deadlines }: DeadlineProps) {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Priority Deadlines</h3>
        <p className="text-[10px] text-zinc-600">Next 24 Hours</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-4 bottom-4 w-px bg-zinc-800/50" />

        <div className="flex flex-col gap-6 relative">
          {deadlines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 opacity-30">
              <Clock size={32} className="mb-2" />
              <p className="text-[10px] uppercase font-bold tracking-widest">No urgent deadlines</p>
            </div>
          ) : (
            deadlines.map((item, idx) => (
              <div key={item.id} className="flex gap-4 group">
                <div className={`mt-1.5 w-4 h-4 rounded-full border-4 border-black z-10 shrink-0 ${
                  item.severity === "critical" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                  item.severity === "warning" ? "bg-orange-500" : "bg-zinc-700"
                }`} />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-[11px] font-bold text-white group-hover:text-red-400 transition-colors uppercase truncate max-w-[120px]">
                      {item.projectTitle}
                    </h4>
                    <span className={`text-[9px] font-mono ${
                      item.severity === "critical" ? "text-red-500" : "text-zinc-500"
                    }`}>
                      {item.timeRemaining}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="h-[2px] flex-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        item.severity === "critical" ? "w-[90%] bg-red-500" : 
                        item.severity === "warning" ? "w-[60%] bg-orange-500" : "w-[30%] bg-zinc-600"
                      }`} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {deadlines.some(d => d.severity === "critical") && (
        <div className="p-3 bg-red-500/5 border-t border-red-500/10 flex items-center gap-2">
          <AlertTriangle size={12} className="text-red-500" />
          <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">Action Required on Critical Tasks</span>
        </div>
      )}
    </GlassCard>
  );
}
