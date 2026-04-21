"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { 
  FileVideo, 
  ExternalLink,
  History,
  TrendingUp,
  Award,
  AlertCircle,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  link: string;
  status: string;
  createdAt: string;
  clientId: string;
}

interface WorkQueueProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  activeTaskId?: string;
}

export function WorkQueue({ tasks, onSelectTask, activeTaskId }: WorkQueueProps) {
  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), { status: newStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Zap className="text-[#fd1d1d]" size={20} />
          Work Queue
        </h2>
        <button className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-1 transition-colors">
          <History size={12} /> Global Log
        </button>
      </div>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <GlassCard className="text-center py-20 border-dashed border-white/10 opacity-30 flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
              <FileVideo size={24} />
            </div>
            <p className="text-sm italic text-gray-500">Global queue is clear. Awaiting new orders.</p>
          </GlassCard>
        ) : (
          tasks.map((task, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={task.id}
              className="group"
            >
              <GlassCard 
                onClick={() => onSelectTask(task)}
                className={cn(
                  "relative overflow-hidden border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer p-4",
                  activeTaskId === task.id && "bg-white/[0.05] border-[#fd1d1d]/30"
                )}
              >
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 transition-all duration-500",
                  activeTaskId === task.id ? "bg-[#fd1d1d]" : "bg-white/10 group-hover:bg-[#833ab4]"
                )} />
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-bold text-base leading-none group-hover:text-white transition-colors">{task.title}</h3>
                      <div className="flex items-center gap-2 pt-1">
                        <span className={cn(
                          "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                          task.status === "Pending" ? "bg-blue-500/10 text-blue-500" :
                          task.status === "Editing" ? "bg-[#fd1d1d]/10 text-[#fd1d1d]" :
                          "bg-[#fcb045]/10 text-[#fcb045]"
                        )}>
                          {task.status}
                        </span>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 line-clamp-1 italic">{task.description}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
