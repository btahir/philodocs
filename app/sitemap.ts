import type { MetadataRoute } from "next";
import { linkableEntries } from "@/lib/content";

const baseUrl = "https://philodocs.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/timeline",
    "/thinkers",
    "/schools",
    "/works",
    "/search",
    ...linkableEntries.map((entry) => entry.url),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
