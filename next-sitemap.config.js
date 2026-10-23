module.exports = {
  siteUrl: "https://dongphucunivi.com",
  generateRobotsTxt: false,
  sitemapSize: 7000,
  exclude: [
    '/admin/**',
    '/dashboard/**',
    '/api/**',
    '/auth/**'
  ],
  additionalPaths: async (config) => {
    const result = [];
    
    // Import models
    const { default: Post } = await import('./models/Post');
    const { default: Product } = await import('./models/Product');
    const { default: dbConnect } = await import('./lib/mongoose');
    
    try {
      await dbConnect();
      
      // Get posts
      const posts = await Post.find({ isDraft: { $ne: true } }).select('slug updatedAt').lean();
      posts.forEach(post => {
        result.push({
          loc: `/bai-viet/${post.slug}`,
          lastmod: post.updatedAt || post.createdAt,
          changefreq: 'weekly',
          priority: 0.7,
        });
      });
      
      // Get products
      const products = await Product.find({}).select('slug updatedAt').lean();
      products.forEach(product => {
        result.push({
          loc: `/san-pham/${product.slug}`,
          lastmod: product.updatedAt || product.createdAt,
          changefreq: 'weekly',
          priority: 0.8,
        });
      });
    } catch (error) {
      console.error('Error fetching dynamic routes:', error);
    }
    
    return result;
  },
};