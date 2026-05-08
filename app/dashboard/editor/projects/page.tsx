"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Play,
  Calendar,
  X,
  MoreHorizontal,
  Video,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Helper Functions ────────────────────────────────────────────────────────

function getProgressValue(status: string, id: string): number {
  const s = status?.toLowerCase();
  const seed = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  if (s === "queue" || s === "assigned") return 2 + (seed % 4);
  if (s === "in-progress" || s === "working" || s === "editing") return 25 + (seed % 21);
  if (s === "review requested" || s === "awaiting review") return 70 + (seed % 16);
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
    return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400";

  const ytMatch = videoLink.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/,
  );
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;

  const driveId = extractDriveFileId(videoLink);
  if (driveId)
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;

  return "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400";
}

interface Project {
  id: string;
  projectName: string;
  videoType: string;
  status: string;
  desiredDelivery: string;
  videoLink: string;
  createdAt: any;
  clientName?: string;
  progress?: number;
}

export default function EditorProjectsPage() {
  const { user, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectsData, setProjectsData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || role !== "editor") return;
    
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );
    
    return onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => {
          const data = d.data();
          const status = data.status || "Assigned";
          return {
            id: d.id,
            ...data,
            status: status,
            progress: getProgressValue(status, d.id),
          };
        }) as Project[];
        setProjectsData(list);
        setLoading(false);
      },
      (err) => {
        console.error("Projects Fetch Error:", err);
        setLoading(false);
      },
    );
  }, [user, role]);

  const filtered = useMemo(
    () =>
      projectsData.filter((p) => {
        const matchSearch = p.projectName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchTab =
          activeTab === "All" ||
          (activeTab === "Active" &&
            ["In Progress", "Working", "Assigned", "Editing"].includes(p.status)) ||
          (activeTab === "Completed" && p.status === "Completed") ||
          (activeTab === "Review" && ["Review Requested", "Awaiting Review"].includes(p.status));
        return matchSearch && matchTab;
      }),
    [searchQuery, activeTab, projectsData],
  );

  if (role !== "editor") return null;

  return (
    <div className="h-full w-full flex flex-col gap-4 animate-in fade-in duration-700 overflow-hidden">
      {/* Search & Tabs Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={15}
            />
            <input
              type="text"
              placeholder="Search assigned projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:border-[#1A4848] w-52 transition-colors"
            />
          </div>
          <div className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
            {["All", "Active", "Review", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors ${activeTab === tab ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 overflow-hidden">
        {/* Project Grid */}
        <div className="overflow-y-auto no-scrollbar pb-10">
          {loading ? (
            <div className="flex gap-4 flex-wrap justify-center">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-zinc-900/50 border border-white/5 animate-pulse shrink-0"
                  style={{ width: "160px", aspectRatio: "9/16" }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-40">
               <Video size={48} className="text-zinc-600" />
               <p className="text-zinc-500 text-sm font-medium">No projects found.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center content-start">
              {filtered.map((project) => {
                const thumb = getVideoThumbnail(project.videoLink);
                return (
                  <div
                    key={project.id}
                    className={cn(
                      "relative rounded-2xl overflow-hidden border border-white/5 hover:border-[#1A4848]/60 transition-all group cursor-pointer shrink-0",
                      selectedProject?.id === project.id && "border-[#1A8080] ring-1 ring-[#1A8080]/50 shadow-[0_0_20px_rgba(26,128,128,0.2)]"
                    )}
                    style={{ width: "160px", aspectRatio: "9/16" }}
                    onClick={() => setSelectedProject(project)}
                  >
                    <img
                      src={thumb}
                      alt={project.projectName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                    {/* Progress Bar Overlay */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#1A8080] transition-all duration-1000"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>

                    <div className="absolute top-3 left-3 right-3">
                      <span
                        className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full border bg-[#1A4848] text-white border-[#1A8080]/30 shadow-lg"
                      >
                        {project.status || "Assigned"}
                      </span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-[#1A4848]/90 backdrop-blur-sm flex items-center justify-center shadow-xl">
                        <Play
                          size={16}
                          fill="white"
                          className="text-white ml-0.5"
                        />
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5">
                      <p className="text-white text-[10px] font-bold leading-tight line-clamp-2">
                        {project.projectName}
                      </p>
                      <p className="text-zinc-400 text-[9px]">
                        {project.videoType}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={8} />
                          <span>{project.desiredDelivery || "TBD"}</span>
                        </div>
                        <span className="text-white/60 font-bold">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Details Sidebar */}
        <aside className="flex flex-col gap-4 min-h-0 overflow-y-auto no-scrollbar bg-zinc-900/20 rounded-2xl border border-white/5 p-1">
          {selectedProject ? (
            <div className="p-3 space-y-4">
              <div
                className="relative rounded-2xl overflow-hidden border border-[#1A4848]/50 shadow-[0_0_30px_rgba(26,72,72,0.2)] shrink-0 w-full"
                style={{ aspectRatio: "9/16" }}
              >
                <img
                  src={getVideoThumbnail(selectedProject.videoLink)}
                  alt={selectedProject.projectName}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-zinc-400 hover:text-white"
                >
                  <X size={12} />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-bold leading-tight">
                    {selectedProject.projectName}
                  </p>
                  <span
                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded border mt-2 inline-block bg-[#1A4848] text-white border-[#1A8080]/30 shadow-lg"
                  >
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
                <h3 className="text-white text-sm font-bold">
                  Project Details
                </h3>
                {[
                  { label: "Type", value: selectedProject.videoType },
                  { label: "Delivery", value: selectedProject.desiredDelivery },
                  { label: "Client", value: selectedProject.clientName || "Alex Johnson" },
                  { label: "Progress", value: `${selectedProject.progress}%` },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center"
                  >
                    <p className="text-xs text-zinc-500 font-medium">{row.label}</p>
                    <p className="text-xs text-white font-bold">
                      {row.value || "—"}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={`/dashboard/editor/projects/${selectedProject.id}`}
                className="w-full py-3.5 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1A4848]/20"
              >
                <Play size={14} fill="currentColor" /> Open Project
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600 opacity-50 px-6 text-center">
              <div className="p-4 rounded-full bg-white/5">
                <Video size={32} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">Select a project to<br />view details</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
