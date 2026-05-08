"use client";

import React from "react";

/**
 * UNIVERSAL DRIVE PREVIEW
 * Extracts the file ID from a Google Drive link and renders a secure iframe preview.
 */
export function DrivePreview({ url }: { url?: string }) {
  if (!url) return (
    <div className="aspect-video w-full rounded-xl border border-dashed border-white/5 bg-white/[0.02] flex items-center justify-center">
      <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">No visual asset detected</span>
    </div>
  );

  // Robust Regex to extract File ID from various Google Drive link formats
  const match = url.match(/\/d\/(.+?)\/(?:view|edit|preview)?|id=(.+?)(?:&|$)/);
  const fileId = match ? match[1] || match[2] : null;

  if (!fileId) return (
    <div className="aspect-video w-full rounded-xl border border-red-500/20 bg-red-500/5 flex flex-col items-center justify-center gap-2">
      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Invalid Stream Source</span>
      <p className="text-[8px] text-zinc-600 font-bold max-w-[200px] text-center uppercase">Please ensure the link follows the /file/d/ID/ format</p>
    </div>
  );

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-2xl group">
      <iframe
        src={`https://drive.google.com/file/d/${fileId}/preview`}
        className="absolute inset-0 w-full h-full border-0"
        allow="autoplay; encrypted-media"
        title="Google Drive Video Preview"
      />
      <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-xl group-hover:border-white/20 transition-colors" />
    </div>
  );
}
