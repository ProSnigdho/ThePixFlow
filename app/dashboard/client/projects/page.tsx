"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Plus, User, Clock, ChevronRight, Filter, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ClientProjectsPage() {
  const { user, role } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Critical Guard: Only listen if user and role are stable
    if (!user || role !== "client") {
      setProjects([]);
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;

    try {
      const q = query(
        collection(db, "tasks"),
        where("clientId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const projectList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setProjects(projectList);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore Projects Listener Error:", error);
          setLoading(false);
        }
      );
    } catch (err) {
      console.error("Failed to establish Firestore listener:", err);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (e) {
          // Suppress internal assertion errors on cleanup during logout/unmount
          console.warn("Firestore cleanup warning:", e);
        }
      }
    };
  }, [role, user?.uid]); // Use user.uid instead of user object for stability

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-zinc-800 text-zinc-500 border-zinc-700";
      case "Assigned": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Editing": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "IN_REVIEW": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "Completed": return "bg-green-500/10 text-green-500 border-green-500/20";
      default: return "bg-zinc-800 text-zinc-500 border-zinc-700";
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden bg-[#0A0A0A] animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Production <span className="text-zinc-500">Pipeline</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Complete oversight of active creative cycles</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase text-zinc-500">
            <Filter size={12} /> Filter Pipeline
          </div>
          <Link href="/dashboard/client/projects/new">
            <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 transition-all">
              Initialize Project <Plus size={14} />
            </button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-1 gap-3">
          {projects.length === 0 && !loading ? (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl gap-4">
              <div className="p-4 rounded-full bg-zinc-900">
                <Play size={24} className="text-zinc-700" />
              </div>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No active productions found</p>
            </div>
          ) : (
            projects.map((project) => (
              <GlassCard 
                key={project.id}
                className="group flex items-center justify-between p-5 hover:bg-white/[0.03] hover:border-zinc-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center font-black text-white text-lg">
                    {project.title ? project.title[0] : "?"}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">{project.title}</h4>
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <User size={12} className="text-zinc-700" />
                        {project.editorName || "Awaiting Assignee"}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <Clock size={12} className="text-zinc-700" />
                        {project.deadline || "No Deadline"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                    getStatusStyle(project.status)
                  )}>
                    {project.status === "IN_REVIEW" ? "NEEDS FEEDBACK" : project.status}
                  </div>
                  
                  <Link href={`/dashboard/client/projects/${project.id}`}>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-600 group-hover:text-white group-hover:bg-white/10 transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </Link>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
