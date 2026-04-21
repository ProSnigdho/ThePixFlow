"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare, Search, Users, Send, Paperclip, MoreVertical, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function GlobalMessagesPage() {
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);

  const channels = [
    { id: 1, name: "Nike Promo Team", lastMsg: "Send the final render link.", time: "12:45", active: true },
    { id: 2, name: "Tesla Tutorials", lastMsg: "Feedback from client is in.", time: "10:20", active: false },
    { id: 3, name: "Global Admin Support", lastMsg: "Your payout has been processed.", time: "Yesterday", active: false },
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex flex-col gap-1 px-2">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Direct <span className="text-blue-500">Commms</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">End-to-End Encrypted Node</p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[3fr_9fr] gap-6 overflow-hidden">
        {/* Left: Communication Nodes */}
        <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
          <div className="p-4 border-b border-white/5 space-y-4">
            <div className="relative">
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 pr-10"
                placeholder="Search channels..."
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {channels.map((channel) => (
              <div 
                key={channel.id} 
                onClick={() => setSelectedChannel(channel.id)}
                className={`p-4 flex items-center gap-3 hover:bg-white/[0.03] transition-all cursor-pointer group relative ${
                  selectedChannel === channel.id ? "bg-white/[0.05]" : ""
                }`}
              >
                {selectedChannel === channel.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="font-black text-xs text-zinc-500">{channel.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-xs font-bold uppercase truncate ${selectedChannel === channel.id ? "text-white" : "text-zinc-400"}`}>
                      {channel.name}
                    </p>
                    <span className="text-[8px] font-mono text-zinc-600">{channel.time}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate italic">{channel.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Right: Message Stream */}
        <GlassCard className="h-full flex flex-col border-[#27272a]/50 bg-zinc-950/20 overflow-hidden">
          {selectedChannel ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-black/40 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Shield size={16} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">
                      {channels.find(c => c.id === selectedChannel)?.name}
                    </h3>
                    <p className="text-[9px] font-bold text-green-500 uppercase">Secure Connection Active</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500"><MoreVertical size={16} /></button>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Production System</span>
                  </div>
                  <div className="max-w-[70%] bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none text-[11px] text-zinc-300 leading-relaxed shadow-xl">
                    Welcome to the {channels.find(c => c.id === selectedChannel)?.name} command node. Please adhere to PixFlow security protocols when transmitting assets.
                  </div>
                </div>
              </div>

              {/* Input Zone */}
              <div className="p-4 bg-black border-t border-white/5">
                <div className="flex gap-3 items-center">
                  <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all">
                    <Paperclip size={18} />
                  </button>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Type secure message..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
                    />
                    <button className="absolute right-3 top-2 p-1 text-blue-500 hover:scale-110 transition-transform">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-30">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="p-10 rounded-full border-2 border-dashed border-zinc-800 mb-6">
                  <MessageSquare size={64} className="text-zinc-600" />
                </div>
              </motion.div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white mb-2">Initialize Communication</h2>
              <p className="text-xs text-zinc-500 max-w-[240px] font-medium leading-relaxed">Select a secure production node from the left to begin transmission.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
