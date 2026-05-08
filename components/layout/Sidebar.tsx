"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  Briefcase,
  Calendar,
  CalendarIcon,
  Target,
  Zap,
  Plus,
  History,
  Home,
  FolderOpen,
  FilePlus,
  RotateCcw,
  FileText,
  UserCircle,
  Cog,
  ArrowUpRight,
  Palette,
  CheckCircle2,
  DollarSign,
  Clock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  role: Role;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  group?: string;
}

function EditorSidebar() {
  const pathname = usePathname();
  const { signOut, user, userData, role } = useAuth();
  const [reviewCount, setReviewCount] = useState(0);
  const [messageUnread, setMessageUnread] = useState(0);

  // 1. Listen for Review Projects
  useEffect(() => {
    if (!user?.uid || role !== "editor") return;
    const q = query(
      collection(db, "projects"),
      where("editorId", "==", user.uid),
      where("status", "in", ["Review Requested", "Awaiting Review", "Review"])
    );
    return onSnapshot(q, (snap) => setReviewCount(snap.docs.length));
  }, [user?.uid, role]);

  // 2. Listen for Unread Messages (Support Chat)
  useEffect(() => {
    if (!user?.uid || role !== "editor") return;
    const convId = `admin_${user.uid}`;
    const q = query(
      collection(db, "conversations", convId, "messages"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    return onSnapshot(q, (snap) => {
      const lastMsg = snap.docs[0]?.data();
      if (lastMsg && lastMsg.senderId !== user.uid && lastMsg.status !== "seen") {
        setMessageUnread(1); // Simplification: 1 if latest is unread
      } else {
        setMessageUnread(0);
      }
    });
  }, [user?.uid, role]);

  const mainNav = [
    { title: "Dashboard", href: "/dashboard/editor", icon: <Home size={20} /> },
    { title: "Projects", href: "/dashboard/editor/projects", icon: <Briefcase size={20} /> },
    { title: "Reviews", href: "/dashboard/editor/revisions", icon: <RotateCcw size={20} />, badge: reviewCount > 0 ? reviewCount : undefined },
    { title: "Assets", href: "/dashboard/editor/assets", icon: <FolderOpen size={20} /> },
    { title: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={20} />, badge: messageUnread > 0 ? messageUnread : undefined },
    { title: "Invoices", href: "/dashboard/editor/earnings", icon: <FileText size={20} /> },
  ];

  const accountNav = [
    {
      title: "Profile",
      href: "/dashboard/editor/profile",
      icon: <UserCircle size={20} />,
    },
  ];

  const NavLink = ({ item }: { item: any }) => {
    const isActive = item.href === "/dashboard/editor" 
      ? pathname === "/dashboard/editor"
      : pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);

    return (
      <Link href={item.href}>
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer group",
            isActive
              ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]"
              : "text-zinc-400 hover:text-white hover:bg-white/5",
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "transition-colors shrink-0",
                isActive ? "text-white" : "text-zinc-500 group-hover:text-white",
              )}
            >
              {item.icon}
            </span>
            <span className="text-sm font-semibold tracking-wide">
              {item.title}
            </span>
          </div>
          {item.badge && (
            <span className="flex items-center justify-center w-5 h-5 bg-[#1A8080] text-white text-[10px] font-bold rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div
      className="h-full flex flex-col bg-[#0B0E14] border-r border-white/5 overflow-hidden"
      style={{ width: 260 }}
    >
      {/* Logo Section (Cloned from Image) */}
      <div className="px-8 pt-10 pb-8 shrink-0">
        <div className="flex items-baseline gap-0">
          <span className="text-[26px] font-medium tracking-tight text-white leading-none">
            The
          </span>
          <span className="text-[26px] font-black tracking-tight text-white leading-none">
            PixFlow
          </span>
        </div>
        <p className="text-[9px] font-black text-[#1A8080] uppercase tracking-[0.25em] mt-1.5 opacity-80">
          Video Editing Agency
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {/* Section Header: EDITOR PORTAL */}
        <div className="pt-2 pb-2 px-4">
          <span className="text-[10px] font-black text-[#1A8080] uppercase tracking-[0.2em]">
            Editor Portal
          </span>
        </div>
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Section Header: ACCOUNT */}
        <div className="pt-8 pb-2 px-4">
          <span className="text-[10px] font-black text-[#1A8080] uppercase tracking-[0.2em]">
            Account
          </span>
        </div>
        {accountNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Footer Help Card (Cloned from Image) */}
      <div className="px-4 pb-4 shrink-0">
        <div
          className="rounded-3xl p-6 relative overflow-hidden bg-[#1A4848]/20 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-3">
             <div className="p-2 bg-[#1A4848]/40 rounded-xl text-white">
                <Users size={18} />
             </div>
             <h4 className="text-sm font-bold text-white tracking-tight">
                Need help?
             </h4>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-5">
            Our team is here to help<br />you 24/7
          </p>
          <a 
            href="https://wa.me/8801795917539" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full py-3 bg-[#1A4848] hover:bg-[#1A8080] rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#1A4848]/20 group"
          >
            Contact Support 
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Identity (Cloned from Sidebar Profile Section) */}
      <div className="px-4 py-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 px-2">
           <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shrink-0 shadow-lg">
              <img 
                src={userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
           </div>
           <div className="min-w-0">
              <p className="text-[13px] font-bold text-white truncate">{userData?.displayName || user?.displayName || "Member"}</p>
              <div className="flex items-center gap-1.5">
                <p className="text-[9px] font-black text-[#1A8080] uppercase tracking-widest">{role || "Editor"}</p>
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
              </div>
           </div>
        </div>
        <button 
          onClick={signOut}
          className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

// ─── Marketing Sidebar ─────────────────────────────────────────────────────
function MarketingSidebar() {
  const pathname = usePathname();
  const { signOut, user, userData, role } = useAuth();
  const [coldLeads, setColdLeads] = useState(0);
  const [messageUnread, setMessageUnread] = useState(0);

  // Dynamic badge: cold leads count
  useEffect(() => {
    if (!user?.uid) return;
    const q = query(
      collection(db, "leads"),
      where("status", "in", ["Cold", "New"])
    );
    return onSnapshot(q, (snap) => setColdLeads(snap.docs.length));
  }, [user?.uid]);

  // Dynamic badge: unread message from support
  useEffect(() => {
    if (!user?.uid) return;
    const convId = `admin_${user.uid}`;
    const q = query(
      collection(db, "conversations", convId, "messages"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    return onSnapshot(q, (snap) => {
      const lastMsg = snap.docs[0]?.data();
      setMessageUnread(lastMsg && lastMsg.senderId !== user.uid && lastMsg.status !== "seen" ? 1 : 0);
    });
  }, [user?.uid]);

  const mainNav = [
    { title: "Growth Hub", href: "/dashboard/marketing", icon: <LayoutDashboard size={20} /> },
    { title: "Lead CRM", href: "/dashboard/marketing/leads", icon: <Users size={20} />, badge: coldLeads > 0 ? coldLeads : undefined },
    { title: "Outreach", href: "/dashboard/marketing/outreach", icon: <MessageSquare size={20} /> },
    { title: "Content Planner", href: "/dashboard/marketing/planner", icon: <Calendar size={20} /> },
    { title: "Competitor Intel", href: "/dashboard/marketing/competitors", icon: <Target size={20} /> },
    { title: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={20} />, badge: messageUnread > 0 ? messageUnread : undefined },
  ];

  const accountNav = [
    { title: "Profile", href: "/dashboard/marketing/profile", icon: <UserCircle size={20} /> },
  ];

  const NavLink = ({ item }: { item: any }) => {
    const isActive = item.href === "/dashboard/marketing"
      ? pathname === "/dashboard/marketing"
      : pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);

    return (
      <Link href={item.href}>
        <div
          className={cn(
            "flex items-center justify-between px-4 py-3 rounded-xl transition-all cursor-pointer group",
            isActive
              ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]"
              : "text-zinc-400 hover:text-white hover:bg-white/5",
          )}
        >
          <div className="flex items-center gap-4">
            <span className={cn("transition-colors shrink-0", isActive ? "text-white" : "text-zinc-500 group-hover:text-white")}>
              {item.icon}
            </span>
            <span className="text-sm font-semibold tracking-wide">{item.title}</span>
          </div>
          {item.badge && (
            <span className="flex items-center justify-center w-5 h-5 bg-[#1A8080] text-white text-[10px] font-bold rounded-full">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0B0E14] border-r border-white/5 overflow-hidden" style={{ width: 260 }}>
      {/* Logo */}
      <div className="px-8 pt-10 pb-8 shrink-0">
        <div className="flex items-baseline gap-0">
          <span className="text-[26px] font-medium tracking-tight text-white leading-none">The</span>
          <span className="text-[26px] font-black tracking-tight text-white leading-none">PixFlow</span>
        </div>
        <p className="text-[9px] font-black text-[#1A8080] uppercase tracking-[0.25em] mt-1.5 opacity-80">
          Growth Division
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        <div className="pt-2 pb-2 px-4">
          <span className="text-[10px] font-black text-[#1A8080] uppercase tracking-[0.2em]">Marketing Portal</span>
        </div>
        {mainNav.map((item) => (<NavLink key={item.href} item={item} />))}

        <div className="pt-8 pb-2 px-4">
          <span className="text-[10px] font-black text-[#1A8080] uppercase tracking-[0.2em]">Account</span>
        </div>
        {accountNav.map((item) => (<NavLink key={item.href} item={item} />))}
      </nav>

      {/* Help Card */}
      <div className="px-4 pb-4 shrink-0">
        <div className="rounded-3xl p-6 relative overflow-hidden bg-[#1A4848]/20 border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#1A4848]/40 rounded-xl text-white"><Users size={18} /></div>
            <h4 className="text-sm font-bold text-white tracking-tight">Growth Support</h4>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mb-5">
            Strategy & analytics<br />support 24/7
          </p>
          <a
            href="https://wa.me/8801795917539"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-[#1A4848] hover:bg-[#1A8080] rounded-xl text-[10px] font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#1A4848]/20 group"
          >
            Contact Team <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Identity */}
      <div className="px-4 py-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shrink-0 shadow-lg">
            <img src={userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white truncate">{userData?.displayName || user?.displayName || "Member"}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[9px] font-black text-[#1A8080] uppercase tracking-widest">{role || "Marketing"}</p>
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
        </div>
        <button onClick={signOut} className="p-2 text-zinc-600 hover:text-red-500 transition-colors" title="Sign Out">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

function ClientSidebar() {
  const pathname = usePathname();
  const { signOut, user, userData, role } = useAuth();

  const mainNav: NavItem[] = [
    { title: "Dashboard", href: "/dashboard/client", icon: <Home size={20} /> },
    {
      title: "Projects",
      href: "/dashboard/client/projects",
      icon: <FolderOpen size={20} />,
    },
    {
      title: "Requests",
      href: "/dashboard/client/requests",
      icon: <FilePlus size={20} />,
    },
    {
      title: "Revisions",
      href: "/dashboard/client/revisions",
      icon: <RotateCcw size={20} />,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      icon: <MessageSquare size={20} />,
    },
    {
      title: "Invoices",
      href: "/dashboard/client/invoices",
      icon: <FileText size={20} />,
    },
  ];

  const accountNav: NavItem[] = [

    {
      title: "Profile",
      href: "/dashboard/client/profile",
      icon: <UserCircle size={20} />,
    },
  ];

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = item.href === "/dashboard/client" 
      ? pathname === "/dashboard/client"
      : pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);

    return (
      <Link href={item.href}>
        <div
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group",
            isActive
              ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]"
              : "text-zinc-400 hover:text-white hover:bg-white/5",
          )}
        >
          <span
            className={cn(
              "transition-colors shrink-0",
              isActive ? "text-white" : "text-zinc-500 group-hover:text-white",
            )}
          >
            {item.icon}
          </span>
          <span className="text-base font-medium tracking-wide">
            {item.title}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div
      className="h-full flex flex-col bg-[#111318] border-r border-white/5 overflow-hidden"
      style={{ width: 260 }}
    >
      {/* Logo */}
      <div className="px-8 pt-10 pb-8 shrink-0">
        <div className="flex items-baseline gap-0">
          <span className="text-[26px] font-black tracking-tight text-white leading-none">
            The
          </span>
          <span className="text-[26px] font-black tracking-tight text-[#1A8080] leading-none">
            Pix
          </span>
          <span className="text-[26px] font-black tracking-tight text-white leading-none">
            Flow
          </span>
        </div>
        <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.3em] mt-1">
          Video Editing Agency
        </p>
      </div>



      {/* Main Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* ACCOUNT section */}
        <div className="pt-6 pb-2 px-4">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            Account
          </span>
        </div>

        {accountNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Help Card */}
      <div className="px-4 pb-4 shrink-0">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1A4848 0%, #0d2c2c 100%)",
          }}
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-2xl rounded-full -mr-4 -mt-4" />
          <h4 className="text-sm font-bold text-white mb-1 relative z-10">
            Need help?
          </h4>
          <p className="text-[10px] text-zinc-300/70 leading-relaxed mb-4 relative z-10">
            For any emergency or any query
          </p>
          <a 
            href="https://wa.me/8801795917539" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative z-10"
          >
            Contact Support <ArrowUpRight size={12} />
          </a>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-4 py-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shrink-0">
              <img 
                src={userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
           </div>
           <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{userData?.displayName || user?.displayName || "Member"}</p>
              <p className="text-[10px] font-black text-[#1A8080] uppercase tracking-widest">{role || "Client"}</p>
           </div>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
        >
          <LogOut
            size={20}
            className="group-hover:text-red-400 transition-colors shrink-0"
          />
          <span className="text-base font-normal tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const pathname = usePathname();
  const { signOut, user, userData, role } = useAuth();

  const mainNav: NavItem[] = [
    { title: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard size={20} /> },
    { title: "Users", href: "/dashboard/admin/users", icon: <Users size={20} /> },
    { title: "Projects", href: "/dashboard/admin/projects", icon: <Briefcase size={20} /> },
    { title: "Reviews", href: "/dashboard/admin/revisions", icon: <RotateCcw size={20} /> },
    { title: "Assets", href: "/dashboard/admin/assets", icon: <FolderOpen size={20} /> },
    { title: "Messages", href: "/dashboard/messages", icon: <MessageSquare size={20} /> },
    { title: "Invoices", href: "/dashboard/admin/invoices", icon: <DollarSign size={20} /> },
  ];

  const accountNav: NavItem[] = [
    { title: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
    { title: "Profile", href: "/dashboard/admin/profile", icon: <UserCircle size={20} /> },
  ];

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = item.href === "/dashboard/admin" 
      ? pathname === "/dashboard/admin"
      : pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);

    return (
      <Link href={item.href}>
        <div
          className={cn(
            "flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer group",
            isActive
              ? "bg-[#1A4848] text-white shadow-[0_0_20px_rgba(26,72,72,0.3)]"
              : "text-zinc-400 hover:text-white hover:bg-white/5",
          )}
        >
          <span
            className={cn(
              "transition-colors shrink-0",
              isActive ? "text-white" : "text-zinc-500 group-hover:text-white",
            )}
          >
            {item.icon}
          </span>
          <span className="text-base font-medium tracking-wide">
            {item.title}
          </span>
        </div>
      </Link>
    );
  };

  return (
    <div
      className="h-full flex flex-col bg-[#111318] border-r border-white/5 overflow-hidden"
      style={{ width: 260 }}
    >
      {/* Logo */}
      <div className="px-8 pt-10 pb-8 shrink-0">
        <div className="flex items-baseline gap-0">
          <span className="text-[26px] font-black tracking-tight text-white leading-none">
            The
          </span>
          <span className="text-[26px] font-black tracking-tight text-[#1A8080] leading-none">
            Pix
          </span>
          <span className="text-[26px] font-black tracking-tight text-white leading-none">
            Flow
          </span>
        </div>
        <p className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.3em] mt-1">
          Command Center
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
        {mainNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        <div className="pt-6 pb-2 px-4">
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            Account
          </span>
        </div>
        {accountNav.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* Identity */}
      <div className="px-4 py-6 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-zinc-800 shrink-0">
              <img 
                src={userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                alt="Avatar" 
                className="w-full h-full object-cover" 
              />
           </div>
           <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{userData?.displayName || user?.displayName || "Admin User"}</p>
              <p className="text-[10px] font-black text-[#1A8080] uppercase tracking-widest">Super Admin</p>
           </div>
        </div>
        
        {/* System Status Card */}
        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-zinc-400" />
            <span className="text-xs font-bold text-white">System Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] text-green-500 font-medium">All systems operational</span>
          </div>
          <Link href="/status" className="text-[10px] text-zinc-400 hover:text-white mt-1 flex items-center justify-between group transition-colors">
            View Status Page
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <button 
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-2 rounded-lg bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all group"
        >
          <LogOut size={14} className="group-hover:text-red-400 transition-colors shrink-0" />
          <span className="text-xs font-bold tracking-wide">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Shared Sidebar for Admin, Editor, Sales, Marketing ─────────────────────
export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Client, Editor, Marketing, and Admin get their own dedicated sidebars
  if (role === "admin") return <AdminSidebar />;
  if (role === "client") return <ClientSidebar />;
  if (role === "editor") return <EditorSidebar />;
  if (role === "marketing") return <MarketingSidebar />;

  const getNavItems = (role: Role): NavItem[] => {
    switch (role) {
      case "admin":
        return [
          {
            title: "CommandCenter",
            href: "/dashboard/admin",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "Production Grid",
            href: "/dashboard/admin/projects",
            icon: <Briefcase size={20} />,
          },
          {
            title: "Clients",
            href: "/dashboard/admin/clients",
            icon: <Users size={20} />,
          },
          {
            title: "Editors",
            href: "/dashboard/admin/editors",
            icon: <Zap size={20} />,
          },
          {
            title: "Strategic Intel",
            href: "/dashboard/admin/strategy",
            icon: <Target size={20} />,
          },
          {
            title: "Messages",
            href: "/dashboard/messages",
            icon: <MessageSquare size={20} />,
          },
          {
            title: "Settings",
            href: "/dashboard/settings",
            icon: <Settings size={20} />,
          },
        ];
      case "sales":
        return [
          {
            title: "Sales Hub",
            href: "/dashboard/sales",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "Unconverted",
            href: "/dashboard/sales/leads",
            icon: <Users size={20} />,
          },
          {
            title: "Messages",
            href: "/dashboard/messages",
            icon: <MessageSquare size={20} />,
          },
          {
            title: "Settings",
            href: "/dashboard/settings",
            icon: <Settings size={20} />,
          },
        ];
      case "editor":
        return [
          {
            title: "Dashboard",
            href: "/dashboard/editor",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "My Projects",
            href: "/dashboard/editor/projects",
            icon: <Briefcase size={20} />,
          },
          {
            title: "Earnings",
            href: "/dashboard/editor/earnings",
            icon: <CreditCard size={20} />,
          },
        ];
      case "marketing":
        return [
          {
            title: "Growth Hub",
            href: "/dashboard/marketing",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "Lead CRM",
            href: "/dashboard/marketing/leads",
            icon: <Users size={20} />,
          },
          {
            title: "Outreach Hub",
            href: "/dashboard/marketing/outreach",
            icon: <MessageSquare size={20} />,
          },
          {
            title: "Content Planner",
            href: "/dashboard/marketing/planner",
            icon: <Calendar size={20} />,
          },
          {
            title: "Competitor Intel",
            href: "/dashboard/marketing/competitors",
            icon: <Target size={20} />,
          },
          {
            title: "Messages",
            href: "/dashboard/messages",
            icon: <MessageSquare size={20} />,
          },
          {
            title: "Settings",
            href: "/dashboard/settings",
            icon: <Settings size={20} />,
          },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(role);

  const { userData, user: authUser } = useAuth();
  const displayName = userData?.displayName || authUser?.displayName || "Member";
  const photoURL = userData?.photoURL || authUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authUser?.uid}`;

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="h-full border-r border-white/5 bg-black flex flex-col relative z-20 transition-all duration-300 ease-in-out"
    >
      <div
        className={cn(
          "p-6 flex items-center",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <Link href="/" className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tighter text-white">
                The
              </span>
              <span className="text-2xl font-black tracking-tighter text-[#1A8080]">
                PixFlow
              </span>
            </div>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-[0.3em] -mt-1 ml-0.5">
              Video Editing Agency
            </span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
            <span className="font-black text-[#1A8080] text-xl">P</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.href}>
              <button
                className={cn(
                  "w-full flex items-center px-3 py-3 rounded-xl transition-all group relative",
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-zinc-500 hover:text-white",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-4 w-full p-2 rounded-lg transition-all",
                    isCollapsed && "justify-center",
                    isActive
                      ? "text-[#fd1d1d]"
                      : "text-zinc-500 group-hover:text-[#fd1d1d]",
                  )}
                >
                  <span>{item.icon}</span>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-semibold text-sm whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </div>
                {!isCollapsed && isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
                )}
                {isActive && isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 rounded-r-full bg-[#fd1d1d]" />
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* Help Card - Added for all roles in shared sidebar when not collapsed */}
      {!isCollapsed && (
        <div className="px-4 pb-4 shrink-0">
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1A4848 0%, #0d2c2c 100%)",
            }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 blur-2xl rounded-full -mr-4 -mt-4" />
            <h4 className="text-sm font-bold text-white mb-1 relative z-10">
              Need help?
            </h4>
            <p className="text-[10px] text-zinc-300/70 leading-relaxed mb-4 relative z-10">
              For any emergency or any query
            </p>
            <a 
              href="https://wa.me/8801795917539" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 relative z-10"
            >
              Contact Support <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Profile & Controls */}
      <div className="p-4 border-t border-white/5 space-y-2">
        
        {/* Compact Profile */}
        {!isCollapsed && (
          <Link href="/dashboard/settings" className="block">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] border border-white/5 rounded-xl mb-4 hover:bg-white/[0.05] hover:border-[#1A4848]/30 transition-all cursor-pointer group">
               <div className="w-8 h-8 rounded-lg border border-white/10 overflow-hidden bg-zinc-800 shrink-0 group-hover:border-[#1A4848]/50 transition-colors">
                  <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
               </div>
               <div className="min-w-0">
                  <p className="text-[11px] font-bold text-white truncate group-hover:text-[#1A8080] transition-colors">{displayName}</p>
                  <p className="text-[8px] font-black text-[#1A8080] uppercase tracking-widest">{role}</p>
               </div>
            </div>
          </Link>
        )}

        {isCollapsed && (
          <Link href="/dashboard/settings" className="block">
            <div className="flex justify-center mb-4 cursor-pointer group">
               <div className="w-8 h-8 rounded-lg border border-white/10 overflow-hidden bg-zinc-800 group-hover:border-[#1A4848]/50 transition-colors">
                  <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
               </div>
            </div>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 text-zinc-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={signOut}
          className={cn(
            "w-full flex items-center py-3 rounded-xl text-zinc-500 hover:text-white transition-all group",
            isCollapsed ? "justify-center" : "px-3 gap-4",
          )}
        >
          <LogOut
            size={20}
            className="group-hover:text-red-500 transition-colors"
          />
          {!isCollapsed && (
            <span className="font-bold text-xs uppercase tracking-widest">
              Sign Out
            </span>
          )}
        </button>
      </div>
    </motion.div>
  );
}
