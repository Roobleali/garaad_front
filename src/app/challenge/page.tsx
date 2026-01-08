import { Header } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { TechChallengeHero } from "@/components/landing/TechChallengeHero";
import { OurStorySection } from "@/components/landing/OurStorySection";
import { TransformationSection } from "@/components/landing/TransformationSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { WhatsAppFloat } from "@/components/landing/WhatsAppFloat";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tartanka Tech-ga ee Ugu Horreeya & Ugu Fiican | 5-Week SaaS Challenge - Garaad",
    description:
        "Ka qaybgal tartanka tech-ga ee ugu horreeya Soomaaliya. Baro sida loo dhisayo meherad SaaS ah oo faa'iido leh 5 toddobaad gudahood. Join the first and best Somali tech challenge to build your first SaaS business.",
    keywords: [
        "Tartanka tech-ga Soomaaliya",
        "Barashada IT-ga ugu fiican",
        "Dhisidda SaaS Soomaaliya",
        "Ganacsiga online-ka",
        "Somali tech entrepreneurship",
        "First Somali SaaS course",
        "Best web development challenge Somalia",
        "Dhallinyarada iyo Tech-ga",
        "Garaad Academy challenge",
        "AI business Somalia",
    ],
    openGraph: {
        title: "Tartanka Tech-ga ee Ugu Horreeya & Ugu Fiican Soomaaliya",
        description:
            "Halkan ka bilow safarkaaga tech-ga. Dhis oo iibi software-kaaga koowaad 5 toddobaad gudahood. The #1 tech challenge for Somali builders.",
        type: "website",
        locale: "so_SO",
        url: "https://garaad.org/challenge",
    },
};

export default function ChallengePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* JSON-LD for Search Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        name: "5-Week Tech Challenge | Tartanka Tech-ga",
                        description:
                            "Dhis oo bilow meheraddaada SaaS ee ugu horreysa 5 toddobaad gudahood. Build and launch your first AI-powered SaaS business in 5 weeks.",
                        provider: {
                            "@type": "Organization",
                            name: "Garaad",
                            url: "https://garaad.org",
                        },
                        educationalLevel: "Beginner to Intermediate",
                        timeRequired: "P5W",
                        inLanguage: ["so", "en"],
                        coursePrerequisites: "Basic computer skills and willingness to learn",
                        hasCourseInstance: {
                            "@type": "CourseInstance",
                            courseMode: "online",
                            courseWorkload: "PT10H",
                        },
                    }),
                }}
            />

            <Header />

            <main>
                <TechChallengeHero />
                <OurStorySection />
                <TransformationSection />
                <FAQSection />
                <ClosingCTA />
            </main>

            <FooterSection />
            <WhatsAppFloat />
        </div>
    );
}
