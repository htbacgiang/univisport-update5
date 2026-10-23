import { GetServerSideProps, NextPage } from "next";
import { useEffect, useMemo, useRef, useState } from "react";
import parse from "html-react-parser";
import DefaultLayout from "../../components/layout/DefaultLayout";
import db from "../../utils/db";
import Post from "../../models/Post";
import Author from "../../models/Author";
import Share from "../../components/common/Share";
import Link from "next/link";
import Image from "next/image";
import { trimText } from "../../utils/helper";
import ContactForm from "../../components/header/ContactForm";
import TableOfContents from "../../components/common/TableOfContents";
import { parseToc } from "../../utils/toc";

// Import các component có thể nhúng vào bài viết
import CTABanner from "../../components/univisport/CTABanner";
import CategoryGrid from "../../components/univisport/CategoryGrid";
import PartnersSection from "../../components/univisport/PartnersSection";
import FAQComponentBlock from "../../components/univisport/FAQComponent";
import InternalLinks from "../../components/univisport/InternalLinks";
import FabricCardComponent from "../../components/univisport/FabricCardComponent";
import FabricCatalogView from "../../components/univisport/chat-lieu-vai/FabricCatalogView";
import BangMauHero from "../../components/univisport/bang-mau/BangMauHero";
import CountdownTimer from "../../components/univisport/CountdownTimer";
import ProcessSteps from "../../components/univisport/ProcessSteps";
import ProductSlider from "../../components/univisport/ProductSlider";
import AoPoloProcessSteps from "../../components/univisport/bai-viet/AoPoloProcessSteps";
import ArticleImageGallery, {
  parseArticleGalleryImages,
} from "../../components/common/ArticleImageGallery";
import { normalizeInternalLinkAttributes } from "../../utils/internalLinks";

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  CTABanner,
  ContactForm,
  CategoryGrid,
  PartnersSection,
  FAQComponent: FAQComponentBlock,
  InternalLinks,
  FabricCardComponent,
  FabricCatalogView,
  BangMauHero,
  CountdownTimer,
  ProcessSteps,
  ProductSlider,
  AoPoloProcessSteps,
};

