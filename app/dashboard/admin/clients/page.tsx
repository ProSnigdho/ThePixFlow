"use client";

import React from "react";
import { Users } from "lucide-react";
import { HighDensityTable } from "../_components/HighDensityTable";

export default function AdminClientsPage() {
  const data = [
    { name: "Zenith Media", plan: "Scale", spent: "$12,500", growth: "+45%" },
    { name: "Pure Athletics", plan: "Starter", spent: "$4,200", growth: "+12%" },
    { name: "Elite Realty", plan: "Enterprise", spent: "$28,000", growth: "+115%" },
    { name: "Glow & Flow", plan: "Scale", spent: "$9,800", growth: "+38%" },
  ];

  const columns = [
    { key: "name", label: "Client Identity", type: "text" as const },
    { key: "plan", label: "Active Plan", type: "badge" as const },
    { key: "spent", label: "LTV Spent", type: "text" as const },
    { key: "growth", label: "IG Growth", type: "stats" as const },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Client <span className="text-zinc-500">Registry</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Portfolio Management & Growth</p>
      </div>

      <div className="flex-1 min-h-0">
        <HighDensityTable 
          title="Master Client Index"
          subtitle="Agency Portfolio (30D Active)"
          data={data}
          columns={columns}
          actionLabel="Add Client"
          icon={<Users size={20} />}
        />
      </div>
    </div>
  );
}
