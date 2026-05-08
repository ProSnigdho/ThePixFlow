"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Plus,
  Check,
  CheckCheck,
  User,
  Zap,
  Shield,
  MoreVertical,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  doc, 
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  createdAt: any;
  status: "sent" | "seen";
}

interface Conversation {
  id: string;
  participants: string[];
  otherUserId: string;
  otherUserName: string;
  otherUserRole: string;
  otherUserPhoto: string;
  lastMessage: string;
  lastMessageAt: any;
  lastMessageSenderId: string;
  type: "client_chat" | "editor_chat";
}

export default function GlobalMessagesPage() {
  const { user, role, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState<"client" | "editor">("client");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isAdmin = role === "admin";
  
  // Strict Anonymity for Clients/Editors
  const supportName = "PixFlow Support";
  const supportRole = role === "client" ? "Studio Manager" : "Production Lead";

  // 1. Fetch Conversations (Admin)
  useEffect(() => {
    if (authLoading || !user || !isAdmin) return;

    let isMounted = true;
    const q = query(
      collection(db, "conversations"),
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!isMounted) return;
        const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
        setConversations(convs);
        setLoading(false);
      },
      (error) => {
        if (isMounted) {
          console.error("ADMIN_CONV_SYNC_ERROR:", error);
          toast.error("Failed to sync conversations");
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user, isAdmin, authLoading]);

  // 2. Setup/Fetch Support Chat (Client/Editor)
  useEffect(() => {
    if (authLoading || !user || isAdmin) return;

    let isMounted = true;
    const convId = `admin_${user.uid}`;
    const convRef = doc(db, "conversations", convId);

    const unsubscribe = onSnapshot(convRef, 
      (docSnap) => {
        if (!isMounted) return;
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Conversation;
          setSelectedConv(data);
        } else {
          // Initialize support node
          setDoc(convRef, {
            participants: ["admin", user.uid],
            otherUserId: user.uid,
            otherUserName: user.displayName || "User",
            otherUserRole: role,
            otherUserPhoto: user.photoURL || "",
            lastMessage: "Secure link established. How can we help today?",
            lastMessageAt: serverTimestamp(),
            lastMessageSenderId: "admin",
            type: role === "client" ? "client_chat" : "editor_chat"
          }).catch(err => console.error("INIT_CONV_FAIL:", err));
        }
        setLoading(false);
      },
      (error) => {
        if (isMounted) {
          console.error("CLIENT_CONV_SYNC_ERROR:", error);
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [user, isAdmin, role, authLoading]);

  // 3. Sync Messages
  useEffect(() => {
    if (!selectedConv?.id) {
      setMessages([]);
      return;
    }

    let isMounted = true;
    const q = query(
      collection(db, "conversations", selectedConv.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!isMounted) return;
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
        setMessages(msgs);
        
        // Auto-scroll
        setTimeout(() => {
          if (isMounted) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);

        // Mark as seen
        const lastMsg = msgs[msgs.length - 1];
        if (lastMsg && lastMsg.senderId !== user?.uid && lastMsg.status !== "seen") {
          updateDoc(doc(db, "conversations", selectedConv.id, "messages", lastMsg.id), {
            status: "seen"
          }).catch(() => {});
        }
      },
      (error) => {
        if (isMounted) console.error("MSG_SYNC_ERROR:", error);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [selectedConv?.id, user?.uid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConv || !user) return;

    const text = newMessage;
    setNewMessage("");

    const msgData = {
      text,
      senderId: user.uid,
      senderName: isAdmin ? "Admin" : (user.displayName || "User"),
      createdAt: serverTimestamp(),
      status: "sent"
    };

    try {
      await addDoc(collection(db, "conversations", selectedConv.id, "messages"), msgData);
      await updateDoc(doc(db, "conversations", selectedConv.id), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
        lastMessageSenderId: user.uid
      });
    } catch (err) {
      toast.error("Transmission failed");
      setNewMessage(text); // Restore text on failure
    }
  };

  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-[#1A4848] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(26,72,72,0.3)]" />
      </div>
    );
  }

  const filteredConversations = conversations.filter(c => 
    adminTab === "client" ? c.type === "client_chat" : c.type === "editor_chat"
  );

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex-1 min-h-0 grid grid-cols-[300px_1fr] gap-6 overflow-hidden">
        
        {/* SIDEBAR: Contacts / Support Node */}
        <aside className="flex flex-col gap-4 min-h-0">
          {isAdmin ? (
            <>
              <div className="flex gap-2 p-1.5 bg-zinc-900/50 rounded-2xl border border-white/5">
                <button onClick={() => setAdminTab("client")} className={cn("flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", adminTab === "client" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400")}>
                  <User size={14} className="inline mr-2" /> Clients
                </button>
                <button onClick={() => setAdminTab("editor")} className={cn("flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", adminTab === "editor" ? "bg-purple-600 text-white shadow-lg" : "text-zinc-600 hover:text-zinc-400")}>
                  <Zap size={14} className="inline mr-2" /> Editors
                </button>
              </div>

              <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col">
                 <div className="p-4 border-b border-white/5">
                    <div className="relative">
                      <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none" placeholder="Search nodes..." />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700" size={12} />
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto no-scrollbar">
                    {filteredConversations.map((conv) => (
                      <div 
                        key={conv.id} 
                        onClick={() => setSelectedConv(conv)}
                        className={cn(
                          "p-4 flex items-center gap-3 cursor-pointer transition-all border-l-2",
                          selectedConv?.id === conv.id 
                            ? (adminTab === "client" ? "bg-blue-500/5 border-blue-500" : "bg-purple-500/5 border-purple-500") 
                            : "border-transparent hover:bg-white/[0.02]"
                        )}
                      >
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={conv.otherUserPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUserId}`} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-white uppercase truncate tracking-tight">{conv.otherUserName}</p>
                          <p className="text-[9px] text-zinc-500 truncate italic mt-0.5">{conv.lastMessage}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 bg-zinc-900/40 border border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center gap-4">
               <div className="w-16 h-16 rounded-[1.5rem] bg-[#1A4848]/10 border border-[#1A4848]/30 flex items-center justify-center shadow-2xl">
                  <Shield size={32} className="text-[#1A8080]" />
               </div>
               <div>
                 <h3 className="text-sm font-black text-white uppercase tracking-widest">{supportName}</h3>
                 <p className="text-[10px] font-bold text-zinc-600 uppercase mt-1 tracking-tighter">Support Operations Node</p>
               </div>
               <div className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Connection Status</p>
                  <p className="text-[10px] font-bold text-green-500 uppercase mt-0.5 animate-pulse">Encrypted & Ready</p>
               </div>
            </div>
          )}
        </aside>

        {/* MAIN CHAT WINDOW */}
        <main className="flex-1 bg-zinc-950/20 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative">
          <AnimatePresence mode="wait">
            {selectedConv ? (
              <motion.div key={selectedConv.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col overflow-hidden">
                
                {/* Chat Header */}
                <div className="p-6 bg-black/40 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner", isAdmin ? (adminTab === "client" ? "bg-blue-500/10" : "bg-purple-500/10") : "bg-[#1A8080]/10")}>
                      <MessageSquare size={24} className={cn(isAdmin ? (adminTab === "client" ? "text-blue-500" : "text-purple-500") : "text-[#1A8080]")} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-widest">
                        {isAdmin ? selectedConv.otherUserName : supportName}
                      </h3>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
                        {isAdmin ? selectedConv.otherUserRole : supportRole} • <span className="text-green-500 animate-pulse">Connection Active</span>
                      </p>
                    </div>
                  </div>
                  <button className="p-3 text-zinc-600 hover:text-white transition-all"><MoreVertical size={20} /></button>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                  {messages.map((msg, idx) => {
                    const isMine = msg.senderId === user?.uid;
                    return (
                      <div key={msg.id} className={cn("flex flex-col gap-1.5 max-w-[75%]", isMine ? "ml-auto items-end" : "mr-auto items-start")}>
                         <div className={cn(
                           "p-4 rounded-[1.5rem] text-[13px] leading-relaxed backdrop-blur-xl transition-all shadow-2xl border",
                           isMine 
                            ? "bg-[#1A4848] text-white rounded-tr-none border-white/10" 
                            : "bg-zinc-800/40 text-zinc-200 rounded-tl-none border-white/5"
                         )}>
                           {msg.text}
                           <div className={cn("mt-2 flex items-center gap-2 opacity-40", isMine ? "justify-end" : "justify-start")}>
                              <span className="text-[8px] font-bold uppercase">
                                {msg.createdAt ? formatDistanceToNow(msg.createdAt.toDate(), { addSuffix: false }) : "sending"}
                              </span>
                              {isMine && (msg.status === "seen" ? <CheckCheck size={10} className="text-blue-400" /> : <Check size={10} />)}
                           </div>
                         </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-6 bg-black border-t border-white/5">
                   <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                      <button type="button" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all">
                        <Plus size={20} />
                      </button>
                      <div className="flex-1 relative">
                         <input 
                           type="text" 
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           placeholder="Type secure transmission..."
                           className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm text-white focus:outline-none focus:border-[#1A8080]/50 transition-all shadow-inner"
                         />
                         <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A8080] hover:scale-110 transition-transform">
                            <Send size={20} />
                         </button>
                      </div>
                   </form>
                </div>

              </motion.div>
            ) : !isAdmin && loading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                 <div className="w-12 h-12 border-4 border-[#1A4848] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(26,72,72,0.3)]" />
                 <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-4 animate-pulse">Establishing Secure Link...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20">
                 <div className="p-10 rounded-[3rem] border border-dashed border-zinc-700 mb-6">
                    <MessageSquare size={64} className="text-zinc-600" />
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-tighter text-white">Initialize Link</h2>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-2 max-w-[240px]">Select a secure node to begin encrypted transmission.</p>
              </div>
            )}
          </AnimatePresence>
        </main>

      </div>
    </div>
  );
}
