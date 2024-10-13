"use client";

import { ChevronDown, PanelRightClose, UserIcon } from "lucide-react";
import ThemeToggler from "./ThemeToggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { logout } from "@/actions/auth/actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CldImage from "@/components/CldImage";
import SidebarMobile from "../../Sidebars/SidebarMobile";
import { webAppUrl } from "@/constants/data";
import toast from "react-hot-toast";

type NavbarProps = {
  image: string | null;
  name: string;
};

export default function Navbar({ image, name }: NavbarProps) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <header className="fixed right-0 top-0 z-[50] flex h-16 w-full items-center px-6 backdrop-blur-sm max-lg:justify-between">
        <button onClick={() => setShowSidebar(true)} className="lg:hidden">
          <PanelRightClose
            size={24}
            className="text-neutral-500 dark:text-primary-200"
          />
        </button>
        <NavbarLogo />
        <div className="flex items-center justify-end gap-x-2 lg:flex-1">
          <ThemeToggler />
          <UserProfile image={image} name={name} />
        </div>
      </header>
      {/* Navbar Height */}
      <div className="h-16" />
      {/* Sidebar Mobile */}
      <SidebarMobile
        setShowSidebar={setShowSidebar}
        showSidebar={showSidebar}
      />
    </>
  );
}

// ===================================================================================================

function NavbarLogo() {
  return (
    <div className="flex items-center gap-x-2 max-lg:hidden lg:w-[13.5rem]">
      {/* Logo */}
      <span className="text-xl font-medium">Febryer</span>
    </div>
  );
}

// ===================================================================================================

type UserProfileProps = {
  image: string | null;
  name: string;
};

function UserProfile({ image, name }: UserProfileProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleLogout = async () => {
    toast.loading("Déconnexion en cours...");
    setShowDropdown(!showDropdown);
    await logout();
    toast.dismiss();
    location.reload();
  };

  return (
    <DropdownMenu open={showDropdown} onOpenChange={setShowDropdown}>
      <DropdownMenuTrigger className="group/dropdown outline-none">
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-x-1.5"
        >
          {/* User Image */}
          {image ? (
            <div
              className={cn(
                "relative size-10 rounded-full",
                isImageLoading && "bg-primary-600/85 dark:bg-primary-300/85",
              )}
            >
              <CldImage
                className="rounded-full bg-primary-1050 object-cover"
                src={image}
                alt={`Image de ${name}`}
                fill
                onLoad={() => setIsImageLoading(false)}
                sizes="2.5rem"
              />
            </div>
          ) : (
            <div className="relative size-10 overflow-hidden rounded-full bg-black/5 dark:bg-primary-700">
              <UserIcon
                className="absolute -bottom-1 left-1/2 size-[2.15rem] -translate-x-1/2 fill-black/65 text-black/65 dark:fill-white dark:text-white"
                strokeWidth={0.75}
              />
            </div>
          )}
          <ChevronDown
            className={cn(
              "text-black/35 transition-all duration-300 group-hover/dropdown:text-black/65 dark:text-white/40 dark:group-hover/dropdown:text-white/75",
              showDropdown && "rotate-180",
            )}
            size={18}
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <DropdownMenuLabel className="text-neutral-500 dark:text-primary-200/75">
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            onClick={() => setShowDropdown(!showDropdown)}
            href={webAppUrl + "parametres"}
          >
            Paramètres
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
