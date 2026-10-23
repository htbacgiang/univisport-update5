import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaCheckCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

export default function RegisterDealer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    province: "",
    type: "",
    channels: [],
    volume: "",
    products: [],
    source: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const meta = {
    title: "Đăng Ký Đại Lý Univi – Hợp Tác Nguồn Hàng Thể Thao Uy Tín",
    description: "Đăng ký trở thành đại lý Univi ngay hôm nay. Nhận giá sỉ ưu đãi, hóa đơn đầy đủ, hỗ trợ marketing toàn diện. Đội tư vấn phản hồi trong 2 giờ.",
    keywords: "đăng ký đại lý univi, hợp tác univi, lấy sỉ đồ thể thao",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/dang-ky-dai-ly",
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "channels") {
        setFormData(prev => ({
          ...prev,
          channels: checked
            ? [...prev.channels, value]
            : prev.channels.filter(item => item !== value)
        }));
      } else if (name === "products") {
        setFormData(prev => ({
          ...prev,
          products: checked
            ? [...prev.products, value]
            : prev.products.filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/dealer-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag('event', 'submit_dealer_form', {
            'event_category': 'form',
            'event_label': 'Dealer Registration'
          });
        }
      } else {
        alert(data.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} key="robots" />
        <meta name="author" content={meta.author} />
        <link rel="canonical" href={meta.canonical} />

        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
      </Head>

      <div className="h-[70px]"></div>

      {/* SECTION 1 — HERO */}
      <section className="bg-[#105d97] text-white py-10 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold ">Đăng Ký Hợp Tác Cùng Univi</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Điền thông tin bên dưới - đội ngũ tư vấn Univi sẽ liên hệ trong vòng <strong>2 giờ làm việc</strong>.
          </p>
        </div>
        {/* Optional small background pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-10 blur-3xl"></div>
      </section>

      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Main Form Area */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Thông Tin Đăng Ký Hợp Tác</h2>

                {isSuccess ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center">
                    <div className="text-5xl text-green-500 mb-4 flex justify-center"><FaCheckCircle /></div>
                    <h3 className="text-2xl font-bold mb-2">Cảm ơn bạn đã đăng ký!</h3>
                    <p className="text-lg">Đội ngũ tư vấn Univi sẽ liên hệ với bạn trong vòng 2 giờ làm việc (8h–18h, Thứ 2 – Thứ 7).</p>
                    <button
                      onClick={() => { setIsSuccess(false); setFormData({ name: "", phone: "", email: "", province: "", type: "", channels: [], volume: "", products: [], source: "", notes: "" }); }}
                      className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Gửi yêu cầu khác
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Ví dụ: Nguyễn Văn A" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#105d97] focus:border-transparent transition-all outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại <span className="text-red-500">*</span></label>
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="Ví dụ: 0912 345 678" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#105d97] focus:border-transparent transition-all outline-none" />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Ví dụ: email@gmail.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#105d97] focus:border-transparent transition-all outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tỉnh / Thành phố <span className="text-red-500">*</span></label>
                        <select name="province" required value={formData.province} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#105d97] focus:border-transparent transition-all outline-none bg-white">
                          <option value="">-- Chọn tỉnh thành --</option>
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP Hồ Chí Minh">TP Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Hình thức hợp tác <span className="text-red-500">*</span></label>
                      <div className="space-y-3">
                        {['Shop thời trang thể thao', 'CTV / KOC bán online', 'Đơn vị may đồng phục thương mại'].map((type, idx) => (
                          <label key={idx} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="radio" name="type" required value={type} checked={formData.type === type} onChange={handleInputChange} className="w-5 h-5 text-[#105d97] border-gray-300 focus:ring-[#105d97]" />
                            <span className="ml-3 text-gray-800 font-medium">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Bạn đang bán hàng ở đâu?</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Facebook', 'TikTok', 'Shopee/Lazada', 'Cửa hàng offline', 'Chưa bán', 'Khác'].map((channel, idx) => (
                          <label key={idx} className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="checkbox" name="channels" value={channel} checked={formData.channels.includes(channel)} onChange={handleInputChange} className="w-4 h-4 text-[#105d97] border-gray-300 rounded focus:ring-[#105d97]" />
                            <span className="ml-2 text-sm text-gray-700">{channel}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nhu cầu số lượng hàng tháng (ước tính)</label>
                      <select name="volume" value={formData.volume} onChange={handleInputChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#105d97] focus:border-transparent transition-all outline-none bg-white">
                        <option value="">-- Chọn số lượng --</option>
                        <option value="Dưới 50 sản phẩm">Dưới 50 sản phẩm</option>
                        <option value="50–200 sản phẩm">50–200 sản phẩm</option>
                        <option value="200–500 sản phẩm">200–500 sản phẩm</option>
                        <option value="Trên 500 sản phẩm">Trên 500 sản phẩm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Sản phẩm quan tâm</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Áo Gym', 'Áo Polo thể thao', 'Quần legging', 'Đồng phục Yoga', 'Áo gió', 'Pickleball', 'Phôi áo trơn', 'Khác'].map((product, idx) => (
                          <label key={idx} className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50 transition-colors">
                            <input type="checkbox" name="products" value={product} checked={formData.products.includes(product)} onChange={handleInputChange} className="w-4 h-4 text-[#105d97] border-gray-300 rounded focus:ring-[#105d97]" />
                            <span className="ml-2 text-sm text-gray-700">{product}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú / Yêu cầu thêm</label>
                      <textarea name="notes" rows="3" value={formData.notes} onChange={handleInputChange} placeholder="Nhập câu hỏi hoặc yêu cầu đặc biệt (nếu có)" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#105d97] focus:border-transparent transition-all outline-none resize-y"></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#105d97] hover:bg-[#0d4a7a] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg flex justify-center items-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Đang gửi..." : "Gửi Đăng Ký Hợp Tác →"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Bằng việc gửi thông tin, bạn đã đọc và đồng ý với <Link href="/chinh-sach-dai-ly" className="text-[#105d97] hover:underline">Chính sách đại lý</Link> của Univi.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="lg:w-1/3 space-y-6">
              {/* Benefits Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b">Khi Trở Thành Đại Lý Univi, Bạn Nhận Được:</h3>
                <ul className="space-y-3 mb-6 text-gray-700">
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Giá sỉ ưu đãi, chiết khấu theo cấp bậc</li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Hóa đơn đầy đủ cho mỗi đơn hàng</li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Kho ảnh & video sản phẩm chuyên nghiệp miễn phí</li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Tư vấn chiến lược bán hàng từ team marketing 9+ năm</li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Giao hàng toàn quốc, mẫu có sẵn trong 2–3 ngày</li>
                  <li className="flex items-start gap-3"><FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" /> Đổi trả linh hoạt, giảm rủi ro tồn kho</li>
                </ul>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-center">
                  <p className="text-sm text-gray-600 mb-2">Hotline hỗ trợ trực tiếp:</p>
                  <a href="tel:0834204999" className="block text-2xl font-bold text-[#105d97] mb-1">0834.204.999</a>
                  <a href="tel:0961567997" className="block text-2xl font-bold text-[#105d97]">096.156.7997</a>
                  <p className="text-xs text-gray-500 mt-2">(8h–18h, Thứ 2 – Thứ 7)</p>
                </div>
              </div>

              {/* Direct Contact */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hoặc Liên Hệ Trực Tiếp Với Chúng Tôi</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaPhoneAlt className="text-[#105d97] mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Hotline</p>
                      <p className="text-sm text-gray-600">0834.204.999 / 096.156.7997</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-[#105d97] mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">dongphucunivi@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaBuilding className="text-[#105d97] mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Văn phòng</p>
                      <p className="text-sm text-gray-600">Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-[#105d97] mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Xưởng sản xuất</p>
                      <p className="text-sm text-gray-600"><Link href="/xuong-may-dong-phuc-univi" className="hover:text-[#105d97] transition-colors">Phường Chương Mỹ, Thành phố Hà Nội</Link></p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
