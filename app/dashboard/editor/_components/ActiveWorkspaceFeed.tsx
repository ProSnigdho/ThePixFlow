"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Play, Clock, User, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  clientName: string;
  status: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

interface FeedProps {
  projects: Project[];
}

export function ActiveWorkspaceFeed({ projects }: FeedProps) {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Active Workspace Feed</h3>
          <p className="text-[10px] text-zinc-600">High-density production queue</p>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded">
          {projects.length} PROJECTS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        <div className="flex flex-col gap-2">
          {projects.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-zinc-600 text-[10px] uppercase font-bold">
              No active projects assigned
            </div>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id}
                className="group flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
              >
                <div className={`w-1 h-10 rounded-full ${
                  project.priority === "High" ? "bg-red-500" : 
                  project.priority === "Medium" ? "bg-orange-500" : "bg-zinc-700"
                }`} />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{project.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-medium">
                      <User size={10} /> {project.clientName}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-medium">
                      <Clock size={10} /> {project.deadline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                    project.status === "Review" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                    "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                  }`}>
                    {project.status === "Review" ? "REVISION" : project.status}
                  </div>
                  
                  <Link href={`/dashboard/editor/${project.id}`}>
                    <button className="flex items-center gap-2 bg-white text-black text-[9px] font-black uppercase px-3 py-1.5 rounded hover:bg-zinc-200 transition-colors">
                      <Play size={10} fill="black" />
                      Start Editing
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </GlassCard>
  );
}
