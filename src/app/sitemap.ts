import type { MetadataRoute } from "next";
import { people } from "@/content/people";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: "https://sonixense.com/", changeFrequency: "monthly", priority: 1 }, { url: "https://sonixense.com/artscience", changeFrequency: "monthly", priority: .6 }, ...people.map((person) => ({ url: `https://sonixense.com/team/${person.id}`, changeFrequency: "monthly" as const, priority: .5 }))]; }
