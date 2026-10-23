/**
 * Script cập nhật getServerSideProps cho các category pages
 */

const fs = require('fs');
const path = require('path');

const updates = [
  { category: 'dong-phuc-pickleball', pattern: 'dong-phuc-pickleball' },
  { category: 'dong-phuc-chay-bo', pattern: 'dong-phuc-chay-bo' },
  { category: 'dong-phuc-mma', pattern: 'dong-phuc-mma' },
  { category: 'dong-phuc-cong-so', pattern: 'dong-phuc-cong-so' },
  { category: 'dong-phuc-team-building', pattern: 'dong-phuc-team-building' }
];

updates.forEach(({ category, pattern }) => {
  const filePath = path.join(__dirname, 'pages', 'san-pham', category, 'index.js');
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File không tồn tại: ${category}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to find and replace
    const regex = new RegExp(
      `const response = await fetch\\(\`\\$\\{process\\.env\\.BASE_URL\\}/api/products\\?category=${pattern}\`\\);[\\s\\S]*?const initialProducts = Array\\.isArray\\(data\\.products\\)[\\s\\S]*?\\]\\s*:\\s*\\[\\];`,
      'g'
    );
    
    const replacement = `// Get products from local JSON file instead of API
    const initialProducts = getProductsByCategory('${pattern}');`;

    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Đã cập nhật: ${category}`);
    } else {
      console.log(`⚠️  Không tìm thấy pattern: ${category}`);
    }
  } catch (error) {
    console.log(`❌ Lỗi: ${category} - ${error.message}`);
  }
});

console.log('\n✅ Hoàn thành!');

