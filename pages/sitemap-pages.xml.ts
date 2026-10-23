import { GetServerSideProps } from "next";

const baseUrl = "https://dongphucunivi.com";

const pages = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/gioi-thieu", priority: 0.9, changefreq: "monthly" },
  { path: "/lien-he", priority: 0.8, changefreq: "monthly" },
  { path: "/san-pham", priority: 0.9, changefreq: "daily" },
  { path: "/dang-ky-dai-ly", priority: 0.8, changefreq: "monthly" },
  { path: "/huong-dan-dat-hang", priority: 0.7, changefreq: "monthly" },
  { path: "/chinh-sach-bao-mat", priority: 0.5, changefreq: "yearly" },
  { path: "/chinh-sach-doi-tra", priority: 0.6, changefreq: "monthly" },
  { path: "/chinh-sach-bao-hanh", priority: 0.6, changefreq: "monthly" },
  { path: "/chinh-sach-dai-ly", priority: 0.7, changefreq: "monthly" },
  { path: "/dieu-khoan-su-dung", priority: 0.5, changefreq: "yearly" },
  { path: "/ho-so-nang-luc", priority: 0.8, changefreq: "monthly" },
  { path: "/tuyen-dung", priority: 0.6, changefreq: "weekly" },
  { path: "/giai-phap-2s", priority: 0.8, changefreq: "monthly" },
  { path: "/chat-lieu-vai", priority: 0.9, changefreq: "weekly" },
  { path: "/bang-mau", priority: 0.9, changefreq: "weekly" },
];

function generate() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (p) => `
  <url>
    <loc>${baseUrl}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority.toFixed(1)}</priority>
  </url>`
    )
    .join("")}
</urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=3600"
  );
  res.write(generate());
  res.end();

  return { props: {} };
};

export default function SitemapPages() {
  return null;
}
