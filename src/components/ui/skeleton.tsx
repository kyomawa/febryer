import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva("animate-pulse rounded-md", {
  variants: {
    variant: {
      default: "bg-black/5 dark:bg-white/10",
      datatableFilter: "bg-primary-700/10",
      datatableCell: "bg-white/0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({ className, variant, ...props }, ref) => {
  return <div className={cn(skeletonVariants({ variant, className }))} ref={ref} {...props} />;
});

Skeleton.displayName = "Skeleton";

export { Skeleton, skeletonVariants };
