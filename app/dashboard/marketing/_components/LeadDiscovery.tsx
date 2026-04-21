"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Filter, UserPlus, Flame, Snowflake, Zap, Star } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, query, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";

interface Lead {
  id?: string;
  username: string;
  status: "Cold" | "Warm" | "Hot";
  source: string;
  assignedMarketer: string;
}

export function LeadDiscovery() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Mock Discovery Results
  const discoveryResults = [
    { username: "@fitness_jake", source: "#fitness", strength: "High" },
    { username: "@creative_sam", source: "Competitor: Frame.io", strength: "Medium" },
    { username: "@tech_reviews", source: "#tech", strength: "High" },
    { username: "@foodie_vlogs", source: "#food", strength: "Low" },
  ];

  const handleSaveLead = async (lead: any) => {
    setSavingId(lead.username);
    try {
      await addDoc(collection(db, "leads"), {
        username: lead.username,
        source: lead.source,
        status: "Cold",
        assignedMarketer: "Current Marketer", // Replace with actual user name
        createdAt: serverTimestamp()
      });
      // Optionally show success toast
    } catch (e) {
      console.error("Lead save failed:", e);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <GlassCard className="h-full flex flex-col border-white/[0.03] overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 bg-black/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Search size={14} className="text-blue-500" />
          </div>
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Global Discovery Engine</h3>
        </div>
        <div className="flex bg-white/5 rounded-lg border border-white/10 p-0.5">
           <button className="px-3 py-1 rounded-md text-[9px] font-black uppercase text-white bg-white/10">Instagram</button>
           <button className="px-3 py-1 rounded-md text-[9px] font-black uppercase text-zinc-600 hover:text-white transition-colors">TikTok</button>
        </div>
      </div>

      <div className="p-4 flex-none">
        <div className="relative">
          <input 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 pr-8 uppercase tracking-widest font-bold"
            placeholder="Search Hashtags or Competitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        <div className="flex flex-col gap-2">
          {discoveryResults.map((lead) => (
            <div key={lead.username} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between hover:border-blue-500/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center font-black text-xs text-white">
                  {lead.username[1].toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">{lead.username}</p>
                  <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">Source: {lead.source}</p>
                </div>
              </div>
              <button 
                onClick={() => handleSaveLead(lead)}
                disabled={savingId === lead.username}
                className="p-2 rounded-lg bg-blue-600/10 text-blue-500 border border-blue-600/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white disabled:opacity-50"
              >
                {savingId === lead.username ? <Zap size={14} className="animate-pulse" /> : <UserPlus size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-600/5 border-t border-blue-600/10 flex items-center justify-between">
         <span className="text-[9px] font-black text-blue-400/80 uppercase">AI Strength matching Active</span>
         <Star size={12} className="text-blue-500 animate-pulse" />
      </div>
    </GlassCard>
  );
}
