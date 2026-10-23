import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// items: [{ name, href? }] — item không có href được coi là trang hiện tại
export default function CategoryBreadcrumb({ items = [] }) {
  const filteredItems = items.filter(
    (item) => item.name !== 'Trang chủ' && item.href !== '/'
  );
  if (!filteredItems.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
        {filteredItems.map((item, idx) => {
          const isLast = idx === filteredItems.length - 1;
          return (
            <li key={`${item.name}-${idx}`} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" aria-hidden="true" />
              )}
              {isLast || !item.href ? (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[#105d97] transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
