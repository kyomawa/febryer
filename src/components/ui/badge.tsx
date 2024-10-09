import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:focus:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-700 text-white hover:bg-primary-700/80 dark:bg-primary-300 dark:text-primary-900 dark:hover:bg-primary-300/80",
        admin: "bg-primary-700/50 text-primary-800",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        destructive:
          "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/80",
        outline: "text-slate-950 dark:text-slate-50",
        unstarted:
          "border-transparent bg-stone-500 text-white hover:bg-stone-500/80 dark:bg-stone-900 dark:text-slate-50 dark:hover:bg-stone-900/80",
        progress:
          "border-transparent bg-amber-500 text-black hover:bg-amber-500/80 dark:bg-amber-900 dark:text-slate-50 dark:hover:bg-amber-900/80",
        success:
          "border-transparent bg-green-500 text-slate-50 hover:bg-green-500/80 dark:bg-green-900 dark:text-slate-50 dark:hover:bg-green-900/80",
        member: "border-white/20 px-3 py-1 text-white backdrop-blur-[0.15rem] font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
