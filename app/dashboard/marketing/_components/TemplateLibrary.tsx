"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Copy, Plus, Send } from "lucide-react";

export function TemplateLibrary() {
  const templates = [
    { title: "Cold Outreach", content: "Hey {name}, loved your recent reel about {topic}. Your visual style is great, but we could help you double your reach with our Cinematic Pack. Interested?" },
    { title: "Follow-up", content: "Hey! Just checking in to see if you saw my last message. We have one slot open for a creator in the {niche} space this week." },
    { title: "Closing Strategy", content: "Great! Let's jump on a quick 5-min call to discuss how we can transform your content flow. What's your availability?" },
  ];

  return (
    <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden bg-black/40">
      <div className="p-4 border-b border-white/5 bg-black/60 flex justify-between items-center">
        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest leading-none">Script Repository</h3>
        <button className="p-1 px-2 rounded-lg bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-colors">
           <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        {templates.map((tpl, idx) => (
          <div key={idx} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-blue-500/30 transition-all cursor-pointer">
            <div className="flex justify-between items-center">
               <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">{tpl.title}</span>
               <Copy size={12} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
               {tpl.content}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
