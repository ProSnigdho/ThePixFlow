"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from "lucide-react";

const data = [
  { name: '1', revenue: 4000, tasks: 12 },
  { name: '5', revenue: 4500, tasks: 15 },
  { name: '10', revenue: 7000, tasks: 22 },
  { name: '15', revenue: 8200, tasks: 28 },
  { name: '20', revenue: 10500, tasks: 35 },
  { name: '25', revenue: 14000, tasks: 42 },
  { name: '30', revenue: 18500, tasks: 55 },
];

export function GrowthEngine() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">Agency Growth Engine</h3>
            <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Revenue vs. Production Velocity (30D)</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
             <span className="text-[10px] font-bold text-zinc-500 uppercase">Tasks Fullfiled</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 pb-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
             <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
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
              contentStyle={{ backgroundColor: '#050505', border: '1px solid #1A1A1A', borderRadius: '12px' }}
              itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
              labelStyle={{ color: '#454545', fontSize: '10px', fontWeight: 900, marginBottom: '6px' }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#22c55e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
              animationDuration={2500}
            />
            <Area 
              type="monotone" 
              dataKey="tasks" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTasks)" 
              animationDuration={3000}
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="p-3 px-6 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500">
         <span>LTV Avg: $4,200</span>
         <div className="flex items-center gap-2">
            <span className="text-green-500">+12% Profit Margin Increase</span>
            <Activity size={12} className="text-green-500" />
         </div>
      </div>
    </GlassCard>
  );
}
