import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, SlidersHorizontal, ArrowRight } from 'lucide-react';
import parse from 'html-react-parser';
import DefaultLayout2 from '../layout/DefaultLayout2';
import BannerCarousel from './BannerCarousel';
import CategorySidebarLayout from './CategorySidebarLayout';
import CategoryNavSidebar from './CategoryNavSidebar';
import CategoryBreadcrumb from './CategoryBreadcrumb';
import CategoryCardGrid from './CategoryCardGrid';
import ProductGridSection from './ProductGridSection';
import PartnersSection from './PartnersSection';
import ProcessSteps from './ProcessSteps';
import CTABannerSection from './CTABanner';
import { normalizeInternalLinkAttributes } from '../../utils/internalLinks';
import { ENTERPRISE_FLAT_SLUGS } from '../../lib/enterpriseFlatSlugs';

const CATEGORY_SLUG = 'dong-phuc-doanh-nghiep';

// FAQ mặc định — hiển thị khi chưa có bài viết CMS (categoryArticle) ghi đè.
// Nội dung ngắn, có thể thay thế/bổ sung qua Dashboard > Bài viết danh mục
// mà không cần sửa code (giống cơ chế categoryArticle của Đồng phục Gym).
const DEFAULT_FAQS = [
  {
    question: 'Univi nhận may đồng phục doanh nghiệp với số lượng bao nhiêu?',
    answer:
      'Univi nhận may từ đơn hàng nhỏ cho phòng ban đến đơn hàng lớn cho toàn doanh nghiệp, chuỗi chi nhánh. Số lượng tối thiểu tuỳ loại sản phẩm, vui lòng liên hệ để được tư vấn cụ thể.',
  },
  {
    question: 'Có thể thiết kế theo logo và màu nhận diện thương hiệu riêng không?',
    answer:
      'Có. Đội ngũ thiết kế của Univi sẽ lên mockup miễn phí theo logo, màu sắc và bộ nhận diện thương hiệu của doanh nghiệp trước khi sản xuất.',
  },
  {
    question: 'Thời gian sản xuất và giao hàng mất bao lâu?',
    answer:
      'Thời gian sản xuất trung bình 7–10 ngày làm việc sau khi chốt mẫu, tuỳ số lượng và loại sản phẩm. Univi giao hàng toàn quốc, hỗ trợ giao gấp cho đơn hàng cần tiến độ nhanh.',
  },
];

