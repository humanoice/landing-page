import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Served at /sitemap.xml — add a row here whenever a new public route ships.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/master-plan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
