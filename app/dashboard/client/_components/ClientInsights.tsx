"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Megaphone, MessageSquare, Send } from "lucide-react";

// Dummy data for performance
const performanceData = [
  { name: "Mon", views: 4000 },
  { name: "Tue", views: 3000 },
  { name: "Wed", views: 2000 },
  { name: "Thu", views: 2780 },
  { name: "Fri", views: 1890 },
  { name: "Sat", views: 2390 },
  { name: "Sun", views: 3490 },
];

export function ClientInsights({ notices }: { notices: any[] }) {
  const [msg, setMsg] = useState("");

  return (
    <div className="grid grid-cols-[65%_35%] gap-6 h-full min-h-0 overflow-hidden">
      {/* Analytics Card */}
      <GlassCard className="p-6 flex flex-col h-full overflow-hidden min-h-0 border-zinc-800">
        <div className="mb-6 flex-none">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Content Performance Analytics</h3>
          <p className="text-[11px] text-gray-500 font-bold uppercase">Engagement & View Trends</p>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#833ab4" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#833ab4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" vertical={false} />
              <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A", borderRadius: "8px", fontSize: "10px" }}
                itemStyle={{ color: "#fff" }}
              />
              <Area type="monotone" dataKey="views" stroke="#833ab4" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Right Column Split */}
      <div className="flex flex-col gap-4 h-full min-h-0">
        {/* Top Half: Announcements */}
        <GlassCard className="flex-[0.5] p-5 flex flex-col overflow-hidden min-h-0 border-zinc-800">
           <div className="flex items-center gap-2 mb-3 flex-none">
             <Megaphone size={14} className="text-[#fd1d1d]" />
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Agency Announcements</h3>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-0">
             {notices.length > 0 ? notices.map((notice, i) => (
               <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                 <p className="text-[10px] text-gray-400 leading-relaxed font-medium">{notice.content}</p>
               </div>
             )) : (
               <div className="h-full flex items-center justify-center">
                  <span className="text-[9px] text-gray-600 font-black uppercase">No Updates</span>
               </div>
             )}
           </div>
        </GlassCard>

        {/* Bottom Half: Direct Message */}
        <GlassCard className="flex-[0.5] p-5 flex flex-col overflow-hidden min-h-0 border-zinc-800">
           <div className="flex items-center gap-2 mb-3 flex-none">
             <MessageSquare size={14} className="text-[#833ab4]" />
             <h3 className="text-xs font-black text-white uppercase tracking-widest">Direct Message with Admin</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 mb-3 min-h-0">
             {/* Example Messages */}
             <div className="p-2 bg-white/5 rounded-lg self-end max-w-[80%]">
                <p className="text-[10px] text-gray-300">Is the thumbnail ready?</p>
             </div>
             <div className="p-2 bg-white/5 rounded-lg self-start max-w-[80%] border border-zinc-800">
                <p className="text-[10px] text-gray-400 font-medium">Render in progress. Eta: 2h.</p>
             </div>
           </div>

           <div className="flex gap-2 flex-none">
              <input 
                type="text"
                placeholder="Type a message to Admin..."
                className="flex-1 bg-black/40 border border-white/5 p-2 px-3 rounded-lg text-[10px] font-bold text-white placeholder:text-gray-600 focus:border-[#833ab4] outline-none transition-colors"
                value={msg}
                onChange={e => setMsg(e.target.value)}
              />
              <button className="p-2 bg-white/5 rounded-lg group hover:bg-white/10 transition-colors">
                 <Send size={14} className="text-gray-500 group-hover:text-[#fd1d1d]" />
              </button>
           </div>
        </GlassCard>
      </div>
    </div>
  );
}
