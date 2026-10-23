// Nội dung H1/mô tả/metadata riêng cho từng category landing page cấp 2 của
// Đồng phục Doanh nghiệp (/dong-phuc-doanh-nghiep/[categorySlug]).
// Tách khỏi lib/productTaxonomy.js (chỉ chứa quan hệ dữ liệu) để không phải sửa
// lại cấu trúc taxonomy, tương tự lib/gymHierarchyContent.js của Đồng phục Gym.
// Nội dung ở đây là placeholder ngắn gọn — có thể bổ sung/viết lại dài hơn sau
// mà không cần đổi code.

const categoryContent = {
  'polo': {
    h1: 'Áo Polo Đồng Phục Doanh Nghiệp Theo Yêu Cầu',
    description:
      'May áo polo doanh nghiệp theo yêu cầu, thêu/in logo thương hiệu, chất liệu thoáng mát, thiết kế miễn phí, giao hàng toàn quốc.',
    metaTitle: 'Áo Polo Doanh Nghiệp Theo Yêu Cầu | Đồng Phục Univi',
    metaDescription:
      'Đồng phục Polo doanh nghiệp lịch sự, dễ phối cùng nhận diện thương hiệu, phù hợp nhân viên văn phòng, lễ tân và đội ngũ kinh doanh.',
    ogImage: 'https://dongphucunivi.com/thumbnail/dong-phuc-ao-polo.jpg',
  },
  'so-mi': {
    h1: 'Áo Sơ Mi Doanh Nghiệp Chuẩn Phong Cách Công Sở',
    description:
      'May sơ mi đồng phục doanh nghiệp theo yêu cầu, thiết kế theo nhận diện thương hiệu, tư vấn chất liệu và form, duyệt mẫu trước sản xuất, giao toàn quốc.',
    metaTitle: 'Sơ Mi Doanh Nghiệp Theo Yêu Cầu | Đồng Phục Univi',
    metaDescription:
      'May sơ mi đồng phục doanh nghiệp theo yêu cầu, vải cao cấp ít nhăn, thiết kế theo nhận diện thương hiệu, giao toàn quốc.',
    ogImage: 'https://dongphucunivi.com/thumbnail/dong-phuc-ao-so-mi-doanh-nghiep.jpg',
  },
  'vest': {
    h1: 'Đồng Phục Vest Doanh Nghiệp Theo Yêu Cầu',
    description:
      'May vest công sở, đồng phục doanh nghiệp theo yêu cầu, tư vấn form và chất liệu, thiết kế theo nhận diện thương hiệu, duyệt mẫu trước sản xuất',
    metaTitle: 'Vest Công Sở Doanh Nghiệp Theo Yêu Cầu | Đồng Phục Univi',
    metaDescription:
      'Vest đồng phục doanh nghiệp là hệ trang phục vest được thiết kế và chuẩn hóa cho nhiều nhân sự theo cùng một nhận diện thương hiệu, đồng thời điều chỉnh form, cơ cấu size và cách phối theo vai trò sử dụng.',
    ogImage: 'https://dongphucunivi.com/thumbnail/dong-phuc-vest-cong-so.jpg',
  },
  'ao-gio': {
    h1: 'Áo Gió Doanh Nghiệp Đồng Bộ Cho Đội Nhóm',
    description:
      'Áo gió đồng phục doanh nghiệp giữ ấm, chống gió nhẹ, phù hợp sự kiện ngoài trời, công tác và nhận diện đội nhóm.',
    metaTitle: 'Áo Gió Doanh Nghiệp Theo Yêu Cầu | Đồng Phục Univi',
    metaDescription:
      'May áo gió đồng phục doanh nghiệp theo yêu cầu, 1 lớp/2 lớp, in thêu logo, thiết kế miễn phí, giao hàng toàn quốc.',
    ogImage: 'https://dongphucunivi.com/thumbnail/dong-phuc-teambuilding.jpg',
  },
  'teambuilding': {
    h1: 'Đồng Phục Teambuilding Doanh Nghiệp',
    description:
      'Đồng phục Teambuilding doanh nghiệp là trang phục được thiết kế cho company trip, family day, kick-off và các hoạt động gắn kết nội bộ, với cấu hình được lựa chọn theo người mặc, hoạt động, địa điểm, thời tiết và yêu cầu nhận diện thương hiệu.  ',
    metaTitle: 'Đồng Phục Teambuilding Doanh Nghiệp | Đồng Phục Univi',
    metaDescription:
      'Đồng phục Teambuilding doanh nghiệp theo yêu cầu, tư vấn kiểu áo, chất liệu, form, màu và logo theo hoạt động, thời tiết và lịch trình sự kiện.',
    ogImage: 'https://dongphucunivi.com/thumbnail/dong-phuc-teambuilding.jpg',
  },
  'su-kien': {
    h1: 'Đồng Phục Sự Kiện Doanh Nghiệp',
    description:
      'Đồng phục sự kiện chuyên nghiệp cho lễ khai trương, hội nghị, triển lãm và các chương trình truyền thông của doanh nghiệp.',
    metaTitle: 'Đồng Phục Sự Kiện Doanh Nghiệp | Đồng Phục Univi',
    metaDescription:
      'May đồng phục sự kiện theo yêu cầu, thiết kế nhanh, đúng tiến độ chương trình, giao hàng toàn quốc.',
    ogImage: 'https://dongphucunivi.com/thumbnail/dong-phuc-teambuilding.jpg',
  },
  'bao-ho': {
    h1: 'Đồng Phục Bảo Hộ Lao Động Doanh Nghiệp',
    description:
      'Đồng phục bảo hộ lao động doanh nghiệp là trang phục được thiết kế theo môi trường làm việc, vị trí công việc và yêu cầu nhận diện; có thể bao gồm áo, quần, áo khoác hoặc các cấu hình khác tùy brief. Đồng phục không thay thế PPE chuyên dụng hoặc các yêu cầu bảo vệ đã được HSE xác định.',
    metaTitle: 'Đồng Phục Bảo Hộ Lao Động Theo Yêu Cầu | Đồng Phục Univi',
    metaDescription:
      'Đồng phục bảo hộ lao động doanh nghiệp theo yêu cầu, tư vấn kiểu dáng, chất liệu, form, màu và logo theo môi trường làm việc, vị trí và yêu cầu HSE.',
    ogImage: 'https://dongphucunivi.com/thumbnail/bhld.jpg',
  },
  'phu-kien': {
    h1: 'Phụ Kiện & Quà Tặng Doanh Nghiệp',
    description:
      'Phụ kiện và quà tặng đồng bộ nhận diện thương hiệu - mũ, khăn, túi, balo... in thêu logo theo yêu cầu cho sự kiện và đối tác.',
    metaTitle: 'Phụ Kiện & Quà Tặng Doanh Nghiệp Theo Yêu Cầu | Đồng Phục Univi',
    metaDescription:
      'Phụ kiện và quà tặng doanh nghiệp theo yêu cầu, tư vấn sản phẩm, số lượng, ngân sách, nhận diện và cách cá nhân hóa cho sự kiện, khách hàng và nhân viên.',
    ogImage: 'https://dongphucunivi.com/thumbnail/qua-tang-doanh-nghiep.jpg',
  },
};

export function getEnterpriseCategoryContent(categorySlug) {
  return categoryContent[categorySlug] || null;
}
