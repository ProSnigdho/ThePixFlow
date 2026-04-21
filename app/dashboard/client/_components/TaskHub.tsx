"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { LayoutGrid, History, Video, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
}

interface TaskHubProps {
  tasks: Task[];
}

export function TaskHub({ tasks }: TaskHubProps) {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <LayoutGrid className="text-[#fd1d1d]" size={20} />
          Active Task Hub
        </h2>
        <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
          <History size={12} /> Global History
        </button>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <GlassCard className="text-center py-20 border-dashed border-white/10 opacity-30 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Video className="text-gray-600" size={24} />
            </div>
            <p className="text-sm italic text-gray-500">No active projects found. Start by filling the brief!</p>
          </GlassCard>
        ) : (
          tasks.map((t, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={t.id}
              className="group"
            >
              <GlassCard className="relative overflow-hidden border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all p-5">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/10 group-hover:bg-gradient-to-b group-hover:from-[#833ab4] group-hover:to-[#fd1d1d] transition-all duration-500" />
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg group-hover:text-white transition-colors tracking-tight">{t.title}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-500 uppercase tracking-tighter">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                        t.status === "Pending" ? "bg-blue-500/10 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.1)]" :
                        t.status === "Editing" ? "bg-[#fd1d1d]/10 text-[#fd1d1d] shadow-[0_0_10px_rgba(253,29,29,0.1)]" :
                        "bg-green-500/10 text-green-500"
                      )}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                    <Video size={18} />
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{t.description}</p>
                
                <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 hover:text-[#fd1d1d] transition-colors uppercase tracking-[0.2em]">
                  View Full Details <ArrowRight size={12} />
                </button>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
