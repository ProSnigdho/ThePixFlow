"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Clock,
  ArrowRight,
  Play,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  collectionGroup,
  getDocs,
} from "firebase/firestore";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// ─── Sub-component for individual review items to handle comment counts ──────
function ReviewItem({ project }: { project: any }) {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const revisionsRef = collection(db, "projects", project.id, "revisions");
    const unsubscribe = onSnapshot(revisionsRef, (snapshot) => {
      setCommentCount(snapshot.size);
    });
    return () => unsubscribe();
  }, [project.id]);

  return (
    <Link
      href={`/dashboard/client/revisions/${project.id}`}
      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-[#1A4848]/10 transition-all group border border-transparent hover:border-[#1A4848]/30 block relative overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
        <img
          src={
            project.thumbnail ||
            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200"
          }
          alt={project.projectName}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <Play size={10} className="text-white fill-white" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-white truncate">
          {project.projectName}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="px-1.5 py-0.5 bg-[#1A8080]/10 border border-[#1A8080]/20 rounded text-[7px] font-black text-[#1A8080] uppercase tracking-tighter animate-pulse">
            Editor Updated
          </span>
        </div>
      </div>

      {/* Action Arrow */}
      <div className="p-2 text-zinc-800 group-hover:text-[#1A8080] transition-all transform group-hover:translate-x-1">
        <ArrowRight size={14} />
      </div>
    </Link>
  );
}

export function ReviewSection() {
  const { user } = useAuth();
  const [reviewProjects, setReviewProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Filter projects that specifically need Client Action
    const q = query(
      collection(db, "projects"),
      where("clientId", "==", user.uid),
      where("needsClientAction", "==", true),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const projects = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviewProjects(projects);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching review projects:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="premium-glass p-6 h-full flex flex-col border-white/5 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-[#1A4848]/20 blur-[60px] rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-black text-zinc-500 uppercase tracking-widest">
            Review Section
          </h2>
          {reviewProjects.length > 0 && (
            <div className="px-2 py-0.5 rounded-full bg-[#1A8080]/20 border border-[#1A8080]/30">
              <span className="text-[10px] font-bold text-[#1A8080]">
                {reviewProjects.length}
              </span>
            </div>
          )}
        </div>
        <Link
          href="/dashboard/client/revisions"
          className="text-[10px] font-bold text-[#1A8080] hover:text-[#1A8080]/80 uppercase tracking-widest transition-all"
        >
          View all
        </Link>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-3 relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-20">
            <div className="w-8 h-8 border-2 border-[#1A8080] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reviewProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-white/2 flex items-center justify-center mb-3 border border-white/5">
              <CheckCircle2 size={20} className="text-zinc-800" />
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              Clear Queue
            </p>
            <p className="text-[8px] text-zinc-700 mt-1 uppercase">
              Waiting for next editor update
            </p>
          </div>
        ) : (
          reviewProjects.map((project) => (
            <ReviewItem key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
}
