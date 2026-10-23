/**
 * Script để cập nhật tất cả các trang category từ API sang local JSON
 * Chạy: node update-category-pages.js
 */

const fs = require('fs');
const path = require('path');

const categoryPages = [
  'dong-phuc-pickleball',
  'dong-phuc-mma',
  'dong-phuc-su-kien',
  'dong-phuc-le-tan',
  'dong-phuc-chay-bo',
  'dong-phuc-ao-polo',
  'dong-phuc-team-building',
  'dong-phuc-yoga-pilates',
  'dong-phuc-golf-tennis',
  'dong-phuc-ao-thun',
  'dong-phuc-cong-so',
];

categoryPages.forEach(category => {
  const filePath = path.join(__dirname, 'pages', 'san-pham', category, 'index.js');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Bỏ qua (file không tồn tại): ${category}/index.js`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already updated
  if (content.includes('getProductsByCategory')) {
    console.log(`⏭️  Đã cập nhật: ${category}/index.js`);
    return;
  }

  // 1. Add import at the top
  const importPattern = /(import.*from.*['"]lucide-react['"];?\n)/;
  if (importPattern.test(content)) {
    content = content.replace(
      importPattern,
      "$1import { getProductsByCategory } from '../../../lib/getProductsByCategory';\n"
    );
  }

  // 2. Replace the entire getServerSideProps function
  const getServerSidePropsPattern = /\/\/ Hàm chuyển đổi đường dẫn tương đối thành URL Cloudinary[\s\S]*?export async function getServerSideProps\(\) \{[\s\S]*?const initialProducts = Array\.isArray\(data\.products\)[\s\S]*?\]\s*:\s*\[\];/;
  
  const replacement = `export async function getServerSideProps() {
  try {
    // Get products from local JSON file instead of API
    const initialProducts = getProductsByCategory('${category}');`;

  if (getServerSidePropsPattern.test(content)) {
    content = content.replace(getServerSidePropsPattern, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Đã cập nhật: ${category}/index.js`);
  } else {
    console.log(`⚠️  Không tìm thấy pattern: ${category}/index.js`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('✅ Hoàn thành cập nhật các trang category!');
console.log('='.repeat(50));
console.log('\n📝 Lưu ý:');
console.log('   - Trang dong-phuc-gym đã được cập nhật thủ công');
console.log('   - Các trang còn lại đã được cập nhật bằng script');
console.log('   - Kiểm tra lại bằng: npm run dev');
console.log('');

