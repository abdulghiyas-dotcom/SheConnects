import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://sheconnects.work", lastModified: new Date() },
    { url: "https://sheconnects.work/blog", lastModified: new Date() },
    { url: "https://sheconnects.work/privacy", lastModified: new Date() },
  ];
}
