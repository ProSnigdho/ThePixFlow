"use client";

import React from "react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, isApproved, loading } = useAuth();

  if (loading) return null;

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden font-sans">
      {/* Sidebar - only show if approved */}
      {isApproved && role && <Sidebar role={role} />}

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#833ab4]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fcb045]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex-1 relative z-10 p-6 h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
