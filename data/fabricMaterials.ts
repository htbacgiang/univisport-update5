export interface FabricMaterial {
  id: string;
  slug: string;
  code: string;
  name: string;
  badge: string;
  bgImage: string;
  mockups: string[];
  compositionText: string;
  composition: {
    percentage: string;
    name: string;
  }[];
  weight: string;
  leftTitle: string;
  featuresTitle: string;
  bullets: string[];
  applicationTitle: string;
  applicationText: string;
  recommendationTitle: string;
  recommendationText: string;
  rightTitle: string;
  rightDescription: string;
}

export const FABRIC_MATERIALS: FabricMaterial[] = [
  {
    id: "uniair",
    slug: "uni-air-unia12",
    code: "UNIA12",
    name: "UNI AIR - UNIA12",
    badge: "MỎNG • NHẸ • THOÁNG KHÍ",
    bgImage: "/mockup/uni-air.webp",
    mockups: [
      "/mockup/tshirt-mag28-gag28.jpg",
      "/mockup/tshirt-mag11-gag11.jpg",
      "/mockup/tshirt-mag29-gag29.jpg",
      "/mockup/polo-mag30.jpg",
      "/mockup/tshirt-mag25-gag25.jpg",
      "/mockup/tshirt-mablbl1-gabl1.jpg",
    ],
    compositionText: "90% POLYESTER / 10% ELASTANE",
    composition: [
      { percentage: "90%", name: "POLYESTER" },
      { percentage: "10%", name: "ELASTANE" },
    ],
    weight: "ĐỊNH LƯỢNG: 150 GAM",
    leftTitle: "CHẤT LIỆU UNI AIR - UNIA12",
    featuresTitle: "TÍNH NĂNG NỔI BẬT",
    bullets: [
      "Mỏng và nhẹ, giảm cảm giác nặng áo khi vận động.",
      "Cấu trúc lỗ thoáng khí giúp tăng khả năng lưu thông không khí.",
      "Thoát hơi ẩm và nhanh khô.",
      "Có độ co giãn, hỗ trợ chuyển động linh hoạt.",
      "Phù hợp với điều kiện thời tiết nóng hoặc các hoạt động ra nhiều mồ hôi.",
    ],
    applicationTitle: "ỨNG DỤNG",
    applicationText:
      "Đặc biệt phù hợp với: Running, Cầu lông, Gym, Cycling và các môn thể thao vận động liên tục",
    recommendationTitle: "GỢI Ý LỰA CHỌN",
    recommendationText:
      "Dành cho khách hàng đặt ưu tiên cao nhất vào mỏng – nhẹ – thoáng khí.",
    rightTitle: "MỘT SỐ MẪU THIẾT KẾ PHÙ HỢP VỚI DÒNG VẢI UNI AIR",
    rightDescription:
      "Dòng vải thể thao có cấu trúc lỗ thoáng khí, định lượng chỉ 150 GSM, tập trung tối ưu trọng lượng và khả năng lưu thông không khí.",
  },
  {
    id: "elite",
    slug: "uni-elite-unia11",
    code: "UNIA11",
    name: "UNI ELITE - UNIA11",
    badge: "NHẸ • NHANH KHÔ • THOÁNG KHÍ\nHỌA TIẾT SANG TRỌNG",
    bgImage: "/mockup/fabric-hoatiet-polo.webp",
    mockups: [
      "/mockup/polo-mpl9.jpg",
      "/mockup/polo-mpl10.jpg",
      "/mockup/polo-mpl6.jpg",
      "/mockup/polo-mpl7.jpg",
      "/mockup/polo-mag30.jpg",
      "/mockup/polo-mpl12.jpg",
    ],
    compositionText: "93% POLYESTER / 7% ELASTANE",
    composition: [
      { percentage: "93%", name: "POLYESTER" },
      { percentage: "7%", name: "ELASTANE" },
    ],
    weight: "ĐỊNH LƯỢNG: 170 GAM",
    leftTitle: "CHẤT LIỆU UNI ELITE - UNIA11",
    featuresTitle: "TÍNH NĂNG NỔI BẬT",
    bullets: [
      "Nhẹ, thoáng và nhanh khô, phù hợp với hoạt động thể thao.",
      "Cấu trúc bề mặt hỗ trợ lưu thông không khí.",
      "Có độ co giãn giúp vận động thoải mái.",
      "Họa tiết bề mặt sang trọng, tăng tính thời trang cho sản phẩm Polo.",
      "Phù hợp cả môi trường thể thao và đồng phục có yêu cầu cao về hình ảnh.",
    ],
    applicationTitle: "ỨNG DỤNG",
    applicationText:
      "Phù hợp với Polo Golf, Pickleball, HLV/PT, quản lý, nhân viên văn phòng, đồng phục doanh nghiệp và các hoạt động thể thao – sự kiện cao cấp.",
    recommendationTitle: "GỢI Ý LỰA CHỌN",
    recommendationText:
      "Dành cho khách hàng ưu tiên tính thẩm mỹ và sự khác biệt của bề mặt vải, nhưng vẫn cần những tính năng cơ bản của trang phục thể thao.",
    rightTitle: "MỘT SỐ MẪU THIẾT KẾ PHÙ HỢP VỚI DÒNG VẢI UNI ELITE",
    rightDescription:
      "Dòng vải Polo thể thao nổi bật với họa tiết dệt, bề mặt thời trang, tạo hiệu ứng thẩm mỹ cao hơn so với các dòng vải trơn thông thường.",
  },

  {
    id: "quickdry",
    slug: "uni-quickdry-unia01",
    code: "UNIA01",
    name: "UNI QUICKDRY - UNIA01",
    badge: "MỎNG • MỊN • CO GIÃN • NHANH KHÔ",
    bgImage: "/mockup/uni-quickdry.webp",
    mockups: [
      "/mockup/tshirt-mag28-gag28.jpg",
      "/mockup/tshirt-mag11-gag11.jpg",
      "/mockup/tshirt-mablbl1-gabl1.jpg",
      "/mockup/tshirt-mag7-gag7.jpg",
      "/mockup/tshirt-mag29-gag29.jpg",
      "/mockup/polo-mpl9.jpg",
    ],
    compositionText: "88% POLYESTER / 12% ELASTANE",
    composition: [
      { percentage: "88%", name: "POLYESTER" },
      { percentage: "12%", name: "ELASTANE" },
    ],
    weight: "ĐỊNH LƯỢNG: 180 GAM",
    leftTitle: "CHẤT LIỆU UNI QUICKDRY - UNIA01",
    featuresTitle: "TÍNH NĂNG NỔI BẬT",
    bullets: [
      "Nhanh khô, thoát ẩm tốt, hạn chế cảm giác bí và nặng áo khi vận động.",
      "Bề mặt mỏng, mịn và nhẹ, giảm cảm giác ma sát với da.",
      "Co giãn tốt, hỗ trợ các chuyển động liên tục và biên độ vận động lớn.",
      "Ít giữ nước hơn Cotton, phù hợp với các hoạt động ra nhiều mồ hôi.",
      "Dễ chăm sóc, nhanh khô sau khi giặt.",
    ],
    applicationTitle: "ỨNG DỤNG",
    applicationText:
      "Phù hợp với các trang phục vận động cường độ vừa đến cao như: Gym, Running, Trekking, Cycling, Kickfit, MMA, Cầu lông, Bóng bàn...",
    recommendationTitle: "GỢI Ý LỰA CHỌN",
    recommendationText:
      "Dòng vải đa dụng dành cho khách hàng ưu tiên nhẹ – nhanh khô – co giãn – dễ vận động.",
    rightTitle: "MỘT SỐ MẪU THIẾT KẾ PHÙ HỢP VỚI DÒNG VẢI UNI QUICKDRY",
    rightDescription:
      "Dòng vải thể thao được cấu tạo chủ yếu từ sợi Polyester kết hợp Elastane, tạo bề mặt mịn, trọng lượng nhẹ và khả năng co giãn tốt.",
  },
  {
    id: "supercool",
    slug: "uni-supercool-unia02",
    code: "UNIA02",
    name: "UNI SUPERCOOL - UNIA02",
    badge: "MỀM • MƯỢT • MÁT • MỊN • SIÊU CO GIÃN",
    bgImage: "/mockup/fabric-supercool-bg.webp",
    mockups: [
      "/mockup/tshirt-mag4-gag4.jpg",
      "/mockup/tshirt-mag11-gag11.jpg",
      "/mockup/tshirt-mag3-gag3.jpg",
      "/mockup/tshirt-mag23-gag23.png",
      "/mockup/tshirt-mag29-gag29.jpg",
      "/mockup/tshirt-mag2-gag2.png",
    ],
    compositionText: "89% POLYAMIDE / 11% ELASTANE",
    composition: [
      { percentage: "89%", name: "POLYAMIDE" },
      { percentage: "11%", name: "ELASTANE" },
    ],
    weight: "ĐỊNH LƯỢNG: 180 GAM",
    leftTitle: "CHẤT LIỆU UNI SUPERCOOL - UNIA02",
    featuresTitle: "TÍNH NĂNG NỔI BẬT",
    bullets: [
      "Cảm giác mềm, mượt và mát khi mặc.",
      "Co giãn cao, linh hoạt theo chuyển động cơ thể.",
      "Bề mặt mịn, mang lại cảm giác dễ chịu khi mặc trong thời gian dài.",
      "Thoát ẩm và nhanh khô, phù hợp với môi trường vận động thường xuyên.",
      "Form trang phục có độ rủ kết hợp độ mướt của vải cảm giác cao cấp hơn các dòng Polyester thể thao cơ bản.",
    ],
    applicationTitle: "ỨNG DỤNG",
    applicationText:
      "Phù hợp với: Gym, Yoga, Pilates, Trekking, Cycling, Dance, Swimming, Golf... và các trang phục dành cho HLV/PT",
    recommendationTitle: "GỢI Ý LỰA CHỌN",
    recommendationText:
      "Phù hợp với khách hàng ưu tiên cảm giác mặc cao cấp, mềm mát và độ co giãn lớn",
    rightTitle: "MỘT SỐ MẪU THIẾT KẾ PHÙ HỢP VỚI DÒNG VẢI UNI SUPERCOOL",
    rightDescription:
      "Sử dụng Polyamide kết hợp Elastane, tạo nên bề mặt mềm mượt, mịn và cảm giác mát dễ chịu khi tiếp xúc với da",
  },

  {
    id: "cool-pique",
    slug: "uni-cool-pique-unia114",
    code: "UNIA114",
    name: "UNI COOL PIQUÉ - UNIA114",
    badge: "PIQUÉ CAO CẤP\nSIÊU NHẸ • SIÊU MỀM • SIÊU MỊN • MÁT LẠNH",
    bgImage: "/mockup/uni-pique.webp",
    mockups: [
      "/mockup/polo-mpl9.jpg",
      "/mockup/polo-mpl10.jpg",
      "/mockup/polo-mpl6.jpg",
      "/mockup/polo-mpl7.jpg",
      "/mockup/polo-mag30.jpg",
      "/mockup/polo-mpl12.jpg",
    ],
    compositionText: "86% POLYAMIDE / 14% ELASTANE",
    composition: [
      { percentage: "86%", name: "POLYAMIDE" },
      { percentage: "14%", name: "ELASTANE" },
    ],
    weight: "ĐỊNH LƯỢNG: 175 GAM",
    leftTitle: "CHẤT LIỆU UNI COOL PIQUÉ - UNIA114",
    featuresTitle: "TÍNH NĂNG NỔI BẬT",
    bullets: [
      "Bề mặt Piqué tạo vẻ chỉn chu, hiện đại và cao cấp.",
      "Mềm, mịn, nhẹ và mát khi tiếp xúc với da.",
      "Hàm lượng Elastane 14% mang lại độ co giãn cao, thoải mái khi vận động.",
      "Thoát ẩm tốt, phù hợp sử dụng trong thời gian dài.",
      "Cân bằng giữa tính thể thao và tính lịch sự, dễ ứng dụng trong môi trường công việc.",
    ],
    applicationTitle: "ỨNG DỤNG",
    applicationText:
      "Phù hợp làm Polo cho HLV/PT, quản lý, nhân viên văn phòng, đồng phục doanh nghiệp cao cấp và trang phục chơi Golf, Pickleball, Running...",
    recommendationTitle: "GỢI Ý LỰA CHỌN",
    recommendationText:
      "Dành cho khách hàng muốn một chiếc Polo vừa sang – lịch sự, vừa có cảm giác mềm mát và co giãn của đồ thể thao.",
    rightTitle: "MỘT SỐ MẪU THIẾT KẾ PHÙ HỢP VỚI DÒNG VẢI UNI COOL PIQUÉ",
    rightDescription:
      "Dòng vải Piqué (cá sấu) thể thao cao cấp sử dụng tỷ lệ Polyamide và Elastane cao, kết hợp vẻ ngoài lịch sự của Polo với cảm giác mềm mát của trang phục thể thao.",
  },
];

