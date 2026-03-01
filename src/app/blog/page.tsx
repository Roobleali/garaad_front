import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    User,
    Calendar,
    BookOpen,
    ArrowRight,
    Search,
} from "lucide-react";
import { SharePost } from "@/components/SharePost";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { getBlogPosts } from "@/lib/blog";
import { BlogPost } from "@/types/blog";

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("so-SO", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const calculateReadingTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(words / wordsPerMinute));
    };

    const renderPostCard = (post: BlogPost) => {
        const href = `/blog/${post.slug}`;
        const readingTime = calculateReadingTime(post.body);

        return (
            <Card key={post.id} className="group overflow-hidden border-none bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="relative aspect-video w-full overflow-hidden">
                    <Link href={href} className="absolute inset-0 z-10">
                        <span className="sr-only">Akhri: {post.title}</span>
                    </Link>
                    {post.cover_image ? (
                        <Image
                            src={post.cover_image_url || post.cover_image || "/images/placeholder.jpg"}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="bg-slate-100 w-full h-full flex items-center justify-center">
                            <span className="text-slate-400">Sawir ma jiro</span>
                        </div>
                    )}
                    {post.tags.length > 0 && (
                        <Badge className="absolute top-3 left-3 z-20 bg-primary hover:bg-primary/90 text-white">
                            {post.tags[0].name}
                        </Badge>
                    )}
                </div>

                <CardContent className="p-5">
                    <div className="flex flex-wrap gap-3 mb-3 text-xs text-slate-500">
                        <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            <time dateTime={post.published_at}>
                                {formatDate(post.published_at)}
                            </time>
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>{readingTime} daqiiqo</span>
                        </div>
                        <div className="flex items-center">
                            <User className="mr-1 h-3 w-3" />
                            <span>{post.author_name}</span>
                        </div>
                    </div>

                    <Link
                        href={href}
                        className="block group-hover:text-primary transition-colors"
                    >
                        <h3 className="font-semibold text-xl mb-3 line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
                            {post.title}
                        </h3>
                    </Link>

                    <p className="line-clamp-3 text-sm text-slate-600 mb-4">
                        {post.excerpt}
                    </p>
                </CardContent>

                <CardFooter className="px-5 py-4 bg-slate-50 flex justify-between items-center">
                    <Link
                        href={href}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                    >
                        <BookOpen className="mr-1.5 h-4 w-4" />
                        Faahfaahin
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <SharePost title={post.title} slug={post.slug} />
                </CardFooter>
            </Card>
        );
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-white">
                {/* Hero Section */}
                <section className="relative py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-primary/5" />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-slate-900 relative inline-block">
                                Wargeyska Garaad
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/20 rounded-full transform -skew-x-12" />
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                                Nagala soco halkan waxyaalaha naga cusub, sida casharda, wararka
                                iyo waxyaalaha ku saabsan STEM.
                            </p>

                            <div className="relative max-w-md mx-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                    <Input
                                        type="search"
                                        placeholder="raadi qoraalada..."
                                        className="pl-10 pr-4 py-6 rounded-full border-slate-200 focus:border-primary focus:ring-primary shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                </section>

                {/* Blog Posts Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Qoraaladii ugu dambeeyay
                        </h2>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-slate-400" />
                            </div>
                            <h2 className="text-xl font-medium mb-2 text-slate-800">
                                Wax boosti ah kuma jiro
                            </h2>
                            <p className="text-slate-500 max-w-md mx-auto">
                                Nagu soo noqo saad u heshid waxyaalaha naga cusub.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {posts.map(renderPostCard)}
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
