import { MetadataRoute } from "next";
import Info from "@/infos";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/photos", "/projects", "/blog", "/last-listened"];

  return routes.map((route) => ({
    url: `${Info.siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}
