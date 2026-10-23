// CTA:
// - href bắt đầu bằng "#" => anchor trong cùng trang (cuộn tới bộ lọc bộ sưu tập)
// - href là route thật (vd /dong-phuc-doanh-nghiep) => điều hướng trang
// - href = "contact" => mở modal tư vấn dùng chung (window "openContactModal")
export interface Solution {
  id: string;
  number: string;
  title: string;
  description: string;
  items: string[];
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
}

export const solutions: Solution[] = [
  {
    id: "phong-tap",
    number: "01",
    title: "Phòng tập & cộng đồng thể thao",
    description: "Đồng phục chuyên biệt cho từng bộ môn, đồng bộ từ HLV đến hội viên.",
    items: ["Gym", "Fitness", "Yoga", "Pickleball", "Running", "MMA"],
    image: "/images/gym/dong-phuc-huan-luyen-vien.jpg",
    imageAlt: "Đồng phục cho phòng tập và cộng đồng thể thao",
    ctaLabel: "Xem các bộ sưu tập →",
    ctaHref: "#bo-suu-tap-collections",
  },
  {
    id: "doanh-nghiep",
    number: "02",
    title: "Doanh nghiệp",
    description: "Đồng phục thể thao đồng bộ nhận diện thương hiệu cho hoạt động nội bộ.",
    items: ["Corporate", "Teambuilding", "Company Sport Club", "Sự kiện"],
    image: "/vest-cong-so/vest-nam-nu-dong-phuc-doanh-nghiep.jpg",
    imageAlt: "Đồng phục thể thao doanh nghiệp",
    ctaLabel: "Xem giải pháp doanh nghiệp →",
    ctaHref: "/dong-phuc-doanh-nghiep",
  },
  {
    id: "doi-nhom",
    number: "03",
    title: "Đội nhóm & câu lạc bộ",
    description: "Tư vấn thiết kế riêng cho đội, CLB thi đấu và giải phong trào.",
    items: ["Club", "Team", "Tournament", "Community"],
    image: "https://live.staticflickr.com/65535/55223495363_430b63f911_b.jpg",
    imageAlt: "Đồng phục cho đội nhóm và câu lạc bộ thể thao",
    ctaLabel: "Nhận tư vấn →",
    ctaHref: "contact",
  },
];
