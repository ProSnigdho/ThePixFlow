"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  VideoOff,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  History,
  Send,
  CheckCircle2,
  Sparkles,
  Info,
  ChevronRight,
  Link,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ─── Link & Thumbnail Helpers ─────────────────────────────────────────────────
function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  const q = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return q ? q[1] : null;
}

function toDriveEmbed(url: string): string | undefined {
  const id = extractDriveFileId(url);
  return id ? `https://drive.google.com/file/d/${id}/preview` : undefined;
}

function getVideoThumbnail(videoLink: string): string {
  if (!videoLink)
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400";
  const driveId = extractDriveFileId(videoLink);
  if (driveId)
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;
  return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400";
}

export default function EditorRevisionsPage() {
  const { user, userData, role } = useAuth();
  const displayName = userData?.displayName || user?.displayName || "Editor";
  const photoURL = userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`;

  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingProjects, setLoadingProjects] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Fetch only projects in Review that belong to this Editor
  useEffect(() => {
    if (!user || role !== "editor") return;
    
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      where("status", "in", ["Review Requested", "Awaiting Review", "Review"]),
      orderBy("createdAt", "desc"),
    );

    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjects(list);
        if (list.length > 0 && !selectedProject) setSelectedProject(list[0]);
        if (list.length === 0) setSelectedProject(null);
        setLoadingProjects(false);
      },
      (err) => {
        console.error("Fetch Error:", err);
        setLoadingProjects(false);
      },
    );
  }, [user, role]);

  // Fetch comments for selected project
  useEffect(() => {
    if (!selectedProject?.id) return;
    const q = query(
      collection(db, `projects/${selectedProject.id}/revisions`),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, [selectedProject?.id]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedProject?.id || !user) return;
    try {
      await addDoc(collection(db, `projects/${selectedProject.id}/revisions`), {
        text: newComment,
        authorId: user.uid,
        authorName: displayName,
        authorPhoto: photoURL,
        authorRole: role || "editor",
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      toast.success("Response submitted");
    } catch {
      toast.error("Failed to post response");
    }
  };

  if (role !== "editor") return null;

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6 h-full">

        {/* LEFT: Project Cards */}
        <aside className="flex flex-col gap-4 min-h-0 h-full overflow-hidden">
          <div className="flex items-center justify-between px-2 shrink-0">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Review Queue
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-2">
            {loadingProjects ? (
              [1, 2].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-2xl bg-zinc-900/40 border border-white/5 animate-pulse"
                />
              ))
            ) : projects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center px-4 opacity-50"
              >
                <div className="w-16 h-16 rounded-full bg-[#1A4848]/10 flex items-center justify-center mb-4 border border-[#1A4848]/20">
                  <CheckCircle2 size={32} className="text-[#1A8080]" />
                </div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">
                  Queue Empty
                </h4>
                <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-tighter">
                  No active revisions needed.<br />Everything is up to date.
                </p>
              </motion.div>
            ) : (
              projects.map((project) => {
                const isActive = selectedProject?.id === project.id;
                return (
                  <motion.div
                    layoutId={project.id}
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className={cn(
                      "group relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden",
                      isActive
                        ? "bg-[#1A4848]/10 border-[#1A4848] shadow-[0_0_30px_rgba(26,72,72,0.15)]"
                        : "bg-zinc-900/40 border-white/5 hover:border-white/10",
                    )}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                        <img
                          src={getVideoThumbnail(
                            project.reviewVideoUrl || project.videoLink,
                          )}
                          className="w-full h-full object-cover opacity-60"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "text-[11px] font-black uppercase tracking-tight truncate",
                            isActive ? "text-white" : "text-zinc-500",
                          )}
                        >
                          {project.projectName}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] font-black text-amber-500 uppercase tracking-tighter">
                            Client Action
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </aside>

        {/* CENTER: Player */}
        <main className="flex-1 min-w-0 flex flex-col items-center justify-center relative h-full overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full h-full flex flex-col items-center justify-center gap-8"
              >
                <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] ring-1 ring-white/5">
                  <iframe
                    src={
                      toDriveEmbed(
                        selectedProject.reviewVideoUrl ||
                          selectedProject.videoLink,
                      ) || undefined
                    }
                    className="w-full h-full border-none"
                    allow="autoplay"
                  />
                </div>

                <div className="w-full max-w-sm space-y-4">
                  <Link
                    href={`/dashboard/editor/projects/${selectedProject.id}`}
                    className="w-full py-4 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#1A4848]/20 group"
                  >
                    Open Production Node
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <div className="flex items-center gap-3 justify-center text-zinc-700">
                    <Info size={12} />
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black">
                      Project Hash: {selectedProject.id.slice(0, 12)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12 opacity-20">
                <Sparkles size={64} className="mb-6 text-[#1A8080]" />
                <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-2">
                  Void Status
                </h2>
                <p className="text-[10px] text-zinc-500 max-w-xs leading-relaxed uppercase font-bold tracking-widest">
                  Transmission received. No active revision<br />cycles pending at this moment.
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT: Quick Feed */}
        <aside className="flex flex-col gap-4 min-h-0 h-full overflow-hidden">
          <div className="flex-1 premium-glass border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden bg-zinc-900/10 shadow-2xl">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Feedback Stream
              </h3>
              <div className="px-2.5 py-0.5 rounded-full bg-[#1A4848]/20 border border-[#1A4848]/30">
                <span className="text-[10px] font-black text-[#1A8080]">
                  {comments.length}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
              {!selectedProject ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <MessageSquare size={32} />
                </div>
              ) : comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                  <History size={32} className="text-zinc-600" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    No history detected
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="relative pl-6 border-l border-white/5"
                  >
                    <div
                      className={cn(
                        "absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-[#0A0A0A]",
                        comment.authorRole === "editor"
                          ? "bg-[#1A8080] shadow-[0_0_10px_rgba(26,128,128,0.5)]"
                          : "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]",
                      )}
                    />
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                         {comment.authorName} <span className="text-zinc-800 mx-1">/</span> {comment.authorRole}
                       </p>
                       <span className="text-[8px] font-bold text-zinc-800 uppercase">
                         {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate()) : "Just now"}
                       </span>
                    </div>
                    <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 shadow-sm">
                       <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                         {comment.text}
                       </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {selectedProject && (
              <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
                <div className="relative group">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Transmit quick note..."
                    className="w-full bg-zinc-900/40 border border-white/10 focus:border-[#1A4848] rounded-[1.5rem] p-5 pr-14 text-xs text-white focus:outline-none resize-none h-24 transition-all placeholder:text-zinc-800"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="absolute bottom-4 right-4 p-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-xl transition-all shadow-xl shadow-[#1A4848]/20 active:scale-95 disabled:opacity-50 disabled:hover:bg-[#1A4848]"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
