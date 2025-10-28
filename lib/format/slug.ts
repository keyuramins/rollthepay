// lib/format/slug.ts
// Helper function to encode slug_url for URLs using encodeURIComponent (Replaces special characters with encoded values)
export function encodeSlugForURL(slug: string): string {
  return encodeURIComponent(slug);
}

// Helper function to decode slug_url from URLs using decodeURIComponent (Replaces encoded characters with their original values)
export function decodeSlugFromURL(slug: string): string {
  return decodeURIComponent(slug);
}

// Helper function to convert a string into a URL-friendly slug (Replaces spaces with hyphens and converts to lowercase)
export function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}