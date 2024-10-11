"use client";

import { cn } from "@/lib/utils";
import { LayoutGrid, RefreshCw, Search } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "@/components/ui/input";
import { RevalidateSpecificTag } from "@/lib/utilsServer";
import { motion, Variants } from "framer-motion";
import TooltipComponent from "@/components/TooltipComponent";

type ContentHeaderProps<T> = {
  title: string;
  refreshTagNameButton?: string;
  placeholder?: string;
  setLayoutActive?: Dispatch<SetStateAction<string>>;
  layoutActive?: string;
  searchContent?: T[];
  setSearchContent?: React.Dispatch<React.SetStateAction<T[]>>;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
  getUsers?: () => Promise<void>;
  filterBtn?: React.ReactNode;
  modal?: React.ReactNode;
};

export default function ContentHeader<T>({
  refreshTagNameButton,
  title,
  layoutActive,
  setLayoutActive,
  searchContent,
  setSearchContent,
  setIsLoading,
  placeholder,
  modal,
  filterBtn,
}: ContentHeaderProps<T>) {
  return (
    <div className="z-40 flex w-full items-center gap-x-6 backdrop-blur-md">
      {/* Title */}
      <h1 className="text-2xl font-medium">{title}</h1>
      {/* Border */}
      <div className="h-px flex-1 bg-black/5 dark:bg-white/10" />
      {/* Controls */}
      <div
        className={cn(
          "flex items-center gap-x-3",
          !searchContent && !layoutActive && !modal && !filterBtn && "hidden",
        )}
      >
        {/* SearchBar */}
        <SearchBar
          searchContent={searchContent}
          setSearchContent={setSearchContent}
          placeholder={placeholder}
          setIsLoading={setIsLoading}
        />
        {/* View Buttons */}
        <ViewButtons
          layoutActive={layoutActive}
          setLayoutActive={setLayoutActive}
        />
        {/* Filter Button */}
        {filterBtn && filterBtn}
        {/* Refresh Tag Button */}
        {<RefreshTagButton refreshTagNameButton={refreshTagNameButton} />}
        {/* Add Button + Modal */}
        {modal && modal}
      </div>
    </div>
  );
}

// ===================================================================================================

type RefreshTagButtonProps = {
  refreshTagNameButton?: string;
};

function RefreshTagButton({ refreshTagNameButton }: RefreshTagButtonProps) {
  const handleClick = () => {
    if (refreshTagNameButton) {
      RevalidateSpecificTag(refreshTagNameButton);
    }
  };

  const rotate: Variants = {
    animate: { rotate: [0, 180, 0] },
  };

  if (refreshTagNameButton) {
    return (
      <TooltipComponent side="bottom" label="Actualiser les données">
        <motion.button
          initial="initial"
          whileTap="animate"
          onClick={handleClick}
          className="rounded-md bg-primary-600 p-2 text-white transition-colors duration-300 hover:bg-primary-700 dark:bg-primary-700/35 dark:hover:bg-primary-800/35"
        >
          <motion.div variants={rotate} transition={{ duration: 0.6 }}>
            <RefreshCw className="size-6" strokeWidth={1.5} />
          </motion.div>
        </motion.button>
      </TooltipComponent>
    );
  }
}
// ===================================================================================================

type SearchBarProps<T> = {
  searchContent?: T[];
  setSearchContent?: React.Dispatch<React.SetStateAction<T[]>>;
  placeholder?: string;
  setIsLoading?: Dispatch<SetStateAction<boolean>>;
};

function SearchBar<T>({
  searchContent,
  setSearchContent,
  placeholder,
}: SearchBarProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    searchContent &&
    setSearchContent && (
      // SearchBar
      <div className="relative">
        {/* Icon */}
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-[1.125rem] -translate-y-1/2" />
        {/* Input */}
        <Input
          variant="contentHeader"
          id="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder || "Recherche..."}
          value={searchTerm}
        />
      </div>
    )
  );
}

// ===================================================================================================

type ViewButtonsProps = {
  layoutActive?: string;
  setLayoutActive?: Dispatch<SetStateAction<string>>;
};

function ViewButtons({ layoutActive, setLayoutActive }: ViewButtonsProps) {
  const isActiveClassName =
    "bg-primary-600 dark:bg-primary-700/35 *:text-white ";
  const isNotActiveClassName =
    "bg-black/5 dark:bg-white/10 *:text-black dark:*:text-white hover:bg-primary-500 dark:hover:bg-primary-700/75";

  return (
    layoutActive &&
    setLayoutActive && (
      <div className="flex items-center">
        {/* Button 1 */}
        <button
          onClick={() => setLayoutActive("large")}
          className={cn(
            "rounded-l-md p-2 transition-colors duration-300",
            layoutActive === "large" ? isActiveClassName : isNotActiveClassName,
          )}
        >
          <LayoutGrid className="size-6" strokeWidth={1} />
        </button>
        {/* Button 2 */}
        <button
          onClick={() => setLayoutActive("mini")}
          className={cn(
            "rounded-r-md p-2 transition-colors duration-300",
            layoutActive === "mini" ? isActiveClassName : isNotActiveClassName,
          )}
        >
          <div className="relative size-6">
            <LayoutIcon layoutActive={layoutActive === "mini"} />
          </div>
        </button>
      </div>
    )
  );
}

// ===================================================================================================

type LayoutIconProps = {
  layoutActive: boolean;
};

function LayoutIcon({ layoutActive }: LayoutIconProps) {
  return (
    <svg
      className={cn(
        "size-6 *:stroke-black dark:*:stroke-white",
        layoutActive && "*:stroke-white",
      )}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 3.25H4C3.44772 3.25 3 3.69772 3 4.25V9.25C3 9.80228 3.44772 10.25 4 10.25H20C20.5523 10.25 21 9.80228 21 9.25V4.25C21 3.69772 20.5523 3.25 20 3.25Z" />
      <path d="M20 13.75H4C3.44772 13.75 3 14.1977 3 14.75V19.75C3 20.3023 3.44772 20.75 4 20.75H20C20.5523 20.75 21 20.3023 21 19.75V14.75C21 14.1977 20.5523 13.75 20 13.75Z" />
    </svg>
  );
}
