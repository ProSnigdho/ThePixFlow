"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { FileText, Download, Link as LinkIcon, ExternalLink } from "lucide-react";

interface BriefProps {
  project: any;
}

export function ProjectBrief({ project }: BriefProps) {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-zinc-950/50">
      <div className="p-4 border-b border-white/5 bg-black/40">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <FileText size={14} className="text-blue-500" />
          Project Brief & Assets
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Instruction Section */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fixed Instructions</h4>
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <p className="text-xs leading-relaxed text-zinc-300">
              {project?.description || "No specific instructions provided. Follow standard style guide."}
            </p>
          </div>
        </section>

        {/* Assets Section */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Footage & Raw Materials</h4>
          <div className="flex flex-col gap-2">
            <button className="flex items-center justify-between w-full p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all text-blue-500 group">
              <div className="flex items-center gap-3">
                <Download size={16} />
                <span className="text-xs font-bold uppercase tracking-tight">Download Raw Footage</span>
              </div>
              <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
            </button>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LinkIcon size={16} className="text-zinc-500" />
                <span className="text-xs font-medium text-zinc-400">Assets_Folder_V1.zip</span>
              </div>
              <span className="text-[9px] font-mono text-zinc-600">4.2 GB</span>
            </div>
          </div>
        </section>

        {/* Style Guide */}
        <section className="space-y-3">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Style Preferences</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded bg-zinc-900 border border-white/5 text-[9px] font-bold text-zinc-400 text-center uppercase">Fast-Paced</div>
            <div className="p-2 rounded bg-zinc-900 border border-white/5 text-[9px] font-bold text-zinc-400 text-center uppercase">Cinematic</div>
          </div>
        </section>
      </div>

      <div className="p-4 bg-black/60 border-t border-white/5">
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-zinc-500">
          <span>Deadline</span>
          <span className="text-red-500">{project?.deadline || "TBD"}</span>
        </div>
      </div>
    </GlassCard>
  );
}
