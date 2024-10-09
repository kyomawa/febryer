import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  return [
    {
      url: "https://febryer.fr/",
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
