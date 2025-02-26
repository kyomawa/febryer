import {
  Sparkles,
  CalendarCheck,
  Handshake,
  Settings,
  FolderKanban,
} from "lucide-react";
import { NavbarLinkProps, SidebarLinkProps } from "./types";

// WebApp =============================================================================================================================================

export const webAppUrl = "/app/";

// =============================================================================================================================================

export const navbarLinks: NavbarLinkProps[] = [
  { path: "/", label: "Accueil" },
  { path: "/reservations", label: "Réserver" },
  { path: "/contact", label: "Contact" },
  { path: "/temoignages", label: "Témoignages" },
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
  { path: `${webAppUrl}general`, label: "Général", icon: <FolderKanban /> },
  { path: `${webAppUrl}services`, label: "Services", icon: <Handshake /> },
  {
    path: `${webAppUrl}reservations`,
    label: "Réservations",
    icon: <CalendarCheck />,
  },
  {
    path: `${webAppUrl}temoignages`,
    label: "Témoignages",
    icon: <Sparkles />,
  },
  { path: `${webAppUrl}parametres`, label: "Paramètres", icon: <Settings /> },
];

// WebSite =============================================================================================================================================
export const Information = {
  description:
    "Febryer est une jeune auto-entreprise dédiée à l'entretien et à la propreté de votre véhicule. Située au cœur du Roannais, notre mission est simple : offrir un service de lavage complet, intérieur comme extérieur, pour redonner à votre voiture tout son éclat.",
};

export const Highlights = {
  title: "La propreté à la hauteur de vos attentes",
  centered: {
    subtitle: "POUR Un soin complet de votre véhicule",
    title: "Des techniques DE nettoyage professionnelles",
    paragraph:
      "Nous utilisons des techniques professionnelles et des produits de qualité pour garantir des résultats impeccables à chaque prestation. Que vous ayez besoin d’un simple nettoyage extérieur pour raviver la brillance de votre carrosserie ou d’un soin approfondi pour restaurer la propreté et la fraîcheur de l’habitacle, Febryer est à votre service. Nous sommes fiers de combiner savoir-faire et rigueur pour offrir un nettoyage méticuleux, adapté aux spécificités de votre véhicule. Chaque étape est réalisée avec soin, pour non seulement répondre à vos attentes, mais aussi sublimer l'apparence et le confort de votre voiture.",
  },
  bottomLeft: {
    paragraph:
      "nous savons que chaque véhicule est unique, c’est pourquoi nous proposons des services personnalisés. Que vous ayez besoin d’un simple lavage rapide ou d’un nettoyage en profondeur, nous adaptons nos prestations à vos attentes et aux spécificités de votre voiture. tout en respectant les délais et en garantissant votre satisfaction.",
  },
  bottomRight: {
    paragraph: "Envie de redonner à votre voiture tout son éclat ?",
  },
};
