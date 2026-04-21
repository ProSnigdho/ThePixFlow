"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Database, Link as LinkIcon, Download, Search } from "lucide-react";

export function AssetVault() {
  const assets = [
    { name: "PixFlow Logo Pack", type: "Visuals", size: "24MB" },
    { name: "Standard SFX Library", type: "Audio", size: "1.2GB" },
    { name: "Brand Guidelines PDF", type: "Doc", size: "4MB" },
    { name: "LUT Pack v2", type: "Assets", size: "150MB" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Database className="text-[#833ab4]" size={20} />
        Asset Vault
      </h2>
      <GlassCard className="border-white/5 bg-white/[0.02] p-0 overflow-hidden">
        <div className="p-4 border-b border-white/5 relative">
          <input 
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none"
            placeholder="Search agency assets..."
          />
          <Search className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-700" size={12} />
        </div>
        <div className="divide-y divide-white/5">
          {assets.map((asset) => (
            <div key={asset.name} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-white transition-colors">
                  <LinkIcon size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-200">{asset.name}</p>
                  <p className="text-[10px] text-gray-500">{asset.type} • {asset.size}</p>
                </div>
              </div>
              <button className="p-2 text-gray-600 hover:text-[#fd1d1d] transition-colors">
                <Download size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="p-3 bg-black/20 text-center">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Global Agency Assets</p>
        </div>
      </GlassCard>
    </div>
  );
}
