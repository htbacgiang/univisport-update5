import Head from "next/head";
import Link from "next/link";
import { ShieldCheck, Sparkles, Phone, Mail, MapPin, Lock, Eye, FileText, CheckCircle2, UserCheck, ShieldAlert } from "lucide-react";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function PrivacyPolicy() {
  const meta = {
    title: "Chính Sách Bảo Mật Thông Tin Khách Hàng - Đồng Phục Univi",
    description: "Chính sách bảo mật thông tin cá nhân của khách hàng tại Đồng Phục Univi. Cam kết bảo vệ thông tin an toàn, minh bạch và tuân thủ pháp luật.",
    keywords: "chính sách bảo mật, bảo vệ thông tin cá nhân, bảo mật dữ liệu, đồng phục univi, quyền riêng tư",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-bao-mat",
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

        {/* Open Graph */}
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical} />
        <meta property="og:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
      </Head>

      <div className="h-[70px] md:h-[80px]"></div>

      {/* Main Page Container */}
      <main className="min-h-screen bg-white py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Breadcrumb / Page Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs md:text-sm font-semibold tracking-wide uppercase mb-3 border border-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              Cam Kết Quyền Riêng Tư & An Toàn Dữ Liệu
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              CHÍNH SÁCH BẢO MẬT ĐỒNG PHỤC UNIVI
            </h1>
            <p className="mt-2.5 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Minh bạch - An toàn - Bảo vệ tuyệt đối thông tin và quyền lợi của Quý khách hàng
            </p>
          </div>

          {/* Vertical Layout - Sections */}
          <div className="space-y-10">

            {/* ========================================================================= */}
            {/* SECTION 1: THU THẬP & MỤC ĐÍCH SỬ DỤNG THÔNG TIN */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">

                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    THU THẬP & MỤC ĐÍCH SỬ DỤNG THÔNG TIN
                  </h2>

                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                {/* Intro */}
                <p className="font-medium text-slate-800 text-justify sm:text-left bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  Đồng phục Univi (Univi) cam kết tôn trọng và bảo vệ tối đa quyền riêng tư cũng như dữ liệu cá nhân của Quý khách hàng. Chính sách bảo mật này giải thích rõ ràng cách chúng tôi thu thập, sử dụng và bảo mật thông tin khi bạn truy cập website hoặc sử dụng dịch vụ may đo đồng phục của chúng tôi.
                </p>

                {/* 1. Thu thập thông tin cá nhân */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Thu thập thông tin cá nhân
                  </h3>
                  <p className="text-slate-700">
                    Chúng tôi thu thập thông tin khách hàng nhằm phục vụ tốt nhất quy trình tư vấn, thiết kế và sản xuất đồng phục thông qua:
                  </p>

                  <div className="space-y-3 pl-2 sm:pl-4">
                    {/* Direct Info */}
                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Thông tin Quý khách cung cấp trực tiếp:
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Khi Quý khách liên hệ đặt hàng, đăng ký nhận tư vấn, yêu cầu gửi mẫu vải hoặc nhận báo giá qua website, hotline hoặc fanpage:
                      </p>
                      <ul className="space-y-1.5 pl-4 list-none text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Họ tên cá nhân / Đại diện cơ quan, tổ chức, doanh nghiệp.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Số điện thoại liên hệ (Hotline/Zalo) và địa chỉ Email.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Địa chỉ nhận mẫu thử, địa chỉ giao hàng và thông tin xuất hóa đơn VAT (nếu có).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Chi tiết yêu cầu thiết kế: Số lượng, kiểu dáng, chất liệu vải, hình in/thêu logo thương hiệu.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Auto Info */}
                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Thông tin thu thập tự động qua hệ thống:
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Khi Quý khách truy cập website dongphucunivi.com, hệ thống kỹ thuật có thể tự động ghi nhận một số thông tin ẩn danh nhằm tối ưu hiển thị:
                      </p>
                      <ul className="space-y-1.5 pl-4 list-none text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Địa chỉ IP, loại trình duyệt và loại thiết bị truy cập (máy tính, điện thoại, máy tính bảng).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Thời gian truy cập, các trang mẫu sản phẩm và bảng màu đã xem để gợi ý phù hợp.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. Mục đích sử dụng thông tin */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Mục đích sử dụng thông tin
                  </h3>
                  <p className="text-slate-700">
                    Mọi thông tin thu thập được Univi sử dụng duy nhất cho các mục đích hợp pháp và minh bạch sau:
                  </p>
                  <ul className="space-y-2.5 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2.5">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Tư vấn & Báo giá:</strong> Tiếp nhận yêu cầu, gửi catalogue, tư vấn chọn chất liệu và báo giá chi tiết, nhanh chóng.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Thực hiện đơn hàng:</strong> Lên market thiết kế, may mẫu thử, sản xuất hàng loạt, đóng gói và bàn giao đúng hẹn đến tay khách hàng.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Chăm sóc sau bán hàng & Bảo hành:</strong> Kích hoạt chính sách bảo hành sản phẩm lỗi may, bảo hành hình in và giải quyết đổi trả kịp thời.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Cải tiến dịch vụ:</strong> Phân tích phản hồi khách hàng để liên tục nâng cao tay nghề may, cải tiến công nghệ in ấn và chất lượng phục vụ.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Thông báo ưu đãi (nếu có):</strong> Gửi thông tin các chương trình chiết khấu đặc biệt dành cho khách hàng thân thiết và đại lý khi được sự đồng ý.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: QUY CHUẨN BẢO MẬT & QUYỀN LỢI KHÁCH HÀNG */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">

                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    QUY TRÌNH BẢO MẬT & QUYỀN LỢI KHÁCH HÀNG
                  </h2>

                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-7 text-slate-700 leading-relaxed text-sm sm:text-base">

                {/* 1. Cam kết an toàn & Lưu trữ thông tin */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Bảo mật và lưu trữ thông tin
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Hạ tầng lưu trữ an toàn:</strong> Dữ liệu khách hàng được lưu trữ trên các máy chủ có cơ chế bảo mật tiêu chuẩn, mã hóa kết nối SSL và phân quyền truy cập nghiêm ngặt.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Quy trình nội bộ chặt chẽ:</strong> Chỉ nhân sự được phân công trực tiếp phụ trách đơn hàng và bộ phận chăm sóc khách hàng mới được cấp quyền tiếp cận thông tin nhằm xử lý công việc.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Nguyên tắc chia sẻ thông tin */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Nguyên tắc chia sẻ thông tin
                  </h3>
                  <p className="text-slate-800 font-medium">
                    Univi cam kết <span className="text-sky-700 font-bold">tuyệt đối không bán, chuyển nhượng hay trao đổi</span> thông tin cá nhân của Quý khách cho bên thứ ba vì bất kỳ mục đích thương mại nào.
                  </p>
                  <p className="text-slate-700">
                    Chúng tôi chỉ cung cấp các thông tin cần thiết trong các trường hợp sau:
                  </p>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Đối tác vận chuyển / Đơn vị giao nhận:</strong> Cung cấp tên, số điện thoại và địa chỉ nhận hàng để đối tác giao hàng đúng hẹn tới tay Quý khách.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Theo yêu cầu pháp lý:</strong> Khi có văn bản yêu cầu chính thức từ cơ quan nhà nước có thẩm quyền theo quy định của pháp luật Việt Nam.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Được sự đồng ý của Quý khách:</strong> Trong các trường hợp hợp tác đặc thù khi có sự xác nhận của khách hàng.</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Quyền của Quý khách hàng */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Quyền của Quý khách hàng
                  </h3>
                  <div className="space-y-3 pl-1 sm:pl-2">
                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
                      <p className="font-semibold text-slate-900 mb-1 text-sky-800">
                        Quyền kiểm tra & Chỉnh sửa thông tin:
                      </p>
                      <div className="flex items-start gap-2 pl-3 text-xs sm:text-sm">
                        <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                        <p className="text-slate-700">
                          Quý khách có quyền yêu cầu Univi kiểm tra, cập nhật hoặc điều chỉnh lại các thông tin cá nhân và chi tiết đơn hàng bất kỳ thời điểm nào.
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
                      <p className="font-semibold text-slate-900 mb-1 text-sky-800">
                        Quyền yêu cầu xóa thông tin:
                      </p>
                      <div className="flex items-start gap-2 pl-3 text-xs sm:text-sm">
                        <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                        <p className="text-slate-700">
                          Quý khách có quyền yêu cầu xóa bỏ hoặc ngừng sử dụng dữ liệu thông tin cá nhân khỏi hệ thống lưu trữ tiếp thị của chúng tôi (trừ thông tin hóa đơn chứng từ bắt buộc lưu trữ theo luật kế toán).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Cập nhật chính sách */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">4.</span> Cập nhật và điều chỉnh chính sách
                  </h3>
                  <div className="flex items-start gap-2 pl-4 sm:pl-6">
                    <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                    <p className="text-slate-700">
                      Univi có thể cập nhật chính sách bảo mật này định kỳ để đảm bảo tuân thủ đầy đủ các quy định pháp luật và sự phát triển của dịch vụ. Mọi nội dung cập nhật sẽ được công bố trực tiếp trên trang website chính thức <strong>dongphucunivi.com</strong>.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* SUPPORT & CONTACT INFO CARD */}
            {/* ========================================================================= */}
            <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-900/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-sky-400" />
                    Hỗ Trợ & Giải Đáp Thắc Mắc
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Nếu Quý khách có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào liên quan đến chính sách bảo mật dữ liệu cá nhân, vui lòng liên hệ ngay với Đồng phục Univi:
                  </p>
                </div>

                <div className="space-y-3 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-300">Hotline/Zalo: </span>
                      <a href="tel:0834204999" className="font-bold text-white hover:text-sky-300 transition-colors">0834.204.999</a>
                      <span className="text-slate-400"> / </span>
                      <a href="tel:0961567997" className="font-bold text-white hover:text-sky-300 transition-colors">096.156.7997</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <div>
                      <span className="text-slate-300">Email: </span>
                      <a href="mailto:dongphucunivi@gmail.com" className="font-bold text-white hover:text-sky-300 transition-colors">dongphucunivi@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-300">Địa chỉ: </span>
                      <span className="font-medium text-white">Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </DefaultLayout>
  );
}
