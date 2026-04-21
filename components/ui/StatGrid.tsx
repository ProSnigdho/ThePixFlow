"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
}

interface StatGridProps {
  items: StatItem[];
  cols?: number;
}

export function StatGrid({ items, cols = 4 }: StatGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[cols] || "grid-cols-4";

  return (
    <div className={cn("grid gap-6 h-full", gridCols)}>
      {items.map((item, idx) => (
        <GlassCard key={idx} className="flex flex-col justify-between p-5 border-[#27272a]/50 relative overflow-hidden group h-full">
          <div className="flex justify-between items-start relative z-10">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">{item.label}</span>
            <div className={cn(
              "p-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 group-hover:scale-110 transition-transform",
            )}>
              {item.icon}
            </div>
          </div>
          
          <div className="mt-2 relative z-10 flex flex-col">
            <div className="text-3xl font-black italic tracking-tighter text-white">
              {item.value}
            </div>
            {item.trend && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className={cn(
                  "h-1 w-8 rounded-full",
                  item.color ? "" : "bg-zinc-800"
                )} style={item.color ? { backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}80` } : {}} />
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  item.trendType === "positive" ? "text-green-500" : 
                  item.trendType === "negative" ? "text-red-500" : "text-zinc-500"
                )}>
                  {item.trend}
                </span>
              </div>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
