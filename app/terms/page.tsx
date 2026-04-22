"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 overflow-y-auto selection:bg-red-500/30">
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
            Terms of <span className="text-zinc-700">Service</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Effective Date: April 22, 2026</p>
        </header>

        <GlassCard className="p-8 md:p-12 border-white/5 bg-white/[0.02]">
          <div className="prose prose-invert max-w-none space-y-10 text-zinc-400">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-red-500"></span>
                01. Acceptance
              </h2>
              <p className="leading-relaxed">
                By accessing or using <strong>ThePixFlow</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-red-500"></span>
                02. User Accounts
              </h2>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your Google OAuth session and all activities that occur under your account. You must provide accurate information when applying for an account.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-red-500"></span>
                03. Content Ownership
              </h2>
              <p className="leading-relaxed">
                You retain all rights to the video and image assets you upload to your Google Drive through ThePixFlow. We do not claim ownership of your content. You are solely responsible for ensuring you have the legal rights to the content you manage through our platform.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-red-500"></span>
                04. Prohibited Conduct
              </h2>
              <p className="leading-relaxed">
                Users agree not to use the service for any unlawful purposes, including the management of content that infringes on intellectual property rights or contains malicious code.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <span className="w-8 h-[1px] bg-red-500"></span>
                05. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                ThePixFlow and its developer shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service.
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-white/5">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Support</h2>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-white">hossainsnigdho888@gmail.com</span>
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
