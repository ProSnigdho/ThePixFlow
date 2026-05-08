"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon 
} from "lucide-react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isBefore,
  startOfDay
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export function FloatingCalendar({ selectedDate, onSelect, onClose }: FloatingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
           <button 
             type="button"
             onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
             className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
           >
             <ChevronLeft size={16} />
           </button>
           <h3 className="text-sm font-bold text-white tracking-tight">
             {format(currentMonth, "MMMM")}
           </h3>
           <button 
             type="button"
             onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
             className="p-1.5 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
           >
             <ChevronRight size={16} />
           </button>
        </div>
        <div className="px-3 py-1 bg-zinc-800/50 rounded-lg border border-white/5">
          <span className="text-[10px] font-bold text-zinc-400">{format(currentMonth, "yyyy")}</span>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 gap-1">
        {allDays.map((d, i) => {
          const isCurrentMonth = isSameMonth(d, monthStart);
          const isSelected = selectedDate && isSameDay(d, selectedDate);
          const isPast = isBefore(startOfDay(d), startOfDay(new Date()));
          
          return (
            <button
              type="button"
              key={i}
              disabled={isPast}
              onClick={() => {
                if (!isPast) {
                  onSelect(d);
                  onClose();
                }
              }}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium transition-all relative",
                isPast ? "text-zinc-800 cursor-not-allowed" : !isCurrentMonth ? "text-zinc-600" : "text-white hover:bg-[#1A4848]/20",
                isSelected && "bg-[#1A4848] text-white shadow-[0_0_15px_rgba(26,72,72,0.5)] border border-[#1A8080]/50"
              )}
            >
              {format(d, "d")}
              {isSelected && (
                <motion.div 
                  layoutId="activeDate"
                  className="absolute inset-0 rounded-full border border-[#1A8080]/30"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="absolute left-full ml-4 top-0 z-[100] w-[280px] premium-glass p-6 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="relative">
        <div className="absolute -left-[30px] top-6 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[8px] border-r-white/5" />
        {renderHeader()}
        {renderDays()}
        {renderCells()}
      </div>
    </motion.div>
  );
}
