import React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { label: string; value: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-11 w-full rounded-md border border-white/10 bg-[#121212] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#833ab4]/50 focus:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="" disabled hidden>Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);
Select.displayName = "Select";
