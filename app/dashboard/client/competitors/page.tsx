"use client";

import React from "react";
import { ComparisonCard } from "./_components/ComparisonCard";

export default function CompetitorsPage() {
  const clientData = {
    name: "Pure Athletics",
    avatar: "/avatars/client.png",
    avgViews: 45.2,
    frequency: 3,
    engagement: 5.4,
  };

  const competitorData = {
    name: "Gym Shark",
    avatar: "/avatars/competitor.png",
    avgViews: 82.1,
    frequency: 5,
    engagement: 4.2,
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden animate-in fade-in duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Market <span className="text-red-500">Battleground</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Competitive Intel & Benchmarking</p>
      </div>

      <div className="flex-1 min-h-0">
        <ComparisonCard client={clientData} competitor={competitorData} />
      </div>
    </div>
  );
}
