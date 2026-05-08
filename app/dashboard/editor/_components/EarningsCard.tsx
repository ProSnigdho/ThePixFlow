"use client";

import React, { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { startOfMonth, isAfter } from "date-fns";

export function EarningsCard() {
  const { user } = useAuth();
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    
    let isMounted = true;
    const q = query(
      collection(db, "projects"), 
      where("editorId", "==", user.uid), 
      where("status", "in", ["Completed", "completed"])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!isMounted) return;
        
        const now = new Date();
        const monthStart = startOfMonth(now);
        
        let total = 0;
        let month = 0;

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const amount = data.editorEarnings || data.editorPayout || 0;
            total += amount;

            // Check if project was completed this month
            if (data.completedAt) {
                const completedDate = data.completedAt.toDate();
                if (isAfter(completedDate, monthStart)) {
                    month += amount;
                }
            }
        });

        setTotalEarnings(total);
        setMonthEarnings(month);
        setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user?.uid]);

  return (
    <div className="premium-glass p-6 border-white/5 relative overflow-hidden group hover:border-[#1A4848]/50 transition-all duration-500 h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A4848]/5 blur-3xl rounded-full -mr-8 -mt-8 group-hover:bg-[#1A4848]/10 transition-all" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="p-3 rounded-2xl bg-[#1A4848] shadow-lg shadow-[#1A4848]/20">
          <DollarSign size={22} className="text-white" />
        </div>
        <div className="text-right">
           <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] block">Monthly Yield</span>
           <span className="text-[#1A8080] text-xs font-black tracking-tight mt-1">+${monthEarnings.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-1 relative z-10 mt-6">
        {loading ? (
            <div className="h-10 w-24 bg-white/5 animate-pulse rounded-lg" />
        ) : (
            <h3 className="text-4xl font-black text-white tracking-tighter">${totalEarnings.toLocaleString()}</h3>
        )}
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest opacity-60">Total Revenue Balance</p>
      </div>
    </div>
  );
}
