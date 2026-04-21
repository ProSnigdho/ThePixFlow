"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye } from "lucide-react";

const data = [
  { name: 'Mon', views: 4000, engagement: 2400 },
  { name: 'Tue', views: 3000, engagement: 1398 },
  { name: 'Wed', views: 2000, engagement: 9800 },
  { name: 'Thu', views: 2780, engagement: 3908 },
  { name: 'Fri', views: 1890, engagement: 4800 },
  { name: 'Sat', views: 2390, engagement: 3800 },
  { name: 'Sun', views: 3490, engagement: 4300 },
];

export function PerformanceSnapshot() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">IG Performance Snapshot</h3>
          <p className="text-[10px] text-zinc-600">Last 7 Days Activity</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase">Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="text-[9px] font-bold text-zinc-500 uppercase">Engagement</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#454545', fontSize: 10, fontWeight: 700 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#454545', fontSize: 10, fontWeight: 700 }}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '8px' }}
              itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
              labelStyle={{ color: '#454545', fontSize: '9px', fontWeight: 900, marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="views" 
              stroke="#22c55e" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorViews)" 
              animationDuration={2000}
            />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEngagement)" 
              animationDuration={2500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-4 grid grid-cols-3 border-t border-white/5 bg-black/60">
        <div className="text-center">
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">Total Views</p>
          <p className="text-xs font-black text-white mt-1">142.8K</p>
        </div>
        <div className="text-center border-x border-white/5">
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">Net Followers</p>
          <p className="text-xs font-black text-green-500 mt-1">+1,240</p>
        </div>
        <div className="text-center">
          <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest leading-none">Avg Engagement</p>
          <p className="text-xs font-black text-white mt-1">4.82%</p>
        </div>
      </div>
    </GlassCard>
  );
}
