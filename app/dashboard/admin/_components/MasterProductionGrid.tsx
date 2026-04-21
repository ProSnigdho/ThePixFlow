"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, ChevronRight, User, Briefcase, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import Link from "next/link";

interface Editor {
  id: string;
  name: string;
}

export function MasterProductionGrid({ tasks }: { tasks: any[] }) {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEditors() {
      const q = query(collection(db, "users"), where("role", "==", "editor"));
      const snapshot = await getDocs(q);
      const editorList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().displayName || doc.data().email || 'Unnamed Editor'
      }));
      setEditors(editorList);
    }
    fetchEditors();
  }, []);

  const handleAssign = async (taskId: string, editorId: string, editorName: string) => {
    setAssigningId(taskId);
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        assignedEditorId: editorId,
        editorName: editorName,
        status: "Assigned",
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/60 sticky top-0 z-20">
        <div className="flex items-center gap-4">
           <div className="relative">
              <input 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-zinc-500/50 pr-8 w-64 uppercase tracking-widest font-bold"
                placeholder="Search master grid..."
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
           </div>
           <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase text-zinc-500 hover:text-white transition-all">
              <Filter size={12} /> Global Filters
           </button>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
           <span>Total: {tasks.length}</span>
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
           <span className="text-white">Active</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-[#050505] sticky top-8 z-10">
              <th className="px-6 py-4">Status Node</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Project Identity</th>
              <th className="px-6 py-4">Assignee</th>
              <th className="px-6 py-4">Net Profit</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {tasks.map((task, idx) => (
              <tr key={task.id || idx} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
                    task.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                    task.status === 'IN_REVIEW' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                    task.status === 'REVISION_NEEDED' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-zinc-900 border border-white/5 flex items-center justify-center text-[8px] font-black text-zinc-500">
                      {task.clientName?.[0]}
                    </div>
                    <span className="text-[10px] font-bold text-white uppercase tracking-tight">{task.clientName}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[10px] font-black text-zinc-300 uppercase leading-none">{task.title}</div>
                  <div className="text-[8px] font-mono text-zinc-700 mt-1 uppercase tracking-tighter">ID: {task.id?.substring(0, 8)}</div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      <select 
                        value={task.assignedEditorId || ""}
                        onChange={(e) => {
                          const editor = editors.find(ed => ed.id === e.target.value);
                          if (editor) handleAssign(task.id, editor.id, editor.name);
                        }}
                        disabled={assigningId === task.id}
                        className="bg-black/40 border border-white/5 rounded px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                      >
                        <option value="">Unassigned</option>
                        {editors.map(editor => (
                          <option key={editor.id} value={editor.id}>{editor.name}</option>
                        ))}
                      </select>
                      {assigningId === task.id && <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
                   </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1 text-[10px] font-black text-green-500 italic">
                      <DollarSign size={10} /> {task.profit || '450'}
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <Link href={`/dashboard/admin/projects/${task.id}`}>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 rounded-lg border border-white/10 text-zinc-400 hover:text-white">
                         <ChevronRight size={14} />
                      </button>
                   </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
