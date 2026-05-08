"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Send, MessageSquare, Shield, Loader, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

// ─── DM Templates ─────────────────────────────────────────────────────────────
const TEMPLATES = [
  { label: "Cold Intro", text: "Hey! Saw your recent content – the energy is amazing. We've helped creators like you 3x their engagement. Mind if I share how? 🚀" },
  { label: "Value Prop", text: "Quick question – are you currently editing your own reels? Most of our clients save 15+ hours/week by outsourcing to a specialist team." },
  { label: "Social Proof", text: "We just helped @fitnesscoach_mike go from 50K to 200K followers in 3 months with premium video editing. Want to see the before/after?" },
  { label: "Follow-up", text: "Hey! Just checking in. Still happy to chat about leveling up your content. No pressure at all – just wanted to make sure my last message didn't get buried! 😊" },
  { label: "Closing CTA", text: "I'd love to show you exactly what we'd do for your brand. Could we hop on a 15-min call this week? I'll even send you a free sample edit of your content." },
];

export default function MarketingOutreachPage() {
  const { user, role, userData } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [activeConversations, setActiveConversations] = useState<any[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);

  // Read active leads that are being outreached
  useEffect(() => {
    if (role !== "marketing" && role !== "admin") return;
    let isMounted = true;
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      if (!isMounted) return;
      const warm = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((l: any) => l.status === "Warm" || l.status === "Hot");
      setActiveConversations(warm);
      setLoadingConvs(false);
    });
  }, [role]);

  const applyTemplate = (template: any) => {
    setSelectedTemplate(template);
    setMessageText(template.text);
  };

  if (role !== "marketing" && role !== "admin") return null;

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">

      {/* ─── Main Grid ─── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 overflow-hidden">

        {/* LEFT: DM Workspace */}
        <div className="flex flex-col gap-6 overflow-hidden min-h-0">

          {/* Active Warm/Hot Leads */}
          <div className="premium-glass border-white/5 flex flex-col overflow-hidden" style={{ maxHeight: "38%" }}>
            <div className="px-8 py-5 border-b border-white/5 shrink-0">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Outreach Targets</h3>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {loadingConvs ? (
                <div className="p-6 flex items-center justify-center opacity-30">
                  <Loader size={24} className="animate-spin" />
                </div>
              ) : activeConversations.length === 0 ? (
                <div className="p-8 text-center opacity-20">
                  <MessageSquare size={32} className="mx-auto mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No warm or hot leads yet</p>
                </div>
              ) : (
                <div className="p-4 grid grid-cols-2 gap-3">
                  {activeConversations.map((lead) => (
                    <div key={lead.id}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#1A4848]/30 transition-all cursor-pointer group">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1A4848] to-[#1A8080] flex items-center justify-center shrink-0">
                        <span className="text-white text-[12px] font-black">
                          {(lead.username || lead.name || "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-black text-white uppercase truncate">{lead.username || lead.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={cn("text-[8px] font-black uppercase", lead.status === "Hot" ? "text-red-400" : "text-orange-400")}>
                            {lead.status}
                          </span>
                          <span className="text-zinc-700 text-[8px]">• {lead.source}</span>
                        </div>
                      </div>
                      <ExternalLink size={12} className="ml-auto text-zinc-700 group-hover:text-[#1A8080] transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Composer */}
          <div className="flex-1 min-h-0 premium-glass border-white/5 flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#1A4848]/10 border border-[#1A4848]/20 flex items-center justify-center">
                  <MessageSquare size={18} className="text-[#1A8080]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">DM Composer</h3>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Craft your outreach message</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[9px] font-black text-zinc-500 uppercase">Ready</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-4">
              {selectedTemplate && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1A4848]/10 border border-[#1A4848]/20 rounded-xl w-fit">
                  <span className="text-[9px] font-black text-[#1A8080] uppercase tracking-widest">Template:</span>
                  <span className="text-[9px] font-black text-white uppercase">{selectedTemplate.label}</span>
                </div>
              )}
              <textarea value={messageText} onChange={e => setMessageText(e.target.value)}
                placeholder="Compose your outreach message or select a template from the right →"
                className="w-full flex-1 min-h-[200px] bg-white/[0.02] border border-white/5 focus:border-[#1A4848] rounded-2xl p-6 text-sm text-white focus:outline-none transition-all resize-none placeholder:text-zinc-800 leading-relaxed" />
            </div>

            <div className="px-8 pb-8 flex gap-4 shrink-0">
              <button onClick={() => { setMessageText(""); setSelectedTemplate(null); }}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Clear
              </button>
              <button disabled={!messageText.trim()}
                className="flex-1 flex items-center justify-center gap-3 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1A4848]/20 disabled:opacity-50 active:scale-95">
                <Send size={16} /> Send Message
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Template Library */}
        <div className="flex flex-col gap-6 min-h-0 overflow-hidden">
          <div className="premium-glass border-white/5 flex flex-col flex-1 overflow-hidden">
            <div className="px-8 py-5 border-b border-white/5 shrink-0">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Template Library</h3>
              <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-wider mt-1">Click to load into composer</p>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
              {TEMPLATES.map((tmpl, i) => (
                <motion.div key={i}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => applyTemplate(tmpl)}
                  className={cn(
                    "p-5 rounded-2xl border cursor-pointer transition-all group",
                    selectedTemplate?.label === tmpl.label
                      ? "bg-[#1A4848]/10 border-[#1A4848]/50 shadow-[0_0_20px_rgba(26,72,72,0.1)]"
                      : "bg-white/[0.02] border-white/5 hover:border-[#1A4848]/30"
                  )}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[9px] font-black uppercase tracking-widest",
                      selectedTemplate?.label === tmpl.label ? "text-[#1A8080]" : "text-zinc-500")}>
                      {tmpl.label}
                    </span>
                    {selectedTemplate?.label === tmpl.label && (
                      <span className="w-2 h-2 rounded-full bg-[#1A8080] shadow-[0_0_8px_rgba(26,128,128,0.5)]" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-3">{tmpl.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Support Node Card */}
          <div className="premium-glass border-white/5 p-6 flex flex-col items-center text-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-[#1A4848]/10 border border-[#1A4848]/20 flex items-center justify-center">
              <Shield size={24} className="text-[#1A8080]" />
            </div>
            <div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Outreach Compliance</p>
              <p className="text-[9px] font-bold text-zinc-600 uppercase mt-1 tracking-widest">All DMs are manual – no automation</p>
            </div>
            <div className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-[8px] font-black text-green-500 uppercase tracking-widest animate-pulse">Status: Compliant & Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
