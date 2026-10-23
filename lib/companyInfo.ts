/**
 * Single Source of Truth for Company NAP (Name, Address, Phone), Legal Identity, and Facilities.
 * All components, pages, and schema generators must reference this configuration.
 */

export const COMPANY_INFO = {
  name: "Đồng Phục Univi",
  legalName: "Công ty Cổ phần Tập đoàn Unicore Holdings",
  brandName: "Univi Uniform",
  taxCode: "0111401705",
  foundingYear: "2017",
  slogan: "YOUR UNIFORM, YOUR BRAND!",
  hotline: "0834.204.999",
  hotlineFormatted: "0834.204.999",
  hotlineTel: "tel:0834204999",
  salesPhone: "0961.567.997",
  salesPhoneFormatted: "0961.567.997",
  email: "dongphucunivi@gmail.com",
  emailMailto: "mailto:dongphucunivi@gmail.com",
  website: "https://dongphucunivi.com",

  // ── NAP (Name - Address - Phone) ───────────────────────────
  office: {
    label: "Văn phòng giao dịch",
    address: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội",
    shortAddress: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, Hà Nội",
    streetAddress: "Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông",
    addressLocality: "Hà Đông",
    addressRegion: "Hà Nội",
    postalCode: "100000",
    addressCountry: "VN",
    geo: {
      latitude: 20.9832437,
      longitude: 105.7788691,
    },
  },

  factory: {
    label: "Xưởng sản xuất",
    address: "Phường Chương Mỹ, Thành phố Hà Nội",
    shortAddress: "Phường Chương Mỹ, Hà Nội",
    streetAddress: "Phường Chương Mỹ",
    addressLocality: "Chương Mỹ",
    addressRegion: "Hà Nội",
    postalCode: "100000",
    addressCountry: "VN",
    area: "2.000m²",
    capacity: "100.000 sản phẩm/tháng",
  },

  workingHours: {
    weekdays: "Thứ 2 - Thứ 7: 8:00 - 18:00",
    weekend: "Chủ nhật: 8:00 - 18:00",
    allWeek: "08:00 - 18:00 (T2 - CN)",
    text: "08:00 - 18:00",
    days: "T2 - CN",
  },

  founder: {
    name: "Trần Hiền",
    jobTitle: "Đồng sáng lập & CEO",
    url: "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien",
    id: "https://dongphucunivi.com/dong-sang-lap-univi-sport-tran-hien#person",
  },

  social: {
    facebook: "https://facebook.com/Dongphucunivi",
    youtube: "https://youtube.com/@dongphucunivi",
    zalo: "https://zalo.me/0834204999",
    linkedin: "https://www.linkedin.com/company/univi-uniform",
    instagram: "https://instagram.com/dongphucunivi",
  },
};

export default COMPANY_INFO;
