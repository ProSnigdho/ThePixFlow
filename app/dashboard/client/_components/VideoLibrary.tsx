"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Video, Download, ExternalLink, Play } from "lucide-react";

interface VideoItem {
  id: string;
  title: string;
  link: string; // The completed drive link
  createdAt: string;
}

interface VideoLibraryProps {
  videos: VideoItem[];
}

export function VideoLibrary({ videos }: VideoLibraryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Video className="text-[#fcb045]" size={20} />
        Video Library
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => (
          <GlassCard key={video.id} className="p-0 border-white/5 bg-white/[0.02] overflow-hidden group">
            <div className="aspect-video bg-white/5 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
              <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300" size={32} />
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                <span className="text-xs font-bold text-white truncate">{video.title}</span>
              </div>
            </div>
            <div className="p-3 flex gap-2">
              <a 
                href={video.link} 
                target="_blank" 
                rel="noreferrer" 
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
              >
                <ExternalLink size={12} /> View
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#fd1d1d]/10 hover:bg-[#fd1d1d]/20 text-[#fd1d1d] rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors">
                <Download size={12} /> Download
              </button>
            </div>
          </GlassCard>
        ))}
        {videos.length === 0 && (
          <GlassCard className="col-span-full py-12 text-center opacity-30 border-dashed border-white/10">
            <p className="text-sm italic">Your completed masterpieces will appear here.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
