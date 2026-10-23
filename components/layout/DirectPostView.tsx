import React, { useMemo } from "react";
import parse from "html-react-parser";
import Share from "../common/Share";
import Link from "next/link";
import SidebarCTAForm from "../common/SidebarCTAForm";
import Image from "next/image";
import { trimText } from "../../utils/helper";
import ContactForm from "../header/ContactForm";
import TableOfContents from "../common/TableOfContents";
import { parseToc } from "../../utils/toc";

// Import các component có thể nhúng vào bài viết
import CTABanner from "../univisport/CTABanner";
import CategoryGrid from "../univisport/CategoryGrid";
import PartnersSection from "../univisport/PartnersSection";
import FAQComponentBlock from "../univisport/FAQComponent";
import InternalLinks from "../univisport/InternalLinks";
import FabricCardComponent from "../univisport/FabricCardComponent";
import FabricCatalogView from "../univisport/chat-lieu-vai/FabricCatalogView";
import BangMauHero from "../univisport/bang-mau/BangMauHero";
import CountdownTimer from "../univisport/CountdownTimer";
import ProcessSteps from "../univisport/ProcessSteps";
import ProductSlider from "../univisport/ProductSlider";
import AoPoloProcessSteps from "../univisport/bai-viet/AoPoloProcessSteps";
import ArticleImageGallery, {
  parseArticleGalleryImages,
} from "../common/ArticleImageGallery";
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
  postAuthor?: {
    name: string;
    slug: string;
    role?: string;
    bio?: string;
    avatar?: string;
  };
  faqs?: { question: string; answer: string }[];
};

type Props = {
  post: PostData;
  randomFeedbacks?: {
    id: string;
    title: string;
    slug: string;
    image: string;
    customer: string;
    category: string;
  }[];
};

const host = "https://dongphucunivi.com";

const DirectPostView: React.FC<Props> = ({ post, randomFeedbacks = [] }) => {
  const displayedFeedbacks = randomFeedbacks.slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
          <p className="font-semibold text-lg">Bài viết không khả dụng</p>
          <p className="text-sm mt-1 text-red-500">Nội dung bài viết chưa được cập nhật hoặc không tồn tại.</p>
          <Link href="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { title, content, slug } = post;

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
        domNode.attribs?.["data-article-gallery"] === "true"
      ) {
        return (
          <ArticleImageGallery
            images={parseArticleGalleryImages(domNode.attribs["data-images"])}
            title={domNode.attribs["data-title"] || "Thư viện hình ảnh"}
          />
        );
      }

      if (domNode.type === "tag" && domNode.attribs?.["data-component"]) {
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
    <div className="min-h-screen">
      <div className="h-[80px]"></div>
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white p-4 md:p-4">
              {/* Breadcrumb UI — 2 cấp */}
              <div className="flex font-bold gap-2 text-base text-gray-600">
                <Link href="/" className="hover:text-blue-800 whitespace-nowrap">Trang chủ</Link>
                <span>›</span>
                <span className="flex font-bold gap-2 text-base text-gray-600">
                  {trimText(title, 35)}
                </span>
              </div>

              {/* Article Header */}
              <div className="mb-4">
                <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-4">{title}</h1>
                <div className="flex items-center justify-between">
                  <Share url={`${host}/${slug}`} />
                </div>
              </div>

              {headings.length > 0 && <TableOfContents headings={headings} />}

              {/* Article Content */}
              <div className="blog prose prose-lg dark:prose-invert w-full [&_img]:mx-auto">
                <style jsx>{`
                  .blog :global(img) { display: block; margin: 1.5em auto; }
                  .blog :global(figure) { margin: 1.5em 0; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                  .blog :global(figure img) { display: block; margin: 0 auto; }
                  .blog :global(figcaption) { margin-top: 0; padding-bottom: 0.2rem; font-size: 0.875em; color: #6b7280; font-style: italic; text-align: center; width: 100%; max-width: 100%; }
                  :global(.dark) .blog :global(figcaption) { color: #9ca3af; }
                  .blog :global(table) { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; width: max-content !important; margin: 1.5em auto !important; border-collapse: collapse; border: 1px solid #d1d5db; }
                  .blog :global(td), .blog :global(th) { padding: 0.5em 0.5em; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
                  .blog :global(th) { background-color: #f3f4f6; font-weight: 600; }
                  .blog :global(td p), .blog :global(th p) { text-align: left !important; margin: 0; }
                  .blog :global(h1), .blog :global(h2), .blog :global(h3), .blog :global(h4), .blog :global(h5), .blog :global(h6) { scroll-margin-top: 100px; }
                `}</style>
                {parse(processedContent, parseOptions)}
              </div>

              {/* FAQs Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
                        <div className="p-4 pt-2 text-gray-600 leading-6 border-t border-gray-100 bg-gray-50/50">
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
                <div className="mt-10 border-t border-gray-100 pt-8">
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
                        <Link href={`/tac-gia/${post.postAuthor.slug}`} className="font-bold text-gray-900 hover:text-[#105d97] transition-colors">
                          {post.postAuthor.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-gray-900">{post.postAuthor.name}</span>
                      )}
                      {post.postAuthor.role && <p className="text-sm text-[#105d97] mt-0.5">{post.postAuthor.role}</p>}
                      {post.postAuthor.bio && <p className="text-sm text-gray-600 mt-2 leading-6">{post.postAuthor.bio}</p>}
                      {post.postAuthor.slug && (
                        <Link href={`/tac-gia/${post.postAuthor.slug}`} className="inline-block mt-3 text-xs font-semibold text-[#105d97] hover:underline">
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
          <div className="lg:w-96 lg:flex-shrink-0 w-full px-4 md:px-0 lg:pl-4">
            <div className="pt-2 sticky top-24 space-y-6">
              <SidebarCTAForm />

              {/* Khách hàng tiêu biểu / Feedbacks */}
              {displayedFeedbacks.length > 0 && (
                <div className="sidebar-projects px-4 md:px-0 hidden md:block">
                  <p className="text-xl flex items-center font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Khách hàng tiêu biểu
                  </p>
                  <div className="flex flex-col gap-4 mt-2">
                    {displayedFeedbacks.map((fb, index) => (
                      <Link key={fb.id} href={`/feedback/${fb.slug}`} className="group block">
                        <div className="relative w-full aspect-[5/3] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 cursor-pointer">
                          <div className="absolute inset-0">
                            {fb.image ? (
                              <Image
                                src={fb.image}
                                alt={fb.title}
                                layout="fill"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                priority={index < 2}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200" />
                            )}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/20 to-black/60 group-hover:from-black/50 group-hover:via-black/50 group-hover:to-black/80 transition-all duration-500"></div>
                          <div className="absolute top-2 left-2 z-20 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#105d97] rounded-full text-[10px] font-semibold shadow-sm">
                              {fb.category}
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <div className="text-center px-4 max-w-sm">
                              <h3 className="text-white font-bold text-sm mb-1.5 drop-shadow-md">
                                {fb.title}
                              </h3>
                              <div className="flex flex-col items-center justify-center text-white/90 text-[11px] space-y-0.5">
                                <span className="flex items-center text-gray-200">
                                  {fb.customer}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectPostView;
