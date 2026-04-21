"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Loader2, 
  ShieldCheck, 
  User, 
  MessageSquare,
  FileVideo,
  ExternalLink,
  Settings
} from "lucide-react";
import { db } from "@/firebase/config";
import { doc, onSnapshot, collection, query, orderBy, limit } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { VideoReviewPlayer } from "@/components/workspace/VideoReviewPlayer";

export default function AdminProjectWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  const { role, user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "admin" || !user || !id) return;
    
    // 1. Metadata Stream
    const unsubProject = onSnapshot(doc(db, "tasks", id as string), (docSnap) => {
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    });

    // 2. Deliveries Stream
    const q = query(
      collection(db, "projects", id as string, "deliveries"),
      orderBy("uploadedAt", "desc")
    );

    const unsubDelivery = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeliveries(list);
      if (list.length > 0 && !activeDelivery) {
        setActiveDelivery(list[0]);
      }
    });

    return () => {
      unsubProject();
      unsubDelivery();
    };
  }, [id, user, role, activeDelivery]);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 size={40} className="text-zinc-800 animate-spin" />
    </div>
  );

  if (!project) return <div className="p-10 text-center text-zinc-600 font-black uppercase">Project Nullified</div>;

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 overflow-hidden p-6 bg-[#0A0A0A]">
      {/* God-Mode Header */}
      <div className="flex items-center justify-between bg-zinc-900/40 border border-white/[0.05] rounded-2xl p-4 flex-none">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all shadow-inner">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h2 className="text-base font-black text-white uppercase tracking-tighter">{project.title}</h2>
               <span className="text-[9px] font-black bg-blue-600 px-2 py-0.5 rounded text-white italic">SUPERVISOR MODE</span>
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
          <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck size={14} /> Full Access Override
          </div>
        </div>
      </div>

      {/* Shared Workspace Grid */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeDelivery ? (
          <VideoReviewPlayer 
            projectId={id as string} 
            fileId={activeDelivery.fileId} 
          />
        ) : (
          <GlassCard className="h-full flex flex-col items-center justify-center text-zinc-700 bg-black/20 border-zinc-900">
            <FileVideo size={48} className="mb-6 opacity-10 text-blue-500" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-white/40">Awating First Submission</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-30 text-center leading-relaxed">
              No versions have been pushed for review yet.<br/>Supervision will active once V1 is live.
            </p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
