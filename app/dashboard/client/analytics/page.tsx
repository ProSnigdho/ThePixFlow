"use client";

import React from "react";
import { BestPerformingVideo } from "./_components/BestPerformingVideo";
import { FollowerGrowth } from "./_components/FollowerGrowth";
import { PostingHeatmap } from "./_components/PostingHeatmap";

export default function ClientAnalyticsPage() {
  return (
    <div className="h-full grid grid-cols-[1fr_1fr] grid-rows-[45fr_55fr] gap-6 p-6 overflow-hidden animate-in fade-in duration-700">
      {/* Top Left: Best Performing Video */}
      <div className="min-h-0 overflow-hidden">
        <BestPerformingVideo />
      </div>

      {/* Top Right: Posting Optimization Heatmap */}
      <div className="min-h-0 overflow-hidden">
        <PostingHeatmap />
      </div>

      {/* Bottom: Full Width Follower Growth */}
      <div className="col-span-2 min-h-0 overflow-hidden">
        <FollowerGrowth />
      </div>
    </div>
  );
}
