import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/courses",
          "/courses/*",
          "/about",
          "/online-somali*",
          "/somali-math*",
          "/somali-physics*",
          "/somali-ai*",
          "/ai-soomaali*",
        ],
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/dashboard/",
          "/profile/",
          "/verify-email/",
          "/test-*",
          "/payment*",
          "/stripe*",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/courses", "/courses/*", "/about", "/somali-math*", "/somali-ai*"],
        disallow: ["/api/", "/_next/", "/admin/"],
      }
    ],
    sitemap: "https://garaad.so/sitemap.xml",
    host: "https://garaad.so",
  };
}
