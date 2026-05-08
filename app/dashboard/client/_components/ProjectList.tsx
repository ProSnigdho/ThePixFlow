"use client";

import React, { useState, useEffect } from "react";
import { MoreHorizontal, ExternalLink, Play } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

// ─── Helper Functions ────────────────────────────────────────────────────────

function getProgressValue(status: string, id: string): number {
  const s = status?.toLowerCase();
  
  // Use a simple hash of the ID to get a consistent "random" number
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  if (s === "queue") return 2 + (seed % 4); // 2-5%
  if (s === "in-progress" || s === "working") return 25 + (seed % 21); // 25-45%
  if (s === "review-waiting" || s === "awaiting review") return 70 + (seed % 16); // 70-85%
  if (s === "completed") return 100;
  
  return 0;
}

function extractDriveFileId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  const q = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return q ? q[1] : null;
}

function getVideoThumbnail(videoLink: string): string {
  if (!videoLink) return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200";

  const ytMatch = videoLink.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;

  const driveId = extractDriveFileId(videoLink);
  if (driveId) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w200`;

  return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200";
}

export function ProjectList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    let isSubscribed = true;
    const q = query(
      collection(db, "projects"),
      where("clientId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;
        const fetchedProjects = snapshot.docs.map((doc) => {
          const data = doc.data();
          const status = data.status || "Queue";
          
          return {
            id: doc.id,
            title: data.projectName || "Untitled Project",
            type: data.videoType || "Social Reel",
            due: data.desiredDelivery || "TBD",
            status: status,
            progress: getProgressValue(status, doc.id),
            thumbnail: data.thumbnail || getVideoThumbnail(data.videoLink),
          };
        });
        setProjects(fetchedProjects);
        setLoading(false);
      },
      (error) => {
        if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
        console.error("Error fetching projects:", error);
        setLoading(false);
      },
    );

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  return (
    <div className="premium-glass p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#F5F5F5]">My Projects</h2>
        <button className="text-cyan-neon text-sm font-medium hover:underline flex items-center gap-1 transition-all">
          View All Projects <ExternalLink size={14} />
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-4 bg-gradient-to-b from-transparent to-[#050f0f] p-1 -mx-1 px-1">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-zinc-500 text-sm">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-zinc-500 text-sm">No active projects.</span>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A4848]/10 transition-all border border-transparent hover:border-[#1A4848] hover:shadow-[0_0_20px_rgba(26,72,72,0.3)]"
            >
              <div className="w-20 h-14 rounded-lg overflow-hidden border border-zinc-800 shrink-0 relative">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Play size={16} className="text-white" fill="white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#F5F5F5] truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {project.type} • Due: {project.due}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="w-40 hidden md:flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span
                    className={cn(
                      "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                      project.status.toLowerCase() === "completed" ? "bg-[#1A8080]" : "bg-amber-400"
                    )}
                  ></span>
                  <span
                    className={cn(
                      "relative inline-flex rounded-full h-2 w-2",
                      project.status.toLowerCase() === "completed" ? "bg-[#1A8080]" : "bg-amber-500"
                    )}
                  ></span>
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border text-white bg-[#1A4848] border-[#1A8080]/30"
                  )}
                >
                  {project.status}
                </span>
              </div>

              <div className="w-48 hidden lg:flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-[#1A8080] rounded-full transition-all duration-1000"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-white">
                  {project.progress}%
                </span>
              </div>

              <button className="p-2 text-zinc-500 hover:text-white transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
