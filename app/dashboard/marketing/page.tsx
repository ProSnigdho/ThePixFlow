"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "@/firebase/config";

// Marketing Row Components
import { StatGrid, StatItem } from "@/components/ui/StatGrid";
import { UserPlus, Send, MessageCircle, Calendar, Target, Activity } from "lucide-react";
import { LeadDashboard } from "./_components/LeadDashboard";
import { LeadDiscovery } from "./_components/LeadDiscovery";
import { ContentCalendar } from "./_components/ContentCalendar";
import { CompetitorTracker } from "./_components/CompetitorTracker";

export default function MarketingDashboard() {
  const { role, user } = useAuth();
  const [stats, setStats] = useState({
    newLeads: 0,
    activeConvos: 0,
    totalConverted: 0,
    scheduledContent: 0
  });

  useEffect(() => {
    if (role !== "marketing" && role !== "admin") return;

    // Listen to Leads for stats
    const unsubLeads = onSnapshot(collection(db, "leads"), (snap) => {
      const data = snap.docs.map(d => d.data());
      setStats(prev => ({
        ...prev,
        newLeads: data.filter(l => l.status === "Cold").length,
        totalConverted: data.filter(l => l.status === "Converted").length
      }));
    });

    return () => unsubLeads();
  }, [role]);

  const kpiItems: StatItem[] = [
    { label: "New Leads (Cold)", value: stats.newLeads, icon: <UserPlus size={20} className="text-blue-500" />, color: "#3b82f6", trend: "Discovery Active", trendType: "neutral" },
    { label: "Conversion Hits", value: stats.totalConverted, icon: <Target size={20} className="text-red-500" />, color: "#ef4444", trend: "Target: 50", trendType: "positive" },
    { label: "Active DMs", value: 42, icon: <MessageCircle size={20} className="text-green-500" />, color: "#22c55e", trend: "Fast Response", trendType: "positive" },
    { label: "Publish Queue", value: 8, icon: <Calendar size={20} className="text-purple-500" />, color: "#a855f7", trend: "Next: Nike Promo", trendType: "neutral" },
  ];

  if (role !== "marketing" && role !== "admin") return null;

  return (
    <div className="h-full grid grid-rows-[20%_45%_27%] gap-6 p-6 overflow-hidden animate-in fade-in duration-700 bg-[#000000]">
      
      {/* Row 1: High-Level Growth Metrics (18%) */}
      <div className="min-h-0 overflow-hidden">
        <StatGrid items={kpiItems} />
      </div>

      {/* Row 2: Conversion Engine (45%) */}
      <div className="min-h-0 grid grid-cols-[65fr_35fr] gap-6 overflow-hidden">
        <div className="min-h-0 min-w-0 overflow-hidden">
           <LeadDashboard />
        </div>
        <div className="min-h-0 overflow-hidden">
           <LeadDiscovery />
        </div>
      </div>

      {/* Row 3: Content Ops & Market Intel (27%) */}
      <div className="min-h-0 grid grid-cols-[70fr_30fr] gap-6 overflow-hidden">
        <div className="min-h-0 overflow-hidden">
           <ContentCalendar />
        </div>
        <div className="min-h-0 overflow-hidden">
          <CompetitorTracker />
        </div>
      </div>

    </div>
  );
}
