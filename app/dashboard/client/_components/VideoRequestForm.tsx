"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { PlusCircle, Link as LinkIcon, Send } from "lucide-react";

export function VideoRequestForm() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-gradient-to-br from-[#0A0A0A] to-zinc-950">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlusCircle size={14} className="text-green-500" />
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">New Video Request</h3>
        </div>
        <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/10">Priority: Standard</span>
      </div>

      <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
        <form className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Project Title</label>
            <input 
              type="text" 
              placeholder="e.g. Nike Summer Ad Campaign"
              className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:border-green-500/50 transition-all font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Video Style</label>
            <select className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-400 focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer">
              <option>IG Reel (Fast-Paced)</option>
              <option>YouTube Longform</option>
              <option>TikTok Trend</option>
              <option>Cinematic B-Roll</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Platform</label>
            <select className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-zinc-400 focus:outline-none focus:border-green-500/50 transition-all appearance-none cursor-pointer">
              <option>Instagram</option>
              <option>TikTok</option>
              <option>YouTube</option>
              <option>Twitter/X</option>
            </select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Source Footage Link</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Google Drive / Dropbox Link"
                className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:border-green-500/50 transition-all pr-10"
              />
              <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
            </div>
          </div>

          <div className="col-span-2 flex justify-end mt-2">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 transition-all">
              Launch Production <Send size={12} />
            </button>
          </div>
        </form>
      </div>
    </GlassCard>
  );
}
