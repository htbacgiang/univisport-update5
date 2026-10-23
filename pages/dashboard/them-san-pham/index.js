import React, { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '../../../components/univisport/Editor';
import { debounce } from 'lodash';
import { FileText, Image, Tag, Star, FileEdit, Upload, X, AlertCircle, Database, Plus, Lock, Unlock, Link as LinkIcon, GripVertical, HelpCircle, Pipette } from 'lucide-react';
import styles from '../../../styles/add-product.module.css';
import { ReactSortable } from 'react-sortablejs';
import { getProductLineOptions, getCollarTypeOptions } from '../../../lib/productTaxonomy';

// Vietnamese to ASCII for slug generation
const vietnameseToAscii = (str) => {
  const vietnameseMap = {
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    'Đ': 'D',
  };
  return str.replace(/./g, (char) => vietnameseMap[char] || char);
};

// Generate URL-safe slug from product name or manual input
const generateSlug = (value = '') =>
  vietnameseToAscii(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

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

const generateRandomReviewCount = () => Math.floor(Math.random() * 21) + 10;

const shirtTypeOptions = [
  { value: 'ao-thun', label: 'Áo thun' },
  { value: 'ao-polo', label: 'Áo polo' },
];

const shirtTypeByCategory = {
  'dong-phuc-ao-thun': 'ao-thun',
  'dong-phuc-ao-polo': 'ao-polo',
};

const normalizeShirtType = (value = '', category = '') => {
  const normalized = value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-');

  if (['ao-thun', 'thun', 't-shirt', 'tshirt'].includes(normalized)) return 'ao-thun';
  if (['ao-polo', 'polo'].includes(normalized)) return 'ao-polo';
  return shirtTypeByCategory[category] || '';
};

// Initial state
const initialState = {
  id: null,
  maSanPham: '',
  name: '',
  image: '',
  slug: '',
  content: '',
  description: '',
  category: '',
  categoryNameVN: '',
  material: '',
  shirtType: '',
  productLine: '',
  collarType: '',
  displayOrder: 0,
  price: 0,
  originalPrice: 0,
  isNew: false,
  isFeatured: false,
  visibleOnHome: true,
  visibleOnArticle: true,
  rating: 5,
  reviewCount: 0,
  colors: [],
  gallery: [],
  faqs: [],
  recentCustomers: '',
};

// Reducer
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_PRODUCT':
      return { ...action.payload };
    case 'SET_COLORS':
      return { ...state, colors: action.colors };
    case 'SET_GALLERY':
      return { ...state, gallery: action.gallery };
    case 'SET_FAQS':
      return { ...state, faqs: action.faqs };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Categories
const categories = [
  { key: 'dong-phuc-gym', categoryNameVN: 'Đồng phục Gym', category: 'dong-phuc-gym' },
  { key: 'dong-phuc-yoga-pilates', categoryNameVN: 'Đồng phục Yoga – Pilates', category: 'dong-phuc-yoga-pilates' },
  { key: 'dong-phuc-pilates', categoryNameVN: 'Đồng phục Pilates', category: 'dong-phuc-pilates' },
  { key: 'dong-phuc-pickleball', categoryNameVN: 'Đồng phục Pickleball', category: 'dong-phuc-pickleball' },
  { key: 'dong-phuc-chay-bo', categoryNameVN: 'Đồng phục Chạy bộ', category: 'dong-phuc-chay-bo' },
  { key: 'dong-phuc-mma', categoryNameVN: 'Đồng phục MMA', category: 'dong-phuc-mma' },
  { key: 'dong-phuc-golf-tennis', categoryNameVN: 'Đồng phục Golf Tennis', category: 'dong-phuc-golf-tennis' },
  { key: 'dong-phuc-ao-gio', categoryNameVN: 'Đồng phục Áo Gió', category: 'dong-phuc-ao-gio' },
  { key: 'dong-phuc-ao-polo', categoryNameVN: 'Đồng phục Áo Polo', category: 'dong-phuc-ao-polo' },
  { key: 'dong-phuc-ao-thun', categoryNameVN: 'Đồng phục Áo Thun', category: 'dong-phuc-ao-thun' },
  { key: 'dp-so-mi', categoryNameVN: 'Đồng phục Sơ mi', category: 'dong-phuc-doanh-nghiep', productLine: 'so-mi' },
  { key: 'dp-vest', categoryNameVN: 'Đồng phục Vest công sở', category: 'dong-phuc-doanh-nghiep', productLine: 'vest' },
  { key: 'polo-dn', categoryNameVN: 'Polo doanh nghiệp', category: 'dong-phuc-doanh-nghiep', productLine: 'polo' },
  { key: 'dp-teambuilding', categoryNameVN: 'Đồng phục Teambuilding', category: 'dong-phuc-doanh-nghiep', productLine: 'teambuilding' },
  { key: 'dp-ao-gio-dn', categoryNameVN: 'Đồng phục Áo gió', category: 'dong-phuc-doanh-nghiep', productLine: 'ao-gio' },
  { key: 'bao-ho-lao-dong', categoryNameVN: 'Bảo hộ lao động', category: 'dong-phuc-doanh-nghiep', productLine: 'bao-ho' },
  { key: 'phu-kien-qua-tang', categoryNameVN: 'Phụ kiện & Quà tặng', category: 'dong-phuc-doanh-nghiep', productLine: 'phu-kien' },
];

export default function CreateJSONProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [formData, dispatch] = useReducer(reducer, initialState);
  const [customerPairs, setCustomerPairs] = useState([{ name: '', link: '' }]);
  const [images, setImages] = useState([
    {
      src: '',
      name: '',
      color1: '#000000',
      color2: '',
      preview: '',
    },
  ]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [cloudinaryImages, setCloudinaryImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSlugLocked, setIsSlugLocked] = useState(true);
  const [originalSlug, setOriginalSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProductId, setNewProductId] = useState(null);
  const [priceType, setPriceType] = useState('numeric');
  const [eyeDropperState, setEyeDropperState] = useState({ open: false, index: null, colorKey: null, hoveredColor: null });
  const eyeDropperCanvasRef = useRef(null);
  const eyeDropperImgRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Sync colors with all images
  useEffect(() => {
    dispatch({
      type: 'SET_COLORS',
      colors: images.map((img, idx) => ({
        name: img.name || `Màu ${idx + 1}`,
        hex: img.color1 || '#000000',
        hex2: img.color2 || '',
        image: img.src || img.preview || '',
      })),
    });
  }, [images]);

  // Clean up blob URLs
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.preview && typeof img.preview === 'string' && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

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

  // Real-time slug validation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCheckSlug = useCallback(
    debounce(async (slug, productId) => {
      try {
        const response = await axios.post('/api/products', { action: 'checkSlug', slug, id: productId });
        if (response.data.status !== 'success') {
          setErrors((prev) => {
            if (prev.includes('Slug đã tồn tại, vui lòng chọn slug khác')) return prev;
            return [...prev, 'Slug đã tồn tại, vui lòng chọn slug khác'];
          });
          toast.error('Slug đã tồn tại');
        } else {
          setErrors((prev) => prev.filter((err) => err !== 'Slug đã tồn tại, vui lòng chọn slug khác'));
        }
      } catch (error) {
        setErrors((prev) => [...prev, 'Không thể kiểm tra slug']);
        toast.error('Không thể kiểm tra slug');
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (formData.slug && (!id || formData.slug !== originalSlug)) {
      debouncedCheckSlug(formData.slug, id);
    } else {
      // Clear error if slug is empty or matches original
      setErrors((prev) => prev.filter((err) => err !== 'Slug đã tồn tại, vui lòng chọn slug khác'));
      debouncedCheckSlug.cancel();
    }
    return () => debouncedCheckSlug.cancel();
  }, [formData.slug, id, originalSlug, debouncedCheckSlug]);

  // Fetch product for editing
  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/api/products?id=${id}`);
      const product = response.data.product || {};
      const selCat = categories.find(
        (c) => c.category === product.category && (!c.productLine || c.productLine === product.productLine)
      ) || {};

      const colorImages = (product.colors || []).map((c, idx) => ({
        src: c.image || '',
        preview: c.image || '',
        color1: c.hex || '#000000',
        color2: c.hex2 || '',
        name: c.name || `Màu ${idx + 1}`,
      }));

      // Tạo mảng ảnh: tất cả ảnh từ colors array
      const allImages = colorImages;

      dispatch({
        type: 'SET_PRODUCT',
        payload: {
          id: product.id || null,
          maSanPham: product.maSanPham || '',
          name: product.name || '',
          image: allImages.length > 0 ? allImages[0].src : '',
          slug: product.slug || '',
          content: product.content || '',
          description: product.description || '',
          category: product.category || '',
          categoryNameVN: selCat.categoryNameVN || product.categoryNameVN || '',
          price: product.price || 0,
          originalPrice: product.originalPrice || 0,
          isNew: product.isNew || false,
          isFeatured: product.isFeatured || false,
          visibleOnHome: product.visibleOnHome !== false,
          visibleOnArticle: product.visibleOnArticle !== false,
          material: product.material || '',
          shirtType: normalizeShirtType(product.shirtType, product.category),
          productLine: product.productLine || '',
          collarType: product.collarType || '',
          displayOrder: product.displayOrder ?? 0,
          rating: product.rating ?? 5,
          reviewCount: product.reviewCount ?? generateRandomReviewCount(),
          colors: allImages.map((img, idx) => ({
            name: img.name || `Màu ${idx + 1}`,
            hex: img.color1 || '#000000',
            hex2: img.color2 || '',
            image: img.src || '',
          })),
          gallery: product.gallery || [],
          recentCustomers: product.featuredConfig?.recentCustomers || product.recentCustomers || '',
          faqs: Array.isArray(product.faqs)
            ? product.faqs.map((faq) => ({
              question: faq.question || '',
              answer: faq.answer || '',
            }))
            : [],
        },
      });

      const rawCust = product.featuredConfig?.recentCustomers || product.recentCustomers || '';
      const initialPairs = parseCustomerPairs(rawCust);
      setCustomerPairs(initialPairs.length > 0 ? initialPairs : [{ name: '', link: '' }]);

      setImages(allImages);
      setPriceType((product.price === 0 || !product.price) ? 'contact' : 'numeric');
      setIsSlugLocked(false);
      setOriginalSlug(product.slug || '');
    } catch (err) {
      console.error('Error fetching product:', err);
      setErrors((prev) => [...prev, 'Không thể tải sản phẩm']);
      toast.error('Không thể tải sản phẩm');
    }
  }, [id]);

  // Fetch Cloudinary images
  const fetchCloudinaryImages = useCallback(async () => {
    try {
      const res = await axios.get('/api/image');
      setCloudinaryImages(res.data.images.map((img) => img.src));
    } catch (err) {
      setErrors((prev) => [...prev, 'Không thể tải danh sách ảnh']);
      toast.error('Không thể tải danh sách ảnh');
    }
  }, []);

  useEffect(() => {
    if (id) fetchProduct();
    fetchCloudinaryImages();
  }, [id, fetchProduct, fetchCloudinaryImages]);

  useEffect(() => {
    if (!router.isReady || id) return;
    dispatch({ type: 'UPDATE_FIELD', field: 'reviewCount', value: generateRandomReviewCount() });
  }, [router.isReady, id]);

  // Handle name change
  const handleNameChange = (e) => {
    const name = e.target.value;
    dispatch({ type: 'UPDATE_FIELD', field: 'name', value: name });
    if (isSlugLocked) {
      dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generateSlug(name) });
    }
  };

  // Handle slug change — auto-unlock khi user tự gõ
  const handleSlugChange = (e) => {
    if (isSlugLocked) setIsSlugLocked(false);
    dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generateSlug(e.target.value) });
  };

  const handleToggleSlugLock = () => {
    const shouldAutoGenerate = !isSlugLocked;
    setIsSlugLocked(shouldAutoGenerate);
    if (shouldAutoGenerate) {
      dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: generateSlug(formData.name) });
    }
  };

  // Handle maSanPham change
  const handleMaSanPhamChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'maSanPham', value: e.target.value });
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'description', value: e.target.value });
  };

  // Handle content change
  const handleContentChange = (content) => {
    const sanitizedContent = typeof content === 'string' ? content : '';
    dispatch({ type: 'UPDATE_FIELD', field: 'content', value: sanitizedContent });
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedKey = e.target.value;
    const selectedCategory = categories.find((cat) => (cat.key || cat.category) === selectedKey);
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'category',
      value: selectedCategory ? selectedCategory.category : '',
    });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'categoryNameVN',
      value: selectedCategory ? selectedCategory.categoryNameVN : '',
    });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'productLine',
      value: selectedCategory ? (selectedCategory.productLine || '') : '',
    });
    dispatch({
      type: 'UPDATE_FIELD',
      field: 'shirtType',
      value: selectedCategory ? (shirtTypeByCategory[selectedCategory.category] || formData.shirtType) : '',
    });
    // Danh mục thay đổi thì kiểu cổ cũ (nếu có) không còn hợp lệ
    dispatch({ type: 'UPDATE_FIELD', field: 'collarType', value: '' });
  };

  // Handle dòng sản phẩm change
  const handleProductLineChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'productLine', value: e.target.value });
    dispatch({ type: 'UPDATE_FIELD', field: 'collarType', value: '' });
  };

  // Handle kiểu cổ change
  const handleCollarTypeChange = (e) => {
    dispatch({ type: 'UPDATE_FIELD', field: 'collarType', value: e.target.value });
  };

  // Handle image drop and upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: true,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        setErrors((prev) => [...prev, 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB']);
        toast.error('Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB');
        return;
      }
      setErrors((prev) => prev.filter((err) => err !== 'Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP dưới 5MB'));

      const newImages = acceptedFiles.map((file, idx) => ({
        src: '',
        preview: URL.createObjectURL(file),
        color1: '#000000',
        color2: '',
        name: `Màu ${images.length + idx + 1}`,
        file,
      }));
      setImages([...images, ...newImages]);

      setUploading(true);
      try {
        const uploadFormData = new FormData();
        acceptedFiles.forEach((file) => uploadFormData.append('image', file));
        const response = await axios.post('/api/image?multiple=true', uploadFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Upload response:', response.data);

        // Handle response structure
        let uploadedUrls = [];
        if (Array.isArray(response.data.src)) {
          uploadedUrls = response.data.src.map(item => {
            if (typeof item === 'string') {
              return item;
            } else if (item && typeof item === 'object' && item.src) {
              return item.src;
            } else {
              console.error('Invalid item in response:', item);
              return null;
            }
          }).filter(Boolean);
        } else if (Array.isArray(response.data)) {
          uploadedUrls = response.data.map(item => {
            if (typeof item === 'string') {
              return item;
            } else if (item && typeof item === 'object' && item.src) {
              return item.src;
            } else {
              return null;
            }
          }).filter(Boolean);
        } else if (response.data.src && typeof response.data.src === 'string') {
          uploadedUrls = [response.data.src];
        } else {
          console.error('Unexpected response structure:', response.data);
          throw new Error('Unexpected response structure from upload API');
        }

        let urlIndex = 0;
        setImages((prev) =>
          prev.map((img) => {
            if (img.file) {
              const newSrc = uploadedUrls[urlIndex++];
              if (newSrc && typeof newSrc === 'string') {
                return { ...img, src: newSrc, preview: newSrc, file: null };
              } else {
                console.error('Invalid URL at index:', urlIndex - 1, newSrc);
                return img;
              }
            }
            return img;
          })
        );
      } catch (error) {
        console.error('Error uploading images:', error.response?.data || error.message);
        setErrors((prev) => [...prev, 'Không thể upload ảnh']);
        toast.error('Không thể upload ảnh');
        setImages((prev) => prev.filter((img) => !img.file));
      } finally {
        setUploading(false);
      }
    },
  });

  // Handle Cloudinary image selection
  const handleSelectImage = (src) => {
    if (!images.some((img) => img.src === src)) {
      setImages([...images, { src, preview: src, color1: '#000000', color2: '', name: `Màu ${images.length + 1}` }]);
    }
    setIsModalOpen(false);
  };

  // Check slug availability
  const checkSlug = async (slug, productId = null) => {
    try {
      const response = await axios.post('/api/products', { action: 'checkSlug', slug, id: productId });
      return response.data.status === 'success';
    } catch (error) {
      console.error('Error checking slug:', error.response?.data || error.message);
      setErrors((prev) => [...prev, 'Không thể kiểm tra slug']);
      toast.error('Không thể kiểm tra slug');
      return false;
    }
  };

  // Reset form
  const resetForm = () => {
    dispatch({ type: 'RESET' });
    images.forEach((img) => {
      if (img.preview && typeof img.preview === 'string' && img.preview.startsWith('blob:')) {
        URL.revokeObjectURL(img.preview);
      }
    });
    setImages([]);
    setCustomerPairs([{ name: '', link: '' }]);
    setPriceType('numeric');
    setIsSlugLocked(true);
    setOriginalSlug('');
    setErrors([]);
    setNewProductId(null);
    dispatch({ type: 'UPDATE_FIELD', field: 'reviewCount', value: generateRandomReviewCount() });
    dispatch({ type: 'SET_GALLERY', gallery: [] });
    dispatch({ type: 'SET_FAQS', faqs: [] });
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const img = images[index];
    if (img.preview && typeof img.preview === 'string' && img.preview.startsWith('blob:')) {
      URL.revokeObjectURL(img.preview);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageUrlChange = (index, url) => {
    const newImages = [...images];
    if (!newImages[index]) {
      newImages[index] = { src: '', name: '', color1: '#000000', color2: '' };
    }
    newImages[index].src = url;
    newImages[index].preview = url; // For preview
    setImages(newImages);
  };

  const handleAddImageInput = () => {
    setImages([...images, { src: '', name: '', color1: '#000000', color2: '', preview: '' }]);
  };

  const handleColorChange = (index, colorKey, value) => {
    setImages((prev) => {
      const newImages = [...prev];
      if (newImages[index]) {
        newImages[index] = { ...newImages[index], [colorKey]: value };
      }
      return newImages;
    });
  };

  // Handle color name change
  const handleColorNameChange = (index, value) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, name: value } : img))
    );
  };

  // Handle EyeDropper color pick — opens canvas modal
  const handleEyeDropper = (index, colorKey) => {
    const imgSrc = images[index]?.src || images[index]?.preview;
    if (!imgSrc) {
      toast.error('Vui lòng thêm ảnh trước khi hút màu.');
      return;
    }
    setEyeDropperState({ open: true, index, colorKey, hoveredColor: null });
  };

  // Draw image on canvas when eyedropper modal opens
  useEffect(() => {
    if (!eyeDropperState.open) return;
    const canvas = eyeDropperCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    const imgSrc = images[eyeDropperState.index]?.src || images[eyeDropperState.index]?.preview;
    img.src = imgSrc;
    img.onload = () => {
      // Fit image into canvas container (max 600x500)
      const maxW = 600, maxH = 500;
      let w = img.naturalWidth, h = img.naturalHeight;
      const ratio = Math.min(maxW / w, maxH / h, 1);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      eyeDropperImgRef.current = img;
    };
    img.onerror = () => {
      toast.error('Không thể tải ảnh để hút màu. Kiểm tra URL ảnh.');
      setEyeDropperState({ open: false, index: null, colorKey: null, hoveredColor: null });
    };
  }, [eyeDropperState.open, eyeDropperState.index, images]);

  // Get color from canvas at position
  const getCanvasColor = (e) => {
    const canvas = eyeDropperCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return null;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    return hex;
  };

  const handleCanvasMouseMove = (e) => {
    const color = getCanvasColor(e);
    if (color) {
      setEyeDropperState(prev => ({ ...prev, hoveredColor: color }));
    }
  };

  const handleCanvasClick = (e) => {
    const color = getCanvasColor(e);
    if (color && eyeDropperState.index !== null && eyeDropperState.colorKey) {
      handleColorChange(eyeDropperState.index, eyeDropperState.colorKey, color);
      setEyeDropperState({ open: false, index: null, colorKey: null, hoveredColor: null });
      toast.success(`Đã chọn màu ${color}`);
    }
  };

  // Gallery Helpers
  const handleGalleryImageUrlChange = (index, url) => {
    const newGallery = formData.gallery.map((item, i) =>
      i === index ? { ...item, src: url } : item
    );
    dispatch({ type: 'SET_GALLERY', gallery: newGallery });
  };

  const handleGalleryAspectRatioChange = (index, ratio) => {
    const newGallery = formData.gallery.map((item, i) => {
      if (i === index) {
        // Map: landscape-3-4=4:3, square=1:1, portrait=3:4, landscape(legacy)=4:3
        const ratioMap = { 'landscape-3-4': [4, 3], 'square': [1, 1], 'portrait': [3, 4], 'landscape': [4, 3] };
        const [w, h] = ratioMap[ratio] || [4, 3];
        return { ...item, aspectRatio: ratio, width: w, height: h };
      }
      return item;
    });
    dispatch({ type: 'SET_GALLERY', gallery: newGallery });
  };

  const handleGalleryWidthChange = (index, w) => {
    const newGallery = formData.gallery.map((item, i) =>
      i === index ? { ...item, width: Number(w) || 0 } : item
    );
    dispatch({ type: 'SET_GALLERY', gallery: newGallery });
  };

  const handleGalleryHeightChange = (index, h) => {
    const newGallery = formData.gallery.map((item, i) =>
      i === index ? { ...item, height: Number(h) || 0 } : item
    );
    dispatch({ type: 'SET_GALLERY', gallery: newGallery });
  };

  const handleRemoveGalleryItem = (index) => {
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    dispatch({ type: 'SET_GALLERY', gallery: newGallery });
  };

  const handleAddGalleryItem = () => {
    const newItem = { src: '', width: 3, height: 4, aspectRatio: 'portrait' };
    const newGallery = [...formData.gallery, newItem];
    dispatch({ type: 'SET_GALLERY', gallery: newGallery });
  };

  const handleAddFaq = () => {
    dispatch({
      type: 'SET_FAQS',
      faqs: [...(formData.faqs || []), { question: '', answer: '' }],
    });
  };

  const handleUpdateFaq = (index, field, value) => {
    dispatch({
      type: 'SET_FAQS',
      faqs: (formData.faqs || []).map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      ),
    });
  };

  const handleRemoveFaq = (index) => {
    dispatch({
      type: 'SET_FAQS',
      faqs: (formData.faqs || []).filter((_, i) => i !== index),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      // Client-side validation
      if (!formData.name) {
        setErrors((prev) => [...prev, 'Tên sản phẩm là bắt buộc']);
        toast.error('Tên sản phẩm là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.maSanPham) {
        setErrors((prev) => [...prev, 'Mã sản phẩm là bắt buộc']);
        toast.error('Mã sản phẩm là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!/^[A-Za-z0-9_-]+$/.test(formData.maSanPham)) {
        setErrors((prev) => [...prev, 'Mã sản phẩm chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang']);
        toast.error('Mã sản phẩm chỉ được chứa chữ cái, số, dấu gạch dưới hoặc gạch ngang');
        setIsSubmitting(false);
        return;
      }
      const normalizedSlug = generateSlug(formData.slug || formData.name);
      if (!normalizedSlug) {
        setErrors((prev) => [...prev, 'Đường dẫn tĩnh là bắt buộc']);
        toast.error('Đường dẫn tĩnh là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (normalizedSlug !== formData.slug) {
        dispatch({ type: 'UPDATE_FIELD', field: 'slug', value: normalizedSlug });
      }
      if (!formData.category) {
        setErrors((prev) => [...prev, 'Danh mục là bắt buộc']);
        toast.error('Danh mục là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.categoryNameVN) {
        setErrors((prev) => [...prev, 'Tên danh mục là bắt buộc']);
        toast.error('Tên danh mục là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      if (!formData.description) {
        setErrors((prev) => [...prev, 'Mô tả là bắt buộc']);
        toast.error('Mô tả là bắt buộc');
        setIsSubmitting(false);
        return;
      }
      const validImages = images.filter(img => img.src && img.src.trim() !== '');
      if (validImages.length === 0) {
        setErrors((prev) => [...prev, 'Vui lòng nhập ít nhất một ảnh sản phẩm hợp lệ']);
        toast.error('Vui lòng nhập ít nhất một ảnh sản phẩm hợp lệ');
        setIsSubmitting(false);
        return;
      }
      if (formData.price < 0 || formData.originalPrice < 0) {
        setErrors((prev) => [...prev, 'Giá không được âm']);
        toast.error('Giá không được âm');
        setIsSubmitting(false);
        return;
      }
      if (formData.rating < 0 || formData.rating > 5) {
        setErrors((prev) => [...prev, 'Đánh giá phải từ 0 đến 5']);
        toast.error('Đánh giá phải từ 0 đến 5');
        setIsSubmitting(false);
        return;
      }
      if (formData.reviewCount < 0) {
        setErrors((prev) => [...prev, 'Số lượng đánh giá không được âm']);
        toast.error('Số lượng đánh giá không được âm');
        setIsSubmitting(false);
        return;
      }

      // Ensure all valid images are uploaded
      const uploadedUrls = validImages.map((img) => img.src).filter(Boolean);
      if (uploadedUrls.length !== validImages.length) {
        setErrors((prev) => [...prev, 'Vui lòng chờ tất cả ảnh được tải lên']);
        toast.error('Vui lòng chờ tất cả ảnh được tải lên');
        setIsSubmitting(false);
        return;
      }

      // Construct product data
      const validFaqs = (formData.faqs || []).filter(
        (faq) => faq.question?.trim() && faq.answer?.trim()
      );

      const productData = {
        name: formData.name,
        maSanPham: formData.maSanPham,
        slug: normalizedSlug,
        content: formData.content,
        description: formData.description,
        category: formData.category,
        categoryNameVN: formData.categoryNameVN,
        shirtType: formData.shirtType,
        productLine: formData.productLine,
        collarType: formData.collarType,
        displayOrder: formData.displayOrder,
        price: formData.price,
        originalPrice: formData.originalPrice,
        isNew: formData.isNew,
        material: formData.material,
        isFeatured: formData.isFeatured,
        visibleOnHome: formData.visibleOnHome,
        visibleOnArticle: formData.visibleOnArticle,
        rating: formData.rating,
        reviewCount: formData.reviewCount,
        image: validImages[0]?.src || '', // Main image (required field)
        colors: validImages.map((img, idx) => ({
          name: img.name || `Màu ${idx + 1}`,
          hex: img.color1 || '#000000',
          ...(img.color2 ? { hex2: img.color2 } : {}),
          image: img.src,
        })),
        gallery: formData.gallery.filter(img => img.src && img.src.trim() !== ''),
        recentCustomers: serializeCustomerPairs(customerPairs),
        featuredConfig: {
          ...(formData.featuredConfig || {}),
          recentCustomers: serializeCustomerPairs(customerPairs),
        },
        faqs: validFaqs.map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        })),
      };

      console.log('Sending productData:', productData);

      // Validate slug
      let isSlugValid = true;
      if (!id || normalizedSlug !== originalSlug) {
        isSlugValid = await checkSlug(normalizedSlug, id);
        if (!isSlugValid) {
          setErrors((prev) => [...prev, 'Slug đã tồn tại, vui lòng chọn slug khác']);
          toast.error('Slug đã tồn tại, vui lòng chọn slug khác');
          setIsSubmitting(false);
          return;
        }
      }

      // Submit to backend
      if (id) {
        await axios.put(`/api/products?id=${id}`, productData);
        toast.success('Sản phẩm đã được cập nhật thành công!', {
          position: 'top-right',
          autoClose: 3000,
        });
        router.push('/dashboard/san-pham');
      } else {
        const response = await axios.post('/api/products', productData);
        if (response.data.status === 'success') {
          setNewProductId(response.data.product.id);
          toast.success(`Sản phẩm đã được thêm thành công! Mã sản phẩm (ID): ${response.data.product.id}, Mã sản phẩm: ${response.data.product.maSanPham}`, {
            position: 'top-right',
            autoClose: 3000,
          });
          resetForm();
        } else {
          throw new Error(response.data.err || 'Không thể tạo sản phẩm');
        }
      }
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.err || error.response?.data?.message || 'Không thể lưu sản phẩm.';
      if (errorMessage.includes('maSanPham')) {
        setErrors((prev) => [...prev, 'Mã sản phẩm đã tồn tại, vui lòng chọn mã khác']);
        toast.error('Mã sản phẩm đã tồn tại');
      } else if (errorMessage.includes('slug')) {
        setErrors((prev) => [...prev, 'Slug đã tồn tại, vui lòng chọn slug khác']);
        toast.error('Slug đã tồn tại');
      } else {
        setErrors((prev) => [...prev, errorMessage]);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const productLineOptions = getProductLineOptions(formData.category);
  const collarTypeOptions = getCollarTypeOptions(formData.category, formData.productLine);

  return (
    <AdminLayout title={id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <Database className={styles.titleIcon} />
            <h2 className={styles.title}>
              {id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            </h2>
          </div>
        </div>

        {errors.length > 0 && (
          <div className={styles.errorContainer}>
            {errors.map((error, idx) => (
              <div key={idx} className={styles.errorItem}>
                <AlertCircle className={styles.errorIcon} />
                {error}
              </div>
            ))}
          </div>
        )}

        {newProductId && !id && (
          <div className={styles.successContainer}>
            Sản phẩm đã được tạo với mã sản phẩm (ID): <strong>{newProductId}</strong>, mã sản phẩm: <strong>{formData.maSanPham}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FileText className={styles.sectionIcon} />
              Thông tin cơ bản
            </h3>

            {id && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Mã sản phẩm (ID)</label>
                <input
                  type="text"
                  value={formData.id || ''}
                  readOnly
                  className={`${styles.input} ${styles.disabled}`}
                  aria-label="Mã sản phẩm (ID)"
                />
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Mã sản phẩm <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.maSanPham}
                  onChange={handleMaSanPhamChange}
                  className={styles.input}
                  required
                  placeholder="Ví dụ: SP001"
                  aria-label="Mã sản phẩm"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Tên sản phẩm <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className={styles.input}
                  required
                  aria-label="Tên sản phẩm"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Đường dẫn tĩnh (Slug) <span className={styles.required}>*</span>
                </label>
                <div className={styles.slugInputWrapper}>
                  <div className={styles.slugInputContainer}>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={handleSlugChange}
                      className={styles.input}
                      required
                      placeholder="ten-san-pham"
                      aria-label="Slug sản phẩm"
                    />
                    <button
                      type="button"
                      onClick={handleToggleSlugLock}
                      className={styles.lockButton}
                      title={isSlugLocked ? "Đang tự động theo tên - Click để chỉnh sửa thủ công" : "Đang chỉnh sửa thủ công - Click để tự động theo tên"}
                      aria-label={isSlugLocked ? "Tắt tự động tạo đường dẫn tĩnh" : "Tạo đường dẫn tĩnh theo tên sản phẩm"}
                    >
                      {isSlugLocked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                  </div>
                  <div className={styles.slugPreview}>
                    <LinkIcon size={14} className={styles.previewIcon} />
                    <span className={styles.previewText}>
                      https://dongphucunivi.com/san-pham/{formData.slug || '...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Mô tả <span className={styles.required}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={handleDescriptionChange}
                className={styles.textarea}
                rows={3}
                placeholder="Nhập mô tả sản phẩm"
                required
                aria-label="Mô tả sản phẩm"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className={styles.sectionIcon} />
              Hình ảnh sản phẩm
            </h3>

            <div className={styles.imageInputContainer}>
              <div className={styles.imageInputSection}>
                <label className={styles.label}>
                  Đường dẫn ảnh chính <span className={styles.required}>*</span>
                </label>
                <div className={styles.mainImageRow}>
                  <input
                    type="text"
                    value={images[0]?.src || ''}
                    onChange={(e) => handleImageUrlChange(0, e.target.value)}
                    className={styles.input}
                    placeholder="/images/products/product-1.jpg"
                    required
                  />
                  <div className={styles.colorInputGroup}>
                    {/* Tên màu */}
                    <div className={styles.dualColorGroup}>
                      <span className={styles.colorLabel}>Tên màu</span>
                      <input
                        type="text"
                        value={images[0]?.name || ''}
                        onChange={(e) => handleColorNameChange(0, e.target.value)}
                        className={styles.colorNameInput}
                        placeholder="VD: Đen, Trắng..."
                        title="Tên màu hiển thị cho khách hàng"
                      />
                    </div>

                    <div className={styles.dualColorGroup}>
                      <span className={styles.colorLabel}>Màu 1</span>
                      <input
                        type="color"
                        value={images[0]?.color1 || '#000000'}
                        onChange={(e) => handleColorChange(0, 'color1', e.target.value)}
                        className={styles.colorPicker}
                        title="Chọn màu 1"
                      />
                      <input
                        type="text"
                        value={images[0]?.color1 || '#000000'}
                        onChange={(e) => handleColorChange(0, 'color1', e.target.value)}
                        className={styles.hexInput}
                        placeholder="#000000"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                      <button
                        type="button"
                        onClick={() => handleEyeDropper(0, 'color1')}
                        className={styles.eyeDropperBtn}
                        title="Hút màu từ ảnh"
                      >
                        <Pipette size={16} />
                      </button>
                    </div>

                    {/* Màu 2 - tuỳ chọn */}
                    {images[0]?.color2 ? (
                      <div className={styles.dualColorGroup}>
                        <span className={styles.colorLabel}>Màu 2</span>
                        <input
                          type="color"
                          value={images[0].color2}
                          onChange={(e) => handleColorChange(0, 'color2', e.target.value)}
                          className={styles.colorPicker}
                          title="Chọn màu 2"
                        />
                        <input
                          type="text"
                          value={images[0].color2}
                          onChange={(e) => handleColorChange(0, 'color2', e.target.value)}
                          className={styles.hexInput}
                          placeholder="#ffffff"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                        <button
                          type="button"
                          onClick={() => handleEyeDropper(0, 'color2')}
                          className={styles.eyeDropperBtn}
                          title="Hút màu từ ảnh"
                        >
                          <Pipette size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleColorChange(0, 'color2', '')}
                          className={styles.removeColor2Btn}
                          title="Xóa màu 2"
                        >×</button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleColorChange(0, 'color2', '#ffffff')}
                        className={styles.addColor2Btn}
                        title="Thêm màu thứ 2"
                      >
                        + Màu 2
                      </button>
                    )}

                    {/* Preview split-circle */}
                    {images[0]?.color2 ? (
                      <div
                        className={styles.splitCirclePreview}
                        title={`${images[0]?.color1 || '#000000'} / ${images[0].color2}`}
                        style={{
                          background: `linear-gradient(90deg, ${images[0]?.color1 || '#000000'} 50%, ${images[0].color2} 50%)`,
                        }}
                      />
                    ) : (
                      <div
                        className={styles.splitCirclePreview}
                        title={images[0]?.color1 || '#000000'}
                        style={{ background: images[0]?.color1 || '#000000' }}
                      />
                    )}

                    {images[0]?.src && (
                      <div className={styles.thumbnailPreview}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={images[0].src}
                          alt="Ảnh chính"
                          className={styles.thumbnailImage}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.additionalImagesSection}>
                <label className={styles.label}>
                  Đường dẫn ảnh bổ sung (tùy chọn)
                </label>
                <ReactSortable
                  list={images.slice(1).map((img, i) => ({ ...img, id: i + 1 }))}
                  setList={(newList) => {
                    setImages([images[0], ...newList.map(({ id, ...rest }) => rest)]);
                  }}
                  handle=".drag-handle-img"
                  animation={150}
                  ghostClass={styles.sortableGhost}
                >
                  {images.slice(1).map((img, index) => (
                    <div key={`img-${index}`} className={styles.additionalImageCard} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '0.625rem' }}>
                      {/* Cột trái: Drag + Thumbnail */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <div className={`drag-handle-img ${styles.dragHandle}`} title="Kéo để sắp xếp">
                          <GripVertical size={15} />
                        </div>
                        <div className={styles.thumbnailPreviewLg}>
                          {img.src
                            ? /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={img.src} alt={`Ảnh ${index + 2}`} className={styles.thumbnailImage} />
                            : <div className={styles.thumbnailPlaceholder} />
                          }
                        </div>
                      </div>

                      {/* Cột phải: URL + Tên màu + Chọn màu */}
                      <div className={styles.additionalImageRight}>
                        {/* Dòng 1: URL + Xóa */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={img.src || ''}
                            onChange={(e) => handleImageUrlChange(index + 1, e.target.value)}
                            className={styles.input}
                            placeholder={`/images/products/product-${index + 2}.jpg`}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index + 1)}
                            className={styles.removeImageButton}
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {/* Dòng 2: Tên màu + Màu 1 + Màu 2 + Preview */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexWrap: 'wrap' }}>
                          <div className={styles.dualColorGroup}>
                            <span className={styles.colorLabel}>Tên màu</span>
                            <input
                              type="text"
                              value={img.name || ''}
                              onChange={(e) => handleColorNameChange(index + 1, e.target.value)}
                              className={styles.colorNameInput}
                              placeholder="VD: Đỏ, Xanh..."
                              title="Tên màu"
                            />
                          </div>
                          <div className={styles.dualColorGroup}>
                            <span className={styles.colorLabel}>Màu 1</span>
                            <input
                              type="color"
                              value={img.color1 || '#000000'}
                              onChange={(e) => handleColorChange(index + 1, 'color1', e.target.value)}
                              className={styles.colorPickerSm}
                              title="Chọn màu 1"
                            />
                            <input
                              type="text"
                              value={img.color1 || '#000000'}
                              onChange={(e) => handleColorChange(index + 1, 'color1', e.target.value)}
                              className={styles.hexInputSm}
                              placeholder="#000000"
                              pattern="^#[0-9A-Fa-f]{6}$"
                            />
                            <button
                              type="button"
                              onClick={() => handleEyeDropper(index + 1, 'color1')}
                              className={styles.eyeDropperBtn}
                              title="Hút màu từ ảnh"
                              style={{ width: '28px', height: '28px' }}
                            >
                              <Pipette size={14} />
                            </button>
                          </div>
                          {img.color2 ? (
                            <div className={styles.dualColorGroup}>
                              <span className={styles.colorLabel}>Màu 2</span>
                              <input
                                type="color"
                                value={img.color2}
                                onChange={(e) => handleColorChange(index + 1, 'color2', e.target.value)}
                                className={styles.colorPickerSm}
                                title="Chọn màu 2"
                              />
                              <input
                                type="text"
                                value={img.color2}
                                onChange={(e) => handleColorChange(index + 1, 'color2', e.target.value)}
                                className={styles.hexInputSm}
                                placeholder="#ffffff"
                                pattern="^#[0-9A-Fa-f]{6}$"
                              />
                              <button
                                type="button"
                                onClick={() => handleEyeDropper(index + 1, 'color2')}
                                className={styles.eyeDropperBtn}
                                title="Hút màu từ ảnh"
                                style={{ width: '28px', height: '28px' }}
                              >
                                <Pipette size={14} />
                              </button>
                              <button type="button" onClick={() => handleColorChange(index + 1, 'color2', '')} className={styles.removeColor2Btn} title="Xóa màu 2">×</button>
                            </div>
                          ) : (
                            <button type="button" onClick={() => handleColorChange(index + 1, 'color2', '#ffffff')} className={styles.addColor2Btn} title="Thêm màu 2">+ Màu 2</button>
                          )}
                          {/* Preview circle */}
                          <div
                            className={styles.splitCirclePreviewSm}
                            title={img.color2 ? `${img.color1 || '#000'} / ${img.color2}` : (img.color1 || '#000')}
                            style={{ background: img.color2 ? `linear-gradient(90deg, ${img.color1 || '#000'} 50%, ${img.color2} 50%)` : (img.color1 || '#000') }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </ReactSortable>
                <button
                  type="button"
                  onClick={handleAddImageInput}
                  className={styles.addImageButton}
                >
                  <Plus size={16} />
                  Thêm ảnh
                </button>
              </div>

              {/* Gallery Section */}
              <div className={styles.gallerySection} style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>
                  Galery hình ảnh (Thiết lập tỉ lệ)
                </label>
                <p className="text-xs text-gray-500 mb-3" style={{ marginBottom: '1rem' }}>
                  Nhập tỷ lệ ảnh (width x height) để hiển thị trong React Photo Gallery.
                </p>
                <ReactSortable
                  list={formData.gallery.map((img, i) => ({ ...img, id: i }))}
                  setList={(newList) => {
                    dispatch({ type: 'SET_GALLERY', gallery: newList.map(({ id, ...rest }) => rest) });
                  }}
                  handle=".drag-handle-gallery"
                  animation={150}
                  ghostClass={styles.sortableGhost}
                >
                  {formData.gallery.map((img, index) => (
                    <div key={`gallery-${index}`} className={styles.imageInputRow} style={{ gridTemplateColumns: 'auto 1fr auto auto auto auto', cursor: 'default' }}>
                      <div className={`drag-handle-gallery ${styles.dragHandle}`} title="Kéo để sắp xếp">
                        <GripVertical size={16} />
                      </div>
                      <input
                        type="text"
                        value={img.src || ''}
                        onChange={(e) => handleGalleryImageUrlChange(index, e.target.value)}
                        className={styles.input}
                        placeholder={`/images/products/gallery-${index + 1}.jpg`}
                      />

                      <div className={styles.dimensionGroup} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className={styles.colorLabel} style={{ minWidth: 'auto' }}>W:</span>
                        <input
                          type="number"
                          value={img.width || 3}
                          onChange={(e) => handleGalleryWidthChange(index, e.target.value)}
                          className={styles.hexInput}
                          style={{ width: '45px' }}
                        />
                        <span className={styles.colorLabel} style={{ minWidth: 'auto' }}>H:</span>
                        <input
                          type="number"
                          value={img.height || 4}
                          onChange={(e) => handleGalleryHeightChange(index, e.target.value)}
                          className={styles.hexInput}
                          style={{ width: '45px' }}
                        />
                      </div>

                      <select
                        value={img.aspectRatio || 'landscape-3-4'}
                        onChange={(e) => handleGalleryAspectRatioChange(index, e.target.value)}
                        className={styles.select}
                        style={{ width: '130px', padding: '0.35rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        <option value="landscape-3-4">Ngang 4:3</option>
                        <option value="square">Vuông 1:1</option>
                        <option value="portrait">Dọc 3:4</option>
                      </select>

                      {img.src && (
                        <div className={styles.thumbnailPreview}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.src}
                            alt={`Gallery ${index + 1}`}
                            className={styles.thumbnailImage}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryItem(index)}
                        className={styles.removeImageButton}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </ReactSortable>
                <button
                  type="button"
                  onClick={handleAddGalleryItem}
                  className={styles.addImageButton}
                >
                  <Plus size={16} />
                  Thêm ảnh Gallery
                </button>
              </div>
            </div>

          </div>

          <div className={`${styles.formRow} ${styles.twoColumns}`}>
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Tag className={styles.sectionIcon} />
                Thông tin sản phẩm
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Chọn danh mục <span className={styles.required}>*</span>
                </label>
                <select
                  value={
                    categories.find(
                      (c) => c.category === formData.category && (!c.productLine || c.productLine === formData.productLine)
                    )?.key || formData.category
                  }
                  onChange={handleCategoryChange}
                  className={styles.select}
                  required
                  aria-label="Danh mục sản phẩm"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.key || cat.category} value={cat.key || cat.category}>
                      {cat.categoryNameVN}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Dòng sản phẩm</label>
                <select
                  value={formData.productLine}
                  onChange={handleProductLineChange}
                  className={styles.select}
                  aria-label="Dòng sản phẩm"
                  disabled={productLineOptions.length === 0}
                >
                  <option value="">Không áp dụng</option>
                  {productLineOptions.map((line) => (
                    <option key={line.value} value={line.value}>
                      {line.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Kiểu cổ</label>
                <select
                  value={formData.collarType}
                  onChange={handleCollarTypeChange}
                  className={styles.select}
                  aria-label="Kiểu cổ"
                  disabled={collarTypeOptions.length === 0}
                >
                  <option value="">Không áp dụng</option>
                  {collarTypeOptions.map((collar) => (
                    <option key={collar.value} value={collar.value}>
                      {collar.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Loại áo</label>
                <select
                  value={formData.shirtType}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'shirtType', value: e.target.value })}
                  className={styles.select}
                  aria-label="Loại áo"
                >
                  <option value="">Không áp dụng</option>
                  {shirtTypeOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Thứ tự hiển thị</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'displayOrder', value: Number(e.target.value) })}
                  className={styles.input}
                  placeholder="0"
                  aria-label="Thứ tự hiển thị"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Chất liệu</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'material', value: e.target.value })}
                  className={styles.input}
                  placeholder="Chất liệu (ví dụ: Cotton, Polyester)"
                  aria-label="Chất liệu"
                />
              </div>

              <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className={styles.label} style={{ margin: 0 }}>
                    Khách hàng đã đặt sản phẩm này & Link
                  </label>
                  <button
                    type="button"
                    onClick={handleAddCustomerRow}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#105d97',
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} /> Thêm khách hàng
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {customerPairs.map((pair, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder={`Tên KH #${idx + 1} (VD: Bloom Fitness & Yoga)`}
                          value={pair.name}
                          onChange={(e) => handleCustomerPairChange(idx, 'name', e.target.value)}
                          className={styles.input}
                          aria-label={`Tên khách hàng #${idx + 1}`}
                        />
                        <input
                          type="text"
                          placeholder={`Link FB / Website #${idx + 1} (VD: https://facebook.com/...)`}
                          value={pair.link}
                          onChange={(e) => handleCustomerPairChange(idx, 'link', e.target.value)}
                          className={styles.input}
                          aria-label={`Link khách hàng #${idx + 1}`}
                        />
                      </div>
                      {customerPairs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomerRow(idx)}
                          style={{
                            padding: '0.5rem',
                            color: '#ef4444',
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                          title="Xóa dòng này"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <span className={styles.helpText} style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.375rem', display: 'block' }}>
                  Tách riêng 2 ô (Tên khách hàng & Link FB / Website). Link sẽ hiển thị nhấp được trên trang chi tiết sản phẩm.
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Lựa chọn giá sản phẩm <span className={styles.required}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.25rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    <input
                      type="radio"
                      name="priceType"
                      value="numeric"
                      checked={priceType === 'numeric'}
                      onChange={() => {
                        setPriceType('numeric');
                      }}
                      style={{ cursor: 'pointer', width: '1rem', height: '1rem', accentColor: '#105d97' }}
                    />
                    Nhập giá cụ thể
                  </label>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                    <input
                      type="radio"
                      name="priceType"
                      value="contact"
                      checked={priceType === 'contact'}
                      onChange={() => {
                        setPriceType('contact');
                        dispatch({ type: 'UPDATE_FIELD', field: 'price', value: 0 });
                        dispatch({ type: 'UPDATE_FIELD', field: 'originalPrice', value: 0 });
                      }}
                      style={{ cursor: 'pointer', width: '1rem', height: '1rem', accentColor: '#105d97' }}
                    />
                    Liên hệ
                  </label>
                </div>
              </div>

              {priceType === 'numeric' ? (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>
                      Giá bán <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'price', value: Number(e.target.value) })}
                      className={styles.input}
                      min="0"
                      placeholder="Giá bán"
                      required
                      aria-label="Giá bán"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Giá gốc</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'originalPrice', value: Number(e.target.value) })}
                      className={styles.input}
                      min="0"
                      placeholder="Giá gốc"
                      aria-label="Giá gốc"
                    />
                  </div>
                </>
              ) : (
                <div className={styles.formGroup}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '0.5rem',
                    color: '#1e40af',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{ fontWeight: 600 }}>Giá: Liên hệ</span>
                    <span style={{ color: '#3b82f6' }}>(Sản phẩm sẽ hiển thị nhãn "Liên hệ" thay vì số tiền trên website)</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>
                <Star className={styles.sectionIcon} />
                Cài đặt nâng cao
              </h3>

              <div className={styles.formGroup}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'isNew', value: e.target.checked })}
                    className={styles.checkbox}
                    aria-label="Sản phẩm mới"
                  />
                  <label className={styles.checkboxLabel}>Sản phẩm mới</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'isFeatured', value: e.target.checked })}
                    className={styles.checkbox}
                    aria-label="Sản phẩm nổi bật"
                  />
                  <label className={styles.checkboxLabel}>Sản phẩm nổi bật</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={formData.visibleOnArticle}
                    onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'visibleOnArticle', value: e.target.checked })}
                    className={styles.checkbox}
                    aria-label="Hiển thị sản phẩm ở trang bài viết"
                  />
                  <label className={styles.checkboxLabel}>Hiển thị ở trang bài viết</label>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Đánh giá (0-5)</label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'rating', value: Number(e.target.value) })}
                  className={styles.input}
                  min="0"
                  max="5"
                  step="0.1"
                  aria-label="Đánh giá"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Số lượng đánh giá</label>
                <input
                  type="number"
                  value={formData.reviewCount}
                  onChange={(e) => dispatch({ type: 'UPDATE_FIELD', field: 'reviewCount', value: Number(e.target.value) })}
                  className={styles.input}
                  min="0"
                  aria-label="Số lượng đánh giá"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <FileEdit className={styles.sectionIcon} />
              Nội dung chi tiết
            </h3>

            <div className={styles.formGroup}>
              <label className={styles.label}>Nội dung</label>
              <Editor
                content={formData.content || ''}
                onChange={handleContentChange}
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>
              <HelpCircle className={styles.sectionIcon} />
              Câu hỏi thường gặp (FAQ)
            </h3>

            <div className={styles.faqList}>
              {(formData.faqs || []).map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <div className={styles.faqHeader}>
                    <span className={styles.faqIndex}>Câu hỏi {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className={styles.removeFaqButton}
                    >
                      Xóa
                    </button>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Câu hỏi</label>
                    <input
                      type="text"
                      value={faq.question || ''}
                      onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                      className={styles.input}
                      placeholder="Ví dụ: Thời gian sản xuất mẫu này là bao lâu?"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Câu trả lời</label>
                    <textarea
                      value={faq.answer || ''}
                      onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      placeholder="Nhập câu trả lời hiển thị trên trang sản phẩm"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddFaq}
              className={styles.addImageButton}
            >
              <Plus size={16} />
              Thêm câu hỏi FAQ
            </button>
          </div>

          <div className={styles.actionButtons}>
            <button
              type="button"
              onClick={() => router.push('/dashboard/san-pham')}
              className={styles.cancelButton}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={uploading || isSubmitting}
              className={styles.submitButton}
            >
              {uploading ? 'Đang upload...' : isSubmitting ? 'Đang xử lý...' : id ? 'Cập nhật' : 'Thêm'}
            </button>
          </div>
        </form>

        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Chọn ảnh đã tải lên</h3>
              <div className={styles.modalGrid}>
                {cloudinaryImages.map((src, index) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={index}
                    src={src}
                    alt={`Cloudinary image ${index + 1}`}
                    className={styles.modalImage}
                    onClick={() => handleSelectImage(src)}
                  />
                ))}
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.modalButton}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom EyeDropper Modal */}
        {eyeDropperState.open && (
          <div className={styles.modal} onClick={() => setEyeDropperState({ open: false, index: null, colorKey: null, hoveredColor: null })}>
            <div className={styles.modalContent} style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Di chuột lên ảnh và click để chọn màu cho <strong>{eyeDropperState.colorKey === 'color1' ? 'Màu 1' : 'Màu 2'}</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'crosshair',
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    background: '#f8fafc',
                  }}
                >
                  <canvas
                    ref={eyeDropperCanvasRef}
                    onMouseMove={handleCanvasMouseMove}
                    onClick={handleCanvasClick}
                    style={{ display: 'block', maxWidth: '100%', cursor: 'crosshair' }}
                  />
                </div>
                {/* Color preview panel */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  minWidth: '100px',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Màu hiện tại</span>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: eyeDropperState.hoveredColor || '#ffffff',
                    border: '3px solid #d1d5db',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'background 0.05s',
                  }} />
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    color: '#374151',
                    background: '#fff',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    minWidth: '80px',
                    textAlign: 'center',
                  }}>
                    {eyeDropperState.hoveredColor || '---'}
                  </span>
                </div>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setEyeDropperState({ open: false, index: null, colorKey: null, hoveredColor: null })}
                  className={styles.modalButton}
                >
                  Đóng
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
