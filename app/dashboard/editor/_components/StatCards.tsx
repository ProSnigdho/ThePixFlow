"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap, DollarSign, Clock, FolderOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function StatCards() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    
    let isSubscribed = true;
    // Fetch Projects where editorId matches current user
    const q = query(collection(db, "projects"), where("editorId", "==", user.uid));
    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        if (!isSubscribed) return;
        setProjects(snapshot.docs.map(doc => doc.data()));
      },
      (error) => {
        if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
        console.error("STAT_CARDS_ERROR:", error);
      }
    );

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  const assignedProjects = projects.length;
  const inProgress = projects.filter(p => ["in progress", "working", "editing"].includes(p.status?.toLowerCase())).length;
  const pendingReviews = projects.filter(p => ["review requested", "awaiting review", "pending review"].includes(p.status?.toLowerCase())).length;
  const completed = projects.filter(p => ["completed", "done"].includes(p.status?.toLowerCase())).length;

  const stats = [
    {
      label: "Assigned Projects",
      value: assignedProjects.toString(),
      subtext: "Active",
      icon: FolderOpen,
      bg: "bg-[#1A4848]/20",
      iconColor: "text-[#1A8080]",
    },
    {
      label: "In Progress",
      value: inProgress.toString(),
      subtext: "Keep it going!",
      icon: Clock,
      bg: "bg-[#1A4848]/20",
      iconColor: "text-[#1A8080]",
    },
    {
      label: "Pending Review",
      value: pendingReviews.toString(),
      subtext: "Awaiting feedback",
      icon: Zap,
      bg: "bg-[#1A4848]/20",
      iconColor: "text-[#1A8080]",
    },
    {
      label: "Completed",
      value: completed.toString(),
      subtext: "This month",
      icon: CheckCircle2,
      bg: "bg-[#1A4848]/20",
      iconColor: "text-[#1A8080]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="premium-glass p-6 flex flex-col gap-4 border-white/5 relative overflow-hidden group hover:border-[#1A4848]/50 transition-all duration-500">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A4848]/5 blur-3xl rounded-full -mr-8 -mt-8 group-hover:bg-[#1A4848]/10 transition-all" />
          <div className="flex items-start gap-4 relative z-10">
            <div className={`p-3 rounded-2xl ${stat.bg} shrink-0`}>
              <stat.icon size={20} className={stat.iconColor} />
            </div>
            <div className="min-w-0">
               <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</span>
               <div className="mt-1 flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-60">{stat.subtext}</p>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
