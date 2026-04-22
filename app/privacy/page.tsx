"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-y-auto selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link 
          href="/auth" 
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest mb-4"
        >
          <ChevronLeft size={16} />
          Back to Authentication
        </Link>

        <header className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
            Privacy <span className="text-zinc-700">Policy</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Effective Date: April 22, 2026</p>
        </header>

        <GlassCard className="p-8 md:p-12 border-white/5 bg-white/[0.02]">
          <div className="prose prose-invert max-w-none space-y-8 text-zinc-400">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-blue-500"></span>
                Introduction
              </h2>
              <p className="leading-relaxed">
                Welcome to <strong>ThePixFlow</strong>. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-blue-500"></span>
                Information We Collect
              </h2>
              <ul className="list-none space-y-3 pl-0">
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">01.</span>
                  <span><strong>Authentication Data:</strong> We use Google OAuth and Firebase Authentication for secure login services. We may collect your name, email, and profile picture.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">02.</span>
                  <span><strong>Project Metadata:</strong> Your project instructions, deadlines, and task statuses are stored securely in Firebase Firestore.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-500 font-bold">03.</span>
                  <span><strong>Usage Data:</strong> We collect technical information on how the service is accessed to optimize performance.</span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-blue-500"></span>
                Google Drive API Integration
              </h2>
              <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">Restricted Scope: drive.file</p>
                <p className="leading-relaxed text-zinc-300">
                  ThePixFlow only accesses, uploads, and manages files that you <strong>explicitly select</strong> or upload through our interface. We do not have access to your entire Google Drive; our permissions are strictly limited to files created or opened by our application.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-blue-500"></span>
                How We Use Your Data
              </h2>
              <p className="leading-relaxed">
                We use your data solely to provide and maintain the service, manage your projects, and communicate updates. We <strong>do not sell</strong> your personal data or content to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-blue-500"></span>
                Security
              </h2>
              <p className="leading-relaxed">
                We implement enterprise-grade security via Firebase and Google Cloud. Your raw video assets remain on your own Google Drive, benefiting from Google's native security infrastructure.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Contact</h2>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-white">hossainsnigdho888@gmail.com</span>
                <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest">Snigdho (Md. Salamoon)</span>
              </div>
            </section>
          </div>
        </GlassCard>

        <footer className="py-12 text-center">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.3em]">&copy; 2026 ThePixFlow. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}
