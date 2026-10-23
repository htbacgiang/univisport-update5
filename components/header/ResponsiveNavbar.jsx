import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaHome, FaInfoCircle, FaShoppingBag, FaNewspaper, FaPhone, FaStar, FaChevronDown, FaTimes, FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaYoutube, FaBriefcase } from "react-icons/fa";
import logo from "../../public/logo-univi.webp";
import { getProductLineOptions } from "../../lib/productTaxonomy";
import { ENTERPRISE_FLAT_SLUGS, ENTERPRISE_SLUG, isEnterprisePath, isSportPath } from "../../lib/enterpriseFlatSlugs";

const enterpriseMenuItems = getProductLineOptions(ENTERPRISE_SLUG);

const menuItems = [
  { name: "Trang chủ", link: "/", icon: FaHome },
  {
    name: "Về Đồng phục Univi",
    icon: FaInfoCircle,
    dropdown: [
      { name: "Giới thiệu", link: "/gioi-thieu" },
      { name: "Hồ sơ năng lực", link: "/ho-so-nang-luc" },
      { name: "Bộ sưu tập Univi", link: "/bo-suu-tap" },
      { name: "Chất liệu vải", link: "/chat-lieu-vai" },
      { name: "Bảng màu UNIVI", link: "/bang-mau" }
    ],
  },
  {
    name: "Đồng phục thể thao",
    link: "/dong-phuc-the-thao",
    icon: FaShoppingBag,
    dropdown: [
      {
        name: "Đồng phục Gym",
        link: "/dong-phuc-gym",
        subDropdown: [
          {
            name: "Áo thun Fit Body",
            link: "/dong-phuc-gym?line=ao-thun-fit-body",
            subDropdown: [
              { name: "Cổ tròn", link: "/dong-phuc-gym?line=ao-thun-fit-body&collar=co-tron" },
              { name: "Cổ trụ", link: "/dong-phuc-gym?line=ao-thun-fit-body&collar=co-tru" },
            ],
          },
          { name: "Polo thể thao", link: "/dong-phuc-gym?line=polo-the-thao", isHot: true },
          {
            name: "Mẫu Mockup 3D",
            subDropdown: [
              { name: "Áo gym cổ có khóa", link: "/mau-ao-gym-co-co-khoa" },
              { name: "Áo gym cổ polo", link: "/mau-ao-gym-co-polo" },
              { name: "Áo gym cổ tròn không khóa", link: "/mau-ao-gym-co-tron-khong-khoa" },
            ],
          },
        ],
      },
      { name: "Đồng phục Pickleball", link: "/dong-phuc-pickleball" },
      { name: "Đồng phục Yoga", link: "/dong-phuc-yoga-pilates" },
      { name: "Đồng phục Pilates", link: "/dong-phuc-pilates" },
      { name: "Đồng phục Golf - Tennis", link: "/dong-phuc-golf-tennis" },
      { name: "Đồng phục Áo gió", link: "/dong-phuc-ao-gio" },
    ],
  },
  {
    name: "Đồng phục Doanh nghiệp",
    link: `/${ENTERPRISE_SLUG}`,
    icon: FaBriefcase,
    dropdown: enterpriseMenuItems.map((item) => ({
      name: item.label,
      link: `/${ENTERPRISE_FLAT_SLUGS[item.value] || `${ENTERPRISE_SLUG}/${item.value}`}`,
    })),
  },
  { name: "Bài viết", link: "/bai-viet", icon: FaNewspaper },
  { name: "Liên hệ", link: "/lien-he", icon: FaPhone },
  { name: "Feedback", link: "/feedback", icon: FaStar },
];

