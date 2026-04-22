"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientButton } from "@/components/ui/GradientButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user doc in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          role,
          isApproved: false, // Core Gatekeeper functionality
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
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="w-full max-w-md relative overflow-hidden">
        {/* Glow effect */}
        <div className="pointer-events-none absolute -inset-x-20 -top-20 h-40 w-40 rounded-full bg-[#833ab4]/20 blur-3xl opacity-50"></div>
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[#fcb045]/20 blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-center mb-2">
            <span className="text-gradient">PixFlow</span>
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {isLogin ? "Sign in to your dashboard" : "Apply for an account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  options={[
                    { label: "Client", value: "client" },
                    { label: "Editor", value: "editor" },
                    { label: "Marketing Specialist", value: "marketing" }
                  ]}
                  required
                />
              </div>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <GradientButton type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
            </GradientButton>
          </form>

          <div className="text-center mt-6 space-y-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>

            <div className="pt-4 border-t border-white/5 flex justify-center gap-6">
              <Link href="/privacy" className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-[10px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
