"use client";

import React from "react";
import { LimitTracker } from "../_components/LimitTracker";
import { TemplateLibrary } from "../_components/TemplateLibrary";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, User, Camera } from "lucide-react";

export default function MarketingOutreachPage() {
  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex-none">
        <LimitTracker />
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[1fr_380px] gap-6 overflow-hidden">
        {/* DM Workspace */}
        <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
          <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tighter">
                  @fitness_legend
                </h3>
                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">
                  Status: Active Dialogue
                </p>
              </div>
            </div>
            <Camera size={18} className="text-pink-500 opacity-50" />
          </div>

          <div className="flex-1 p-6 overflow-y-auto no-scrollbar space-y-6">
            <div className="flex justify-start">
              <div className="max-w-[70%] p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed">
                Hey! I saw your recent reel, liked the transition at 0:04.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[70%] p-4 rounded-2xl bg-blue-600 text-white text-xs leading-relaxed font-bold">
                Thanks! Glad you liked it. What do you do?
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[70%] p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-zinc-300 leading-relaxed italic">
                Typing...
              </div>
            </div>
          </div>

          <div className="p-4 bg-black border-t border-white/5 flex gap-4">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-1 flex items-center">
              <input
                placeholder="Type message or select template..."
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-zinc-800 py-3"
              />
            </div>
            <button className="p-4 rounded-2xl bg-blue-600 text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Send size={20} />
            </button>
          </div>
        </GlassCard>

        {/* Templates Sidebar */}
        <div className="min-h-0 overflow-hidden">
          <TemplateLibrary />
        </div>
      </div>
    </div>
  );
}
