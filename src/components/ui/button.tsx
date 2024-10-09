import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const buttonVariants = cva(
  "inline-flex outline-none items-center justify-center whitespace-nowrap rounded-md text-sm font-medium duration-200 transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-700 text-white hover:bg-primary-800 dark:bg-primary-800 dark:text-neutral-50 dark:hover:bg-primary-900",
        inputLike:
          "border border-slate-200 w-full rounded-md bg-white ring-offset-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-950 focus-visible:ring-offset-1 dark:border-primary-100/20 dark:bg-primary-1000 dark:text-neutral-10 dark:placeholder:text-primary-100/65 dark:focus-visible:ring-slate-300 dark:ring-offset-primary-100/75",
        destructive:
          "bg-red-600 text-neutral-50 hover:bg-red-700/90 dark:bg-red-700 dark:text-slate-50 dark:hover:bg-red-900/90",
        outline:
          "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-primary-100/15 dark:hover:border-primary-950 dark:bg-primary-1050 dark:hover:bg-primary-950 dark:text-neutral-50",
        datatableOutline:
          "border text-primary-700 disabled:text-primary-800 border-primary-800/45 bg-white hover:bg-primary-700 hover:text-neutral-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        datatableOutlineDestructive:
          "border text-red-500 disabled:text-red-800 border-red-500/55 bg-white hover:bg-red-500 hover:text-neutral-50",
        datatableFilter:
          "bg-primary-700/10 placeholder:text-primary-800/65 text-neutral-900 w-full justify-start relative",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        inputLike: "h-10 px-3 py-2",
        hero: "px-8 py-4",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} disabled={isLoading} ref={ref} {...props}>
        <span className={cn(isLoading && "hidden")}>{props.children}</span>
        <Loader className={cn("size-6", !isLoading ? "hidden" : "animate-loading")} />
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
