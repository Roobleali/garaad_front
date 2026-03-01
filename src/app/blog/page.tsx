import { getBlogPosts } from "@/lib/blog";
import { Header } from "@/components/Header";
import Footer from "@/components/sections/FooterSection";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const revalidate = 3600; // ISR: Revalidate hourly

export async function generateMetadata() {
    return {
        title: "Wargeyska Garaad | Blog",
        description:
            "Nagala soco halkan waxyaalaha naga cusub, sida casharda, wararka iyo waxyaalaha ku saabsan STEM iyo Programming.",
        openGraph: {
            type: "website",
            locale: "so_SO",
            url: "https://garaad.so/blog",
            siteName: "Garaad STEM",
            images: [
                {
                    url: "/images/og-blog.jpg",
                    width: 1200,
                    height: 630,
                },
            ],
        },
    };
}

export default async function BlogListPage() {
    const posts = await getBlogPosts().catch(() => []);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-slate-50/30">
                <BlogListClient initialPosts={posts} />
            </main>
            <Footer />
        </>
    );
}
