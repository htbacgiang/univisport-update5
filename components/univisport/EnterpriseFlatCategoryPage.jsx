import CategoryHierarchyPage from './CategoryHierarchyPage';
import PoloUniformsUniviPage from './bai-viet/PoloUniformsUniviPage';
import TeamBuildingUniviPage from './bai-viet/TeamBuildingUniviPage';
import EventUniformsUniviPage from './bai-viet/EventUniformsUniviPage';
import GiftAccessoriesUniviPage from './bai-viet/GiftAccessoriesUniviPage';
import WorkwearUniviPage from './bai-viet/WorkwearUniviPage';
import VestUniviPage from './bai-viet/VestUniviPage';
import ShirtUniviPage from './bai-viet/ShirtUniviPage';

export const ENTERPRISE_CATEGORY_SLUG = 'dong-phuc-doanh-nghiep';
export const ENTERPRISE_CATEGORY_LABEL = 'Đồng phục Doanh nghiệp';

// Nội dung dài (bài viết SEO) đã có sẵn cho một số dòng sản phẩm — tái sử dụng
// thay vì viết mới. Dòng chưa có bài viết riêng (ao-thun, vest, ao-gio) chỉ hiển
// thị H1 + mô tả ngắn từ enterpriseHierarchyContent.js cho tới khi có nội dung bổ sung.
const ARTICLE_COMPONENTS = {
  'polo': PoloUniformsUniviPage,
  'teambuilding': TeamBuildingUniviPage,
  'su-kien': EventUniformsUniviPage,
  'so-mi': ShirtUniviPage,
  'phu-kien': GiftAccessoriesUniviPage,
  'bao-ho': WorkwearUniviPage,
  'vest': VestUniviPage,
};

// Shell dùng chung cho các trang danh mục con phẳng của Đồng phục Doanh nghiệp
// (vd /dong-phuc-polo, /dong-phuc-so-mi) — thay cho /dong-phuc-doanh-nghiep/[categorySlug]
// trước đây. Breadcrumb vẫn hiển thị Đồng phục Doanh nghiệp làm mục cha để giữ
// đúng phân cấp nội dung dù URL đã phẳng 1 cấp.
export default function EnterpriseFlatCategoryPage({
  productLine,
  lineLabel,
  content,
  products,
  enterpriseCounts,
  gymCounts,
  categoryCounts,
}) {
  return (
    <CategoryHierarchyPage
      activeCategory={ENTERPRISE_CATEGORY_SLUG}
      activeProductLine={productLine}
      breadcrumbItems={[
        { name: ENTERPRISE_CATEGORY_LABEL, href: `/${ENTERPRISE_CATEGORY_SLUG}` },
        { name: lineLabel },
      ]}
      h1={content?.h1 || lineLabel}
      description={content?.description}
      products={products}
      categoryCounts={categoryCounts}
      gymCounts={gymCounts}
      enterpriseCounts={enterpriseCounts}
      ArticleComponent={ARTICLE_COMPONENTS[productLine]}
      emptyMessage={`Không tìm thấy sản phẩm nào trong ${lineLabel}.`}
    />
  );
}
