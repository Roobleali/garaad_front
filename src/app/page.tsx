import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Garaad | Baro, Tartan, oo Guulayso - #1 Goobta STEM Soomaaliya",
  description:
    "Garaad waa hoyga aqoonta casriga ah. Baro AI, Programming, iyo Science adigoo isticmaalaya Af-Soomaali hufan—macalin la'aan iyo tartan furan. Ku biir boqolaad arday Soomaaliyeed ah.",
  keywords: [
    "Garaad",
    "STEM Soomaali",
    "Xisaab Soomaali",
    "Fiisigis Soomaali",
    "Baro Soomaali",
    "Waxbarasho",
    "Xisaab",
    "Fiisikis",
  ],
  openGraph: {
    title: "Garaad | Baro, Tartan, oo Guulayso",
    description:
      "Garaad waa hoyga aqoonta casriga ah. Baro Xisaabta, Fiisigiska, iyo Tiknoolajiyada adiga oo isticmaalaya Af-Soomaali hufan.",
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
