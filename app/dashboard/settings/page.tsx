"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Input } from "@/components/ui/Input";
import { User, Bell, Shield, Wallet, Trash2 } from "lucide-react";

export default function GlobalSettingsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full max-w-4xl">
      <div className="flex flex-col gap-1">
        <h1 className="text-5xl font-extrabold tracking-tighter">System <span className="text-gradient">Settings</span></h1>
        <p className="text-gray-500 font-medium">Configure your production profile and security parameters.</p>
      </div>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-[#833ab4]" size={20} />
            Profile Identity
          </h2>
          <GlassCard className="border-white/5 bg-white/[0.01] grid md:grid-cols-2 gap-6 p-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Display Email</label>
              <Input placeholder="user@thepixflow.com" disabled />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Display Name</label>
              <Input placeholder="Identity Pending" />
            </div>
            <div className="md:col-span-2 pt-4">
              <GradientButton className="px-10">Confirm Identity Changes</GradientButton>
            </div>
          </GlassCard>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Bell className="text-[#fd1d1d]" size={20} />
            Signal Protocols
          </h2>
          <GlassCard className="border-white/5 bg-white/[0.01] p-8 space-y-4">
             {[
               "Email Notifications for Task Updates",
               "Push Notifications for New Messages",
               "Weekly Performance Recaps",
               "Marketing and Scaling Insights"
             ].map(opt => (
               <div key={opt} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 hover:bg-white/[0.02] px-2 rounded-lg transition-colors group">
                 <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{opt}</span>
                 <div className="w-10 h-5 bg-white/10 rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white/60 rounded-full" />
                 </div>
               </div>
             ))}
          </GlassCard>
        </section>

        <section className="space-y-4 pt-10 border-t border-white/5">
          <h2 className="text-xl font-bold flex items-center gap-2 text-red-500">
            <Shield className="text-red-500" size={20} />
            Hazard Zone
          </h2>
          <GlassCard className="border-red-500/10 bg-red-500/[0.02] p-8 flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-bold text-red-100">Decommission Account</p>
              <p className="text-xs text-red-200/50">Wipe all production history and data. This action is irreversible.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-black text-xs font-bold uppercase tracking-widest rounded-xl transition-all">
              <Trash2 size={14} /> Wipe Data
            </button>
          </GlassCard>
        </section>
      </div>
    </div>
  );
}
