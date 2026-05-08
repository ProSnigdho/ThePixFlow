"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  DollarSign, 
  Search, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Calculator,
  MessageCircle,
  Send,
  Zap,
  TrendingUp,
  ShieldCheck,
  Globe,
  Plus,
  Briefcase,
  Layers,
  Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  updateDoc,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const BASE_RATE = 50;

export default function AdminInvoicesPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserForChat, setSelectedUserForChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all projects for global financial overview
    const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedUserForChat) return;
    const chatId = `payment_admin_${selectedUserForChat.uid}`;
    const q = query(collection(db, "paymentQueries", chatId, "messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });
    return () => unsubscribe();
  }, [selectedUserForChat]);

  const handleUpdatePrice = async (projectId: string, data: any) => {
    try {
      await updateDoc(doc(db, "projects", projectId), data);
      toast.success("Ledger Synchronized");
    } catch {
      toast.error("Sync Failed");
    }
  };

  const handlePublishInvoice = async (projectId: string) => {
    try {
      await updateDoc(doc(db, "projects", projectId), { isInvoiced: true, paymentStatus: "unpaid" });
      toast.success("Invoice Published");
    } catch {
      toast.error("Action Failed");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserForChat) return;
    const chatId = `payment_admin_${selectedUserForChat.uid}`;
    try {
      await addDoc(collection(db, "paymentQueries", chatId, "messages"), {
        text: newMessage,
        senderId: user?.uid,
        senderName: "Admin",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
    } catch {
      toast.error("Message failed");
    }
  };

  // Dynamic Calculations
  const totalRevenue = projects
    .filter(p => p.paymentStatus === "paid")
    .reduce((acc, curr) => acc + (curr.clientPrice || 0), 0);

  const outstandingReceivables = projects
    .filter(p => p.isInvoiced && p.paymentStatus !== "paid")
    .reduce((acc, curr) => acc + (curr.clientPrice || 0), 0);

  const editorLiability = projects
    .filter(p => (p.status === "completed" || p.status === "approved") && p.paymentStatus !== "paid")
    .reduce((acc, curr) => acc + (curr.editorPayout || 0), 0);

  const stats = [
    { 
      label: "Total Revenue", 
      val: `$${totalRevenue.toLocaleString()}`, 
      icon: <TrendingUp size={16} />, 
      color: "emerald",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]"
    },
    { 
      label: "Outstanding Receivables", 
      val: `$${outstandingReceivables.toLocaleString()}`, 
      icon: <Clock size={16} />, 
      color: "amber",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]"
    },
    { 
      label: "Editor Liability", 
      val: `$${editorLiability.toLocaleString()}`, 
      icon: <Activity size={16} />, 
      color: "blue",
      glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]"
    },
  ];

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden p-2">
      
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Financial <span className="text-emerald-500">Node</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Real-time Payout & Billing Transmission Control</p>
        </div>
      </div>

      {/* Dynamic Status Cards */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className={cn(
              "premium-glass p-6 rounded-[2rem] border border-white/5 relative group transition-all duration-500",
              stat.glow,
              stat.color === "emerald" ? "hover:border-emerald-500/30" : 
              stat.color === "amber" ? "hover:border-amber-500/30" : "hover:border-blue-500/30"
            )}
          >
            <div className={cn(
              "absolute top-6 right-6 w-8 h-8 rounded-xl flex items-center justify-center border border-white/5",
              stat.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : 
              stat.color === "amber" ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"
            )}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.val}</h3>
            <div className={cn(
              "mt-4 h-1 w-12 rounded-full",
              stat.color === "emerald" ? "bg-emerald-500" : 
              stat.color === "amber" ? "bg-amber-500" : "bg-blue-500"
            )} />
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[8.5fr_3.5fr] gap-6 overflow-hidden">
        
        {/* Ledger Table */}
        <div className="bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-white/2 flex items-center justify-between">
             <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
               <Calculator size={18} className="text-zinc-500" /> 
               Billing Command Center
             </h2>
             <div className="relative">
                <input className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[10px] text-white w-48 focus:outline-none" placeholder="Search entries..." />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-700" size={12} />
             </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
             <table className="w-full text-left border-separate border-spacing-0">
               <thead>
                 <tr className="bg-white/[0.02]">
                   <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Project Node</th>
                   <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Pricing ($)</th>
                   <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Payout ($)</th>
                   <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5">Status Node</th>
                   <th className="p-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 text-right">Execute</th>
                 </tr>
               </thead>
               <tbody>
                 {projects.filter(p => p.status === 'completed' || p.status === 'approved' || p.isInvoiced).map((project) => (
                   <tr key={project.id} className="group hover:bg-white/[0.01] transition-all">
                     <td className="p-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center">
                              <Zap size={14} className="text-[#1A8080]" />
                           </div>
                           <div className="min-w-0">
                              <p className="text-xs font-bold text-white uppercase truncate">{project.projectName}</p>
                              <p className="text-[9px] text-zinc-600 font-bold uppercase truncate">{project.clientName}</p>
                           </div>
                        </div>
                     </td>
                     <td className="p-6 border-b border-white/5">
                        <input 
                          type="number" 
                          value={project.clientPrice || ""}
                          onChange={(e) => handleUpdatePrice(project.id, { clientPrice: Number(e.target.value) })}
                          className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:border-emerald-500/50 outline-none" 
                        />
                     </td>
                     <td className="p-6 border-b border-white/5">
                        <input 
                          type="number" 
                          value={project.editorPayout || ""}
                          onChange={(e) => handleUpdatePrice(project.id, { editorPayout: Number(e.target.value) })}
                          className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:border-blue-500/50 outline-none" 
                        />
                     </td>
                     <td className="p-6 border-b border-white/5">
                        <select 
                          value={project.paymentStatus || "unpaid"}
                          onChange={(e) => handleUpdatePrice(project.id, { paymentStatus: e.target.value })}
                          className={cn(
                            "bg-zinc-900 border border-white/10 rounded-lg px-2 py-1.5 text-[9px] font-black uppercase focus:outline-none",
                            project.paymentStatus === "paid" ? "text-emerald-500" : project.paymentStatus === "processing" ? "text-amber-500" : "text-zinc-500"
                          )}
                        >
                          <option value="unpaid">Unpaid</option>
                          <option value="processing">Processing</option>
                          <option value="paid">Paid (Settled)</option>
                        </select>
                     </td>
                     <td className="p-6 border-b border-white/5 text-right">
                        {!project.isInvoiced ? (
                          <button 
                            onClick={() => handlePublishInvoice(project.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                          >
                            Publish
                          </button>
                        ) : (
                          <div className="flex items-center justify-end gap-2 text-zinc-600">
                             <CheckCircle2 size={14} className="text-emerald-500" />
                             <span className="text-[9px] font-bold uppercase tracking-widest">Invoiced</span>
                             <button 
                               onClick={() => setSelectedUserForChat({ uid: project.clientId, name: project.clientName })}
                               className="p-2 bg-white/5 hover:bg-white/10 rounded-lg"
                             >
                               <MessageCircle size={14} />
                             </button>
                          </div>
                        )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Compact Persistent Support Chat */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
           <div className="p-5 border-b border-white/5 bg-black/20 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                 <DollarSign size={16} className="text-amber-500" />
              </div>
              <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Payment Link</h3>
           </div>

           <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
              {selectedUserForChat ? (
                <>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center mb-4">
                     <p className="text-[8px] font-bold text-zinc-500 uppercase">Secure Link to</p>
                     <p className="text-[11px] font-black text-emerald-500 uppercase mt-0.5">{selectedUserForChat.name}</p>
                  </div>
                  {messages.map((msg) => (
                    <div key={msg.id} className={cn("flex flex-col gap-1", msg.senderId === user?.uid ? "items-end" : "items-start")}>
                       <div className={cn(
                         "p-3 rounded-2xl text-[11px] leading-relaxed max-w-[90%] shadow-lg backdrop-blur-md",
                         msg.senderId === user?.uid ? "bg-[#1A4848] text-white rounded-tr-none" : "bg-zinc-800/80 text-zinc-300 rounded-tl-none border border-white/5"
                       )}>
                         {msg.text}
                       </div>
                       <span className="text-[7px] text-zinc-700 uppercase font-bold">{msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: true }) : "sending"}</span>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-8">
                   <MessageCircle size={32} className="mb-4" />
                   <p className="text-[9px] font-black uppercase tracking-[0.2em]">Select a chat node to monitor transmission feed.</p>
                </div>
              )}
           </div>

           {selectedUserForChat && (
             <div className="p-4 bg-black/40 border-t border-white/5">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                   <input 
                     type="text" 
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder="Type secure transmission..."
                     className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-emerald-500/50"
                   />
                   <button type="submit" className="p-2 bg-emerald-600 rounded-lg text-white shadow-xl hover:scale-105 transition-transform"><Send size={14} /></button>
                </form>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
