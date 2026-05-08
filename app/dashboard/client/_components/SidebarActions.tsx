"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowUpRight, Megaphone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export function SidebarActions() {
  const { user } = useAuth();
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Recent Invoices
    const qInv = query(
      collection(db, "invoices"),
      where("clientId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(3)
    );
    
    const unsubInv = onSnapshot(qInv, (snapshot) => {
      setRecentInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Invoices error:", err));

    // Fetch Dynamic Announcements
    const qAnn = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc"),
      limit(2)
    );

    const unsubAnn = onSnapshot(qAnn, (snapshot) => {
      setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Announcements error:", err));

    return () => {
      unsubInv();
      unsubAnn();
    };
  }, [user]);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Request New Project */}
      <div className="premium-glass p-6 shrink-0 border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Request New Project</h3>
          <div className="p-2 rounded-lg bg-[#1A4848]/20 border border-[#1A4848]/30">
            <Plus size={20} className="text-[#1A8080]" />
          </div>
        </div>
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          Have a new project in mind? Let's bring your idea to life.
        </p>
        <Link 
          href="/dashboard/client/requests"
          className="w-full py-4 bg-[#1A4848] hover:bg-[#1A4848]/90 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(26,72,72,0.3)]"
        >
          New Project Request
          <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Link>
      </div>

      {/* Dynamic Announcements */}
      <div className="premium-glass p-6 shrink-0 border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Announcements</h3>
          <Link href="/dashboard/client/announcements" className="text-zinc-500 hover:text-white text-xs transition-colors">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-4 border border-white/5 rounded-xl border-dashed">No new announcements</p>
          ) : announcements.map((ann) => (
            <div key={ann.id} className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5 group hover:border-[#1A4848]/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#1A4848]/10 text-[#1A8080] shrink-0">
                  <Megaphone size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-medium leading-tight mb-1">{ann.title || "Update"}</p>
                  <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">{ann.content || ann.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Recent Invoices */}
      <div className="premium-glass p-6 flex-1 min-h-0 flex flex-col border-white/5">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h3 className="text-lg font-bold text-white">Recent Invoices</h3>
          <Link href="/dashboard/client/invoices" className="text-zinc-500 hover:text-white text-xs transition-colors">
            View All
          </Link>
        </div>
        
        <div className="space-y-4 flex-1 min-h-0 overflow-y-auto no-scrollbar">
          {recentInvoices.length === 0 ? (
            <p className="text-xs text-zinc-600 text-center py-8">No recent invoices.</p>
          ) : recentInvoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between group cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors">
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">{inv.invoiceNumber || `#${inv.id.slice(0, 8)}`}</p>
                <p className="text-xs text-white font-medium truncate mt-0.5">{inv.projectName || inv.project || "Editing Service"}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-white">{inv.amount || inv.total || "$0.00"}</span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                  inv.status === 'Paid' 
                    ? 'text-[#1A8080] bg-[#1A4848]/20 border-[#1A4848]/30' 
                    : 'text-zinc-500 bg-zinc-800/50 border-white/5'
                }`}>{inv.status || 'Pending'}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Link 
          href="/dashboard/client/invoices"
          className="w-full mt-6 py-3 border border-[#1A4848]/30 hover:bg-[#1A4848]/10 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2 group"
        >
          All Invoices 
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
