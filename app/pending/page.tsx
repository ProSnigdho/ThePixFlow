"use client";

import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { 
  Loader2, 
  ExternalLink, 
  Calendar, 
  PlayCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function PendingPage() {
  const { signOut, role, user } = useAuth();

  const isEditor = role === "editor";

  return (
    <div className="flex h-screen items-center justify-center p-4 relative overflow-hidden bg-black">
      {/* Background glow animations */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#833ab4]/20 blur-[120px] pointer-events-none" 
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlassCard className="text-center overflow-hidden border-white/5">
          {/* Header Badge */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#fd1d1d] animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-gray-300">
                {isEditor ? "Editor" : "Client"} Application
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 tracking-tight">
            Welcome to the {isEditor ? "Creative Team" : "Agency"}, <span className="text-gradient">{user?.email?.split('@')[0]}</span>
          </h1>

          <div className="mt-8 mb-10 text-left">
            {isEditor ? (
              /* Editor Stepper Content */
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Account Created</h3>
                    <p className="text-sm text-gray-400">Your profile is safely stored in our secure database.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#fd1d1d]/20 border border-[#fd1d1d]/50 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#fd1d1d] animate-spin-slow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Pending Admin Approval</h3>
                    <p className="text-sm text-gray-400">Our team is reviewing your application. You'll get access within 24 hours.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 opacity-40">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Start Earning</h3>
                    <p className="text-sm text-gray-400">Once approved, you can start picking up editing tasks immediately.</p>
                  </div>
                </div>

                <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <PlayCircle className="text-[#fcb045]" />
                    <span className="text-sm font-medium">Editing Guidelines (Google Drive)</span>
                  </div>
                  <ExternalLink size={18} className="text-gray-500" />
                </div>
              </div>
            ) : (
              /* Client Video/Discovery Content */
              <div className="space-y-6">
                <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/10 relative flex items-center justify-center group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <div className="relative z-20 text-center flex flex-col items-center">
                    <PlayCircle size={48} className="text-white hover:text-[#fd1d1d] transition-colors cursor-pointer mb-2" />
                    <p className="text-xs font-medium text-gray-300">Watch: How the PixFlow Process Works</p>
                  </div>
                  {/* Mock video bg */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-30" />
                </div>

                <p className="text-sm text-gray-400 text-center px-4">
                  We verify each client individually to ensure we have the capacity to deliver top-tier results. While you wait, let's get you prepared:
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <GradientButton className="flex-1 flex items-center justify-center gap-2">
                    <Calendar size={18} />
                    Book Discovery Call
                  </GradientButton>
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-lg font-semibold transition-all text-sm">
                    View Pricing Plans
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-white/5">
            <button 
              onClick={signOut}
              className="text-sm font-semibold text-gray-500 hover:text-white transition-colors flex items-center gap-2 mx-auto"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Sign Out & Logout
            </button>
          </div>
        </GlassCard>
      </motion.div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
