"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Play, 
  MessageSquare, 
  Clock, 
  Send, 
  ChevronRight,
  Monitor,
  Smartphone,
  Layers,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  authorRole: string;
  createdAt: any;
}

interface Draft {
  id: string;
  version: number;
  videoLink: string;
  editorNote?: string;
  createdAt: any;
}

export default function DetailedRevisionPage() {
  const { projectId } = useParams();
  const { user, role } = useAuth();
  const router = useRouter();
  
  const [project, setProject] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<"mobile" | "cinematic">("mobile");
  const [editUrl, setEditUrl] = useState("");
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);

  // Initialize View Mode from LocalStorage
  useEffect(() => {
    const savedView = localStorage.getItem(`viewMode_${projectId}`);
    if (savedView === "cinematic" || savedView === "mobile") {
      setViewMode(savedView);
    }
  }, [projectId]);

  const toggleViewMode = (mode: "mobile" | "cinematic") => {
    setViewMode(mode);
    localStorage.setItem(`viewMode_${projectId}`, mode);
  };

  // Fetch Project Data
  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      const docRef = doc(db, "projects", projectId as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProject(data);
        setEditUrl(data.reviewVideoUrl || data.videoLink || "");
      } else {
        toast.error("Project not found");
        router.push("/dashboard/client");
      }
    };

    fetchProject();
  }, [projectId, router]);

  // Fetch Drafts Real-time
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId as string, "drafts"),
      orderBy("version", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedDrafts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Draft[];
      setDrafts(fetchedDrafts);
      
      // Default to latest draft if none selected
      if (fetchedDrafts.length > 0 && !selectedDraftId) {
        setSelectedDraftId(fetchedDrafts[0].id);
      }
    });

    return () => unsubscribe();
  }, [projectId]);

  // Fetch Comments Real-time
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId as string, "revisions"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [projectId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // 1. Add the comment
      await addDoc(collection(db, "projects", projectId as string, "revisions"), {
        text: newComment,
        authorId: user.uid,
        authorName: user.displayName || "User",
        authorPhoto: user.photoURL || "",
        authorRole: role,
        draftId: selectedDraftId || "latest",
        createdAt: serverTimestamp(),
      });

      // 2. Update project visibility flag (Hand-off to Editor)
      await updateDoc(doc(db, "projects", projectId as string), {
        needsClientAction: false,
        lastActionBy: "client",
        status: "in-progress" // Move back to in-progress for editor to see
      });

      setNewComment("");
      toast.success("Feedback submitted. Handed back to Editor.");
      
      // Optionally redirect back to revisions list since it's now "cleared"
      setTimeout(() => {
        router.push("/dashboard/client/revisions");
      }, 1500);

    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVideoUrl = async () => {
    if (!editUrl.trim() || !projectId) return;
    setIsUpdatingUrl(true);
    try {
      // For simplicity, editors create a new draft when updating
      const newVersion = drafts.length + 1;
      await addDoc(collection(db, "projects", projectId as string, "drafts"), {
        version: newVersion,
        videoLink: editUrl,
        editorNote: "New version uploaded for review.",
        createdAt: serverTimestamp(),
      });
      
      await updateDoc(doc(db, "projects", projectId as string), {
        reviewVideoUrl: editUrl,
        status: "review-waiting",
        needsClientAction: true,
        lastActionBy: "editor",
        lastEditorNote: "New draft uploaded for your review."
      });
      
      toast.success("New draft published. Client notified.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update link");
    } finally {
      setIsUpdatingUrl(false);
    }
  };

  const getDriveEmbedUrl = (url: string | null | undefined): string | undefined => {
    if (!url) return undefined;
    const fileIdMatch = url.match(/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
    if (!fileIdMatch) return url;
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  };

  if (!project) return (
    <div className="h-full w-full flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-8 h-8 border-4 border-[#1A4848] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isEditor = role === "editor" || role === "admin";
  const activeDraft = drafts.find(d => d.id === selectedDraftId) || (drafts.length > 0 ? drafts[0] : null);
  const currentVideoUrl = activeDraft ? activeDraft.videoLink : (project.reviewVideoUrl || project.videoLink);

  return (
    <div className="h-full w-full bg-[#0A0A0A] text-zinc-400 font-sans overflow-hidden flex flex-col p-6 gap-6 relative">
      
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 hover:border-white/10 text-white transition-all group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{project.projectName}</h1>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                isEditor ? "bg-[#1A4848]/20 border border-[#1A4848]/40 text-[#1A8080]" : "bg-purple-500/10 border border-purple-500/30 text-purple-400"
              )}>
                {isEditor ? "Editor Workspace" : "Revision Phase"}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              {activeDraft ? `Draft v${activeDraft.version}` : "Initial Cut"} • {project.videoType}
            </p>
          </div>
        </div>
        
        {/* View Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5">
           <button 
             onClick={() => toggleViewMode("mobile")}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
               viewMode === "mobile" ? "bg-[#1A4848] text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400"
             )}
           >
             <Smartphone size={14} />
             Mobile
           </button>
           <button 
             onClick={() => toggleViewMode("cinematic")}
             className={cn(
               "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
               viewMode === "cinematic" ? "bg-[#1A4848] text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400"
             )}
           >
             <Monitor size={14} />
             Cinematic
           </button>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 min-h-0 flex gap-6">
        
        {/* Left Side: Video Player & Draft Tracker */}
        <section className="flex-[3] flex flex-col gap-6 min-w-0">
          
          {/* Player Container */}
          <div className="flex-1 flex items-center justify-center bg-black/20 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
             <div className={cn(
               "relative transition-all duration-700 ease-in-out shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden bg-black",
               viewMode === "mobile" ? "aspect-[9/16] h-[90%]" : "aspect-[16/9] w-[95%]"
             )}>
                {currentVideoUrl ? (
                  <iframe
                    src={getDriveEmbedUrl(currentVideoUrl)}
                    className="w-full h-full border-none"
                    allow="autoplay"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center gap-4 text-center p-12">
                     <AlertCircle size={32} className="text-zinc-800" />
                     <p className="text-xs font-bold text-zinc-700 uppercase">Awaiting Draft</p>
                  </div>
                )}
             </div>
          </div>

          {/* Draft History Tracker */}
          <div className="shrink-0 flex flex-col gap-3">
             <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                   <Layers size={14} className="text-[#1A8080]" />
                   <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Draft History</h3>
                </div>
                {activeDraft?.editorNote && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/5 border border-amber-500/10 rounded-full">
                     <span className="text-[9px] font-bold text-amber-500/80 uppercase">Editor Note:</span>
                     <span className="text-[9px] text-zinc-500 italic truncate max-w-[200px]">{activeDraft.editorNote}</span>
                  </div>
                )}
             </div>
             
             <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {drafts.map((draft) => (
                  <button
                    key={draft.id}
                    onClick={() => setSelectedDraftId(draft.id)}
                    className={cn(
                      "flex flex-col items-start gap-1 p-4 rounded-2xl border transition-all min-w-[140px]",
                      selectedDraftId === draft.id 
                        ? "bg-[#1A4848]/10 border-[#1A4848] shadow-lg shadow-[#1A4848]/10" 
                        : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         selectedDraftId === draft.id ? "text-white" : "text-zinc-600"
                       )}>
                         v{draft.version}
                       </span>
                       {draft.version === Math.max(...drafts.map(d => d.version)) && (
                         <span className="flex h-1.5 w-1.5 rounded-full bg-[#1A8080] animate-pulse" />
                       )}
                    </div>
                    <p className={cn(
                      "text-[9px] font-bold uppercase",
                      selectedDraftId === draft.id ? "text-[#1A8080]" : "text-zinc-700"
                    )}>
                      Draft Version
                    </p>
                    <p className="text-[8px] text-zinc-600 mt-1">
                      {formatDistanceToNow(draft.createdAt?.toDate() || new Date())} ago
                    </p>
                  </button>
                ))}
                
                {/* Fallback if no drafts */}
                {drafts.length === 0 && (
                   <div className="p-4 rounded-2xl border border-white/5 bg-zinc-900/20 w-full text-center">
                      <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">No drafts uploaded yet</p>
                   </div>
                )}
             </div>
          </div>

          {/* Editor Upload Controls */}
          {isEditor && (
            <div className="premium-glass bg-[#1A4848]/5 border-[#1A4848]/20 p-6 rounded-3xl flex items-center gap-6 mt-2">
               <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-bold text-[#1A8080] uppercase tracking-widest">Publish New Draft</label>
                  <input 
                    type="text" 
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="Paste Google Drive preview link here..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#1A4848] transition-all"
                  />
               </div>
               <button 
                 onClick={handleUpdateVideoUrl}
                 disabled={isUpdatingUrl || !editUrl.trim()}
                 className="px-8 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shrink-0 self-end shadow-xl"
               >
                 {isUpdatingUrl ? "Publishing..." : "Upload Draft"}
               </button>
            </div>
          )}
        </section>

        {/* Right Side: Feedback Feed */}
        <section className="flex-[2] flex flex-col gap-4 min-w-0">
          
          {/* Add Feedback Input */}
          <div className="premium-glass bg-zinc-900/60 border-white/5 p-6 rounded-3xl shrink-0">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <MessageSquare size={14} className="text-[#1A8080]" /> Post Revision
            </h4>
            <form onSubmit={handlePostComment} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Describe your requested changes here..."
                className="w-full h-32 bg-black/30 border border-white/5 focus:border-[#1A4848] rounded-xl p-4 text-sm text-white focus:outline-none resize-none transition-all placeholder:text-zinc-700"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="w-full py-4 bg-[#1A4848] hover:bg-[#1A8080] disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(26,72,72,0.2)] flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Posting..." : "Post Feedback"}
                <Send size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Feedback Timeline */}
          <div className="flex-1 min-h-0 premium-glass border-white/5 rounded-3xl flex flex-col overflow-hidden bg-zinc-900/20">
            <div className="px-6 py-4 border-b border-white/5 bg-white/2">
               <div className="flex items-center justify-between">
                 <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Project Feed</h4>
                 <span className="text-[10px] font-bold text-[#1A8080] bg-[#1A4848]/10 px-2 py-0.5 rounded-full">{comments.length} Posts</span>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
               <AnimatePresence initial={false}>
                 {comments.length > 0 ? (
                   comments.map((comment) => (
                     <motion.div
                       key={comment.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="relative pl-6 border-l border-white/5 group"
                     >
                        <div className={cn(
                          "absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full border border-black group-hover:scale-125 transition-transform",
                          comment.authorRole === 'editor' ? "bg-amber-500" : "bg-[#1A4848]"
                        )} />
                        
                        <div className="flex items-start justify-between gap-4 mb-2">
                           <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter",
                                comment.authorRole === 'editor' ? "bg-amber-500/10 text-amber-500" : "bg-[#1A4848]/20 text-[#1A8080]"
                              )}>
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-zinc-600">•</span>
                              <span className="text-[10px] text-zinc-500">
                                {comment.createdAt ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true }) : "just now"}
                              </span>
                           </div>
                           <div className="w-5 h-5 rounded-full border border-white/5 overflow-hidden grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                              <img src={comment.authorPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorId}`} alt="" />
                           </div>
                        </div>
                        
                        <p className={cn(
                          "text-sm leading-relaxed p-4 rounded-xl border transition-colors",
                          comment.authorRole === 'editor' 
                            ? "text-amber-200/80 bg-amber-500/5 border-amber-500/10" 
                            : "text-zinc-300 bg-white/2 border-white/5 group-hover:bg-white/5"
                        )}>
                          {comment.text}
                        </p>
                     </motion.div>
                   ))
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                      <History size={32} className="mb-4 text-zinc-600" />
                      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Feed Empty</p>
                      <p className="text-[10px] text-zinc-600 mt-2">Post your first feedback above.</p>
                   </div>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
