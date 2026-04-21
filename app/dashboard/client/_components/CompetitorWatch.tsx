"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Camera, Search, PlusCircle, Trash2 } from "lucide-react";

export function CompetitorWatch() {
  const [urls, setUrls] = useState(["", ""]);

  const handleUpdate = (idx: number, val: string) => {
    const newUrls = [...urls];
    newUrls[idx] = val;
    setUrls(newUrls);
  };

  const addUrl = () => setUrls([...urls, ""]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Camera className="text-[#833ab4]" size={20} />
        Competitor Watch
      </h2>
      <GlassCard className="border-white/5 bg-white/[0.02] space-y-4">
        <p className="text-xs text-gray-500 font-medium px-1">Track competitor URLs to help our editors match your industry's leading visual standards.</p>
        <div className="space-y-3">
          {urls.map((url, i) => (
            <div key={i} className="relative group">
              <Input 
                placeholder="https://instagram.com/competitor" 
                value={url}
                className="pr-10"
                onChange={(e) => handleUpdate(i, e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-[#833ab4] transition-colors">
                <Search size={14} />
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={addUrl}
          className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all"
        >
          <PlusCircle size={14} /> Add Tracking Node
        </button>
      </GlassCard>
    </div>
  );
}
