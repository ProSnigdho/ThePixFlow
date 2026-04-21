"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, MoreVertical, MessageSquare, Tag, ExternalLink, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LeadCRMTable() {
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const leads = [
    { id: "1", username: "@fitness_legend", status: "Replied", lastContact: "2h ago", tags: ["Warm", "Fitness"], followers: "124K" },
    { id: "2", username: "@tech_founder", status: "Cold", lastContact: "Found today", tags: ["New", "SaaS"], followers: "42K" },
    { id: "3", username: "@realestate_pro", status: "Warm", lastContact: "3h ago", tags: ["Follow-up", "US"], followers: "18K" },
    { id: "4", username: "@vlog_queen", status: "Closed", lastContact: "4d ago", tags: ["Client"], followers: "95K" },
    { id: "5", username: "@pure_gym", status: "Replied", lastContact: "1d ago", tags: ["Interest", "Brand"], followers: "250K" },
  ];

  return (
    <div className="h-full flex gap-6 overflow-hidden relative">
      <GlassCard className="flex-1 flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
        <div className="p-4 border-b border-white/5 bg-black/60 sticky top-0 z-20 flex justify-between items-center">
          <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Active Lead Pipeline</h3>
          <span className="text-[10px] font-bold text-zinc-600 uppercase">Archive View</span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[9px] font-black text-zinc-600 uppercase tracking-widest bg-[#050505] sticky top-0 z-10">
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Current Node</th>
                <th className="px-6 py-4">Last Sync</th>
                <th className="px-6 py-4">Attributes</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={`hover:bg-white/[0.02] transition-colors group cursor-pointer ${selectedLead?.id === lead.id ? 'bg-white/[0.03]' : ''}`}
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
                        <User size={14} className="text-zinc-600" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-tight">{lead.username}</div>
                        <div className="text-[9px] font-bold text-zinc-500 uppercase">{lead.followers} Nodes</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${
                      lead.status === 'Replied' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                      lead.status === 'Warm' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      lead.status === 'Closed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-zinc-800 text-zinc-500 border-white/5'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-bold text-zinc-400 uppercase">{lead.lastContact}</span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex gap-1.5 overflow-hidden">
                        {lead.tags.map(tag => (
                          <span key={tag} className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded border border-white/[0.03] text-zinc-500 uppercase font-black">{tag}</span>
                        ))}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <MoreVertical size={14} className="text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Profile Sidebar */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-[380px] h-full"
          >
            <GlassCard className="h-full flex flex-col border-[#27272a]/50 bg-[#0A0A0A] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Lead 360° Profile</h3>
                 <button onClick={() => setSelectedLead(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500">
                    <X size={16} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
                 <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] p-1 mb-4 shadow-[0_0_30px_rgba(253,29,29,0.2)]">
                       <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                          <User size={32} className="text-white" />
                       </div>
                    </div>
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">{selectedLead.username}</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{selectedLead.followers} Followers</span>
                       <div className="w-1 h-1 rounded-full bg-zinc-800" />
                       <span className="text-[10px] font-black text-green-500 uppercase tracking-widest italic flex items-center gap-1">
                          High Intent <ExternalLink size={10} />
                       </span>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/[0.03] pb-2">Conversation Health</p>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">Reponse Rate</span>
                          <span className="text-[10px] text-white font-black">Fast (2h)</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase">Total Messages</span>
                          <span className="text-[10px] text-white font-black">12 Sent / 4 Received</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/[0.03] pb-2">Internal Strategic Notes</p>
                    <textarea 
                      className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-zinc-300 min-h-[120px] focus:outline-none focus:border-blue-500/50"
                      placeholder="Add strategic context for this lead..."
                      defaultValue="Lead recently started posting fitness reels. Showing high interest in cinematic editing. Potential Scale plan candidate."
                    />
                 </div>
              </div>

              <div className="p-4 bg-black border-t border-white/5 grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center gap-2 bg-white text-black text-[10px] font-black uppercase py-3 rounded-xl hover:scale-105 transition-all">
                    Send DM <MessageSquare size={14} />
                 </button>
                 <button className="flex items-center justify-center gap-2 bg-zinc-900 text-zinc-400 text-[10px] font-black uppercase py-3 rounded-xl hover:bg-white/5 transition-all">
                    Update Tag <Tag size={14} />
                 </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
