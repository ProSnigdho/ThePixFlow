"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft } from "lucide-react";

// Workspace Components
import { ProjectBrief } from "../_components/workspace/ProjectBrief";
import { DeliveryHub } from "../_components/workspace/DeliveryHub";
import { ChatHistory } from "../_components/workspace/ChatHistory";

export default function ProjectWorkspace() {
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
        // Security check: ensure this editor is assigned
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

  if (loading) return null;
  if (!project) return <div className="p-10 text-center">Project not found</div>;

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-3 flex-none">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-tighter">{project.title}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Workspace ID: {project.id.substring(0, 12)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end mr-4">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Status</span>
            <span className="text-[10px] font-black text-blue-500 uppercase">{project.status}</span>
          </div>
          <div className="h-10 w-px bg-white/5 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Contractor</span>
            <span className="text-[10px] font-black text-white uppercase italic">Elite Tier Editor</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Non-scrollable shell */}
      <div className="flex-1 min-h-0 grid grid-cols-[25fr_45fr_30fr] gap-4 overflow-hidden">
        {/* Left: Brief & Assets */}
        <div className="min-h-0 overflow-hidden">
          <ProjectBrief project={project} />
        </div>

        {/* Center: Delivery Hub */}
        <div className="min-h-0 overflow-hidden">
          <DeliveryHub projectId={project.id} />
        </div>

        {/* Right: Chat & History */}
        <div className="min-h-0 overflow-hidden">
          <ChatHistory projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
