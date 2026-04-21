"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, TrendingUp, Calendar, Zap, Target } from "lucide-react";

interface CompetitorData {
  name: string;
  avatar: string;
  avgViews: number;
  frequency: number; // videos per week
  engagement: number;
}

export function ComparisonCard({ client, competitor }: { client: CompetitorData, competitor: CompetitorData }) {
  const metrics = [
    { label: "Avg Views", clientVal: client.avgViews, compVal: competitor.avgViews, suffix: "K" },
    { label: "Post Frequency", clientVal: client.frequency, compVal: competitor.frequency, suffix: "/wk" },
    { label: "Engagement Rate", clientVal: client.engagement, compVal: competitor.engagement, suffix: "%" },
  ];

  const getPercentage = (val1: number, val2: number) => {
    const total = val1 + val2;
    return (val1 / total) * 100;
  };

  return (
    <div className="grid grid-cols-2 gap-8 h-full min-h-0">
      {/* Column 1: Client Profile */}
      <GlassCard className="h-full flex flex-col border-blue-500/20 bg-blue-500/[0.02] overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-black/40 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
            <User size={32} className="text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">{client.name}</h3>
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded">Your Profile</span>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.label}</span>
                <span className="text-xl font-black text-white">{m.clientVal}{m.suffix}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000" 
                  style={{ width: `${getPercentage(m.clientVal, m.compVal)}%` }} 
                />
              </div>
              <p className="text-[9px] font-bold text-zinc-600 uppercase">
                {m.clientVal > m.compVal ? "Leading by " + (m.clientVal - m.compVal).toFixed(1) + m.suffix : "Trailing competitor"}
              </p>
            </div>
          ))}

          <div className="pt-6 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4">
              <Zap size={20} className="text-yellow-500" />
              <div>
                <p className="text-[10px] font-black text-zinc-400 uppercase">AI Strategic Insight</p>
                <p className="text-[11px] text-zinc-200 leading-tight">Your engagement is 1.2% higher. Maintain current visual style for continued growth.</p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Column 2: Competitor Profile */}
      <GlassCard className="h-full flex flex-col border-red-500/20 bg-red-500/[0.02] overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-black/40 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
            <Target size={32} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">{competitor.name}</h3>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">Competitor Target</span>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar opacity-60">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.label}</span>
                <span className="text-xl font-black text-white">{m.compVal}{m.suffix}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-1000" 
                  style={{ width: `${getPercentage(m.compVal, m.clientVal)}%` }} 
                />
              </div>
            </div>
          ))}

          <div className="pt-6 border-t border-white/5">
             <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black text-zinc-500 uppercase">Top Content Format</p>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-between">
                   <span className="text-xs font-bold text-zinc-400">Cinematic Transitions</span>
                   <TrendingUp size={14} className="text-red-500" />
                </div>
             </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
