"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion } from "framer-motion";
import { UserPlus, Target, Flame, CheckCircle2, TrendingUp, Zap, MessageSquare, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  Cold:      { color: "text-blue-400",  bg: "bg-blue-500/10",  border: "border-blue-500/20",  icon: <Zap size={10} /> },
  Warm:      { color: "text-orange-400",bg: "bg-orange-500/10",border: "border-orange-500/20",icon: <Flame size={10} /> },
  Hot:       { color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20",   icon: <Flame size={10} /> },
  Converted: { color: "text-[#1A8080]", bg: "bg-[#1A4848]/20", border: "border-[#1A4848]/40", icon: <CheckCircle2 size={10} /> },
  New:       { color: "text-zinc-300",  bg: "bg-white/5",      border: "border-white/10",     icon: <UserPlus size={10} /> },
};

export default function MarketingDashboard() {
  const { role, user, userData } = useAuth();
  const displayName = userData?.displayName || user?.displayName || "Marketer";
  const firstName = displayName.split(" ")[0];

  const [leads, setLeads] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time leads sync
  useEffect(() => {
    if (role !== "marketing" && role !== "admin") return;
    let isMounted = true;

    const unsubAll = onSnapshot(
      query(collection(db, "leads"), orderBy("createdAt", "desc")),
      (snap) => {
        if (!isMounted) return;
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setLeads(data);
        setRecentLeads(data.slice(0, 6));
        setLoading(false);
      },
      (err) => { console.error("LEADS_SYNC:", err); setLoading(false); }
    );

    return () => { isMounted = false; unsubAll(); };
  }, [role]);

  if (role !== "marketing" && role !== "admin") return null;

  // Compute KPIs from real data
  const coldCount      = leads.filter(l => l.status === "Cold" || l.status === "New").length;
  const warmCount      = leads.filter(l => l.status === "Warm").length;
  const hotCount       = leads.filter(l => l.status === "Hot").length;
  const convertedCount = leads.filter(l => l.status === "Converted").length;
  const convRate = leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0;

  const kpis = [
    { label: "New Leads", value: coldCount, icon: <UserPlus size={22} />, color: "#3b82f6", link: "/dashboard/marketing/leads" },
    { label: "Warm Pipeline", value: warmCount, icon: <Zap size={22} />, color: "#f97316", link: "/dashboard/marketing/leads" },
    { label: "Hot Targets", value: hotCount, icon: <Flame size={22} />, color: "#ef4444", link: "/dashboard/marketing/leads" },
    { label: "Converted", value: convertedCount, icon: <CheckCircle2 size={22} />, color: "#1A8080", link: "/dashboard/marketing/leads" },
  ];

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 shrink-0">
        {kpis.map((kpi, i) => (
          <Link href={kpi.link} key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="premium-glass p-6 flex flex-col gap-4 border-white/5 relative overflow-hidden group hover:border-[#1A4848]/50 transition-all duration-500 cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 blur-3xl rounded-full -mr-8 -mt-8 transition-all group-hover:opacity-20 opacity-10"
                   style={{ background: kpi.color }} />
              <div className="flex items-start justify-between relative z-10">
                <div className="p-3 rounded-2xl" style={{ background: `${kpi.color}20`, color: kpi.color }}>
                  {kpi.icon}
                </div>
                <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-white transition-colors mt-1" />
              </div>
              <div className="relative z-10">
                {loading ? (
                  <div className="h-9 w-16 bg-white/5 animate-pulse rounded-lg" />
                ) : (
                  <h3 className="text-4xl font-black text-white tracking-tighter">{kpi.value}</h3>
                )}
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">{kpi.label}</p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* ─── Main Content Grid ─── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 overflow-hidden">

        {/* LEFT: Recent Leads Table */}
        <div className="premium-glass border-white/5 flex flex-col overflow-hidden">
          <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
              Live Lead Pipeline
            </h3>
            <Link href="/dashboard/marketing/leads"
              className="text-[#1A8080] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors group">
              Full CRM <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                <UserPlus size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest">No leads yet</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-zinc-700 uppercase tracking-widest bg-[#0A0A0A] sticky top-0 z-10">
                    <th className="px-8 py-4">Identity</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Source</th>
                    <th className="px-8 py-4">Discovered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {recentLeads.map((lead) => {
                    const cfg = statusConfig[lead.status] || statusConfig["New"];
                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors group text-[10px]">
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1A4848] to-[#1A8080] flex items-center justify-center shrink-0">
                              <span className="text-white text-[10px] font-black">
                                {(lead.username || lead.name || "?")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight">{lead.username || lead.name}</p>
                              <p className="text-zinc-600 text-[9px] font-bold">{lead.followers || lead.niche || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={cn("text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border flex items-center gap-1 w-fit", cfg.color, cfg.bg, cfg.border)}>
                            {cfg.icon} {lead.status}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-zinc-500 font-bold uppercase text-[9px]">{lead.source || "—"}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-zinc-600 font-bold text-[9px]">
                            {lead.createdAt ? formatDistanceToNow(lead.createdAt.toDate(), { addSuffix: true }) : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* RIGHT: Funnel + Quick Actions */}
        <div className="flex flex-col gap-6 min-h-0 overflow-hidden">

          {/* Conversion Funnel */}
          <div className="premium-glass border-white/5 p-8 flex flex-col gap-6 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Conversion Funnel</h3>
              <span className="text-[#1A8080] text-sm font-black">{convRate}%</span>
            </div>
            {[
              { label: "Cold / New", count: coldCount, total: leads.length, color: "bg-blue-500" },
              { label: "Warm", count: warmCount, total: leads.length, color: "bg-orange-500" },
              { label: "Hot", count: hotCount, total: leads.length, color: "bg-red-500" },
              { label: "Converted", count: convertedCount, total: leads.length, color: "bg-[#1A8080]" },
            ].map((stage) => (
              <div key={stage.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stage.label}</span>
                  <span className="text-[10px] font-black text-white">{stage.count}</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stage.total > 0 ? Math.round((stage.count / stage.total) * 100) : 0}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${stage.color} rounded-full shadow-[0_0_8px_rgba(26,128,128,0.3)]`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Nav */}
          <div className="flex-1 min-h-0 premium-glass border-white/5 flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-white/5 shrink-0">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Quick Actions</h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
              {[
                { title: "Add New Lead", sub: "Log a fresh discovery", href: "/dashboard/marketing/leads", icon: <UserPlus size={18} /> },
                { title: "Send Outreach", sub: "Open DM workspace", href: "/dashboard/marketing/outreach", icon: <MessageSquare size={18} /> },
                { title: "Plan Content", sub: "Schedule post queue", href: "/dashboard/marketing/planner", icon: <Calendar size={18} /> },
                { title: "Spy Competitors", sub: "Analyze their strategy", href: "/dashboard/marketing/competitors", icon: <Target size={18} /> },
              ].map((action) => (
                <Link href={action.href} key={action.title}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-[#1A4848]/30 transition-all cursor-pointer group">
                    <div className="w-10 h-10 rounded-xl bg-[#1A4848]/20 flex items-center justify-center text-[#1A8080] shrink-0 group-hover:bg-[#1A4848]/40 transition-colors">
                      {action.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-white">{action.title}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{action.sub}</p>
                    </div>
                    <ArrowUpRight size={14} className="ml-auto text-zinc-700 group-hover:text-[#1A8080] transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
