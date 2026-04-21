"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Megaphone, ArrowUpRight, CheckCircle2 } from "lucide-react";

export function AgencyNotices() {
  const notices = [
    { id: 1, title: "Easter Campaign Assets Needed", type: "urgent", time: "2h ago" },
    { id: 2, name: "New Editor: Mark J. assigned", type: "system", time: "5h ago" },
    { id: 3, title: "Production Speed increased by 20%", type: "update", time: "1d ago" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Megaphone size={14} className="text-red-500" />
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Agency Announcements</h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-0">
        <div className="flex flex-col">
          {notices.map((notice, idx) => (
            <div key={notice.id} className="p-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors flex justify-between items-center group">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-zinc-300 uppercase truncate">
                  {notice.title || notice.name}
                </p>
                <p className="text-[8px] font-mono text-zinc-600 mt-0.5 uppercase tracking-tighter">
                  {notice.time} • {notice.type}
                </p>
              </div>
              <ArrowUpRight size={12} className="text-zinc-700 group-hover:text-white transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 bg-zinc-900/50 border-t border-white/5 space-y-2">
        <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Quick Task Status</h4>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-300 font-medium">IG Reel Editing</span>
          <span className="text-[10px] font-black text-blue-500 uppercase">80% Done</span>
        </div>
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 w-[80%] shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </div>
      </div>
    </GlassCard>
  );
}
