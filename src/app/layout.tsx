import type { Metadata, Viewport } from "next";
import "./globals.css";
import { inter } from "@/lib/fonts";
import ClientLayout from "./client-layout";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";
import { Loader } from "lucide-react";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: {
    default:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    template: "%s | Garaad - Somali STEM Education",
  },
  description:
    "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan. Waxaan kuu diyaarisay koorsooyin tayo sare leh oo ku qoran Af-Soomaali, gaar ahaan ardayda Soomaalida ee Gen Z.",
  keywords: [
    "Garaad", "Xisaab Soomaali", "Algebra Soomaali", "Geometry Soomaali", "Physics Soomaali", "AI Soomaali", "Crypto Soomaali", "STEM Soomaali"
  ],
  authors: [{ name: "Garaad Team" }],
  creator: "Garaad Team",
  publisher: "Garaad",
  metadataBase: new URL("https://garaad.so"),
  alternates: {
    canonical: "/",
    languages: {
      "so-SO": "/",
      "en-US": "/en",
      "ar-SA": "/ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "so_SO",
    url: "https://garaad.so",
    title:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
    siteName: "Garaad - Somali STEM Education",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Garaad - #1 Somali STEM Platform | Xisaab, Algebra, Geometry, Physics, AI, Crypto",
    description:
      "Garaad waa platform-ka ugu horreeya ee Soomaalida oo ku saabsan barashada xisaabta, algebra, geometry, physics, AI, crypto iyo STEM-ka oo dhan.",
    images: ["/images/twitter-image.jpg"],
    creator: "@garaad_so",
    site: "@garaad_so",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Garaad",
  },
  icons: {
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="so" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Garaad",
              url: "https://garaad.so",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <ClientLayout>
              <PWARegister />
              <Suspense fallback={<Loader className="spin " />}>
                {children}
              </Suspense>
            </ClientLayout>
            <Analytics />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
