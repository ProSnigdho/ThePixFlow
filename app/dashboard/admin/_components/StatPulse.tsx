"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";

interface StatPulseProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function StatPulse({ label, value, icon, color }: StatPulseProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <GlassCard className="h-full p-6 border-white/5 flex items-center justify-between group">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-2xl font-black text-white" style={{ color: color }}>{value}</h3>
        </div>
        <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.08] transition-colors">
          {React.cloneElement(icon as React.ReactElement<any>, { size: 18, color: color })}
        </div>
      </GlassCard>
    </motion.div>
  );
}