export const FABRIC_FAQS = [
  {
    question: "Sự khác biệt giữa chất liệu Polyamide và Polyester trong đồ thể thao là gì?",
    answer:
      "Vải Polyamide (như UNI SUPERCOOL và UNI COOL PIQUÉ) có đặc tính mềm mượt, mát lạnh khi chạm vào và có độ rủ sang trọng, rất phù hợp cho đồ Yoga, Pilates, Golf và Polo cao cấp. Trong khi đó, Polyester (như UNI QUICKDRY, UNI AIR, UNI ELITE) nổi bật với độ bền cơ học cao, thoát ẩm nhanh và chống co rút, cực kỳ lý tưởng cho các môn thể thao vận động cường độ cao như Running, Gym, Kickfit.",
  },
  {
    question: "Định lượng GSM của vải có ý nghĩa gì khi may đồng phục thể thao?",
    answer:
      "GSM (Grams per Square Meter) là trọng lượng tính bằng gam trên mỗi mét vuông vải. Định lượng 150 GSM (UNI AIR) mang lại cảm giác siêu mỏng nhẹ, tối ưu cho chạy bộ ngoài trời nắng nóng. Định lượng 170-180 GSM (UNI QUICKDRY, SUPERCOOL, COOL PIQUÉ, ELITE) mang lại sự cân bằng hoàn hảo giữa độ bền, độ đứng form và sự thoáng mát khi mặc cả ngày.",
  },
  {
    question: "Làm thế nào để nhận mẫu vải tận nơi trước khi đặt may đồng phục?",
    answer:
      "Univi cung cấp dịch vụ gửi tập mẫu vải và bảng màu thực tế tận nơi hoàn toàn MIỄN PHÍ cho các phòng Gym, doanh nghiệp và đội nhóm. Bạn chỉ cần nhấn nút 'Nhận mẫu vải' hoặc liên hệ hotline 0834.204.999 để chuyên viên tư vấn hỗ trợ gửi mẫu trong 24h.",
  },
  {
    question: "Vải Univi có bị xù lông hoặc phai màu sau nhiều lần giặt không?",
    answer:
      "Toàn bộ vải của Univi đều trải qua quy trình dệt nhuộm công nghệ cao và kiểm định độ bền màu đạt chuẩn QCVN 01:2017/BCT. Vải giữ form tốt, không xù lông và giữ màu sắc tươi mới sau hơn 200 lần giặt tiêu chuẩn.",
  },
];
