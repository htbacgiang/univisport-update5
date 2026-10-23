import Link from "next/link";
import Image from "next/image";
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaFacebook,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import { COMPANY_INFO } from "../../lib/companyInfo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Về Đồng phục Univi", href: "/gioi-thieu" },
      { name: "Founder UniviSport", href: "/dong-sang-lap-univi-sport-tran-hien" },
      { name: "Hồ sơ năng lực", href: "/ho-so-nang-luc" },
      { name: "Tuyển dụng", href: "/tuyen-dung" },
      { name: "Liên hệ", href: "/lien-he" },
      { name: "Blog", href: "/bai-viet" },


    ],
    products: [
      { name: "Đồng phục Gym", href: "/dong-phuc-gym" },
      { name: "Đồng phục Pickleball", href: "/dong-phuc-pickleball" },
      { name: "Đồng phục Golf - Tennis", href: "/dong-phuc-golf-tennis" },
      { name: "Đồng phục Yoga", href: "/dong-phuc-yoga-pilates" },
      { name: "Đồng phục Pilates", href: "/dong-phuc-pilates" },
      { name: "Đồng phục áo gió", href: "/dong-phuc-ao-gio" },
    ],
    enterprise: [
      { name: "Đồng phục áo sơ mi", href: "/dong-phuc-so-mi" },
      { name: "Vest công sở", href: "/dong-phuc-vest-cong-so" },
      { name: "Polo doanh nghiệp", href: "/dong-phuc-polo" },
      { name: "Bảo hộ lao động", href: "/bao-ho-lao-dong" },
      { name: "Teambuilding", href: "/dong-phuc-teambuilding" },
      { name: "Phụ kiện và quà tặng", href: "/phu-kien-qua-tang-doanh-nghiep" },

    ],
  };

  const socialLinks = [
    {
      name: "Facebook Đồng Phục Univi",
      icon: FaFacebook,
      href: "https://web.facebook.com/Dongphucunivi",
    },
    {
      name: "Kênh Youtube Đồng Phục Univi",
      icon: FaYoutube,
      href: "https://www.youtube.com/@dongphucunivi",
    },
    {
      name: "LinkedIn Đồng Phục Univi",
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/univi-uniform",
    },
    {
      name: "TikTok Đồng Phục Univi",
      icon: FaTiktok,
      href: "https://www.tiktok.com/@dongphucthethao.univi",
    },
  ];

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-500 rounded-full blur-3xl"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-white/35 rounded-full animate-pulse delay-3000"></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2.4fr_0.8fr] gap-6">
              {/* Company Info */}
              <div>
                <div className="mb-6 group">
                  <Link href="/" className="inline-block">
                    <div className="flex items-center group-hover:scale-105 transition-transform duration-300">
                      <Image
                        src="/logo-univi.png"
                        alt="Đồng phục Univi"
                        width={140}
                        height={42}
                        className="h-12 w-auto object-contain"
                        priority
                      />
                    </div>
                  </Link>
                </div>

                <p className="text-gray-300 leading-6 mb-6">
                  Thương hiệu đồng phục thể thao chuyên nghiệp, chất lượng cao với thiết
                  kế hiện đại và sang trọng.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {/* Company */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-white">Giới thiệu</p>
                    <ul className="space-y-3">
                      {footerLinks.company.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Products */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-white">
                      Đồng phục thể thao
                    </p>
                    <ul className="space-y-3">
                      {footerLinks.products.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Enterprise */}
                  <div>
                    <p className="text-lg font-bold mb-6 text-white">
                      Đồng phục doanh nghiệp
                    </p>
                    <ul className="space-y-3">
                      {footerLinks.enterprise.map((link, index) => (
                        <li key={index}>
                          <Link
                            href={link.href}
                            className="text-gray-300 hover:text-gray-100 transition-colors duration-300"
                          >
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <p className="text-lg font-bold mb-6 text-white">Liên hệ</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase">{COMPANY_INFO.office.label}</p>
                      <p className="text-gray-300">{COMPANY_INFO.office.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-gray-400 flex-shrink-0" />
                    <a
                      href={COMPANY_INFO.hotlineTel}
                      className="text-gray-300 hover:text-gray-100 transition-colors"
                    >
                      {COMPANY_INFO.hotlineFormatted}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaEnvelope className="text-gray-400 flex-shrink-0" />
                    <a
                      href={COMPANY_INFO.emailMailto}
                      className="text-gray-300 hover:text-gray-100 transition-colors"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaClock className="text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">
                        {COMPANY_INFO.workingHours.text}
                        <br />
                        {COMPANY_INFO.workingHours.days}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <p className="font-bold mb-4 text-white">Kết nối với chúng tôi</p>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => {
                      const Icon = social.icon;
                      return (
                        <a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.name}
                          title={social.name}
                          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 hover:transform hover:scale-110 hover:shadow-lg group"
                        >
                          <Icon
                            className="text-white group-hover:text-gray-100 transition-colors duration-300"
                            aria-hidden="true"
                          />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-8">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <p className="text-gray-400 text-sm md:text-base">
                  © {currentYear} Đồng phục Univi. Tất cả quyền được bảo lưu.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-gray-400 hover:text-gray-100 transition-colors text-sm"
                >
                  Chính sách bảo mật
                </Link>
                <Link
                  href="/chinh-sach-bao-hanh"
                  className="text-gray-400 hover:text-gray-100 transition-colors text-sm"
                >
                  Chính sách bảo hành
                </Link>
                <Link
                  href="/sitemap.xml"
                  className="text-gray-400 hover:text-gray-100 transition-colors text-sm"
                >
                  Sơ đồ trang web
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Company Brand Statement */}
        <div className="border-t border-gray-800 py-4 bg-gray-950">
          <div className="container mx-auto px-6">
            <div className="text-center space-y-1">
              <p className="text-gray-500 text-sm">
                Đồng phục Univi một thương hiệu Thuộc hệ sinh thái Đồng Phục Univi
              </p>
              <p className="text-gray-500 text-sm">
                CÔNG TY CỔ PHẦN TẬP ĐOÀN UNICORE HOLDINGS | MST: 0111401705
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
