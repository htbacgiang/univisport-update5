export type CollectionVariant = "image-left" | "image-right" | "full-bleed";

export interface CollectionEntry {
  id: string;
  number: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  variant: CollectionVariant;
}

export const collectionEntries: CollectionEntry[] = [
  {
    id: "gym",
    number: "01",
    title: "Gym & Fitness",
    description:
      "Đồng phục dành cho phòng tập, PT, huấn luyện viên và cộng đồng Gym, Fitness - co giãn đa chiều, thoáng khí, giữ form sau nhiều lần giặt.",
    image: "https://live.staticflickr.com/65535/55265366801_2bfa268363_b.jpg",
    imageAlt: "Đồng phục Gym & Fitness Univi",
    ctaLabel: "Khám phá bộ sưu tập →",
    ctaHref: "/dong-phuc-gym",
    variant: "image-left",
  },
  {
    id: "pickleball",
    number: "02",
    title: "Pickleball",
    description:
      "Bộ sưu tập UniPick cho các CLB và giải đấu Pickleball - vải nhẹ, khô nhanh, phối màu hiện đại, tối ưu cho vận động cường độ cao.",
    image: "https://live.staticflickr.com/65535/55272886848_9028959f77_b.jpg",
    imageAlt: "Đồng phục Pickleball UniPick Univi",
    ctaLabel: "Khám phá bộ sưu tập →",
    ctaHref: "/dong-phuc-pickleball",
    variant: "image-right",
  },
  {
    id: "yoga-pilates",
    number: "03",
    title: "Yoga & Pilates",
    description:
      "Thiết kế mềm mại, co giãn 4 chiều cho các bộ môn Yoga, Pilates - đồng hành cùng phòng tập và cộng đồng wellness.",
    image: "https://live.staticflickr.com/65535/55234415043_453cb017c2_b.jpg",
    imageAlt: "Đồng phục Yoga & Pilates Univi",
    ctaLabel: "Khám phá bộ sưu tập →",
    ctaHref: "/dong-phuc-yoga-pilates",
    variant: "full-bleed",
  },
  {
    id: "chay-bo",
    number: "04",
    title: "Chạy bộ",
    description:
      "Đồng phục cho giải chạy, CLB Running - trọng lượng nhẹ, thoát ẩm nhanh, phản quang tuỳ chọn cho các cự ly dài.",
    image: "/images/chay-bo/chay-bo-2.webp",
    imageAlt: "Đồng phục chạy bộ Univi",
    ctaLabel: "Khám phá bộ sưu tập →",
    ctaHref: "/dong-phuc-chay-bo",
    variant: "image-left",
  },
  {
    id: "mma",
    number: "05",
    title: "MMA",
    description:
      "Đồng phục thi đấu và tập luyện MMA - chất liệu bền, co giãn tối đa theo biên độ chuyển động, chịu lực tốt.",
    image: "https://live.staticflickr.com/65535/55225839956_d472d7b3bc_b.jpg",
    imageAlt: "Đồng phục MMA Univi",
    ctaLabel: "Khám phá bộ sưu tập →",
    ctaHref: "/dong-phuc-mma",
    variant: "image-right",
  },
];
