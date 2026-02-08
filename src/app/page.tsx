import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Garaad | First Somali Platform - SaaS, AI, Tech, Cloud, React, JS",
  description:
    "Garaad waa platform-ka ugu horreeya ee Soomaalida (First Somali Platform). Baro SaaS, AI, Tech, Cloud, React, JS, HTML, iyo Science adigoo isticmaalaya Af-Soomaali hufan.",
  keywords: [
    "Garaad",
    "First Somali Platform",
    "SaaS",
    "Somalis",
    "AI",
    "Tech",
    "Cloud",
    "React",
    "JS",
    "HTML",
    "STEM Soomaali",
    "Baro Soomaali",
  ],
  openGraph: {
    title: "Garaad | First Somali Platform - SaaS, AI, Tech, Cloud",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida. Baro SaaS, AI, Tech, Cloud, React, JS, iyo Tiknoolajiyada casriga ah.",
    type: "website",
    locale: "so_SO",
    url: "https://garaad.org",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: "Garaad STEM",
            url: "https://garaad.org",
            logo: "https://garaad.org/logo.png",
            description:
              "Garaad waa hoyga aqoonta casriga ah. Baro Xisaabta, Fiisigiska, iyo Tiknoolajiyada adiga oo isticmaalaya Af-Soomaali hufan.",
            address: {
              "@type": "PostalAddress",
              addressCountry: "SO",
            },
            sameAs: [
              "https://www.linkedin.com/company/garaad",
              "https://x.com/Garaadstem",
              "https://facebook.com/Garaadstem",
            ],
          }),
        }}
      />

      <SiteHeader />

      <HomeContent />

      <FooterSection />
    </div>
  );
}
