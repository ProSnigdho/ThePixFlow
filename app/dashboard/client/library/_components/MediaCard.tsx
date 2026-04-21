"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Download, Camera, Music, Video, Share2, MoreVertical, Search, Filter } from "lucide-react";

interface MediaItem {
  id: string;
  title: string;
  platform: "Instagram" | "TikTok" | "YouTube";
  date: string;
  size: string;
}

export function MediaCard({ item }: { item: MediaItem }) {
  const getIcon = () => {
    switch (item.platform) {
      case "Instagram": return <Camera size={14} className="text-pink-500" />;
      case "TikTok": return <Music size={14} className="text-cyan-400" />;
      case "YouTube": return <Video size={14} className="text-red-500" />;
      default: return null;
    }
  };

  return (
    <GlassCard className="flex flex-col border-[#27272a]/50 overflow-hidden group hover:border-zinc-500 transition-all">
      <div className="aspect-[9/16] bg-zinc-900 relative overflow-hidden">
        {/* Mock Thumbnail Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 mb-1">
             <div className="p-1.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                {getIcon()}
             </div>
             <span className="text-[9px] font-black text-white uppercase tracking-widest">{item.platform}</span>
          </div>
        </div>
        
        {/* Hover Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
           <button className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform">
              <Download size={20} />
           </button>
           <button className="p-3 rounded-full bg-white/10 text-white hover:scale-110 transition-transform border border-white/20">
              <Share2 size={20} />
           </button>
        </div>
      </div>

      <div className="p-4 bg-zinc-950/50 space-y-2">
        <div className="flex justify-between items-start">
          <h4 className="text-[11px] font-black text-white uppercase truncate flex-1 pr-2">{item.title}</h4>
          <MoreVertical size={14} className="text-zinc-700 cursor-pointer hover:text-white" />
        </div>
        <div className="flex justify-between items-center border-t border-white/[0.03] pt-2">
          <span className="text-[9px] font-mono text-zinc-600 italic">{item.date}</span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">{item.size}</span>
        </div>
      </div>
    </GlassCard>
  );
}
