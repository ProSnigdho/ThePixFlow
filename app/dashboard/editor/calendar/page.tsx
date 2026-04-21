"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EditorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Placeholder deadlines
  const deadlines: Record<number, string[]> = {
    18: ["Nike Reel", "VFX Clean"],
    20: ["Tesla Intro"],
    25: ["Amazon Prime"],
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

  return (
    <div className="h-full flex flex-col gap-6 p-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Production <span className="text-zinc-500">Timeline</span></h1>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Global Deadline Sync</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 px-4">
          <button onClick={prevMonth} className="p-1 hover:text-red-500 transition-colors"><ChevronLeft size={20} /></button>
          <span className="text-sm font-black uppercase tracking-widest min-w-[140px] text-center">{monthNames[month]} {year}</span>
          <button onClick={nextMonth} className="p-1 hover:text-red-500 transition-colors"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_300px] gap-6 min-h-0 overflow-hidden">
        <GlassCard className="h-full flex flex-col border-[#27272a]/50 overflow-hidden p-6 bg-black/40">
          <div className="grid grid-cols-7 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} className="text-center text-[10px] font-black text-zinc-600 uppercase tracking-widest py-2 border-b border-white/5">{d}</div>
            ))}
          </div>
          
          <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
            {Array.from({ length: 42 }).map((_, i) => {
              const dayNumber = i - startDay + 1;
              const isCurrentMonth = dayNumber > 0 && dayNumber <= days;
              const hasDeadlines = deadlines[dayNumber];

              return (
                <div 
                  key={i} 
                  className={cn(
                    "relative p-3 transition-colors",
                    isCurrentMonth ? "bg-[#0A0A0A] hover:bg-white/[0.02]" : "bg-black opacity-30 cursor-default"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold",
                    isCurrentMonth ? "text-zinc-400" : "text-zinc-800"
                  )}>
                    {isCurrentMonth ? dayNumber : ""}
                  </span>
                  
                  {isCurrentMonth && hasDeadlines && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {hasDeadlines.map((d, idx) => (
                        <div key={idx} className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Calendar Sidebar: Specific Day Details */}
        <div className="flex flex-col gap-4 overflow-hidden">
          <GlassCard className="flex-1 p-6 flex flex-col border-[#27272a]/50 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
              <Clock size={14} className="text-orange-500" />
              Day Schedule
            </h3>
            
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                <div className="text-[10px] font-black text-red-500 uppercase mb-1">11:00 AM - Priority</div>
                <h4 className="text-xs font-bold text-white uppercase italic">Nike Reel First Cut</h4>
              </div>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">03:30 PM - Routine</div>
                <h4 className="text-xs font-bold text-white uppercase italic">Tesla Tutorial Revision</h4>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <button className="w-full py-3 bg-white text-black text-[10px] font-black uppercase rounded-xl hover:bg-zinc-200 transition-colors">
                Book Availability
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
