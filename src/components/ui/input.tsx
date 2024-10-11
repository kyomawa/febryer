import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-10 w-full rounded px-3 py-2 sm:text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-slate-200 bg-white ring-offset-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1 dark:border-primary-100/20 dark:bg-primary-1000 dark:text-neutral-10 dark:placeholder:text-primary-100/65 dark:focus-visible:ring-slate-300 dark:ring-offset-primary-100/75",
        file: "cursor-pointer dark:bg-primary-1000 border dark:border-primary-100/20 border-neutral-200 px-1.5 py-1.5 file:mr-4 file:cursor-pointer file:rounded file:border-0 file:bg-primary-400 dark:file:bg-primary-800 file:px-4 file:py-1 file:font-merriweather file:text-sm file:text-primary-1050 dark:file:text-white hover:file:bg-primary-500 dark:hover:file:bg-primary-900 file:transition-colors file:duration-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };
