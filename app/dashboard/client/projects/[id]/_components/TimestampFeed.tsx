"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare, Send, Clock, User } from "lucide-react";

export function TimestampFeed() {
  const comments = [
    { id: 1, time: "0:04", user: "Client", text: "Logo needs to be 20% larger here." },
    { id: 2, time: "0:12", user: "Editor", text: "Updated text color to match brand guide." },
    { id: 3, time: "0:25", user: "Client", text: "Can we swap this scene for the alternate take?" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-zinc-950/30 font-sans">
      <div className="p-4 border-b border-white/5 bg-black/40">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare size={14} className="text-blue-500" />
          Review Stream
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="group cursor-pointer">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{comment.time}</span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">{comment.user}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-zinc-300 leading-relaxed group-hover:bg-white/[0.05] transition-colors">
              {comment.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-black border-t border-white/5">
        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2 flex items-center gap-1">
           <Clock size={10} /> Add timestamped comment
        </div>
        <div className="flex gap-2">
           <div className="flex-1 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-1">
              <span className="text-xs font-mono text-zinc-700 font-bold">0:12</span>
              <div className="w-px h-4 bg-white/10 mx-3" />
              <input 
                type="text" 
                placeholder="Type feedback..." 
                className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none placeholder:text-zinc-700 py-2.5"
              />
           </div>
           <button className="p-2.5 rounded-xl bg-blue-500 text-black hover:scale-110 transition-transform">
              <Send size={18} />
           </button>
        </div>
      </div>
    </GlassCard>
  );
}
