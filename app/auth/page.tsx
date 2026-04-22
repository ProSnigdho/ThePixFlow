"use client";

import { useState } from "react";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, MonitorPlay, Mail, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // New user: Create profile with selected role
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: role,
          isApproved: role === "admin" ? true : false,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error("GOOGLE_AUTH_ERROR:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          role,
          isApproved: false,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#833ab4]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#fd1d1d]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Back to Home Link */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link 
          href="/" 
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.2em]"
        >
          <ChevronLeft size={14} /> Back to Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#833ab4] to-[#fd1d1d] flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(253,29,29,0.3)]">
            <MonitorPlay size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Pix<span className="text-zinc-500">Flow</span></h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Professional Pipeline</p>
        </div>

        <GlassCard className="p-8 md:p-10 border-white/5 bg-white/[0.02] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                {isLogin ? "Welcome Back" : "Request Access"}
              </h2>
              <p className="text-zinc-500 text-xs mt-1 uppercase font-bold tracking-widest opacity-60">
                {isLogin ? "Continue your production journey" : "Join the high-speed video network"}
              </p>
            </div>

            {/* Role Selection for Sign-up/Social */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Select Your Role</label>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { label: "Client / Producer", value: "client" },
                    { label: "Video Editor", value: "editor" },
                    { label: "Marketing Specialist", value: "marketing" }
                  ]}
                  className="bg-black/40 border-white/10"
                />
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-14 bg-white hover:bg-zinc-100 text-black rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-4 group/btn relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              {loading ? (
                <Loader2 className="animate-spin text-zinc-400" size={20} />
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                    <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/>
                    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Or use email</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={16} />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 bg-black/40 border-white/5 focus:border-white/20 h-12"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={16} />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-12 bg-black/40 border-white/5 focus:border-white/20 h-12"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-[0.2em] transition-all"
              >
                {loading ? "Processing..." : (isLogin ? "Sign In" : "Request Account")}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest"
              >
                {isLogin ? "New to PixFlow? Create Account" : "Already registered? Sign In"}
              </button>
            </div>
          </div>

          {/* Consent Disclosure (CRITICAL FOR GOOGLE VERIFICATION) */}
          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="flex gap-3 text-left">
              <ShieldCheck size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-600 leading-relaxed font-medium">
                By signing in, you agree to our <Link href="/terms" className="text-zinc-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-zinc-400 hover:underline">Privacy Policy</Link>. 
                <span className="block mt-1">
                  ThePixFlow will request access to your Google Drive via the <span className="text-blue-500/50">drive.file</span> scope to securely host and deliver project assets.
                </span>
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Footer Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-12 text-center"
      >
        <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.4em]">&copy; 2026 ThePixFlow Production Infrastructure</p>
      </motion.div>
    </div>
  );
}
