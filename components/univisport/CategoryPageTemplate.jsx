import DefaultLayout2 from '../layout/DefaultLayout2';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';
import BannerCarousel from './BannerCarousel';
import CategorySidebarLayout from './CategorySidebarLayout';
import CategoryNavSidebar from './CategoryNavSidebar';
import CategoryBreadcrumb from './CategoryBreadcrumb';
import CategoryCardGrid from './CategoryCardGrid';
import ProductGridSection from './ProductGridSection';
import parse from 'html-react-parser';
import { normalizeInternalLinkAttributes } from '../../utils/internalLinks';
import { computeGymTaxonomyCounts } from '../../lib/gymTaxonomyCounts';
import { SIDEBAR_CATEGORIES } from '../../lib/siteCategories';

export { SIDEBAR_CATEGORIES };

const GYM_CATEGORY_SLUG = 'dong-phuc-gym';

const CATEGORY_H1 = {
  'dong-phuc-gym': 'Đồng Phục Gym Thiết Kế Theo Yêu Cầu Cho Phòng Tập Và Chuỗi Fitness Center',
  'dong-phuc-yoga-pilates': 'Đồng Phục Yoga Thiết Kế Theo Yêu Cầu Cho Studio Và Cộng Đồng Wellness',
  'dong-phuc-pilates': 'Đồng Phục Pilates: Giải Pháp Đồng Phục Chuyên Nghiệp Cho Studio Và HLV',
  'dong-phuc-pickleball': 'Đồng Phục Pickleball Thiết Kế Theo Yêu Cầu Cho CLB, Học Viện Và Giải Đấu',
  'dong-phuc-chay-bo': 'Đồng Phục Chạy Bộ Thiết Kế Riêng Cho CLB Và Giải Chạy',
  'dong-phuc-mma': 'Đồng Phục MMA Thiết Kế Riêng Cho CLB Võ Thuật',
  'dong-phuc-golf-tennis': 'Đồng Phục Golf Tennis Thiết Kế Riêng Cho CLB Và Đội Nhóm',
  'dong-phuc-ao-gio': 'Đồng Phục Áo Gió Thiết Kế Riêng Cho Đội Nhóm Và Doanh Nghiệp',
};

const CATEGORY_DESCRIPTION = {
  'dong-phuc-gym':
    'Đồng phục Gym thiết kế theo yêu cầu cho phòng tập, PT Studio và chuỗi Fitness Center. Tư vấn chất liệu UNI DRY, phân vai đội ngũ, 2S Uniform, xưởng 2.000m2.',
  'dong-phuc-yoga-pilates':
    'Đồng Phục Univi tiên phong cung cấp giải pháp đồng phục Yoga theo yêu cầu cho Yoga Studio và Wellness Center trên toàn quốc. Hệ đồng phục được phát triển dựa trên đặc thù vận động, trải nghiệm người mặc và yêu cầu nhận diện thương hiệu của từng studio.',
  'dong-phuc-pilates':
    'Cách chọn đồng phục Pilates cho studio và HLV: chất liệu, form, màu, các mẫu Yoga – Pilates, quy trình đặt may và giải pháp từ Univi.',

  'dong-phuc-pickleball':
    'Đồng Phục Univi tiên phong cung cấp giải pháp đồng phục Pickleball theo yêu cầu cho câu lạc bộ, học viện, giải đấu và cộng đồng Pickleball tại Việt Nam. Sản phẩm được tối ưu về độ thoáng khí, khả năng vận động và hình ảnh thương hiệu trong thi đấu cũng như tập luyện.',

  'dong-phuc-running':
    'Đồng Phục Univi tiên phong cung cấp giải pháp đồng phục Running theo yêu cầu cho câu lạc bộ chạy bộ, doanh nghiệp và cộng đồng chạy bộ trên toàn quốc. Chất liệu được lựa chọn nhằm tối ưu trọng lượng, khả năng thoát ẩm và sự thoải mái trên quãng đường dài.',

  'dong-phuc-mma':
    'Đồng Phục Univi tiên phong cung cấp giải pháp đồng phục MMA theo yêu cầu cho phòng tập võ thuật, Boxing, Kickboxing và Martial Arts tại Việt Nam. Đồng phục được phát triển phù hợp với môi trường vận động cường độ cao, yêu cầu co giãn lớn và độ bền sử dụng lâu dài.',

  'dong-phuc-golf-tennis':
    'Đồng Phục Univi tiên phong cung cấp giải pháp đồng phục Golf và Tennis theo yêu cầu cho học viện, câu lạc bộ và doanh nghiệp. Thiết kế tập trung vào sự chỉn chu, khả năng vận động linh hoạt và tính nhận diện thương hiệu trong môi trường thể thao cao cấp.',

  'dong-phuc-ao-gio':
    'Đồng Phục Univi tiên phong cung cấp giải pháp áo gió đồng phục theo yêu cầu cho doanh nghiệp, câu lạc bộ và các sự kiện thể thao ngoài trời. Sản phẩm cân bằng giữa khả năng bảo vệ, sự thoải mái và yếu tố nhận diện thương hiệu.',

};


