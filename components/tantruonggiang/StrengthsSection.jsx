import Image from "next/image";

export default function ServicesSection() {
  const services = [
    {
      imageSrc: "/images/chat-lieu-vai.webp",
      alt: "CHẤT LIỆU & CÔNG NGHỆ VẢI",
      title: "CHẤT LIỆU & CÔNG NGHỆ VẢI",
      description:
        "Đồng phục UNIVI tập trung phát triển các dòng vải thể thao chuyên dụng (Quick Dry, Super Cool, Blended) đáp ứng được nhiều bộ môn thể thao. Với công nghệ UNI DRY độc quyền, đảm bảo thoáng khí, thoát ẩm tốt, mềm mại, bền màu tạo sự khác biệt vượt trội.Đặc biệt tất cả dòng vải của Univi đều có kiểm định an toàn với da"
    },
    {
      imageSrc: "/images/quy-trinh-kep-kin.webp",
      alt: "Quy Trình Sản Xuất Khép Kín",
      title: "SẢN XUẤT KHÉP KÍN - TỐI ƯU CHI PHÍ",
      description:
        "Sở hữu xưởng sản xuất lớn với đội ngũ lành nghề, Đồng phục Univi kiểm soát chất lượng tất cả các quy trình. Không qua trung gian, tối ưu hóa giá thành giúp đối tác tiết kiệm 30- 40% chi phí."
    },
    {
      imageSrc: "/images/san-xuat-nhanh.webp",
      alt: "SẢN XUẤT NHANH",
      title: "SẢN XUẤT NHANH",
      description:
        "Univi sử hữu kho vải với trữ lượng vải lớn. Đồng thời luôn sẵn hàng trong trong kho 200+ mẫu thiết của nhiều bộ môn thể thao. Đáp ứng được nhu cầu của các đối tác cần gấp, đồng phục có thể giao ngay sau 3 ngày đặt hàng."
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-6 md:py-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-90">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="md:text-2xl text-xl  font-bold text-[#105d97] mb-4 leading-6 uppercase">
            Thế Mạnh Của Đồng Phục UNIVI
          </h2>
          <p className="text-gray-500 text-base md:text-base leading-6 max-w-6xl mx-auto">
            Đồng phục UNIVI chuyên cung cấp các giải pháp vải công nghệ cao và đồng phục thể thao chuyên nghiệp, ứng dụng quy trình sản xuất khép kín và công nghệ tiên tiến, mang đến sản phẩm chất lượng, bền vững và phù hợp với nhu cầu khách hàng.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {services.map((service, index) => (
            <div key={index} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-400/20">
              <div className="relative w-full h-56 md:h-64 mb-6 overflow-hidden rounded-xl">
                <Image
                  src={service.imageSrc}
                  alt={service.alt}
                  layout="fill"
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL="/images/placeholder.png"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => (e.currentTarget.src = "/images/fallback.png")}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Icon overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-2">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h3 className="text-base md:text-base font-bold text-[#105d97] mb-2 text-center group-hover:text-blue-400 transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-gray-500 text-sm md:text-base text-center leading-6">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}