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
    title: "5-Week Tech Challenge | Launch Your First SaaS - Garaad",
    description:
        "Join the 5-Week Tech Challenge and build your first profitable SaaS business. From idea to paying customers—learn modern web development, AI integration, and business skills. Perfect for Somali youth and aspiring entrepreneurs worldwide.",
    keywords: [
        "SaaS builder",
        "5-week challenge",
        "AI business",
        "tech entrepreneurship",
        "Somali tech",
        "online business",
        "web development",
        "startup course",
        "AI integration",
        "business automation",
    ],
    openGraph: {
        title: "5-Week Tech Challenge | Launch Your First SaaS",
        description:
            "Build and launch your first AI-powered SaaS business in just 5 weeks. Join bold Somali builders turning ideas into income.",
        type: "website",
        locale: "en_US",
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
                        name: "5-Week Tech Challenge",
                        description:
                            "Build and launch your first AI-powered SaaS business in 5 weeks. From idea validation to paying customers.",
                        provider: {
                            "@type": "Organization",
                            name: "Garaad",
                            url: "https://garaad.org",
                        },
                        educationalLevel: "Beginner to Intermediate",
                        timeRequired: "P5W",
                        inLanguage: "en",
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
