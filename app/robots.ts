import { MetadataRoute } from "next";
import Info from "@/infos";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${Info.siteUrl}/sitemap.xml`,
  };
}
