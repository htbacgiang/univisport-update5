// Ảnh thật lấy từ public/images/** — không dùng ảnh ngoài internet.
// size điều khiển độ lớn ô trong lưới lookbook (xem EditorialLookbook.tsx):
//   md   = 1 cột x 1 hàng (được ghép cặp 2 ô md thành 1 cột x 2 hàng)
//   tall = 1 cột x 2 hàng
//   lg   = 2 cột x 2 hàng
export type LookbookSize = "md" | "tall" | "lg";

export interface LookbookItem {
  id: string;
  image: string;
  alt: string;
  filterIds: string[];
  size: LookbookSize;
}

export const lookbookItems: LookbookItem[] = [
  // ── Khối 1: Gym Hero (lg) & Pickleball (tall) & Yoga (md pair) ── (4 cột)
  {
    id: "gym-group",
    image: "/bo-suu-tap/gym-1.jpg",
    alt: "Đồng phục Gym Univi cho nhóm 7 người tại phòng tập",
    filterIds: ["gym"],
    size: "lg",
  },
  {
    id: "pickleball-court",
    image: "/images/pickleball/dong-phuc-pickleball-univi-unipick-san-dau.jpg",
    alt: "Đồng phục Pickleball UniPick trên sân đấu",
    filterIds: ["pickleball"],
    size: "tall",
  },
  {
    id: "yoga-1",
    image: "/bo-suu-tap/yoga-1.jpg",
    alt: "Đồng phục Yoga Univi",
    filterIds: ["yoga-pilates"],
    size: "md",
  },
  {
    id: "yoga-3",
    image: "/bo-suu-tap/yoga-3.jpg",
    alt: "Đồng phục Yoga Univi mềm mại",
    filterIds: ["yoga-pilates"],
    size: "md",
  },

  // ── Khối 2: Gym Hero (lg) & MMA (tall) & Chạy bộ (md pair) ── (4 cột)
  {
    id: "gym-hero-2",
    image: "/images/gym/dong-phuc-gym-univi-nhom-7-nguoi-trang-den.jpg",
    alt: "Đồng phục Gym Univi nhóm hội viên phòng tập",
    filterIds: ["gym"],
    size: "lg",
  },
  {
    id: "mma-1",
    image: "/images/mma/mma-1.jpg",
    alt: "Đồng phục MMA Univi",
    filterIds: ["mma"],
    size: "tall",
  },
  {
    id: "chay-bo-1",
    image: "/images/chay-bo/chay-bo-1.webp",
    alt: "Đồng phục chạy bộ Univi",
    filterIds: ["chay-bo"],
    size: "md",
  },
  {
    id: "chay-bo-3",
    image: "/images/chay-bo/dong-phuc-chay-bo.webp",
    alt: "Đồng phục chạy bộ Univi cho giải chạy",
    filterIds: ["chay-bo"],
    size: "md",
  },

  // ── Khối 3: Golf & Tennis Hero (lg) & Gym (tall) & Pickleball (md pair) ── (4 cột)
  {
    id: "golf-tennis-1",
    image: "/product/goft-tennis.jpg",
    alt: "Đồng phục Golf - Tennis Univi",
    filterIds: ["golf-tennis"],
    size: "lg",
  },
  {
    id: "gym-nu",
    image: "/bo-suu-tap/gym-3.jpg",
    alt: "Đồng phục Gym nữ Univi",
    filterIds: ["gym"],
    size: "tall",
  },
  {
    id: "pickleball-flatlay",
    image: "/images/pickleball/flatlay-dong-phuc-pickleball-unipick-univi-phu-kien.jpg",
    alt: "Bộ đồng phục Pickleball UniPick và phụ kiện",
    filterIds: ["pickleball"],
    size: "md",
  },
  {
    id: "pickleball-2",
    image: "/images/pickleball/495125235_997411335859265_454063822667576892_n.jpg",
    alt: "Đồng phục Pickleball Univi trên sân đấu",
    filterIds: ["pickleball"],
    size: "md",
  },

  // ── Khối 4: Yoga (tall) & Chạy bộ (tall) & Gym (md pair) & MMA (md pair) ── (4 cột)
  {
    id: "yoga-4",
    image: "/bo-suu-tap/yoga-2.jpg",
    alt: "Đồng phục Yoga Univi",
    filterIds: ["yoga-pilates"],
    size: "tall",
  },
  {
    id: "chay-bo-2",
    image: "/images/chay-bo/chay-bo-2.webp",
    alt: "Đồng phục chạy bộ Univi phối màu",
    filterIds: ["chay-bo"],
    size: "tall",
  },
  {
    id: "gym-pt",
    image: "/bo-suu-tap/gym-2.jpg",
    alt: "Đồng phục huấn luyện viên PT Gym Univi",
    filterIds: ["gym"],
    size: "md",
  },
  {
    id: "gym-hlv",
    image: "/images/gym/dong-phuc-hlv.jpg",
    alt: "Đồng phục huấn luyện viên Gym Univi",
    filterIds: ["gym"],
    size: "md",
  },
  {
    id: "mma-3",
    image: "/images/mma/mma-3.jpg",
    alt: "Đồng phục thi đấu MMA Univi",
    filterIds: ["mma"],
    size: "md",
  },
  {
    id: "mma-4",
    image: "/images/mma/mma-4.jpg",
    alt: "Đồng phục thi đấu MMA Univi phối màu",
    filterIds: ["mma"],
    size: "md",
  },

  // ── Khối 5: Chạy bộ (tall) & Gym Quản lý (tall) & Pickleball (tall) & Gym Shorts (tall) ── (4 cột)
  {
    id: "chay-bo-long",
    image: "/images/chay-bo/dong-phuc-chay-bo.webp",
    alt: "Đồng phục chạy bộ Univi",
    filterIds: ["chay-bo"],
    size: "tall",
  },
  {
    id: "gym-quan-ly",
    image: "/bo-suu-tap/gym-4.jpg",
    alt: "Đồng phục quản lý phòng Gym Univi",
    filterIds: ["gym"],
    size: "tall",
  },
  {
    id: "pickleball-vay",
    image: "/images/pickleball/chan-vay-pickleball-thoi-trang-unipick-univi-nu.jpg",
    alt: "Chân váy Pickleball UniPick thời trang cho nữ",
    filterIds: ["pickleball"],
    size: "tall",
  },
  {
    id: "gym-nam-short",
    image: "/images/gym/dong-phuc-gym-univi-nam-trang-den-quan-short.jpg",
    alt: "Đồng phục Gym nam Univi phối quần short",
    filterIds: ["gym"],
    size: "tall",
  },

  // ── Khối 6: MMA (tall) & Chạy bộ (tall) & Gym PT (md pair) & Pickleball (md pair) ── (4 cột)
  {
    id: "mma-2",
    image: "/images/mma/mma-2.jpg",
    alt: "Đồng phục tập luyện MMA Univi",
    filterIds: ["mma"],
    size: "tall",
  },
  {
    id: "chay-bo-hero",
    image: "/images/chay-bo.jpg",
    alt: "Đồng phục chạy bộ chuyên nghiệp Univi",
    filterIds: ["chay-bo"],
    size: "tall",
  },
  {
    id: "gym-pt-polo",
    image: "/images/gym/dong-phuc-pt-ao-polo.jpg",
    alt: "Đồng phục Polo huấn luyện viên PT Univi",
    filterIds: ["gym"],
    size: "md",
  },
  {
    id: "gym-le-tan",
    image: "/images/gym/dong-phuc-le-tan.jpg",
    alt: "Đồng phục lễ tân phòng Gym Univi",
    filterIds: ["gym"],
    size: "md",
  },
  {
    id: "pickleball-3",
    image: "/images/pickleball/496128882_1006485851618480_3323595448747649678_n.jpg",
    alt: "Đồng phục Pickleball UniPick đồng đội",
    filterIds: ["pickleball"],
    size: "md",
  },
  {
    id: "pickleball-cert",
    image: "/images/pickleball/giay-chung-nhan-kiem-dinh-chat-luong-vai-the-thao-vntest.jpg.jpg",
    alt: "Giấy chứng nhận kiểm định chất lượng vải Pickleball VNTest",
    filterIds: ["pickleball"],
    size: "md",
  },

  // ── Khối 7: Golf Tennis (tall) & MMA (md pair) & Yoga (md pair) & Chạy bộ (md pair) ── (4 cột)
  {
    id: "golf-tennis-2",
    image: "/images/banner-ao-polo-the-thao.jpg",
    alt: "Polo thể thao cao cấp Golf - Tennis Univi",
    filterIds: ["golf-tennis"],
    size: "tall",
  },
  {
    id: "golf-tennis-3",
    image: "/images/dong-phuc-ao-polo.jpg",
    alt: "Áo Polo thể thao đồng phục Univi",
    filterIds: ["golf-tennis"],
    size: "md",
  },
  {
    id: "golf-tennis-4",
    image: "/images/chat-lieu-vai.jpg",
    alt: "Chất liệu vải may đồng phục thể thao Golf Tennis",
    filterIds: ["golf-tennis"],
    size: "md",
  },
  {
    id: "mma-5",
    image: "/images/gym/univi-dong-hanh-cung-the-one-kickfit-3.jpg",
    alt: "Đồng phục The One Kickfit - MMA Univi",
    filterIds: ["mma"],
    size: "md",
  },
  {
    id: "mma-6",
    image: "/images/banner-ao-gym.jpg",
    alt: "Đồng phục thi đấu thể thao võ thuật Univi",
    filterIds: ["mma"],
    size: "md",
  },
  {
    id: "yoga-5",
    image: "/images/yoga-5.webp",
    alt: "Bộ đồng phục Yoga cao cấp Univi",
    filterIds: ["yoga-pilates"],
    size: "md",
  },

  // ── Khối 8: Yoga (md) & Gym (md pair) & Doanh nghiệp (md pair) ── (4 cột)
  {
    id: "yoga-fabric",
    image: "/images/vai-yoga.jpg",
    alt: "Vải may đồng phục Yoga thấm hút mồ hôi",
    filterIds: ["yoga-pilates"],
    size: "md",
  },
  {
    id: "chay-bo-4",
    image: "/images/banner-1.jpg",
    alt: "Áo chạy bộ phong trào đồng đội Univi",
    filterIds: ["chay-bo"],
    size: "md",
  },
  {
    id: "chay-bo-5",
    image: "/images/banner-3.jpg",
    alt: "Đồng phục marathon & giải chạy Univi",
    filterIds: ["chay-bo"],
    size: "md",
  },
  {
    id: "gym-member",
    image: "/images/gym/dong-phuc-gym-univi-nhom-5-nguoi-phong-gym.jpg",
    alt: "Đồng phục nhóm hội viên phòng Gym Univi",
    filterIds: ["gym"],
    size: "md",
  },
  {
    id: "gym-cert",
    image: "/images/gym/dong-phuc-gym-univi-kiem-dinh-chat-lieu-vai.jpg",
    alt: "Kiểm định chất liệu vải đồng phục Gym Univi",
    filterIds: ["gym"],
    size: "md",
  },

];
