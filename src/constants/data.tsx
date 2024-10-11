import { CalendarCheck, Handshake, Settings } from "lucide-react";
import { NavbarLinkProps, SidebarLinkProps } from "./types";

// =============================================================================================================================================

export const webAppUrl = "/app/";

// =============================================================================================================================================

export const navbarLinks: NavbarLinkProps[] = [
  { path: "/", label: "Accueil" },
  { path: "/reservations", label: "Réserver" },
  { path: "/contact", label: "Contact" },
];

// =============================================================================================================================================

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 10;
export const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/svg+xml",
];

// =============================================================================================================================================

export const sidebarLinks: SidebarLinkProps[] = [
  { path: `${webAppUrl}services`, label: "Services", icon: <Handshake /> },
  {
    path: `${webAppUrl}reservations`,
    label: "Réservations",
    icon: <CalendarCheck />,
  },
  { path: `${webAppUrl}parametres`, label: "Paramètres", icon: <Settings /> },
];
