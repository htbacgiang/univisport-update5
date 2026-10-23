import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import DefaultLayout2 from '../layout/DefaultLayout2';
import BannerCarousel from './BannerCarousel';
import CategorySidebarLayout from './CategorySidebarLayout';
import CategoryNavSidebar from './CategoryNavSidebar';
import CategoryBreadcrumb from './CategoryBreadcrumb';
import ProductGridSection from './ProductGridSection';

// Shell dùng chung cho trang category landing (cấp 2) của một business group
// có trang con riêng theo productLine — vd: /dong-phuc-doanh-nghiep/[categorySlug].
// Đồng phục Gym không dùng shell này: các dòng sản phẩm/kiểu cổ của Gym chỉ là
// filter trên chính /dong-phuc-gym (xem CategoryPageTemplate.jsx), không có route riêng.
export default function CategoryHierarchyPage({
  activeCategory,
  breadcrumbItems,
  h1,
  description,
  products,
  categoryCounts,
  gymCounts,
  enterpriseCounts,
  activeProductLine = '',
  ArticleComponent,
  emptyMessage,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarContent = (
    <CategoryNavSidebar
      activeCategory={activeCategory}
      activeProductLine={activeProductLine}
      categoryCounts={categoryCounts}
      gymCounts={gymCounts}
      enterpriseCounts={enterpriseCounts}
      onNavigate={() => setIsSidebarOpen(false)}
    />
  );

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

          <section className="bg-white rounded-xl border border-gray-100 p-3 mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-1">{h1}</h1>
            {description && (
              <p className="hidden md:block text-gray-700 leading-6">{description}</p>
            )}
          </section>

          <ProductGridSection
            products={products}
            emptyMessage={emptyMessage}
            ariaLabel={h1}
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

          {ArticleComponent && (
            <div className="mt-8 md:mt-10">
              <ArticleComponent />
            </div>
          )}
        </CategorySidebarLayout>
      </div>
    </DefaultLayout2>
  );
}
