import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../../public/logo-univi.webp";
import { FaBars, FaTimes, FaChevronDown, FaChevronRight } from "react-icons/fa";
import ResponsiveNavbar from "./ResponsiveNavbar";
import ContactForm from "./ContactForm";
import { ENTERPRISE_FLAT_SLUGS, ENTERPRISE_SLUG, isEnterprisePath, isSportPath } from "../../lib/enterpriseFlatSlugs";

// ─── Navbar Link Helpers ───────────────────────────────────────────────────
const getNavLinkClass = (isTransparent = false, isActive = false) =>
  `px-3 py-2 font-semibold uppercase text-sm whitespace-nowrap transition-colors duration-300 ${isActive
    ? isTransparent ? "text-white" : "text-[#105d97]"
    : isTransparent ? "text-white/90 hover:text-white group-hover:text-white" : "text-gray-700 hover:text-[#105d97] group-hover:text-[#105d97]"
  }`;

const getUnderlineSpanClass = (isTransparent = false, isActive = false) =>
  `relative inline-block after:content-[''] after:absolute after:-bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] ${isTransparent ? "after:bg-white" : "after:bg-[#105d97]"
  } after:rounded-full after:transition-all after:duration-300 ${isActive ? "after:w-full" : "after:w-0 group-hover:after:w-full hover:after:w-full"
  }`;

const getDropdownTriggerClass = (isTransparent = false, isActive = false) =>
  `flex items-center gap-1 ${getNavLinkClass(isTransparent, isActive)}`;

// ─── Đồng phục thể thao dropdown ─────────────────────────────────────────────
const sportMenuData = [
  {
    name: "Đồng phục Gym",
    href: "/dong-phuc-gym",
    children: [
      {
        name: "Áo thun Fit Body",
        href: "/dong-phuc-gym?line=ao-thun-fit-body",
        children: [
          { name: "Cổ tròn", href: "/dong-phuc-gym?line=ao-thun-fit-body&collar=co-tron" },
          { name: "Cổ trụ", href: "/dong-phuc-gym?line=ao-thun-fit-body&collar=co-tru" },
        ],
      },
      { name: "Polo thể thao", href: "/dong-phuc-gym?line=polo-the-thao" },
      {
        name: "Mẫu Mockup 3D",
        children: [
          { name: "Áo gym cổ có khóa", href: "/mau-ao-gym-co-co-khoa" },
          { name: "Áo gym cổ polo", href: "/mau-ao-gym-co-polo" },
          { name: "Áo gym cổ tròn không khóa", href: "/mau-ao-gym-co-tron-khong-khoa" },
        ],
      },
    ],
  },
  { name: "Đồng phục Pickleball", href: "/dong-phuc-pickleball" },
  { name: "Đồng phục Yoga", href: "/dong-phuc-yoga-pilates" },
  { name: "Đồng phục Golf - Tennis", href: "/dong-phuc-golf-tennis" },
  { name: "Đồng phục Áo gió", href: "/dong-phuc-ao-gio" },
];

