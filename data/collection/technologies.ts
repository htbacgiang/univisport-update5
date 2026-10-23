// Dữ liệu công nghệ vải thật — cùng nội dung/ảnh đang dùng ở
// components/univisport/FabricCardComponent.jsx. Giữ độc lập tại đây để trang
// /bo-suu-tap không phụ thuộc vào component đó.
export interface Technology {
  id: string;
  title: string;
  description: string;
  image: string;
}

export const technologies: Technology[] = [
  {
    id: "quick-dry",
    title: "UNIVI QUICK DRY",
    description:
      "Thành phần chính là sợi Polyester cao cấp PET (82-100%), co giãn đa chiều, nhẹ, nhanh khô, chống tia UV,... Thích hợp cho các bộ môn Gym, Fitness, MMA, Running, Pickleball, Tennis,...",
    image: "/images/uni-quickdry.webp",
  },
  {
    id: "super-cool",
    title: "UNIVI SUPER COOL",
    description:
      "Thành phần chính là sợi Polyamide (76-90%), dòng vải thể thao cao cấp nhất trên thị trường. Với đặc tính mềm, mát, mịn, co giãn tốt, chống nhăn, bền form,... Thích hợp cho các bộ môn Yoga, Pilates, Dance, Aerobic,...",
    image: "/images/uni-supper-cool.webp",
  },
  {
    id: "blended",
    title: "UNIVI BLENDED",
    description:
      "Là sự kết hợp của Polyester và Cotton. Nhanh khô, mềm mịn, mát, nhẹ, chống tia UV cao hơn, chống nhăn nhàu và rất bền màu. Ứng dụng cho các bộ môn Pickleball, Running, Cycling,...",
    image: "/images/uni-blended.webp",
  },
];
