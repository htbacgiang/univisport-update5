import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import DefaultLayout from "../../components/layout/DefaultLayout";
import db from "../../utils/db";
import Author from "../../models/Author";
import Post from "../../models/Post";

interface AuthorData {
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    facebook?: string;
    zalo?: string;
    linkedin?: string;
  };
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  meta: string;
  category: string;
  createdAt: string;
  isDirectPost: boolean;
}

interface Props {
  author: AuthorData;
  posts: PostItem[];
  meta?: any;
}

const normalizeImageUrl = (
  imageUrl: string | undefined,
  baseUrl = "https://dongphucunivi.com"
): string => {
  if (!imageUrl) return "/logo-univi.webp";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${baseUrl}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
};

const AuthorPage: NextPage<Props> = ({ author, posts = [] }) => {
  if (!author) return null;

  return (
    <DefaultLayout>
      <div className="h-[80px]"></div>
      <div className="container mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <div className="flex font-bold gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-700">Trang chủ</Link>
          <span>›</span>
          <span className="text-gray-700">{author.name}</span>
        </div>

        {/* Author Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={`Ảnh tác giả ${author.name} — ${author.role || "Đồng Phục Univi"}`}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover flex-shrink-0 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#105d97] flex items-center justify-center flex-shrink-0 shadow-md">
              <span className="text-white text-3xl font-bold">{author.name.charAt(0)}</span>
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{author.name}</h1>
            {author.role && <p className="text-[#105d97] font-medium mt-1">{author.role}</p>}
            {author.bio && <p className="text-gray-600 mt-2 leading-6">{author.bio}</p>}
            {author.socialLinks && (
              <div className="flex items-center gap-4 mt-4 justify-center sm:justify-start">
                {author.socialLinks.facebook && (
                  <a href={author.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">
                    Facebook
                  </a>
                )}
                {author.socialLinks.zalo && (
                  <a href={author.socialLinks.zalo} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-500 hover:underline">
                    Zalo
                  </a>
                )}
                {author.socialLinks.linkedin && (
                  <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-700 hover:underline">
                    LinkedIn
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Posts List */}
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-3">
          Bài viết của {author.name}
          <span className="ml-2 text-sm font-normal text-gray-400">({posts?.length || 0} bài)</span>
        </h2>

        {!posts || posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500">Chưa có bài viết nào từ tác giả này.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => {
              const href = post.isDirectPost ? `/${post.slug}` : `/bai-viet/${post.slug}`;
              return (
                <Link
                  key={post.id}
                  href={href}
                  className="group flex gap-5 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#105d97] hover:shadow-md transition-all"
                >
                  <div className="relative w-32 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <Image
                      src={normalizeImageUrl(post.thumbnail)}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 group-hover:text-[#105d97] transition-colors line-clamp-2 text-lg">
                      {post.title}
                    </h3>
                    {post.meta && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.meta}</p>}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                          day: "numeric", month: "long", year: "numeric",
                        }).replace("tháng ", "Tháng ")}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default AuthorPage;

// ─── SERVER SIDE PROPS ────────────────────────────────────────
export const getServerSideProps: GetServerSideProps<Props, { slug: string }> = async ({ params }) => {
  try {
    await db.connectDb();

    const author = await Author.findOne({ slug: params?.slug });
    if (!author) return { notFound: true };

    const rawPosts = await Post.find({ postAuthor: author._id, isDraft: false })
      .sort({ createdAt: -1 })
      .select("title slug thumbnail meta category createdAt isDirectPost");

    const posts: PostItem[] = rawPosts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      thumbnail: p.thumbnail?.url || "",
      meta: p.meta || "",
      category: p.category || "",
      createdAt: p.createdAt.toString(),
      isDirectPost: p.isDirectPost || false,
    }));

    const authorData: AuthorData = {
      name: author.name,
      slug: author.slug,
      role: author.role || "",
      bio: author.bio || "",
      avatar: author.avatar || "",
      socialLinks: {
        facebook: author.socialLinks?.facebook || "",
        zalo: author.socialLinks?.zalo || "",
        linkedin: author.socialLinks?.linkedin || "",
      },
    };

    const pageUrl = `https://dongphucunivi.com/tac-gia/${author.slug}`;
    const metaTitle = `${author.name} — ${author.role || "Tác giả"} | Đồng Phục Univi`;
    const metaDesc = author.bio
      ? `${author.bio.replace(/\n/g, " ")} — Đọc các bài viết chuyên sâu về đồng phục thể thao tại Đồng Phục Univi.`
      : `Đọc các bài viết của ${author.name}, ${author.role || "tác giả"} tại Đồng Phục Univi — xưởng sản xuất đồng phục thể thao chuyên dụng tại Hà Nội.`;

    // ── sameAs: lọc các link social có giá trị thật ──────────
    const sameAs = [
      author.socialLinks?.facebook,
      author.socialLinks?.linkedin,
      author.socialLinks?.zalo,
    ].filter((url): url is string => !!url && url.startsWith("http"));

    const meta = {
      title: metaTitle,
      description: metaDesc,
      keywords: `${author.name}, ${author.role || ""}, tác giả Đồng Phục Univi, đồng phục thể thao, vải UNI DRY, xưởng may Hà Nội`,
      robots: "index, follow",
      author: author.name,
      canonical: pageUrl,
      og: {
        title: metaTitle,
        description: metaDesc,
        type: "profile",
        image: author.avatar || "https://dongphucunivi.com/images/banner-univi.webp",
        imageWidth: "400",
        imageHeight: "400",
        imageAlt: `Ảnh tác giả ${author.name} — ${author.role || "Đồng Phục Univi"}`,
        url: pageUrl,
        site_name: "Đồng Phục Univi",
      },
      twitter: {
        card: "summary",
        title: metaTitle,
        description: metaDesc,
        image: author.avatar || "https://dongphucunivi.com/images/banner-univi.webp",
      },
      // ── Person + BreadcrumbList schema ──────────────────────
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
            { "@type": "ListItem", "position": 2, "name": "Tác giả", "item": "https://dongphucunivi.com/tac-gia" },
            { "@type": "ListItem", "position": 3, "name": author.name, "item": pageUrl },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "Person",
          // @id chuẩn hóa 1 entity duy nhất cho tác giả
          "@id": author.name === "Trần Hiền" || author.slug === "dong-sang-lap-univi-sport-tran-hien" || author.slug === "tran-hien"
            ? "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien#person"
            : `${pageUrl}#person`,
          "name": author.name,
          "jobTitle": author.role || "",
          "description": author.bio?.replace(/\n/g, " ") || "",
          "image": {
            "@type": "ImageObject",
            "url": author.avatar || "",
          },
          "url": author.name === "Trần Hiền" || author.slug === "dong-sang-lap-univi-sport-tran-hien" || author.slug === "tran-hien"
            ? "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien"
            : pageUrl,
          // liên kết Person với Organization Univi — E-E-A-T signal
          "worksFor": { "@id": "https://dongphucunivi.com/#organization" },
          // liên kết với bài viết đã đăng — Author entity được củng cố
          "author": posts.slice(0, 5).map((p) => ({
            "@type": "Article",
            "headline": p.title,
            "url": `https://dongphucunivi.com${p.isDirectPost ? `/${p.slug}` : `/bai-viet/${p.slug}`}`,
          })),
          ...(sameAs.length > 0 && { "sameAs": sameAs }),
        },
      ],
    };

    return { props: { author: authorData, posts, meta } };
  } catch (error) {
    console.error("Error in tac-gia getServerSideProps:", error);
    return { notFound: true };
  } finally {
    await db.disconnectDb();
  }
};