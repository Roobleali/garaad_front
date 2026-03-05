import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { BlogDetailClient } from "@/components/blog/BlogDetailClient";

interface PostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const posts = await getBlogPosts().catch(() => []);
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

function descriptionFromBody(body: string | null | undefined, maxLength = 200): string {
    if (!body || typeof body !== "string") return "";
    const stripped = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (stripped.length <= maxLength) return stripped;
    return stripped.slice(0, maxLength).trim() + "…";
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);
    if (!post) return { title: "Post Not Found" };

    const coverImage = post.cover_image_url || post.cover_image;
    const canonicalUrl = `https://garaad.org/blog/${slug}`;
    const keywords = post.tags?.length
        ? [...post.tags.map((t) => t.name), "Garaad Blog", "STEM Soomaali"]
        : ["Garaad Blog", "STEM Soomaali"];

    const description =
        post.meta_description?.trim() ||
        post.excerpt?.trim() ||
        descriptionFromBody(post.body);

    return {
        title: `${post.title} | Garaad Blog`,
        description: description || post.title,
        keywords,
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: post.title,
            description: description || post.title,
            type: "article",
            url: canonicalUrl,
            siteName: "Garaad STEM",
            locale: "so_SO",
            publishedTime: post.published_at,
            authors: [post.author_name],
            images: coverImage ? [{ url: coverImage, width: 1200, height: 630 }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: description || post.title,
            images: coverImage ? [coverImage] : [],
        },
        robots: { index: true, follow: true },
    };
}

export default async function BlogPostPage({ params }: PostPageProps) {
    const { slug } = await params;
    const post = await getBlogPost(slug).catch(() => null);

    if (!post) {
        notFound();
    }

    // Fetch related posts (same tag if possible)
    const allPosts = await getBlogPosts();
    const relatedPosts = allPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://garaad.org/blog/${slug}` },
        "headline": post.title,
        "image": post.cover_image_url || post.cover_image || "https://garaad.org/images/og-blog.jpg",
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "author": { "@type": "Person", "name": post.author_name },
        "publisher": {
            "@type": "Organization",
            "name": "Garaad STEM",
            "logo": { "@type": "ImageObject", "url": "https://garaad.org/logo.png" },
        },
        "description": post.meta_description || post.excerpt,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogDetailClient post={post} relatedPosts={relatedPosts} />
        </>
    );
}