export default function
  CategoryPageTemplate({ categorySlug, initialProducts, categoryCounts = {}, gymCounts: gymCountsProp, enterpriseCounts, ArticleComponent, categoryArticle }) {
  const router = useRouter();
  const safeProducts = Array.isArray(initialProducts) ? initialProducts : [];
  const displayCategory =
    SIDEBAR_CATEGORIES.find(([slug]) => slug === categorySlug)?.[1] ||
    categorySlug.replace(/-/g, ' ').toUpperCase();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isGymCategory = categorySlug === GYM_CATEGORY_SLUG;

  // Đồng phục Gym không có trang con riêng cho từng dòng sản phẩm/kiểu cổ — sidebar
  // và Navbar chỉ lọc sản phẩm ngay trên /dong-phuc-gym qua query ?line=&collar=.
  const activeProductLine = isGymCategory && typeof router.query.line === 'string' ? router.query.line : '';
  const activeCollarType = isGymCategory && typeof router.query.collar === 'string' ? router.query.collar : '';

  // Danh mục con (Product Line) của Đồng phục Gym — tính từ dữ liệu sản phẩm thật.
  // Trang /dong-phuc-gym tự tính từ initialProducts; các trang danh mục khác nhận
  // sẵn qua prop gymCounts (để sidebar dùng chung có thể mở rộng nhánh Gym ở bất kỳ đâu).
  const gymCounts = gymCountsProp ?? (isGymCategory ? computeGymTaxonomyCounts(safeProducts) : null);

  const displayProducts = isGymCategory && (activeProductLine || activeCollarType)
    ? safeProducts.filter((p) =>
      (!activeProductLine || p.productLine === activeProductLine) &&
      (!activeCollarType || p.collarType === activeCollarType)
    )
    : safeProducts;

  const activeLine = activeProductLine ? gymCounts?.lines.find((l) => l.slug === activeProductLine) : null;
  const activeCollar = activeCollarType ? activeLine?.collars.find((c) => c.slug === activeCollarType) : null;
  const filteredEmptyLabel = activeCollar?.label || activeLine?.label;

  const selectedArticle =
    categoryArticle?.articleType === 'custom' && categoryArticle?.article
      ? categoryArticle.article
      : null;
  const hasArticle = Boolean(selectedArticle || ArticleComponent);
  const isArticleVisible = categoryArticle?.isVisible !== false;

  const renderCategoryArticle = () => {
    if (selectedArticle) {
      const parseOptions = {
        replace(domNode) {
          if (domNode.type === "tag" && domNode.name === "a") {
            normalizeInternalLinkAttributes(domNode.attribs);
          }

          if (
            domNode.type === "tag" &&
            domNode.name === "img" &&
            domNode.attribs?.["data-caption"] &&
            domNode.parent?.name !== "figure"
          ) {
            const { class: className, style, ...attribs } = domNode.attribs;
            const caption = attribs["data-caption"];
            return (
              <figure className="image-caption-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
                <img className={className || ""} {...attribs} />
                <figcaption>{caption}</figcaption>
              </figure>
            );
          }
        }
      };
      return (
        <article className="bg-white rounded-xl border border-gray-100 px-4 py-6 md:px-8 md:py-8 shadow-sm">
          <div className="blog prose prose-lg max-w-none w-full [&_img]:mx-auto">
            <style jsx>{`
                    .blog :global(img) { display: block; margin: 1.5em auto; }
                    .blog :global(figure) { margin: 1.5em 0; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                    .blog :global(figure img) { display: block; margin: 0 auto; }
                    .blog :global(figcaption) { margin-top: 0; padding-bottom: 0.2rem; font-size: 0.875em; color: #6b7280; font-style: italic; text-align: center; width: 100%; max-width: 100%; }
                    .blog :global(table) { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; max-width: 100%; width: max-content !important; margin: 1.5em auto !important; border-collapse: collapse; border: 1px solid #d1d5db; }
                    .blog :global(td), .blog :global(th) { padding: 0.5em 0.5em; border: 1px solid #d1d5db; text-align: left; vertical-align: top; }
                    .blog :global(th) { background-color: #f3f4f6; font-weight: 600; color: #111827; }
                    .blog :global(td p), .blog :global(th p) { text-align: left !important; margin: 0; }
                  `}</style>
            {parse(selectedArticle.content || '', parseOptions)}
          </div>

          {Array.isArray(selectedArticle.faqs) && selectedArticle.faqs.length > 0 && (
            <div className="mt-10 rounded-xl border border-gray-100 bg-gray-50 p-5 md:p-6">
              <h2 className="mb-4 text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900">Câu hỏi thường gặp</h2>
              <div className="space-y-3">
                {selectedArticle.faqs.map((faq, index) => (
                  <details key={index} className="group rounded-lg border border-gray-200 bg-white">
                    <summary className="flex cursor-pointer items-center justify-between px-4 py-3 font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                      <span>{faq.question}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="border-t border-gray-100 px-4 py-3 text-sm leading-6 text-gray-700">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {selectedArticle.postAuthor && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                {selectedArticle.postAuthor.avatar ? (
                  <Image
                    src={selectedArticle.postAuthor.avatar}
                    alt={selectedArticle.postAuthor.name}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#105d97]">
                    <span className="text-lg font-bold text-white">
                      {selectedArticle.postAuthor.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900">{selectedArticle.postAuthor.name}</p>
                  {selectedArticle.postAuthor.role && (
                    <p className="mt-0.5 text-sm text-[#105d97]">{selectedArticle.postAuthor.role}</p>
                  )}
                  {selectedArticle.postAuthor.bio && (
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                      {selectedArticle.postAuthor.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </article>
      );
    }

    return ArticleComponent ? <ArticleComponent /> : null;
  };

  const sidebarContent = (
    <CategoryNavSidebar
      activeCategory={categorySlug}
      activeProductLine={activeProductLine}
      activeCollarType={activeCollarType}
      categoryCounts={categoryCounts}
      gymCounts={gymCounts}
      enterpriseCounts={enterpriseCounts}
      onNavigate={() => setIsSidebarOpen(false)}
    />
  );

  const breadcrumbItems = categorySlug === 'dong-phuc-the-thao'
    ? [{ name: 'Đồng Phục Thể Thao' }]
    : [
        { name: 'Đồng Phục Thể Thao', href: '/dong-phuc-the-thao' },
        { name: displayCategory },
      ];

  return (
    <DefaultLayout2>
      <div className="h-[70px]"></div>
      <div className="p-4 md:p-6 container mx-auto">
        <CategorySidebarLayout
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sidebar={sidebarContent}
          banner={<BannerCarousel />}
        >
          <CategoryBreadcrumb items={breadcrumbItems} />

          {/* H1 + mô tả + Stats card — hiển thị cho tất cả danh mục */}
          <>
            {/* H1 + đoạn mô tả */}
            <section className="bg-white rounded-xl border border-gray-100 p-3 mb-4">
              <h1 className="text-xl md:text-3xl font-medium tracking-tight leading-6 text-gray-900 mb-1">
                {categorySlug === 'dong-phuc-gym'
                  ? 'May Đồng Phục Gym Theo Yêu Cầu Cho Phòng Tập, PT Studio Và Fitness Center'
                  : CATEGORY_H1[categorySlug] || displayCategory}
              </h1>
              {categorySlug === 'dong-phuc-gym' ? (
                <div className="hidden md:block space-y-2 text-gray-700 leading-6">
                  <p>
                    Đồng phục Gym không chỉ là trang phục làm việc mà còn là một phần
                    của trải nghiệm thương hiệu trong phòng tập hiện đại. Từ huấn luyện
                    viên cá nhân, GroupX Instructor, lễ tân đến đội ngũ sale và hội viên,
                    mỗi vị trí đều cần một cấu hình đồng phục khác nhau về chất liệu,
                    form dáng và khả năng vận động.
                  </p>
                  <p>
                    Một hệ đồng phục được thiết kế đúng ngay từ đầu sẽ giúp phòng tập
                    nâng cao nhận diện thương hiệu, tạo trải nghiệm chuyên nghiệp cho
                    hội viên và giảm đáng kể chi phí phát sinh khi mở rộng thêm cơ sở
                    hoặc tuyển mới nhân sự trong tương lai.
                  </p>
                </div>
              ) : (
                <p className="hidden md:block text-gray-700 leading-6">
                  {CATEGORY_DESCRIPTION[categorySlug] ||
                    `Khám phá các mẫu ${displayCategory.toLowerCase()} tại Đồng Phục Univi. Nhận thiết kế và sản xuất theo yêu cầu cho phòng tập, CLB, đội nhóm và doanh nghiệp.`}
                </p>
              )}
            </section>

          </>

          <ProductGridSection
            products={displayProducts}
            emptyMessage={
              filteredEmptyLabel
                ? `Không tìm thấy sản phẩm nào thuộc ${filteredEmptyLabel}.`
                : `Không tìm thấy sản phẩm nào trong danh mục ${displayCategory}.`
            }
            ariaLabel={`Danh sách sản phẩm ${displayCategory}`}
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

          {hasArticle && isArticleVisible && (
            <div className="mt-8 md:mt-10">
              {renderCategoryArticle()}
            </div>
          )}
        </CategorySidebarLayout>
      </div>
    </DefaultLayout2>
  );
}
