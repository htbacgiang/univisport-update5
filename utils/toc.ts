export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export function parseToc(html: string): { headings: HeadingItem[]; content: string } {
  if (!html) return { headings: [], content: "" };

  const headings: HeadingItem[] = [];
  const idCounts: Record<string, number> = {};

  // Regex to find h1, h2, h3, h4, h5, h6 tags
  const headingRegex = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const modifiedHtml = html.replace(headingRegex, (match, levelStr, attrs, innerHtml) => {
    const level = parseInt(levelStr, 10);
    
    // Strip HTML tags from innerHtml to get plain text
    const plainText = innerHtml.replace(/<[^>]+>/g, "").trim();
    if (!plainText) return match; // skip empty headings

    // Check if there's already an id attribute in attrs
    let id = "";
    const idMatch = attrs.match(/id\s*=\s*['"]([^'"]*)['"]/i);
    if (idMatch) {
      id = idMatch[1];
    } else {
      // Generate unique slug
      let slug = plainText
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/đ/g, "d")
        .replace(/Đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .trim()
        .replace(/\s+/g, "-");
      
      if (!slug) slug = `heading-${level}`;
      
      // Ensure uniqueness
      if (idCounts[slug] !== undefined) {
        idCounts[slug]++;
        slug = `${slug}-${idCounts[slug]}`;
      } else {
        idCounts[slug] = 0;
      }
      id = slug;
    }

    headings.push({ id, text: plainText, level });

    // If id attribute already exists, return original match
    if (idMatch) {
      return match;
    } else {
      // Add id attribute to the heading tag
      return `<h${level} id="${id}"${attrs}>${innerHtml}</h${level}>`;
    }
  });

  return { headings, content: modifiedHtml };
}
