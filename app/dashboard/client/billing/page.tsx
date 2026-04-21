"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { CreditCard, CheckCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function ClientBillingPage() {
  const plans = [
    { name: "Starter", price: "$499", features: ["12 Shortform Videos", "7-Day Delivery", "Email Support"], active: false },
    { name: "Scale", price: "$1,299", features: ["30 Shortform Videos", "48h Delivery", "Dedicated Editor", "Analytics Pro"], active: true },
    { name: "Enterprise", price: "Custom", features: ["Unlimited Videos", "24h Priority", "Full Brand Strategy", "Social Management"], active: false },
  ];

  return (
    <div className="h-full flex flex-col gap-8 p-6 animate-in fade-in duration-700 overflow-hidden">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Plans & <span className="text-zinc-500">Billing</span></h1>
        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Manage your production subscription</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-3 gap-8">
           {plans.map((plan, idx) => (
             <GlassCard key={idx} className={`p-8 flex flex-col border-[#27272a]/50 ${plan.active ? 'border-blue-500/50 bg-blue-500/[0.02] ring-1 ring-blue-500/20' : 'bg-black/40'}`}>
                {plan.active && (
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Current Plan</span>
                    <Zap size={16} className="text-blue-500 fill-blue-500" />
                  </div>
                )}
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">/month</span>
                </div>

                <div className="mt-8 flex-1 space-y-4">
                   {plan.features.map((feature, fidx) => (
                     <div key={fidx} className="flex items-center gap-3">
                        <CheckCircle size={14} className={plan.active ? 'text-blue-500' : 'text-zinc-700'} />
                        <span className="text-xs font-medium text-zinc-300">{feature}</span>
                     </div>
                   ))}
                </div>

                <button className={`mt-10 w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  plan.active ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed' : 'bg-white text-black hover:scale-105'
                }`}>
                  {plan.active ? 'Active' : 'Upgrade Plan'}
                </button>
             </GlassCard>
           ))}
        </div>

        <div className="mt-8">
           <GlassCard className="p-6 border-[#27272a]/50 bg-black/40 flex justify-between items-center">
              <div className="flex items-center gap-6">
                 <div className="p-4 rounded-full bg-white/5 border border-white/10">
                    <CreditCard size={24} className="text-zinc-400" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Payment Method</h4>
                    <p className="text-xs text-zinc-600 font-medium italic">Visa ending in 4242 • Expires 12/26</p>
                 </div>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-500 hover:text-white transition-colors">
                 Manage Billing Portal <ArrowRight size={14} />
              </button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
