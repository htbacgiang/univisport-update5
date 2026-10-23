import { useState, useMemo } from "react";

export default function AboutNavigation() {
  const [activeItem, setActiveItem] = useState("2017: Thành Lập");

  const menuItems = useMemo(
    () => [
      {
        title: "2017: Thành Lập",
        description:
          "Đồng Phục Univi chính thức được thành lập tại Hà Đông, Hà Nội, với xưởng sản xuất đầu tiên đặt tại Sóc Sơn. Giai đoạn đầu, Univi tập trung vào thiết kế và sản xuất các dòng đồng phục cho doanh nghiệp, công ty, đồng phục công sở như áo sơ mi, áo polo, đồng phục teambuilding cho các doanh nghiệp vừa và nhỏ. Công ty TNHH Bảo Phong Evenes – tiền thân của Univi, được thành lập vào tháng 7/2017, đánh dấu bước đi đầu tiên trên hành trình xây dựng thương hiệu.",
      },
      {
        title: "2017-2019: Khởi Đầu",
        description:
          "Trong những năm đầu, Univi hoạt động với quy mô nhỏ, cơ sở vật chất còn hạn chế và chưa có nhiều tiếng vang trên thị trường. Tuy nhiên, bằng tinh thần khởi nghiệp mãnh liệt và đam mê không ngừng nghỉ của đội ngũ sáng lập trẻ tuổi, Univi từng bước khẳng định sự hiện diện của mình trong ngành đồng phục.",
      },
      {
        title: "2020-2021: Khẳng Định Thương Hiệu",
        description:
          "Univi bắt đầu gặt hái thành công, trở thành một trong những đơn vị uy tín trong lĩnh vực đồng phục doanh nghiệp và sự kiện. Nhờ tích lũy kinh nghiệm thực tế, kết hợp cùng khả năng tổ chức đội ngũ và mở rộng hệ thống, các sản phẩm đồng phục mang thương hiệu Univi đã có mặt tại hầu hết các tỉnh thành trên cả nước.",
      },
      {
        title: "2021-2022: Vượt Đại Dịch",
        description:
          "Đại dịch Covid-19 mang đến thách thức chưa từng có. Tuy nhiên, bằng sự lãnh đạo quyết liệt và tinh thần đoàn kết, Univi không chỉ đứng vững mà còn lan tỏa hình ảnh của một doanh nghiệp gắn bó, nhân văn và bản lĩnh. Trong giai đoạn này, công ty mở rộng quy mô sản xuất với xưởng mới tại Hải Dương, bổ sung nguồn lực để chuẩn bị cho những bước đi tiếp theo.",
      },
      {
        title: "2023-2025: Chuyển Hướng Thể Thao",
        description:
          "Từ nền tảng là một đội ngũ đam mê nghiên cứu chuyên sâu về chất liệu, Univi nhận thấy thị trường Đồng Phục Thể Thao tại Việt Nam hiện nay chưa thực sự chú trọng vào yếu tố chất liệu, hiệu suất tập luyện và bảo vệ sức khỏe người mặc. Qua quá trình khảo sát thực tế với vận động viên và người tập luyện phổ thông, Univi phát hiện một vấn đề phổ biến của đại đa số những người thường xuyên luyện tập thể thao đó chính là tỷ lệ chấn thương cơ, khớp làm cản trở hiệu suất tập luyện và sức khỏe tổng thể. Với sứ mệnh đồng hành cùng các đội nhóm, chuỗi phòng tập và doanh nghiệp tổ chức hoạt động thể thao, Univi quyết định tái định hướng chiến lược, đầu tư nguồn lực vào nghiên cứu, thiết kế và sản xuất Đồng phục Thể thao chuyên sâu, lấy hiệu suất, sự thoải mái và sức khỏe người tập làm trung tâm.",
      },
      {
        title: "2026: Bước Ngoặt Lớn",
        description:
          "Từ tháng 3 năm 2026, Univi chính thức chuyển đổi mô hình doanh nghiệp thành CÔNG TY CỔ PHẦN TẬP ĐOÀN UNICORE HOLDINGS. Đây là bước đi chiến lược nhằm chuẩn hóa bộ máy quản trị, nâng tầm thương hiệu và mở rộng hệ sinh thái sản phẩm, dịch vụ. Sự thay đổi này không chỉ khẳng định tầm vóc của doanh nghiệp mà còn là lời cam kết mạnh mẽ trong việc mang đến những giá trị đột phá cho khách hàng và cộng đồng thể thao.",
      },
    ],
    []
  );

  return (
    <section className="">
      <div className="container mx-auto md:mt-10 mt-4 ">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-12">
          <h3 className="md:text-2xl text-xl font-medium tracking-tight leading-6 text-gray-900 uppercase mb-4">
            Timeline phát triển
          </h3>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ backgroundColor: '#105d97' }} />
        </div>

        {/* Timeline Navigation */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <nav
            role="navigation"
            aria-label="Company Timeline"
            className="divide-y divide-gray-100"
          >
            {menuItems.map((item, index) => (
              <button
                key={item.title}
                onClick={() => setActiveItem(item.title)}
                aria-current={activeItem === item.title ? "true" : "false"}
                aria-label={`View details for ${item.title}`}
                className={`w-full text-left cursor-pointer p-6 md:p-8 transition-all duration-300 relative group ${activeItem === item.title
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50"
                  : "hover:bg-gray-50"
                  }`}
                style={{
                  ...(activeItem === item.title && {
                    borderLeft: `6px solid #105d97`
                  })
                }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-3">
                  <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${activeItem === item.title ? 'scale-125' : 'scale-100'
                    }`} style={{
                      backgroundColor: activeItem === item.title ? '#105d97' : '#e5e7eb'
                    }} />
                </div>

                <div className="md:ml-6 ml-2">
                  <h3 className={`text-lg md:text-xl font-medium mb-3 transition-colors duration-300 ${activeItem === item.title ? 'text-gray-900' : 'text-gray-700'
                    }`} style={{
                      ...(activeItem === item.title && { color: '#105d97' })
                    }}>
                    {item.title}
                  </h3>

                  <div className={`overflow-hidden transition-all duration-500 ${activeItem === item.title ? 'max-h-96 opacity-100' : 'max-h-16 opacity-70'
                    }`}>
                    <p className="text-gray-700 leading-6 text-sm md:text-base">
                      {activeItem === item.title
                        ? item.description
                        : `${item.description.substring(0, 120)}...`
                      }
                    </p>
                  </div>

                  {activeItem !== item.title && (
                    <div className="mt-2">
                      <span className="inline-flex items-center text-sm font-medium" style={{ color: '#105d97' }}>
                        Xem thêm
                        <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}