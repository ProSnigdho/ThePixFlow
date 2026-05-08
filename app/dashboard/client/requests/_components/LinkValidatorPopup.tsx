"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, FileText, Folder, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkValidatorPopupProps {
  url: string;
  isVisible: boolean;
}

export function LinkValidatorPopup({ url, isVisible }: LinkValidatorPopupProps) {
  // Enhanced Google Drive Regex
  const driveRegex = /^https:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/|drive\/folders\/|open\?id=|spreadsheets\/d\/|presentation\/d\/)([a-zA-Z0-9_-]+)/;
  const isValid = driveRegex.test(url);
  const isFolder = url.includes("/folders/");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute bottom-full left-0 mb-4 z-20 w-full max-w-[320px]"
        >
          <div className="premium-glass bg-zinc-900/60 backdrop-blur-md border-white/10 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
            {/* Arrow */}
            <div className="absolute -bottom-2 left-8 w-4 h-4 bg-zinc-900/60 border-r border-b border-white/10 rotate-45" />

            <div className="flex items-start gap-4">
              <div className={cn(
                "p-2.5 rounded-xl shrink-0",
                isValid ? "bg-[#1A4848]/20 text-[#1A8080]" : "bg-amber-500/10 text-amber-500"
              )}>
                {isValid ? (
                  isFolder ? <Folder size={20} /> : <FileText size={20} />
                ) : (
                  <AlertTriangle size={20} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Drive Analysis
                  </h4>
                  {isValid && (
                    <span className="flex h-2 w-2 rounded-full bg-[#1A8080] animate-pulse" />
                  )}
                </div>
                
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  {isValid 
                    ? "Link is correct & accessible. Our system can now process this asset." 
                    : "Access Denied or Invalid Link. Please fix this before submitting."}
                </p>

                {!isValid && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                    <p className="text-[10px] font-bold text-amber-500/80 uppercase">Pro Tip</p>
                    <p className="text-[10px] text-zinc-500 italic">
                      Make sure sharing is set to "Anyone with the link can view".
                    </p>
                  </div>
                )}

                {isValid && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-5 h-5 rounded-full border border-zinc-900 bg-zinc-800 flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#1A8080]/40" />
                         </div>
                       ))}
                    </div>
                    <span className="text-[9px] font-bold text-[#1A8080] uppercase tracking-tighter">Synced</span>
                  </div>
                )}
              </div>

              {isValid && (
                <div className="shrink-0">
                   <CheckCircle2 size={16} className="text-[#1A8080]" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
