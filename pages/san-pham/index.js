import DefaultLayout2 from "../../components/layout/DefaultLayout2";
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { formatPosts, readPostsFromDb } from '../../lib/utils';
import HeroSection1 from "../../components/univisport/HeroSection1";
import CategoryGrid from '../../components/univisport/CategoryGrid';
import CountdownTimer from '../../components/univisport/CountdownTimer';
import FabricCardComponent from '../../components/univisport/FabricCardComponent';
import CategoryShop from '../../components/univisport/CategoryShop';
import SeoArticleSection from '../../components/univisport/SeoArticleSection';
import InternalLinks from '../../components/univisport/InternalLinks';

// ─── DEFAULT META — dùng cho cả try và catch ─────────────────
const DEFAULT_META = {
  title: "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
  description:
    "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
  keywords:
    "đồng phục thể thao chuyên dụng, đồng phục Gym, đồng phục Yoga, đồng phục Pilates, đồng phục Pickleball, đồng phục Áo Gió, xưởng may đồng phục Hà Nội, công nghệ UNI DRY, đồng phục doanh nghiệp B2B, may đồng phục theo yêu cầu, Đồng Phục Univi",
  robots: "index, follow",
  author: "Đồng Phục Univi",
  canonical: "https://dongphucunivi.com/san-pham",
  og: {
    title: "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
    description:
      "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
    type: "website",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
    imageWidth: "1200",
    imageHeight: "630",
    imageAlt: "Xưởng sản xuất đồng phục thể thao Univi tại phường Chương Mỹ, Hà Nội — công suất 100.000 sản phẩm/tháng",
    url: "https://dongphucunivi.com/san-pham",
    site_name: "Đồng Phục Univi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
    description:
      "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
    image: "https://dongphucunivi.com/images/banner-home-1.jpg",
  },
};

// Đặt ngoài component để tránh tạo lại mỗi lần render
const COLLECTION_SCHEMA = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
      { "@type": "ListItem", "position": 2, "name": "Sản phẩm", "item": "https://dongphucunivi.com/san-pham" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://dongphucunivi.com/san-pham#webpage",
    "name": "Danh Mục Đồng Phục Thể Thao | Đồng Phục Univi",
    "description": "Khám phá các dòng đồng phục thể thao chuyên dụng từ Đồng Phục Univi: Gym, Yoga, Pickleball, Running, Golf, Team Building và doanh nghiệp.",
    "url": "https://dongphucunivi.com/san-pham",
    "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
    "about": { "@id": "https://dongphucunivi.com/#organization" },
  }
];

const ProductsPage = ({ relatedPosts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const togglePopup = () => setIsPopupOpen(!isPopupOpen);
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
  const toggleSearch = () => { setIsSearchOpen(!isSearchOpen); if (isSearchOpen) setSearchQuery(''); };
  const handleSearch = (e) => setSearchQuery(e.target.value.toLowerCase());

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSearchOpen && searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.message.trim()) newErrors.message = "Vui lòng nhập yêu cầu của bạn";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        setStatus("Gửi thông tin thành công!");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setTimeout(() => setStatus(""), 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi gửi form"}`);
    }
  };

  return (
    <DefaultLayout2>
      {/* H1 ẩn — chuẩn SEO, có từ khóa địa lý + công nghệ */}
      <h1 className="visually-hidden">
        Đồng Phục Univi — Xưởng May Đồng Phục Thể Thao Chuyên Dụng, Vải UNI DRY Tại Hà Nội
      </h1>

      <div className="relative w-full h-[30vh] md:h-[40vh]">
        <Image
          src="/images/banner-univi.png"
          alt="Xưởng sản xuất đồng phục thể thao Univi tại Hà Nội — Gym, Yoga, Pickleball"
          fill
          className="brightness-50 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="container mx-auto absolute bottom-6 left-0 md:bottom-8 right-0 flex flex-col justify-end items-start text-white pb-3">
          <nav aria-label="Breadcrumb">
            <p className="text-sm uppercase text-gray-300 mb-2">
              <Link href="/" className="hover:underline">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span aria-current="page">Sản phẩm</span>
            </p>
          </nav>
          <p className="text-2xl md:text-4xl font-bold text-white">Đồng phục Univi</p>
          <p className="text-sm md:text-lg mt-2 max-w-5xl text-gray-200">
            Xưởng sản xuất 2.000m² tại phường Chương Mỹ, Hà Nội — Đồng phục Gym, Yoga, Pickleball, Áo Gió chuyên dụng
          </p>
        </div>
      </div>

      <CountdownTimer />
      <CategoryGrid />
      <HeroSection1 />
      <FabricCardComponent />
      <SeoArticleSection />
    </DefaultLayout2>
  );
};

// ─── SERVER SIDE PROPS ────────────────────────────────────────
export const getServerSideProps = async () => {
  try {
    const posts = await readPostsFromDb(3, 0);
    const formattedPosts = formatPosts(posts);
    return {
      props: {
        relatedPosts: formattedPosts,
        meta: { ...DEFAULT_META, schema: COLLECTION_SCHEMA },
      },
    };
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return {
      props: {
        relatedPosts: [],
        meta: { ...DEFAULT_META, schema: COLLECTION_SCHEMA },
      },
    };
  }
};

export default ProductsPage;