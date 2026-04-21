"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Trophy, Eye, Heart, MessageCircle } from "lucide-react";

export function BestPerformingVideo() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <Trophy size={24} className="text-yellow-500 opacity-50" />
      </div>
      
      <div className="p-4 border-b border-white/5 bg-black/40">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Top Performance Node</h3>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="aspect-video w-full rounded-2xl bg-zinc-900 border border-white/5 overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
            <p className="text-sm font-black text-white uppercase tracking-tight">Nike Summer Reel #1</p>
            <p className="text-[10px] text-zinc-400 uppercase font-bold">Published: April 12, 2026</p>
          </div>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                <Eye size={24} className="text-white" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
            <Eye size={16} className="text-blue-500 mb-1" />
            <span className="text-xs font-black text-white">24.5K</span>
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Views</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
            <Heart size={16} className="text-red-500 mb-1" />
            <span className="text-xs font-black text-white">1.8K</span>
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Likes</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
            <MessageCircle size={16} className="text-green-500 mb-1" />
            <span className="text-xs font-black text-white">412</span>
            <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Comments</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
