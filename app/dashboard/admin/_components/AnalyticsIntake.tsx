"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileDown, Plus } from "lucide-react";

const data = [
  { name: "Mon", delivered: 40 },
  { name: "Tue", delivered: 30 },
  { name: "Wed", delivered: 65 },
  { name: "Thu", delivered: 45 },
  { name: "Fri", delivered: 90 },
  { name: "Sat", delivered: 70 },
  { name: "Sun", delivered: 85 },
];

export function AnalyticsIntake() {
  return (
    <div className="grid grid-cols-[7fr_3fr] gap-6 h-full min-h-0 overflow-hidden">
      {/* Analytics Chart */}
      <GlassCard className="p-6 flex flex-col h-full overflow-hidden min-h-0">
        <div className="flex justify-between items-center mb-6 flex-none">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Delivery Performance
            </h3>
            <p className="text-[11px] text-gray-500 font-bold uppercase">
              Daily Throughput vs. Monthly Average
            </p>
          </div>
          <button className="p-2 bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
            <FileDown size={14} />
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fd1d1d" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#fd1d1d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1A1A1A"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#333"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#333"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0A0A0A",
                  border: "1px solid #1A1A1A",
                  borderRadius: "8px",
                  fontSize: "10px",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="delivered"
                stroke="#fd1d1d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDelivered)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Intake Feed */}
      <GlassCard className="p-6 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between mb-6 flex-none">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            NEW TASK FROM CLIENT
          </h3>
          <Plus size={14} className="text-[#833ab4]" />
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar divide-y divide-white/5 min-h-0">
          {[
            { task: "Nike Summer Reel", client: "Nike Global" },
            { task: "Starbucks Winter Promo", client: "Regional Marketing" },
            { task: "Apple Event Clip", client: "Product Team" },
            { task: "Tesla FSD Update", client: "Growth Dept" },
            { task: "Amazon Prime Day", client: "Campaign Hub" },
            { task: "Meta Reel Ads", client: "Meta/FB" },
            { task: "Google Cloud Keynote", client: "G-Cloud" },
          ].map((item, i) => (
            <div
              key={i}
              className="py-5 flex justify-between items-center group transition-colors"
            >
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-gray-300 truncate group-hover:text-white uppercase tracking-tight">
                  {item.task}
                </span>
              </div>
              <span className="text-[10px] text-gray-600 font-bold uppercase truncate">
                {item.client}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
