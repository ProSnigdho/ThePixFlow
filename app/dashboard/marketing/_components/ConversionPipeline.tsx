"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter } from "lucide-react";

const funnelData = [
  { step: 'Found', value: 450, color: '#1e1b4b' },     // Indigo 950
  { step: 'Contacted', value: 280, color: '#312e81' }, // Indigo 900
  { step: 'Replied', value: 120, color: '#3730a3' },   // Indigo 800
  { step: 'Converted', value: 35, color: '#4338ca' },  // Indigo 700
];

export function ConversionPipeline() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Filter size={16} className="text-indigo-500" />
          </div>
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">Conversion Pipeline</h3>
        </div>
        <div className="flex gap-4">
           <span className="text-[10px] font-black text-zinc-600 uppercase">Growth Engine</span>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0 flex flex-col gap-6">
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              layout="vertical" 
              data={funnelData} 
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="step" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A1A1AA', fontSize: 10, fontWeight: 900 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ backgroundColor: '#050505', border: '1px solid #1A1A1A', borderRadius: '8px' }}
                itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
              />
              <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={32}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 px-2">
           {funnelData.map((item, idx) => (
             <div key={idx} className="flex flex-col items-center gap-1">
                <div className="text-xs font-black text-white">{item.value}</div>
                <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest text-center leading-none">{item.step}</div>
             </div>
           ))}
        </div>
      </div>

      <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] font-black text-zinc-500 uppercase">Overall CVR: 7.8%</span>
         <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
            <div className="w-1 h-1 rounded-full bg-indigo-500" />
         </div>
      </div>
    </GlassCard>
  );
}
