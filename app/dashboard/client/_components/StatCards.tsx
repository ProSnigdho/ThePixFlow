"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Inbox, Cpu, Clock } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export function StatCards() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Projects from 'projects' collection
    const q = query(collection(db, "projects"), where("clientId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [user]);

  const stats = [
    {
      label: "Masterpieces Delivered",
      value: projects.filter(p => p.status?.toLowerCase() === "completed").length.toString(),
      subtext: "Ready for launch",
      icon: CheckCircle2,
      color: "text-white",
      bg: "bg-[#1A4848]",
    },
    {
      label: "In the Vault",
      value: projects.filter(p => p.status?.toLowerCase() === "queue").length.toString(),
      subtext: "Awaiting start",
      icon: Inbox,
      color: "text-white",
      bg: "bg-[#1A4848]",
    },
    {
      label: "Editing Suite",
      value: projects.filter(p => p.status?.toLowerCase() === "in-progress" || p.status?.toLowerCase() === "working").length.toString(),
      subtext: "Currently active",
      icon: Cpu,
      color: "text-white",
      bg: "bg-[#1A4848]",
    },
    {
      label: "Awaiting Approval",
      value: projects.filter(p => p.status?.toLowerCase() === "review-waiting" || p.status?.toLowerCase() === "awaiting review").length.toString(),
      subtext: "Pending feedback",
      icon: Clock,
      color: "text-white",
      bg: "bg-[#1A4848]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="premium-glass p-5 flex flex-col gap-4 border-white/5">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-zinc-500 text-xs">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
