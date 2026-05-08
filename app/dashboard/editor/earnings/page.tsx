"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  MessageCircle, 
  Send,
  Zap,
  History,
  Briefcase,
  ArrowUpRight,
  ShieldCheck,
  DollarSign,
  Clock,
  X,
  Layers,
  Activity,
  Video
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function EditorEarningsPage() {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState<any[]>([]);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Projects & Earnings
  useEffect(() => {
    if (!user?.uid) return;

    let isSubscribed = true;
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        if (!isSubscribed) return;
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProjects(data);
        setEarnings(data.filter((p: any) => p.isInvoiced));
      },
      (error) => {
        if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
        console.error("PROJECTS_FETCH_ERROR:", error);
      }
    );

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  // 2. Persistent Payment Chat
  useEffect(() => {
    if (!user?.uid) return;

    let isSubscribed = true;
    const chatId = `payment_admin_${user.uid}`;
    const q = query(collection(db, "paymentQueries", chatId, "messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q, 
      (snapshot) => {
        if (!isSubscribed) return;
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setTimeout(() => {
          if (isSubscribed) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
      (error) => {
        if (error.message.includes('INTERNAL ASSERTION FAILED')) return;
        console.error("PAYMENT_CHAT_ERROR:", error);
      }
    );

    return () => {
      isSubscribed = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [user?.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const chatId = `payment_admin_${user.uid}`;
    try {
      await addDoc(collection(db, "paymentQueries", chatId, "messages"), {
        text: newMessage,
        senderId: user.uid,
        senderName: user.displayName || "Editor",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch {
      toast.error("Message failed");
    }
  };

  // Dynamic Calculations
  const clearedBalance = earnings
    .filter(p => p.paymentStatus === "paid")
    .reduce((acc, curr) => acc + (curr.editorPayout || 0), 0);

  const pendingPayout = earnings
    .filter(p => (p.status === "completed" || p.status === "approved") && p.paymentStatus !== "paid")
    .reduce((acc, curr) => acc + (curr.editorPayout || 0), 0);

  const activeWorkload = allProjects.filter(p => p.status !== "completed" && p.status !== "approved").length;

  const stats = [
    { 
      label: "Cleared Balance", 
      val: `$${clearedBalance.toLocaleString()}`, 
      icon: <CheckCircle2 size={16} />, 
      color: "emerald",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    },
    { 
      label: "Pending Payout", 
      val: `$${pendingPayout.toLocaleString()}`, 
      icon: <Clock size={16} />, 
      color: "amber",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]"
    },
    { 
      label: "Active Workload", 
      val: `${activeWorkload} Nodes`, 
      icon: <Video size={16} />, 
      color: "blue",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]"
    },
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden p-2 relative">
      
      {/* Dynamic Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={cn(
              "premium-glass p-6 rounded-[2rem] border border-white/5 relative group transition-all duration-500",
              stat.glow,
              "hover:border-[#1A4848]/50"
            )}
          >
            <div className={cn(
              "absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center border border-white/5 bg-[#1A4848]/10 text-[#1A8080]"
            )}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.val}</h3>
            <div className={cn(
              "mt-4 h-1 w-12 rounded-full bg-[#1A4848]"
            )} />
          </div>
        ))}
      </div>

      {/* Main Ledger */}
      <div className="flex-1 min-h-0 bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <Briefcase size={18} className="text-zinc-500" />
              <h2 className="text-sm font-black text-white uppercase tracking-widest">Settlement History</h2>
           </div>
           <button className="px-6 py-2 bg-[#1A4848] hover:bg-[#1A4848]/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
              Request Payout <ArrowUpRight size={14} />
           </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Project Identifier</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Production Rate</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Settlement Node</th>
                <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 text-right">Confirmation</th>
              </tr>
            </thead>
            <tbody>
              {earnings.map((earn) => (
                <tr key={earn.id} className="group hover:bg-white/[0.01] transition-all">
                  <td className="p-6 border-b border-white/5">
                     <p className="text-xs font-bold text-white uppercase tracking-tight">{earn.projectName}</p>
                     <p className="text-[9px] text-zinc-700 font-bold uppercase mt-0.5">#{earn.id.slice(0, 8).toUpperCase()}</p>
                  </td>
                  <td className="p-6 border-b border-white/5">
                     <p className="text-sm font-black text-white">${earn.editorPayout.toLocaleString()}</p>
                     <p className="text-[8px] text-zinc-700 font-bold uppercase mt-0.5">Asset Deployment Rate</p>
                  </td>
                  <td className="p-6 border-b border-white/5">
                     <div className={cn(
                       "px-3 py-1 rounded-full text-[8px] font-black uppercase inline-block border",
                       earn.paymentStatus === "paid" ? "bg-[#1A4848]/20 border-[#1A4848]/30 text-[#1A8080] shadow-[0_0_15px_rgba(26,72,72,0.15)]" : 
                       "bg-amber-500/10 border-amber-500/20 text-amber-500"
                     )}>
                        {earn.paymentStatus || "Pending"}
                     </div>
                  </td>
                  <td className="p-6 border-b border-white/5 text-right">
                     {earn.paymentStatus === "paid" ? (
                       <div className="flex items-center justify-end gap-2 text-[#1A8080]">
                          <CheckCircle2 size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Cleared</span>
                       </div>
                     ) : (
                       <div className="flex items-center justify-end gap-2 text-zinc-700">
                          <Clock size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Verification</span>
                       </div>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-50">
         <button 
           onClick={() => setIsChatOpen(!isChatOpen)}
           className={cn(
             "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
             isChatOpen ? "bg-zinc-800 rotate-90" : "bg-[#1A4848] hover:scale-110"
           )}
         >
            {isChatOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
         </button>

         <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-20 right-0 w-80 bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              >
                 <div className="p-5 bg-black/40 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1A4848]/10 flex items-center justify-center border border-[#1A4848]/20">
                       <DollarSign size={16} className="text-[#1A8080]" />
                    </div>
                    <div>
                       <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Earnings Support</h3>
                       <p className="text-[8px] font-bold text-zinc-600 uppercase">Secure Link to Admin</p>
                    </div>
                 </div>

                 <div className="h-64 overflow-y-auto no-scrollbar p-5 space-y-4 bg-black/20">
                    {messages.map((msg) => (
                      <div key={msg.id} className={cn("flex flex-col gap-1", msg.senderId === user?.uid ? "items-end" : "items-start")}>
                         <div className={cn(
                           "p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%] shadow-lg backdrop-blur-md",
                           msg.senderId === user?.uid ? "bg-[#1A4848]/20 text-white rounded-tr-none border border-[#1A4848]/20" : "bg-zinc-800/80 text-zinc-300 rounded-tl-none border border-white/5"
                         )}>
                           {msg.text}
                         </div>
                         <span className="text-[7px] text-zinc-700 uppercase font-bold">{msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : "just now"}</span>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                 </div>

                 <div className="p-4 bg-black/60 border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                       <input 
                         type="text" 
                         value={newMessage}
                         onChange={(e) => setNewMessage(e.target.value)}
                         placeholder="Type secure msg..."
                         className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-[#1A4848]/50"
                       />
                       <button type="submit" className="p-2 bg-[#1A4848] rounded-lg text-white shadow-xl"><Send size={14} /></button>
                    </form>
                 </div>
              </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
