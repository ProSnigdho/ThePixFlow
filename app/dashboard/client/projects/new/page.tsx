"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { CloudUpload, ChevronLeft, Calendar, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    deadline: ""
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !formData.title || !user) return;

    setLoading(true);
    try {
      // 1. Upload to Drive
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("projectId", "temp"); // temporary tie

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!uploadRes.ok) throw new Error("Drive upload failed");
      const driveData = await uploadRes.json();

      // 2. Save to Firestore
      const docRef = await addDoc(collection(db, "tasks"), {
        title: formData.title,
        instructions: formData.instructions,
        deadline: formData.deadline,
        clientId: user.uid,
        clientName: user.displayName || "Client",
        status: "PENDING",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        sourceFileId: driveData.fileId,
        sourceWebViewLink: driveData.webViewLink
      });

      router.push(`/dashboard/client/projects/${docRef.id}`);
    } catch (error) {
      console.error("Project creation failed:", error);
      alert("Failed to create project. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden bg-[#0A0A0A] animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">Initiate <span className="text-zinc-500">New Production</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Phase 1: Project Intake & Assets</p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="flex-1 grid grid-cols-[1.5fr_1fr] gap-6 min-h-0">
        <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar pr-2">
          {/* Form Fields */}
          <GlassCard className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Project Title</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Nike Summer Ad Campaign v2"
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Creative Brief / Instructions</label>
              <textarea
                required
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Describe your vision, specific cuts, style references..."
                rows={6}
                className="w-full bg-black border border-white/10 rounded-3xl px-6 py-4 text-sm text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Deadline Date</label>
              <div className="relative">
                <input
                  required
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-zinc-400 focus:outline-none focus:border-blue-500/50 transition-all font-bold appearance-none"
                />
                <Calendar className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="flex flex-col gap-6">
          {/* Asset Upload Section */}
          <GlassCard 
            className={cn(
              "flex-1 border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all duration-500 p-8",
              dragActive ? "border-blue-500 bg-blue-500/5" : "border-zinc-800 bg-black/40",
              file ? "border-green-500/50 bg-green-500/5" : ""
            )}
            onDragEnter={onDrag}
            onDragLeave={onDrag}
            onDragOver={onDrag}
            onDrop={onDrop}
          >
            {file ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-3xl bg-green-500/20 flex items-center justify-center text-green-500">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase truncate max-w-[200px]">{file.name}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase">Ready for High-Speed Sync</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setFile(null)}
                  className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline"
                >
                  Remove Asset
                </button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <CloudUpload size={32} className="text-zinc-700" />
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter">Raw Footage Secure Drop</h4>
                  <p className="text-[10px] text-zinc-600 font-bold mt-1 uppercase tracking-widest leading-relaxed">
                    Drag & Drop your raw assets here<br/>
                    <span className="opacity-40 italic">Supports MP4, MOV, RAW (Up to 10GB)</span>
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all"
                >
                  Browse Files
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={(e) => e.target.files && setFile(e.target.files[0])}
                />
              </>
            )}
          </GlassCard>

          <button
            type="submit"
            disabled={loading || !file || !formData.title}
            className={cn(
              "w-full py-5 rounded-3xl text-sm font-black uppercase tracking-widest transition-all",
              loading ? "bg-zinc-900 text-zinc-700 cursor-not-allowed" : 
              (file && formData.title ? "bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.3)] hover:scale-[1.02]" : "bg-zinc-900 text-zinc-700 border border-white/5")
            )}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <Loader2 size={18} className="animate-spin" />
                Processing Assets...
              </div>
            ) : "Launch Production Pipeline"}
          </button>
        </div>
      </form>
    </div>
  );
}
