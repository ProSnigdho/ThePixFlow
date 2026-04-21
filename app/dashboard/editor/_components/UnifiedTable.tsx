"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import { ChevronRight, Filter } from "lucide-react";
import Link from "next/link";

interface UnifiedTableProps {
  title: string;
  data: any[];
  onFilterChange?: (filters: any) => void;
  type: "projects" | "revisions";
}

export function UnifiedTable({ title, data, type }: UnifiedTableProps) {
  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div>
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">{title}</h3>
          <p className="text-[10px] text-zinc-600">Production Inventory</p>
        </div>
        <div className="flex gap-2">
          <button className="p-1 px-3 rounded border border-white/5 bg-white/5 text-zinc-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all">
            <Filter size={10} /> Filter
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-[#050505] sticky top-0 z-10">
              <th className="px-5 py-3">Project</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Priority</th>
              <th className="px-5 py-3">Deadline</th>
              {type === "revisions" && <th className="px-5 py-3">Fix Notes</th>}
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="text-xs font-bold text-white uppercase">{item.title}</div>
                    <div className="text-[9px] text-zinc-500 font-mono mt-0.5">{item.id.substring(0, 8)}</div>
                  </td>
                  <td className="px-5 py-4 text-xs text-zinc-400 font-medium">
                    {item.clientName}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border",
                      item.status === "Review" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                      item.status === "Completed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      "text-[8px] font-bold uppercase tracking-tighter",
                      item.priority === "High" ? "text-red-500" : 
                      item.priority === "Medium" ? "text-orange-500" : "text-zinc-500"
                    )}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[10px] text-zinc-400 font-mono italic">
                    {item.deadline}
                  </td>
                  {type === "revisions" && (
                    <td className="px-5 py-4 text-[10px] text-orange-400 italic max-w-xs truncate">
                      {item.fixInstructions || "See brief for details"}
                    </td>
                  )}
                  <td className="px-5 py-4 text-right">
                    <Link href={`/dashboard/editor/${item.id}`}>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 rounded-lg">
                        <ChevronRight size={14} className="text-white" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
