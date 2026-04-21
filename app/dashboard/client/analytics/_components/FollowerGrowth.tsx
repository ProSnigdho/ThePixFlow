"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

const data = [
  { name: 'Week 1', followers: 12400 },
  { name: 'Week 2', followers: 13500 },
  { name: 'Week 3', followers: 14800 },
  { name: 'Week 4', followers: 16200 },
  { name: 'Week 5', followers: 15900 },
  { name: 'Week 6', followers: 17500 },
  { name: 'Week 7', followers: 19800 },
];

export function FollowerGrowth() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Follower Velocity</h3>
          <p className="text-[10px] text-zinc-600">8-Week Growth Curve</p>
        </div>
        <div className="p-1 px-2 rounded bg-green-500/10 border border-green-500/20 flex items-center gap-1.5">
          <TrendingUp size={12} className="text-green-500" />
          <span className="text-[10px] font-black text-green-500">+14.2%</span>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #1A1A1A', borderRadius: '8px' }}
              itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900, color: '#22c55e' }}
              labelStyle={{ color: '#454545', fontSize: '9px', fontWeight: 900, marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="followers" 
              stroke="#22c55e" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#22c55e', strokeWidth: 2, stroke: '#000' }}
              activeDot={{ r: 6, fill: '#FFF' }}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
