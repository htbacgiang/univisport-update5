import { GetServerSideProps } from "next";
import db from "../utils/db";
import Post from "../models/Post";

const baseUrl = "https://dongphucunivi.com";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await db.connectDb();

    // Bài viết 3 cấp: /bai-viet/[slug]
    const posts = await Post.find({
      isDraft: { $ne: true },
      isDirectPost: { $ne: true },
    })
      .select("slug updatedAt createdAt")
      .lean();

    // Bài viết 2 cấp (landing page): /[slug]
    const directPosts = await Post.find({
      isDraft: { $ne: true },
      isDirectPost: true,
    })
      .select("slug updatedAt createdAt")
      .lean();

    const buildEntry = (
      loc: string,
      updatedAt: any,
      createdAt: any,
      priority: string
    ) => {
      const lastmod = updatedAt
        ? new Date(updatedAt).toISOString()
        : new Date(createdAt).toISOString();
      return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    };

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${(posts as any[])
    .map((p) =>
      buildEntry(`${baseUrl}/bai-viet/${p.slug}`, p.updatedAt, p.createdAt, "0.7")
    )
    .join("")}
  ${(directPosts as any[])
    .map((p) =>
      buildEntry(`${baseUrl}/${p.slug}`, p.updatedAt, p.createdAt, "0.8")
    )
    .join("")}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=1800"
    );
    res.write(xml);
    res.end();
  } catch (error) {
    console.error("❌ Error generating sitemap-posts.xml:", error);
    res.statusCode = 500;
    res.end("Error generating sitemap");
  }

  return { props: {} };
};

export default function SitemapPosts() {
  return null;
}
