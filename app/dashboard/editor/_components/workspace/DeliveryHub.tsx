"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Upload, FileCheck, CheckCircle2, CloudUpload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/firebase/config";
import { collection, query, onSnapshot, orderBy, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { VideoReviewPlayer } from "@/components/workspace/VideoReviewPlayer";

interface Delivery {
  id: string;
  fileId: string;
  webViewLink: string;
  fileName: string;
  uploadedAt: any;
}

interface DeliveryProps {
  projectId: string;
}

export function DeliveryHub({ projectId }: DeliveryProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "projects", projectId, "deliveries"),
      orderBy("uploadedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Delivery[];
      setDeliveries(docs);
      if (docs.length > 0 && !activeFileId) {
        setActiveFileId(docs[0].fileId);
      }
    });

    return () => unsubscribe();
  }, [projectId, activeFileId]);

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);

    try {
      // 1. Get Resumable Upload URL from our API
      const initRes = await fetch('/api/upload/resumable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!initRes.ok) {
        const err = await initRes.json();
        throw new Error(err.error || 'Failed to initialize upload session');
      }

      const { uploadUrl } = await initRes.json();

      // 2. Upload directly to Google Drive via the resumable URL
      // We use XHR to track progress if needed, but fetch is simpler for now
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Failed to upload file to Google Drive');
      
      const driveData = await uploadRes.json();
      const fileId = driveData.id;

      // 3. Sync with Firestore via our API
      const syncRes = await fetch('/api/upload/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileId,
          fileName: file.name,
          projectId,
          webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
        }),
      });

      if (!syncRes.ok) throw new Error('Failed to sync with database');

      setActiveFileId(fileId);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  if (activeFileId) {
    return (
      <div className="h-full flex flex-col gap-4">
        <VideoReviewPlayer projectId={projectId} fileId={activeFileId} />
        <GlassCard className="p-4 flex items-center justify-between bg-black/20">
          <div className="flex gap-2">
            {deliveries.map((d, i) => (
              <button 
                key={d.id}
                onClick={() => setActiveFileId(d.fileId)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                  activeFileId === d.fileId ? "bg-blue-600 text-white" : "bg-white/5 text-zinc-500 hover:bg-white/10"
                )}
              >
                Version {deliveries.length - i}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setActiveFileId(null)}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase hover:text-white transition-colors"
          >
            <Upload size={14} /> New Delivery
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden">
      <div className="p-4 border-b border-white/5 bg-black/40 flex justify-between items-center">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <Upload size={14} className="text-green-500" />
          The Delivery Hub
        </h3>
        <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">Project: {projectId.substring(0, 8)}</span>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar justify-center">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="video/*" 
          onChange={handleFileChange}
        />
        
        {/* Drag & Drop Zone */}
        <div 
          className={cn(
            "flex-1 max-h-[400px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-4 transition-all duration-300 relative",
            dragActive ? "border-green-500 bg-green-500/5 shadow-[0_0_30px_rgba(34,197,94,0.1)]" : "border-zinc-800 bg-white/[0.01] hover:bg-white/[0.03] hover:border-zinc-700",
            uploading && "pointer-events-none opacity-50"
          )}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-blue-500 animate-spin" />
              <div className="text-center">
                <h4 className="text-lg font-bold text-white tracking-tight">Syncing to Google Drive</h4>
                <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-widest opacity-60">High-speed encrypted tunnel active</p>
              </div>
            </div>
          ) : (
            <>
              <div className="p-5 rounded-full bg-zinc-900 border border-white/5 shadow-2xl group">
                <CloudUpload size={48} className={cn("transition-transform duration-500", dragActive ? "scale-110 text-green-500" : "text-zinc-600")} />
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold text-white tracking-tight">Drop your masterpiece here</h4>
                <p className="text-xs text-zinc-500 mt-1 uppercase font-bold tracking-widest opacity-60 italic">MP4, MOV up to 10GB</p>
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 bg-white text-black text-[10px] font-black uppercase px-6 py-2.5 rounded-full hover:scale-105 transition-transform"
              >
                Select Files
              </button>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
