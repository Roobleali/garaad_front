import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { Header } from "@/components/Header";
import Image from "next/image";
import { Calendar, Clock, User, Tag as TagIcon, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PostPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    const posts = await getBlogPosts().catch(() => []);
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
    const post = await getBlogPost(params.slug).catch(() => null);
    if (!post) return { title: "Post Not Found" };

    const coverImage = post.cover_image_url || post.cover_image;

    return {
        title: `${post.title} | Garaad Blog`,
        description: post.meta_description || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.meta_description || post.excerpt,
            type: "article",
            publishedTime: post.published_at,
            authors: [post.author_name],
            images: coverImage ? [{ url: coverImage }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.meta_description || post.excerpt,
            images: coverImage ? [coverImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: PostPageProps) {
    const post = await getBlogPost(params.slug).catch(() => null);

    if (!post) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("so-SO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    const coverImage = post.cover_image_url || post.cover_image;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": coverImage || "https://garaad.so/images/og-blog.jpg",
        "datePublished": post.published_at,
        "dateModified": post.updated_at || post.published_at,
        "author": {
            "@type": "Person",
            "name": post.author_name,
        },
        "publisher": {
            "@type": "Organization",
            "name": "Garaad STEM",
            "logo": {
                "@type": "ImageObject",
                "url": "https://garaad.so/logo.png",
            },
        },
        "description": post.meta_description || post.excerpt,
    };

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-screen bg-white pb-20">
                {/* Article Header */}
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-8 transition-colors"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Ku noqo Blog-ga
                    </Link>

                    <header className="mb-10">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 mb-8 border-y border-slate-100 py-4">
                            <div className="flex items-center">
                                <User className="mr-2 h-4 w-4 text-primary" />
                                <span className="font-medium text-slate-700">{post.author_name}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>{calculateReadingTime(post.body)} daqiiqo akhris ah</span>
                            </div>
                        </div>

                        {coverImage && (
                            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden shadow-lg mb-10">
                                <Image
                                    src={coverImage}
                                    alt={post.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                        )}
                    </header>

                    {/* Article Body */}
                    <div
                        className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: post.body }}
                    />

                    {/* Footer Metadata */}
                    <footer className="mt-16 pt-8 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-2">
                            <TagIcon className="h-4 w-4 text-slate-400 mr-2" />
                            {post.tags.map((tag) => (
                                <Link key={tag.id} href={`/blog/tag/${tag.slug}`}>
                                    <Badge variant="secondary" className="hover:bg-primary hover:text-white transition-colors cursor-pointer">
                                        {tag.name}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    </footer>
                </article>
            </main>
        </>
    );
}
