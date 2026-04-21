"use client";

import React from "react";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, MessageSquare, Video, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function TaskDetailsPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Link href="/dashboard/admin" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to CommandCenter
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#fd1d1d] uppercase tracking-widest bg-[#fd1d1d]/10 px-2 py-0.5 rounded">Task Detail</span>
          <span className="text-xs font-bold text-gray-600 uppercase">ID: {id}</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">Project Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-white/5 bg-white/[0.02] p-8">
            <h2 className="text-2xl font-bold mb-4">Task Information</h2>
            <p className="text-gray-400 mb-6">Real-time collaboration and project tracking for this specific edit.</p>
            
            <div className="p-8 border-dashed border-2 border-white/5 rounded-2xl text-center">
              <MessageSquare className="mx-auto mb-4 text-[#833ab4] opacity-50" size={40} />
              <p className="text-sm text-gray-500 italic">Chat thread initiating... Waiting for participant activity.</p>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="border-white/5 bg-white/[0.02]">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#fcb045]" />
              Administrative Overrides
            </h3>
            <div className="space-y-3">
              <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Force Complete</button>
              <button className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">Delete Project</button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
