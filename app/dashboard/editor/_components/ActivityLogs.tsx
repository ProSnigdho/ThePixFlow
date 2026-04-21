"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MessageSquare, FileUp, UserPlus, Info } from "lucide-react";

interface LogEntry {
  id: string;
  type: "assignment" | "revision" | "message" | "system";
  content: string;
  timestamp: string;
}

interface ActivityProps {
  logs: LogEntry[];
}

export function ActivityLogs({ logs }: ActivityProps) {
  const getIcon = (type: LogEntry["type"]) => {
    switch (type) {
      case "assignment": return <UserPlus size={12} className="text-blue-500" />;
      case "revision": return <Info size={12} className="text-orange-500" />;
      case "message": return <MessageSquare size={12} className="text-purple-500" />;
      default: return <FileUp size={12} className="text-zinc-500" />;
    }
  };

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Activity & Notifications</h3>
        <p className="text-[10px] text-zinc-600">Real-time production feed</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-0">
        <div className="flex flex-col">
          {logs.length === 0 ? (
            <div className="h-24 flex items-center justify-center text-zinc-600 text-[9px] uppercase font-bold">
              No recent activity
            </div>
          ) : (
            logs.map((log, idx) => (
              <div 
                key={log.id} 
                className={`flex gap-3 p-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${
                  idx === logs.length - 1 ? "border-b-0" : ""
                }`}
              >
                <div className="mt-0.5 p-1.5 rounded bg-zinc-900 border border-white/5 shrink-0">
                  {getIcon(log.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] leading-relaxed text-zinc-300">
                    <span className="font-bold text-white">System:</span> {log.content}
                  </p>
                  <p className="text-[8px] font-mono text-zinc-600 mt-1 uppercase tracking-tighter">
                    {log.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </GlassCard>
  );
}
