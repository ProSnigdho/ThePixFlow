"use client";

import React from "react";
import { useParams } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowLeft, MessageSquare, Video, Clock } from "lucide-react";
import Link from "next/link";

export default function ClientTaskDetailsPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Link href="/dashboard/client" className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to Hub
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#833ab4] uppercase tracking-widest bg-[#833ab4]/10 px-2 py-0.5 rounded">Project Details</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight italic">Production View</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-white/5 bg-white/[0.02] p-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={24} className="text-[#fd1d1d]" />
              Collaboration Thread
            </h2>
            <div className="min-h-[400px] border border-white/5 rounded-2xl bg-black/40 p-6 flex flex-col justify-end">
              <p className="text-center text-xs text-gray-600 font-bold uppercase tracking-[0.3em] mb-4">Secured Connection Active</p>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 max-w-sm ml-auto">
                <p className="text-sm text-gray-300">Wait is almost over! We're finishing up the first draft.</p>
                <span className="text-[10px] text-gray-600 mt-2 block italic">Editor • Just now</span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="border-white/5 bg-white/[0.02] space-y-4">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-[#fd1d1d]/10 flex items-center justify-center">
                 <Clock className="text-[#fd1d1d]" size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-gray-500 uppercase">Current Status</p>
                 <p className="text-xl font-black text-white">Rendering</p>
               </div>
             </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
