"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { DollarSign, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export function RevenueCard() {
  return (
    <div className="h-full premium-halo">
      <GlassCard className="h-full p-8 border-white/5 bg-gradient-to-br from-[#0A0A0A] to-transparent flex flex-col justify-between group">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-black">Gross Revenue Flow</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black text-white tracking-tighter">$48,250</h3>
              <span className="text-sm font-bold text-green-500 flex items-center gap-0.5">
                <ArrowUpRight size={14} /> 22%
              </span>
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 shadow-2xl">
            <DollarSign size={24} className="text-[#fcb045]" />
          </div>
        </div>

        <div className="flex items-end gap-3 h-32 mt-8">
          {[40, 70, 45, 90, 65, 80, 50, 95, 75, 100].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
              className="flex-1 bg-gradient-to-t from-[#833ab4]/10 via-[#fd1d1d]/40 to-[#fd1d1d] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
            />
          ))}
        </div>

        <div className="pt-6 border-t border-white/5 flex gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-600 uppercase">Projected</p>
            <p className="text-sm font-bold text-gray-300">$62.4k</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-gray-600 uppercase">Avg. Deal</p>
            <p className="text-sm font-bold text-gray-300">$1.2k</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
