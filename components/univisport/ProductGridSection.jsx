import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';

// Khối "Sắp xếp + Hiển thị + Grid sản phẩm + Phân trang" dùng chung cho các
// trang danh mục sản phẩm (trước đây logic này nằm riêng trong CategoryPageTemplate).
export default function ProductGridSection({
  products: initialProducts = [],
  emptyMessage = 'Không tìm thấy sản phẩm nào.',
  ariaLabel = 'Danh sách sản phẩm',
  filterButton = null,
}) {
  const safeProducts = Array.isArray(initialProducts) ? initialProducts : [];
  const [products, setProducts] = useState(safeProducts);
  const [sortOption, setSortOption] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);

  // Reset khi danh sách sản phẩm gốc thay đổi (chuyển trang danh mục)
  useEffect(() => {
    setProducts(Array.isArray(initialProducts) ? initialProducts : []);
    setSortOption('default');
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applyFilters = (sort) => {
    let filtered = [...safeProducts];
    if (sort === 'price-asc') filtered.sort((a, b) => (a.maxPrice || a.price) - (b.maxPrice || b.price));
    else if (sort === 'price-desc') filtered.sort((a, b) => (b.maxPrice || b.price) - (a.maxPrice || a.price));
    else if (sort === 'oldest') filtered.sort((a, b) => (a.id > b.id ? 1 : -1));
    else if (sort === 'newest') filtered.sort((a, b) => (a.id > b.id ? -1 : 1));
    setProducts(filtered);
    goToPage(1);
  };

  const handleSort = (e) => {
    const option = e.target.value;
    setSortOption(option);
    applyFilters(option);
  };

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const fromItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const toItem = Math.min(currentPage * itemsPerPage, totalItems);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

    const btnBase = 'w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-200 shadow-sm hover:shadow-md';
    const btnDefault = `${btnBase} text-gray-600 bg-white border border-gray-300 hover:bg-[#105d97] hover:text-white hover:border-[#105d97]`;
    const btnActive = `${btnBase} bg-[#105d97] text-white border-[#105d97] shadow-lg`;
    const navBtn =
      'w-10 h-10 flex items-center justify-center text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-[#105d97] hover:text-white hover:border-[#105d97] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-300 transition-all duration-200 shadow-sm';

    const pages = [];
    if (start > 1) {
      pages.push(<button key={1} onClick={() => goToPage(1)} className={btnDefault}>1</button>);
      if (start > 2) pages.push(<span key="s-ellipsis" className="flex items-center justify-center w-10 h-10 text-gray-400 font-medium">...</span>);
    }
    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} onClick={() => goToPage(i)} className={currentPage === i ? btnActive : btnDefault}>{i}</button>
      );
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="e-ellipsis" className="flex items-center justify-center w-10 h-10 text-gray-400 font-medium">...</span>);
      pages.push(<button key={totalPages} onClick={() => goToPage(totalPages)} className={btnDefault}>{totalPages}</button>);
    }

    return (
      <div className="flex justify-center items-center mt-8 mb-6 relative z-10">
        <nav className="flex items-center space-x-1 p-2">
          <button onClick={() => goToPage(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className={navBtn} aria-label="Trang trước">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center space-x-1 px-2">{pages}</div>
          <button onClick={() => goToPage(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className={navBtn} aria-label="Trang tiếp theo">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>
      </div>
    );
  };

  return (
    <>
      {/* Top Controls Bar */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-2 flex flex-wrap items-center gap-3">
        <span className="text-sm text-gray-500 hidden md:block">
          Hiển thị {fromItem}–{toItem} của {totalItems} kết quả
        </span>

        {filterButton}

        <div className="ml-auto flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:inline">Sắp xếp:</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={handleSort}
                className="appearance-none border border-gray-300 rounded px-3 py-2 pr-7 text-sm text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer bg-white"
                aria-label="Sắp xếp sản phẩm"
              >
                <option value="default">Sắp xếp mặc định</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="price-asc">Giá: Thấp → Cao</option>
                <option value="price-desc">Giá: Cao → Thấp</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="items-center gap-2 hidden md:flex">
            <span className="text-sm text-gray-500 hidden sm:inline">Hiển thị:</span>
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(+e.target.value); goToPage(1); }}
                className="appearance-none border border-gray-300 rounded px-3 py-2 pr-7 text-sm text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer bg-white"
                aria-label="Số sản phẩm mỗi trang"
              >
                <option value={8}>8 sản phẩm</option>
                <option value={16}>16 sản phẩm</option>
                <option value={32}>32 sản phẩm</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 mb-6" />

      {currentProducts.length > 0 ? (
        <section className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" aria-label={ariaLabel}>
          {currentProducts.map((product) => (
            <div key={product.id}>
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
                maxPrice={product.maxPrice}
                discount={product.discount}
                isNew={product.isNew}
                isFeatured={product.isFeatured}
                colors={product.colors}
                image={product.image}
                slug={product.slug}
              />
            </div>
          ))}
        </section>
      ) : (
        <p className="text-center text-gray-500 py-12">{emptyMessage}</p>
      )}

      {renderPagination()}
    </>
  );
}
