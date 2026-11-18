import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.produktionsmitarbeiter.ch";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/impressum`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/datenschutz`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
