"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RevisionQueue() {
  const { user } = useAuth();
  const [revisions, setRevisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    let isSubscribed = true;
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      where("status", "==", "Review Requested"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        if (!isSubscribed) return;
        setRevisions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
        console.error("REVISION_QUEUE_ERROR:", error);
        setLoading(false);
      }
    );

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  if (revisions.length === 0) return null;

  return (
    <div className="premium-glass p-6 h-full border-[#fd1d1d]/10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#fd1d1d]">
          <ShieldAlert size={20} />
          <h3 className="text-lg font-bold">Priority Revisions</h3>
        </div>
        <span className="text-[10px] font-bold text-[#fd1d1d] uppercase bg-[#fd1d1d]/10 px-2 py-1 rounded">Action Required</span>
      </div>
      <div className="space-y-3">
        {revisions.map(rev => (
          <div key={rev.id} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#fd1d1d]/30 transition-all">
            <div className="min-w-0">
               <p className="text-sm font-bold text-white truncate">{rev.projectName}</p>
               <p className="text-[10px] text-zinc-500">Client is waiting for changes</p>
            </div>
            <Link href={`/dashboard/editor/revisions/${rev.id}`}>
               <button className="p-2 bg-[#fd1d1d]/10 text-[#fd1d1d] rounded-lg hover:bg-[#fd1d1d]/20 transition-all">
                  <ArrowRight size={16} />
               </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
