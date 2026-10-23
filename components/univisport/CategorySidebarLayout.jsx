import { useEffect } from 'react';
import { X } from 'lucide-react';

// Shell dùng chung cho layout Sidebar + Content của các trang danh mục
// (mobile: drawer trượt từ trái; desktop: sidebar cố định bên trái).
export default function CategorySidebarLayout({ isOpen, onClose, sidebar, banner, children }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[9999] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <p className="font-medium text-gray-900 text-base">Lọc sản phẩm</p>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Đóng bộ lọc"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">{sidebar}</div>
        <div className="px-5 py-4 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#105d97] text-white py-3 rounded-lg font-medium text-sm hover:bg-[#0e4f82] transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-1/5 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">{sidebar}</div>
        {banner && <div className="hidden md:block">{banner}</div>}
      </aside>

      {/* Main Content */}
      <div className="w-full lg:w-4/5">{children}</div>
    </div>
  );
}
