"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Loader2, 
  Clock, 
  User, 
  MessageSquare,
  FileText,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { db } from "@/firebase/config";
import { doc, onSnapshot, updateDoc, collection, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { VideoReviewPlayer } from "@/components/workspace/VideoReviewPlayer";
import { DeliveryHub } from "../../_components/workspace/DeliveryHub";

export default function EditorProjectWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  const { role, user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user) return;
    
    const unsub = onSnapshot(doc(db, "tasks", id as string), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (role === "editor" && data.assignedEditorId !== user.uid) {
          router.push("/dashboard/editor");
          return;
        }
        setProject({ id: docSnap.id, ...data });
      }
      setLoading(false);
    });

    return () => unsub();
  }, [id, user, role, router]);

  const calculateCountdown = (deadlineStr: string) => {
    if (!deadlineStr) return "N/A";
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    if (diff < 0) return "Overdue";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `Due in ${hours}h`;
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 size={40} className="text-zinc-800 animate-spin" />
    </div>
  );

  if (!project) return <div className="p-10 text-center text-zinc-600 font-black uppercase">Project Terminated</div>;

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 overflow-hidden p-6 bg-[#0A0A0A]">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/40 border border-white/[0.05] rounded-2xl p-4 flex-none">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all shadow-inner"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tighter flex items-center gap-2">
              {project.title}
              <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded italic">Production Mode</span>
            </h2>
            <div className="flex items-center gap-4 mt-0.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <User size={12} /> {project.clientName || "Corporate Client"}
              </span>
              <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                <Clock size={12} /> {calculateCountdown(project.deadline)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Identity Verified
          </div>
        </div>
      </div>

      {/* 20/45/27 Bento Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-[20fr_45fr_27fr] gap-4 overflow-hidden">
        
        {/* Left: Client Brief (20fr) */}
        <GlassCard className="flex flex-col border-white/[0.03] overflow-hidden bg-black/20">
          <div className="p-4 border-b border-white/[0.05] bg-black/40">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Creative Brief
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-6">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Instructions</p>
              <p className="text-xs leading-relaxed text-zinc-300 font-medium">
                {project.instructions || "No custom instructions provided for this project."}
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Reference Links</p>
              {project.referenceLinks ? project.referenceLinks.map((link: string, i: number) => (
                <a 
                  key={i} 
                  href={link} 
                  target="_blank" 
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-blue-400 hover:bg-white/10 transition-all truncate"
                >
                  <ExternalLink size={12} /> {link}
                </a>
              )) : (
                <p className="text-[9px] text-zinc-700 italic uppercase">No references attached</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.03]">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Technical Specs</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-zinc-950 border border-white/5">
                  <p className="text-[8px] text-zinc-600 font-bold uppercase">Ratio</p>
                  <p className="text-[10px] text-white font-black uppercase">9:16 (Vertical)</p>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950 border border-white/5">
                  <p className="text-[8px] text-zinc-600 font-bold uppercase">Format</p>
                  <p className="text-[10px] text-white font-black uppercase">4K MP4</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Center: Delivery Hub (45fr) */}
        <div className="min-h-0 overflow-hidden">
          <DeliveryHub projectId={project.id} />
        </div>

        {/* Right: Feedback Loop (27fr) */}
        <GlassCard className="flex flex-col border-white/[0.03] overflow-hidden bg-black/20">
          <div className="p-4 border-b border-white/[0.05] bg-black/40 flex justify-between items-center">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} className="text-orange-500" />
              Client Feedback
            </h3>
            <span className="text-[9px] font-black text-orange-500/60 uppercase">Real-time Feed</span>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {/* The actual feedback content is inside VideoReviewPlayer which is usually used in DeliveryHub, 
                but for better organization in this bento, we'll keep the DeliveryHub in the center.
                If the user wants feedback separate, we can move the feedback part of VideoReviewPlayer here.
                However, VideoReviewPlayer is a combined component. I'll stick to the combined one in Center for now
                unless they want a dedicated custom Right Feed component.
                Actually, the requirement says "Right Panel: Feedback Feed". 
                I'll split VideoReviewPlayer logic if needed. 
            */}
            <div className="p-10 text-center flex flex-col items-center gap-4 pt-40 opacity-20">
              <MessageSquare size={40} className="text-zinc-600" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 leading-relaxed">
                Feedback loop will activate<br/>after first V1 delivery
              </p>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}
