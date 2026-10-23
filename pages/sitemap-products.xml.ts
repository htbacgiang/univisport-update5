import { GetServerSideProps } from "next";
import db from "../utils/db";
import Product from "../models/Product";

const baseUrl = "https://dongphucunivi.com";

function escapeXml(url: string) {
  return url
    .replace(/&/g, "&amp;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;");
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    await db.connectDb();

    const products = await Product.find({})
      .select("slug updatedAt createdAt")
      .lean();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${(products as any[])
    .map((p) => {
      const lastmod = p.updatedAt
        ? new Date(p.updatedAt).toISOString()
        : new Date(p.createdAt).toISOString();
      return `
  <url>
    <loc>${escapeXml(`${baseUrl}/san-pham/${p.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
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
    console.error("❌ Error generating sitemap-products.xml:", error);
    res.statusCode = 500;
    res.end("Error generating sitemap");
  }

  return { props: {} };
};

export default function SitemapProducts() {
  return null;
}
