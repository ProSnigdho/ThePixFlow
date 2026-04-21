"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Info, Bell, UserPlus, CreditCard } from "lucide-react";

export function AdminSystemAlerts() {
  const alerts = [
    { id: 1, type: "client", msg: "New Client Signup: Zenith Media", time: "12m ago" },
    { id: 2, type: "billing", msg: "Payment Recieved: Apple Event ($5k)", time: "45m ago" },
    { id: 3, type: "alert", msg: "Deadline Missed: Tesla FSD (E1)", time: "1h ago" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-zinc-950/20">
      <div className="p-4 border-b border-white/5 bg-black/40">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Bell size={14} className="text-purple-500" />
          System Alerts
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-0">
        <div className="flex flex-col">
          {alerts.map((alert, idx) => (
            <div 
              key={alert.id} 
              className={`p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all flex gap-3 ${
                idx === alerts.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {alert.type === 'client' ? <UserPlus size={12} className="text-blue-500" /> :
                 alert.type === 'billing' ? <CreditCard size={12} className="text-green-500" /> :
                 <Info size={12} className="text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] leading-relaxed text-zinc-300 font-medium">
                   {alert.msg}
                </p>
                <p className="text-[8px] font-mono text-zinc-700 mt-1 uppercase tracking-tighter">
                   {alert.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between">
         <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Global Pulse</span>
         <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-green-500" />
            <div className="w-1 h-1 rounded-full bg-green-500" />
         </div>
      </div>
    </GlassCard>
  );
}
