"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { StatCards } from "./_components/StatCards";
import { ProjectList } from "./_components/ProjectList";
import { RecentMessages } from "./_components/RecentMessages";
import { EarningsCard } from "./_components/EarningsCard";
import { DeadlineAlerts } from "./_components/DeadlineAlerts";
import { Announcements } from "./_components/Announcements";
// No lucide-react imports needed here

export default function EditorDashboard() {
  const { role, user } = useAuth();

  if (role !== "editor" || !user) return null;

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-full">
        {/* Main Column */}
        <div className="flex flex-col gap-8 min-h-0 overflow-hidden h-full">
          {/* Stats Row */}
          <div className="shrink-0">
             <StatCards />
          </div>
          
          {/* Projects List - This section will scroll internally */}
          <div className="flex-1 min-h-0">
             <ProjectList />
          </div>

          {/* Bottom Row: Recent Messages - This section will scroll internally */}
          <div className="h-[250px] shrink-0">
             <RecentMessages />
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="flex flex-col gap-8 min-h-0 overflow-hidden h-full">
          <div className="h-[180px] shrink-0">
            <EarningsCard />
          </div>
          
          <div className="flex-1 min-h-0">
            <DeadlineAlerts />
          </div>
          
          <div className="shrink-0">
            <Announcements />
          </div>
        </div>
      </div>
    </div>
  );
}
