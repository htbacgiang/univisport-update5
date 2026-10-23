import Head from "next/head";
import Link from "next/link";
import { RefreshCw, Sparkles, Phone, Mail, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function ReturnPolicy() {
  const meta = {
    title: "Chính Sách Đổi Trả & Hoàn Tiền - Đồng Phục Univi",
    description: "Chính sách đổi trả và hoàn tiền tại Đồng Phục Univi. Cam kết đổi trả linh hoạt, minh bạch về điều kiện, thời gian và quy trình xử lý cho khách hàng.",
    keywords: "chính sách đổi trả, hoàn tiền, đổi hàng, đổi size, đồng phục univi, bảo hành sản phẩm",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-doi-tra",
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
              <RefreshCw className="w-4 h-4 text-sky-600" />
              Cam Kết Đổi Trả Linh Hoạt & Minh Bạch
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              CHÍNH SÁCH ĐỔI TRẢ ĐỒNG PHỤC UNIVI
            </h1>
            <p className="mt-2.5 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Nhanh chóng - Tiện lợi - Đảm bảo tối đa sự hài lòng và quyền lợi của Quý khách hàng
            </p>
          </div>

          {/* Vertical Layout - Sections */}
          <div className="space-y-10">

            {/* ========================================================================= */}
            {/* SECTION 1: ĐIỀU KIỆN & THỜI GIAN ĐỔI TRẢ */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    ĐIỀU KIỆN & THỜI GIAN ĐỔI TRẢ
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                {/* Intro */}
                <p className="font-medium text-slate-800 text-justify sm:text-left bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  Đồng Phục Univi luôn đặt chất lượng sản phẩm và sự hài lòng của Quý khách lên hàng đầu. Trường hợp phát sinh sản phẩm lỗi do sản xuất hoặc không đúng theo thỏa thuận đơn hàng, Univi cam kết hỗ trợ đổi trả nhanh chóng và thuận tiện nhất.
                </p>

                {/* 1. Điều kiện đổi trả */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Điều kiện đổi trả
                  </h3>
                  
                  <div className="space-y-3 pl-2 sm:pl-4">
                    {/* Eligible */}
                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Trường hợp được hỗ trợ đổi trả:
                      </h4>
                      <ul className="space-y-1.5 pl-4 list-none text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Sản phẩm bị lỗi kỹ thuật từ nhà sản xuất (rách vải, lỗi đường may, bục chỉ, hỏng khóa kéo/cúc).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Sản phẩm may sai chi tiết, sai bảng size, sai màu sắc hoặc sai hình in/thêu so với maket thiết kế đã chốt.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Sản phẩm bị hư hại, ướt hoặc rách trong quá trình vận chuyển giao hàng.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Sản phẩm đổi size hoặc đổi mẫu có sẵn còn nguyên tag mác, chưa qua giặt tẩy hoặc sử dụng.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Not Eligible */}
                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Trường hợp không thuộc phạm vi đổi trả:
                      </h4>
                      <ul className="space-y-1.5 pl-4 list-none text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Sản phẩm đã qua sử dụng, đã giặt tẩy, ủi sấy ở nhiệt độ cao hoặc có mùi lạ/vết bẩn do người dùng.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Sản phẩm hư hỏng do ngoại lực, va quệt, bảo quản không đúng theo hướng dẫn sử dụng.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Khách hàng tự ý sửa chữa, cắt sửa form dáng sản phẩm trước khi phản hồi cho Univi.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Quá thời hạn tiếp nhận đổi trả theo quy định.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. Thời gian đổi trả */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Thời gian đổi trả
                  </h3>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Đổi size / Đổi sản phẩm mẫu có sẵn:</strong> Trong vòng <strong>07 ngày</strong> kể từ ngày khách hàng nhận hàng.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Bảo hành & Xử lý lỗi sản xuất:</strong> Trong vòng <strong>30 ngày</strong> kể từ ngày bàn giao sản phẩm.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Thời gian xử lý:</strong> Từ <strong>3 - 5 ngày làm việc</strong> sau khi Univi tiếp nhận đầy đủ thông tin hoặc nhận lại sản phẩm lỗi.</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Chi phí đổi trả */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Quy định về chi phí đổi trả
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Miễn phí 100%:</strong> Univi chi trả toàn bộ chi phí may lại/sửa chữa và phí vận chuyển 2 chiều đối với tất cả sản phẩm gặp lỗi do sản xuất hoặc do lỗi gửi nhầm từ Univi.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Đổi size theo yêu cầu phát sinh từ khách hàng:</strong> Quý khách hỗ trợ phí vận chuyển 2 chiều và chênh lệch giá trị sản phẩm (nếu có).
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: QUY TRÌNH TIẾP NHẬN & PHƯƠNG THỨC HOÀN TIỀN */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    QUY TRÌNH TIẾP NHẬN & PHƯƠNG THỨC HOÀN TIỀN
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-7 text-slate-700 leading-relaxed text-sm sm:text-base">

                {/* 1. Quy trình đổi trả */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Quy trình tiếp nhận đổi trả 4 bước
                  </h3>
                  <div className="space-y-3 pl-1 sm:pl-2">
                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sky-900">Liên hệ thông báo</p>
                        <p className="text-slate-700 text-xs sm:text-sm mt-0.5">
                          Quý khách liên hệ qua Hotline <strong>0834.204.999</strong> hoặc Zalo CSKH, cung cấp mã đơn hàng, số lượng và hình ảnh/video mô tả lỗi sản phẩm.
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sky-900">Xác nhận phương án xử lý</p>
                        <p className="text-slate-700 text-xs sm:text-sm mt-0.5">
                          Đội ngũ kỹ thuật Univi kiểm tra và xác nhận phương án: Sửa chữa, may bù mới hoặc đổi size tương ứng trong vòng 24h.
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sky-900">Gửi sản phẩm về xưởng</p>
                        <p className="text-slate-700 text-xs sm:text-sm mt-0.5">
                          Quý khách đóng gói gửi sản phẩm về địa chỉ xưởng Univi (hoặc bàn giao cho nhân viên giao vận theo thỏa thuận).
                        </p>
                      </div>
                    </div>

                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sky-900">Bàn giao sản phẩm hoàn thiện</p>
                        <p className="text-slate-700 text-xs sm:text-sm mt-0.5">
                          Univi tiến hành xử lý kỹ thuật/may mới và gửi lại sản phẩm chuẩn chất lượng đến tận tay Quý khách.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Phương thức hoàn tiền */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Chính sách và phương thức hoàn tiền
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Điều kiện hoàn tiền:</strong> Áp dụng trong trường hợp sản phẩm gặp lỗi nghiêm trọng từ nhà sản xuất mà Univi không thể khắc phục hoặc không có sản phẩm thay thế phù hợp theo thỏa thuận hai bên.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Hình thức hoàn tiền:</strong> Chuyển khoản ngân hàng trực tiếp vào số tài khoản của khách hàng trong vòng <strong>3 - 5 ngày làm việc</strong> sau khi hai bên xác nhận hủy/hoàn đơn.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Lưu ý quan trọng */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Lưu ý quan trọng khi nhận hàng
                  </h3>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Quý khách vui lòng đồng kiểm tra số lượng kiện hàng, tình trạng bao bì bên ngoài trước khi ký nhận từ đơn vị vận chuyển.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Nên chụp ảnh hoặc quay video ngắn khi mở kiện hàng để làm cơ sở đối soát nhanh nhất nếu phát sinh sai lệch.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Liên hệ ngay với chuyên viên tư vấn phụ trách đơn hàng hoặc hotline nếu phát hiện bất kỳ vấn đề nào.</span>
                    </li>
                  </ul>
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
                    Hỗ Trợ Đổi Trả Nhanh Chóng
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Nếu sản phẩm có bất kỳ vấn đề gì cần hỗ trợ đổi trả hoặc bảo hành, Quý khách vui lòng liên hệ ngay với đội ngũ Chăm sóc khách hàng của Đồng Phục Univi:
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
