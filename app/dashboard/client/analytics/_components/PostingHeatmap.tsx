"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock } from "lucide-react";

export function PostingHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM", "12AM"];

  // Mock intensity data (0 to 1)
  const getIntensity = (day: number, hour: number) => {
    // Peak times usually midweek evenings
    if (day > 1 && day < 5 && hour >= 4 && hour <= 5) return 0.9;
    if (day >= 5 && hour >= 3 && hour <= 6) return 0.7;
    if (hour >= 2 && hour <= 4) return 0.5;
    return 0.1;
  };

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Post Optimization</h3>
          <p className="text-[10px] text-zinc-600">Best Posting Time Heatmap</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-blue-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase">GMT-4</span>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
        <div className="grid grid-cols-[40px_1fr] gap-4 h-full">
          {/* Y-Axis: Hours */}
          <div className="flex flex-col justify-between py-2">
            {hours.map(h => (
              <span key={h} className="text-[9px] font-bold text-zinc-700 uppercase">{h}</span>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {/* Grid */}
            <div className="flex-1 grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, d) => (
                <div key={d} className="flex flex-col gap-1">
                  {Array.from({ length: 7 }).map((_, h) => {
                    const intensity = getIntensity(d, h);
                    return (
                      <div 
                        key={h} 
                        className="flex-1 rounded-sm transition-all hover:scale-110 cursor-pointer border border-white/5"
                        style={{ 
                          backgroundColor: intensity > 0.8 ? '#22c55e' : 
                                           intensity > 0.5 ? '#22c55e' : 
                                           intensity > 0.2 ? '#22c55e' : '#1A1A1A',
                          opacity: intensity === 0.1 ? 0.3 : intensity
                        }}
                        title={`${days[d]} at ${hours[h]} - ${Math.round(intensity * 100)}% Engagement`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* X-Axis: Days */}
            <div className="grid grid-cols-7 gap-1">
              {days.map(d => (
                <span key={d} className="text-[9px] font-bold text-zinc-700 uppercase text-center">{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-zinc-950/50 border-t border-white/5 flex gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-green-500" />
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Highest Engagement</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-2.5 h-2.5 rounded bg-zinc-800" />
           <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Low Traffic</span>
        </div>
      </div>
    </GlassCard>
  );
}
