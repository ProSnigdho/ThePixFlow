"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, TrendingDown, TrendingUp } from "lucide-react";

const data = [
  { name: 'PixFlow', score: 94, growth: '+12%' },
  { name: 'Agency X', score: 72, growth: '+2%' },
  { name: 'VideoFlow', score: 65, growth: '-5%' },
];

export function CompetitorTracker() {
  return (
    <GlassCard className="h-full flex flex-col border-white/[0.03] overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 bg-black/60 flex justify-between items-center">
         <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Target size={14} className="text-red-500" />
            Competitors Performance
         </h3>
         <span className="text-[9px] font-black text-zinc-600 uppercase italic">Market Velocity</span>
      </div>

      <div className="flex-1 p-5 min-h-0 flex flex-col gap-4">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#454545', fontSize: 10, fontWeight: 900 }} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#050505', border: '1px solid #1A1A1A', borderRadius: '8px' }}
                itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : '#1A1A1A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
           {data.map((item, idx) => (
             <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/[0.03]">
                <span className="text-[10px] font-black text-white uppercase">{item.name}</span>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-mono text-zinc-500">{item.score}%</span>
                   {item.growth.startsWith('+') ? <TrendingUp size={10} className="text-green-500" /> : <TrendingDown size={10} className="text-red-500" />}
                </div>
             </div>
           ))}
        </div>
      </div>
    </GlassCard>
  );
}
