import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Grid card cho danh mục con (productLine / collarType), số lượng và ảnh đại diện
// lấy từ dữ liệu sản phẩm thật được truyền vào qua `items`.
// items: [{ href, name, description?, count, image? }]
export default function CategoryCardGrid({ title, items = [] }) {
  if (!items.length) return null;

  return (
    <section className="mb-6" aria-label={title || 'Danh mục con'}>
      {title && <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-3">{title}</h2>}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-[#105d97] hover:shadow-md transition-all"
          >
            {item.image ? (
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="64px" />
              </div>
            ) : (
              <div className="w-16 h-16 shrink-0 rounded-lg bg-[#105d97]/10 flex items-center justify-center text-[#105d97] font-bold text-lg">
                {item.name?.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 group-hover:text-[#105d97] transition-colors">
                {item.name}
              </p>
              {item.description && (
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">{item.count} sản phẩm</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#105d97] group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
