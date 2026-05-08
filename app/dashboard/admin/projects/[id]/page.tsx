"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Loader2, 
  ShieldCheck, 
  User, 
  Settings,
  Link2,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { db } from "@/firebase/config";
import { doc, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { DrivePreview } from "@/components/ui/DrivePreview";

export default function AdminProjectWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  const { role, user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin" || !user || !id) return;
    
    // Metadata Stream
    const unsubProject = onSnapshot(doc(db, "tasks", id as string), (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });

    return () => unsubProject();
  }, [id, user, role]);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 size={40} className="text-zinc-800 animate-spin" />
    </div>
  );

  if (!project) return <div className="p-10 text-center text-zinc-600 font-black uppercase">Project Nullified</div>;

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 overflow-hidden p-6 bg-[#000000]">
      
      {/* Supervisor Header */}
      <div className="flex items-center justify-between bg-zinc-900/40 border border-white/[0.05] rounded-2xl p-4 flex-none">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-base font-black text-white uppercase tracking-tighter">{project.title}</h2>
               <span className="text-[9px] font-black bg-blue-600 px-2 py-0.5 rounded text-white italic">ADMIN SUPERVISOR</span>
            </div>
            <div className="flex items-center gap-4 mt-0.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <User size={12} className="text-blue-500" /> Client: {project.clientName}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <Settings size={12} className="text-green-500" /> Editor: {project.editorName || "UNASSIGNED"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={14} /> Link-Based Protocol
          </div>
        </div>
      </div>

      {/* Duel-Stream Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        
        {/* Left: Raw Source */}
        <div className="flex flex-col gap-4 overflow-hidden">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Client Raw Footage</h3>
              <a href={project.raw_file_link} target="_blank" className="text-blue-500 hover:text-blue-400">
                <ExternalLink size={12} />
              </a>
           </div>
           <GlassCard className="flex-1 border-white/5 bg-white/[0.01] p-4 overflow-hidden flex flex-col">
              <DrivePreview url={project.raw_file_link} />
              <div className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5 flex-1">
                 <h4 className="text-[10px] font-black text-zinc-400 uppercase mb-2">Original Instructions</h4>
                 <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic line-clamp-6">
                   {project.instructions || "No specific instructions provided."}
                 </p>
              </div>
           </GlassCard>
        </div>

        {/* Right: Final Delivery */}
        <div className="flex flex-col gap-4 overflow-hidden">
           <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Editor Final Output</h3>
              {project.final_delivery_link && (
                <a href={project.final_delivery_link} target="_blank" className="text-green-500 hover:text-green-400">
                  <ExternalLink size={12} />
                </a>
              )}
           </div>
           <GlassCard className="flex-1 border-white/5 bg-white/[0.01] p-4 overflow-hidden flex flex-col">
              {project.final_delivery_link ? (
                <DrivePreview url={project.final_delivery_link} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20 italic">
                   <Link2 size={32} className="mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-widest">Pending Editor Submission</p>
                </div>
              )}
              <div className="mt-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex flex-col justify-center items-center gap-3">
                 <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Supervisor Checklist</p>
                 <div className="flex gap-4">
                    <button className="px-4 py-2 bg-green-500 text-black text-[9px] font-black uppercase rounded hover:bg-green-400 transition-colors">Approve & Send to Client</button>
                    <button className="px-4 py-2 bg-red-500/20 text-red-500 border border-red-500/20 text-[9px] font-black uppercase rounded hover:bg-red-500/30 transition-colors">Request Revision</button>
                 </div>
              </div>
           </GlassCard>
        </div>

      </div>
    </div>
  );
}
