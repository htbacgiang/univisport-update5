import { GetServerSideProps } from "next";
import db from "../utils/db";
import Feedback from "../models/Feedback";

const baseUrl = "https://dongphucunivi.com";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await db.connectDb();

    const feedbacks = await Feedback.find({})
      .select("slug updatedAt createdAt")
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${(feedbacks as any[])
    .map((f) => {
      const lastmod = f.updatedAt
        ? new Date(f.updatedAt).toISOString()
        : new Date(f.createdAt).toISOString();
      return `
  <url>
    <loc>${baseUrl}/feedback/${f.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=3600"
    );
    res.write(xml);
    res.end();
  } catch (error) {
    console.error("❌ Error generating sitemap-feedback.xml:", error);
    res.statusCode = 500;
    res.end("Error generating sitemap");
  }

  return { props: {} };
};

export default function SitemapFeedback() {
  return null;
}
