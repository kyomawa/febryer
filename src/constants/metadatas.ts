import { JsonLd } from "jsonld/jsonld-spec";
import { Metadata } from "next";

// ==========================================================================================================

export const jsonLd: JsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Febryer",
  url: "https://febryer.fr/",
  description:
    "Febryer, votre expert en nettoyage et entretien automobile. Faites briller votre véhicule avec nos services professionnels.",
  image: "https://febryer.fr/img/websiteimg.png",
  memberOf: {
    "@type": "Organization",
    name: "Febryer",
  },
  mainEntityOfPage: "https://febryer.fr/",
  primaryImageOfPage: {
    "@type": "ImageObject",
    "@id": "https://febryer.fr/img/websiteimg.png",
    url: "https://febryer.fr/img/websiteimg.png",
    width: 1200,
    height: 630,
  },
};

// ==========================================================================================================

export const commonMetadata: Metadata = {
  applicationName: "Febryer",
  creator: "Bryan Cellier",
  metadataBase: new URL("https://febryer.fr/"),
  title: {
    template: "%s - Febryer",
    default: "Febryer",
  },
  authors: { name: "Bryan Cellier", url: "https://febryer.fr/" },
  openGraph: {
    title: "Febryer - Nettoyage auto",
    type: "website",
    url: "https://febryer.fr/",
    images: [
      {
        url: "https://febryer.fr/img/websiteimg.png",
        width: 1200,
        height: 630,
        alt: "Carte de Febryer",
      },
    ],
    description:
      "Febryer, votre expert en nettoyage et entretien automobile. Faites briller votre véhicule avec nos services professionnels.",
    siteName: "Febryer",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bryan_cellier",
    title: "Febryer - Nettoyage auto",
    description:
      "Febryer, votre expert en nettoyage et entretien automobile. Faites briller votre véhicule avec nos services professionnels.",
    creator: "@bryan_cellier",
    images: {
      width: "1200",
      height: "630",
      url: "https://febryer.fr/img/websiteimg.png",
      alt: "Carte de Febryer",
    },
  },
};

// ==========================================================================================================

export const homeMetadata: Metadata = {
  title: "Febryer",
  description:
    "Febryer, votre expert en nettoyage automobile et entretien professionnel. Découvrez nos services de lavage auto, de nettoyage intérieur et extérieur pour redonner à votre véhicule son éclat d'origine.",
  keywords:
    "Nettoyage auto, lavage auto, entretien automobile, nettoyage voiture, nettoyage intérieur véhicule, lavage extérieur véhicule, detailing, entretien véhicule, lavage professionnel, Febryer",
  alternates: {
    canonical: "https://febryer.fr/",
  },
};

// --------------------------------------- WEB APP PART -----------------------------------------------------

export const commonWebAppMetadata: Metadata = {
  applicationName: "Febryer - Application",
  creator: "Bryan Cellier",
  title: {
    template: "%s - Febryer App",
    default: "Febryer App",
  },
  authors: { name: "Bryan Cellier", url: "https://bryancellier.fr/" },
  openGraph: {
    title: "Febryer - Application",
    type: "website",
    url: "https://febryer.fr/app",
    images: [
      {
        url: "https://febryer.fr/img/webappimg.png",
        width: 1200,
        height: 630,
        alt: "Carte de Febryer",
      },
    ],
    description: "Espace réservé au propriétaire du site.",
    siteName: "Febryer",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bryan_cellier",
    title: "Febryer - Application",
    description: "Espace réservé au propriétaire du site.",
    creator: "@bryan_cellier",
    images: {
      width: "1200",
      height: "630",
      url: "https://febryer.fr/img/webappimg.png",
      alt: "Carte de Febryer",
    },
  },
};

// ==========================================================================================================

export const connexionMetadata: Metadata = {
  title: "Connexion",
  description:
    "Connectez-vous à votre compte pour accéder à votre espace personnel.",
  keywords: "Febryer Application, connexion, espace personnel",
};

// ==========================================================================================================

export const dashboardMetadata: Metadata = {
  title: "Tableau de bord",
  description: "Visualiser les statistiques et l'état global des réservations.",
  keywords: "Febryer Application, tableau de bord, statistiques",
};

// ==========================================================================================================

export const servicesMetadata: Metadata = {
  title: "Services",
  description: "Ajouter ou modifier les différents services de Febryer.",
  keywords: "Febryer Application, services, espace utilisateur",
};

// ==========================================================================================================
export const generalMetadata: Metadata = {
  title: "Général",
  description: "Modifier les paramètres généraux de l'application.",
  keywords: "Febryer Application, paramètres généraux, espace utilisateur",
};
// ==========================================================================================================

export const reservationsMetadata: Metadata = {
  title: "Réservations",
  description: "Consulter et gérer les réservations des clients.",
  keywords: "Febryer Application, réservations, gestion des réservations",
};

// ==========================================================================================================

export const settingsMetadata: Metadata = {
  title: "Paramètres",
  description: "Gérer vos paramètres de compte.",
  keywords: "Febryer Application, paramètres, espace utilisateur",
};

// ==========================================================================================================