// Pillar Page cho nhóm kinh doanh Đồng phục Doanh nghiệp — KHÔNG phải trang filter
// sản phẩm đơn giản. Gồm các khối marketing (Hero, giải pháp, năng lực, khách hàng,
// quy trình, FAQ, CTA) ở trên, và khối danh mục + toàn bộ sản phẩm (tái sử dụng
// CategorySidebarLayout/CategoryNavSidebar/ProductGridSection như các trang danh mục
// khác) ở dưới để đảm bảo mọi sản phẩm thuộc Đồng phục Doanh nghiệp đều hiển thị tại đây.
export default function EnterprisePillarPage({
  initialProducts = [],
  enterpriseCounts,
  categoryCounts,
  gymCounts,
  categoryArticle,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categoryCards = (enterpriseCounts?.lines || []).map((line) => ({
    href: `/${ENTERPRISE_FLAT_SLUGS[line.slug] || `${CATEGORY_SLUG}/${line.slug}`}`,
    name: line.label,
    count: line.count,
    image: line.image,
  }));

  const selectedArticle =
    categoryArticle?.articleType === 'custom' && categoryArticle?.article
      ? categoryArticle.article
      : null;
  const isArticleVisible = categoryArticle?.isVisible !== false;
  const faqs = selectedArticle?.faqs?.length > 0 ? selectedArticle.faqs : DEFAULT_FAQS;

  const [expandedFaq, setExpandedFaq] = useState(null);

  const sidebarContent = (
    <CategoryNavSidebar
      activeCategory={CATEGORY_SLUG}
      activeProductLine=""
      categoryCounts={categoryCounts}
      gymCounts={gymCounts}
      enterpriseCounts={enterpriseCounts}
      onNavigate={() => setIsSidebarOpen(false)}
    />
  );

  return (
    <DefaultLayout2>
      <div className="h-[70px]"></div>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-[#0d4c7a] to-[#105d97] text-white">
        <div className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/70 mb-3">
              Giải pháp đồng phục cho doanh nghiệp
            </p>
            <h1 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight mb-4">
              Đồng Phục Doanh Nghiệp Thiết Kế Theo Nhận Diện Thương Hiệu
            </h1>
            <p className="text-white/85 text-base md:text-lg leading-6 max-w-2xl">
              Từ Polo, Áo thun, Sơ mi, Vest công sở đến đồng phục Teambuilding và Sự kiện —
              Đồng Phục Univi tư vấn, thiết kế và sản xuất trọn gói cho doanh nghiệp,
              đảm bảo đồng bộ nhận diện thương hiệu ở mọi vị trí nhân sự.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event('openContactModal'))}
                className="inline-flex items-center gap-2 bg-white text-[#105d97] font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Nhận tư vấn & báo giá
              </button>
              <a
                href="#danh-muc-doanh-nghiep"
                className="inline-flex items-center gap-2 border border-white/40 text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Xem danh mục sản phẩm
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="p-4 md:p-6 container mx-auto" id="danh-muc-doanh-nghiep">
        {/* ─── Danh mục Đồng phục Doanh nghiệp ─────────────────────────── */}
        {categoryCards.length > 0 && (
          <CategoryCardGrid title="Danh mục Đồng phục Doanh nghiệp" items={categoryCards} />
        )}

        {/* ─── Năng lực Univi (thiết kế / R&D / sản xuất) ──────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1.5">Thiết kế theo nhận diện thương hiệu</h3>
            <p className="text-sm text-gray-700 leading-6">
              Đội ngũ thiết kế lên mockup miễn phí theo logo, màu sắc và bộ nhận diện
              riêng của từng doanh nghiệp, chỉnh sửa đến khi hài lòng.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1.5">Năng lực R&amp;D chất liệu</h3>
            <p className="text-sm text-gray-700 leading-6">
              Nghiên cứu và lựa chọn chất liệu phù hợp từng vị trí công việc — từ vải
              công sở ít nhăn đến vải thoáng khí cho hoạt động ngoài trời.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-1.5">Năng lực sản xuất</h3>
            <p className="text-sm text-gray-700 leading-6">
              Xưởng 2.000m² tại Hà Nội, công suất khoảng 100.000 sản phẩm/tháng, lưu
              chuẩn để tái đặt hàng khi doanh nghiệp mở rộng nhân sự.
            </p>
          </div>
        </section>

        <CategorySidebarLayout
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sidebar={sidebarContent}
          banner={<BannerCarousel />}
        >
          <CategoryBreadcrumb items={[{ name: 'Đồng phục Doanh nghiệp' }]} />

          <ProductGridSection
            products={initialProducts}
            emptyMessage="Chưa có sản phẩm nào trong danh mục Đồng phục Doanh nghiệp."
            ariaLabel="Sản phẩm Đồng phục Doanh nghiệp"
            filterButton={
              <button
                onClick={() => setIsSidebarOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-300 px-3 py-2 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Lọc sản phẩm
              </button>
            }
          />

          {selectedArticle && isArticleVisible && (
            <article className="mt-8 md:mt-10 bg-white rounded-xl border border-gray-100 px-4 py-6 md:px-8 md:py-8 shadow-sm">
              <div className="blog prose prose-base md:prose-lg max-w-none w-full text-gray-700 [&_img]:mx-auto">
                {parse(selectedArticle.content || '', {
                  replace(domNode) {
                    if (domNode.type === 'tag' && domNode.name === 'a') {
                      normalizeInternalLinkAttributes(domNode.attribs);
                    }
                  },
                })}
              </div>
            </article>
          )}
        </CategorySidebarLayout>
      </div>

      {/* ─── Khách hàng / Dự án doanh nghiệp ──────────────────────────── */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900 mb-6">
            Doanh nghiệp đã tin tưởng Đồng Phục Univi
          </h2>
          <PartnersSection category="doanh-nghiep" />
        </div>
      </section>

      {/* ─── Quy trình triển khai ─────────────────────────────────────── */}
      <ProcessSteps />

      {/* ─── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-center text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900 mb-8">
            Câu hỏi thường gặp
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white">
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-900"
                  aria-expanded={expandedFaq === index}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="border-t border-gray-100 px-4 py-3 text-sm leading-6 text-gray-700">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <CTABannerSection />
    </DefaultLayout2>
  );
}
