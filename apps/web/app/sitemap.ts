import type { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = [
    "",
    "/know-your-digipin",
    "/tools/lat-long-to-digipin",
    "/tools/digipin-to-lat-long",
    "/how-digipin-works",
    "/digipin-vs-pincode",
    "/format",
    "/faq",
    "/about",
    "/cities",
    "/docs/api-v1-specification",
    "/use-cases/logistics",
    "/use-cases/emergency",
    "/use-cases/rural",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPaths.map((path, index) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: index < 6 ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : path.includes("know") || path.includes("tools") ? 0.9 : 0.7,
    })),
    ...CITIES.map((city) => ({
      url: `${SITE.url}/cities/${city.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