type PostData = {
  id: string;
  title: string;
  content: string;
  meta: string;
  tags: string[];
  slug: string;
  thumbnail: string;
  createdAt: string;
  category: string;
  recentPosts: {
    id: string;
    title: string;
    slug: string;
    category: string;
    thumbnail?: string;
  }[];
  postAuthor?: {
    name: string;
    slug: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
  faqs?: { question: string; answer: string }[];
};

type MetaData = {
  title: string;
  description: string;
  author: string;
  canonical: string;
  keywords: string;
  robots: string;
  og: {
    title: string;
    description: string;
    type: string;
    image: string;
    imageWidth: string;
    imageHeight: string;
    imageAlt: string;
    url: string;
    site_name: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  schema: object[];
};

type Props = {
  post: PostData;
  meta: MetaData;
};

const host = "https://dongphucunivi.com/bai-viet";
export const APP_NAME = "Đồng phục Univi";

type VideoAspectRatio = "square" | "vertical" | "horizontal";

const detectVideoAspectRatio = (width: number, height: number): VideoAspectRatio => {
  if (Math.abs(width - height) / Math.max(width, height) < 0.12) return "square";
  return height > width ? "vertical" : "horizontal";
};

const ArticleCloudinaryVideo = ({ src, title, initialRatio = "horizontal" }: {
  src: string;
  title?: string;
  initialRatio?: VideoAspectRatio;
}) => {
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>(initialRatio);
  const videoRef = useRef<HTMLVideoElement>(null);
  const aspectValue = aspectRatio === "square" ? "1 / 1" : aspectRatio === "vertical" ? "9 / 16" : "16 / 9";
  const maxWidth = aspectRatio === "vertical" ? "420px" : aspectRatio === "square" ? "640px" : "100%";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateRatio = () => {
      if (video.videoWidth && video.videoHeight) {
        setAspectRatio(detectVideoAspectRatio(video.videoWidth, video.videoHeight));
      }
    };

    updateRatio();
    video.addEventListener("loadedmetadata", updateRatio);
    video.addEventListener("loadeddata", updateRatio);
    video.addEventListener("canplay", updateRatio);
    return () => {
      video.removeEventListener("loadedmetadata", updateRatio);
      video.removeEventListener("loadeddata", updateRatio);
      video.removeEventListener("canplay", updateRatio);
    };
  }, [src]);

  return (
    <div className="cloudinary-video-embed" data-aspect-ratio={aspectRatio} style={{ display: "block", width: "100%", maxWidth, aspectRatio: aspectValue, margin: "0 auto", background: "#000", overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={src}
        title={title || "Video Univi"}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (video?.videoWidth && video.videoHeight) setAspectRatio(detectVideoAspectRatio(video.videoWidth, video.videoHeight));
        }}
        style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
};

const SinglePost: NextPage<Props> = ({ post, meta }) => {
  if (!post) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
            <p className="font-medium text-lg">Bài viết không khả dụng</p>
            <p className="text-sm mt-1 text-red-500">Nội dung bài viết chưa được cập nhật hoặc không tồn tại.</p>
            <Link href="/" className="mt-4 inline-block px-4 py-2 bg-[#105d97] text-white rounded-lg hover:bg-[#0d4c7a] transition">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  const { title, content, slug, recentPosts } = post;

  const { headings, content: processedContent } = useMemo(
    () => parseToc(content),
    [content]
  );

  const parseOptions = {
    replace(domNode: any) {
      if (domNode.type === "tag" && domNode.name === "a") {
        normalizeInternalLinkAttributes(domNode.attribs);
      }

      if (
        domNode.type === "tag" &&
        domNode.name === "div" &&
        domNode.attribs?.class?.includes("cloudinary-video-embed")
      ) {
        const videoNode = domNode.children?.find((child: any) => child.type === "tag" && child.name === "video");
        if (videoNode?.attribs?.src) {
          return (
            <ArticleCloudinaryVideo
              src={videoNode.attribs.src}
              title={videoNode.attribs.title}
              initialRatio={domNode.attribs?.["data-aspect-ratio"] as VideoAspectRatio || "horizontal"}
            />
          );
        }
      }

      if (
        domNode.type === "tag" &&
        domNode.name === "video" &&
        domNode.attribs?.src?.includes("res.cloudinary.com") &&
        !domNode.parent?.attribs?.class?.includes("cloudinary-video-embed")
      ) {
        return <ArticleCloudinaryVideo src={domNode.attribs.src} title={domNode.attribs.title} />;
      }

      if (
        domNode.type === "tag" &&
        domNode.attribs?.["data-article-gallery"] === "true"
      ) {
        return (
          <ArticleImageGallery
            images={parseArticleGalleryImages(domNode.attribs["data-images"])}
            title={domNode.attribs["data-title"] || "Thư viện hình ảnh"}
          />
        );
      }

      if (
        domNode.type === "tag" &&
        domNode.attribs?.["data-component"]
      ) {
        const name = domNode.attribs["data-component"];
        const Component = COMPONENT_MAP[name];
        if (!Component) {
          return (
            <div className="my-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400 text-sm">
              ⚠️ Component &ldquo;{name}&rdquo; chưa được cài đặt
            </div>
          );
        }

        let props: Record<string, any> = {};
        try {
          props = JSON.parse(domNode.attribs["data-props"] || "{}");
        } catch (_) { }

        if (name === "FabricCatalogView") {
          return (
            <div className="container mx-auto px-2 sm:px-4 mb-6 sm:mb-10 mt-3">
              <Component {...props} />
            </div>
          );
        }

        return <Component {...props} />;
      }

      if (
        domNode.type === "tag" &&
        domNode.name === "img" &&
        domNode.attribs?.["data-caption"] &&
        domNode.parent?.name !== "figure"
      ) {
        const { class: className, style, ...attribs } = domNode.attribs;
        const caption = attribs["data-caption"];
        return (
          <figure className="image-caption-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img className={className || ""} {...attribs} />
            <figcaption>{caption}</figcaption>
          </figure>
        );
      }
    },
  };

  return (
    <DefaultLayout>

      <div className="min-h-screen">
        <div className="h-[80px]"></div>
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white p-4 md:p-4">
                {/* Breadcrumb UI — 3 cấp */}
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center space-x-1 text-sm text-gray-500">
                    <li>
                      <Link href="/bai-viet" className="hover:text-[#105d97] transition-colors">
                        Bài viết
                      </Link>
                    </li>
                    <li><span className="text-gray-400">/</span></li>
                    <li className="text-gray-700 font-medium" aria-current="page">
                      {trimText(title, 35)}
                    </li>
                  </ol>
                </nav>

                {/* Article Header */}
                <div className="mb-4">
                  <h1 className="text-xl md:text-3xl font-medium tracking-tight text-gray-900 leading-6 mb-4">{title}</h1>
                  <div className="flex items-center justify-between">
                    <Share url={`${host}/${slug}`} />
                  </div>
                </div>

                {headings.length > 0 && <TableOfContents headings={headings} />}

                {/* Article Content */}
                <div className="prose blog prose-base md:prose-lg max-w-none text-gray-700">
                  <style jsx>{`
                    .blog :global(img) { display: block; margin: 1.5em auto; }
                    .blog :global(figure) { margin: 1.5em 0; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                    .blog :global(figure[data-alignment="left"]) { margin-left: 0 !important; margin-right: auto !important; align-items: flex-start !important; }
                    .blog :global(figure[data-alignment="right"]) { margin-left: auto !important; margin-right: 0 !important; align-items: flex-end !important; }
                    .blog :global(figure[data-alignment="center"]) { margin-left: auto !important; margin-right: auto !important; align-items: center !important; }
                    .blog :global(img[data-alignment="left"]) { margin-left: 0 !important; margin-right: auto !important; }
                    .blog :global(img[data-alignment="right"]) { margin-left: auto !important; margin-right: 0 !important; }
                    .blog :global(img[data-alignment="center"]) { margin-left: auto !important; margin-right: auto !important; }
                    .blog :global(figure img) { display: block; margin: 0 auto; }
                    .blog :global(figcaption) { margin-top: 0; padding-bottom: 0.2rem; font-size: 0.875em; color: #6b7280; font-style: italic; text-align: center; width: 100%; max-width: 100%; }
                    :global(.dark) .blog :global(figcaption) { color: #9ca3af; }
                    .blog :global(table) { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; width: max-content !important; margin: 1.5em auto !important; border-collapse: collapse; border: 1px solid #d1d5db; }
                    .blog :global(td), .blog :global(th) { padding: 0.5em 0.5em; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
                    .blog :global(th) { background-color: #f3f4f6; font-weight: 600; color: #111827; }
                    .blog :global(td p), .blog :global(th p) { text-align: left !important; margin: 0; }
                    .blog :global(h1), .blog :global(h2), .blog :global(h3), .blog :global(h4), .blog :global(h5), .blog :global(h6) { scroll-margin-top: 100px; }
                    .blog :global(.cloudinary-video-embed[data-aspect-ratio="vertical"]) { width: 100% !important; max-width: 420px !important; margin-left: auto !important; margin-right: auto !important; }
                    .blog :global(.cloudinary-video-embed[data-aspect-ratio="square"]) { width: 100% !important; max-width: 640px !important; margin-left: auto !important; margin-right: auto !important; }
                    .blog :global(.cloudinary-video-embed[data-aspect-ratio="horizontal"]) { width: 100% !important; max-width: 100% !important; }
                    .blog :global(.cloudinary-video-embed video) { display: block; width: 100%; height: 100%; margin: 0 !important; padding: 0 !important; max-width: none !important; }
                    @media (max-width: 767px) {
                      .blog :global(.cloudinary-video-embed[data-aspect-ratio="vertical"]), .blog :global(.cloudinary-video-embed[data-aspect-ratio="square"]) { max-width: 100% !important; }
                    }
                    @media (min-width: 768px) {
                      .blog :global(.cloudinary-video-embed) { display: block !important; width: 100% !important; min-width: 100% !important; max-width: none !important; box-sizing: border-box; aspect-ratio: 16 / 9 !important; margin-top: 10px !important; margin-bottom: 0 !important; padding: 0 !important; background: #000; }
                      .blog :global(.cloudinary-video-embed video) { width: 100% !important; height: 100% !important; object-fit: contain; margin: 0 !important; }
                    }
                    @media (max-width: 767px) {
                      .blog :global(.cloudinary-video-embed) { max-width: 100% !important; aspect-ratio: auto !important; padding: 0 !important; }
                      .blog :global(.cloudinary-video-embed video) { height: auto !important; }
                    }
                  `}</style>
                  {parse(processedContent, parseOptions)}
                </div>

                {/* FAQs Section */}
                {post.faqs && post.faqs.length > 0 && (
                  <div className="mt-12 bg-gray-50 rounded-2xl p-3 md:p-8 border border-gray-100 shadow-sm">
                    <h2 className="text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900 mb-6 flex items-center gap-2">
                      <svg className="w-6 h-6 md:w-7 md:h-7 text-[#105d97]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Câu hỏi thường gặp
                    </h2>
                    <div className="space-y-4">
                      {post.faqs.map((faq, idx) => (
                        <details key={idx} className="group bg-white rounded-xl border border-gray-200 overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                          <summary className="flex items-center justify-between cursor-pointer p-4 font-semibold text-gray-900 hover:text-[#105d97] transition-colors">
                            <span className="pr-4">{faq.question}</span>
                            <span className="transition-transform duration-300 group-open:-rotate-180 text-gray-400 group-hover:text-[#105d97] flex-shrink-0">
                              <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                            </span>
                          </summary>
                          <div className="py-4 px-2 pt-2 text-sm leading-6 text-gray-700 border-t border-gray-100 bg-gray-50/50">
                            {faq.answer.split('\n').map((line, i) => (
                              <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Card */}
                {post.postAuthor && (
                  <div className="border-t border-gray-100 pt-8">
                    <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                      {post.postAuthor.avatar ? (
                        <Image src={post.postAuthor.avatar} alt={post.postAuthor.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-[#105d97] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xl font-bold">{post.postAuthor.name.charAt(0)}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {post.postAuthor.slug ? (
                          <Link href={`/tac-gia/${post.postAuthor.slug}`} className="font-medium text-gray-900 hover:text-[#105d97] transition-colors">
                            {post.postAuthor.name}
                          </Link>
                        ) : (
                          <span className="font-medium text-gray-900">{post.postAuthor.name}</span>
                        )}
                        {post.postAuthor.role && <p className="text-sm text-[#105d97] mt-0.5">{post.postAuthor.role}</p>}
                        {post.postAuthor.bio && <p className="text-sm text-gray-700 mt-2 leading-6">{post.postAuthor.bio}</p>}
                        {post.postAuthor.slug && (
                          <Link href={`/tac-gia/${post.postAuthor.slug}`} className="inline-block mt-3 text-xs font-medium text-[#105d97] hover:underline">
                            Xem tất cả bài viết của {post.postAuthor.name} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-96 lg:flex-shrink-0 w-full pb-5">
              <div className="bg-white rounded-lg shadow-sm p-3">
                <h3 className="text-xs font-medium text-[#105d97] uppercase tracking-[0.15em] mb-4">Bài viết gần đây</h3>
                <div className="space-y-4">
                  {recentPosts.slice(0, 4).map((p) => (
                    <Link key={p.slug} href={`/bai-viet/${p.slug}`} className="block group">
                      <div className="flex gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors">
                        {p.thumbnail && (
                          <Image src={p.thumbnail} alt={p.title} width={120} height={80} className="w-[120px] h-[80px] object-cover rounded" />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#105d97] transition-colors line-clamp-2 mt-1">{p.title}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SinglePost;

// ─── SERVER SIDE PROPS ────────────────────────────────────────
export const getServerSideProps: GetServerSideProps<
  { post: PostData; meta: MetaData },
  { slug: string }
> = async ({ params }) => {
  try {
    await db.connectDb();

    // Ensure Author model is registered before populate
    const _author = Author;

    const post = await Post.findOne({ slug: params?.slug, isDirectPost: { $ne: true } }).populate("postAuthor");
    if (!post) return { notFound: true };

    const posts = await Post.find({
      _id: { $ne: post._id },
      isDraft: { $ne: true },
      isDirectPost: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("slug title thumbnail category");

    const recentPosts = posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      category: p.category || "Không xác định",
      thumbnail: p.thumbnail?.url,
    }));

    const { _id, title, content, meta, slug, tags, thumbnail, category, createdAt, faqs, keywords } = post;
    const postAuthorDoc = post.postAuthor as any;

    const authorName = postAuthorDoc?.name || "Team SEO Univi";
    const authorSlug = postAuthorDoc?.slug || "";
    const thumbnailUrl = thumbnail?.url || "https://dongphucunivi.com/images/banner-home-1.jpg";
    const canonicalUrl = `https://dongphucunivi.com/bai-viet/${slug}`;
    const createdAtISO = new Date(createdAt).toISOString();

    // ── Schema: Article + BreadcrumbList (3 cấp) + Author ──
    const articleSchema = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
          { "@type": "ListItem", "position": 2, "name": "Bài viết", "item": "https://dongphucunivi.com/bai-viet" },
          { "@type": "ListItem", "position": 3, "name": title, "item": canonicalUrl },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": title,
        "description": meta,
        "image": {
          "@type": "ImageObject",
          "url": thumbnailUrl,
          "width": 1200,
          "height": 630,
        },
        "datePublished": createdAtISO,
        "dateModified": createdAtISO,
        "url": canonicalUrl,
        "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
        "publisher": { "@id": "https://dongphucunivi.com/#organization" },
        "author": authorName === "Trần Hiền" || authorSlug === "dong-sang-lap-univi-sport-tran-hien" || authorSlug === "tran-hien"
          ? {
            "@type": "Person",
            "@id": "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien#person",
            "name": "Trần Hiền",
            "url": "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien",
          }
          : {
            "@type": "Person",
            ...(authorSlug ? {
              "@id": `https://dongphucunivi.com/tac-gia/${authorSlug}#person`,
              "url": `https://dongphucunivi.com/tac-gia/${authorSlug}`,
            } : {}),
            "name": authorName,
          },
        "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
        // speakable: đánh dấu vùng AI Overview ưu tiên trích dẫn
        "speakable": {
          "@type": "SpeakableSpecification",
          "cssSelector": ["h1", ".prose p:first-of-type"],
        },
      },
      ...(faqs && faqs.length > 0 ? [{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq: any) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }] : []),
    ];

    const metaData: MetaData = {
      title,
      description: meta,
      author: authorName,
      canonical: canonicalUrl,
      keywords: `${tags?.join(', ') || ''} đồng phục ${category || ''}, vải UNI DRY thoát ẩm, đồng phục phòng tập Hà Nội, xưởng may đồng phục, kiểm định QCVN, Đồng Phục Univi`.trim(),
      robots: "index, follow",
      og: {
        title,
        description: meta,
        type: "article",          // ✅ Đổi từ "website" → "article"
        image: thumbnailUrl,
        imageWidth: "1200",
        imageHeight: "630",
        imageAlt: `${title} — Đồng phục Univi`,
        url: canonicalUrl,
        site_name: "Đồng phục Univi",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: meta,
        image: thumbnailUrl,
      },
      schema: articleSchema,
    };

    const postData: PostData = {
      id: _id.toString(),
      title,
      content,
      meta,
      slug,
      tags,
      category: category ?? "Không xác định",
      thumbnail: thumbnailUrl,
      createdAt: createdAt.toString(),
      recentPosts,
      postAuthor: postAuthorDoc
        ? { name: authorName, slug: authorSlug, role: postAuthorDoc.role || "Biên tập viên", bio: postAuthorDoc.bio || "", avatar: postAuthorDoc.avatar || "" }
        : { name: "Team SEO Univi", slug: "", role: "Biên tập viên", bio: "Đội ngũ chuyên gia SEO và biên tập nội dung tại Đồng Phục Univi.", avatar: "/logo-univi.jpg" },
      faqs: faqs && Array.isArray(faqs) ? faqs.map((faq: any) => ({ question: faq.question || "", answer: faq.answer || "" })) : [],
    };

    return { props: { post: postData, meta: metaData } };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return { notFound: true };
  }
};
