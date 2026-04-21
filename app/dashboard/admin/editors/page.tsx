"use client";

import React from "react";
import { Zap } from "lucide-react";
import { HighDensityTable } from "../_components/HighDensityTable";

export default function AdminEditorsPage() {
  const data = [
    { name: "Alex Edits", active: "5/5", time: "18.2h", quality: "94%" },
    { name: "Sarah VFX", active: "2/5", time: "12.5h", quality: "98%" },
    { name: "Mike Motion", active: "4/5", time: "22.1h", quality: "89%" },
    { name: "Emma Cuts", active: "1/5", time: "8.4h", quality: "96%" },
  ];

  const columns = [
    { key: "name", label: "Production Specialist", type: "text" as const },
    { key: "active", label: "Workload", type: "badge" as const },
    { key: "time", label: "Avg Delivery", type: "text" as const },
    { key: "quality", label: "Quality Score", type: "quality" as const },
  ];

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Team <span className="text-zinc-500">Operation</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Internal Performance Monitoring</p>
      </div>

      <div className="flex-1 min-h-0">
        <HighDensityTable 
          title="Production Team Pulse"
          subtitle="Editorial Capacity & Performance"
          data={data}
          columns={columns}
          actionLabel="Onboard Editor"
          icon={<Zap size={20} />}
        />
      </div>
    </div>
  );
}
