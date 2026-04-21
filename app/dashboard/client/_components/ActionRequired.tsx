"use client";

import React, { useEffect, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertCircle, Play, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";

export function ActionRequired() {
  const { user, role } = useAuth();
  const [actions, setActions] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "client" || !user) return;

    const q = query(
      collection(db, "tasks"),
      where("clientId", "==", user.uid),
      where("status", "==", "IN_REVIEW"),
      orderBy("updatedAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActions(list);
    });

    return () => unsubscribe();
  }, [role, user]);

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-2">
          <AlertCircle size={14} className="text-orange-500" />
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Decision Pulse</h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded italic">Real-time</span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-0">
        <div className="flex flex-col">
          {actions.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-zinc-600 text-[10px] uppercase font-black opacity-30">
              No pending feedback loops
            </div>
          ) : (
            actions.map((action) => (
              <div key={action.id} className="p-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Play size={14} fill="currentColor" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate max-w-[120px]">{action.title}</h4>
                    <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Awaiting Review</p>
                  </div>
                </div>
                
                <Link href={`/dashboard/client/projects/${action.id}`}>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <ChevronRight size={14} className="text-zinc-500" />
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-4 bg-black/60 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase italic tracking-tighter">Instant Feedback</p>
            <p className="text-[8px] text-zinc-500 font-bold uppercase leading-none">Status updates without page reload</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