const SportUniformMenu = ({ isTransparent = false, activePath = "" }) => {
  const [isFitBodyOpen, setIsFitBodyOpen] = useState(false);
  const [isMockup3DOpen, setIsMockup3DOpen] = useState(false);
  const isActive = isSportPath(activePath);

  return (
    <div className="relative group" onMouseLeave={() => { setIsFitBodyOpen(false); setIsMockup3DOpen(false); }}>
      <Link
        href="/dong-phuc-the-thao"
        className={getDropdownTriggerClass(isTransparent, isActive)}
      >
        <span className={getUnderlineSpanClass(isTransparent, isActive)}>
          Đồng phục thể thao
        </span>
        <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />
      </Link>

      {/* Mega Menu Dropdown */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[980px] max-w-[95vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Left Columns: Categories (8 cols) */}
            <div className="col-span-8 grid grid-cols-3 gap-6 border-r border-gray-100 pr-6">

              {/* Column 1: Đồng phục Gym */}
              <div>
                <Link
                  href="/dong-phuc-gym"
                  className="block text-base font-bold text-gray-900 hover:text-[#105d97] mb-3 transition-colors whitespace-nowrap"
                >
                  Đồng phục Gym
                </Link>

                <ul className="space-y-2.5 text-sm">
                  {/* Sub category: Áo thun Fit Body (Click to expand) */}
                  <li className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsFitBodyOpen(!isFitBodyOpen)}
                      className="w-full flex items-center justify-between text-[#333] hover:text-[#105d97] font-semibold text-[13.5px] transition-colors py-0.5 group/fit text-left cursor-pointer whitespace-nowrap gap-2"
                    >
                      <span className="whitespace-nowrap">Áo thun Fit Body</span>
                      <FaChevronDown
                        className={`text-[11px] text-gray-400 group-hover/fit:text-[#105d97] transition-transform duration-300 shrink-0 ${isFitBodyOpen ? "rotate-180 text-[#105d97]" : ""
                          }`}
                      />
                    </button>

                    {/* Level 3: Cổ tròn / Cổ trụ (Dropdown on click) */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${isFitBodyOpen ? "max-h-28 opacity-100 mt-1" : "max-h-0 opacity-0"
                        }`}
                    >
                      <ul className="pl-3 space-y-1 border-l-2 border-blue-100 ml-1 py-1">
                        <li>
                          <Link
                            href="/dong-phuc-gym?line=ao-thun-fit-body&collar=co-tron"
                            className="block text-[13px] text-gray-600 hover:text-[#105d97] py-0.5 font-medium transition-colors whitespace-nowrap"
                          >
                            • Áo thun cổ tròn
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/dong-phuc-gym?line=ao-thun-fit-body&collar=co-tru"
                            className="block text-[13px] text-gray-600 hover:text-[#105d97] py-0.5 font-medium transition-colors whitespace-nowrap"
                          >
                            • Áo thun cổ trụ
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>

                  {/* Polo thể thao */}
                  <li>
                    <Link
                      href="/dong-phuc-gym?line=polo-the-thao"
                      className="flex items-center gap-1.5 text-[#333] hover:text-[#105d97] font-semibold text-[13.5px] py-0.5 transition-colors whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">Polo thể thao</span>
                      <span className="inline-flex items-center bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase shrink-0 shadow-sm animate-pulse">
                        Hot
                      </span>
                    </Link>
                  </li>

                  {/* Sub category: Mẫu Mockup 3D */}
                  <li className="space-y-1">
                    <button
                      type="button"
                      onClick={() => setIsMockup3DOpen(!isMockup3DOpen)}
                      className="w-full flex items-center justify-between text-[#333] hover:text-[#105d97] font-semibold text-[13.5px] transition-colors py-0.5 group/mockup text-left cursor-pointer whitespace-nowrap gap-2"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="whitespace-nowrap">Mẫu Mockup 3D</span>

                      </div>
                      <FaChevronDown
                        className={`text-[11px] text-gray-400 group-hover/mockup:text-[#105d97] transition-transform duration-300 shrink-0 ${isMockup3DOpen ? "rotate-180 text-[#105d97]" : ""
                          }`}
                      />
                    </button>

                    {/* Level 3: 3D Mockup pages */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${isMockup3DOpen ? "max-h-36 opacity-100 mt-1" : "max-h-0 opacity-0"
                        }`}
                    >
                      <ul className="pl-3 space-y-1 border-l-2 border-blue-100 ml-1 py-1">
                        <li>
                          <Link
                            href="/mau-ao-gym-co-co-khoa"
                            className="block text-[13px] text-gray-600 hover:text-[#105d97] py-0.5 font-medium transition-colors whitespace-nowrap"
                          >
                            • Mẫu áo gym cổ có khóa
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/mau-ao-gym-co-polo"
                            className="block text-[13px] text-gray-600 hover:text-[#105d97] py-0.5 font-medium transition-colors whitespace-nowrap"
                          >
                            • Mẫu áo gym cổ polo
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/mau-ao-gym-co-tron-khong-khoa"
                            className="block text-[13px] text-gray-600 hover:text-[#105d97] py-0.5 font-medium transition-colors whitespace-nowrap"
                          >
                            • Mẫu áo gym cổ tròn không khóa
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Column 2: Pickleball & Yoga */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3 whitespace-nowrap">
                  Pickleball & Yoga
                </h4>
                <ul className="space-y-2.5 text-[13.5px] text-gray-700 font-medium">
                  <li>
                    <Link href="/dong-phuc-pickleball" className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      Đồng phục Pickleball
                    </Link>
                  </li>
                  <li>
                    <Link href="/dong-phuc-yoga-pilates" className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      Đồng phục Yoga
                    </Link>
                  </li>
                  <li>
                    <Link href="/dong-phuc-pilates" className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      Đồng phục Pilates
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3: Golf & Áo gió */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3 whitespace-nowrap">
                  Đồng phục khác
                </h4>
                <ul className="space-y-2.5 text-[13.5px] text-gray-700 font-medium">
                  <li>
                    <Link href="/dong-phuc-golf-tennis" className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      Đồng phục Golf - Tennis
                    </Link>
                  </li>
                  <li>
                    <Link href="/dong-phuc-ao-gio" className="flex items-center gap-1.5 hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      <span className="whitespace-nowrap">Đồng phục Áo gió</span>

                    </Link>
                  </li>
                  <li>
                    <Link href="/dong-phuc-mma" className="flex items-center gap-1.5 hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      <span className="whitespace-nowrap">Đồng phục MMA</span>

                    </Link>
                  </li>
                  <li>
                    <Link href="/dong-phuc-chay-bo" className="flex items-center gap-1.5 hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap">
                      <span className="whitespace-nowrap">Đồng phục Chạy bộ</span>

                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Columns: Featured Showcase (4 cols) */}
            <div className="col-span-4 grid grid-cols-2 gap-3">

              {/* Featured Product Card 1 */}
              <Link href="/dong-phuc-gym" className="group block space-y-1.5">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  <img
                    src="/images/dptt2.jpg"
                    alt="Áo Gym Fit Body"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                </div>

              </Link>

              {/* Featured Product Card 2 */}
              <Link href="/dong-phuc-gym" className="group block space-y-1.5">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  <img
                    src="/images/tkdp.jpg"
                    alt="Polo thể thao Univi"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                </div>

              </Link>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};


