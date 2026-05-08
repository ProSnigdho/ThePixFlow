"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { Users, Briefcase, DollarSign, Activity, AlertCircle, FileText, CheckCircle2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { role, user } = useAuth();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalRevenue: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    if (role !== "admin" || !user?.uid) return;

    let isSubscribed = true;

    // Projects Stream
    const qProjects = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubProjects = onSnapshot(
      qProjects,
      (snapshot) => {
        if (!isSubscribed) return;
        const projectList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setProjects(projectList);

        const active = projectList.filter((p: any) => p.status !== "Completed" && p.status !== "Delivered").length;
        const totalRev = projectList
          .filter((p: any) => p.paymentStatus === "paid")
          .reduce((acc: number, curr: any) => acc + (curr.clientPrice || 0), 0);

        setStats((prev) => ({
          ...prev,
          totalProjects: projectList.length,
          totalActiveProjects: active,
          activeProjects: active,
          totalRevenue: totalRev,
        }));
      },
      (error) => {
        if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
      }
    );

    // Users Stream
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      if (!isSubscribed) return;
      const allUsers = snap.docs.map(doc => doc.data());
      setUsersList(allUsers);
      setStats((prev) => ({ ...prev, totalUsers: allUsers.length }));
    }, (error) => {
      if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
    });

    return () => {
      isSubscribed = false;
      unsubProjects();
      unsubUsers();
    };
  }, [role, user?.uid]);

  if (role !== "admin") return null;

  const topStats = [
    { label: "Total Users", val: stats.totalUsers, icon: Users, color: "text-[#1A8080]", bg: "bg-[#1A8080]/10", border: "border-[#1A8080]/20" },
    { label: "Total Projects", val: stats.totalProjects, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Revenue", val: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { label: "Active Projects", val: stats.activeProjects, icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ];

  const unassignedProjects = projects.filter(p => !p.editorId || p.status === "Queue");
  const reviewProjects = projects.filter(p => p.status === "Review" || p.status === "Review Requested" || p.status === "Awaiting Review");

  const unassignedCount = unassignedProjects.length;
  const overdueInvoices = projects.filter(p => p.isInvoiced && p.paymentStatus !== "paid").length;
  const pendingEditors = usersList.filter(u => u.role === "editor" && u.status === "pending").length;

  const actions = [];
  if (unassignedCount > 0) actions.push({ type: "urgent", title: `${unassignedCount} Unassigned Projects`, desc: "Require editor assignment", icon: AlertCircle, color: "text-red-500" });
  if (overdueInvoices > 0) actions.push({ type: "warning", title: `${overdueInvoices} Invoices Overdue`, desc: "Pending client payment", icon: FileText, color: "text-amber-500" });
  if (pendingEditors > 0) actions.push({ type: "info", title: `${pendingEditors} New Editor Application`, desc: "Awaiting approval", icon: Users, color: "text-blue-500" });
  if (actions.length === 0) actions.push({ type: "success", title: "All clear", desc: "No urgent actions required", icon: CheckCircle2, color: "text-green-500" });

  return (
    <div className="h-full w-full bg-[#0A0A0A] text-zinc-400 font-sans overflow-hidden flex flex-col gap-4 p-2 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-2 pt-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-xs text-zinc-500 mt-1">Overview of your agency performance and operations.</p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="shrink-0 grid grid-cols-4 gap-4">
        {topStats.map((stat, i) => (
          <div key={i} className="premium-glass p-4 rounded-xl border border-white/5 flex items-center gap-4 shadow-sm">
             <div className={`p-3 rounded-lg ${stat.bg} ${stat.border} border`}>
                <stat.icon size={20} className={stat.color} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-white leading-none mt-1">{stat.val}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        
        <div className="flex flex-col min-h-0 gap-4">
          {/* Revenue Overview Graph */}
          <div className="h-[220px] shrink-0 premium-glass p-5 rounded-xl border border-white/5 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center z-10 relative">
              <span className="text-sm font-bold text-white">Revenue Overview</span>
              <select className="bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-zinc-400 outline-none">
                 <option>This Month</option>
                 <option>Last Month</option>
              </select>
            </div>
            <div className="flex-1 relative flex flex-col justify-end mt-4 z-10">
               {/* Mock Graph using pure CSS/SVG */}
               <div className="absolute inset-0 flex items-end">
                  <svg viewBox="0 0 100 20" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                     <path d="M0,20 L0,15 C10,18 20,8 30,12 C40,16 50,2 60,8 C70,14 80,4 90,6 C95,7 100,2 100,2 L100,20 Z" fill="url(#gradient)" opacity="0.2"/>
                     <path d="M0,15 C10,18 20,8 30,12 C40,16 50,2 60,8 C70,14 80,4 90,6 C95,7 100,2" fill="none" stroke="#1A8080" strokeWidth="0.5" vectorEffect="non-scaling-stroke"/>
                     <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#1A8080" stopOpacity="0.8"/>
                           <stop offset="100%" stopColor="#1A8080" stopOpacity="0"/>
                        </linearGradient>
                     </defs>
                  </svg>
               </div>
               <div className="flex justify-between text-[9px] text-zinc-600 font-bold uppercase z-20 pt-2 border-t border-white/5">
                  <span>May 1</span>
                  <span>May 6</span>
                  <span>May 11</span>
                  <span>May 16</span>
                  <span>May 21</span>
                  <span>May 26</span>
                  <span>May 31</span>
               </div>
            </div>
          </div>

          {/* New Client Requests & Latest Reviews */}
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
            
            {/* New Client Requests */}
            <div className="premium-glass p-5 rounded-xl border border-white/5 flex flex-col overflow-hidden">
               <h3 className="text-xs font-bold text-white mb-4 shrink-0 uppercase tracking-widest">New Client Requests</h3>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-2">
                  {unassignedProjects.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-zinc-600 italic">No new requests</div>
                  ) : unassignedProjects.map(p => (
                    <div key={p.id} className="p-3 bg-white/[0.02] rounded-lg border border-white/5 hover:border-[#1A4848] transition-colors flex items-center justify-between">
                       <div className="min-w-0 flex-1 pr-2">
                          <p className="text-xs font-bold text-white truncate">{p.projectName || p.title || "Untitled"}</p>
                          <p className="text-[9px] text-zinc-500 uppercase mt-0.5">{p.clientName || "Unknown Client"}</p>
                       </div>
                       <div className="shrink-0 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">Unassigned</div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Latest Reviews */}
            <div className="premium-glass p-5 rounded-xl border border-white/5 flex flex-col overflow-hidden">
               <h3 className="text-xs font-bold text-white mb-4 shrink-0 uppercase tracking-widest">Latest Reviews</h3>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-2">
                  {reviewProjects.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-zinc-600 italic">No pending reviews</div>
                  ) : reviewProjects.map(p => (
                    <div key={p.id} className="p-3 bg-white/[0.02] rounded-lg border border-white/5 hover:border-[#1A4848] transition-colors flex gap-3">
                       <div className="shrink-0 w-8 h-8 rounded-full bg-[#1A8080]/20 flex items-center justify-center text-[#1A8080]">
                          <MessageSquare size={14} />
                       </div>
                       <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{p.projectName || p.title || "Untitled"}</p>
                          <p className="text-[9px] text-zinc-500 uppercase mt-0.5 truncate">{p.clientName} requires review</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

          </div>
        </div>

        {/* Admin Action Center */}
        <aside className="premium-glass p-5 rounded-xl border border-white/5 flex flex-col overflow-hidden min-h-0">
          <div className="flex justify-between items-center mb-6 shrink-0 border-b border-white/5 pb-4">
             <h3 className="text-sm font-bold text-white">Admin Action Center</h3>
             <span className="text-[9px] text-[#1A8080] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#1A8080]/10">Urgent</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
             {actions.map((action, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-pointer">
                   <div className="shrink-0 mt-0.5">
                      <action.icon size={16} className={action.color} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{action.title}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{action.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
