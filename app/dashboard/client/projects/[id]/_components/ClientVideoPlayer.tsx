"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, Maximize, Volume2, Download, CheckCircle, RotateCcw } from "lucide-react";

export function ClientVideoPlayer() {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black">
      {/* Video Content Placeholder */}
      <div className="flex-1 relative group cursor-pointer">
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play size={40} className="text-white fill-white ml-2" />
           </div>
        </div>
        
        {/* Mock Video UI */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
          <div className="h-1.5 w-full bg-white/10 rounded-full mb-4 relative overflow-hidden">
             <div className="absolute left-0 top-0 bottom-0 bg-blue-500 w-[45%]" />
             <div className="absolute left-[45%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          </div>
          <div className="flex justify-between items-center text-white">
             <div className="flex items-center gap-4">
                <Play size={20} fill="currentColor" />
                <span className="text-xs font-mono">00:12 / 00:30</span>
                <Volume2 size={20} />
             </div>
             <Maximize size={20} />
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="p-4 bg-zinc-950 border-t border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-1">
            <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-zinc-500 uppercase italic tracking-widest">Draft V2</div>
         </div>
         <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10 text-white text-[10px] font-black uppercase hover:bg-white/5 transition-all">
               <RotateCcw size={14} /> Request Revision
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 text-black text-[10px] font-black uppercase hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
               <CheckCircle size={14} /> Approve & Download
            </button>
         </div>
      </div>
    </GlassCard>
  );
}
