"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  CheckCircle2, 
  RotateCcw, 
  Loader2, 
  Clock, 
  User, 
  MessageSquare, 
  Send, 
  Play,
  RotateCw
} from "lucide-react";
import { db } from "@/firebase/config";
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  addDoc
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { VideoReviewPlayer } from "@/components/workspace/VideoReviewPlayer";

export default function ClientProjectReviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { role, user } = useAuth();
  const [project, setProject] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");

  useEffect(() => {
    if (!id || !user) return;
    
    // 1. Real-time project metadata
    const unsubProject = onSnapshot(doc(db, "tasks", id as string), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (role === "client" && data.clientId !== user.uid) {
          router.push("/dashboard/client");
          return;
        }
        setProject({ id: docSnap.id, ...data });
      }
      setLoading(false);
    });

    // 2. Real-time production versions
    const q = query(
      collection(db, "projects", id as string, "deliveries"),
      orderBy("uploadedAt", "desc")
    );

    const unsubDelivery = onSnapshot(q, (snapshot) => {
      const deliveryList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeliveries(deliveryList);
      if (deliveryList.length > 0 && !activeDelivery) {
        setActiveDelivery(deliveryList[0]);
      }
    });

    return () => {
      unsubProject();
      unsubDelivery();
    };
  }, [id, user, role, router, activeDelivery]);

  const handleDecision = async (status: string, actionType: string) => {
    if (!id) return;
    setActionLoading(actionType);
    try {
      await updateDoc(doc(db, "tasks", id as string), {
        status: status,
        globalFeedback: status === "REVISION_NEEDED" ? revisionFeedback : null,
        updatedAt: serverTimestamp()
      });

      if (status === "REVISION_NEEDED") {
        setShowRevisionInput(false);
        setRevisionFeedback("");
      } else {
        // Success Toast simulation/navigation
        router.push("/dashboard/client?action=completed");
      }
    } catch (error) {
      console.error("Decision update failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-[#0A0A0A]">
      <Loader2 size={40} className="text-zinc-800 animate-spin" />
    </div>
  );

  if (!project) return <div className="p-10 text-center text-zinc-600 uppercase font-black">Project Terminal Offline</div>;

  return (
    <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 overflow-hidden bg-[#0A0A0A] p-6">
      {/* Structural Header (18/45/27 alignment logic) */}
      <div className="flex items-center justify-between bg-black/40 border border-white/5 rounded-2xl p-4 flex-none">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-sm font-black text-white uppercase tracking-tighter">{project.title}</h2>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                project.status === "Review" ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
              }`}>
                {project.status === "Review" ? "Awaiting Decision" : project.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none flex items-center gap-2">
              <User size={10} /> {project.editorName || "Analyzing Capacity..."} • <Clock size={10} /> {project.deadline || "ASAP"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowRevisionInput(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw size={14} /> Request Revision
          </button>
          <button 
            onClick={() => handleDecision("COMPLETED", "approval")}
            disabled={!!actionLoading}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-green-600 text-[10px] font-black text-white uppercase tracking-widest hover:bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all"
          >
            {actionLoading === 'approval' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Approve Final Version
          </button>
        </div>
      </div>

      {/* Main Review Workspace */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeDelivery ? (
          <VideoReviewPlayer 
            projectId={id as string} 
            fileId={activeDelivery.fileId} 
          />
        ) : (
          <GlassCard className="h-full flex flex-col items-center justify-center text-zinc-700 bg-black/20 border-zinc-900">
            <Loader2 size={48} className="mb-6 animate-spin opacity-20 text-blue-500" />
            <h3 className="text-xl font-black uppercase tracking-tighter text-white/40">Production in progress</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2 opacity-30 max-w-[300px] text-center leading-relaxed">
              Our editor is building your vision.<br/>You'll receive a notification the moment V1 is synced.
            </p>
          </GlassCard>
        )}
      </div>

      {/* Revision Modal Overlay */}
      {showRevisionInput && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 transition-all animate-in fade-in duration-300">
          <GlassCard className="w-full max-w-lg p-8 space-y-6 border-zinc-800 bg-zinc-950 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Strategic Feedback</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Submit global changes for the next version</p>
               </div>
               <button onClick={() => setShowRevisionInput(false)} className="text-zinc-600 hover:text-white transition-colors uppercase text-[10px] font-black">Close</button>
            </div>
            
            <textarea
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              placeholder="e.g. Please make the transition at 0:12 faster and change the background music to something more upbeat..."
              rows={6}
              className="w-full bg-black border border-white/10 rounded-2xl p-6 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold resize-none"
            />

            <button 
              onClick={() => handleDecision("REVISION_NEEDED", "revision")}
              disabled={!revisionFeedback.trim() || !!actionLoading}
              className="w-full py-4 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center justify-center gap-2"
            >
              {actionLoading === 'revision' ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
              Push Revision Ticket
            </button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
