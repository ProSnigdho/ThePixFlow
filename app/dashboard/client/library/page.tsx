"use client";

import React from "react";
import { MediaCard } from "./_components/MediaCard";
import { Search, Filter, Grid, LayoutList } from "lucide-react";

export default function ClientLibraryPage() {
  const libraryItems: any[] = [
    { id: "1", title: "Nike Promo Final", platform: "Instagram", date: "April 15, 2026", size: "45 MB" },
    { id: "2", title: "Summer Vlog Reel", platform: "TikTok", date: "April 14, 2026", size: "128 MB" },
    { id: "3", title: "Q2 Earnings Short", platform: "YouTube", date: "April 12, 2026", size: "12 MB" },
    { id: "4", title: "Brand Identity Clip", platform: "Instagram", date: "April 10, 2026", size: "32 MB" },
    { id: "5", title: "Gym Session Edit", platform: "TikTok", date: "April 08, 2026", size: "88 MB" },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Media <span className="text-zinc-500">Vault</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Your Production Inventory</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative">
              <input 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-500/50 pr-10 w-64"
                placeholder="Search archive..."
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
           </div>
           <button className="p-2.5 rounded-xl border border-white/10 text-zinc-500 hover:text-white transition-all"><Filter size={18} /></button>
           <div className="h-8 w-px bg-white/5 mx-2" />
           <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button className="p-1.5 rounded-lg bg-white/10 text-white shadow-lg"><Grid size={16} /></button>
              <button className="p-1.5 rounded-lg text-zinc-600 hover:text-white transition-colors"><LayoutList size={16} /></button>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {libraryItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
