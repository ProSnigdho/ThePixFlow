"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, Info, Megaphone, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export function NotificationCenter() {
  const { user, userData, role } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 1. Listen to Announcements
  useEffect(() => {
    if (!user?.uid) return;

    let isSubscribed = true;
    // Fetch announcements that are either global or match user's role
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!isSubscribed) return;
      
      const allAnnouncements = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Filter by role or global
      const filtered = allAnnouncements.filter((ann: any) => 
        !ann.targetRole || ann.targetRole === "all" || ann.targetRole === role
      );

      setAnnouncements(filtered);

      // Calculate unread
      const lastRead = userData?.lastReadAnnouncements?.toDate?.() || new Date(0);
      const unread = filtered.filter((ann: any) => {
        const createdAt = ann.createdAt?.toDate?.() || new Date();
        return createdAt > lastRead;
      }).length;
      
      setUnreadCount(unread);
    }, (error) => {
      if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
      console.error("NOTIFICATION_FETCH_ERROR:", error);
    });

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid, role, userData?.lastReadAnnouncements]);

  // 2. Mark as Read
  const markAsRead = async () => {
    if (!user || unreadCount === 0) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        lastReadAnnouncements: serverTimestamp()
      });
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark announcements as read:", error);
    }
  };

  const toggleOpen = () => {
    if (!isOpen) {
      markAsRead();
    }
    setIsOpen(!isOpen);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={popoverRef}>
      <button 
        onClick={toggleOpen}
        className={cn(
          "relative p-2 rounded-full transition-all duration-300 group",
          isOpen ? "bg-[#1A4848] text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        )}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0A0A0A] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 sm:w-96 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-[#1A4848]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1A4848]/40 rounded-xl text-[#1A8080]">
                  <Megaphone size={16} />
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Global Broadcasts</h3>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">System-wide Announcements</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto no-scrollbar p-4 space-y-3">
              {announcements.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-20">
                  <Info size={32} className="mb-3" />
                  <p className="text-xs font-bold uppercase tracking-widest">No announcements</p>
                </div>
              ) : (
                announcements.map((ann) => (
                  <div 
                    key={ann.id}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-[12px] font-bold text-white tracking-tight">{ann.title}</h4>
                      <span className="text-[8px] text-zinc-600 font-bold uppercase">
                        {ann.createdAt ? formatDistanceToNow(ann.createdAt.toDate(), { addSuffix: true }) : "just now"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                      {ann.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter",
                        ann.priority === "high" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {ann.priority || "Normal"}
                      </span>
                      {ann.actionLink && (
                        <a 
                          href={ann.actionLink}
                          className="text-[8px] font-black text-[#1A8080] uppercase tracking-widest hover:underline"
                        >
                          View Details →
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/5 bg-black/40 flex items-center justify-between">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">End of Broadcast Feed</p>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-[#1A8080] uppercase">
                <Calendar size={10} />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
