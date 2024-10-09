import { NavbarLinkProps } from "./types";

// ==========================================================================================================

export const navbarLinks: NavbarLinkProps[] = [
  { path: "/", label: "Accueil" },
  { path: "/boutique", label: "Boutique" },
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
