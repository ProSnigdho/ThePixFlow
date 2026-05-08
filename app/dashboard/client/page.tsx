"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { StatCards } from "./_components/StatCards";
import { ProjectList } from "./_components/ProjectList";
import { ReviewSection } from "./_components/ReviewSection";
// import { VideoInspiration } from "./_components/VideoInspiration";
import { SidebarActions } from "./_components/SidebarActions";

export default function ClientDashboard() {
  const { role } = useAuth();

  if (role !== "client") return null;

  return (
    <div className="h-full w-full bg-[#0A0A0A] text-zinc-400 font-sans overflow-hidden flex flex-col gap-6">

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        {/* Main Content Column */}
        <div className="flex flex-col min-h-0 gap-6">
          <div className="shrink-0">
            <StatCards />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ProjectList />
          </div>
          {/* Replacement of VideoInspiration with ReviewSection */}
          <div className="shrink-0 h-[240px]">
            <ReviewSection />
          </div>
          {/* 
          <div className="shrink-0 h-[220px]">
            <VideoInspiration />
          </div> 
          */}
        </div>

        {/* Right Sidebar Column */}
        <aside className="min-h-0 overflow-hidden flex flex-col">
          <SidebarActions />
        </aside>
      </div>
    </div>
  );
}
