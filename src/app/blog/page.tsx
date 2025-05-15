import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Calendar, BookOpen } from "lucide-react";
import { SharePost } from "@/components/SharePost";
import { getBlogPages } from "@/lib/contentful";

export const revalidate = 60;
export const dynamic = "force-static";

export async function generateMetadata() {
  return {
    title: "Wargeyska Garaad",
    description:
      "Nagala soco halkan waxyaalaha naga cusub, sida casharda , wararka iyo waxyaalaha ku saabsan.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "https://garaad.org/blog",
      siteName: "Wargeyska Garaad",
      images: [
        {
          url: "/og-blog.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogListPage() {
  const posts = await getBlogPages();

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Wargeyska Garaad
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Nagala soco halkan waxyaalaha naga cusub, sida casharda , wararka iyo
          waxyaalaha ku saabsan.
        </p>
      </section>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">Wax boosti ah kuma jiro</h2>
          <p className="text-muted-foreground">
            Nagu soo noqo saad u gaatid waxyaalaha naga cusub.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const fields = post.fields as {
              title?: string;
              body?: unknown;
              excerpt?: string;
              image?: any;
              publishDate?: string;
              author?: string;
              category?: string;
              slug?: string;
            };

            const readingTime = fields.body
              ? Math.max(
                  1,
                  Math.ceil(
                    JSON.stringify(fields.body).split(/\s+/).length / 200
                  )
                )
              : 1;

            const slug = post.sys.id;
            const href = `/blog/${slug ?? ""}`;

            const imageFields = (fields.image?.fields ?? {}) as {
              file?: { url?: string };
              title?: string;
            };
            const rawUrl = imageFields.file?.url ?? "";
            const src = rawUrl
              ? rawUrl.startsWith("//")
                ? `https:${rawUrl}`
                : rawUrl
              : "";
            const alt =
              typeof imageFields.title === "string"
                ? imageFields.title
                : fields.title ?? "";

            return (
              <Card
                key={post.sys.id}
                className="h-full flex flex-col group hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Link href={href} className="absolute inset-0 z-10">
                    {src ? (
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={alt}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw,
                               (max-width: 1200px) 50vw,
                               33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="bg-muted w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </Link>
                  {fields.category && (
                    <Badge className="absolute top-4 left-4 z-20 bg-primary/90 hover:bg-primary text-primary-foreground">
                      {fields.category}
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <Link href={href}>
                    <CardTitle className="line-clamp-2 text-lg hover:underline">
                      {fields.title || "Untitled Post"}
                    </CardTitle>
                  </Link>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <time dateTime={fields.publishDate || post.sys.createdAt}>
                        {new Date(
                          fields.publishDate || post.sys.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{readingTime} min read</span>
                    </div>
                    {fields.author && (
                      <div className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        <span>{fields.author}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {fields.excerpt || "No excerpt available"}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center bg-muted/50">
                  <Link
                    href={href}
                    className="flex items-center text-sm font-medium text-primary hover:underline"
                    aria-label={`Read more about ${fields.title}`}
                  >
                    <BookOpen className="mr-1 h-4 w-4" />
                    Faahfaahin
                  </Link>
                  <SharePost title={fields.title!} slug={slug ?? ""} />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
