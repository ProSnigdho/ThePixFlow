"use client";

import React from "react";
import { DiscoverySearch } from "../_components/DiscoverySearch";
import { LeadCRMTable } from "../_components/LeadCRMTable";

export default function MarketingLeadsPage() {
  return (
    <div className="h-full flex flex-col gap-6 p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex-none">
        <DiscoverySearch />
      </div>

      <div className="flex-1 min-h-0">
        <LeadCRMTable />
      </div>
    </div>
  );
}
