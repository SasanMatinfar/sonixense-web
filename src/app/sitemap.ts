import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: "https://sonixense.com/", changeFrequency: "monthly", priority: 1 }, { url: "https://sonixense.com/artscience", changeFrequency: "monthly", priority: .6 }]; }