const ResponsiveMenu = ({ isOpen, toggleMenu }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [activeSubSubDropdown, setActiveSubSubDropdown] = useState(null);
  const router = useRouter();

  const isActivePath = (href) => {
    if (!href) return false;
    if (href === "/") return router.pathname === "/";
    if (href === "/dong-phuc-the-thao") return isSportPath(router.asPath);
    if (href === `/${ENTERPRISE_SLUG}`) return isEnterprisePath(router.asPath);
    return router.pathname.startsWith(href);
  };

  const toggleDropdown = (idx) => {
    setActiveDropdown(activeDropdown === idx ? null : idx);
    setActiveSubDropdown(null);
    setActiveSubSubDropdown(null);
  };

  const toggleSubDropdown = (key) => {
    setActiveSubDropdown(activeSubDropdown === key ? null : key);
    setActiveSubSubDropdown(null);
  };

  const toggleSubSubDropdown = (key) => {
    setActiveSubSubDropdown(activeSubSubDropdown === key ? null : key);
  };

  // Close on route change
  useEffect(() => {
    toggleMenu && setActiveDropdown(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={toggleMenu}
      />

      {/* Drawer */}
      <div
        id="mobile-primary-menu"
        className={`fixed top-0 left-0 h-screen w-4/5 max-w-sm bg-white shadow-2xl border-r border-gray-200 z-[9999] transform transition-transform duration-500 ease-in-out lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <Link href="/" onClick={toggleMenu}>
            <Image src={logo} alt="Logo Univi" width={60} height={28} priority className="h-5 w-auto" />
          </Link>

        </div>

        {/* Nav items */}
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex-1 p-5 space-y-3">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isActivePath(item.link);

              return (
                <div key={idx}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(idx)}
                        aria-expanded={activeDropdown === idx}
                        aria-label={`${activeDropdown === idx ? "Đóng" : "Mở"} danh mục ${item.name}`}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-md ${active
                          ? "bg-gradient-to-r from-blue-100 to-blue-50 text-[#105d97] border border-blue-200"
                          : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 hover:text-gray-900 border border-gray-100 hover:border-gray-200"
                          }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0 pr-2">
                          <div className={`p-2 rounded-xl shrink-0 ${active ? "bg-blue-200" : "bg-gray-100"}`}>
                            <Icon className={`text-base ${active ? "text-[#105d97]" : "text-gray-600"}`} />
                          </div>
                          <span className="text-[15px] sm:text-base whitespace-nowrap">{item.name}</span>
                        </div>
                        <FaChevronDown
                          className={`text-sm shrink-0 transition-transform duration-300 ${activeDropdown === idx ? "rotate-180" : ""} ${active ? "text-[#105d97]" : "text-gray-400"}`}
                        />
                      </button>

                      {/* Dropdown */}
                      <div className={`transition-all duration-300 overflow-hidden ${activeDropdown === idx ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                        <div className="pl-3 space-y-1.5">
                          {item.dropdown.map((sub, sIdx) => {
                            const hasSub = Boolean(sub.subDropdown && sub.subDropdown.length > 0);

                            if (!hasSub) {
                              return (
                                <Link
                                  key={sIdx}
                                  href={sub.link || sub.href || "#"}
                                  onClick={toggleMenu}
                                  className="block px-3 py-2 ml-3 text-sm font-semibold text-gray-700 hover:text-[#105d97] hover:bg-gray-50 rounded-xl transition-all border-l-2 border-gray-200 whitespace-nowrap"
                                >
                                  {sub.name}
                                </Link>
                              );
                            }

                            return (
                              <div key={sIdx} className="space-y-1">
                                <Link
                                  href={sub.link || sub.href || "#"}
                                  onClick={toggleMenu}
                                  className="block px-3 py-2 ml-3 text-sm font-bold text-[#105d97] bg-blue-50/70 rounded-xl transition-all border-l-2 border-[#105d97] whitespace-nowrap"
                                >
                                  {sub.name}
                                </Link>

                                <div className="pl-4 ml-3 border-l-2 border-blue-200 space-y-1.5 py-1">
                                  {sub.subDropdown.map((nested, nIdx) => {
                                    const nestedKey = `${sIdx}-${nIdx}`;
                                    const hasNested = Boolean(nested.subDropdown && nested.subDropdown.length > 0);
                                    const isNestedOpen = activeSubSubDropdown === nestedKey;

                                    return (
                                      <div key={nIdx} className="space-y-1">
                                        {hasNested ? (
                                          <div>
                                            <div className="flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg">
                                              {nested.link ? (
                                                <Link
                                                  href={nested.link}
                                                  onClick={toggleMenu}
                                                  className="flex items-center gap-1.5 hover:text-[#105d97]"
                                                >
                                                  <span className="w-1.5 h-1.5 rounded-full bg-[#105d97]/70 shrink-0" />
                                                  <span className="whitespace-nowrap">{nested.name}</span>
                                                </Link>
                                              ) : (
                                                <button
                                                  type="button"
                                                  onClick={() => toggleSubSubDropdown(nestedKey)}
                                                  className="flex items-center gap-1.5 hover:text-[#105d97] text-left cursor-pointer"
                                                >
                                                  <span className="w-1.5 h-1.5 rounded-full bg-[#105d97]/70 shrink-0" />
                                                  <span className="whitespace-nowrap">{nested.name}</span>
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={() => toggleSubSubDropdown(nestedKey)}
                                                aria-label={`Toggle ${nested.name}`}
                                                className="p-1 text-gray-400 hover:text-[#105d97]"
                                              >
                                                <FaChevronDown
                                                  className={`text-[10px] transition-transform duration-300 ${isNestedOpen ? "rotate-180 text-[#105d97]" : ""
                                                    }`}
                                                />
                                              </button>
                                            </div>

                                            <div
                                              className={`transition-all duration-300 overflow-hidden ${isNestedOpen ? "max-h-36 opacity-100 mt-1" : "max-h-0 opacity-0"
                                                }`}
                                            >
                                              <div className="pl-4 ml-2 border-l border-dashed border-blue-200 space-y-0.5">
                                                {nested.subDropdown.map((leaf, lIdx) => (
                                                  <Link
                                                    key={lIdx}
                                                    href={leaf.link}
                                                    onClick={toggleMenu}
                                                    className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium text-gray-600 hover:text-[#105d97] hover:bg-gray-50 rounded-md transition-all"
                                                  >
                                                    <span className="text-gray-400 font-normal">-</span>
                                                    <span className="whitespace-nowrap">{leaf.name}</span>
                                                  </Link>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          <Link
                                            href={nested.link}
                                            onClick={toggleMenu}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#105d97] hover:bg-gray-50 rounded-lg transition-all"
                                          >
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#105d97]/70 shrink-0" />
                                            <span className="whitespace-nowrap">{nested.name}</span>

                                          </Link>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.link}
                      onClick={toggleMenu}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 shadow-sm hover:shadow-md ${active
                        ? "bg-gradient-to-r from-blue-100 to-blue-50 text-[#105d97] border border-blue-200"
                        : "bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-white text-gray-700 hover:text-gray-900 border border-gray-100 hover:border-gray-200"
                        }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 ${active ? "bg-blue-200" : "bg-gray-100"}`}>
                        <Icon className={`text-base ${active ? "text-[#105d97]" : "text-gray-600"}`} />
                      </div>
                      <span className="text-[15px] sm:text-base whitespace-nowrap">{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}

            {/* CTA Button */}
            <div className="pt-2 pb-2">
              <Link
                href="/dang-ky-dai-ly"
                onClick={toggleMenu}
                className="w-full flex items-center justify-center gap-2 bg-[#105d97] hover:bg-[#0d4c7a] text-white text-[15px] font-bold px-5 py-3.5 rounded-2xl transition-all duration-300 shadow-md"
              >
                Hợp tác cùng Univi
              </Link>
            </div>

            {/* Social icons */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Theo dõi chúng tôi</p>
              <div className="flex items-center justify-center gap-3">
                {[
                  { icon: FaFacebookF, href: "https://facebook.com/Dongphucunivi", label: "Facebook", bg: "bg-blue-600" },
                  { icon: FaTiktok, href: "https://tiktok.com/@dongphucunivi", label: "TikTok", bg: "bg-gray-900" },
                  { icon: FaYoutube, href: "https://youtube.com/@dongphucunivi", label: "Youtube", bg: "bg-red-600" },
                  { icon: FaLinkedinIn, href: "https://www.linkedin.com/company/univi-uniform", label: "LinkedIn", bg: "bg-sky-600" },
                ].map(({ icon: Icon, href, label, bg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} Đồng Phục Univi`}
                    title={`${label} Đồng Phục Univi`}
                    className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center text-white hover:opacity-80 hover:scale-105 transition-all duration-200`}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
