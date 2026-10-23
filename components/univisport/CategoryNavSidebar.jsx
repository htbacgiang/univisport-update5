import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SIDEBAR_CATEGORIES } from '../../lib/siteCategories';
import { ENTERPRISE_FLAT_SLUGS } from '../../lib/enterpriseFlatSlugs';

const GYM_SLUG = 'dong-phuc-gym';
const ENTERPRISE_SLUG = 'dong-phuc-doanh-nghiep';

// Sidebar "Danh mục sản phẩm" DÙNG CHUNG cho MỌI trang danh mục của cả 2 business
// group ngang cấp: Đồng phục Thể thao và Đồng phục Doanh nghiệp. Không có 2 sidebar
// riêng — chỉ 1 component render 2 nhóm collapse/expand độc lập, nhóm chứa trang
// hiện tại tự động mở. Gym vẫn hiển thị cây 3 cấp (productLine -> collarType) nhưng
// không có route riêng cho từng cấp — click vào chỉ lọc sản phẩm ngay trên
// /dong-phuc-gym qua query ?line=&collar= (xem CategoryPageTemplate.jsx).
export default function CategoryNavSidebar({
  activeCategory = '',
  activeProductLine = '',
  activeCollarType = '',
  categoryCounts = {},
  gymCounts = null,
  enterpriseCounts = null,
  onNavigate,
}) {
  const isGymBranch = activeCategory === GYM_SLUG;
  const isEnterpriseBranch = activeCategory === ENTERPRISE_SLUG;

  const gymLines = gymCounts?.lines || [];
  const gymTotal = gymCounts?.total ?? categoryCounts[GYM_SLUG] ?? null;
  const enterpriseLines = enterpriseCounts?.lines || [];
  const enterpriseTotal = enterpriseCounts?.total ?? null;

  const [isSportGroupOpen, setIsSportGroupOpen] = useState(!isEnterpriseBranch);
  const [isEnterpriseGroupOpen, setIsEnterpriseGroupOpen] = useState(isEnterpriseBranch);
  const [isGymExpanded, setIsGymExpanded] = useState(isGymBranch);
  const [expandedLines, setExpandedLines] = useState(() => {
    const initial = {};
    if (isGymBranch && activeProductLine) initial[activeProductLine] = true;
    return initial;
  });

  const toggleLine = (slug) => setExpandedLines((prev) => ({ ...prev, [slug]: !prev[slug] }));
  const isEnterpriseAllActive = isEnterpriseBranch && !activeProductLine;

  return (
    <nav aria-label="Danh mục sản phẩm">
      <p className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-[0.15em]">
        Danh mục sản phẩm
      </p>

      {/* ─── Nhóm: Đồng phục Thể thao ─────────────────────────────────── */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setIsSportGroupOpen((o) => !o)}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase hover:text-gray-700 transition-colors"
          aria-expanded={isSportGroupOpen}
          aria-controls="sidebar-group-the-thao"
        >
          <span>Đồng phục Thể thao</span>
          {isSportGroupOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {isSportGroupOpen && (
          <ul id="sidebar-group-the-thao" className="space-y-0.5 mt-1.5">
            {SIDEBAR_CATEGORIES.map(([slug, name]) => {
              if (slug !== GYM_SLUG) {
                const isActive = slug === activeCategory;
                const count = categoryCounts[slug] ?? null;
                return (
                  <li key={slug}>
                    <Link
                      href={`/${slug}`}
                      onClick={onNavigate}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center justify-between py-2 px-2 rounded text-sm transition-colors ${isActive
                        ? 'text-[#105d97] font-semibold bg-[#105d97]/10'
                        : 'text-gray-600 hover:text-[#105d97] hover:bg-gray-50'
                        }`}
                    >
                      <span>{name}</span>
                      {count !== null && <span className="text-gray-400 text-xs">({count})</span>}
                    </Link>
                  </li>
                );
              }

              // Đồng phục Gym: cùng style hàng như các danh mục khác, chỉ thêm nút mở rộng
              const isGymActive = isGymBranch && !activeProductLine;
              const hasLines = gymLines.length > 0;

              return (
                <li key={slug}>
                  <div className="flex items-center">
                    <Link
                      href={`/${slug}`}
                      shallow={isGymBranch}
                      onClick={onNavigate}
                      aria-current={isGymActive ? 'page' : undefined}
                      className={`flex-1 flex items-center justify-between py-2 px-2 rounded text-sm transition-colors ${isGymActive || isGymBranch
                        ? 'text-[#105d97] font-semibold bg-[#105d97]/10'
                        : 'text-gray-600 hover:text-[#105d97] hover:bg-gray-50'
                        }`}
                    >
                      <span>{name}</span>
                      {gymTotal !== null && <span className="text-gray-400 text-xs">({gymTotal})</span>}
                    </Link>
                    {hasLines && (
                      <button
                        type="button"
                        onClick={() => setIsGymExpanded((o) => !o)}
                        className="p-1.5 ml-0.5 text-gray-400 hover:text-gray-600 shrink-0"
                        aria-label={isGymExpanded ? 'Thu gọn Đồng phục Gym' : 'Mở rộng Đồng phục Gym'}
                        aria-expanded={isGymExpanded}
                      >
                        {isGymExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {hasLines && isGymExpanded && (
                    <ul className="ml-4 mt-0.5 mb-1 space-y-0.5 border-l border-gray-100 pl-2">
                      {gymLines.map((line) => {
                        const isLineActive = isGymBranch && line.slug === activeProductLine;
                        const hasCollars = line.collars.length > 0;
                        const isLineOpen = expandedLines[line.slug] ?? isLineActive;

                        return (
                          <li key={line.slug}>
                            <div className="flex items-center">
                              {hasCollars ? (
                                <button
                                  type="button"
                                  onClick={() => toggleLine(line.slug)}
                                  className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
                                  aria-label={isLineOpen ? `Thu gọn ${line.label}` : `Mở rộng ${line.label}`}
                                  aria-expanded={isLineOpen}
                                >
                                  {isLineOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                </button>
                              ) : (
                                <span className="w-[18px] shrink-0" aria-hidden="true" />
                              )}
                              <Link
                                href={{ pathname: `/${GYM_SLUG}`, query: { line: line.slug } }}
                                shallow
                                onClick={onNavigate}
                                aria-current={isLineActive && !activeCollarType ? 'page' : undefined}
                                className={`flex-1 flex items-center justify-between py-1.5 px-1 rounded text-xs transition-colors ${isLineActive
                                  ? 'text-[#105d97] font-semibold bg-[#105d97]/10'
                                  : 'text-gray-600 hover:text-[#105d97] hover:bg-gray-50'
                                  }`}
                              >
                                <span>{line.label}</span>
                                <span className="text-gray-400">({line.count})</span>
                              </Link>
                            </div>

                            {hasCollars && isLineOpen && (
                              <ul className="ml-6 mt-0.5 space-y-0.5 border-l border-gray-100 pl-2">
                                {line.collars.map((collar) => {
                                  const isCollarActive = isLineActive && collar.slug === activeCollarType;
                                  return (
                                    <li key={collar.slug}>
                                      <Link
                                        href={{ pathname: `/${GYM_SLUG}`, query: { line: line.slug, collar: collar.slug } }}
                                        shallow
                                        onClick={onNavigate}
                                        aria-current={isCollarActive ? 'page' : undefined}
                                        className={`flex items-center justify-between py-1.5 px-2 rounded text-xs transition-colors ${isCollarActive
                                          ? 'text-[#105d97] font-semibold bg-[#105d97]/10'
                                          : 'text-gray-500 hover:text-[#105d97] hover:bg-gray-50'
                                          }`}
                                      >
                                        <span>{collar.label}</span>
                                        <span className="text-gray-400">({collar.count})</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ─── Nhóm: Đồng phục Doanh nghiệp ─────────────────────────────── */}
      <div>
        <button
          type="button"
          onClick={() => setIsEnterpriseGroupOpen((o) => !o)}
          className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase hover:text-gray-700 transition-colors"
          aria-expanded={isEnterpriseGroupOpen}
          aria-controls="sidebar-group-doanh-nghiep"
        >
          <span>Đồng phục Doanh nghiệp</span>
          {isEnterpriseGroupOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {isEnterpriseGroupOpen && (
          <ul id="sidebar-group-doanh-nghiep" className="space-y-0.5 mt-1.5">

            {enterpriseLines.map((line) => {
              const isActive = isEnterpriseBranch && line.slug === activeProductLine;
              return (
                <li key={line.slug}>
                  <Link
                    href={`/${ENTERPRISE_FLAT_SLUGS[line.slug] || `${ENTERPRISE_SLUG}/${line.slug}`}`}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between py-2 px-2 rounded text-sm transition-colors ${isActive
                      ? 'text-[#105d97] font-semibold bg-[#105d97]/10'
                      : 'text-gray-600 hover:text-[#105d97] hover:bg-gray-50'
                      }`}
                  >
                    <span>{line.label}</span>
                    <span className="text-gray-400 text-xs">({line.count})</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}
