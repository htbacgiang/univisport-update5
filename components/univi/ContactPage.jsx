import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  Navigation,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { FaFacebookF, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import {
  trackContact,
  trackPhoneClick,
  trackZaloClick,
} from "../../lib/meta-pixel";
import { COMPANY_INFO } from "../../lib/companyInfo";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Tư vấn chung",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên của bạn.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Vui lòng nhập email hoặc số điện thoại liên hệ.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const isEmail = formData.email.includes("@");
      const contactPayload = {
        name: formData.name.trim(),
        email: isEmail ? formData.email.trim() : "",
        phone: !isEmail ? formData.email.trim() : "",
        message: `[Chủ đề: ${formData.subject || "Tư vấn chung"}] ${formData.message.trim() || "Không có nội dung chi tiết"}`,
        source: "Trang liên hệ (/lien-he)",
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactPayload),
      });

      const result = await response.json();

      if (result.success) {
        trackContact({
          content_name: "Trang liên hệ",
          uniform_type: formData.subject || "Tư vấn chung",
        });
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "Tư vấn chung",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.message || "Có lỗi xảy ra khi gửi yêu cầu.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Lỗi kết nối máy chủ. Vui lòng thử lại sau.");
      console.error("Contact Form Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapDirectionUrl =
    "https://www.google.com/maps/dir/?api=1&destination=20.9832437,105.7788691";
  const mapOpenUrl =
    "https://www.google.com/maps/search/?api=1&query=Đồng+Phục+Univi";

  return (
    <div className="min-h-screen bg-[#fafbfe] text-gray-800 relative overflow-hidden">
      {/* Soft background ambient brand glows */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#105d97]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-[#5e9bd1]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Sticky header spacer */}
      <div className="h-[80px]" />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16">
        {/* Responsive layout:
            Mobile: 1. LIÊN HỆ VỚI CHÚNG TÔI -> 2. Maps -> 3. Điền Form
            Desktop: Row 1: Điền Form (Left) & LIÊN HỆ (Right) -> Row 2: Maps */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* 1. LIÊN HỆ VỚI CHÚNG TÔI (Mobile: 1st, Desktop: Row 1 Right) */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col space-y-6 w-full">
            {/* Header info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f0f8] text-[#105d97] text-xs font-bold uppercase tracking-wider mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>LIÊN HỆ VỚI CHÚNG TÔI</span>
              </div>

              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Lựa chọn kênh liên lạc thuận tiện nhất cho bạn — Đội ngũ tư vấn Univi luôn sẵn sàng hỗ trợ & phản hồi nhanh chóng 24/7.
              </p>
            </div>

            {/* 3 Contact Cards */}
            <div className="space-y-4 pt-2">
              {/* Card 1: EMAIL US */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#105d97] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#105d97]/20">
                  <Mail className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase">
                    GỬI EMAIL
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Hỗ trợ giải đáp thông tin 24/7
                  </p>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-sm font-semibold text-[#105d97] hover:underline mt-1 block truncate"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              {/* Card 2: CALL US */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#105d97] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#105d97]/20">
                  <Phone className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase">
                    GỌI HOTLINE
                  </span>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Thứ 2 - Chủ Nhật: 08:00 - 18:00
                  </p>
                  <a
                    href={COMPANY_INFO.hotlineTel}
                    data-meta-tracked="true"
                    onClick={() =>
                      trackPhoneClick(COMPANY_INFO.hotline, {
                        source: "contact_page",
                      })
                    }
                    className="text-sm sm:text-base font-bold text-[#105d97] hover:underline mt-1 block"
                  >
                    {COMPANY_INFO.hotlineFormatted}
                  </a>
                </div>
              </div>

              {/* Card 3: VISIT US */}
              <div className="bg-white rounded-2xl sm:rounded-[22px] p-5 sm:p-6 border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#105d97] text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-[#105d97]/20">
                  <MapPin className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-bold text-gray-700 tracking-wider uppercase">
                    VĂN PHÒNG GIAO DỊCH
                  </span>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug">
                    {COMPANY_INFO.office.address}
                  </p>
                  <a
                    href={mapDirectionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#105d97] hover:underline mt-2"
                  >
                    <span>Xem chỉ đường</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick social links */}
            <div className="pt-2 flex items-center gap-3.5 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">
                Kết nối nhanh:
              </span>
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Univi"
                className="w-11 h-11 rounded-full bg-[#e6f0f8] text-[#105d97] hover:bg-[#105d97] hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
              >
                <FaFacebookF className="text-lg" />
              </a>
              <a
                href={COMPANY_INFO.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                data-meta-tracked="true"
                onClick={() => trackZaloClick({ source: "contact_page" })}
                aria-label="Zalo Univi"
                className="w-11 h-11 rounded-full bg-[#e6f0f8] text-[#105d97] hover:bg-[#105d97] hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
              >
                <SiZalo className="text-xl" />
              </a>
              <a
                href={COMPANY_INFO.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Univi"
                className="w-11 h-11 rounded-full bg-[#e6f0f8] text-[#105d97] hover:bg-[#105d97] hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
              >
                <FaYoutube className="text-lg" />
              </a>
              <a
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Univi"
                className="w-11 h-11 rounded-full bg-[#e6f0f8] text-[#105d97] hover:bg-[#105d97] hover:text-white hover:scale-105 active:scale-95 flex items-center justify-center transition-all shadow-sm"
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div>
          </div>

          {/* 2. MAPS (Mobile: 2nd, Desktop: Row 2 Full width) */}
          <div className="order-2 lg:order-3 lg:col-span-12 w-full lg:mt-6">
            <div className="bg-white rounded-[32px] p-3 sm:p-5 border border-gray-100 shadow-[0_15px_45px_-12px_rgba(0,0,0,0.06)] relative overflow-hidden">
              {/* Map wrapper */}
              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[540px] rounded-2xl sm:rounded-[24px] overflow-hidden bg-gray-100">
                {/* Floating Map Info Card */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-gray-100 max-w-[320px] hidden sm:block">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {COMPANY_INFO.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {COMPANY_INFO.office.shortAddress}
                  </p>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                    <a
                      href={mapOpenUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mở trong Maps</span>
                    </a>
                    <a
                      href={mapDirectionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#105d97] hover:bg-[#0c4d7d] text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Chỉ đường</span>
                    </a>
                  </div>
                </div>

                {/* Google Maps Iframe */}
                <iframe
                  title="Bản đồ vị trí Đồng Phục Univi"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.2342853220844!2d105.77886910000001!3d20.983243699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345390f181a5bd%3A0xcdf3833aed740992!2zxJBvzILMgG5nIFBodcyjYyBVbml2aQ!5e0!3m2!1svi!2s!4v1758983479311!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter saturate-[1.05]"
                />
              </div>
            </div>
          </div>

          {/* 3. ĐIỀN FORM (Mobile: 3rd, Desktop: Row 1 Left) */}
          <div className="order-3 lg:order-1 lg:col-span-7 bg-white rounded-[32px] border border-gray-100/90 shadow-[0_12px_45px_-12px_rgba(0,0,0,0.06)] p-7 sm:p-10 md:p-12 relative transition-all w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2 mb-8">
              Tư vấn & thiết kế mẫu miễn phí — Phản hồi nhanh chóng trong 15 phút.
            </p>

            {submitStatus === "success" && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-up">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold">Gửi tin nhắn thành công!</p>
                  <p className="text-emerald-700">
                    Cảm ơn bạn đã liên hệ. Đội ngũ tư vấn Univi sẽ phản hồi lại bạn trong thời gian sớm nhất.
                  </p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Full name & Email / Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên của bạn"
                    required
                    className="w-full rounded-2xl bg-[#F8F9FD] border border-gray-200/90 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#105d97]/25 focus:border-[#105d97] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="emailAddress"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email hoặc Số điện thoại
                  </label>
                  <input
                    id="emailAddress"
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email hoặc số điện thoại"
                    required
                    className="w-full rounded-2xl bg-[#F8F9FD] border border-gray-200/90 px-4 py-3.5 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#105d97]/25 focus:border-[#105d97] focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Subject */}
              <div>
                <label
                  htmlFor="subjectSelect"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Chủ đề cần tư vấn
                </label>
                <div className="relative">
                  <select
                    id="subjectSelect"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full appearance-none rounded-2xl bg-[#F8F9FD] border border-gray-200/90 px-4 py-3.5 pr-10 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#105d97]/25 focus:border-[#105d97] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Tư vấn chung">Tư vấn chung</option>
                    <option value="Tư vấn may đồng phục Doanh nghiệp / Công sở">
                      Tư vấn may đồng phục Doanh nghiệp / Công sở
                    </option>
                    <option value="Đồng phục Thể thao / Gym / Pickleball / Yoga">
                      Đồng phục Thể thao / Gym / Pickleball / Yoga
                    </option>
                    <option value="Đồng phục Áo thun / Polo sự kiện">
                      Đồng phục Áo thun / Polo sự kiện
                    </option>
                    <option value="Báo giá đơn hàng & May mẫu thử">
                      Báo giá đơn hàng & May mẫu thử
                    </option>
                    <option value="Hợp tác đại lý / Phân phối">
                      Hợp tác đại lý / Phân phối
                    </option>
                  </select>
                  <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Row 3: Message */}
              <div>
                <label
                  htmlFor="messageArea"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Nội dung tin nhắn
                </label>
                <textarea
                  id="messageArea"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Chia sẻ chi tiết yêu cầu của bạn (loại đồng phục, số lượng dự kiến, ý tưởng thiết kế...)..."
                  className="w-full rounded-2xl bg-[#F8F9FD] border border-gray-200/90 p-4 text-gray-900 placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#105d97]/25 focus:border-[#105d97] focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-[#105d97] hover:bg-[#0c4d7d] active:scale-95 text-white font-medium text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg shadow-[#105d97]/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang gửi tin nhắn...</span>
                    </>
                  ) : (
                    <>
                      <span>Gửi tin nhắn</span>
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
