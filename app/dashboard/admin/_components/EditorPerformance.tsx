"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Award, Zap } from "lucide-react";

interface EditorPerformanceProps {
  // We can pass real data later
}

export function EditorPerformance({}: EditorPerformanceProps) {
  // Mock data for now
  const editors = [
    { name: "alex_edits", progress: 85, task: "Promo Vid", color: "#833ab4" },
    { name: "creative_sam", progress: 40, task: "YouTube Intro", color: "#fd1d1d" },
    { name: "vfx_pro", progress: 95, task: "Client Commercial", color: "#fcb045" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        < Award className="text-[#833ab4]" size={20} />
        Editor Performance
      </h2>
      <GlassCard className="border-white/5 bg-white/[0.02] space-y-6">
        {editors.map((editor) => (
          <div key={editor.name} className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-200">{editor.name}</span>
                <span className="text-[10px] text-gray-500 uppercase px-1.5 py-0.5 rounded bg-white/5">{editor.task}</span>
              </div>
              <span className="text-xs font-bold" style={{ color: editor.color }}>{editor.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(253,29,29,0.3)]"
                style={{ 
                  width: `${editor.progress}%`,
                  background: editor.color
                }} 
              />
            </div>
          </div>
        ))}
        {editors.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4 italic text-gradient">No active editor data found.</p>
        )}
      </GlassCard>
    </div>
  );
}
