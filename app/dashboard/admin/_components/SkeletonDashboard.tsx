"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export function SkeletonDashboard() {
  return (
    <div className="h-full grid grid-cols-12 grid-rows-6 gap-6 overflow-hidden">
      {/* Revenue Skeleton */}
      <GlassCard className="col-span-8 row-span-4 border-white/5 animate-shimmer" />
      
      {/* Deadline Skeleton */}
      <GlassCard className="col-span-4 row-span-6 border-white/5 animate-shimmer" />
      
      {/* Pulse Skeletons */}
      <GlassCard className="col-span-4 row-span-1 border-white/5 animate-shimmer" />
      <GlassCard className="col-span-4 row-span-1 border-white/5 animate-shimmer" />
      
      {/* Stream Skeleton */}
      <GlassCard className="col-span-8 row-span-2 border-white/5 animate-shimmer" />
    </div>
  );
}
