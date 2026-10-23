const INTERNAL_HOSTNAMES = new Set([
  "dongphucunivi.com",
  "www.dongphucunivi.com",
]);

type EditorLinkAttributes = {
  href: string;
  target?: string;
  rel?: string;
};

export const isInternalHref = (href: string): boolean => {
  const normalizedHref = href.trim();
  if (!normalizedHref) return false;

  if (
    normalizedHref.startsWith("/") &&
    !normalizedHref.startsWith("//")
  ) {
    return true;
  }

  if (
    normalizedHref.startsWith("#") ||
    normalizedHref.startsWith("?") ||
    normalizedHref.startsWith("./") ||
    normalizedHref.startsWith("../")
  ) {
    return true;
  }

  try {
    const url = new URL(
      normalizedHref.startsWith("//")
        ? `https:${normalizedHref}`
        : normalizedHref
    );

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      INTERNAL_HOSTNAMES.has(url.hostname.toLowerCase())
    );
  } catch {
    return false;
  }
};

export const removeNofollowFromRel = (rel?: string): string | undefined => {
  if (!rel) return undefined;

  const normalizedRel = rel
    .split(/\s+/)
    .filter(Boolean)
    .filter((value) => value.toLowerCase() !== "nofollow")
    .join(" ");

  return normalizedRel || undefined;
};

const normalizeInternalHref = (href: string): string => {
  try {
    const url = new URL(
      href.startsWith("//") ? `https:${href}` : href
    );
    if (!INTERNAL_HOSTNAMES.has(url.hostname.toLowerCase())) return href;
    url.protocol = "https:";
    url.hostname = "dongphucunivi.com";
    return url.toString();
  } catch {
    return href;
  }
};

export const normalizeInternalLinkAttributes = (
  attributes?: Record<string, string | undefined>
): void => {
  if (!attributes?.href || !isInternalHref(attributes.href)) return;

  // Normalize URL: http://www.dongphucunivi.com → https://dongphucunivi.com
  if (!attributes.href.startsWith("/") && !attributes.href.startsWith("#")) {
    attributes.href = normalizeInternalHref(attributes.href);
  }

  const rel = removeNofollowFromRel(attributes.rel);
  if (rel) {
    attributes.rel = rel;
  } else {
    delete attributes.rel;
  }
};

export const getEditorLinkAttributes = (
  href: string,
  openInNewTab: boolean
): EditorLinkAttributes => {
  const attributes: EditorLinkAttributes = {
    href,
    target: openInNewTab ? "_blank" : "",
  };

  if (isInternalHref(href)) {
    if (openInNewTab) {
      attributes.rel = "noopener noreferrer";
    }
    normalizeInternalLinkAttributes(attributes);
    return attributes;
  }

  if (openInNewTab) {
    attributes.rel = "noopener noreferrer nofollow";
  }

  return attributes;
};
