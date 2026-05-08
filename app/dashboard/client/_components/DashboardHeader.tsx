"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { NotificationCenter } from "@/components/NotificationCenter";

export function DashboardHeader() {
  const { userData, user, role } = useAuth();

  const displayName = userData?.displayName || user?.displayName || "User";
  const firstName = displayName.split(" ")[0];
  const photoURL = userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Alex'}`;

  return (
    <header className="flex items-center justify-between py-2">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          Hey, {firstName} <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1">Manage your projects, track progress and get stunning videos.</p>
      </div>

      <div className="flex items-center gap-6">
        <NotificationCenter />

        <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-black">{role || "Client"}</p>
          </div>
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center overflow-hidden">
               <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <ChevronDown size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
