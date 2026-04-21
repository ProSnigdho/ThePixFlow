"use client";

import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Input } from "@/components/ui/Input";
import { Plus, Image, ArrowRight, Video } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function CreativeBrief() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    mood: "Cinematic",
    reference: ""
  });

  const moods = ["Cinematic", "Fast-Paced", "Minimalist", "Educational", "Corporate"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await addDoc(collection(db, "tasks"), {
        ...form,
        clientId: user.uid,
        status: "Pending",
        createdAt: new Date().toISOString(),
      });
      setForm({ title: "", description: "", link: "", mood: "Cinematic", reference: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Plus className="text-[#833ab4]" size={20} />
        Creative Brief
      </h2>
      <GlassCard className="border-white/5 bg-white/[0.02]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Video Title</label>
            <Input 
              placeholder="e.g. Q3 Brand Film" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Editing Style / Mood</label>
              <select 
                className="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#fd1d1d]/30 appearance-none"
                value={form.mood}
                onChange={(e) => setForm({...form, mood: e.target.value})}
              >
                {moods.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Reference URL</label>
              <Input 
                placeholder="YouTube/IG Link" 
                value={form.reference}
                onChange={(e) => setForm({...form, reference: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Brief & Narrative</label>
            <textarea 
              className="flex w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#833ab4]/30 min-h-[100px] resize-none"
              placeholder="Tell our editors what makes this video special..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Raw Footage Link (Drive)</label>
            <Input 
              placeholder="https://drive.google.com/..." 
              type="url"
              value={form.link}
              onChange={(e) => setForm({...form, link: e.target.value})}
              required 
            />
          </div>

          <GradientButton type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
            {loading ? "Transmitting..." : (
              <>
                <Video size={16} />
                Initiate Production
                <ArrowRight size={16} />
              </>
            )}
          </GradientButton>
        </form>
      </GlassCard>
    </div>
  );
}
