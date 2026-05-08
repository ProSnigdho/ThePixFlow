"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, X, Calendar, Clock, Send, CheckCircle2, Trash2, Video, Hash } from "lucide-react";
import { toast } from "sonner";
import { format, parseISO, formatDistanceToNow } from "date-fns";

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "LinkedIn"];
const STATUS_COLORS: Record<string, string> = {
  Draft:     "text-zinc-400 bg-zinc-800/50 border-zinc-700",
  Scheduled: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Published: "text-[#1A8080] bg-[#1A4848]/20 border-[#1A4848]/30",
};

// ─── Add Post Modal ───────────────────────────────────────────────────────────
function AddPostModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ title: "", caption: "", hashtags: "", platform: "Instagram", scheduledFor: "", status: "Draft" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim()) return toast.error("Post title required");
    setSaving(true);
    try {
      await addDoc(collection(db, "contentPosts"), { ...form, createdAt: serverTimestamp() });
      toast.success("Post added to planner!");
      onClose();
      setForm({ title: "", caption: "", hashtags: "", platform: "Instagram", scheduledFor: "", status: "Draft" });
    } catch { toast.error("Failed to add post"); }
    setSaving(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-[#0B0E14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Schedule New Post</h3>
          <button onClick={onClose} className="p-2 text-zinc-600 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="p-8 space-y-5">
          {[
            { label: "Post Title", key: "title", placeholder: "Nike Summer Reel V2" },
            { label: "Caption", key: "caption", placeholder: "Add caption…", multiline: true },
            { label: "Hashtags", key: "hashtags", placeholder: "#nike #fitness #reels" },
          ].map(({ label, key, placeholder, multiline }) => (
            <div key={key} className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
              {multiline ? (
                <textarea value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder} rows={3}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none" />
              ) : (
                <input value={(form as any)[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all" />
              )}
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Platform</label>
              <select value={form.platform} onChange={e => setForm(p => ({ ...p, platform: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-3 py-3 text-sm text-white focus:outline-none">
                {PLATFORMS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-3 py-3 text-sm text-white focus:outline-none">
                {Object.keys(STATUS_COLORS).map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Scheduled For</label>
              <input type="datetime-local" value={form.scheduledFor} onChange={e => setForm(p => ({ ...p, scheduledFor: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-[#1A4848] rounded-xl px-3 py-3 text-xs text-white focus:outline-none" />
            </div>
          </div>
        </div>
        <div className="px-8 pb-8 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1A4848]/20 disabled:opacity-50">
            {saving ? "Saving…" : "Schedule Post"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MarketingPlannerPage() {
  const { role } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (role !== "marketing" && role !== "admin") return;
    let isMounted = true;
    const q = query(collection(db, "contentPosts"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => {
      if (!isMounted) return;
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, err => { console.error("CONTENT_POSTS:", err); setLoading(false); });
  }, [role]);

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "contentPosts", id));
      if (selected?.id === id) setSelected(null);
      toast.success("Post removed");
    } catch { toast.error("Failed to delete"); }
  };

  const filtered = posts.filter(p => activeTab === "All" || p.status === activeTab || p.platform === activeTab);

  if (role !== "marketing" && role !== "admin") return null;

  const tabs = ["All", "Draft", "Scheduled", "Published", ...PLATFORMS];

  return (
    <div className="h-full w-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <AddPostModal open={showAdd} onClose={() => setShowAdd(false)} />

      {/* ─── Top Bar ─── */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                activeTab === tab ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]" : "text-zinc-500 hover:text-white hover:bg-white/5")}>
              {tab}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-[#1A4848]/20">
          <Plus size={16} /> Schedule Post
        </button>
      </div>

      {/* ─── Content ─── */}
      <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
        {/* Post Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-1 pb-6">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center opacity-20 gap-4">
              <Calendar size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">No posts in this queue</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <motion.div key={post.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelected(selected?.id === post.id ? null : post)}
                  className={cn("group relative rounded-3xl border cursor-pointer overflow-hidden transition-all",
                    selected?.id === post.id
                      ? "bg-[#1A4848]/10 border-[#1A4848]/50 shadow-[0_0_30px_rgba(26,72,72,0.15)]"
                      : "bg-white/[0.02] border-white/5 hover:border-[#1A4848]/30")}>

                  {/* Thumbnail area */}
                  <div className="aspect-[4/3] bg-zinc-900/60 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Video size={48} />
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <span className={cn("text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border", STATUS_COLORS[post.status] || STATUS_COLORS["Draft"])}>
                        {post.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="text-[9px] font-black text-white/60 uppercase tracking-widest bg-black/40 px-2 py-1 rounded-lg backdrop-blur-sm">
                        {post.platform}
                      </span>
                    </div>

                    {/* Delete on hover */}
                    <button onClick={e => { e.stopPropagation(); deletePost(post.id); }}
                      className="absolute top-4 left-4 p-1.5 rounded-lg bg-black/60 text-zinc-600 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="text-sm font-black text-white truncate">{post.title}</h4>
                    {post.scheduledFor && (
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Clock size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          {post.scheduledFor}
                        </span>
                      </div>
                    )}
                    {post.hashtags && (
                      <div className="flex items-center gap-1">
                        <Hash size={10} className="text-[#1A8080] shrink-0" />
                        <p className="text-[9px] text-[#1A8080]/60 font-bold truncate">{post.hashtags}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Post Detail Sidebar */}
        <AnimatePresence>
          {selected && (
            <motion.div key={selected.id} initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }}
              className="w-[320px] shrink-0 h-full flex flex-col bg-[#0B0E14] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between shrink-0">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Post Detail</h3>
                <button onClick={() => setSelected(null)} className="p-2 text-zinc-600 hover:text-white"><X size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                <div className="aspect-[9/16] rounded-2xl bg-zinc-900 border border-white/10 relative overflow-hidden flex items-center justify-center">
                  <Video size={40} className="text-zinc-700" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[10px] font-black text-white uppercase italic tracking-tighter truncate">{selected.title}</p>
                  </div>
                </div>
                {[
                  { label: "Platform", value: selected.platform },
                  { label: "Status", value: selected.status },
                  { label: "Scheduled", value: selected.scheduledFor || "Not set" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
                    <span className="text-[10px] font-black text-white uppercase">{value}</span>
                  </div>
                ))}
                {selected.caption && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Caption</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{selected.caption}</p>
                  </div>
                )}
                {selected.hashtags && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Hashtags</p>
                    <p className="text-[11px] text-[#1A8080] font-bold leading-relaxed">{selected.hashtags}</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-white/5 shrink-0">
                <button className="w-full flex items-center justify-center gap-3 py-3 bg-[#1A4848] hover:bg-[#1A8080] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg">
                  <Send size={14} /> Publish Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
