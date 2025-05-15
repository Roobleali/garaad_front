import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import {
  getBlogPageById,
  getBlogPages,
  estimateReadingTime,
} from "@/lib/contentful";
import { RichTextRenderer } from "@/components/RichTextRenderer";
import { notFound } from "next/navigation";
import { SharePost } from "@/components/SharePost";

// 1️⃣ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const post = await getBlogPageById((await params).id);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found",
    };
  }

  const { title, body, image } = post.fields;
  const rawUrl =
    image && "fields" in image && image.fields && "file" in image.fields
      ? (image.fields as { file?: { url?: string } }).file?.url
      : undefined;
  const ogUrl = rawUrl
    ? rawUrl.startsWith("//")
      ? `https:${rawUrl}`
      : rawUrl
    : undefined;

  const description = body
    ? `${RichTextRenderer.plainText(body).slice(0, 157)}...`
    : "";

  return {
    title: typeof title === "string" ? title : "",
    description,
    openGraph: {
      title: typeof title === "string" ? title : "",
      description,
      images: ogUrl
        ? [
            {
              url: ogUrl,
              width: 1200,
              height: 630,
              alt: typeof title === "string" ? title : "",
            },
          ]
        : [],
    },
  };
}

// 2️⃣ Static params
export async function generateStaticParams() {
  const posts = await getBlogPages();
  return posts.map((post) => ({ id: post.sys.id }));
}

// 3️⃣ Page component
// 3️⃣ Page component
export default async function BlogPageById({
  params,
}: {
  params: Promise<{ id: string }>; // 🔑 Promise here too
}) {
  const { id } = await params; // 🔑 pull out id
  if (!id) notFound();
  const post = await getBlogPageById((await params).id);

  if (!post) notFound();

  const { title, body, image, recommendedPosts } = post.fields;
  const safeRecommendedPosts = recommendedPosts ?? [];
  const readingTime = estimateReadingTime(body);

  // Normalize image URL
  const rawUrl =
    image && "fields" in image && image.fields && "file" in image.fields
      ? (image.fields as { file?: { url?: string } }).file?.url
      : undefined;
  const src = rawUrl
    ? rawUrl.startsWith("//")
      ? `https:${rawUrl}`
      : rawUrl
    : "";
  const alt =
    image && image.fields && "title" in image.fields
      ? (typeof (image.fields as { title?: unknown }).title === "string"
          ? (image.fields as { title?: string }).title
          : undefined) ?? (typeof title === "string" ? title : "")
      : typeof title === "string"
      ? title
      : "";

  return (
    <div className="container mx-auto py-12 px-4">
      <Link
        href="/blog"
        className="flex items-center text-muted-foreground mb-8 hover:text-primary transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        ku laabo bogga hore
      </Link>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            {typeof title === "string" ? title : ""}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-4 w-full justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>{readingTime} daq ku akhri</span>
            </div>
            <SharePost
              title={typeof title === "string" ? title : ""}
              slug={post.sys.id}
            />
          </div>
        </header>

        {src && (
          <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
            <Image
              alt={alt || ""}
              src={src || "/placeholder.svg"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 800px"
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
          {RichTextRenderer.render(body)}
        </div>

        {(safeRecommendedPosts?.length ?? 0) > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-4">Wararka la xiriira</h2>
            <ul className="space-y-4">
              {Array.isArray(safeRecommendedPosts)
                ? safeRecommendedPosts.map((entry) => {
                    const fields = (entry as any).fields as {
                      title?: string;
                      slug?: string;
                    };
                    const id = (entry as any).sys.id;
                    return (
                      <li key={id}>
                        <Link
                          href={`/blog/${id}`}
                          className="text-lg font-medium text-primary hover:underline"
                        >
                          {fields.title || "Untitled"}
                        </Link>
                      </li>
                    );
                  })
                : null}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}
