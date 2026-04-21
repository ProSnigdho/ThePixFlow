"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare, Send, Paperclip, User, History } from "lucide-react";

interface ChatProps {
  projectId: string;
}

export function ChatHistory({ projectId }: ChatProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");

  const messages = [
    { id: 1, sender: "Admin", text: "Welcome to the project! Please focus on the intro transitions.", time: "10:00 AM", isSystem: false },
    { id: 2, sender: "System", text: "Client uploaded additional brand assets.", time: "11:30 AM", isSystem: true },
    { id: 3, sender: "Editor (You)", text: "Received. Starting the first cut now.", time: "11:45 AM", isSystem: false },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-zinc-950/20">
      {/* Tabs */}
      <div className="flex bg-black">
        <button 
          onClick={() => setActiveTab("chat")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "chat" ? "bg-white/[0.03] text-white border-b-2 border-red-500" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          <MessageSquare size={14} /> Briefing Chat
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === "history" ? "bg-white/[0.03] text-white border-b-2 border-orange-500" : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          <History size={14} /> Revision History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {activeTab === "chat" ? (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender.includes("Editor") ? "items-end" : "items-start"}`}>
              {msg.isSystem ? (
                <div className="w-full text-center py-2">
                  <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-white/5">
                    {msg.text}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-black text-zinc-500 uppercase">{msg.sender}</span>
                    <span className="text-[8px] font-mono text-zinc-700">{msg.time}</span>
                  </div>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${
                    msg.sender.includes("Editor") ? "bg-red-500 text-white rounded-tr-none" : "bg-white/5 text-zinc-300 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-4 text-center py-20 opacity-30">
            <History size={48} className="mx-auto text-zinc-500 mb-4" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No revision history yet</p>
          </div>
        )}
      </div>

      {activeTab === "chat" && (
        <div className="p-4 bg-black border-t border-white/5 flex gap-2">
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors">
            <Paperclip size={18} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Send a message to admin..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 transition-colors"
            />
            <button className="absolute right-2 top-1.5 p-1 text-red-500 hover:scale-110 transition-transform">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
