"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, where, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";

// Strategy Hub Components
import { StatGrid, StatItem } from "@/components/ui/StatGrid";
import { Play, CheckCircle, Clock, ShieldAlert } from "lucide-react";
import { PerformanceSnapshot } from "./_components/PerformanceSnapshot";
import { AgencyNotices } from "./_components/AgencyNotices";
import { VideoRequestForm } from "./_components/VideoRequestForm";
import { ActionRequired } from "./_components/ActionRequired";

export default function ClientDashboard() {
  const { user, role } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    pendingApproval: 0,
    activeRevisions: 0
  });

  const kpiItems: StatItem[] = [
    { label: "Videos In Progress", value: stats.inProgress, icon: <Play size={20} className="text-blue-500" />, color: "#3b82f6", trend: "Active Production", trendType: "neutral" },
    { label: "Completed", value: stats.completed, icon: <CheckCircle size={20} className="text-green-500" />, color: "#22c55e", trend: "Total Delivered", trendType: "positive" },
    { label: "Pending Approvals", value: stats.pendingApproval, icon: <Clock size={20} className="text-orange-500" />, color: "#f59e0b", trend: "Review Required", trendType: "negative" },
    { label: "Active Revisions", value: stats.activeRevisions, icon: <ShieldAlert size={20} className="text-red-500" />, color: "#ef4444", trend: "Fixing Queue", trendType: "neutral" },
  ];

  useEffect(() => {
    if (role !== "client" || !user?.uid) return;
    
    let unsubTasks: (() => void) | null = null;

    try {
      const tasksQ = query(
        collection(db, "tasks"), 
        where("clientId", "==", user.uid)
      );

      unsubTasks = onSnapshot(tasksQ, (snapshot) => {
        const taskList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(taskList);
        
        const inProgress = taskList.filter((t: any) => t.status === "Assigned" || t.status === "Editing").length;
        const completed = taskList.filter((t: any) => t.status === "Completed").length;
        const pendingApproval = taskList.filter((t: any) => t.status === "IN_REVIEW" || t.status === "Pending Approval").length;
        const activeRevisions = taskList.filter((t: any) => t.status === "REVISION_NEEDED" || t.status === "Revision Requested").length;
        
        setStats({ inProgress, completed, pendingApproval, activeRevisions });
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Client data access restricted: Identity confirmation pending.");
        } else {
          console.error("Dashboard stats listener error:", error);
        }
      });
    } catch (e) {
      console.error("Failed to start dashboard listener:", e);
    }

    return () => {
      if (unsubTasks) {
        try {
          unsubTasks();
        } catch (err) {
          console.warn("Cleanup warning in Dashboard:", err);
        }
      }
    };
  }, [role, user?.uid]);

  if (role !== "client") return null;

  return (
    <div className="h-full grid grid-rows-[20%_45%_27%] gap-6 p-6 overflow-hidden animate-in fade-in duration-700">
      
      {/* Row 1: KPI Summary (20fr) */}
      <div className="min-h-0 overflow-hidden">
        <StatGrid items={kpiItems} />
      </div>

      {/* Row 2: Performance & Notices (45fr) */}
      <div className="min-h-0 grid grid-cols-[65fr_35fr] gap-6 overflow-hidden">
      <div className="min-h-0 min-w-0 overflow-hidden">
          <PerformanceSnapshot />
        </div>
        <div className="min-h-0 overflow-hidden">
          <AgencyNotices />
        </div>
      </div>

      {/* Row 3: Action Center (27fr) */}
      <div className="min-h-0 grid grid-cols-[70fr_30fr] gap-6 overflow-hidden">
        <div className="min-h-0 overflow-hidden">
          <VideoRequestForm />
        </div>
        <div className="min-h-0 overflow-hidden">
          <ActionRequired />
        </div>
      </div>

    </div>
  );
}
