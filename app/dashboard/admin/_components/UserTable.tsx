"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, MoreVertical, ShieldAlert, Mail } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  displayName: string;
  role: string;
  status: string;
  createdAt: string;
}

interface UserTableProps {
  data: UserData[];
}

export function UserTable({ data }: UserTableProps) {
  const [filter, setFilter] = useState<"all" | "client" | "editor">("all");

  const filteredData = data.filter((u) => 
    filter === "all" ? true : u.role === filter
  );

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/60 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-500">
             <Users size={20} />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none">Global User Directory</h3>
            <p className="text-[9px] text-zinc-600 font-bold uppercase mt-1">Manage Agency Access</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={() => setFilter("all")}
             className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === "all" ? "bg-[#1A4848]/20 text-[#1A8080] border border-[#1A4848]/30" : "bg-white/5 text-zinc-500 hover:text-white"}`}
           >
              All
           </button>
           <button 
             onClick={() => setFilter("client")}
             className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === "client" ? "bg-blue-500/20 text-blue-500 border border-blue-500/30" : "bg-white/5 text-zinc-500 hover:text-white"}`}
           >
              Clients
           </button>
           <button 
             onClick={() => setFilter("editor")}
             className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${filter === "editor" ? "bg-green-500/20 text-green-500 border border-green-500/30" : "bg-white/5 text-zinc-500 hover:text-white"}`}
           >
              Editors
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-[#050505] sticky top-0 z-10">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                  No users found
                </td>
              </tr>
            ) : filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-[10px] text-zinc-600">
                      {row.displayName?.charAt(0) || <Mail size={12} />}
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase">{row.displayName || "Unknown User"}</p>
                      <p className="text-[9px] font-medium text-zinc-500">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {row.role === "client" ? (
                    <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                      Client
                    </span>
                  ) : row.role === "editor" ? (
                    <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-green-500/10 text-green-500 border border-green-500/20">
                      Editor
                    </span>
                  ) : (
                    <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                      {row.role || "None"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {row.status === "approved" || row.status === "active" ? (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Active</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Pending</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">{row.createdAt}</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <select 
                     value={row.role || "client"}
                     onChange={async (e) => {
                       const newRole = e.target.value;
                       try {
                         await updateDoc(doc(db, "users", row.id), { role: newRole });
                         toast.success(`Role updated to ${newRole}`);
                       } catch (error) {
                         toast.error("Failed to update role");
                       }
                     }}
                     className="bg-black/40 border border-white/5 rounded px-2 py-1.5 text-[9px] font-black text-[#1A8080] uppercase outline-none focus:border-[#1A4848]/50 appearance-none cursor-pointer"
                   >
                     <option value="admin">Admin</option>
                     <option value="client">Client</option>
                     <option value="editor">Editor</option>
                     <option value="marketing">Marketing</option>
                   </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
