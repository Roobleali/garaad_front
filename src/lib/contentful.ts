import { createClient, type Entry, type Asset } from "contentful";

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

// Type definitions for Contentful entries
export type ContentfulImage = Asset;

export interface BlogPageFields {
  title?: string;
  body?: any; // RichText content
  image?: ContentfulImage;
  recommendedPosts?: Entry<any>[]; // Linked entries
}

export type BlogPageSkeleton = {
  contentTypeId: "blogPage";
  fields: BlogPageFields;
};

export type BlogPage = Entry<BlogPageSkeleton>;

/**
 * Fetches all BlogPage entries from Contentful.
 */
export async function getBlogPages(): Promise<BlogPage[]> {
  try {
    const response = await client.getEntries<BlogPageSkeleton>({
      content_type: "blogPage",
      order: ["sys.createdAt", "sys.updatedAt"],
      include: 2, // Include linked assets and entries
    });

    return response.items as BlogPage[];
  } catch (error) {
    console.error("Error fetching blog pages:", error);
    return [];
  }
}

/**
 * Fetches a single BlogPage entry by its entry ID.
 * @param id The sys.id of the BlogPage entry.
 */
export async function getBlogPageById(id: string): Promise<BlogPage | null> {
  try {
    const entry = await client.getEntry<BlogPageSkeleton>(id, { include: 2 });
    return entry as BlogPage;
  } catch (error) {
    console.error(`Error fetching blog page with ID "${id}":`, error);
    return null;
  }
}

/**
 * Helper to estimate reading time for 'body' rich text content.
 */
export function estimateReadingTime(content: any): number {
  if (!content) return 1;
  const text = JSON.stringify(content);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}
