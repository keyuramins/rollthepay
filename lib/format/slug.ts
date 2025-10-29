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
  return name
    .toLowerCase()
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, '-');
}

// Helper function to convert a slug back to the original database name
export function deslugify(slug: string) {
  // Handle specific German state/location name mappings
  const mappings: { [key: string]: string } = {
    'baden-wuerttemberg': 'Baden-Württemberg',
    'nordrhein-westfalen': 'Nordrhein-Westfalen',
    'rhineland-palatinate': 'Rhineland-Palatinate',
    'schleswig-holstein': 'Schleswig-Holstein',
    'carrick-on-shannon': 'Carrick-on-Shannon',
    'chatham-kent': 'Chatham-Kent',
    'niagara-on-the-lake': 'Niagara-on-the-Lake',
    'ottawa-kanata': 'Ottawa-Kanata',
    'montreal-est': 'Montreal-Est',
    'pointe-claire': 'Pointe-Claire',
    'tuebingen': 'Tübingen',
    'boeblingen': 'Böblingen',
    'duesseldorf': 'Düsseldorf',
    'muenster': 'Münster'
  };
  
  if (mappings[slug]) {
    return mappings[slug];
  }
  
  // Fallback to general conversion
  return slug
    .replace(/-/g, ' ')//Disabling helps Germany - enabbling doesn't help Germany
    .replace(/ue/g, 'ü')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}