"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatGrid, StatItem } from "@/components/ui/StatGrid";
import { 
  FileVideo, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Zap, 
  Play,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function EditorDashboard() {
  const { user, role } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "editor" || !user) return;

    const q = query(
      collection(db, "tasks"),
      where("assignedEditorId", "==", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [role, user]);

  const stats = {
    assigned: tasks.filter(t => t.status === "Assigned").length,
    inProgress: tasks.filter(t => t.status === "Editing").length,
    pendingReview: tasks.filter(t => t.status === "Review").length,
  };

  const kpiItems: StatItem[] = [
    { label: "New Assignments", value: stats.assigned, icon: <Zap size={20} className="text-yellow-500" />, color: "#f59e0b", trend: "Ready to Start", trendType: "neutral" },
    { label: "In Production", value: stats.inProgress, icon: <Play size={20} className="text-blue-500" />, color: "#3b82f6", trend: "Active Nodes", trendType: "positive" },
    { label: "Awaiting Client", value: stats.pendingReview, icon: <Clock size={20} className="text-orange-500" />, color: "#f59e0b", trend: "Review Phase", trendType: "neutral" },
  ];

  const calculateCountdown = (deadlineStr: string) => {
    if (!deadlineStr) return "N/A";
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff < 0) return <span className="text-red-500">Overdue</span>;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `Due in ${days}d ${hours % 24}h`;
    return `Due in ${hours}h`;
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden bg-[#0A0A0A] animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase text-white">Production <span className="text-zinc-500">Console</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Editor Node ID: {user?.uid.substring(0, 12)}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-500/10 border border-green-500/20">
             <TrendingUp size={16} className="text-green-500" />
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Velocity: 94%</span>
        </div>
      </div>

      {/* KPI Row (18%) */}
      <div className="min-h-0">
        <StatGrid items={kpiItems} />
      </div>

      {/* Task Queue (45%) */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-3">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Current Production Queue</h3>
        {tasks.length === 0 && !loading ? (
          <div className="h-40 flex items-center justify-center border border-dashed border-white/5 rounded-3xl text-[10px] font-bold text-zinc-700 uppercase">
            No tasks assigned for production
          </div>
        ) : (
          tasks.map((task) => (
            <GlassCard 
              key={task.id}
              className="group flex items-center justify-between p-5 hover:bg-white/[0.02] border-[#27272a]/50 hover:border-zinc-700 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-6">
                <div className={cn(
                  "p-3 rounded-2xl border flex items-center justify-center transition-colors",
                  task.status === "Assigned" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                  task.status === "Editing" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : 
                  "bg-green-500/10 text-green-500 border-green-500/20"
                )}>
                  <FileVideo size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tighter">{task.title}</h4>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client: {task.clientName || "Direct"}</span>
                    <span className="text-[10px] font-mono text-blue-500/80 uppercase italic tracking-widest">
                       {calculateCountdown(task.deadline)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className={cn(
                  "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                  task.status === "Assigned" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                  task.status === "Review" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                  "bg-blue-500/10 text-blue-500 border-blue-500/20"
                )}>
                  {task.status}
                </div>
                
                <Link href={`/dashboard/editor/projects/${task.id}`}>
                  <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-600 group-hover:text-white group-hover:bg-white/10 transition-all">
                    <ChevronRight size={18} />
                  </button>
                </Link>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
