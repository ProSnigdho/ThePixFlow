"use client";

import React from "react";
import { Play, ArrowUpRight } from "lucide-react";

const inspirations = [
  {
    id: 1,
    title: "Cinematic Edits",
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 2,
    title: "Motion Graphics",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    title: "Color Grading",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    title: "Sound Design",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 5,
    title: "Transitions",
    thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 6,
    title: "Short Form Edits",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=300",
  },
];

export function VideoInspiration() {
  return (
    <div className="premium-glass p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white">Video Editing Inspiration</h2>
          <p className="text-xs text-zinc-500 mt-1">Fresh ideas, trending styles and creative edits to fuel your next project.</p>
        </div>
        <button className="text-zinc-500 hover:text-white text-sm font-medium transition-colors flex items-center gap-2">
          Explore More <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-6 gap-4 flex-1 min-h-0">
        {inspirations.map((item) => (
          <div key={item.id} className="group relative rounded-xl overflow-hidden h-full border border-white/5 hover:border-cyan-neon/30 transition-all duration-500 cursor-pointer">
            <img 
              src={item.thumbnail} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75 group-hover:brightness-50" 
            />
            
            <div className="absolute inset-0 flex flex-col justify-end p-3 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
              <h4 className="text-xs font-bold text-white mb-1 group-hover:-translate-y-1 transition-transform">{item.title}</h4>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <div className="w-10 h-10 rounded-full bg-cyan-neon/20 backdrop-blur-sm flex items-center justify-center border border-cyan-neon/50">
                <Play size={16} className="text-cyan-neon translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
