"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileVideo,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  UserCheck,
  Megaphone,
  Briefcase,
  Calendar,
  CalendarIcon,
  TrendingUp,
  Target,
  BarChart3,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
  role: Role;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
            title: "Fix Queue",
            href: "/dashboard/editor/revisions",
            icon: <ShieldCheck size={20} />,
          },
          {
            title: "Calendar",
            href: "/dashboard/editor/calendar",
            icon: <CalendarIcon size={20} />,
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
      case "client":
        return [
          {
            title: "Dashboard",
            href: "/dashboard/client",
            icon: <LayoutDashboard size={20} />,
          },
          {
            title: "Projects",
            href: "/dashboard/client/projects",
            icon: <Briefcase size={20} />,
          },
          {
            title: "Analytics",
            href: "/dashboard/client/analytics",
            icon: <TrendingUp size={20} />,
          },
          {
            title: "Competitors",
            href: "/dashboard/client/competitors",
            icon: <Users size={20} />,
          },
          {
            title: "Library",
            href: "/dashboard/client/library",
            icon: <FileVideo size={20} />,
          },
          {
            title: "Messages",
            href: "/dashboard/messages",
            icon: <MessageSquare size={20} />,
          },
          {
            title: "Billing",
            href: "/dashboard/client/billing",
            icon: <CreditCard size={20} />,
          },
          {
            title: "Settings",
            href: "/dashboard/settings",
            icon: <Settings size={20} />,
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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
              <span className="font-bold text-black">P</span>
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-tight text-white"
            >
              PixFlow
            </motion.span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
            <span className="font-bold text-black">P</span>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-2 mt-4 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center px-3 py-3 rounded-xl transition-all group relative",
                  isActive
                    ? "bg-white/5 text-white"
                    : "text-gray-500 hover:text-white",
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-4",
                    isCollapsed && "mx-auto",
                  )}
                >
                  <span
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-[#fd1d1d]"
                        : "group-hover:text-[#fd1d1d]",
                    )}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-bold text-xs uppercase tracking-widest whitespace-nowrap"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </div>
                {isActive && isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-[#fd1d1d] rounded-r-full" />
                )}
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center py-2 text-gray-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        <button
          onClick={signOut}
          className={cn(
            "w-full flex items-center py-3 rounded-xl text-gray-500 hover:text-white transition-all group",
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