const EnterpriseUniformMenu = ({ isTransparent = false, activePath = "" }) => {
  const isActive = isEnterprisePath(activePath);

  return (
    <div className="relative group">
      <Link
        href={`/${ENTERPRISE_SLUG}`}
        className={getDropdownTriggerClass(isTransparent, isActive)}
      >
        <span className={getUnderlineSpanClass(isTransparent, isActive)}>
          Đồng phục doanh nghiệp
        </span>
        <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />
      </Link>

      {/* Mega Menu Dropdown */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[840px] max-w-[95vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
          <div className="grid grid-cols-12 gap-6 items-start">

            {/* Left Columns: 2 Cột Menu (8 cols) */}
            <div className="col-span-8 grid grid-cols-2 gap-6 border-r border-gray-100 pr-6">

              {/* Cột 1: Đồng phục Công ty */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3 whitespace-nowrap">
                  Đồng phục Công ty
                </h4>
                <ul className="space-y-2.5 text-[13.5px] text-gray-700 font-medium">
                  <li>
                    <Link
                      href={`/${ENTERPRISE_FLAT_SLUGS['so-mi']}`}
                      className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap"
                    >
                      Đồng phục Sơ mi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${ENTERPRISE_FLAT_SLUGS['vest']}`}
                      className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap"
                    >
                      Đồng phục Vest công sở
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${ENTERPRISE_FLAT_SLUGS['polo']}`}
                      className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap"
                    >
                      Polo doanh nghiệp
                    </Link>
                  </li>

                </ul>
              </div>

              {/* Cột 2: Đồng phục Khác */}
              <div>
                <h4 className="text-base font-bold text-gray-900 mb-3 whitespace-nowrap">
                  Đồng phục Khác
                </h4>
                <ul className="space-y-2.5 text-[13.5px] text-gray-700 font-medium">
                  <li>
                    <Link
                      href={`/${ENTERPRISE_FLAT_SLUGS['bao-ho']}`}
                      className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap"
                    >
                      Bảo hộ lao động
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${ENTERPRISE_FLAT_SLUGS['phu-kien']}`}
                      className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap"
                    >
                      Phụ kiện & Quà tặng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${ENTERPRISE_FLAT_SLUGS['teambuilding']}`}
                      className="block hover:text-[#105d97] transition-colors py-0.5 whitespace-nowrap"
                    >
                      Đồng phục Teambuilding
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            {/* Right Column: Cột Hình ảnh nổi bật (4 cols) */}
            <div className="col-span-4 grid grid-cols-2 gap-3">
              {/* Featured Product Card 1 */}
              <Link href={`/${ENTERPRISE_FLAT_SLUGS['so-mi']}`} className="group block space-y-1.5">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  <img
                    src="/product/cong-so.webp"
                    alt="Sơ mi Công Sở"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

              </Link>

              {/* Featured Product Card 2 */}
              <Link href={`/${ENTERPRISE_FLAT_SLUGS['polo']}`} className="group block space-y-1.5">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  <img
                    src="/images/dong-phuc-cong-ty.webp"
                    alt="Polo Doanh Nghiệp"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Giới thiệu dropdown ────────────────────────────────────────────────────
const GioiThieuDropdown = ({ isTransparent = false, activePath = "" }) => {
  const gioiThieuLinks = [
    { name: "Về chúng tôi", href: "/gioi-thieu" },
    { name: "Hồ sơ năng lực", href: "/ho-so-nang-luc" },
    { name: "Bộ sưu tập Univi", href: "/bo-suu-tap" },
    { name: "Chất liệu vải", href: "/chat-lieu-vai" },
    { name: "Bảng màu UNIVI", href: "/bang-mau" }
  ];
  const isActive = gioiThieuLinks.some(
    (item) => activePath === item.href || activePath.startsWith(`${item.href}/`)
  );

  return (
    <div className="relative group">
      <button className={getDropdownTriggerClass(isTransparent, isActive)}>
        <span className={getUnderlineSpanClass(isTransparent, isActive)}>
          Giới thiệu
        </span>
        <FaChevronDown className="text-xs transition-transform group-hover:rotate-180" />
      </button>
      <div className="absolute uppercase text-sm top-full left-0 pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50 before:content-[''] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
          {gioiThieuLinks.map((item) => {
            const isSubActive =
              activePath === item.href || activePath.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-[12px] font-semibold rounded-xl transition-all duration-200 ${isSubActive
                  ? "text-[#105d97] bg-blue-50/60 font-bold"
                  : "text-gray-600 hover:text-[#105d97]"
                  }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Main Navbar ─────────────────────────────────────────────────────────────
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const router = useRouter();
  const isTransparentPage = router.pathname === "/" || router.pathname === "/bo-suu-tap";
  const isNavbarTransparent = isTransparentPage && !isScrolled;

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    if (!isTransparentPage) {
      setIsScrolled(false);
      return undefined;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTransparentPage]);

  // Listen for global open contact modal event
  useEffect(() => {
    const handleOpenContact = () => setContactOpen(true);
    window.addEventListener("openContactModal", handleOpenContact);
    return () => window.removeEventListener("openContactModal", handleOpenContact);
  }, []);

  return (
    <>
      <header>
        <nav
          className={`fixed top-0 left-0 right-0 z-[99999] transition-all duration-300 ${isNavbarTransparent
            ? "bg-transparent border-b border-transparent shadow-none"
            : "bg-white border-b border-gray-100 shadow-sm"
            }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-[70px]">

              {/* Logo */}
              <Link href="/" className="shrink-0">
                <Image
                  src={logo}
                  alt="Đồng Phục Univi"
                  width={110}
                  height={44}
                  priority
                  className={`h-5 lg:h-auto w-auto transition duration-300 ${isNavbarTransparent ? "brightness-0 invert" : ""}`}
                />
              </Link>

              {/* Desktop nav links */}
              <div className="hidden lg:flex items-center space-x-1">
                <Link href="/" className={getNavLinkClass(isNavbarTransparent, router.pathname === "/")}>
                  <span className={getUnderlineSpanClass(isNavbarTransparent, router.pathname === "/")}>
                    Trang chủ
                  </span>
                </Link>
                <GioiThieuDropdown isTransparent={isNavbarTransparent} activePath={router.asPath} />
                <SportUniformMenu isTransparent={isNavbarTransparent} activePath={router.asPath} />
                <EnterpriseUniformMenu isTransparent={isNavbarTransparent} activePath={router.asPath} />

                <Link
                  href="/feedback"
                  className={getNavLinkClass(isNavbarTransparent, router.pathname.startsWith("/feedback"))}
                >
                  <span className={getUnderlineSpanClass(isNavbarTransparent, router.pathname.startsWith("/feedback"))}>
                    Feedback
                  </span>
                </Link>

              </div>

              {/* Right actions */}
              <div className="flex items-center space-x-2">
                {/* Liên hệ đặt hàng button */}
                <Link
                  href="/dang-ky-dai-ly"
                  className="hidden lg:flex items-center gap-2 bg-[#105d97] hover:bg-[#0d4c7a] text-white text-sm font-semibold uppercase px-4 py-2 rounded-full transition-all duration-300"
                >
                  Hợp tác cùng Univi
                </Link>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${isNavbarTransparent
                    ? "text-white hover:bg-white/10"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}
                  aria-label="Mở menu"
                  aria-expanded={menuOpen}
                  aria-controls={menuOpen ? "mobile-primary-menu" : undefined}
                >
                  {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile menu */}
        <ResponsiveNavbar isOpen={menuOpen} toggleMenu={() => setMenuOpen(false)} />
      </header>

      {/* Contact modal */}
      {contactOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999999] flex items-center justify-center px-4"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl  overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
          >
            <div className="bg-white px-6 py-4 flex justify-center items-center border-b rounded-t-lg relative">
              <h3
                id="contact-modal-title"
                className="text-[#105d97] font-bold text-base md:text-lg tracking-wide uppercase text-center"
              >
                Đăng ký tư vấn đồng phục Univi
              </h3>
              <button
                onClick={() => setContactOpen(false)}
                className="absolute right-4 text-[#105d97] hover:text-[#0d4c7a] transition-colors rounded-full p-1 hover:rotate-90 duration-300"
                aria-label="Đóng"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <ContactForm source={`Navbar (${router.asPath})`} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
