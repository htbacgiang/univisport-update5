import { parseDocument } from "htmlparser2";
import * as DomUtils from "domutils";
import db from "../utils/db";
import Post from "../models/Post";
import Product from "../models/Product";
import Author from "../models/Author";

export type SeoContentType = "post" | "product";
export type SeoEntityType =
  | "Business Topic"
  | "Sport"
  | "Material"
  | "Technology"
  | "Brand"
  | "Location"
  | "Audience"
  | "Product Category"
  | "Service"
  | "Attribute";

export interface SeoIssue {
  severity: "critical" | "warning" | "info";
  message: string;
}

export interface SeoCriterionScore {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  checks: {
    label: string;
    passed: boolean;
    value?: string | number;
  }[];
}

export interface SeoEntityMetric {
  entity: string;
  type: SeoEntityType;
  frequency: number;
  urlCount: number;
  positionWeight: number;
  score: number;
}

export interface SeoInternalLinkMetric {
  sourceUrl: string;
  sourcePath: string;
  targetUrl: string;
  targetPath: string;
  anchor: string;
  type: "Strong" | "Weak Link" | "Orphan" | "Too Many Links";
  status: "Detected" | "Orphan" | "Review";
}

export interface SeoKeywordHubItem {
  keyword: string;
  intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  volume: number | null;
  keywordDifficulty: number | null;
  priority: "High" | "Medium" | "Low";
  currentRank: number | null;
  targetRank: number | null;
  landingUrl: string;
  pillar: string;
  cluster: string;
}

export interface SeoIntegrationStatus {
  source: "MongoDB" | "Google Search Console" | "Google Analytics 4" | "Ahrefs" | "Semrush" | "CSV Import";
  configured: boolean;
  message: string;
}

export interface SeoAuditResult {
  id: string;
  sourceId: string;
  type: SeoContentType;
  title: string;
  url: string;
  path: string;
  slug: string;
  updatedAt: string;
  createdAt: string;
  author: string;
  category: string;
  topic: string;
  primaryKeyword: string;
  metaDescription: string;
  seoScore: number;
  criteria: SeoCriterionScore[];
  issues: SeoIssue[];
  suggestions: string[];
  internalLinks: SeoInternalLinkMetric[];
  metrics: {
    wordCount: number;
    keywordDensity: number;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    internalLinkCount: number;
    externalLinkCount: number;
    imageCount: number;
    imagesMissingAlt: number;
    imagesMissingSize: number;
    lazyImageCount: number;
    schemaTypes: string[];
    entityCount: number;
    referenceCount: number;
    aboutLinkCount: number;
  };
  entities: SeoEntityMetric[];
}

export interface SeoContentInventoryItem {
  id: string;
  title: string;
  url: string;
  path: string;
  type: SeoContentType;
  updatedAt: string;
  author: string;
  primaryKeyword: string;
  seoScore: number;
  category: string;
}

export interface TopicalCluster {
  name: string;
  currentUrlCount: number;
  targetUrlCount: number;
  coverageScore: number;
  urls: {
    title: string;
    url: string;
    type: SeoContentType;
    seoScore: number;
  }[];
  opportunities: string[];
}

export interface TopicalPillar {
  name: string;
  key: string;
  currentUrlCount: number;
  targetUrlCount: number;
  coverageScore: number;
  clusters: TopicalCluster[];
  opportunities: string[];
}

export interface SeoDashboardSummary {
  totalUrls: number;
  totalPosts: number;
  totalProducts: number;
  totalCategories: number;
  totalLandingPages: number;
  totalTags: number;
  indexedUrls: number | null;
  notIndexedUrls: number | null;
  averageSeoScore: number;
  technicalScore: number;
  internalLinkScore: number;
  topicalAuthority: number;
  averageRanking: number | null;
  organicTraffic: number | null;
  clicks: number | null;
  ctr: number | null;
  impressions: number | null;
  strongestUrls: SeoContentInventoryItem[];
  urlsNeedOptimization: SeoContentInventoryItem[];
  internalLinkCount: number;
  entityCoverage: number;
  topicalCoverage: number;
  scoreDistribution: { range: string; count: number }[];
  contentGrowth: { month: string; posts: number; products: number; total: number }[];
  topicCoverage: { topic: string; coverage: number; urls: number }[];
}

export interface SeoAuditPayload {
  generatedAt: string;
  inventory: SeoContentInventoryItem[];
  audits: SeoAuditResult[];
  entities: SeoEntityMetric[];
  keywordHub: SeoKeywordHubItem[];
  internalLinks: SeoInternalLinkMetric[];
  integrations: SeoIntegrationStatus[];
  topicalMap: TopicalPillar[];
  dashboard: SeoDashboardSummary;
}

interface SeoSourceImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: string;
}

interface SeoSourceLink {
  href: string;
  text: string;
  isInternal: boolean;
}

interface SeoSourceItem {
  id: string;
  sourceId: string;
  type: SeoContentType;
  title: string;
  slug: string;
  path: string;
  url: string;
  updatedAt: Date;
  createdAt: Date;
  author: string;
  category: string;
  topic: string;
  primaryKeyword: string;
  metaDescription: string;
  contentHtml: string;
  contentText: string;
  faqText: string;
  tags: string[];
  material: string;
  schemaTypes: string[];
  h1CountFromContent: number;
  h2Count: number;
  h3Count: number;
  links: SeoSourceLink[];
  images: SeoSourceImage[];
  entityMetrics: SeoEntityMetric[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dongphucunivi.com";
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "và",
  "với",
  "của",
  "cho",
  "các",
  "một",
  "những",
  "trong",
  "khi",
  "tại",
  "từ",
  "để",
  "là",
  "có",
  "được",
  "này",
  "theo",
  "về",
  "đến",
  "trên",
  "dưới",
  "bởi",
  "vào",
  "ra",
  "sản",
  "phẩm",
  "đồng",
  "phục",
  "univi",
  "không",
  "kia",
  "ứng",
  "dụng",
  "ông",
  "anh",
  "em",
  "dong",
  "phuc",
  "khong",
  "voi",
  "ung",
  "dung",
]);

const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const normalizeSlug = (value: string): string =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const compactText = (value: unknown): string =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const NORMALIZED_STOP_WORDS = new Set(Array.from(STOP_WORDS).map(normalizeText));

