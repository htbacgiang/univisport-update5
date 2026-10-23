import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Trash2, X, GripVertical, Eye, EyeOff, ExternalLink, Star, Settings, Video, Upload, Sparkles, Plus, Image as ImageIcon } from 'lucide-react';
import styles from '../../../styles/dashboard-products.module.css';
import { ReactSortable } from "react-sortablejs";
import { getProductLineOptions, getCollarTypeOptions, getProductLineLabel, getCollarTypeLabel } from '../../../lib/productTaxonomy';

const CATEGORY_TAB_DEFINITIONS = [
  { key: 'dong-phuc-gym', label: 'Đồng phục Gym', matchFn: (p) => p.category === 'dong-phuc-gym' },
  { key: 'dong-phuc-yoga-pilates', label: 'Đồng phục Yoga', matchFn: (p) => p.category === 'dong-phuc-yoga-pilates' },
  { key: 'dong-phuc-pilates', label: 'Đồng phục Pilates', matchFn: (p) => p.category === 'dong-phuc-pilates' },
  { key: 'dong-phuc-pickleball', label: 'Đồng phục Pickleball', matchFn: (p) => p.category === 'dong-phuc-pickleball' },
  { key: 'dong-phuc-chay-bo', label: 'Đồng phục Chạy bộ', matchFn: (p) => p.category === 'dong-phuc-chay-bo' },
  { key: 'dong-phuc-mma', label: 'Đồng phục MMA', matchFn: (p) => p.category === 'dong-phuc-mma' },
  { key: 'dong-phuc-golf-tennis', label: 'Đồng phục Golf - Tennis', matchFn: (p) => p.category === 'dong-phuc-golf-tennis' },
  { key: 'dong-phuc-ao-gio', label: 'Đồng phục Áo Gió', matchFn: (p) => p.category === 'dong-phuc-ao-gio' || (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'ao-gio') },
  { key: 'dong-phuc-ao-polo', label: 'Đồng phục Áo Polo', matchFn: (p) => p.category === 'dong-phuc-ao-polo' },
  { key: 'dong-phuc-ao-thun', label: 'Đồng phục Áo Thun', matchFn: (p) => p.category === 'dong-phuc-ao-thun' },
  { key: 'dp-so-mi', label: 'Đồng phục Sơ mi', matchFn: (p) => p.category === 'dong-phuc-so-mi' || (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'so-mi') },
  { key: 'dp-vest', label: 'Đồng phục Vest công sở', matchFn: (p) => p.category === 'dong-phuc-vest-cong-so' || (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'vest') },
  { key: 'polo-dn', label: 'Polo doanh nghiệp', matchFn: (p) => (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'polo') },
  { key: 'dp-teambuilding', label: 'Đồng phục Teambuilding', matchFn: (p) => p.category === 'dong-phuc-teambuilding' || (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'teambuilding') },
  { key: 'bao-ho-lao-dong', label: 'Bảo hộ lao động', matchFn: (p) => p.category === 'bao-ho-lao-dong' || p.category === 'dong-phuc-bao-ho-lao-dong' || (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'bao-ho') },
  { key: 'phu-kien-qua-tang', label: 'Phụ kiện & Quà tặng', matchFn: (p) => p.category === 'phu-kien-qua-tang-doanh-nghiep' || p.category === 'phu-kien-qua-tang' || (p.category === 'dong-phuc-doanh-nghiep' && p.productLine === 'phu-kien') },
];

const getCategoryLabel = (product) => {
  if (product.categoryNameVN) return product.categoryNameVN;
  const found = CATEGORY_TAB_DEFINITIONS.find((t) => t.matchFn(product));
  return found ? found.label : (product.category || 'Không xác định');
};

const parseCustomerPairs = (str) => {
  if (typeof str !== 'string' || !str.trim()) return [{ name: '', link: '' }];
  const items = str
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const parts = item.split('|');
      return { name: parts[0]?.trim() || '', link: parts[1]?.trim() || '' };
    });
  return items.length > 0 ? items : [{ name: '', link: '' }];
};

const serializeCustomerPairs = (pairs) => {
  if (!Array.isArray(pairs)) return '';
  return pairs
    .filter((p) => p && p.name && p.name.trim() !== '')
    .map((p) => (p.link && p.link.trim() ? `${p.name.trim()} | ${p.link.trim()}` : p.name.trim()))
    .join(', ');
};

