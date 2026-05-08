"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  collection, query, orderBy, onSnapshot,
  updateDoc, doc, addDoc, serverTimestamp, deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  UserPlus, Flame, Zap, CheckCircle2, Search, X,
  MoreVertical, MessageSquare, Tag, ExternalLink, Filter, Snowflake,
  Trash2, Plus
} from "lucide-react";
import { toast } from "sonner";

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string; label: string }> = {
  New:       { color: "text-zinc-300",  bg: "bg-white/5",      border: "border-white/10",     label: "New" },
  Cold:      { color: "text-blue-400",  bg: "bg-blue-500/10",  border: "border-blue-500/20",  label: "Cold" },
  Warm:      { color: "text-orange-400",bg: "bg-orange-500/10",border: "border-orange-500/20",label: "Warm" },
  Hot:       { color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20",   label: "Hot" },
  Converted: { color: "text-[#1A8080]", bg: "bg-[#1A4848]/20", border: "border-[#1A4848]/40", label: "Converted" },
};

const FILTER_TABS = ["All", "New", "Cold", "Warm", "Hot", "Converted"];

// ─── Add Lead Modal ───────────────────────────────────────────────────────────
function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ username: "", source: "Instagram", status: "Cold", niche: "", followers: "" });
  const [saving, setSaving] = useState(false);

  const sources = ["Instagram", "TikTok", "YouTube", "LinkedIn", "Referral", "Other"];

  const handleSave = async () => {
    if (!form.username.trim()) return toast.error("Username is required");
    setSaving(true);
    try {
      await addDoc(collection(db, "leads"), {
        ...form,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      toast.success("Lead added to pipeline!");
      onClose();
      setForm({ username: "", source: "Instagram", status: "Cold", niche: "", followers: "" });
    } catch (e) {
      toast.error("Failed to add lead");
    }
    setSaving(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">New Lead Entry</h3>
          <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8 space-y-5">
          {[
            { label: "Username / Handle", key: "username", placeholder: "@fitness_legend" },
            { label: "Niche / Category", key: "niche", placeholder: "Fitness, SaaS, Real Estate…" },
            { label: "Followers / Reach", key: "followers", placeholder: "124K" },
          ].map(({ label, key, placeholder }) => (
            <div key={key} className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
              <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Source</label>
              <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all">
                {sources.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Initial Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all">
                {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="px-8 pb-8 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1A4848]/20 disabled:opacity-50">
            {saving ? "Adding…" : "Add Lead"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Lead Profile Panel ───────────────────────────────────────────────────────
function LeadProfile({ lead, onClose }: { lead: any; onClose: () => void }) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "leads", lead.id), { notes, updatedAt: serverTimestamp() });
      toast.success("Notes saved");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG["New"];

  return (
    <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
      className="w-[360px] shrink-0 h-full flex flex-col bg-[#0B0E14] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lead 360°</h3>
        <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={16} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
        {/* Avatar */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#1A4848] to-[#1A8080] flex items-center justify-center shadow-[0_0_30px_rgba(26,128,128,0.3)] border border-[#1A4848]/50">
            <span className="text-3xl font-black text-white">
              {(lead.username || lead.name || "?")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{lead.username || lead.name}</h2>
            {lead.followers && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{lead.followers} reach</p>}
          </div>
          <span className={cn("text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border", cfg.color, cfg.bg, cfg.border)}>
            {lead.status}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-2">Lead Details</p>
          {[
            { label: "Source", value: lead.source },
            { label: "Niche", value: lead.niche },
            { label: "Assigned To", value: lead.assignedMarketer || "Unassigned" },
            { label: "Discovered", value: lead.createdAt ? formatDistanceToNow(lead.createdAt.toDate(), { addSuffix: true }) : "—" },
          ].map(({ label, value }) => value ? (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">{label}</span>
              <span className="text-[10px] font-black text-white uppercase">{value}</span>
            </div>
          ) : null)}
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5 pb-2">Strategic Notes</p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs text-zinc-300 min-h-[120px] focus:outline-none focus:border-[#1A4848] transition-all resize-none"
            placeholder="Add context, observations, or next steps..." />
          <button onClick={saveNotes} disabled={saving}
            className="w-full py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50">
            {saving ? "Saving…" : "Save Notes"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MarketingLeadsPage() {
  const { role } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (role !== "marketing" && role !== "admin") return;
    let isMounted = true;
    const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      if (!isMounted) return;
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => { console.error("LEADS_CRM:", err); setLoading(false); });
    return () => { isMounted = false; unsub(); };
  }, [role]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "leads", id), { status, updatedAt: serverTimestamp() });
    } catch { toast.error("Failed to update status"); }
  };

  const deleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, "leads", id));
      if (selectedLead?.id === id) setSelectedLead(null);
      toast.success("Lead removed");
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = useMemo(() => leads.filter(l => {
    const matchTab = activeFilter === "All" || l.status === activeFilter;
    const matchSearch = !search || (l.username || l.name || "").toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  }), [leads, activeFilter, search]);

  if (role !== "marketing" && role !== "admin") return null;

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <AddLeadModal open={showAddModal} onClose={() => setShowAddModal(false)} />

      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveFilter(tab)}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeFilter === tab ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]" : "text-zinc-500 hover:text-white hover:bg-white/5")}>
              {tab}
              {tab !== "All" && (
                <span className="ml-1.5 text-[8px] opacity-60">
                  ({leads.filter(l => l.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#1A8080] transition-colors" size={15} />
            <input type="text" placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-56 bg-zinc-900/50 border border-white/5 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#1A4848] transition-all placeholder:text-zinc-700" />
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1A4848]/20">
            <Plus size={16} /> Add Lead
          </button>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
        {/* Table */}
        <div className="flex-1 premium-glass border-white/5 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-8 space-y-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                <UserPlus size={40} />
                <p className="text-[10px] font-black uppercase tracking-widest">No leads match your filter</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] font-black text-zinc-700 uppercase tracking-widest bg-[#0A0A0A] sticky top-0 z-10">
                    <th className="px-8 py-4">Identity</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Source</th>
                    <th className="px-8 py-4">Discovered</th>
                    <th className="px-8 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {filtered.map((lead) => {
                    const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG["New"];
                    const isSelected = selectedLead?.id === lead.id;
                    return (
                      <tr key={lead.id}
                        onClick={() => setSelectedLead(isSelected ? null : lead)}
                        className={cn("cursor-pointer transition-colors group text-[10px]",
                          isSelected ? "bg-[#1A4848]/10" : "hover:bg-white/[0.02]")}>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1A4848] to-[#1A8080] flex items-center justify-center shrink-0 shadow-lg">
                              <span className="text-white text-[11px] font-black">
                                {(lead.username || lead.name || "?")[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-black text-white uppercase tracking-tight">{lead.username || lead.name}</p>
                              <p className="text-zinc-600 text-[9px] font-bold mt-0.5">{lead.niche || lead.followers || "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex gap-1">
                            {(["Cold","Warm","Hot","Converted"] as const).map(s => {
                              const sc = STATUS_CONFIG[s];
                              return (
                                <button key={s} onClick={e => { e.stopPropagation(); updateStatus(lead.id, s); }}
                                  className={cn("p-1.5 rounded-lg border text-[9px] font-black uppercase transition-all",
                                    lead.status === s ? `${sc.bg} ${sc.color} ${sc.border}` : "bg-white/5 text-zinc-700 border-white/5 hover:bg-white/10")}>
                                  {s === "Cold" ? <Snowflake size={10} /> : s === "Warm" ? <Zap size={10} /> : s === "Hot" ? <Flame size={10} /> : <CheckCircle2 size={10} />}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-zinc-500 font-bold uppercase text-[9px]">{lead.source || "—"}</span>
                        </td>
                        <td className="px-8 py-4">
                          <span className="text-zinc-600 font-bold text-[9px]">
                            {lead.createdAt ? formatDistanceToNow(lead.createdAt.toDate(), { addSuffix: true }) : "—"}
                          </span>
                        </td>
                        <td className="px-8 py-4">
                          <button onClick={e => { e.stopPropagation(); deleteLead(lead.id); }}
                            className="p-2 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Lead Profile */}
        <AnimatePresence>
          {selectedLead && (
            <LeadProfile key={selectedLead.id} lead={selectedLead} onClose={() => setSelectedLead(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
