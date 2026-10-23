const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

async function regenerateSitemap() {
  try {
    console.log('🔄 Regenerating sitemap...');
    
    // Chạy next-sitemap
    console.log('📝 Running next-sitemap...');
    await execAsync('npx next-sitemap --config next-sitemap.config.js');
    
    console.log('✅ Sitemap regenerated successfully!');
    console.log('📁 Files updated:');
    console.log('   - public/sitemap.xml');
    console.log('   - public/sitemap-0.xml');
    console.log('   - public/robots.txt');
    
  } catch (error) {
    console.error('❌ Error regenerating sitemap:', error.message);
    process.exit(1);
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  regenerateSitemap();
}

module.exports = regenerateSitemap;

