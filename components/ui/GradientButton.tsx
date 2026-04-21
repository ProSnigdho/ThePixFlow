import React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <button
      className={cn(
        "relative rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        "bg-gradient-to-tr from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 rounded-lg bg-black/10 mix-blend-overlay hover:bg-transparent transition-colors" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
