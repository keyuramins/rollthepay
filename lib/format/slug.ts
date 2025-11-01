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
    .replace(/\./g, '')
    .replace(/ü/g, 'ue')
    .replace(/ö/g, 'oe')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/é/g, 'e')
    .replace(/è/g, 'e')
    .replace(/à/g, 'a')
    .replace(/ù/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/î/g, 'i')
    .replace(/â/g, 'a')
    .replace(/ê/g, 'e')
    .replace(/\s+/g, '-');
}

// Helper function to convert a slug back to the original database name
export function deslugify(slug: string) {
  // Handle specific German state/location name mappings
  const mappings: { [key: string]: string } = {
    'baden-wuerttemberg': 'Baden-Württemberg',
    'nordrhein-westfalen': 'Nordrhein-Westfalen',
    'rhineland-palatinate': 'Rhineland-Palatinate',
    'saarbruecken': 'Saarbrücken',
    'wuerzburg': 'Würzburg',
    'goettingen': 'Göttingen',
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
    'muenster': 'Münster',
    'ile-de-france': 'Île-de-France',
    'quebec': 'Québec',
    'parana': 'Paraná',
    'sao paulo': 'São Paulo',
    'ceara': 'Ceará',
    'dun laoghaire': 'Dún Laoghaire',
  };
  if (mappings[slug]) {
    return mappings[slug];
  }

  const ABBREVIATIONS: Record<string, string> = {
    'st': 'St.',
    'ste': 'Ste.',
    'mt': 'Mt.',
    'ft': 'Ft.',
    'pt': 'Pt.',
    'lk': 'Lk.',
    'rdg': 'Rdg.',
    'riv': 'Riv.',
    'bnk': 'Bnk.',
    'isl': 'Isl.',
    'is': 'Is.',
    'cpe': 'Cpe.',
    'hrbr': 'Hrbr.',
    'pk': 'Pk.',
    'pln': 'Pln.',
    'vw': 'Vw.',
    'vly': 'Vly.',
    'hl': 'Hl.',
    'blf': 'Blf.',
  };

  return slug
    .split('-')
    .map(segment => {
      const lower = segment.toLowerCase();
      if (ABBREVIATIONS[lower]) {
        return ABBREVIATIONS[lower];
      }
      return lower.replace(/\b\w/g, c => c.toUpperCase());
    })
    .join(' ');

  // // Fallback to general conversion
  // return slug
  //   .replace(/-/g, ' ')
  //   .replace(/\b\w/g, (c) => c.toUpperCase());
}