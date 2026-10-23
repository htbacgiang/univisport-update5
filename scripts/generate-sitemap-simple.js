const fs = require('fs');
const path = require('path');

async function generateSitemap() {
  try {
    console.log('🔄 Generating sitemap...');
    
    // Tạo sitemap content
    const baseUrl = 'https://dongphucunivi.com';
    const currentDate = new Date().toISOString();

    // Static routes
    const staticRoutes = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/gioi-thieu', priority: '0.8', changefreq: 'weekly' },
      { url: '/san-pham', priority: '0.9', changefreq: 'daily' },
      { url: '/bai-viet', priority: '0.8', changefreq: 'daily' },
      { url: '/lien-he', priority: '0.7', changefreq: 'monthly' },
      { url: '/dang-nhap', priority: '0.5', changefreq: 'monthly' },
      { url: '/dang-ky', priority: '0.5', changefreq: 'monthly' },
    ];

    // Product category routes
    const productCategoryRoutes = [
      { url: '/dong-phuc-ao-polo', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-chay-bo', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-cong-so', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-golf-tennis', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-gym', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-mma', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-pickleball', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-team-building', priority: '0.8', changefreq: 'weekly' },
      { url: '/dong-phuc-yoga-pilates', priority: '0.8', changefreq: 'weekly' },
    ];

    // Tạo XML sitemap
    let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

    // Thêm static routes
    staticRoutes.forEach(route => {
      const lastmod = currentDate;
      sitemapXml += `
<url><loc>${baseUrl}${route.url}</loc><lastmod>${lastmod}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
    });

    // Thêm product category routes
    productCategoryRoutes.forEach(route => {
      const lastmod = currentDate;
      sitemapXml += `
<url><loc>${baseUrl}${route.url}</loc><lastmod>${lastmod}</lastmod><changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
    });

    sitemapXml += `
</urlset>`;

    // Ghi file sitemap vào public folder
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml);

    console.log('✅ Sitemap generated successfully!');
    console.log(`📊 Stats: ${staticRoutes.length} static + ${productCategoryRoutes.length} product categories = ${staticRoutes.length + productCategoryRoutes.length} total routes`);
    console.log(`📁 Files created:`);
    console.log(`   - public/sitemap.xml`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  generateSitemap();
}

module.exports = generateSitemap;