export default function JSONProductsListPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [customerPairs, setCustomerPairs] = useState([{ name: '', link: '' }]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTabKey, setSelectedTabKey] = useState('');
  const [selectedProductLine, setSelectedProductLine] = useState('');
  const [selectedCollarType, setSelectedCollarType] = useState('');
  const [limit, setLimit] = useState(20);
  const [isSorting, setIsSorting] = useState(false);

  const [featuredConfigProduct, setFeaturedConfigProduct] = useState(null);
  const [featuredConfigForm, setFeaturedConfigForm] = useState({
    customTitle: '',
    customSubtitle: '',
    customDescription: '',
    customImage: '',
    customSecondaryImage: '',
    videoUrl: '',
    badgeText: '',
    soldCount: '',
    recentCustomers: '',
  });
  const [featuredConfigSaving, setFeaturedConfigSaving] = useState(false);

  const tableContainerRef = useRef(null);
  const containerRef = useRef(null);

  const visibleCategoryTabs = useMemo(() => {
    const predefinedTabsWithCounts = CATEGORY_TAB_DEFINITIONS.map(tab => {
      const count = allProducts.filter(tab.matchFn).length;
      return { ...tab, count };
    }).filter(tab => tab.count > 0);

    const matchedCategoryKeys = new Set();
    allProducts.forEach(p => {
      if (p.category && CATEGORY_TAB_DEFINITIONS.some(tab => tab.matchFn(p))) {
        matchedCategoryKeys.add(p.category);
      }
    });

    const dynamicTabsMap = new Map();
    allProducts.forEach(p => {
      if (p.category && !matchedCategoryKeys.has(p.category)) {
        if (!dynamicTabsMap.has(p.category)) {
          const count = allProducts.filter(item => item.category === p.category).length;
          if (count > 0) {
            dynamicTabsMap.set(p.category, {
              key: p.category,
              label: p.categoryNameVN || p.category,
              count,
              matchFn: (item) => item.category === p.category,
            });
          }
        }
      }
    });

    return [...predefinedTabsWithCounts, ...Array.from(dynamicTabsMap.values())];
  }, [allProducts]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      const products = response.data.products || [];
      console.log('Products:', products);
      setAllProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const selectedCategoryForOptions = useMemo(() => {
    const currentTab = visibleCategoryTabs.find(tab => tab.key === selectedTabKey);
    return currentTab?.key || '';
  }, [visibleCategoryTabs, selectedTabKey]);

  const productLineFilterOptions = useMemo(
    () => getProductLineOptions(selectedCategoryForOptions),
    [selectedCategoryForOptions]
  );
  const collarTypeFilterOptions = useMemo(
    () => getCollarTypeOptions(selectedCategoryForOptions, selectedProductLine),
    [selectedCategoryForOptions, selectedProductLine]
  );

  // Filter products based on search, category tab, product line, collar type
  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const currentTab = visibleCategoryTabs.find(tab => tab.key === selectedTabKey);

    return allProducts.filter(product => {
      const matchesSearch = !searchTerm ||
        (product.name || '').toLowerCase().includes(normalizedSearch) ||
        (product.maSanPham || '').toLowerCase().includes(normalizedSearch) ||
        (product.categoryNameVN || '').toLowerCase().includes(normalizedSearch);

      const matchesCategory = !selectedTabKey || (currentTab ? currentTab.matchFn(product) : product.category === selectedTabKey);
      const matchesProductLine = !selectedProductLine || product.productLine === selectedProductLine;
      const matchesCollarType = !selectedCollarType || product.collarType === selectedCollarType;

      return matchesSearch && matchesCategory && matchesProductLine && matchesCollarType;
    });
  }, [allProducts, searchTerm, selectedTabKey, visibleCategoryTabs, selectedProductLine, selectedCollarType]);

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(filteredProducts.length / limit) || 1);
  }, [filteredProducts, page, limit]);


  const handleDelete = async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/products?id=${productToDelete}`);
      toast.success('Sản phẩm đã được xóa thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      // Ensure proper type comparison (handle both number and string IDs)
      const updatedProducts = allProducts.filter((product) =>
        String(product.id) !== String(productToDelete) &&
        String(product._id) !== String(productToDelete)
      );
      setAllProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / limit));
      if (updatedProducts.length > 0 && displayedProducts.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.response?.data?.err || 'Không thể xóa sản phẩm', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const handleSort = async (newList) => {
    if (isSorting || searchTerm) return;

    // Check if order actually changed
    const isChanged = newList.some((item, index) => (item.id ?? item._id) !== (displayedProducts[index]?.id ?? displayedProducts[index]?._id));
    if (!isChanged) return;

    setDisplayedProducts(newList);
    setIsSorting(true);

    const startIndex = (page - 1) * limit;
    const newFilteredProducts = [...filteredProducts];
    newFilteredProducts.splice(startIndex, newList.length, ...newList);

    // Sync allProducts state locally
    const reorderedMap = new Map();
    newFilteredProducts.forEach(p => reorderedMap.set(String(p.id ?? p._id), p));
    const newAllProducts = [
      ...newFilteredProducts,
      ...allProducts.filter(p => !reorderedMap.has(String(p.id ?? p._id)))
    ];
    setAllProducts(newAllProducts);

    try {
      await axios.post('/api/products/reorder', { category: selectedTabKey, items: newFilteredProducts });
      toast.success('Đã lưu thứ tự mới', { autoClose: 1000 });
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi lưu thứ tự');
      fetchProducts();
    } finally {
      setIsSorting(false);
    }
  };

  const handleVisibilityToggle = async (product, field) => {
    const currentValue = product[field] === true;
    const nextValue = !currentValue;
    const productKey = product.id ?? product._id;

    setAllProducts((prev) =>
      prev.map((item) => {
        if (String(item.id ?? item._id) === String(productKey)) {
          return { ...item, [field]: nextValue };
        }
        if (field === 'isFeatured' && nextValue === true && item.category === product.category) {
          return { ...item, isFeatured: false };
        }
        return item;
      })
    );

    try {
      await axios.patch('/api/products/visibility', {
        id: productKey,
        field,
        value: nextValue,
      });
      const message = field === 'isFeatured'
        ? (nextValue ? 'Đã chọn làm sản phẩm nổi bật của danh mục' : 'Đã bỏ sản phẩm nổi bật')
        : (nextValue ? 'Đã bật hiển thị' : 'Đã ẩn sản phẩm');
      toast.success(message, { autoClose: 1200 });
    } catch (error) {
      setAllProducts((prev) =>
        prev.map((item) =>
          String(item.id ?? item._id) === String(productKey)
            ? { ...item, [field]: currentValue }
            : item
        )
      );
    }
  };

  const handleImageInputArrayChange = (field, index, value) => {
    setFeaturedConfigForm((prev) => {
      const currentList = Array.isArray(prev[field]) ? [...prev[field]] : [prev[field] || ''];
      const pasted = value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
      if (pasted.length > 1) {
        currentList.splice(index, 1, ...pasted);
      } else {
        currentList[index] = value;
      }
      return { ...prev, [field]: currentList };
    });
  };

  const handleAddImageInputRow = (field) => {
    setFeaturedConfigForm((prev) => {
      const currentList = Array.isArray(prev[field]) ? [...prev[field]] : [prev[field] || ''];
      return { ...prev, [field]: [...currentList, ''] };
    });
  };

  const handleRemoveImageInputRow = (field, index) => {
    setFeaturedConfigForm((prev) => {
      const currentList = Array.isArray(prev[field]) ? [...prev[field]] : [prev[field] || ''];
      const newList = currentList.filter((_, i) => i !== index);
      return { ...prev, [field]: newList.length > 0 ? newList : [''] };
    });
  };

  const handleLoadGalleryImages = (field) => {
    if (!featuredConfigProduct) return;
    const galleryList = Array.isArray(featuredConfigProduct.gallery) && featuredConfigProduct.gallery.length > 0
      ? featuredConfigProduct.gallery.map(img => (typeof img === 'string' ? img : img?.src)).filter(Boolean)
      : (featuredConfigProduct.image ? [featuredConfigProduct.image] : []);

    if (galleryList.length > 0) {
      setFeaturedConfigForm((prev) => ({ ...prev, [field]: galleryList }));
      toast.info(`Đã nạp ${galleryList.length} ảnh từ thư viện sản phẩm`, { autoClose: 1200 });
    } else {
      toast.warn('Sản phẩm chưa có thư viện ảnh', { autoClose: 1500 });
    }
  };

  const handleLoadColorImages = (field) => {
    if (!featuredConfigProduct) return;
    const colorList = Array.isArray(featuredConfigProduct.colors) && featuredConfigProduct.colors.length > 0
      ? featuredConfigProduct.colors.map(c => c.image).filter(Boolean)
      : [];

    if (colorList.length > 0) {
      setFeaturedConfigForm((prev) => ({ ...prev, [field]: colorList }));
      toast.info(`Đã nạp ${colorList.length} ảnh từ biến thể màu`, { autoClose: 1200 });
    } else {
      toast.warn('Sản phẩm chưa có ảnh màu biến thể', { autoClose: 1500 });
    }
  };

  const handleCustomerPairChange = (index, field, value) => {
    setCustomerPairs((prev) => {
      const next = [...prev];
      if (!next[index]) next[index] = { name: '', link: '' };
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleAddCustomerRow = () => {
    setCustomerPairs((prev) => [...prev, { name: '', link: '' }]);
  };

  const handleRemoveCustomerRow = (index) => {
    setCustomerPairs((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [{ name: '', link: '' }];
    });
  };

  const openFeaturedConfigModal = (product) => {
    setFeaturedConfigProduct(product);

    let defaultSecondaryList = [];
    if (Array.isArray(product.gallery) && product.gallery.length > 0) {
      defaultSecondaryList = product.gallery.map(img => (typeof img === 'string' ? img : img?.src)).filter(Boolean);
    } else if (Array.isArray(product.colors) && product.colors.length > 0) {
      defaultSecondaryList = product.colors.map(c => c.image).filter(Boolean);
    }
    if (defaultSecondaryList.length === 0 && product.image) {
      defaultSecondaryList = [product.image];
    }

    const parseImageList = (val, defaultList = []) => {
      if (Array.isArray(val) && val.length > 0) return val;
      if (typeof val === 'string' && val.trim()) {
        const list = val.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
        if (list.length > 0) return list;
      }
      return defaultList.length > 0 ? defaultList : [''];
    };

    const rawCust = product.featuredConfig?.recentCustomers || product.recentCustomers || '';
    const initialPairs = parseCustomerPairs(rawCust);
    setCustomerPairs(initialPairs.length > 0 ? initialPairs : [{ name: '', link: '' }]);

    setFeaturedConfigForm({
      customTitle: product.featuredConfig?.customTitle || product.name || '',
      customSubtitle: product.featuredConfig?.customSubtitle || product.categoryNameVN || 'Stylish Polo',
      customDescription: product.featuredConfig?.customDescription || product.description || '',
      customImage: parseImageList(product.featuredConfig?.customImage, product.image ? [product.image] : ['']),
      customSecondaryImage: parseImageList(product.featuredConfig?.customSecondaryImage, defaultSecondaryList),
      videoUrl: product.featuredConfig?.videoUrl || '',
      badgeText: product.featuredConfig?.badgeText || 'NỔI BẬT',
      soldCount: product.featuredConfig?.soldCount || '1.500+ sản phẩm',
      recentCustomers: rawCust,
    });
  };

  const closeFeaturedConfigModal = () => {
    setFeaturedConfigProduct(null);
  };

  const handleSaveFeaturedConfig = async () => {
    if (!featuredConfigProduct) return;
    setFeaturedConfigSaving(true);
    const productKey = featuredConfigProduct.id ?? featuredConfigProduct._id;

    const formattedCustomImage = Array.isArray(featuredConfigForm.customImage)
      ? featuredConfigForm.customImage.map(s => s.trim()).filter(Boolean).join(', ')
      : (featuredConfigForm.customImage || '').trim();

    const formattedCustomSecondaryImage = Array.isArray(featuredConfigForm.customSecondaryImage)
      ? featuredConfigForm.customSecondaryImage.map(s => s.trim()).filter(Boolean).join(', ')
      : (featuredConfigForm.customSecondaryImage || '').trim();

    const serializedCustomers = serializeCustomerPairs(customerPairs);

    const configToSave = {
      ...featuredConfigForm,
      recentCustomers: serializedCustomers,
      customImage: formattedCustomImage,
      customSecondaryImage: formattedCustomSecondaryImage,
    };

    try {
      await axios.post('/api/products/featured-config', {
        id: productKey,
        featuredConfig: configToSave,
      });

      setAllProducts((prev) =>
        prev.map((item) =>
          String(item.id ?? item._id) === String(productKey)
            ? { ...item, featuredConfig: configToSave }
            : item
        )
      );

      toast.success('Đã lưu cấu hình sản phẩm nổi bật!', { autoClose: 1500 });
      closeFeaturedConfigModal();
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi lưu cấu hình nổi bật');
    } finally {
      setFeaturedConfigSaving(false);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(ellipsis);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className={styles.paginationButton}
        >
          Trước
        </button>
        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => typeof num === 'number' && setPage(num)}
            disabled={num === ellipsis}
            className={`${styles.pageNumber} ${num === page
              ? styles.active
              : num === ellipsis
                ? styles.ellipsis
                : ''
              }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className={styles.paginationButton}
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className={styles.container} ref={containerRef}>

        {/* Search and Filter */}
        <div className={styles.filterSection} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => { setSelectedTabKey(''); setSelectedProductLine(''); setSelectedCollarType(''); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${selectedTabKey === '' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <span>Tất cả</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${selectedTabKey === '' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {allProducts.length}
              </span>
            </button>
            {visibleCategoryTabs.map((tab) => {
              const isSelected = selectedTabKey === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => { setSelectedTabKey(tab.key); setSelectedProductLine(''); setSelectedCollarType(''); setPage(1); }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${isSelected ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-xs font-semibold ${isSelected ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {(productLineFilterOptions.length > 0 || selectedProductLine) && (
            <div className="flex flex-wrap gap-2 mb-2 items-center">
              <select
                value={selectedProductLine}
                onChange={(e) => { setSelectedProductLine(e.target.value); setSelectedCollarType(''); setPage(1); }}
                className={styles.pageSizeSelect}
                aria-label="Lọc theo dòng sản phẩm"
              >
                <option value="">Tất cả dòng sản phẩm</option>
                {productLineFilterOptions.map((line) => (
                  <option key={line.value} value={line.value}>{line.label}</option>
                ))}
              </select>

              {(collarTypeFilterOptions.length > 0 || selectedCollarType) && (
                <select
                  value={selectedCollarType}
                  onChange={(e) => { setSelectedCollarType(e.target.value); setPage(1); }}
                  className={styles.pageSizeSelect}
                  aria-label="Lọc theo kiểu cổ"
                >
                  <option value="">Tất cả kiểu cổ</option>
                  {collarTypeFilterOptions.map((collar) => (
                    <option key={collar.value} value={collar.value}>{collar.label}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="w-full flex justify-between items-center">
            <div className={styles.searchBox} style={{ width: '300px' }}>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

          </div>
        </div>

        {/* Pagination Info */}
        <div className={styles.paginationInfo}>
          <div className={styles.paginationStats}>
            Hiển thị {displayedProducts.length > 0 ? (page - 1) * limit + 1 : 0} - {Math.min(page * limit, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
          </div>
          <div className={styles.paginationControls}>
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={limit}
              onChange={(e) => {
                const newLimit = parseInt(e.target.value);
                setLimit(newLimit);
                setPage(1);
              }}
              className={styles.pageSizeSelect}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {!searchTerm && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 mb-3">
            <GripVertical className="h-4 w-4 shrink-0 text-blue-600" />
            <span>Kéo thả biểu tượng <strong><GripVertical className="inline h-3.5 w-3.5" /></strong> ở đầu mỗi dòng để thay đổi vị trí hiển thị sản phẩm.</span>
          </div>
        )}

        {loading && allProducts.length === 0 ? (
          <div className={styles.loading}>Đang tải...</div>
        ) : (
          <div className={styles.mainContent}>
            <div ref={tableContainerRef} className={styles.tableContainer}>
              <table
                className={styles.table}
                role="grid"
                aria-label="Danh sách sản phẩm JSON"
              >
                <thead className={styles.tableHead}>
                  <tr>
                    <th className={styles.tableHeader} scope="col">STT</th>
                    <th className={styles.tableHeader} scope="col" aria-label="Kéo thả"></th>
                    <th className={styles.tableHeader} scope="col">Tên sản phẩm</th>
                    <th className={styles.tableHeader} scope="col">Ảnh</th>
                    <th className={styles.tableHeader} scope="col">Mã SP</th>
                    <th className={styles.tableHeader} scope="col">Danh mục</th>
                    <th className={styles.tableHeader} scope="col">Phân loại</th>
                    <th className={styles.tableHeader} scope="col">Giá</th>
                    <th className={styles.tableHeader} scope="col">Trạng thái</th>
                    <th className={styles.tableHeader} scope="col">Trang chủ</th>
                    <th className={styles.tableHeader} scope="col">Nổi bật</th>
                    <th className={styles.tableHeader} scope="col">Hành động</th>
                  </tr>
                </thead>
                {!searchTerm ? (
                  <ReactSortable
                    list={displayedProducts}
                    setList={handleSort}
                    animation={150}
                    handle=".drag-handle"
                    tag="tbody"
                    className={styles.tableBody}
                  >
                    {displayedProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className={styles.emptyState}
                        >
                          {filteredProducts.length === 0 ? 'Không có sản phẩm nào phù hợp' : 'Không có sản phẩm nào'}
                        </td>
                      </tr>
                    ) : (
                      displayedProducts.map((product, index) => (
                        <tr
                          key={product.id ?? product._id}
                          className={styles.tableRow}
                          role="row"
                        >
                          <td className={styles.tableCell}>{(page - 1) * limit + index + 1}</td>
                          <td className={styles.tableCell}>
                            <div className="drag-handle cursor-move text-gray-400 hover:text-gray-600 p-1">
                              <GripVertical size={16} />
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.productName}>{product.name || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <Image
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name || 'Sản phẩm'}
                              width={40}
                              height={40}
                              className={styles.productImage}
                            />
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.productCode}>{product.maSanPham || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category}>
                              {getCategoryLabel(product)}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {[
                                getProductLineLabel(product.category, product.productLine),
                                getCollarTypeLabel(product.category, product.productLine, product.collarType),
                              ].filter(Boolean).join(' · ') || '—'}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.price}>
                              {product.price && product.price > 0 ? `${product.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                              {product.price > 0 && product.originalPrice && product.originalPrice > product.price && (
                                <span className={styles.originalPrice}>
                                  {' '}({product.originalPrice.toLocaleString('vi-VN')}đ)
                                </span>
                              )}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.statusContainer}>
                              {product.isNew && (
                                <span className={`${styles.status} ${styles.newStatus}`}>Mới</span>
                              )}
                              {product.isFeatured && (
                                <span className={`${styles.status} ${styles.featuredStatus}`}>Nổi bật</span>
                              )}
                              {!product.isNew && !product.isFeatured && (
                                <span className={`${styles.status} ${styles.normalStatus}`}>Thường</span>
                              )}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              type="button"
                              onClick={() => handleVisibilityToggle(product, 'visibleOnHome')}
                              className={`${styles.visibilityButton} ${product.visibleOnHome !== false ? styles.visibleButton : styles.hiddenButton}`}
                              aria-label={`${product.visibleOnHome !== false ? 'Ẩn' : 'Hiện'} sản phẩm ở trang chủ`}
                              title={product.visibleOnHome !== false ? 'Đang hiện ở trang chủ' : 'Đang ẩn ở trang chủ'}
                            >
                              {product.visibleOnHome !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </td>
                          <td className={styles.tableCell}>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleVisibilityToggle(product, 'isFeatured')}
                                className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${product.isFeatured
                                  ? 'bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100'
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                                  }`}
                                aria-label={`${product.isFeatured ? 'Bỏ' : 'Chọn'} sản phẩm nổi bật`}
                                title={product.isFeatured ? 'Đang là sản phẩm nổi bật của danh mục' : 'Chọn làm sản phẩm nổi bật của danh mục'}
                              >
                                <Star size={16} fill={product.isFeatured ? '#f59e0b' : 'none'} />
                              </button>
                              <button
                                type="button"
                                onClick={() => openFeaturedConfigModal(product)}
                                className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${product.isFeatured
                                  ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100'
                                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-blue-600'
                                  }`}
                                title="Cấu hình sản phẩm (Khách hàng đã đặt, Video, Tiêu đề...)"
                              >
                                <Settings size={16} />
                              </button>
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                              <a
                                href={`/san-pham/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionButton} ${styles.viewButton}`}
                                aria-label={`Xem sản phẩm ${product.name || 'Sản phẩm'} ở trang chủ`}
                                title="Xem sản phẩm ở trang chủ"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <Link href={`/dashboard/them-san-pham/?id=${product.id}`}>
                                <button
                                  className={`${styles.actionButton} ${styles.editButton}`}
                                  aria-label={`Sửa sản phẩm ${product.name || 'Sản phẩm'}`}
                                >
                                  <Edit size={16} />
                                </button>
                              </Link>
                              <button
                                onClick={() => confirmDelete(product.id)}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                aria-label={`Xóa sản phẩm ${product.name || 'Sản phẩm'}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </ReactSortable>
                ) : (
                  <tbody className={styles.tableBody}>
                    {displayedProducts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={11}
                          className={styles.emptyState}
                        >
                          {filteredProducts.length === 0 ? 'Không có sản phẩm nào phù hợp' : 'Không có sản phẩm nào'}
                        </td>
                      </tr>
                    ) : (
                      displayedProducts.map((product, index) => (
                        <tr
                          key={product.id ?? product._id}
                          className={styles.tableRow}
                          role="row"
                        >
                          <td className={styles.tableCell}>{(page - 1) * limit + index + 1}</td>
                          <td className={styles.tableCell}></td>
                          <td className={styles.tableCell}>
                            <span className={styles.productName}>{product.name || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <Image
                              src={product.image || '/images/placeholder.jpg'}
                              alt={product.name || 'Sản phẩm'}
                              width={40}
                              height={40}
                              className={styles.productImage}
                            />
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.productCode}>{product.maSanPham || 'N/A'}</span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category}>
                              {getCategoryLabel(product)}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.category} style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {[
                                getProductLineLabel(product.category, product.productLine),
                                getCollarTypeLabel(product.category, product.productLine, product.collarType),
                              ].filter(Boolean).join(' · ') || '—'}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <span className={styles.price}>
                              {product.price && product.price > 0 ? `${product.price.toLocaleString('vi-VN')}đ` : 'Liên hệ'}
                              {product.price > 0 && product.originalPrice && product.originalPrice > product.price && (
                                <span className={styles.originalPrice}>
                                  {' '}({product.originalPrice.toLocaleString('vi-VN')}đ)
                                </span>
                              )}
                            </span>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.statusContainer}>
                              {product.isNew && (
                                <span className={`${styles.status} ${styles.newStatus}`}>Mới</span>
                              )}
                              {product.isFeatured && (
                                <span className={`${styles.status} ${styles.featuredStatus}`}>Nổi bật</span>
                              )}
                              {!product.isNew && !product.isFeatured && (
                                <span className={`${styles.status} ${styles.normalStatus}`}>Thường</span>
                              )}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <button
                              type="button"
                              onClick={() => handleVisibilityToggle(product, 'visibleOnHome')}
                              className={`${styles.visibilityButton} ${product.visibleOnHome !== false ? styles.visibleButton : styles.hiddenButton}`}
                              aria-label={`${product.visibleOnHome !== false ? 'Ẩn' : 'Hiện'} sản phẩm ở trang chủ`}
                              title={product.visibleOnHome !== false ? 'Đang hiện ở trang chủ' : 'Đang ẩn ở trang chủ'}
                            >
                              {product.visibleOnHome !== false ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                          </td>
                          <td className={styles.tableCell}>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleVisibilityToggle(product, 'isFeatured')}
                                className={`p-1.5 rounded-lg border transition-all inline-flex items-center justify-center ${product.isFeatured
                                  ? 'bg-amber-50 border-amber-300 text-amber-500 hover:bg-amber-100'
                                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-amber-500'
                                  }`}
                                aria-label={`${product.isFeatured ? 'Bỏ' : 'Chọn'} sản phẩm nổi bật`}
                                title={product.isFeatured ? 'Đang là sản phẩm nổi bật của danh mục' : 'Chọn làm sản phẩm nổi bật của danh mục'}
                              >
                                <Star size={16} fill={product.isFeatured ? '#f59e0b' : 'none'} />
                              </button>
                              {product.isFeatured && (
                                <button
                                  type="button"
                                  onClick={() => openFeaturedConfigModal(product)}
                                  className="p-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all inline-flex items-center justify-center"
                                  title="Cấu hình nội dung tùy chọn (Video, Ảnh, Tiêu đề...)"
                                >
                                  <Settings size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                          <td className={styles.tableCell}>
                            <div className={styles.actionButtons}>
                              <a
                                href={`/san-pham/${product.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${styles.actionButton} ${styles.viewButton}`}
                                aria-label={`Xem sản phẩm ${product.name || 'Sản phẩm'} ở trang chủ`}
                                title="Xem sản phẩm ở trang chủ"
                              >
                                <ExternalLink size={16} />
                              </a>
                              <Link href={`/dashboard/them-san-pham/?id=${product.id}`}>
                                <button
                                  className={`${styles.actionButton} ${styles.editButton}`}
                                  aria-label={`Sửa sản phẩm ${product.name || 'Sản phẩm'}`}
                                >
                                  <Edit size={16} />
                                </button>
                              </Link>
                              <button
                                onClick={() => confirmDelete(product.id)}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                aria-label={`Xóa sản phẩm ${product.name || 'Sản phẩm'}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && renderPagination()}

        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalIconWrapper}>

              </div>
              <h3 className="text-xl font-bold text-red-500 mb-3">
                Xác nhận xóa sản phẩm
              </h3>
              <p className={styles.modalText}>
                Bạn có chắc chắn muốn xóa sản phẩm này không? Hành động này không thể hoàn tác.
              </p>
              <div className={styles.modalActions}>
                <button
                  onClick={closeModal}
                  className={`${styles.modalButton} ${styles.cancel}`}
                  disabled={loading}
                >
                  <X size={18} />
                  <span>Hủy bỏ</span>
                </button>
                <button
                  onClick={handleDelete}
                  className={`${styles.modalButton} ${styles.delete}`}
                  disabled={loading}
                >
                  <Trash2 size={18} />
                  <span>{loading ? 'Đang xóa...' : 'Xóa ngay'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Featured Config Modal */}
        {featuredConfigProduct && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={closeFeaturedConfigModal}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Cấu hình Sản phẩm Nổi bật
                    </h3>
                    <p className="text-xs text-gray-500">
                      {featuredConfigProduct.name} ({featuredConfigProduct.maSanPham})
                    </p>
                  </div>
                </div>
                <button onClick={closeFeaturedConfigModal} className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Tiêu đề hiển thị tùy chỉnh (Custom Title)
                  </label>
                  <input
                    type="text"
                    placeholder={`Để trống nếu dùng tên mặc định: "${featuredConfigProduct.name}"`}
                    value={featuredConfigForm.customTitle}
                    onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customTitle: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Phụ đề / Tagline tùy chỉnh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Stylish Polo / Premium Sportswear"
                      value={featuredConfigForm.customSubtitle}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customSubtitle: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Nhãn Badge tùy chỉnh
                    </label>
                    <input
                      type="text"
                      placeholder="VD: SALE 20%, HOT DEAL, BEST SELLER"
                      value={featuredConfigForm.badgeText}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, badgeText: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">
                      Số lượng đã bán (VD: 1.500+ hoặc 2.000+)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 1.200+ sản phẩm"
                      value={featuredConfigForm.soldCount}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, soldCount: e.target.value }))}
                      className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Customer tags 2-input list editor (Full width row) */}
                <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200 flex flex-col gap-3">
                  <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-gray-200">
                    <div>
                      <label className="block font-bold text-gray-800 text-xs uppercase tracking-wide">
                        Khách hàng đã đặt sản phẩm này & Link
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Tách riêng 2 ô (Tên & Link). Link FB / Website / Bài viết sẽ hiển thị nhấp được trên trang chi tiết sản phẩm.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomerRow}
                      className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs transition-all"
                    >
                      <Plus size={14} /> Thêm khách hàng
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {customerPairs.map((pair, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] text-gray-500 font-medium mb-1">Tên khách hàng #{idx + 1}</label>
                            <input
                              type="text"
                              placeholder="VD: Bloom Fitness & Yoga"
                              value={pair.name}
                              onChange={(e) => handleCustomerPairChange(idx, 'name', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] text-gray-500 font-medium mb-1">Link FB / Website #{idx + 1}</label>
                            <input
                              type="text"
                              placeholder="VD: https://facebook.com/bloomfitness"
                              value={pair.link}
                              onChange={(e) => handleCustomerPairChange(idx, 'link', e.target.value)}
                              className="w-full px-3 py-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>
                        {customerPairs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomerRow(idx)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors self-end mb-0.5"
                            title="Xóa dòng này"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Mô tả tùy chỉnh (Custom Description)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Nhập mô tả giới thiệu hoặc khuyến mãi đặc biệt cho khối nổi bật..."
                    value={featuredConfigForm.customDescription}
                    onChange={(e) => setFeaturedConfigForm(f => ({ ...f, customDescription: e.target.value }))}
                    className="w-full px-3.5 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Media Customization Section for Card 1 (Left Card: Video & Secondary Images) */}
                <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100 flex flex-col gap-3.5">
                  <div className="flex justify-between items-center flex-wrap gap-2 pb-2 border-b border-blue-100">
                    <div>
                      <label className="block font-bold text-blue-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles size={14} className="text-blue-600" />
                        Tùy biến Media Card 1 (Bên trái: Video & Ảnh phụ / Flatlay)
                      </label>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Card 2 (Ở giữa) mặc định dùng ảnh sản phẩm & tự thay đổi theo màu sắc đã chọn.
                      </p>
                    </div>
                  </div>

                  {/* Video URL Input */}
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1 text-xs flex items-center gap-1.5">
                      <Video size={15} className="text-blue-600" />
                      URL Video sản phẩm Card 1 (MP4 / Cloudinary / YouTube)
                    </label>
                    <input
                      type="text"
                      placeholder="VD: /video-univi-2-baseline.mp4 hoặc https://res.cloudinary.com/.../video.mp4"
                      value={featuredConfigForm.videoUrl}
                      onChange={(e) => setFeaturedConfigForm(f => ({ ...f, videoUrl: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xs bg-white"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      Khi có Video, Card 1 sẽ tự động ưu tiên phát video mượt mà liên tục.
                    </p>
                  </div>

                  {/* Custom Secondary Images / Flatlay List */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <label className="block font-semibold text-gray-700 text-xs">
                        Danh sách Ảnh phụ / Flatlay (Slide Card 1)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleLoadGalleryImages('customSecondaryImage')}
                          className="text-[11px] text-blue-600 bg-white hover:bg-blue-100 px-2.5 py-1 rounded-md font-medium transition-colors border border-blue-200"
                          title="Nạp từ Thư viện Gallery của sản phẩm"
                        >
                          + Thư viện
                        </button>
                        {Array.isArray(featuredConfigProduct?.colors) && featuredConfigProduct.colors.length > 0 && (
                          <button
                            type="button"
                            onClick={() => handleLoadColorImages('customSecondaryImage')}
                            className="text-[11px] text-purple-600 bg-white hover:bg-purple-100 px-2.5 py-1 rounded-md font-medium transition-colors border border-purple-200"
                            title="Nạp từ biến thể Màu sắc"
                          >
                            + Màu sắc
                          </button>
                        )}
                        <span className="text-[11px] text-gray-500 font-semibold ml-1 bg-white px-2 py-0.5 rounded-full border">
                          {(Array.isArray(featuredConfigForm.customSecondaryImage) ? featuredConfigForm.customSecondaryImage : []).filter(Boolean).length} ảnh
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {(Array.isArray(featuredConfigForm.customSecondaryImage) ? featuredConfigForm.customSecondaryImage : ['']).map((url, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                          <div className="w-8 h-8 rounded bg-gray-100 border flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {url.trim() ? (
                              <img
                                src={url.trim()}
                                alt={`Sec ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                              />
                            ) : (
                              <ImageIcon size={14} className="text-gray-400" />
                            )}
                          </div>
                          <input
                            type="text"
                            placeholder={`URL Ảnh phụ / Flatlay #${idx + 1}`}
                            value={url}
                            onChange={(e) => handleImageInputArrayChange('customSecondaryImage', idx, e.target.value)}
                            className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageInputRow('customSecondaryImage', idx)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa ảnh này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddImageInputRow('customSecondaryImage')}
                      className="w-full py-2 border border-dashed border-blue-300 text-blue-600 bg-white hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus size={15} />
                      <span>Thêm ô nhập ảnh phụ / flatlay</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={closeFeaturedConfigModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  disabled={featuredConfigSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSaveFeaturedConfig}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-colors flex items-center gap-2"
                  disabled={featuredConfigSaving}
                >
                  <Sparkles size={16} />
                  <span>{featuredConfigSaving ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}
