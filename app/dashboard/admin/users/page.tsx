"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Trash2, Shield, UserCog, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UserDoc {
  id: string;
  email: string;
  role: string;
  isApproved: boolean;
}

export default function ManageUsersPage() {
  const { role: currentUserRole } = useAuth();
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentUserRole !== "admin") return;
    
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserDoc)));
    });

    return () => unsub();
  }, [currentUserRole]);

  const handleUpdateRole = async (uid: string, newRole: string) => {
    await updateDoc(doc(db, "users", uid), { role: newRole });
  };

  const handleDeleteUser = async (uid: string) => {
    if (confirm("Are you sure you want to decommission this user?")) {
      await deleteDoc(doc(db, "users", uid));
    }
  };

  if (currentUserRole !== "admin") return null;

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="h-full flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-black tracking-tighter text-white">USER<span className="text-gradient underline">REGISTRY</span></h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Lifecycle Management Console</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <input 
               type="text" 
               placeholder="Search by email..."
               className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#fd1d1d] pr-10 min-w-[300px]"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all">
             <Filter size={14} /> Filter
           </button>
        </div>
      </div>

      <GlassCard className="flex-1 border-white/5 bg-white/[0.01] p-0 overflow-hidden flex flex-col">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/40">
           <div className="col-span-5">Identity</div>
           <div className="col-span-2">Current Role</div>
           <div className="col-span-2">Verification</div>
           <div className="col-span-3 text-right">Administrative Actions</div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredUsers.map((u, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              key={u.id}
              className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 last:border-0 items-center hover:bg-white/[0.02] transition-colors group"
            >
               <div className="col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs shadow-inner">
                    {u.email[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{u.email}</span>
               </div>
               
               <div className="col-span-2">
                  <select 
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="bg-transparent text-xs font-bold text-[#833ab4] uppercase tracking-tighter focus:outline-none cursor-pointer hover:underline"
                  >
                    <option value="client">Client</option>
                    <option value="editor">Editor</option>
                    <option value="sales">Sales</option>
                    <option value="admin">Admin</option>
                  </select>
               </div>

               <div className="col-span-2">
                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                    u.isApproved ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {u.isApproved ? "Verified" : "Gated"}
                  </span>
               </div>

               <div className="col-span-3 flex justify-end gap-2">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                    <UserCog size={14} />
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-black transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
