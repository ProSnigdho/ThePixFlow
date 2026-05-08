"use client";

import React, { useState, useEffect } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  Play,
  CheckCircle,
  Clock,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
  Unsubscribe,
} from "firebase/firestore";
import { formatDistanceToNow, parseISO } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

// ─── Helper Functions ────────────────────────────────────────────────────────

function getProgressValue(status: string, id: string): number {
  const s = status?.toLowerCase();
  const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (s === "queue" || s === "assigned") return 2 + (seed % 4);
  if (s === "in progress" || s === "working" || s === "editing")
    return 25 + (seed % 21);
  if (s === "review requested" || s === "awaiting review")
    return 70 + (seed % 16);
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
  if (!videoLink)
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=200";

  const ytMatch = videoLink.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;

  const driveId = extractDriveFileId(videoLink);
  if (driveId)
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w200`;

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
      where("editorId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    let unsubscribe: Unsubscribe;
    try {
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          if (!isSubscribed) return;
          const fetchedProjects = snapshot.docs.map((doc) => {
            const data = doc.data();
            const status = data.status || "Assigned";
            let timeLeft = "";
            try {
              if (data.desiredDelivery && data.desiredDelivery !== "TBD") {
                timeLeft = formatDistanceToNow(parseISO(data.desiredDelivery), {
                  addSuffix: true,
                });
              }
            } catch (e) {}

            return {
              id: doc.id,
              title: data.projectName || "Untitled Project",
              type: data.videoType || "Social Reel",
              due: data.desiredDelivery || "TBD",
              timeLeft: timeLeft,
              status: status,
              clientName: data.clientName || "Direct Client",
              progress: getProgressValue(status, doc.id),
              thumbnail: data.thumbnail || getVideoThumbnail(data.videoLink),
            };
          });
          setProjects(fetchedProjects);
          setLoading(false);
        },
        (error) => {
          if (!isSubscribed) return;

          // CRITICAL: Prevent SDK crash on permission/assertion errors
          if (error.message.includes("INTERNAL ASSERTION FAILED")) {
            console.warn("Firestore: Recovering from internal state reset...");
            return;
          }

          console.error("Error fetching projects:", error);
          setLoading(false);
        },
      );
    } catch (err) {
      console.error("Listener failed to initialize:", err);
      setLoading(false);
    }

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user?.uid]);

  const updateStatus = async (
    projectId: string,
    newStatus: string,
    driveLink?: string,
  ) => {
    try {
      const projectRef = doc(db, "projects", projectId);
      const updateData: any = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      if (driveLink) {
        updateData.finalDriveLink = driveLink;
      }
      await updateDoc(projectRef, updateData);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [activeTab, setActiveTab] = useState("Active");

  const tabs = ["Active", "Review", "Completed"];

  const filteredProjects = projects.filter((p) => {
    const s = p.status?.toLowerCase();
    if (activeTab === "Active")
      return ["assigned", "in progress", "working", "editing"].includes(s);
    if (activeTab === "Review")
      return ["review requested", "awaiting review", "pending review"].includes(
        s,
      );
    if (activeTab === "Completed")
      return ["completed", "done", "paid"].includes(s);
    return true;
  });

  return (
    <div className="premium-glass p-6 h-full flex flex-col border-white/5 overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <h2 className="text-xl font-bold text-white">My Projects</h2>
        <Link
          href="/dashboard/editor/projects"
          className="text-[#1A8080] hover:text-white text-xs font-bold transition-colors"
        >
          View All Projects
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/5 mb-8 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-sm font-bold transition-all relative",
              activeTab === tab
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300",
            )}
          >
            {tab} (
            {
              projects.filter((p) => {
                const s = p.status?.toLowerCase();
                if (tab === "Active")
                  return [
                    "assigned",
                    "in progress",
                    "working",
                    "editing",
                  ].includes(s);
                if (tab === "Review")
                  return [
                    "review requested",
                    "awaiting review",
                    "pending review",
                  ].includes(s);
                if (tab === "Completed")
                  return ["completed", "done", "paid"].includes(s);
                return false;
              }).length
            }
            )
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A8080]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-2 pr-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 w-full bg-white/5 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40 py-12">
            <Video size={40} className="text-zinc-600" />
            <p className="text-zinc-500 text-sm font-medium">
              No projects in this category.
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center gap-6 p-3 rounded-2xl hover:bg-white/[0.02] transition-all"
            >
              <div className="w-20 h-14 rounded-xl overflow-hidden border border-white/5 shrink-0 relative">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-[1.5fr_1fr_1fr_1fr_auto] items-center gap-6">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {project.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {project.type} • Client: {project.clientName}
                  </p>
                </div>

                <div className="flex justify-center">
                  <span
                    className={cn(
                      "text-[10px] font-black uppercase px-3 py-1 rounded-full",
                      activeTab === "Review"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-[#1A4848]/20 text-[#1A8080]",
                    )}
                  >
                    {project.status === "Assigned"
                      ? "Not Started"
                      : project.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1A8080] rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(26,128,128,0.5)]"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 min-w-[24px]">
                    {project.progress}%
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-bold text-white whitespace-nowrap">
                    {project.due}
                  </p>
                  <p className="text-[10px] text-amber-500 font-bold mt-0.5">
                    {project.timeLeft}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
