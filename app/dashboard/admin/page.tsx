"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";

// Command Center Components
import { StatGrid, StatItem } from "@/components/ui/StatGrid";
import { DollarSign, Users, ShieldAlert, Zap, Activity } from "lucide-react";
import { MasterProductionGrid } from "./_components/MasterProductionGrid";
import { AdminSystemAlerts } from "./_components/AdminSystemAlerts";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AdminDashboard() {
  const { role, user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    mrr: 18500,
    activeClients: 0,
    overdueTasks: 0,
    teamLoad: 0,
    totalConverted: 0
  });

  const kpiItems: StatItem[] = [
    { label: "Agency Revenue", value: `$${stats.mrr.toLocaleString()}`, icon: <DollarSign size={20} className="text-green-500" />, color: "#22c55e", trend: "+12.5% MRR", trendType: "positive" },
    { label: "Lead Conversions", value: stats.totalConverted, icon: <Zap size={20} className="text-yellow-500" />, color: "#f59e0b", trend: "Marketing Feed", trendType: "positive" },
    { label: "Active Partners", value: stats.activeClients, icon: <Users size={20} className="text-blue-500" />, color: "#3b82f6", trend: "Retention 98%", trendType: "positive" },
    { label: "Overdue Nodes", value: stats.overdueTasks, icon: <ShieldAlert size={20} className="text-red-500" />, color: "#ef4444", trend: "Action Required", trendType: "negative" },
  ];

  useEffect(() => {
    if (role !== "admin" || !user) return;
    
    // Global Production Stream
    const q = query(collection(db, "tasks"), orderBy("updatedAt", "desc"));
    const unsubTasks = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      setTasks(taskList);
      
      // Calculate Stats
      const activeClients = new Set(taskList.map((t: any) => t.clientId)).size;
      const overdue = taskList.filter((t: any) => t.status === "Delayed" || (t.deadline && new Date(t.deadline) < new Date())).length;
      const totalCapacity = taskList.length > 0 ? (taskList.filter(t => t.status === "Editing").length / taskList.length) * 100 : 0;
      
      setStats(prev => ({
        ...prev,
        mrr: 18500 + (taskList.length * 450),
        activeClients,
        overdueTasks: overdue,
        teamLoad: Math.round(totalCapacity)
      }));
    }, (error) => {
      console.error("ADMIN HUD FAIL:", error);
    });

    const unsubLeads = onSnapshot(collection(db, "leads"), (snap) => {
      const converted = snap.docs.filter(d => d.data().status === "Converted").length;
      setStats(prev => ({ ...prev, totalConverted: converted }));
    });

    return () => {
      unsubTasks();
      unsubLeads();
    };
  }, [role, user]);

  if (role !== "admin") return null;

  return (
    <div className="h-full grid grid-rows-[18%_45%_27%] gap-6 p-6 overflow-hidden animate-in fade-in duration-700 bg-[#0A0A0A]">
      
      {/* Row 1: High-Level Business Metrics (18%) */}
      <div className="min-h-0 overflow-hidden">
        <StatGrid items={kpiItems} />
      </div>

      {/* Row 2: Master Production Tracker (45%) */}
      <div className="min-h-0 min-w-0 overflow-hidden">
        <MasterProductionGrid tasks={tasks} />
      </div>

      {/* Row 3: System Health & Activity (27%) */}
      <div className="min-h-0 grid grid-cols-[65fr_35fr] gap-6 overflow-hidden">
        <div className="min-h-0 overflow-hidden">
           <GlassCard className="h-full flex flex-col border-white/[0.03] overflow-hidden bg-black/40">
              <div className="p-4 border-b border-white/5 bg-black/60 flex justify-between items-center">
                 <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-blue-500" />
                    Global Production Log
                 </h3>
                 <span className="text-[9px] font-black text-zinc-600 uppercase">Live Pipeline</span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-0">
                 <div className="flex flex-col divide-y divide-white/[0.02]">
                    {tasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01] transition-all">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-[10px] text-zinc-600">
                              {task.title[0]}
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white uppercase tracking-tighter">{task.title}</p>
                              <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                                {task.editorName ? `Editor: ${task.editorName}` : "Awaiting Selection"}
                              </p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-black text-blue-500 uppercase">{task.status}</p>
                           <p className="text-[8px] font-mono text-zinc-700 uppercase tracking-tighter">Updated 2m ago</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </GlassCard>
        </div>
        <div className="min-h-0 overflow-hidden">
          <AdminSystemAlerts />
        </div>
      </div>

    </div>
  );
}
