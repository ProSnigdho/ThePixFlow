"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { UserApprovalList } from "../_components/UserApprovalList";
import { UserCheck, ShieldAlert } from "lucide-react";

interface UserDoc {
  id: string;
  email: string;
  role: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ApprovalsPage() {
  const { role } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserDoc[]>([]);

  useEffect(() => {
    if (role !== "admin") return;
    
    const qUsers = query(collection(db, "users"));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const usersList = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() } as UserDoc))
        .filter((u: UserDoc) => !u.isApproved && u.role !== "admin");
      setPendingUsers(usersList);
    });

    return () => unsubUsers();
  }, [role]);

  if (role !== "admin") return null;

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-white">GATEKEEP<span className="text-gradient underline">PROTOCOL</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Identity Verification Waiting Room</p>
        </div>
        <div className="flex items-center gap-2 bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10">
           <ShieldAlert size={16} className="text-red-500" />
           <span className="text-xs font-bold text-red-500 uppercase tracking-widest">{pendingUsers.length} Pending Review</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full pt-10">
        <UserApprovalList users={pendingUsers} />
      </div>

      <div className="mt-auto p-10 text-center opacity-20">
         <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-500">Secure Biometric Oversight Active</p>
      </div>
    </div>
  );
}
