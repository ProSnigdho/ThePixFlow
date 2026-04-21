"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, UserPlus, MoreVertical, TrendingUp, Clock, Zap } from "lucide-react";

interface HighDensityTableProps {
  title: string;
  subtitle: string;
  data: any[];
  columns: { key: string; label: string; type?: "text" | "stats" | "badge" | "quality" }[];
  actionLabel?: string;
  icon: React.ReactNode;
}

export function HighDensityTable({ title, subtitle, data, columns, actionLabel, icon }: HighDensityTableProps) {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500">
             {icon}
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">{title}</h3>
            <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           {actionLabel && (
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                {actionLabel} <UserPlus size={12} />
             </button>
           )}
           <button className="p-2 rounded-xl border border-white/10 text-zinc-600 hover:text-white transition-colors">
              <MoreVertical size={16} />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-[#050505] sticky top-0 z-10">
              {columns.map(col => (
                <th key={col.key} className="px-6 py-4">{col.label}</th>
              ))}
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    {col.type === "stats" ? (
                      <div className="flex items-center gap-2">
                        <TrendingUp size={12} className="text-green-500" />
                        <span className="text-[10px] font-black text-white uppercase">{row[col.key]}</span>
                      </div>
                    ) : col.type === "badge" ? (
                      <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {row[col.key]}
                      </span>
                    ) : col.type === "quality" ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 w-16 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                           <div className="h-full bg-green-500" style={{ width: row[col.key] }} />
                        </div>
                        <span className="text-[9px] font-bold text-zinc-500 italic uppercase">{row[col.key]}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-zinc-300 uppercase">{row[col.key]}</span>
                    )}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                   <button className="text-[9px] font-black uppercase text-zinc-700 hover:text-white transition-colors">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
