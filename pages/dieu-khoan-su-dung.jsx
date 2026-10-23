import Head from "next/head";
import Link from "next/link";
import { FileText, ShieldCheck, Sparkles, Phone, Mail, MapPin } from "lucide-react";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function TermsOfUse() {
  const meta = {
    title: "Điều Khoản Sử Dụng Dịch Vụ - Đồng Phục Univi",
    description: "Điều khoản sử dụng dịch vụ tại Đồng Phục Univi. Quy định về việc sử dụng website, quy chuẩn đặt hàng và chính sách bảo vệ quyền lợi khách hàng.",
    keywords: "điều khoản sử dụng, quy định website, đồng phục univi, điều kiện mua hàng, bản quyền",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/dieu-khoan-su-dung",
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
              <FileText className="w-4 h-4 text-sky-600" />
              Quy Định & Thỏa Thuận Dịch Vụ
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              ĐIỀU KHOẢN SỬ DỤNG ĐỒNG PHỤC UNIVI
            </h1>
            <p className="mt-2.5 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Quy định quyền lợi, trách nhiệm và tiêu chuẩn hợp tác khi sử dụng dịch vụ tại Đồng phục Univi
            </p>
          </div>

          {/* Vertical Layout - Sections */}
          <div className="space-y-10">

            {/* ========================================================================= */}
            {/* SECTION 1: QUY ĐỊNH SỬ DỤNG & SỞ HỮU TRÍ TUỆ */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    QUY ĐỊNH SỬ DỤNG & SỞ HỮU TRÍ TUỆ
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                {/* Intro */}
                <p className="font-medium text-slate-800 text-justify sm:text-left bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  Bằng việc truy cập, tham khảo thông tin hoặc đặt may đồng phục tại website <strong>dongphucunivi.com</strong>, Quý khách đồng ý tuân thủ và chịu sự ràng buộc bởi các điều khoản sử dụng dưới đây. Các điều khoản này có hiệu lực kể từ thời điểm Quý khách bắt đầu truy cập và sử dụng dịch vụ.
                </p>

                {/* 1. Chấp nhận điều khoản */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Chấp nhận điều khoản
                  </h3>
                  <div className="flex items-start gap-2 pl-4 sm:pl-6">
                    <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                    <p className="text-slate-700">
                      Khi truy cập và duyệt website dongphucunivi.com, Quý khách mặc nhiên xác nhận đã đọc, hiểu rõ và đồng ý với tất cả điều khoản, chính sách bảo mật và hướng dẫn mua hàng được Univi công bố. Nếu Quý khách không đồng ý với bất kỳ điều khoản nào, vui lòng ngưng sử dụng trang web.
                    </p>
                  </div>
                </div>

                {/* 2. Sở hữu trí tuệ và bản quyền */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Sở hữu trí tuệ và bản quyền
                  </h3>
                  <div className="space-y-3 pl-2 sm:pl-4">
                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Tài sản thương hiệu của Univi:
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Toàn bộ nội dung trên website bao gồm hình ảnh mẫu áo, video sản phẩm, logo, nhận diện thương hiệu, bài viết tư vấn, bảng thông số size và bảng phối màu đều thuộc quyền sở hữu trí tuệ độc quyền của Đồng Phục Univi.
                      </p>
                    </div>

                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Quy định sử dụng nội dung:
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Quý khách được quyền xem và tham khảo mẫu mã cho mục đích lựa chọn sản phẩm may đo cá nhân hoặc doanh nghiệp. Nghiêm cấm mọi hành vi sao chép, trích xuất dữ liệu, sử dụng lại hình ảnh sản phẩm của Univi cho mục đích thương mại mà chưa có văn bản chấp thuận.
                      </p>
                    </div>

                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Bảo mật thiết kế & logo khách hàng:
                      </h4>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Univi cam kết bảo mật tuyệt đối các file thiết kế, logo riêng và hình ảnh độc quyền do Quý khách cung cấp trong quá trình đặt may; không tự ý cung cấp hay chuyển giao cho bên thứ ba.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Tiêu chuẩn hành vi người dùng */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Tiêu chuẩn hành vi người dùng
                  </h3>
                  <p className="text-slate-700">
                    Khi tương tác trên website và hệ thống của Univi, Quý khách cam kết không thực hiện các hành vi:
                  </p>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Sử dụng website vào bất kỳ mục đích nào vi phạm pháp luật hiện hành của Nước CHXHCN Việt Nam.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Gửi, phát tán các tập tin có chứa mã độc, virus hoặc can thiệp trái phép vào hệ thống máy chủ, cơ sở dữ liệu website.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Cố ý mạo danh tổ chức hoặc cá nhân khác khi yêu cầu báo giá và đặt may sản phẩm.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: QUY TRÌNH GIAO DỊCH & CAM KẾT HỢP TÁC */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    QUY TRÌNH GIAO DỊCH & CAM KẾT HỢP TÁC
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-7 text-slate-700 leading-relaxed text-sm sm:text-base">

                {/* 1. Quy trình đặt hàng & xác nhận hợp đồng */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Quy trình đặt hàng và giao dịch
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Tiếp nhận & Báo giá:</strong> Khi Quý khách gửi yêu cầu, Univi sẽ liên hệ tư vấn chất liệu, bảng size, lên market demo và gửi bảng báo giá chi tiết theo số lượng.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Hiệu lực đơn hàng:</strong> Đơn hàng chỉ chính thức có hiệu lực sản xuất khi hai bên hoàn tất duyệt maket thiết kế, ký hợp đồng hoặc xác nhận đơn hàng kèm tiền đặt cọc theo thỏa thuận.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Cam kết chất lượng:</strong> Sản phẩm được sản xuất đúng chất liệu vải, công nghệ in/thêu và quy cách may đã thỏa thuận. Mọi trường hợp phát sinh lỗi kỹ thuật đều được xử lý theo <strong>Chính sách bảo hành</strong> và <strong>Chính sách đổi trả</strong> của Univi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Miễn trừ trách nhiệm */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Miễn trừ trách nhiệm
                  </h3>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Màu sắc thực tế trên thành phẩm vải có thể có độ lệch quang học nhỏ (trong phạm vi chấp nhận được của ngành may dệt) so với hình ảnh hiển thị trên các loại màn hình điện thoại/máy tính khác nhau.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Univi không chịu trách nhiệm đối với sự chậm trễ giao nhận phát sinh do các trường hợp bất khả kháng như thiên tai, dịch bệnh, hoặc sự cố mạng lưới vận tải nằm ngoài tầm kiểm soát hợp lý.</span>
                    </li>
                  </ul>
                </div>

                {/* 3. Cơ chế giải quyết tranh chấp */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Giải quyết tranh chấp
                  </h3>
                  <div className="flex items-start gap-2 pl-4 sm:pl-6">
                    <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                    <p className="text-slate-700">
                      Mọi bất đồng hoặc khiếu nại phát sinh trong quá trình giao dịch đều được hai bên ưu tiên giải quyết thông qua đối thoại, thương lượng và tinh thần hợp tác thiện chí. Trường hợp không đạt được thỏa thuận chung, tranh chấp sẽ được chuyển đến Tòa án có thẩm quyền tại Hà Nội theo quy định của pháp luật Việt Nam.
                    </p>
                  </div>
                </div>

                {/* 4. Điều chỉnh và hiệu lực điều khoản */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">4.</span> Điều chỉnh và hiệu lực điều khoản
                  </h3>
                  <div className="flex items-start gap-2 pl-4 sm:pl-6">
                    <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                    <p className="text-slate-700">
                      Univi có quyền điều chỉnh, bổ sung nội dung Điều khoản sử dụng này bất kỳ lúc nào để phù hợp với định hướng hoạt động và quy định pháp luật. Nội dung cập nhật có hiệu lực ngay khi được đăng tải trên website.
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
                    Nếu Quý khách có bất kỳ câu hỏi nào về Điều khoản dịch vụ hoặc quy trình đặt may đồng phục, vui lòng liên hệ trực tiếp với Univi:
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
