"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Target, TrendingUp, TrendingDown, Zap, Plus, X, MoreVertical, Activity, Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// ─── Add Competitor Modal ─────────────────────────────────────────────────────
function AddCompetitorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", growth: "", views: "", format: "", platform: "Instagram", insight: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim()) return toast.error("Account name required");
    setSaving(true);
    try {
      await addDoc(collection(db, "competitors"), { ...form, createdAt: serverTimestamp() });
      toast.success("Competitor added to tracker!");
      onClose();
      setForm({ name: "", growth: "", views: "", format: "", platform: "Instagram", insight: "" });
    } catch { toast.error("Failed to add"); }
    setSaving(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0B0E14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Track New Competitor</h3>
          <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-8 space-y-5">
          {[
            { label: "Account Handle", key: "name", placeholder: "@gymshark" },
            { label: "Growth Rate", key: "growth", placeholder: "+12.4%" },
            { label: "Monthly Views / Reach", key: "views", placeholder: "850K" },
            { label: "Primary Format", key: "format", placeholder: "Fast Transitions, POV…" },
            { label: "Strategic Insight", key: "insight", placeholder: "Switched to 24fps cinematic…", multiline: true },
          ].map(({ label, key, placeholder, multiline }: any) => (
            <div key={key} className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
              {multiline ? (
                <textarea value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder} rows={2}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none" />
              ) : (
                <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all" />
              )}
            </div>
          ))}
        </div>
        <div className="px-8 pb-8 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg disabled:opacity-50">
            {saving ? "Adding…" : "Add Target"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MarketingCompetitorsPage() {
  const { role } = useAuth();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    if (role !== "marketing" && role !== "admin") return;
    let isMounted = true;
    const q = query(collection(db, "competitors"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      if (!isMounted) return;
      setCompetitors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => { console.error("COMPETITORS:", err); setLoading(false); });
  }, [role]);

  const deleteCompetitor = async (id: string) => {
    try {
      await deleteDoc(doc(db, "competitors", id));
      if (selected?.id === id) setSelected(null);
      toast.success("Competitor removed");
    } catch { toast.error("Failed to remove"); }
  };

  if (role !== "marketing" && role !== "admin") return null;

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <AddCompetitorModal open={showAdd} onClose={() => setShowAdd(false)} />

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
            Competitor <span className="text-red-500">Battleground</span>
          </h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
            {competitors.length} targets tracked • Real-time intelligence
          </p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1A4848]/20">
          <Plus size={16} /> Add Target
        </button>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">

        {/* Table */}
        <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-hidden">
          {/* Competitors Table */}
          <div className="flex-1 premium-glass border-white/5 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {loading ? (
                <div className="p-8 space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />)}
                </div>
              ) : competitors.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                  <Target size={40} />
                  <p className="text-[10px] font-black uppercase tracking-widest">No competitors tracked yet</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[9px] font-black text-zinc-700 uppercase tracking-widest bg-[#0A0A0A] sticky top-0 z-10">
                      <th className="px-8 py-4">Target Identity</th>
                      <th className="px-8 py-4">Growth Curve</th>
                      <th className="px-8 py-4">Monthly Reach</th>
                      <th className="px-8 py-4">Primary Format</th>
                      <th className="px-8 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {competitors.map((comp) => {
                      const isPos = comp.growth && comp.growth.startsWith("+");
                      const isSelected = selected?.id === comp.id;
                      return (
                        <tr key={comp.id}
                          onClick={() => setSelected(isSelected ? null : comp)}
                          className={cn("cursor-pointer transition-colors group",
                            isSelected ? "bg-[#1A4848]/10" : "hover:bg-white/[0.02]")}>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                                <Target size={15} />
                              </div>
                              <div>
                                <p className="text-[11px] font-black text-white uppercase tracking-tight">{comp.name}</p>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">{comp.platform}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-2">
                              {isPos ? <TrendingUp size={12} className="text-green-500" /> : <TrendingDown size={12} className="text-red-500" />}
                              <span className={cn("text-[10px] font-black italic", isPos ? "text-green-500" : "text-red-400")}>
                                {comp.growth || "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">{comp.views || "—"} / mo</span>
                          </td>
                          <td className="px-8 py-5">
                            {comp.format && (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20 whitespace-nowrap">
                                {comp.format}
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button onClick={e => { e.stopPropagation(); deleteCompetitor(comp.id); }}
                              className="p-2 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                              <X size={14} />
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

          {/* Alpha Alert Banner */}
          {selected?.insight && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="premium-glass border-red-500/20 bg-red-500/[0.02] p-8 flex items-center justify-between gap-6 shrink-0">
              <div className="absolute inset-0 pointer-events-none opacity-5">
                <Activity size={120} className="text-red-500 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
              <div className="flex items-start gap-4 relative z-10">
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 shrink-0">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase italic tracking-tight">Alpha Insight: {selected.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-medium mt-1">{selected.insight}</p>
                </div>
              </div>
              <button className="relative z-10 shrink-0 bg-white text-black px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                Counter Strategy
              </button>
            </motion.div>
          )}
        </div>

        {/* Right: Trend Tracker */}
        <div className="w-[320px] shrink-0 premium-glass border-white/5 flex flex-col overflow-hidden">
          <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3 shrink-0">
            <Zap size={14} className="text-amber-500" />
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Trend Feed</h3>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
            {[
              { title: "Fast-Cut Technical Splits", growth: "5.4x", tag: "High Velocity" },
              { title: "POV Day-in-the-Life", growth: "3.2x", tag: "Trending" },
              { title: "Cinematic B-Roll Loops", growth: "4.1x", tag: "Rising" },
              { title: "Text-on-Screen Narratives", growth: "2.8x", tag: "Stable Growth" },
            ].map((trend, i) => (
              <div key={i} className="group cursor-pointer space-y-3">
                <div className="aspect-video w-full rounded-2xl bg-zinc-900/60 border border-white/5 relative overflow-hidden hover:border-[#1A4848]/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Trend</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-sm">
                    <Eye size={24} className="text-white" />
                  </div>
                </div>
                <div className="flex justify-between items-start px-1">
                  <div>
                    <p className="text-[10px] font-black text-white uppercase italic tracking-tight">{trend.title}</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase mt-0.5 tracking-widest">Growth Factor: {trend.growth}</p>
                  </div>
                  <span className="text-[8px] font-black text-[#1A8080] uppercase bg-[#1A4848]/20 px-2 py-0.5 rounded-full border border-[#1A4848]/30">
                    {trend.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
