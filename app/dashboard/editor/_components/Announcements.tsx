"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, ChevronRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/firebase/config";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(5));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!isMounted) return;
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(list);
      setLoading(false);
    }, (error) => {
      console.error("ANNOUNCEMENT_SYNC_ERROR:", error);
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Fallback if no announcements exist in DB yet
  const displayAnnouncements = announcements.length > 0 ? announcements : [
    {
      id: "default-1",
      title: "Welcome to the new Editor Command Center.",
      createdAt: { toDate: () => new Date() },
    }
  ];

  const current = displayAnnouncements[activeSlide] || displayAnnouncements[0];

  return (
    <div className="premium-glass p-6 border-white/5 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Announcements</h3>
        <Link href="/dashboard/announcements" className="text-zinc-500 hover:text-white text-xs transition-colors">
          View All
        </Link>
      </div>

      <div className="bg-[#1A4848]/10 rounded-2xl p-5 border border-[#1A4848]/20 relative overflow-hidden group hover:border-[#1A4848]/40 transition-all min-h-[140px] flex flex-col justify-between">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-[#1A4848]/20 text-[#1A8080] shrink-0">
            <Megaphone size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white leading-tight">
              {current?.title}
            </h4>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">
              {current?.createdAt?.toDate ? formatDistanceToNow(current.createdAt.toDate(), { addSuffix: true }) : "Recent"}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6">
           {displayAnnouncements.map((_, i) => (
             <button 
               key={i} 
               onClick={() => setActiveSlide(i)}
               className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? "w-4 bg-[#1A8080]" : "w-1.5 bg-zinc-800 hover:bg-zinc-700"}`}
             />
           ))}
        </div>
      </div>
    </div>
  );
}
