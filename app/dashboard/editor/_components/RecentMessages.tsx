"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, ArrowUpRight, Shield } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { collection, query, orderBy, limit, onSnapshot, doc } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

export function RecentMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    let isMounted = true;
    const convId = `admin_${user.uid}`;
    const q = query(
      collection(db, "conversations", convId, "messages"),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!isMounted) return;
        const msgs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                sender: data.senderName || "System",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.senderId || 'admin'}`,
                text: data.text || "",
                time: data.createdAt ? formatDistanceToNow(data.createdAt.toDate(), { addSuffix: true }) : "just now",
                unread: data.status !== "seen" && data.senderId !== user.uid ? 1 : 0
            };
        });
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        if (isMounted) {
            console.error("RECENT_MESSAGES_SYNC_ERROR:", error);
            setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user?.uid]);

  return (
    <div className="premium-glass p-6 border-white/5 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-lg font-bold text-white">Recent Messages</h3>
        <Link 
          href="/dashboard/messages" 
          className="text-[#1A8080] hover:text-white text-xs font-bold flex items-center gap-1 transition-colors group"
        >
          View All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
        {loading ? (
            [1, 2].map(i => (
                <div key={i} className="h-16 w-full bg-white/5 rounded-xl animate-pulse" />
            ))
        ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-20 py-10">
                <div className="p-4 rounded-2xl bg-[#1A4848]/10 border border-[#1A4848]/20">
                    <Shield size={32} className="text-[#1A8080]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Secure link established</p>
            </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden shrink-0 bg-zinc-900">
                <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-[11px] font-black text-white uppercase tracking-tight truncate">{msg.sender}</h4>
                  <span className="text-[9px] text-zinc-600 whitespace-nowrap">{msg.time}</span>
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5 font-medium">{msg.text}</p>
              </div>
              {msg.unread > 0 && (
                <span className="w-2 h-2 bg-[#1A8080] rounded-full shadow-[0_0_10px_rgba(26,128,128,0.5)] animate-pulse" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
