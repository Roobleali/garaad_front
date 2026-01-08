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
    title: "Tartanka SaaS - 5 Toddobaad",
    description: "SaaS & AI Business. 5 Toddobaad.",
    keywords: [
        "Tartanka dhisidda software-ka",
        "Barashada IT-ga casriga ah",
        "Dhisidda SaaS iyo AI",
        "Ganacsiga digital-ka ah",
        "Somali tech builders",
        "SaaS development Somalia",
        "First Somali SaaS challenge",
        "Garaad Academy",
        "AI for business Somalia",
    ],
    openGraph: {
        title: "Bilow Safarkaaga Tech-ga ee Garaad",
        description:
            "Dhis oo daabac software-kaaga ugu horreeya 5 toddobaad gudahood. Ku soo biir bahda wax dhisidda Soomaaliya.",
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
                        name: "SaaS & AI Challenge",
                        description:
                            "Dhis Ganacsigaaga SaaS & AI business 5 toddobaad gudahood.",
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
