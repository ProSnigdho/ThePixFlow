"use client";

import React from "react";
import Link from "next/link";
import { 
  CloudUpload, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  MonitorPlay, 
  Users, 
  Workflow, 
  Mail 
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#fd1d1d]/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#833ab4] to-[#fd1d1d] flex items-center justify-center">
              <MonitorPlay size={18} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">Pix<span className="text-zinc-500">Flow</span></span>
          </div>
          <Link href="/auth">
            <button className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              Login / Apply
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#833ab4]/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#fd1d1d]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8">
            <Zap size={12} className="text-[#fd1d1d]" />
            The Future of Video Post-Production
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
            Elevate Your <br />
            <span className="text-gradient">Video Workflow</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            ThePixFlow is a professional Video Production Management tool designed to streamline asset delivery, client reviews, and task tracking.
          </p>
          <Link href="/auth">
            <GradientButton className="px-10 py-5 rounded-2xl text-sm uppercase tracking-widest font-black">
              Launch Production Pipeline <ChevronRight size={18} className="inline ml-2" />
            </GradientButton>
          </Link>
        </div>
      </section>

      {/* Google Drive Disclosure Section (CRITICAL FOR VERIFICATION) */}
      <section className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-12 border-blue-500/20 bg-blue-500/[0.02]">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-20 h-20 rounded-3xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <CloudUpload size={40} className="text-blue-400" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">Google Drive Integration</h2>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  We use Google Drive to securely host and deliver your video assets. Our integration allows for seamless project coordination between editors and clients by automatically managing file uploads to your designated folders.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500">
                  <ShieldCheck size={14} /> Secure drive.file Restricted Scope
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Engineered for Excellence</h3>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Built to handle high-volume cinema pipelines</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <GlassCard className="p-10 space-y-6 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#fd1d1d]">
              <CloudUpload size={24} />
            </div>
            <h4 className="text-xl font-bold uppercase tracking-tight">Automated Drive Uploads</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">Direct-to-Drive resumable uploads bypass server limits, supporting high-resolution files with ease.</p>
          </GlassCard>

          <GlassCard className="p-10 space-y-6 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#833ab4]">
              <Workflow size={24} />
            </div>
            <h4 className="text-xl font-bold uppercase tracking-tight">Real-time Task Tracking</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">Keep everyone in sync with a live dashboard tracking every stage of the editing process.</p>
          </GlassCard>

          <GlassCard className="p-10 space-y-6 hover:border-white/20 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-orange-500">
              <Users size={24} />
            </div>
            <h4 className="text-xl font-bold uppercase tracking-tight">Client Review System</h4>
            <p className="text-zinc-500 text-sm leading-relaxed">Centralized feedback system ensures smooth approval cycles and faster project delivery.</p>
          </GlassCard>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Ready to optimize?</h2>
          <Link href="/auth">
            <GradientButton className="px-12 py-6 rounded-3xl text-sm uppercase tracking-[0.3em] font-black shadow-[0_0_50px_rgba(253,29,29,0.2)]">
              Launch Production
            </GradientButton>
          </Link>
        </div>
      </section>

      {/* Footer (CRITICAL FOR VERIFICATION) */}
      <footer className="py-20 border-t border-white/5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                <MonitorPlay size={12} className="text-white" />
              </div>
              <span className="text-lg font-black tracking-tighter uppercase">PixFlow</span>
            </div>
            <p className="text-zinc-600 text-xs font-bold leading-relaxed max-w-xs">
              Professional post-production infrastructure for modern video agencies and creators.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Legal Documents</h5>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-xs text-zinc-600 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-xs text-zinc-600 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Support</h5>
              <ul className="space-y-2">
                <li><a href="mailto:hossainsnigdho888@gmail.com" className="text-xs text-zinc-600 hover:text-white transition-colors flex items-center gap-2"><Mail size={12} /> hossainsnigdho888@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">&copy; 2026 ThePixFlow. All Rights Reserved.</p>
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest italic">Designed by Snigdho</p>
        </div>
      </footer>
    </div>
  );
}
