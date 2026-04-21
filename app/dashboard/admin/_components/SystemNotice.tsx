"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Megaphone, Send } from "lucide-react";

export function SystemNotice() {
  const [notice, setNotice] = useState("");

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save to Firestore 'notices' collection

    setNotice("");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Megaphone className="text-[#fcb045]" size={20} />
        System Notice
      </h2>
      <GlassCard className="border-white/5 bg-white/[0.02]">
        <form onSubmit={handlePostNotice} className="space-y-4">
          <textarea 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#fd1d1d]/30 min-h-[100px] resize-none transition-all"
            placeholder="Announce system updates, holidays, or payouts to all users..."
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            required
          />
          <GradientButton type="submit" className="w-full py-2.5 flex items-center justify-center gap-2">
            <Send size={16} />
            Post Global Update
          </GradientButton>
        </form>
      </GlassCard>
    </div>
  );
}
