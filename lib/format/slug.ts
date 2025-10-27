// lib/format/slug.ts
// Helper function to encode slug_url for URLs using encodeURIComponent
export function encodeSlugForURL(slug: string): string {
  return encodeURIComponent(slug);
}

// Helper function to decode slug_url from URLs using decodeURIComponent
export function decodeSlugFromURL(slug: string): string {
  return decodeURIComponent(slug);
}
export function slugify(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-');
}