"use client";

import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { formatDistanceToNow, parseISO, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

export function DeadlineAlerts() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    let isSubscribed = true;
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      where("status", "not-in", ["Completed", "completed", "Done", "done"]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!isSubscribed) return;
        const fetchedAlerts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const dueDateStr = data.desiredDelivery || "";
          let timeLeft = "TBD";
          let priority = "Normal";
          let priorityColor = "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
          let progressColor = "bg-zinc-500";
          let progress = 0;

          try {
            if (dueDateStr && dueDateStr !== "TBD") {
              const dueDate = parseISO(dueDateStr);
              timeLeft = formatDistanceToNow(dueDate, { addSuffix: true });
              
              const now = new Date();
              const diffHours = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
              
              if (diffHours < 0) {
                priority = "Overdue";
                priorityColor = "text-red-500 bg-red-500/10 border-red-500/20";
                progressColor = "bg-red-500";
              } else if (diffHours < 24) {
                priority = "High Priority";
                priorityColor = "text-orange-500 bg-orange-500/10 border-orange-500/20";
                progressColor = "bg-orange-500";
              } else if (diffHours < 72) {
                priority = "Medium Priority";
                priorityColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
                progressColor = "bg-amber-500";
              } else {
                priority = "Normal";
                priorityColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
                progressColor = "bg-emerald-500";
              }
            }
          } catch (e) {
            console.error("Date parse error:", e);
          }

          // Progress estimate based on status
          const s = data.status?.toLowerCase() || "";
          if (["assigned"].includes(s)) progress = 10;
          else if (["in progress", "working", "editing"].includes(s)) progress = 45;
          else if (["review requested", "awaiting review"].includes(s)) progress = 85;

          return {
            id: doc.id,
            title: data.projectName || "Untitled Project",
            due: dueDateStr,
            timeLeft: timeLeft,
            priority: priority,
            priorityColor: priorityColor,
            progress: progress,
            progressColor: progressColor,
          };
        })
        .filter(a => a.due && a.due !== "TBD")
        .sort((a, b) => {
             // Basic sort by due date string for now
             return a.due.localeCompare(b.due);
        })
        .slice(0, 5);

        setAlerts(fetchedAlerts);
        setLoading(false);
      },
      (error) => {
        if (isSubscribed) {
           console.error("DEADLINE_ALERTS_SYNC_ERROR:", error);
           setLoading(false);
        }
      }
    );

    return () => {
      isSubscribed = false;
      unsubscribe();
    };
  }, [user?.uid]);

  return (
    <div className="premium-glass p-6 border-white/5 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-lg font-bold text-white">Deadline Alerts</h3>
        <Link href="/dashboard/editor/projects" className="text-zinc-500 hover:text-white text-xs transition-colors">
          View All
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-1">
        {loading ? (
           [1, 2, 3].map(i => (
             <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
           ))
        ) : alerts.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full gap-3 opacity-20 text-center">
              <Clock size={32} className="text-zinc-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No upcoming deadlines</p>
           </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="space-y-3 group cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${alert.progressColor}`} />
                  <span className={cn("text-[10px] font-bold", alert.priority === "Overdue" ? "text-red-500" : "text-[#1A8080]")}>
                    {alert.timeLeft}
                  </span>
                </div>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${alert.priorityColor}`}>
                  {alert.priority}
                </span>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white group-hover:text-[#1A8080] transition-colors truncate">{alert.title}</h4>
                <p className="text-[10px] text-zinc-500">Due: {alert.due}</p>
              </div>

              <div className="relative h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full ${alert.progressColor} rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(26,128,128,0.2)]`}
                  style={{ width: `${alert.progress}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
