"use client";

import { motion } from "framer-motion";

export function LoadingOverlay() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
    >
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/5" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-4 border-t-[#fd1d1d] border-r-[#833ab4] border-b-[#fcb045] border-l-transparent"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <span className="text-xl font-bold tracking-widest text-white">PIXFLOW</span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mt-1">Establishing Secure Session</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
