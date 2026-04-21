"use client";

import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { GlassCard } from "@/components/ui/GlassCard";
import { Check, X, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UserDoc {
  id: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

interface UserApprovalListProps {
  users: UserDoc[];
}

export function UserApprovalList({ users }: UserApprovalListProps) {
  const handleApprove = async (uid: string) => {
    try {
      await updateDoc(doc(db, "users", uid), { isApproved: true });
    } catch (error) {
      console.error("Error approving user", error);
    }
  };

  const handleReject = async (uid: string) => {
    // Logic for rejection: in this budget version, we might just delete if rejected or mark as rejected
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <UserCheck className="text-[#fd1d1d]" size={20} />
        User Approvals Required
      </h2>
      
      <div className="space-y-4">
        {users.length === 0 ? (
          <GlassCard className="text-center py-12 opacity-50 bg-white/[0.02] border-dashed">
            <p className="text-gray-400">All caught up! No pending applications.</p>
          </GlassCard>
        ) : (
          users.map((u, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={u.id}
            >
              <GlassCard className="flex justify-between items-center group hover:bg-white/[0.04] transition-colors border-white/5 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#833ab4] to-[#fd1d1d] opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#833ab4] to-[#fd1d1d] flex items-center justify-center font-bold text-white text-xs uppercase shadow-lg shadow-[#fd1d1d]/20">
                    {u.email[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{u.email}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-0.5">{u.role}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleApprove(u.id)}
                    className="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-black transition-all transform active:scale-90"
                    title="Approve User"
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    onClick={() => handleReject(u.id)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-black transition-all transform active:scale-90"
                    title="Reject User"
                  >
                    <X size={18} />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
