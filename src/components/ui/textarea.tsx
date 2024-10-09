import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "dark:border-primary-100/20 dark:bg-primary-1000 dark:text-neutral-10 dark:ring-offset-primary-100/75 dark:placeholder:text-primary-100/70 dark:focus-visible:ring-primary-100/75 flex min-h-[80px] w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 ring-offset-white/25 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950/75 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
