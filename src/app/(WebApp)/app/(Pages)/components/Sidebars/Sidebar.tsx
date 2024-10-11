"use client";

import { sidebarLinks } from "@/constants/data";
import { SidebarLinkProps } from "@/constants/types";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  return (
    <>
      <aside className="fixed bottom-0 left-0 top-0 mt-16 min-h-screen w-[15rem] p-6 max-lg:hidden">
        <nav className="flex flex-col gap-y-3">
          {sidebarLinks.map((link, idx) => (
            <Item key={idx} link={link} />
          ))}
        </nav>
      </aside>
      {/* Sidebar Width */}
      <div className="w-64 max-lg:hidden" />
    </>
  );
}

// ==================================================================================================================================

type ItemProps = {
  link: SidebarLinkProps;
};

function Item({ link }: ItemProps) {
  const { path, icon, label } = link;
  const pathname = usePathname();
  const isActive = pathname.startsWith(path);

  return (
    <Link href={path} className="group/link flex items-center gap-x-3">
      <div
        className={cn(
          "rounded p-2 transition-colors duration-200 *:size-[1.25rem] 2k:*:size-[1.5rem]",
          isActive
            ? "bg-primary-600 text-white dark:bg-primary-700"
            : "bg-black/5 text-black/35 group-hover/link:bg-black/10 group-hover/link:text-black/55 dark:bg-white/10 dark:text-white/35 dark:group-hover/link:bg-white/25 dark:group-hover/link:text-white/75",
        )}
      >
        {icon}
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          isActive
            ? "text-black dark:text-white"
            : "text-black/50 group-hover/link:text-black/85 dark:text-white/50 dark:group-hover/link:text-white/85",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
