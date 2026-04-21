"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Wallet, CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";

export function EarningsTracker() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Wallet className="text-[#fcb045]" size={20} />
        Earnings Radar
      </h2>
      <GlassCard className="border-white/5 bg-gradient-to-br from-[#fd1d1d]/5 to-transparent p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Unpaid Balance</p>
            <p className="text-3xl font-black text-white">$840.00</p>
          </div>
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            <TrendingUp size={16} className="text-green-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-green-500">
              <CheckCircle2 size={12} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Paid Tasks</span>
            </div>
            <span className="text-lg font-bold text-white">24</span>
          </div>
          <div className="p-3 rounded-xl bg-white/2 border border-white/5 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#fcb045]">
              <AlertCircle size={12} />
              <span className="text-[10px] font-bold uppercase tracking-tight">Awaiting</span>
            </div>
            <span className="text-lg font-bold text-white">4</span>
          </div>
        </div>

        <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/90 transition-all flex items-center justify-center gap-2">
          Request Payout <ArrowUpRight size={14} />
        </button>
      </GlassCard>
    </div>
  );
}

function TrendingUp(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
