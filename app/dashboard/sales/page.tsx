"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, FileVideo, Mail, Phone, ExternalLink, TrendingUp, Handshake } from "lucide-react";
import { motion } from "framer-motion";

interface ClientDoc {
  id: string;
  email: string;
  isApproved: boolean;
  role: string;
}

interface TaskDoc {
  id: string;
  title: string;
  status: string;
  clientId: string;
}

export default function SalesDashboard() {
  const { role } = useAuth();
  const [clients, setClients] = useState<ClientDoc[]>([]);
  const [tasks, setTasks] = useState<TaskDoc[]>([]);

  useEffect(() => {
    if (role !== "sales") return;

    const unsubClients = onSnapshot(query(collection(db, "users"), where("role", "==", "client")), (snapshot) => {
      setClients(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ClientDoc)));
    });

    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TaskDoc)));
    });

    return () => {
      unsubClients();
      unsubTasks();
    };
  }, [role]);

  if (role !== "sales") return null;

  // Find clients with 0 tasks
  const unconvertedClients = clients.filter(c => !tasks.some(t => t.clientId === c.id));
  const activeLeads = tasks.filter(t => t.status !== "Completed");

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight">SALES<span className="text-gradient">HUB</span></h1>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Client Acquisition & Engagement Monitor</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-hidden">
        
        {/* Unconverted Leads */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="text-[#833ab4]" size={20} />
              Unconverted Clients
            </h2>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{unconvertedClients.length} Potential Leads</span>
          </div>
          
          <GlassCard className="flex-1 border-white/5 bg-white/[0.01] p-0 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 grid grid-cols-6 text-[10px] font-black text-gray-600 uppercase tracking-widest bg-black/40">
              <div className="col-span-3">Client Identity</div>
              <div className="col-span-2">Verification Status</div>
              <div className="text-right">Action</div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {unconvertedClients.map((c, i) => (
                <div key={c.id} className="p-4 border-b border-white/5 grid grid-cols-6 items-center hover:bg-white/[0.03] transition-colors group">
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs">
                      {c.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{c.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest">
                      Approved
                    </span>
                  </div>
                  <div className="text-right flex justify-end gap-2">
                     <button className="p-2 rounded-lg bg-[#833ab4]/10 text-[#833ab4] hover:bg-[#833ab4] hover:text-black transition-all">
                        <Mail size={14} />
                     </button>
                     <button className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all">
                        <Handshake size={14} />
                     </button>
                  </div>
                </div>
              ))}
              {unconvertedClients.length === 0 && (
                <div className="py-20 text-center opacity-30 italic">
                  No unconverted clients found. Great job!
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* In-Progress Overview */}
        <div className="flex flex-col gap-6 overflow-hidden">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <TrendingUp className="text-[#fd1d1d]" size={20} />
             Operational Pulse
           </h2>
           <GlassCard className="flex-1 border-white/5 bg-white/[0.01] p-0 overflow-hidden flex flex-col">
             <div className="p-4 border-b border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-widest bg-black/40">
                Active Production Line
             </div>
             <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
               {activeLeads.map((t, i) => (
                 <div key={t.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">{t.title}</h4>
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-white/5 rounded text-gray-500">{t.status}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-2">
                       <span className="text-[9px] text-gray-600 font-bold uppercase truncate">{clients.find(c => c.id === t.clientId)?.email || "Loading..."}</span>
                       <ExternalLink size={12} className="text-gray-700" />
                    </div>
                 </div>
               ))}
             </div>
           </GlassCard>
        </div>

      </div>
    </div>
  );
}
