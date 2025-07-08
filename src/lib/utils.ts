import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get the full authenticated backend media URL for a given file and type
 * @param filename - The file name, path, or full URL
 * @param type - The type of media (profile_pics, community_posts, courses, or generic)
 */
export function getMediaUrl(
  filename?: string,
  type: "profile_pics" | "community_posts" | "courses" | "generic" = "generic"
): string | undefined {
  if (!filename) return undefined;

  // If it's already a full URL, return as is
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }

  const baseUrl = "https://api.garaad.org/api/media";

  // Extract filename from path if it starts with /media/
  let cleanFilename = filename;
  if (filename.startsWith("/media/")) {
    // Remove /media/ prefix and get the rest
    cleanFilename = filename.replace("/media/", "");
  }

  // If the clean filename already contains the media type directory, use it as is
  if (cleanFilename.startsWith(`${type}/`)) {
    return `${baseUrl}/${cleanFilename}`;
  }

  // Otherwise, add the media type directory
  switch (type) {
    case "profile_pics":
      return `${baseUrl}/profile_pics/${cleanFilename}`;
    case "community_posts":
      return `${baseUrl}/community/posts/${cleanFilename}`;
    case "courses":
      return `${baseUrl}/courses/${cleanFilename}`;
    default:
      return `${baseUrl}/${cleanFilename}`;
  }
}
