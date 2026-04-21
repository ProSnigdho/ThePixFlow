"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Input } from "@/components/ui/Input";
import { Clock, ExternalLink, Send, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  link: string;
  status: string;
  createdAt: string;
  clientId: string;
}

interface ActiveWorkspaceProps {
  task: Task | null;
}

export function ActiveWorkspace({ task }: ActiveWorkspaceProps) {
  if (!task) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Clock className="text-[#fd1d1d]" size={20} />
          Active Workspace
        </h2>
        <GlassCard className="py-20 text-center border-dashed border-white/10 opacity-30">
          <p className="text-sm italic">Select a task from the queue to start editing.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#fd1d1d] animate-pulse" />
        Current Focus: {task.title}
      </h2>
      <GlassCard className="border-white/5 bg-white/[0.02] p-8 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Clock size={14} className="text-[#fd1d1d]" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">23:59:59 Remaining</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Objective</p>
          <p className="text-lg text-gray-200 leading-relaxed font-medium">{task.description}</p>
        </div>

        <div className="flex gap-4">
          <a 
            href={task.link} 
            target="_blank" 
            rel="noreferrer"
            className="flex-1 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center gap-3 transition-all group"
          >
            <ExternalLink className="group-hover:text-[#fd1d1d] transition-colors" size={20} />
            <span className="font-bold text-sm tracking-tight">Access Raw Assets</span>
          </a>
          <button className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center transition-all group">
            <Send className="group-hover:text-[#833ab4] transition-colors" size={20} />
          </button>
        </div>

        <div className="pt-8 border-t border-white/5 space-y-6">
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Final Submission</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Rendered File URL (Drive/Dropbox)" />
              <GradientButton className="h-11 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest">
                Submit Version 1 <ArrowRight size={14} />
              </GradientButton>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
