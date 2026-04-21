"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { TrendingUp, Users, Target, Zap, Activity, MoreVertical, Eye } from "lucide-react";

export default function MarketingCompetitorsPage() {
  const competitors = [
     { name: "@gymshark", growth: "+12.4%", views: "850K", format: "Fast Transitions" },
     { name: "@niketraining", growth: "+8.2%", views: "1.2M", format: "POV Storytelling" },
     { name: "@redbull", growth: "+15.8%", views: "2.4M", format: "Extreme B-Roll" },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex-none flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Competitor <span className="text-red-500">Battleground</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Global Sector Analysis & Format Surveillance</p>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-[10px] font-black text-zinc-500 uppercase">Tracked Nodes: 12</span>
           <div className="h-8 w-px bg-white/5 mx-2" />
           <button className="bg-white text-black text-[10px] font-black uppercase px-6 py-2.5 rounded-xl hover:scale-105 transition-all">
              Add Target Account
           </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[1fr_400px] gap-6 overflow-hidden">
        {/* Comparison Engine */}
        <div className="flex flex-col gap-6 min-h-0 overflow-hidden">
           <GlassCard className="flex-1 flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
              <div className="p-4 border-b border-white/5 bg-black/60 sticky top-0 z-20 flex justify-between items-center">
                 <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Global Sector Performance</h3>
                 <span className="text-[10px] font-bold text-zinc-600 uppercase">Benchmark: High Performance</span>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-white/5 text-[9px] font-black text-zinc-700 uppercase tracking-widest bg-[#050505] sticky top-0 z-10">
                          <th className="px-6 py-4">Target Identity</th>
                          <th className="px-6 py-4">Growth Curve</th>
                          <th className="px-6 py-4">Reach Node</th>
                          <th className="px-6 py-4">Primary Format</th>
                          <th className="px-6 py-4"></th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.02]">
                       {competitors.map((comp, idx) => (
                         <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                    <Target size={14} />
                                 </div>
                                 <span className="text-[11px] font-black text-white uppercase tracking-tight">{comp.name}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                 <TrendingUp size={12} className="text-green-500" />
                                 <span className="text-[10px] font-black text-green-500 italic">{comp.growth}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[10px] font-bold text-zinc-400 uppercase">{comp.views} / Month</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap">
                                 {comp.format}
                              </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                              <MoreVertical size={14} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-white" />
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </GlassCard>

           <GlassCard className="h-[200px] border-red-500/20 bg-red-500/[0.02] flex items-center justify-between p-10 relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Activity size={120} className="text-red-500" />
               </div>
               <div className="relative z-10 max-w-md">
                  <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Alpha Insight Detected</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                     Target <span className="text-white font-bold">@gymshark</span> has switched to a 24fps cinematic aesthetic. This has resulted in a <span className="text-green-500 font-bold">22.5% increase</span> in watch time over the last 48 hours.
                  </p>
               </div>
               <button className="relative z-10 bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                  Deploy Strategy Counter
               </button>
           </GlassCard>
        </div>

        {/* Trend Tracker Sidebar */}
        <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-[#0A0A0A]">
            <div className="p-4 border-b border-white/5 bg-black/60 flex items-center gap-2">
               <Zap size={14} className="text-yellow-500" />
               <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">Global Viral Tracker</h3>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
               {[1, 2, 3].map(i => (
                 <div key={i} className="group cursor-pointer space-y-3">
                    <div className="aspect-video w-full rounded-2xl bg-zinc-900 border border-white/5 relative overflow-hidden shadow-lg">
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div className="flex items-center gap-2 mb-1">
                             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                             <span className="text-[9px] font-black text-white uppercase tracking-widest">Trending Now</span>
                          </div>
                       </div>
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                          <Eye size={24} className="text-white" />
                       </div>
                    </div>
                    <div className="flex justify-between items-start px-1">
                       <div>
                          <p className="text-[10px] font-black text-white uppercase italic tracking-tighter leading-none">Fast-Cut Technical Split</p>
                          <p className="text-[8px] font-bold text-zinc-600 uppercase mt-1 tracking-widest">Growth Factor: 5.4x</p>
                       </div>
                       <button className="text-[8px] font-black text-blue-500 uppercase hover:underline">Request Template</button>
                    </div>
                 </div>
               ))}
            </div>
        </GlassCard>
      </div>
    </div>
  );
}
