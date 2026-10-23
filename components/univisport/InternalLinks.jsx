import Link from 'next/link';
import { ArrowRight, ShoppingBag, FileText, Phone, Info, HelpCircle } from 'lucide-react';

/**
 * Component hiển thị các internal links hợp lý cho SEO
 * Giúp tăng cường internal linking và cải thiện UX
 */
export default function InternalLinks({
  currentCategory,
  relatedCategories = [],
  showMainPages = true,
  productName = null
}) {
  // Danh sách các danh mục chính
  const mainCategories = [
    { name: 'Đồng phục Gym', slug: '/dong-phuc-gym' },
    { name: 'Đồng phục Yoga', slug: '/dong-phuc-yoga-pilates' },
    { name: 'Đồng phục Chạy bộ', slug: '/dong-phuc-chay-bo' },
    { name: 'Đồng phục Pickleball', slug: '/dong-phuc-pickleball' },
    { name: 'Đồng phục MMA', slug: '/dong-phuc-mma' },
    { name: 'Đồng phục Golf - Tennis', slug: '/dong-phuc-golf-tennis' },
    { name: 'Đồng phục áo Polo', slug: '/dong-phuc-ao-polo' },
    { name: 'Đồng phục công sở', slug: '/dong-phuc-cong-so' },
    { name: 'Đồng phục Team building', slug: '/dong-phuc-team-building' },
    { name: 'Đồng phục áo gió', slug: '/dong-phuc-ao-gio' },
  ];

  // Lọc các danh mục liên quan (loại bỏ danh mục hiện tại)
  const currentCategorySlug = currentCategory ? currentCategory.replace('/', '') : '';
  const availableCategories = mainCategories.filter(cat => {
    const catSlug = cat.slug.replace('/', '');
    // Loại bỏ danh mục hiện tại
    if (currentCategorySlug && catSlug === currentCategorySlug) return false;
    // Loại bỏ các danh mục đã có trong relatedCategories
    if (relatedCategories.some(related => {
      const relatedSlug = related.slug.replace('/', '');
      return relatedSlug === catSlug;
    })) return false;
    return true;
  });

  // Chọn 3-4 danh mục để hiển thị (ưu tiên relatedCategories nếu có)
  const displayCategories = relatedCategories.length > 0
    ? [...relatedCategories.filter(cat => {
      // Chỉ thêm nếu không phải danh mục hiện tại
      const catSlug = cat.slug.replace('/', '');
      return !currentCategorySlug || catSlug !== currentCategorySlug;
    }), ...availableCategories].slice(0, 4)
    : availableCategories.slice(0, 4);

  // Các trang quan trọng
  const importantPages = [
    { name: 'Tất cả sản phẩm', slug: '/san-pham', icon: ShoppingBag },
    { name: 'Giới thiệu', slug: '/gioi-thieu', icon: Info },
    { name: 'Hướng dẫn đặt hàng', slug: '/huong-dan-dat-hang', icon: HelpCircle },
    { name: 'Liên hệ', slug: '/lien-he', icon: Phone },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 md:p-8 border border-gray-200 my-6 md:my-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-6 bg-[#105d97] rounded-full"></div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900">
          {productName ? `Khám phá thêm về ${productName}` : 'Khám phá thêm'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Danh mục liên quan */}
        {displayCategories.length > 0 && (
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#105d97]" />
              Danh mục sản phẩm
            </h4>
            <ul className="space-y-2">
              {displayCategories.map((category, index) => (
                <li key={index}>
                  <Link
                    href={category.slug}
                    className="flex items-center justify-between group py-2 px-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#105d97]/20"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-[#105d97] transition-colors font-medium">
                      {category.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#105d97] group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/san-pham"
                  className="flex items-center justify-between group py-2 px-3 rounded-lg bg-[#105d97]/5 hover:bg-[#105d97] hover:text-white transition-all duration-200 border border-[#105d97]/20 hover:border-[#105d97]"
                >
                  <span className="text-sm font-semibold text-[#105d97] group-hover:text-white transition-colors">
                    Xem tất cả sản phẩm
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#105d97] group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Các trang quan trọng */}
        {showMainPages && (
          <div>
            <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#105d97]" />
              Thông tin hữu ích
            </h4>
            <ul className="space-y-2">
              {importantPages.map((page, index) => {
                const IconComponent = page.icon;
                return (
                  <li key={index}>
                    <Link
                      href={page.slug}
                      className="flex items-center justify-between group py-2 px-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-[#105d97]/20"
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-[#105d97] transition-colors" />
                        <span className="text-sm text-gray-700 group-hover:text-[#105d97] transition-colors font-medium">
                          {page.name}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#105d97] group-hover:translate-x-1 transition-all duration-200" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Text link section - Natural internal links for SEO */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 leading-6">
          {productName ? (
            <>
              Tìm hiểu thêm về <Link href="/san-pham" className="text-[#105d97] hover:underline font-medium">sản phẩm đồng phục</Link> của chúng tôi,
              hoặc xem <Link href="/gioi-thieu" className="text-[#105d97] hover:underline font-medium">giới thiệu về Đồng phục Univi</Link> để biết thêm chi tiết.
              Nếu bạn cần hỗ trợ, vui lòng <Link href="/lien-he" className="text-[#105d97] hover:underline font-medium">liên hệ với chúng tôi</Link> hoặc
              xem <Link href="/huong-dan-dat-hang" className="text-[#105d97] hover:underline font-medium">hướng dẫn đặt hàng</Link>.
            </>
          ) : (
            <>
              Khám phá <Link href="/san-pham" className="text-[#105d97] hover:underline font-medium">bộ sưu tập đồng phục</Link> đa dạng của Đồng phục Univi,
              từ <Link href="/dong-phuc-gym" className="text-[#105d97] hover:underline font-medium">đồng phục gym</Link>,
              <Link href="/dong-phuc-chay-bo" className="text-[#105d97] hover:underline font-medium">đồng phục chạy bộ</Link> đến
              <Link href="/dong-phuc-cong-so" className="text-[#105d97] hover:underline font-medium">đồng phục công sở</Link>.
              Tìm hiểu thêm về <Link href="/gioi-thieu" className="text-[#105d97] hover:underline font-medium">chúng tôi</Link> hoặc
              <Link href="/lien-he" className="text-[#105d97] hover:underline font-medium">liên hệ</Link> để được tư vấn.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

