/**
 * Cấu hình chiến dịch Popup Chúc mừng ngày Phụ nữ Việt Nam 20/10 - Đồng Phục Univi
 */

export interface CampaignConfig {
  /** Bật hoặc tắt toàn bộ chiến dịch */
  enabled: boolean;
  /** Bỏ qua kiểm tra ngày bắt đầu/kết thúc khi muốn kiểm thử nhanh */
  ignoreDateRange: boolean;
  /** Thời gian bắt đầu chiến dịch theo chuẩn ISO 8601 (múi giờ Việt Nam +07:00) */
  startDate: string;
  /** Thời gian kết thúc chiến dịch theo chuẩn ISO 8601 (múi giờ Việt Nam +07:00) */
  endDate: string;
  /** Thời gian trễ trước khi popup xuất hiện (milliseconds) - 3000ms = 3 giây */
  delayMs: number;
  /** Thời gian tự động đóng popup (milliseconds) - 90000ms = 90 giây */
  autoCloseMs: number;
  /** Chỉ hiển thị 1 lần duy nhất khi vào web */
  onlyFirstVisit: boolean;
  /** Có giới hạn 1 lần mỗi phiên duyệt */
  oncePerSession?: boolean;
  /** Khóa lưu trong storage để đánh dấu đã xem */
  sessionStorageKey: string;
  /** Múi giờ áp dụng để so sánh ngày giờ */
  timeZone: string;
  /** Các đường dẫn không hiển thị popup (ví dụ trang quản trị) */
  excludeRoutes?: string[];
}

export interface ImagesConfig {
  /** 1 ảnh banner duy nhất ở phần trên (giống bố cục BT Academy) */
  floralBanner: string;
  bannerAlt: string;
  /** Căn chỉnh vị trí ảnh (dịch xuống nhẹ từ tâm 30% để lấy trọn vẹn khuôn mặt) */
  bannerPosition?: string;
  /** Logo chính thức của Đồng Phục Univi */
  logo: string;
  logoAlt: string;
}

export interface ContentConfig {
  scriptTagline: string;
  mainTitle: string;
  dateSubtitle: string;
  recipientGreeting: string;
  wishes: string[];
  signature: string;
  brandName: string;
}

export const CAMPAIGN_2010_CONFIG: CampaignConfig = {
  enabled: true,
  ignoreDateRange: false,
  startDate: '2026-10-19T00:00:00+07:00',
  endDate: '2026-10-21T23:59:59+07:00',
  delayMs: 3000,
  autoCloseMs: 90000,
  onlyFirstVisit: false,
  oncePerSession: false,
  sessionStorageKey: 'univi_popup_2010_shown_v1',
  timeZone: 'Asia/Ho_Chi_Minh',
  excludeRoutes: ['/admin', '/dashboard'],
};

export const IMAGES_2010_CONFIG: ImagesConfig = {
  // Ảnh bìa banner popup chính
  floralBanner: '/images/campaigns/anh-pik-20-10.jpg',
  bannerAlt: 'Đồng Phục Univi chúc mừng ngày Phụ nữ Việt Nam 20/10',
  // Dịch xuống một chút (30% từ đỉnh ảnh) để thấy trọn vẹn mặt và nụ cười mà không bị cắt cổ
  bannerPosition: 'object-[center_30%]',
  // Logo chính thức của Đồng Phục Univi
  logo: '/logo-univi.webp',
  logoAlt: 'Đồng Phục Univi',
};

export const CONTENT_2010_CONFIG: ContentConfig = {
  scriptTagline: 'Chúc mừng',
  mainTitle: 'NGÀY PHỤ NỮ VIỆT NAM',
  dateSubtitle: '20 THÁNG 10',
  recipientGreeting: 'Gửi những người phụ nữ tuyệt vời đang đồng hành cùng Univi!',
  wishes: [
    'Nhân ngày Phụ nữ Việt Nam 20/10, Đồng Phục Thể thao Univi xin gửi những lời chúc tốt đẹp và trân trọng nhất đến Quý khách hàng, Quý đối tác, các nữ huấn luyện viên cùng toàn thể chị em trong cộng đồng thể thao.',
    'Chúc một nửa thế giới luôn mạnh khỏe, hạnh phúc, tự tin và rạng rỡ. Mong rằng mỗi người phụ nữ đều có cơ hội phát huy thế mạnh, theo đuổi đam mê và tỏa sáng bằng chính bản sắc của mình.',
    'Cảm ơn Quý khách hàng và đối tác đã tin tưởng, đồng hành cùng Univi trên hành trình lan tỏa tinh thần thể thao và xây dựng những tập thể chuyên nghiệp.',
    'Chúc chị em có một ngày 20/10 thật nhiều niềm vui, yêu thương và những khoảnh khắc đáng nhớ!',
  ],
  signature: 'Trân trọng, Univi Sport',
  brandName: 'Đồng Phục Univi',
};

/**
 * Kiểm tra xem chiến dịch có đang trong khung thời gian hợp lệ không
 */
export function isCampaignActive(config: CampaignConfig = CAMPAIGN_2010_CONFIG): boolean {
  if (!config.enabled) return false;
  if (config.ignoreDateRange) return true;

  try {
    const now = new Date();
    const start = new Date(config.startDate);
    const end = new Date(config.endDate);

    const nowTime = now.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();

    if (isNaN(startTime) || isNaN(endTime)) {
      return true;
    }

    return nowTime >= startTime && nowTime <= endTime;
  } catch (err) {
    return true;
  }
}
