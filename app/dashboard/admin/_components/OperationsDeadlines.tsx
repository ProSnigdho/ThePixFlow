"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { List, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function OperationsDeadlines() {
  const tasks = [
    {
      name: "Nike Summer Reel",
      status: "Editing",
      editor: "alex_edits",
      brief: "Fast cuts, upbeat music...",
    },
    {
      name: "Tesla FSD Update",
      status: "Review",
      editor: "vfx_pro",
      brief: "Motion tracking focus...",
    },
    {
      name: "Apple Event Clip",
      status: "Pending",
      editor: "unassigned",
      brief: "Clean minimalist style...",
    },
    {
      name: "Amazon Prime Day",
      status: "Live",
      editor: "sam_cuts",
      brief: "Product showcase...",
    },
  ];

  const deadlines = [
    { title: "Nike Promo", time: "in 4h", color: "#fd1d1d" },
    { title: "Tesla Tutorial", time: "in 12h", color: "#fcb045" },
    { title: "Starbucks Seasonal", time: "in 2 days", color: "#833ab4" },
    { title: "Amazon Campaign", time: "in 3 days", color: "#333" },
    { title: "Apple Event", time: "in 5 days", color: "#333" },
  ];

  return (
    <div className="grid grid-cols-[7fr_3fr] gap-6 h-full min-h-0 overflow-hidden">
      {/* Operations Table */}
      <GlassCard className="overflow-hidden flex flex-col h-full min-h-0">
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40 flex-none">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <List size={14} className="text-[#fd1d1d]" />
            Active Production Grid
          </h3>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            {tasks.length} Active Nodes
          </span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-widest bg-[#050505] sticky top-0 z-10">
                <th className="px-5 py-3 font-black">Project</th>
                <th className="px-5 py-3 font-black">Status</th>
                <th className="px-5 py-3 font-black">Contractor</th>
                <th className="px-5 py-3 font-black">Brief Preview</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tasks.map((t, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-5 py-3 text-xs font-bold text-gray-300">
                    {t.name}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                        t.status === "Editing"
                          ? "bg-red-500/10 text-red-500"
                          : t.status === "Review"
                            ? "bg-orange-500/10 text-orange-500"
                            : t.status === "Live"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-white/5 text-gray-500",
                      )}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-500 font-medium">
                    @{t.editor}
                  </td>
                  <td className="px-5 py-3 text-[10px] text-gray-600 italic truncate max-w-[150px]">
                    {t.brief}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight size={14} className="text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Deadline Countdown */}
      <GlassCard className="p-6 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6 flex-none">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
            <Calendar size={14} className="text-[#833ab4]" />
            Operational DLs
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 min-h-0">
          {deadlines.map((dl, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-300">
                  {dl.title}
                </span>
                <span
                  className="text-[10px] font-black uppercase tracking-widest"
                  style={{ color: dl.color }}
                >
                  {dl.time}
                </span>
              </div>
              <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-current opacity-30"
                  style={{ width: `${100 - i * 20}%`, color: dl.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
