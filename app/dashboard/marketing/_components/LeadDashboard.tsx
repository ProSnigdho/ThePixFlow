"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { db } from "@/firebase/config";
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { Flame, Snowflake, Zap, ChevronRight, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeadDashboard() {
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "leads", id), { status });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <GlassCard className="h-full flex flex-col border-white/[0.03] overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 bg-black/60 flex justify-between items-center">
         <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            Conversion Pipeline Dashboard
         </h3>
         <div className="flex gap-4 text-[9px] font-black text-zinc-600 uppercase">
            <span>Weekly Target: 50</span>
            <span className="text-green-500">Hits: {leads.filter(l => l.status === 'Converted').length}</span>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-zinc-950/50 sticky top-0 z-10">
              <th className="px-6 py-4">Lead Status</th>
              <th className="px-6 py-4">Identity</th>
              <th className="px-6 py-4">Source Hub</th>
              <th className="px-6 py-4">Assignment</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-white/[0.01] transition-colors group text-[10px]">
                <td className="px-6 py-4">
                   <div className="flex gap-1.5">
                      <button 
                        onClick={() => updateStatus(lead.id, "Cold")}
                        className={cn("p-1.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20", lead.status === 'Cold' && "bg-blue-500 text-white")}
                      >
                         <Snowflake size={12} />
                      </button>
                      <button 
                        onClick={() => updateStatus(lead.id, "Warm")}
                        className={cn("p-1.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20", lead.status === 'Warm' && "bg-orange-500 text-white")}
                      >
                         <Zap size={12} />
                      </button>
                      <button 
                        onClick={() => updateStatus(lead.id, "Hot")}
                        className={cn("p-1.5 rounded bg-red-500/10 text-red-500 border border-red-500/20", lead.status === 'Hot' && "bg-red-500 text-white")}
                      >
                         <Flame size={12} />
                      </button>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="font-bold text-white uppercase tracking-tight">{lead.username}</span>
                </td>
                <td className="px-6 py-4">
                   <span className="text-zinc-500 font-bold uppercase">{lead.source}</span>
                </td>
                <td className="px-6 py-4">
                   <span className="text-zinc-600 font-medium uppercase italic">{lead.assignedMarketer}</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="p-2 opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-lg border border-white/10 text-zinc-400 hover:text-white">
                      <MessageSquare size={14} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
