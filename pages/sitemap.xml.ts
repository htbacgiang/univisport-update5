import { GetServerSideProps } from "next";

const baseUrl = "https://dongphucunivi.com";

function generateSiteMap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-posts.xml</loc>
  </sitemap>

  <sitemap>
    <loc>${baseUrl}/sitemap-feedback.xml</loc>
  </sitemap>

</sitemapindex>`;
}

// Page Router: dùng getServerSideProps để set headers và trả XML
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );
  res.write(generateSiteMap());
  res.end();

  return { props: {} };
};

// Component rỗng — không bao giờ render vì res.end() đã gửi response
export default function SitemapIndex() {
  return null;
}
