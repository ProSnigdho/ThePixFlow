"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Monitor, AlertCircle, ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrivePreviewWidgetProps {
  url: string;
  isValid: boolean;
}

export function DrivePreviewWidget({ url, isValid }: DrivePreviewWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Extract File ID
  const fileIdMatch = url.match(/(?:file\/d\/|open\?id=|spreadsheets\/d\/|presentation\/d\/)([a-zA-Z0-9_-]+)/);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;
  const isFolder = url.includes("/folders/");
  
  // Folders use a different preview URL
  const previewUrl = isFolder 
    ? url.replace("/view", "").replace("?usp=sharing", "") + "?embedded=true"
    : fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;

  if (!url || !isValid || !previewUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block w-full max-w-[340px] shrink-0"
    >
      <div className="premium-glass bg-zinc-900/40 backdrop-blur-md border-white/10 overflow-hidden rounded-2xl flex flex-col h-[280px] shadow-2xl relative">
        
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
           <div className="flex items-center gap-2">
             <Monitor size={14} className="text-[#1A8080]" />
             <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Preview</span>
           </div>
           <div className="flex items-center gap-1">
             <ShieldCheck size={12} className="text-[#1A8080]" />
             <span className="text-[9px] text-zinc-500 font-bold uppercase">Secure</span>
           </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 relative bg-black/20">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-zinc-900/80 backdrop-blur-sm">
               <Loader2 size={24} className="text-[#1A8080] animate-spin" />
               <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Fetching Preview...</p>
            </div>
          )}
          
          <iframe
            src={previewUrl}
            className="w-full h-full border-none"
            onLoad={() => setIsLoading(false)}
            allow="autoplay"
          />
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-zinc-900/60 border-t border-white/5">
           <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A8080] animate-pulse" />
              <p className="text-[10px] font-bold text-white">Link is correct & synchronized</p>
           </div>
           <p className="text-[9px] text-zinc-500 leading-relaxed italic">
             If the preview is blank, please ensure link sharing is set to "Anyone with the link".
           </p>
        </div>

        {/* Floating Action */}
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute top-14 right-4 p-2 bg-black/60 hover:bg-[#1A4848] text-white rounded-lg border border-white/10 transition-colors shadow-xl"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </motion.div>
  );
}
