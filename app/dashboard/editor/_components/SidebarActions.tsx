"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowUpRight, Megaphone, Upload, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export function SidebarActions() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [recentTasks, setRecentTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Recent Tasks assigned to this editor
    const qTasks = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setRecentTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Tasks error:", err));

    // Fetch Dynamic Announcements
    const qAnn = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(2)
    );

    const unsubAnn = onSnapshot(qAnn, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Announcements error:", err));

    return () => {
      unsubTasks();
      unsubAnn();
    };
  }, [user]);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Quick Deliver */}
      <div className="premium-glass p-6 shrink-0 border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Deliver Project</h3>
          <div className="p-2 rounded-lg bg-[#1A4848]/20 border border-[#1A4848]/30">
            <Upload size={20} className="text-[#1A8080]" />
          </div>
        </div>
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          Ready to deliver a final video? Upload the link to notify the client.
        </p>
        <Link 
          href="/dashboard/editor/projects"
          className="w-full py-4 bg-[#1A4848] hover:bg-[#1A4848]/90 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(26,72,72,0.3)]"
        >
          Open Project Queue
          <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      {/* Dynamic Announcements */}
      <div className="premium-glass p-6 shrink-0 border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Broadcasts</h3>
          <Link href="/dashboard/announcements" className="text-zinc-500 hover:text-white text-xs transition-colors">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4 border border-white/5 rounded-xl border-dashed">No new updates</p>
          ) : announcements.map((ann) => (
            <div key={ann.id} className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 group hover:border-[#1A4848]/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#1A4848]/10 text-[#1A8080] shrink-0">
                  <Megaphone size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium leading-tight mb-1">{ann.title || "Update"}</p>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{ann.content || ann.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Recent Tasks */}
      <div className="premium-glass p-6 flex-1 min-h-0 flex flex-col border-white/5">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-lg font-bold text-white">Recent Work</h3>
          <Link href="/dashboard/editor/projects" className="text-zinc-500 hover:text-white text-xs transition-colors">
            View All
          </Link>
        </div>
        
        <div className="space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {recentTasks.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-8">No work history found.</p>
          ) : recentTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between group cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors">
              <div className="min-w-0 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-[#1A4848]/10 flex items-center justify-center shrink-0">
                    <Video size={14} className="text-[#1A8080]" />
                 </div>
                 <div className="min-w-0">
                   <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{task.videoType || "Project"}</p>
                   <p className="text-xs text-white font-medium truncate mt-0.5">{task.projectName || "Untitled"}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                  task.status === 'Completed' 
                    ? 'text-[#1A8080] bg-[#1A4848]/20 border-[#1A4848]/30' 
                    : 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                }`}>{task.status || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
