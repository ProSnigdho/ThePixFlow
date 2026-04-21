"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Target, FileText, Download, TrendingUp, Zap, BarChart3 } from "lucide-react";

export default function AdminStrategyPage() {
  const trendingFormats = [
    { title: "Point-of-View (POV) Narratives", reach: "1.4M Avg", growth: "+85%", niche: "Lifestyle" },
    { title: "Cinematic B-Roll Drops", reach: "800K Avg", growth: "+42%", niche: "Fitness" },
    { title: "Educational Quick-Tips", reach: "1.2M Avg", growth: "+68%", niche: "SaaS/Tech" },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Strategic <span className="text-blue-500">Intel</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Global Market & Format Analysis</p>
        </div>

        <button className="flex items-center gap-3 bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
           <FileText size={16} /> Generate Monthly Report
        </button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[65fr_35fr] gap-6 overflow-hidden">
        {/* Format Trends */}
        <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
           <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                 <Target size={14} className="text-blue-500" /> High-Performance Formats
              </h3>
              <span className="text-[9px] font-bold text-zinc-600 uppercase italic">Real-time aggregate data</span>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar p-6">
              <div className="grid grid-cols-1 gap-4">
                 {trendingFormats.map((item, idx) => (
                   <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Zap size={20} className="text-blue-500" />
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.title}</h4>
                           <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{item.niche} Ecosystem</p>
                        </div>
                      </div>
                      <div className="flex gap-10">
                         <div className="text-right">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Aggregate Reach</p>
                            <p className="text-xs font-black text-white italic">{item.reach}</p>
                         </div>
                         <div className="text-right">
                             <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Velocity</p>
                             <p className="text-xs font-black text-green-500 italic">{item.growth}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </GlassCard>

        {/* Global Benchmarks */}
        <div className="flex flex-col gap-6">
           <GlassCard className="flex-1 p-6 border-[#27272a]/50 bg-gradient-to-br from-[#0A0A0A] to-blue-950/20">
              <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                 <BarChart3 size={16} className="text-blue-500" /> Market Benchmarks
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 mb-2">
                       <span>Avg Industry Engagement</span>
                       <span className="text-white">3.8%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[70%]" />
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500 mb-2">
                       <span>Retention Goal (3s)</span>
                       <span className="text-white">72%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 w-[85%]" />
                    </div>
                 </div>
              </div>
              
              <div className="mt-10 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                 <p className="text-[10px] font-black text-blue-500 uppercase italic">Scale Opportunity</p>
                 <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">
                    Clients using the "POV Narrative" format are seeing <span className="text-white font-bold">2.4x</span> ROI compared to traditional ad styles.
                 </p>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
