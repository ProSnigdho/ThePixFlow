"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TopBar() {
  const pathname = usePathname();
  const { userData, user, role } = useAuth();

  const displayName = userData?.displayName || user?.displayName || "User";
  const firstName = displayName.split(" ")[0];
  const photoURL = userData?.photoURL || user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'Alex'}`;

  // Define what counts as a "Main Dashboard" for different roles
  const isMainDashboard = 
    pathname === "/dashboard/client" || 
    pathname === "/dashboard/admin" || 
    pathname === "/dashboard/editor" || 
    pathname === "/dashboard/sales" || 
    pathname === "/dashboard/marketing";

  // Page Title Mapping
  const getPageTitle = (path: string) => {
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/invoices")) return "Invoices";
    if (path.includes("/requests")) return "New Request";
    if (path.includes("/revisions")) return "Revision Center";
    if (path.includes("/messages")) return "Messages";
    if (path.includes("/profile")) return role === "editor" ? "Editor Profile" : role === "marketing" ? "Marketing Profile" : "Profile";
    if (path.includes("/settings")) return "Settings";
    if (path.includes("/active")) return "Active Edits";
    if (path.includes("/announcements")) return "Broadcasts";
    if (path.includes("/clients")) return "Client Registry";
    if (path.includes("/editors")) return "Team Operations";
    if (path.includes("/strategy")) return "Strategic Intel";
    if (path.includes("/leads")) return "Lead CRM";
    if (path.includes("/outreach")) return "Outreach Hub";
    if (path.includes("/planner")) return "Content Planner";
    if (path.includes("/competitors")) return "Competitor Intel";
    if (path.includes("/assets")) return "Asset Library";
    if (path.includes("/earnings")) return "Earnings";
    return "Dashboard";
  };

  const pageTitle = getPageTitle(pathname || "");

  // Typography Constants (Matching Dashboard Greeting)
  const headerTextStyle = "text-3xl font-bold text-white tracking-tight flex items-center gap-2";

  return (
    <header className="flex items-center justify-between transition-all duration-500 py-4 mb-4">
      <div className="flex-1">
        {isMainDashboard ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <h1 className={headerTextStyle}>
              Hey, {firstName} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1 font-medium">
              {role === "editor" 
                ? "Deliver stunning videos and manage your production workflow."
                : role === "marketing"
                ? "Drive growth, manage leads, and dominate the market."
                : "Manage your projects, track progress and get stunning videos."
              }
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
             <h2 className={headerTextStyle}>
               {pageTitle}
             </h2>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Subtle right-side icons */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "transition-all duration-300",
            isMainDashboard ? "scale-100" : "scale-90 opacity-80"
          )}>
            <NotificationCenter />
          </div>

          <div className={cn(
            "flex items-center gap-3 transition-all duration-300",
            isMainDashboard ? "pl-4 border-l border-white/5" : "pl-3"
          )}>
            {isMainDashboard && (
              <div className="text-right hidden sm:block animate-in fade-in duration-700">
                <p className="text-sm font-semibold text-white">{displayName}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">{role || "Member"}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className={cn(
                "rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-xl",
                isMainDashboard ? "w-10 h-10" : "w-8 h-8"
              )}>
                 <img src={photoURL} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              {isMainDashboard && (
                <ChevronDown size={16} className="text-zinc-500 group-hover:text-white transition-colors" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
