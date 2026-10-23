/**
 * Script cập nhật tất cả các trang category sang dùng local JSON
 */

const fs = require('fs');
const path = require('path');

const categories = [
  'dong-phuc-yoga-pilates',
  'dong-phuc-pickleball',
  'dong-phuc-chay-bo',
  'dong-phuc-mma',
  'dong-phuc-cong-so',
  'dong-phuc-team-building'
];

let successCount = 0;
let errorCount = 0;

categories.forEach(category => {
  const filePath = path.join(__dirname, 'pages', 'san-pham', category, 'index.js');
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  File không tồn tại: ${category}`);
    errorCount++;
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already updated
    if (content.includes('getProductsByCategory')) {
      console.log(`⏭️  Đã cập nhật: ${category}`);
      return;
    }

    // 1. Add import sau dòng import từ lucide-react
    const importLine = content.match(/import.*from.*['"]lucide-react['"];?/);
    if (importLine) {
      content = content.replace(
        importLine[0],
        importLine[0] + "\nimport { getProductsByCategory } from '../../../lib/getProductsByCategory';"
      );
    }

    // 2. Remove toCloudinaryUrl function and replace getServerSideProps
    const pattern = /\/\/ Hàm chuyển đổi[\s\S]*?const toCloudinaryUrl[\s\S]*?};[\s]*export async function getServerSideProps\(\) \{[\s]*try \{[\s]*const response = await fetch\([^)]+\);[\s\S]*?const initialProducts = Array\.isArray\(data\.products\)[\s\S]*?\]\s*:\s*\[\];/;
    
    const replacement = `export async function getServerSideProps() {
  try {
    // Get products from local JSON file instead of API
    const initialProducts = getProductsByCategory('${category}');`;

    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Đã cập nhật: ${category}`);
      successCount++;
    } else {
      console.log(`⚠️  Không tìm thấy pattern để thay thế: ${category}`);
      errorCount++;
    }
  } catch (error) {
    console.log(`❌ Lỗi khi xử lý ${category}: ${error.message}`);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Hoàn thành!`);
console.log(`   - Thành công: ${successCount} trang`);
console.log(`   - Lỗi/Bỏ qua: ${errorCount} trang`);
console.log('='.repeat(60));
console.log('\n📝 Các trang đã cập nhật:');
categories.forEach(cat => console.log(`   - ${cat}`));
console.log('\n🧪 Test bằng: npm run dev');