const stripHtml = (value: string): string =>
  compactText(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "));

const toDate = (value: unknown): Date => {
  const date = value ? new Date(value as string | number | Date) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const getAttr = (node: any, name: string): string => compactText(node?.attribs?.[name] || "");

const findTags = (html: string, tagName: string): any[] => {
  const document = parseDocument(html || "");
  return DomUtils.findAll(
    (node: any) => node?.type === "tag" && node.name === tagName,
    document.children as any[]
  );
};

const getHtmlText = (html: string): string => {
  const document = parseDocument(html || "");
  return compactText(DomUtils.textContent(document as any));
};

const countWords = (text: string): number => {
  const matches = compactText(text).match(/[A-Za-z0-9À-ỹ]+(?:[-'][A-Za-z0-9À-ỹ]+)*/g);
  return matches ? matches.length : 0;
};

const countKeywordOccurrences = (text: string, keyword: string): number => {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return 0;
  const normalizedText = normalizeText(text);
  const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = normalizedText.match(new RegExp(`(^|\\s|-)${escaped}(?=\\s|-|$)`, "g"));
  return matches ? matches.length : 0;
};

const keywordInText = (text: string, keyword: string): boolean => {
  const normalizedKeyword = normalizeText(keyword);
  if (!normalizedKeyword) return false;
  return normalizeText(text).includes(normalizedKeyword);
};

const clampScore = (score: number, maxScore: number): number => Math.max(0, Math.min(maxScore, Math.round(score)));

const unique = <T,>(items: T[]): T[] => Array.from(new Set(items));

const getPrimaryKeyword = (...candidates: Array<unknown>): string => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      const first = candidate.map(compactText).find(Boolean);
      if (first) return first;
      continue;
    }

    const value = compactText(candidate);
    if (!value) continue;

    const firstToken = value
      .split(/[,;|]/)
      .map((part) => compactText(part))
      .find(Boolean);
    if (firstToken) return firstToken;
  }

  return "";
};

const getTopicName = (category: string, primaryKeyword: string, title: string): string =>
  compactText(category || primaryKeyword || title || "Chưa phân loại");

const getSchemaTypes = (type: SeoContentType, hasFaqs: boolean): string[] => {
  const base = type === "post" ? ["Breadcrumb", "Article"] : ["Breadcrumb", "Product"];
  return hasFaqs ? [...base, "FAQ"] : base;
};

const getLinksFromHtml = (html: string): SeoSourceLink[] =>
  findTags(html, "a")
    .map((node) => {
      const href = getAttr(node, "href");
      const text = compactText(DomUtils.textContent(node as any));
      const isInternal =
        href.startsWith("/") ||
        href.startsWith("#") ||
        href.includes("dongphucunivi.com") ||
        href.includes(new URL(SITE_URL).hostname);
      return { href, text, isInternal };
    })
    .filter((link) => Boolean(link.href));

const GENERIC_ANCHOR_TEXT = new Set(["xem thêm", "click here", "tại đây", "chi tiết", "xem chi tiết", "đọc thêm"]);

const toInternalTarget = (href: string): { targetUrl: string; targetPath: string } | null => {
  if (!href || href.startsWith("#")) return null;

  try {
    const url = href.startsWith("/") ? new URL(href, SITE_URL) : new URL(href);
    const siteHostname = new URL(SITE_URL).hostname;
    if (url.hostname !== siteHostname && !url.hostname.includes("dongphucunivi.com")) return null;
    return {
      targetUrl: `${url.origin}${url.pathname}`,
      targetPath: url.pathname,
    };
  } catch {
    return null;
  }
};

const buildAuditInternalLinks = (item: SeoSourceItem): SeoInternalLinkMetric[] => {
  const internalLinks = item.links
    .map((link) => {
      const target = toInternalTarget(link.href);
      return target ? { link, target } : null;
    })
    .filter((value): value is { link: SeoSourceLink; target: { targetUrl: string; targetPath: string } } => Boolean(value));

  return internalLinks.map(({ link, target }) => {
    const normalizedAnchor = normalizeText(link.text);
    const isWeakAnchor = link.text.length < 8 || GENERIC_ANCHOR_TEXT.has(normalizedAnchor);
    return {
      sourceUrl: item.url,
      sourcePath: item.path,
      targetUrl: target.targetUrl,
      targetPath: target.targetPath,
      anchor: link.text || "(không có anchor)",
      type: internalLinks.length > 100 ? "Too Many Links" : isWeakAnchor ? "Weak Link" : "Strong",
      status: internalLinks.length > 100 || isWeakAnchor ? "Review" : "Detected",
    };
  });
};

const getImagesFromHtml = (html: string): SeoSourceImage[] =>
  findTags(html, "img")
    .map((node) => {
      const width = Number(getAttr(node, "width"));
      const height = Number(getAttr(node, "height"));
      return {
        src: getAttr(node, "src"),
        alt: getAttr(node, "alt"),
        width: Number.isFinite(width) && width > 0 ? width : undefined,
        height: Number.isFinite(height) && height > 0 ? height : undefined,
        loading: getAttr(node, "loading"),
      };
    })
    .filter((image) => Boolean(image.src));

const getProductImages = (product: any): SeoSourceImage[] => {
  const images: SeoSourceImage[] = [];
  const pushImage = (src: unknown, alt: string, width?: unknown, height?: unknown) => {
    const imageSrc = compactText(src);
    if (!imageSrc) return;
    const numericWidth = Number(width);
    const numericHeight = Number(height);
    images.push({
      src: imageSrc,
      alt,
      width: Number.isFinite(numericWidth) && numericWidth > 0 ? numericWidth : undefined,
      height: Number.isFinite(numericHeight) && numericHeight > 0 ? numericHeight : undefined,
      loading: "lazy",
    });
  };

  pushImage(product.image, product.name);
  if (Array.isArray(product.colors)) {
    product.colors.forEach((color: any) => pushImage(color?.image, compactText(`${product.name} ${color?.name || ""}`)));
  }
  if (Array.isArray(product.gallery)) {
    product.gallery.forEach((item: any) => pushImage(item?.src, product.name, item?.width, item?.height));
  }

  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
};

interface EntityDictionaryEntry {
  entity: string;
  type: SeoEntityType;
  variants?: string[];
}

interface EntityTextSource {
  text: string;
  weight: number;
}

const SEO_ENTITY_DICTIONARY: EntityDictionaryEntry[] = [
  { entity: "Gym", type: "Business Topic", variants: ["phòng gym", "gym center", "gym club"] },
  { entity: "Fitness", type: "Business Topic", variants: ["thể hình", "fitness gym"] },
  { entity: "Fitness Center", type: "Business Topic", variants: ["trung tâm fitness", "phòng tập fitness"] },
  { entity: "Personal Trainer", type: "Business Topic", variants: ["pt", "huấn luyện viên cá nhân"] },
  { entity: "Yoga", type: "Sport", variants: ["yoga studio", "phòng yoga"] },
  { entity: "Pilates", type: "Sport", variants: ["pilates studio"] },
  { entity: "Pickleball", type: "Sport", variants: ["pickleball club", "sân pickleball"] },
  { entity: "Running", type: "Sport", variants: ["chạy bộ", "runner", "marathon"] },
  { entity: "Tennis", type: "Sport", variants: ["quần vợt", "tennis club"] },
  { entity: "Golf", type: "Sport", variants: ["golf club", "sân golf"] },
  { entity: "MMA", type: "Sport", variants: ["mixed martial arts", "võ tổng hợp"] },
  { entity: "Boxing", type: "Sport", variants: ["boxing gym"] },
  { entity: "Muay Thai", type: "Sport", variants: ["muaythai"] },
  { entity: "Kickboxing", type: "Sport" },
  { entity: "Bóng đá", type: "Sport", variants: ["football", "soccer"] },
  { entity: "Bóng rổ", type: "Sport", variants: ["basketball"] },
  { entity: "Cầu lông", type: "Sport", variants: ["badminton"] },
  { entity: "Bơi lội", type: "Sport", variants: ["swimming"] },
  { entity: "Cycling", type: "Sport", variants: ["đạp xe", "xe đạp thể thao"] },
  { entity: "Polyester", type: "Material", variants: ["poly", "sợi polyester"] },
  { entity: "Spandex", type: "Material", variants: ["elastane", "thun co giãn"] },
  { entity: "Polyamide", type: "Material", variants: ["sợi polyamide"] },
  { entity: "Cotton", type: "Material", variants: ["cotton compact"] },
  { entity: "Nylon", type: "Material" },
  { entity: "Mesh", type: "Material", variants: ["vải mesh"] },
  { entity: "Interlock", type: "Material", variants: ["vải interlock"] },
  { entity: "Microfiber", type: "Material", variants: ["micro fiber"] },
  { entity: "Quick Dry", type: "Technology", variants: ["quickdry", "nhanh khô", "khô nhanh"] },
  { entity: "UNI DRY", type: "Technology", variants: ["unidry", "công nghệ uni dry"] },
  { entity: "UNI BLENDED", type: "Technology", variants: ["uniblended", "công nghệ uni blended"] },
  { entity: "SUPER COOL", type: "Technology", variants: ["supercool", "công nghệ super cool"] },
  { entity: "Anti UV", type: "Technology", variants: ["chống uv", "uv protection", "upf"] },
  { entity: "Moisture Wicking", type: "Technology", variants: ["thấm hút mồ hôi", "hút ẩm"] },
  { entity: "Breathable", type: "Attribute", variants: ["thoáng khí"] },
  { entity: "Co giãn 4 chiều", type: "Attribute", variants: ["4-way stretch", "co giãn bốn chiều"] },
  { entity: "Lightweight", type: "Attribute", variants: ["siêu nhẹ"] },
  { entity: "Đồng Phục Univi", type: "Brand", variants: ["dong phuc univi"] },
  { entity: "Univi", type: "Brand", variants: ["UNIVI"] },
  { entity: "Unicore Holdings", type: "Brand", variants: ["unicore"] },
  { entity: "Hà Nội", type: "Location", variants: ["ha noi", "hn"] },
  { entity: "Chương Mỹ", type: "Location", variants: ["chuong my", "phường chương mỹ", "đan phượng", "dan phuong"] },
  { entity: "Việt Nam", type: "Location", variants: ["viet nam", "vietnam"] },
  { entity: "TP Hồ Chí Minh", type: "Location", variants: ["hồ chí minh", "ho chi minh", "tphcm", "sài gòn"] },
  { entity: "Huấn luyện viên", type: "Audience", variants: ["trainer", "coach"] },
  { entity: "Lễ tân", type: "Audience", variants: ["receptionist"] },
  { entity: "Nhân viên phòng tập", type: "Audience", variants: ["nhân viên gym", "gym staff"] },
  { entity: "Câu lạc bộ thể thao", type: "Audience", variants: ["sports club", "club thể thao"] },
  { entity: "Doanh nghiệp", type: "Audience", variants: ["company", "công ty"] },
  { entity: "Đội nhóm", type: "Audience", variants: ["team", "team building"] },
  { entity: "Đồng phục gym", type: "Product Category", variants: ["áo gym", "quần áo gym"] },
  { entity: "Đồng phục yoga", type: "Product Category", variants: ["áo yoga", "quần áo yoga"] },
  { entity: "Đồng phục pickleball", type: "Product Category", variants: ["áo pickleball", "quần áo pickleball"] },
  { entity: "Đồng phục tennis", type: "Product Category", variants: ["áo tennis"] },
  { entity: "Đồng phục golf", type: "Product Category", variants: ["áo golf"] },
  { entity: "Đồng phục chạy bộ", type: "Product Category", variants: ["áo chạy bộ", "running shirt"] },
  { entity: "Đồng phục MMA", type: "Product Category", variants: ["áo mma"] },
  { entity: "Áo thun thể thao", type: "Product Category", variants: ["sport t-shirt", "áo phông thể thao"] },
  { entity: "Áo polo thể thao", type: "Product Category", variants: ["sport polo", "polo thể thao"] },
  { entity: "Áo tanktop", type: "Product Category", variants: ["tank top", "áo ba lỗ thể thao"] },
  { entity: "Áo khoác thể thao", type: "Product Category", variants: ["jacket thể thao", "áo gió thể thao"] },
  { entity: "Quần short thể thao", type: "Product Category", variants: ["short thể thao"] },
  { entity: "Set đồng phục", type: "Product Category", variants: ["bộ đồng phục", "set đồ thể thao"] },
  { entity: "Thiết kế đồng phục", type: "Service", variants: ["thiết kế áo đồng phục"] },
  { entity: "Sản xuất đồng phục", type: "Service", variants: ["may đồng phục", "xưởng may đồng phục"] },
  { entity: "In chuyển nhiệt", type: "Service", variants: ["heat transfer"] },
  { entity: "In lụa", type: "Service", variants: ["silk screen"] },
  { entity: "In decal", type: "Service" },
  { entity: "Thêu logo", type: "Service", variants: ["embroidered logo"] },
];

const normalizeEntityText = (value: string): string =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isValidEntityPhrase = (phrase: string): boolean => {
  const parts = phrase.split(" ").filter(Boolean);
  if (parts.length === 0 || parts.length > 4) return false;
  return !(parts.length === 1 && NORMALIZED_STOP_WORDS.has(parts[0]));
};

const ENTITY_DICTIONARY = SEO_ENTITY_DICTIONARY.map((entry) => ({
  ...entry,
  normalizedVariants: unique([entry.entity, ...(entry.variants || [])])
    .map(normalizeEntityText)
    .filter(isValidEntityPhrase),
})).filter((entry) => entry.normalizedVariants.length > 0);

const countPhraseOccurrences = (normalizedText: string, normalizedPhrase: string): number => {
  if (!normalizedText || !normalizedPhrase) return 0;
  const escaped = normalizedPhrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matches = normalizedText.match(new RegExp(`(^|\\s)${escaped}(?=\\s|$)`, "g"));
  return matches ? matches.length : 0;
};

const extractEntityMetrics = (sources: EntityTextSource[]): SeoEntityMetric[] => {
  const byEntity = new Map<string, SeoEntityMetric>();

  sources.forEach((source) => {
    const normalizedText = normalizeEntityText(source.text);
    if (!normalizedText) return;

    ENTITY_DICTIONARY.forEach((entry) => {
      const frequency = entry.normalizedVariants.reduce(
        (total, variant) => total + countPhraseOccurrences(normalizedText, variant),
        0
      );

      if (frequency === 0) return;

      const key = normalizeEntityText(entry.entity);
      const current =
        byEntity.get(key) ||
        {
          entity: entry.entity,
          type: entry.type,
          frequency: 0,
          urlCount: 1,
          positionWeight: 0,
          score: 0,
        };

      current.frequency += frequency;
      current.positionWeight += source.weight;
      current.score = current.frequency + current.urlCount + current.positionWeight;
      byEntity.set(key, current);
    });
  });

  return Array.from(byEntity.values())
    .sort((a, b) => b.score - a.score || b.frequency - a.frequency || a.entity.localeCompare(b.entity))
    .slice(0, 30);
};

const scoreTitle = (item: SeoSourceItem): SeoCriterionScore => {
  const length = item.title.length;
  const checks = [
    { label: "Có title", passed: Boolean(item.title), value: item.title || "Thiếu" },
    { label: "Độ dài 30-60 ký tự", passed: length >= 30 && length <= 60, value: length },
    { label: "Có keyword chính", passed: keywordInText(item.title, item.primaryKeyword), value: item.primaryKeyword || "Chưa xác định" },
  ];
  const score = (checks[0].passed ? 4 : 0) + (checks[1].passed ? 3 : length >= 20 && length <= 70 ? 1 : 0) + (checks[2].passed ? 3 : 0);
  return { key: "title", label: "Title", score: clampScore(score, 10), maxScore: 10, checks };
};

const scoreMetaDescription = (item: SeoSourceItem): SeoCriterionScore => {
  const length = item.metaDescription.length;
  const checks = [
    { label: "Có meta description", passed: Boolean(item.metaDescription), value: item.metaDescription || "Thiếu" },
    { label: "Độ dài 120-160 ký tự", passed: length >= 120 && length <= 160, value: length },
    { label: "Có keyword chính", passed: keywordInText(item.metaDescription, item.primaryKeyword), value: item.primaryKeyword || "Chưa xác định" },
  ];
  const score = (checks[0].passed ? 4 : 0) + (checks[1].passed ? 4 : length >= 80 && length <= 180 ? 2 : 0) + (checks[2].passed ? 2 : 0);
  return { key: "meta", label: "Meta Description", score: clampScore(score, 10), maxScore: 10, checks };
};

const scoreUrl = (item: SeoSourceItem): SeoCriterionScore => {
  const slug = item.slug || item.path;
  const specialChars = /[^a-z0-9/-]/i.test(slug);
  const checks = [
    { label: "URL ngắn gọn", passed: item.path.length <= 75 && item.path.split("/").filter(Boolean).length <= 3, value: item.path.length },
    { label: "Không chứa ký tự đặc biệt", passed: !specialChars && !slug.includes("_"), value: item.path },
    { label: "Có keyword chính", passed: keywordInText(slug.replace(/-/g, " "), item.primaryKeyword), value: item.primaryKeyword || "Chưa xác định" },
  ];
  const score = (checks[0].passed ? 4 : 1) + (checks[1].passed ? 3 : 0) + (checks[2].passed ? 3 : 0);
  return { key: "url", label: "URL", score: clampScore(score, 10), maxScore: 10, checks };
};

const scoreHeading = (item: SeoSourceItem): SeoCriterionScore => {
  const h1Count = 1 + item.h1CountFromContent;
  const checks = [
    { label: "H1 duy nhất", passed: h1Count === 1, value: h1Count },
    { label: "Có H2", passed: item.h2Count > 0, value: item.h2Count },
    { label: "Có H3", passed: item.h3Count > 0, value: item.h3Count },
  ];
  const score = (checks[0].passed ? 5 : 0) + (checks[1].passed ? 3 : 0) + (checks[2].passed ? 2 : 0);
  return { key: "heading", label: "Heading Structure", score, maxScore: 10, checks };
};

const scoreContent = (item: SeoSourceItem): SeoCriterionScore => {
  const wordCount = countWords(item.contentText);
  const keywordCount = countKeywordOccurrences(item.contentText, item.primaryKeyword);
  const keywordDensity = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0;
  const relatedTerms = unique([...item.tags, item.material, item.category, ...item.entityMetrics.map((entity) => entity.entity)])
    .map(compactText)
    .filter((term) => term && !keywordInText(term, item.primaryKeyword));
  const entityCount = item.entityMetrics.length;
  const checks = [
    { label: "Số từ", passed: wordCount >= 500, value: wordCount },
    { label: "Mật độ từ khóa 0.5%-2.5%", passed: keywordDensity >= 0.5 && keywordDensity <= 2.5, value: Number(keywordDensity.toFixed(2)) },
    { label: "Từ khóa liên quan", passed: relatedTerms.length >= 3, value: relatedTerms.length },
    { label: "Entity liên quan", passed: entityCount >= 4, value: entityCount },
  ];
  const wordScore = wordCount >= 800 ? 6 : wordCount >= 500 ? 5 : wordCount >= 300 ? 4 : wordCount >= 150 ? 2 : 0;
  const densityScore = checks[1].passed ? 5 : keywordDensity > 0 && keywordDensity <= 4 ? 3 : 0;
  const relatedScore = relatedTerms.length >= 5 ? 5 : relatedTerms.length >= 3 ? 3 : relatedTerms.length > 0 ? 1 : 0;
  const entityScore = entityCount >= 4 ? 4 : entityCount >= 2 ? 2 : entityCount > 0 ? 1 : 0;
  return { key: "content", label: "Content Quality", score: clampScore(wordScore + densityScore + relatedScore + entityScore, 20), maxScore: 20, checks };
};

const scoreInternalLinks = (item: SeoSourceItem): SeoCriterionScore => {
  const internalLinks = item.links.filter((link) => link.isInternal && !link.href.startsWith("#"));
  const descriptiveAnchors = internalLinks.filter((link) => link.text.length >= 8 && !["xem thêm", "click here", "tại đây"].includes(normalizeText(link.text)));
  const checks = [
    { label: "Số lượng Internal Link", passed: internalLinks.length >= 3, value: internalLinks.length },
    { label: "Anchor Text rõ nghĩa", passed: internalLinks.length > 0 && descriptiveAnchors.length / internalLinks.length >= 0.7, value: descriptiveAnchors.length },
  ];
  const countScore = internalLinks.length >= 5 ? 5 : internalLinks.length >= 3 ? 4 : internalLinks.length >= 1 ? 2 : 0;
  const anchorScore = checks[1].passed ? 5 : descriptiveAnchors.length > 0 ? 2 : 0;
  return { key: "internal_links", label: "Internal Link", score: clampScore(countScore + anchorScore, 10), maxScore: 10, checks };
};

const scoreImages = (item: SeoSourceItem): SeoCriterionScore => {
  const images = item.images;
  const withAlt = images.filter((image) => Boolean(image.alt));
  const withSize = images.filter((image) => Boolean(image.width && image.height));
  const lazy = images.filter((image) => image.loading === "lazy");
  const checks = [
    { label: "Có hình ảnh", passed: images.length > 0, value: images.length },
    { label: "ALT đầy đủ", passed: images.length > 0 && withAlt.length === images.length, value: `${withAlt.length}/${images.length}` },
    { label: "Width/Height đầy đủ", passed: images.length > 0 && withSize.length === images.length, value: `${withSize.length}/${images.length}` },
    { label: "Lazy Load", passed: images.length > 0 && lazy.length === images.length, value: `${lazy.length}/${images.length}` },
  ];
  const score = (checks[0].passed ? 2 : 0) + (checks[1].passed ? 3 : withAlt.length > 0 ? 1 : 0) + (checks[2].passed ? 3 : withSize.length > 0 ? 1 : 0) + (checks[3].passed ? 2 : lazy.length > 0 ? 1 : 0);
  return { key: "images", label: "Images", score: clampScore(score, 10), maxScore: 10, checks };
};

const scoreSchema = (item: SeoSourceItem): SeoCriterionScore => {
  const hasArticle = item.schemaTypes.includes("Article");
  const hasProduct = item.schemaTypes.includes("Product");
  const hasFaq = item.schemaTypes.includes("FAQ");
  const hasBreadcrumb = item.schemaTypes.includes("Breadcrumb");
  const hasExpectedPrimary = item.type === "post" ? hasArticle : hasProduct;
  const checks = [
    { label: "Article Schema", passed: item.type !== "post" || hasArticle, value: hasArticle ? "Có" : "Thiếu" },
    { label: "Product Schema", passed: item.type !== "product" || hasProduct, value: hasProduct ? "Có" : "Thiếu" },
    { label: "FAQ Schema", passed: hasFaq, value: hasFaq ? "Có" : "Thiếu" },
    { label: "Breadcrumb Schema", passed: hasBreadcrumb, value: hasBreadcrumb ? "Có" : "Thiếu" },
  ];
  const score = (hasExpectedPrimary ? 3 : 0) + (hasFaq ? 2 : 0) + (hasBreadcrumb ? 2 : 0) + (item.title && item.metaDescription ? 3 : 1);
  return { key: "schema", label: "Schema", score: clampScore(score, 10), maxScore: 10, checks };
};

const scoreEeat = (item: SeoSourceItem): SeoCriterionScore => {
  const externalLinks = item.links.filter((link) => !link.isInternal);
  const aboutLinks = item.links.filter((link) => /gioi-thieu|tac-gia|lien-he|about|author/i.test(link.href));
  const checks = [
    { label: "Author", passed: Boolean(item.author), value: item.author || "Thiếu" },
    { label: "Updated Date", passed: Boolean(item.updatedAt), value: item.updatedAt.toISOString() },
    { label: "References", passed: externalLinks.length > 0, value: externalLinks.length },
    { label: "About Page Link", passed: aboutLinks.length > 0, value: aboutLinks.length },
  ];
  const score = (checks[0].passed ? 3 : 0) + (checks[1].passed ? 2 : 0) + (checks[2].passed ? 3 : 0) + (checks[3].passed ? 2 : 0);
  return { key: "eeat", label: "E-E-A-T", score, maxScore: 10, checks };
};

const buildIssuesAndSuggestions = (item: SeoSourceItem, criteria: SeoCriterionScore[]): { issues: SeoIssue[]; suggestions: string[] } => {
  const issues: SeoIssue[] = [];
  const suggestions: string[] = [];
  const getCriterion = (key: string) => criteria.find((criterion) => criterion.key === key);
  const add = (condition: boolean, severity: SeoIssue["severity"], issue: string, suggestion: string) => {
    if (!condition) return;
    issues.push({ severity, message: issue });
    suggestions.push(suggestion);
  };

  const title = getCriterion("title");
  add(!title?.checks[0].passed, "critical", "Thiếu Title", "Bổ sung SEO title chứa keyword chính.");
  add(!title?.checks[1].passed, "warning", "Title chưa đạt độ dài 30-60 ký tự", "Rút gọn hoặc mở rộng title về khoảng 30-60 ký tự.");
  add(!title?.checks[2].passed, "warning", "Title chưa có keyword chính", `Thêm keyword "${item.primaryKeyword}" vào title một cách tự nhiên.`);

  const meta = getCriterion("meta");
  add(!meta?.checks[0].passed, "critical", "Thiếu Meta Description", "Viết meta description 120-160 ký tự, nêu rõ lợi ích và CTA.");
  add(!meta?.checks[1].passed, "warning", "Meta Description chưa đạt độ dài 120-160 ký tự", "Tối ưu meta description về khoảng 120-160 ký tự.");
  add(!meta?.checks[2].passed, "warning", "Meta Description chưa có keyword", `Bổ sung keyword "${item.primaryKeyword}" vào meta description.`);

  const url = getCriterion("url");
  add(!url?.checks[0].passed, "info", "URL còn dài", "Rút gọn slug, giữ từ khóa chính và bỏ từ nối không cần thiết.");
  add(!url?.checks[1].passed, "warning", "URL chứa ký tự đặc biệt", "Chuẩn hóa slug chỉ dùng chữ thường, số và dấu gạch ngang.");
  add(!url?.checks[2].passed, "warning", "URL chưa có keyword chính", `Cân nhắc đưa "${normalizeSlug(item.primaryKeyword)}" vào slug.`);

  const heading = getCriterion("heading");
  add(!heading?.checks[0].passed, "critical", "H1 không duy nhất", "Đảm bảo trang chỉ có một H1, các đề mục phụ dùng H2/H3.");
  add(!heading?.checks[1].passed, "warning", "Chưa có H2", "Bổ sung H2 để chia cụm nội dung rõ ràng.");
  add(!heading?.checks[2].passed, "info", "Chưa có H3", "Bổ sung H3 cho các ý con trong từng cụm H2.");

  const content = getCriterion("content");
  add(!content?.checks[0].passed, "warning", "Nội dung còn mỏng", "Mở rộng nội dung với hướng dẫn, lợi ích, quy trình, FAQ hoặc bảng so sánh.");
  add(!content?.checks[1].passed, "warning", "Mật độ keyword chưa tối ưu", `Điều chỉnh mật độ "${item.primaryKeyword}" về khoảng 0.5%-2.5%.`);
  add(!content?.checks[2].passed, "info", "Thiếu từ khóa liên quan", "Bổ sung thêm biến thể từ khóa và chủ đề phụ đang xuất hiện trong topical map.");
  add(!content?.checks[3].passed, "info", "Thiếu entity liên quan", "Bổ sung entity nổi bật từ cụm chủ đề để tăng topical authority.");

  const internalLinks = item.links.filter((link) => link.isInternal && !link.href.startsWith("#"));
  add(internalLinks.length < 3, "warning", `Chỉ có ${internalLinks.length} Internal Link`, "Thêm 3 Internal Link tới bài viết hoặc sản phẩm liên quan.");
  add(internalLinks.length > 0 && getCriterion("internal_links")?.checks[1].passed === false, "info", "Anchor Text chưa rõ nghĩa", "Đổi anchor text từ chung chung sang cụm mô tả trang đích.");

  const missingAlt = item.images.filter((image) => !image.alt).length;
  const missingSize = item.images.filter((image) => !image.width || !image.height).length;
  const missingLazy = item.images.filter((image) => image.loading !== "lazy").length;
  add(item.images.length === 0, "warning", "Chưa có hình ảnh trong nội dung", "Thêm hình ảnh minh họa có ALT mô tả keyword hoặc entity chính.");
  add(missingAlt > 0, "warning", `Thiếu ALT Image ở ${missingAlt} ảnh`, "Bổ sung ALT cho toàn bộ ảnh chính và ảnh trong bài.");
  add(missingSize > 0, "info", `Thiếu Width/Height ở ${missingSize} ảnh`, "Khai báo width và height để giảm layout shift.");
  add(missingLazy > 0, "info", `${missingLazy} ảnh chưa bật Lazy Load`, "Thêm loading=\"lazy\" cho ảnh dưới màn hình đầu tiên.");

  add(!item.schemaTypes.includes("FAQ"), "warning", "Chưa có FAQ Schema", "Thêm FAQ thực tế để hệ thống render FAQ Schema.");
  add(!item.schemaTypes.includes("Breadcrumb"), "warning", "Thiếu Breadcrumb Schema", "Đảm bảo schema BreadcrumbList được truyền qua meta.schema.");

  const externalLinks = item.links.filter((link) => !link.isInternal);
  const aboutLinks = item.links.filter((link) => /gioi-thieu|tac-gia|lien-he|about|author/i.test(link.href));
  add(!item.author, "warning", "Thiếu Author", "Gán tác giả hoặc nguồn chịu trách nhiệm nội dung.");
  add(externalLinks.length === 0, "info", "Thiếu References", "Thêm nguồn tham khảo uy tín nếu nội dung có số liệu, tiêu chuẩn hoặc tuyên bố kỹ thuật.");
  add(aboutLinks.length === 0, "info", "Thiếu About Page Link", "Thêm liên kết tới trang giới thiệu, liên hệ hoặc tác giả để hỗ trợ E-E-A-T.");

  item.entityMetrics.slice(0, 5).forEach((entity) => {
    if (!keywordInText(item.title, entity.entity) && !keywordInText(item.metaDescription, entity.entity)) {
      suggestions.push(`Bổ sung Entity "${entity.entity}" vào heading, FAQ hoặc đoạn mô tả nếu phù hợp.`);
    }
  });

  return {
    issues,
    suggestions: unique(suggestions).slice(0, 12),
  };
};

const auditItem = (item: SeoSourceItem): SeoAuditResult => {
  const criteria = [
    scoreTitle(item),
    scoreMetaDescription(item),
    scoreUrl(item),
    scoreHeading(item),
    scoreContent(item),
    scoreInternalLinks(item),
    scoreImages(item),
    scoreSchema(item),
    scoreEeat(item),
  ];
  const score = criteria.reduce((total, criterion) => total + criterion.score, 0);
  const { issues, suggestions } = buildIssuesAndSuggestions(item, criteria);
  const wordCount = countWords(item.contentText);
  const keywordDensity = wordCount > 0 ? (countKeywordOccurrences(item.contentText, item.primaryKeyword) / wordCount) * 100 : 0;
  const internalLinks = buildAuditInternalLinks(item);

  return {
    id: item.id,
    sourceId: item.sourceId,
    type: item.type,
    title: item.title,
    url: item.url,
    path: item.path,
    slug: item.slug,
    updatedAt: item.updatedAt.toISOString(),
    createdAt: item.createdAt.toISOString(),
    author: item.author,
    category: item.category,
    topic: item.topic,
    primaryKeyword: item.primaryKeyword,
    metaDescription: item.metaDescription,
    seoScore: clampScore(score, 100),
    criteria,
    issues,
    suggestions,
    internalLinks,
    metrics: {
      wordCount,
      keywordDensity: Number(keywordDensity.toFixed(2)),
      h1Count: 1 + item.h1CountFromContent,
      h2Count: item.h2Count,
      h3Count: item.h3Count,
      internalLinkCount: item.links.filter((link) => link.isInternal && !link.href.startsWith("#")).length,
      externalLinkCount: item.links.filter((link) => !link.isInternal).length,
      imageCount: item.images.length,
      imagesMissingAlt: item.images.filter((image) => !image.alt).length,
      imagesMissingSize: item.images.filter((image) => !image.width || !image.height).length,
      lazyImageCount: item.images.filter((image) => image.loading === "lazy").length,
      schemaTypes: item.schemaTypes,
      entityCount: item.entityMetrics.length,
      referenceCount: item.links.filter((link) => !link.isInternal).length,
      aboutLinkCount: item.links.filter((link) => /gioi-thieu|tac-gia|lien-he|about|author/i.test(link.href)).length,
    },
    entities: item.entityMetrics,
  };
};

const buildPostSource = (post: any): SeoSourceItem => {
  const contentHtml = compactText(post.content);
  const contentText = getHtmlText(contentHtml) || stripHtml(contentHtml);
  const faqs = Array.isArray(post.faqs) ? post.faqs : [];
  const faqText = compactText(faqs.map((faq: any) => `${faq?.question || ""} ${faq?.answer || ""}`).join(" "));
  const authorDoc = post.postAuthor || post.author || {};
  const authorName = compactText(authorDoc.name || "Team SEO Univi");
  const title = compactText(post.title);
  const tags = Array.isArray(post.tags) ? post.tags.map(compactText).filter(Boolean) : [];
  const primaryKeyword = getPrimaryKeyword(post.focusKeyword, post.keywords, tags, post.category, title);
  const category = compactText(post.category || "Blog");
  const path = `/bai-viet/${post.slug}`;
  const schemaTypes = getSchemaTypes("post", faqs.length > 0);
  const images = [
    ...getImagesFromHtml(contentHtml),
    ...(post.thumbnail?.url
      ? [{ src: post.thumbnail.url, alt: title, width: 1200, height: 630, loading: "lazy" }]
      : []),
  ];
  const entityMetrics = extractEntityMetrics([
    { text: title, weight: 5 },
    { text: contentText, weight: 1 },
    { text: faqText, weight: 2 },
    { text: tags.join(" "), weight: 3 },
    { text: category, weight: 3 },
  ]);

  return {
    id: `post:${post._id}`,
    sourceId: String(post._id),
    type: "post",
    title,
    slug: compactText(post.slug),
    path,
    url: `${SITE_URL}${path}`,
    updatedAt: toDate(post.updatedAt || post.createdAt),
    createdAt: toDate(post.createdAt),
    author: authorName,
    category,
    topic: getTopicName(category, primaryKeyword, title),
    primaryKeyword,
    metaDescription: compactText(post.meta),
    contentHtml,
    contentText: compactText(`${contentText} ${faqText}`),
    faqText,
    tags,
    material: "",
    schemaTypes,
    h1CountFromContent: findTags(contentHtml, "h1").length,
    h2Count: findTags(contentHtml, "h2").length,
    h3Count: findTags(contentHtml, "h3").length,
    links: getLinksFromHtml(contentHtml),
    images,
    entityMetrics,
  };
};

const buildProductSource = (product: any): SeoSourceItem => {
  const title = compactText(product.name);
  const description = compactText(product.description);
  const contentHtml = compactText(product.content);
  const bodyText = compactText(`${description} ${getHtmlText(contentHtml) || stripHtml(contentHtml)}`);
  const faqs = Array.isArray(product.faqs) ? product.faqs : [];
  const faqText = compactText(faqs.map((faq: any) => `${faq?.question || ""} ${faq?.answer || ""}`).join(" "));
  const category = compactText(product.categoryNameVN || product.category || "Product");
  const material = compactText(product.material);
  const primaryKeyword = getPrimaryKeyword(title, product.maSanPham, category, material);
  const path = `/san-pham/${product.slug}`;
  const schemaTypes = getSchemaTypes("product", faqs.length > 0);
  const tags = unique([category, material, compactText(product.shirtType)].filter(Boolean));
  const entityMetrics = extractEntityMetrics([
    { text: title, weight: 5 },
    { text: bodyText, weight: 1 },
    { text: faqText, weight: 2 },
    { text: category, weight: 3 },
    { text: material, weight: 3 },
  ]);

  return {
    id: `product:${product._id}`,
    sourceId: String(product._id),
    type: "product",
    title,
    slug: compactText(product.slug),
    path,
    url: `${SITE_URL}${path}`,
    updatedAt: toDate(product.updatedAt || product.createdAt),
    createdAt: toDate(product.createdAt),
    author: "Đồng Phục Univi",
    category,
    topic: getTopicName(category, primaryKeyword, title),
    primaryKeyword,
    metaDescription: description,
    contentHtml,
    contentText: compactText(`${bodyText} ${faqText}`),
    faqText,
    tags,
    material,
    schemaTypes,
    h1CountFromContent: findTags(contentHtml, "h1").length,
    h2Count: findTags(contentHtml, "h2").length,
    h3Count: findTags(contentHtml, "h3").length,
    links: getLinksFromHtml(contentHtml),
    images: [...getProductImages(product), ...getImagesFromHtml(contentHtml)],
    entityMetrics,
  };
};

export const readSeoSourceItems = async (): Promise<SeoSourceItem[]> => {
  await db.connectDb();
  const _authorModel = Author;
  const [posts, products] = await Promise.all([
    Post.find({ isDraft: { $ne: true }, isDirectPost: { $ne: true } })
      .populate("postAuthor")
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean(),
    Product.find({})
      .sort({ displayOrder: 1, updatedAt: -1, createdAt: -1 })
      .lean(),
  ]);

  return [
    ...(posts as any[]).map(buildPostSource),
    ...(products as any[]).map(buildProductSource),
  ].filter((item) => item.title && item.slug);
};

const buildInventory = (audits: SeoAuditResult[]): SeoContentInventoryItem[] =>
  audits.map((audit) => ({
    id: audit.id,
    title: audit.title,
    url: audit.url,
    path: audit.path,
    type: audit.type,
    updatedAt: audit.updatedAt,
    author: audit.author,
    primaryKeyword: audit.primaryKeyword,
    seoScore: audit.seoScore,
    category: audit.category,
  }));

const aggregateEntities = (audits: SeoAuditResult[]): SeoEntityMetric[] => {
  const map = new Map<string, SeoEntityMetric>();
  audits.forEach((audit) => {
    const seenInUrl = new Set<string>();
    audit.entities.forEach((metric) => {
      const normalized = normalizeText(metric.entity);
      const current =
        map.get(normalized) ||
        {
          entity: metric.entity,
          type: metric.type,
          frequency: 0,
          urlCount: 0,
          positionWeight: 0,
          score: 0,
        };
      current.frequency += metric.frequency;
      current.positionWeight += metric.positionWeight;
      if (!seenInUrl.has(normalized)) {
        current.urlCount += 1;
        seenInUrl.add(normalized);
      }
      current.score = current.frequency + current.urlCount + current.positionWeight;
      map.set(normalized, current);
    });
  });

  return Array.from(map.values())
    .sort((a, b) => b.score - a.score || b.urlCount - a.urlCount || b.frequency - a.frequency || a.entity.localeCompare(b.entity))
    .slice(0, 100);
};

const getCriterionScorePercent = (audit: SeoAuditResult, keys: string[]): number => {
  const criteria = audit.criteria.filter((criterion) => keys.includes(criterion.key));
  const maxScore = criteria.reduce((total, criterion) => total + criterion.maxScore, 0);
  if (maxScore === 0) return 0;
  const score = criteria.reduce((total, criterion) => total + criterion.score, 0);
  return Math.round((score / maxScore) * 100);
};

const average = (values: number[]): number =>
  values.length > 0 ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0;

const inferKeywordIntent = (keyword: string): SeoKeywordHubItem["intent"] => {
  const normalized = normalizeText(keyword);
  if (/gia|bang gia|bao gia|mua|dat may|dat hang|xưởng|xuong/.test(normalized)) return "Transactional";
  if (/mau|thiet ke|dong phuc|ao|quan|san pham/.test(normalized)) return "Commercial";
  if (/univi|dong phuc univi|unicore/.test(normalized)) return "Navigational";
  return "Informational";
};

const getKeywordPriority = (audit: SeoAuditResult): SeoKeywordHubItem["priority"] => {
  if (audit.seoScore < 70 || audit.issues.some((issue) => issue.severity === "critical")) return "High";
  if (audit.seoScore < 85 || audit.metrics.entityCount < 4 || audit.metrics.internalLinkCount < 3) return "Medium";
  return "Low";
};

const buildKeywordHub = (audits: SeoAuditResult[]): SeoKeywordHubItem[] =>
  audits
    .filter((audit) => Boolean(audit.primaryKeyword))
    .map((audit) => ({
      keyword: audit.primaryKeyword,
      intent: inferKeywordIntent(audit.primaryKeyword),
      volume: null,
      keywordDifficulty: null,
      priority: getKeywordPriority(audit),
      currentRank: null,
      targetRank: null,
      landingUrl: audit.path,
      pillar: audit.category,
      cluster: audit.entities[0]?.entity || audit.primaryKeyword,
    }))
    .sort((a, b) => {
      const priorityScore = { High: 3, Medium: 2, Low: 1 };
      return priorityScore[b.priority] - priorityScore[a.priority] || a.keyword.localeCompare(b.keyword);
    });

const buildInternalLinks = (audits: SeoAuditResult[]): SeoInternalLinkMetric[] => {
  const rows = audits.flatMap((audit) => audit.internalLinks);
  const incomingPaths = new Set(rows.map((row) => row.targetPath));

  audits.forEach((audit) => {
    if (incomingPaths.has(audit.path)) return;
    rows.push({
      sourceUrl: "",
      sourcePath: "",
      targetUrl: audit.url,
      targetPath: audit.path,
      anchor: "",
      type: "Orphan",
      status: "Orphan",
    });
  });

  return rows.sort((a, b) => {
    const priority = { Orphan: 4, "Too Many Links": 3, "Weak Link": 2, Strong: 1 };
    return priority[b.type] - priority[a.type] || a.targetPath.localeCompare(b.targetPath);
  });
};

const buildIntegrations = (): SeoIntegrationStatus[] => [
  {
    source: "MongoDB",
    configured: true,
    message: "Đang đọc trực tiếp Post/Product/Author từ MongoDB.",
  },
  {
    source: "Google Analytics 4",
    configured: Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID),
    message: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID
      ? "Đã cấu hình measurement ID, chưa có pipeline tổng hợp organic traffic server-side."
      : "Chưa cấu hình GA4 measurement ID.",
  },
  {
    source: "Google Search Console",
    configured: Boolean(process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL || process.env.GSC_SITE_URL),
    message: "Chưa có connector Search Console để lấy index/ranking/clicks/impressions.",
  },
  {
    source: "Ahrefs",
    configured: Boolean(process.env.AHREFS_API_TOKEN),
    message: "Chưa có token Ahrefs hoặc job import dữ liệu ranking.",
  },
  {
    source: "Semrush",
    configured: Boolean(process.env.SEMRUSH_API_KEY),
    message: "Chưa có API key Semrush hoặc job import dữ liệu ranking.",
  },
  {
    source: "CSV Import",
    configured: false,
    message: "Chưa có màn import CSV ranking/traffic.",
  },
];

const buildTopicalMap = (audits: SeoAuditResult[]): TopicalPillar[] => {
  const byPillar = new Map<string, SeoAuditResult[]>();
  audits.forEach((audit) => {
    const key = normalizeSlug(audit.category || audit.topic || audit.type);
    byPillar.set(key, [...(byPillar.get(key) || []), audit]);
  });

  return Array.from(byPillar.entries())
    .map(([key, pillarAudits]) => {
      const byCluster = new Map<string, SeoAuditResult[]>();
      const pillarSignals = new Set<string>();

      pillarAudits.forEach((audit) => {
        const clusterName = compactText(audit.primaryKeyword || audit.entities[0]?.entity || audit.title);
        const clusterKey = normalizeSlug(clusterName);
        byCluster.set(clusterKey, [...(byCluster.get(clusterKey) || []), audit]);
        audit.entities.slice(0, 8).forEach((entity) => pillarSignals.add(normalizeSlug(entity.entity)));
        if (audit.primaryKeyword) pillarSignals.add(normalizeSlug(audit.primaryKeyword));
      });

      const clusters = Array.from(byCluster.entries())
        .map(([, clusterAudits]) => {
          const clusterSignals = new Set<string>();
          clusterAudits.forEach((audit) => {
            audit.entities.slice(0, 5).forEach((entity) => clusterSignals.add(normalizeSlug(entity.entity)));
            if (audit.primaryKeyword) clusterSignals.add(normalizeSlug(audit.primaryKeyword));
          });
          const currentUrlCount = clusterAudits.length;
          const targetUrlCount = Math.max(currentUrlCount, clusterSignals.size || currentUrlCount);
          const coverageScore = targetUrlCount > 0 ? Math.min(100, Math.round((currentUrlCount / targetUrlCount) * 100)) : 100;
          const opportunities = Array.from(clusterSignals)
            .filter((signal) => !clusterAudits.some((audit) => normalizeSlug(audit.title).includes(signal)))
            .slice(0, 5)
            .map((signal) => `Tạo hoặc mở rộng nội dung cho entity "${signal.replace(/-/g, " ")}".`);

          return {
            name: clusterAudits[0]?.primaryKeyword || clusterAudits[0]?.title || "Cluster",
            currentUrlCount,
            targetUrlCount,
            coverageScore,
            urls: clusterAudits
              .sort((a, b) => b.seoScore - a.seoScore)
              .map((audit) => ({ title: audit.title, url: audit.url, type: audit.type, seoScore: audit.seoScore })),
            opportunities,
          };
        })
        .sort((a, b) => b.currentUrlCount - a.currentUrlCount || a.name.localeCompare(b.name));

      const currentUrlCount = pillarAudits.length;
      const targetUrlCount = Math.max(currentUrlCount, pillarSignals.size || currentUrlCount);
      const coverageScore = targetUrlCount > 0 ? Math.min(100, Math.round((currentUrlCount / targetUrlCount) * 100)) : 100;
      const opportunities = Array.from(pillarSignals)
        .filter((signal) => !pillarAudits.some((audit) => normalizeSlug(audit.title).includes(signal)))
        .slice(0, 8)
        .map((signal) => `Bổ sung cluster xoay quanh "${signal.replace(/-/g, " ")}".`);

      return {
        name: pillarAudits[0]?.category || "Chưa phân loại",
        key,
        currentUrlCount,
        targetUrlCount,
        coverageScore,
        clusters,
        opportunities,
      };
    })
    .sort((a, b) => b.currentUrlCount - a.currentUrlCount || a.name.localeCompare(b.name));
};

const buildScoreDistribution = (audits: SeoAuditResult[]): SeoDashboardSummary["scoreDistribution"] => {
  const buckets = [
    { range: "0-49", min: 0, max: 49, count: 0 },
    { range: "50-69", min: 50, max: 69, count: 0 },
    { range: "70-84", min: 70, max: 84, count: 0 },
    { range: "85-100", min: 85, max: 100, count: 0 },
  ];
  audits.forEach((audit) => {
    const bucket = buckets.find((item) => audit.seoScore >= item.min && audit.seoScore <= item.max);
    if (bucket) bucket.count += 1;
  });
  return buckets.map(({ range, count }) => ({ range, count }));
};

const buildContentGrowth = (audits: SeoAuditResult[]): SeoDashboardSummary["contentGrowth"] => {
  const map = new Map<string, { month: string; posts: number; products: number; total: number }>();
  audits.forEach((audit) => {
    const date = toDate(audit.createdAt);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const current = map.get(month) || { month, posts: 0, products: 0, total: 0 };
    if (audit.type === "post") current.posts += 1;
    if (audit.type === "product") current.products += 1;
    current.total += 1;
    map.set(month, current);
  });

  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
};

const buildDashboard = (audits: SeoAuditResult[], inventory: SeoContentInventoryItem[], topicalMap: TopicalPillar[]): SeoDashboardSummary => {
  const totalPosts = audits.filter((audit) => audit.type === "post").length;
  const totalProducts = audits.filter((audit) => audit.type === "product").length;
  const averageSeoScore = audits.length > 0 ? Math.round(audits.reduce((total, audit) => total + audit.seoScore, 0) / audits.length) : 0;
  const urlsWithEnoughEntities = audits.filter((audit) => audit.metrics.entityCount >= 5).length;
  const entityCoverage = audits.length > 0 ? Math.round((urlsWithEnoughEntities / audits.length) * 100) : 0;
  const topicalCoverage = topicalMap.length > 0 ? Math.round(topicalMap.reduce((total, pillar) => total + pillar.coverageScore, 0) / topicalMap.length) : 0;
  const technicalScore = average(audits.map((audit) => getCriterionScorePercent(audit, ["url", "heading", "images", "schema"])));
  const internalLinkScore = average(audits.map((audit) => getCriterionScorePercent(audit, ["internal_links"])));
  const topicalAuthority = average([entityCoverage, topicalCoverage, internalLinkScore].filter((value) => value > 0));

  return {
    totalUrls: audits.length,
    totalPosts,
    totalProducts,
    totalCategories: new Set(audits.map((audit) => audit.category).filter(Boolean)).size,
    totalLandingPages: 0,
    totalTags: 0,
    indexedUrls: null,
    notIndexedUrls: null,
    averageSeoScore,
    technicalScore,
    internalLinkScore,
    topicalAuthority,
    averageRanking: null,
    organicTraffic: null,
    clicks: null,
    ctr: null,
    impressions: null,
    strongestUrls: [...inventory].sort((a, b) => b.seoScore - a.seoScore).slice(0, 8),
    urlsNeedOptimization: [...inventory].sort((a, b) => a.seoScore - b.seoScore).slice(0, 10),
    internalLinkCount: audits.reduce((total, audit) => total + audit.metrics.internalLinkCount, 0),
    entityCoverage,
    topicalCoverage,
    scoreDistribution: buildScoreDistribution(audits),
    contentGrowth: buildContentGrowth(audits),
    topicCoverage: topicalMap.slice(0, 12).map((pillar) => ({
      topic: pillar.name,
      coverage: pillar.coverageScore,
      urls: pillar.currentUrlCount,
    })),
  };
};

export const buildSeoAuditPayload = async (): Promise<SeoAuditPayload> => {
  const sourceItems = await readSeoSourceItems();
  const audits = sourceItems.map(auditItem).sort((a, b) => b.seoScore - a.seoScore);
  const inventory = buildInventory(audits);
  const entities = aggregateEntities(audits);
  const keywordHub = buildKeywordHub(audits);
  const internalLinks = buildInternalLinks(audits);
  const integrations = buildIntegrations();
  const topicalMap = buildTopicalMap(audits);
  const dashboard = buildDashboard(audits, inventory, topicalMap);

  return {
    generatedAt: new Date().toISOString(),
    inventory,
    audits,
    entities,
    keywordHub,
    internalLinks,
    integrations,
    topicalMap,
    dashboard,
  };
};

export const findSeoAuditByUrl = (payload: SeoAuditPayload, urlOrPath: string): SeoAuditResult | null => {
  const value = compactText(urlOrPath);
  if (!value) return null;
  return (
    payload.audits.find((audit) => audit.url === value || audit.path === value || audit.url.endsWith(value) || audit.path.endsWith(value)) ||
    null
  );
};
