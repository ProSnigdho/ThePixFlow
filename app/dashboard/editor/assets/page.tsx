"use client";

import React, { useState, useMemo } from "react";
import { 
  Play, 
  Download, 
  Search, 
  Filter, 
  Maximize2, 
  FolderOpen, 
  Music, 
  Video, 
  Palette, 
  Layers,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Data Structure ──────────────────────────────────────────────────────────

const ASSET_CATEGORIES = [
  { id: "all", label: "All Assets", icon: <FolderOpen size={14} /> },
  { id: "video", label: "Stock Footage", icon: <Video size={14} /> },
  { id: "music", label: "Audio & SFX", icon: <Music size={14} /> },
  { id: "overlay", label: "Overlays & VFX", icon: <Layers size={14} /> },
  { id: "brand", label: "Brand Kits", icon: <Palette size={14} /> },
];

const INITIAL_ASSETS = [
  {
    id: 1,
    title: "Cinematic City Drone Walk",
    category: "video",
    type: "4K MP4",
    size: "1.2 GB",
    thumbnail: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 2,
    title: "Urban Lo-Fi Beat Loop",
    category: "music",
    type: "WAV 24-bit",
    size: "45 MB",
    thumbnail: "https://images.unsplash.com/photo-1514525253361-bee87184919a?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 3,
    title: "Glitch Transition Pack",
    category: "overlay",
    type: "ProRes 4444",
    size: "850 MB",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 4,
    title: "ThePixFlow Brand Styleguide",
    category: "brand",
    type: "PDF / SVG",
    size: "12 MB",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 5,
    title: "Nature Timelapse - Alps",
    category: "video",
    type: "8K RAW",
    size: "4.5 GB",
    thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 6,
    title: "Subtle Film Grain Overlay",
    category: "overlay",
    type: "MP4 / Loop",
    size: "210 MB",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 7,
    title: "Futuristic UI Sound Effects",
    category: "music",
    type: "WAV / MP3",
    size: "15 MB",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=600",
    url: "#"
  },
  {
    id: 8,
    title: "Premium Logo Mockups",
    category: "brand",
    type: "PSD",
    size: "1.1 GB",
    thumbnail: "https://images.unsplash.com/photo-1541462608141-ad516aaeb0f3?auto=format&fit=crop&q=80&w=600",
    url: "#"
  }
];

export default function AssetsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = useMemo(() => {
    return INITIAL_ASSETS.filter((asset) => {
      const matchesCategory = activeCategory === "all" || asset.category === activeCategory;
      const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      
      {/* ─── Top Filtering Bar ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-white/5 backdrop-blur-sm overflow-x-auto no-scrollbar">
          {ASSET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeCategory === cat.id
                  ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]"
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#1A8080] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search the library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#1A4848] transition-all placeholder:text-zinc-700"
          />
        </div>
      </div>

      {/* ─── Asset Grid ─── */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1 pb-10">
        {filteredAssets.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-zinc-700 gap-4">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Search size={32} />
             </div>
             <p className="text-xs font-black uppercase tracking-widest">No assets found in this sector</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="group relative h-[380px] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-[#1A4848]/60 transition-all duration-700 cursor-pointer bg-zinc-900/40 shadow-2xl"
              >
                {/* Image Background */}
                <img 
                  src={asset.thumbnail} 
                  alt={asset.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brightness-75 group-hover:brightness-50" 
                />
                
                {/* Overlay Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#1A4848]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                  <div className="space-y-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1A8080] bg-[#1A4848]/10 px-2 py-0.5 rounded border border-[#1A4848]/20">
                      {asset.type}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-tight mt-2 line-clamp-2">
                      {asset.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      Asset Size: {asset.size}
                    </p>
                  </div>
                </div>

                {/* Action Buttons (Visible on Hover) */}
                <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 z-20">
                  <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[#1A8080] hover:scale-110 transition-all shadow-xl">
                    <Download size={18} />
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all shadow-xl">
                    <Maximize2 size={18} />
                  </button>
                </div>

                {/* Play Icon (For Video/Music) */}
                {(asset.category === 'video' || asset.category === 'music') && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-[#1A4848]/20 backdrop-blur-sm flex items-center justify-center border border-[#1A4848]/50 shadow-[0_0_30px_rgba(26,128,128,0.3)]">
                      <Play size={24} className="text-[#1A8080] translate-x-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Empty State / Footer Info ─── */}
      <div className="shrink-0 pt-4 border-t border-white/5 flex items-center justify-between opacity-40">
         <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
           Creative Asset Library • Version 2.0.4 • Powered by PixFlow Cloud
         </p>
         <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#1A8080]">
            Sync Status: Online <div className="w-1 h-1 rounded-full bg-[#1A8080] animate-pulse" />
         </div>
      </div>
    </div>
  );
}
