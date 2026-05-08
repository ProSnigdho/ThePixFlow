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
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  const q = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return q ? q[1] : null;
}
function isGoogleDriveLink(url: string) {
  return url.includes("drive.google.com");
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

import { NotificationCenter } from "@/components/NotificationCenter";

export default function RevisionPage() {
  const { user, userData, role } = useAuth();
  const displayName = userData?.displayName || user?.displayName || "User";
  const firstName = displayName.split(" ")[0];
  const photoURL = userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`;

  const router = useRouter();

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState(""); // Shared state naming
  const [loadingProjects, setLoadingProjects] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  // Fetch only projects that need Client Action
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "projects"),
      where("clientId", "==", user.uid),
      where("needsClientAction", "==", true),
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
      () => setLoadingProjects(false),
    );
  }, [user]);

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
        authorRole: role || "client",
        createdAt: serverTimestamp(),
      });
      setNewComment("");
      toast.success("Feedback submitted");
    } catch {
      toast.error("Failed to post feedback");
    }
  };

  return (
    <div className="h-full w-full bg-[#0A0A0A] text-zinc-400 font-sans overflow-hidden flex flex-col gap-6 relative">
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

        {/* LEFT: Project Cards */}
        <aside className="w-64 shrink-0 flex flex-col gap-4 min-h-0">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
              Pending Reviews
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-[#1A8080] animate-pulse" />
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
                className="flex flex-col items-center justify-center py-20 text-center px-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#1A4848]/10 flex items-center justify-center mb-4 border border-[#1A4848]/20">
                  <CheckCircle2 size={32} className="text-[#1A8080]" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-2">
                  All Caught Up!
                </h4>
                <p className="text-[10px] text-zinc-600 leading-relaxed uppercase tracking-tighter">
                  Your inbox is clear. Waiting for the editor's next update.
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
                    {/* Quick Look Hover Content */}
                    <div className="absolute inset-0 bg-[#0A0A0A]/95 p-4 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <p className="text-[8px] font-bold text-[#1A8080] uppercase tracking-widest mb-1 flex items-center gap-1">
                        <Sparkles size={8} /> Editor's Latest Note
                      </p>
                      <p className="text-[10px] text-zinc-400 italic line-clamp-3">
                        "
                        {project.lastEditorNote ||
                          "No specific note provided for this version."}
                        "
                      </p>
                    </div>

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
                            "text-[11px] font-bold truncate",
                            isActive ? "text-white" : "text-zinc-400",
                          )}
                        >
                          {project.projectName}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-0.5 bg-[#1A8080]/10 border border-[#1A8080]/20 rounded-full text-[8px] font-bold text-[#1A8080] uppercase tracking-tighter shadow-[0_0_10px_rgba(26,128,128,0.2)]">
                            Editor Updated
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
        <main className="flex-1 min-w-0 flex flex-col items-center justify-center relative">
          <AnimatePresence mode="wait">
            {selectedProject ? (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full h-full flex flex-col items-center justify-center gap-6"
              >
                <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)]">
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

                <div className="w-full max-w-sm space-y-3">
                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/client/revisions/${selectedProject.id}`,
                      )
                    }
                    className="w-full py-4 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 shadow-2xl"
                  >
                    Launch Review Workspace
                    <ExternalLink size={14} />
                  </button>
                  <div className="flex items-center gap-2 justify-center py-2 text-zinc-600">
                    <Info size={10} />
                    <p className="text-[9px] uppercase tracking-widest font-bold">
                      Project ID: {selectedProject.id}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-12 opacity-20">
                <Sparkles size={64} className="mb-6 text-[#1A8080]" />
                <h2 className="text-xl font-bold text-white uppercase tracking-[0.3em] mb-2">
                  No Active Review
                </h2>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                  Relax! Your project queue is empty. You'll be notified as soon
                  as a new cut is ready.
                </p>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT: Quick Feed */}
        <aside className="w-80 shrink-0 flex flex-col gap-4 min-h-0">
          <div className="flex-1 premium-glass border-white/5 rounded-[2rem] flex flex-col overflow-hidden bg-zinc-900/10">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/2">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Feedback Stream
              </h3>
              <span className="text-[10px] font-bold text-[#1A8080]">
                {comments.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
              {!selectedProject ? (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <MessageSquare size={32} />
                </div>
              ) : comments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <History size={24} className="mb-3" />
                  <p className="text-[9px] font-bold uppercase tracking-widest">
                    No revision history
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="relative pl-5 border-l border-white/5"
                  >
                    <div
                      className={cn(
                        "absolute left-[-4.5px] top-1 w-2 h-2 rounded-full",
                        comment.authorRole === "editor"
                          ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                          : "bg-[#1A4848]",
                      )}
                    />
                    <p className="text-[9px] font-bold text-zinc-600 uppercase mb-1">
                      {comment.authorName} • {comment.authorRole}
                    </p>
                    <p className="text-xs text-zinc-400 leading-relaxed bg-white/2 p-3 rounded-2xl border border-white/5">
                      {comment.text}
                    </p>
                  </div>
                ))
              )}
              <div ref={commentsEndRef} />
            </div>

            {selectedProject && (
              <div className="p-4 border-t border-white/5 bg-black/40">
                <div className="relative">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Quick note..."
                    className="w-full bg-zinc-900/60 border border-white/10 focus:border-[#1A4848] rounded-2xl p-4 pr-12 text-xs text-white focus:outline-none resize-none h-20 transition-all"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-xl transition-all shadow-lg"
                  >
                    <Send size={14} />
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
