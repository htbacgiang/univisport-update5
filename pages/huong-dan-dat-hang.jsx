import Head from "next/head";
import Link from "next/link";
import { ClipboardList, Sparkles, Phone, Mail, MapPin, CheckCircle2, Clock, Truck, CreditCard } from "lucide-react";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function OrderGuide() {
  const meta = {
    title: "Hướng Dẫn Đặt Hàng & Quy Trình May Đồng Phục - Đồng Phục Univi",
    description: "Hướng dẫn chi tiết quy trình đặt may đồng phục thiết kế và in theo yêu cầu tại Đồng Phục Univi. Hỗ trợ thiết kế miễn phí, may mẫu và giao hàng toàn quốc.",
    keywords: "hướng dẫn đặt hàng, quy trình đặt may đồng phục, thiết kế đồng phục, in đồng phục theo yêu cầu, đồng phục univi",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/huong-dan-dat-hang",
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
              <ClipboardList className="w-4 h-4 text-sky-600" />
              Quy Trình Đặt Hàng Chuyên Nghiệp
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              HƯỚNG DẪN ĐẶT HÀNG ĐỒNG PHỤC UNIVI
            </h1>
            <p className="mt-2.5 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Đơn giản - Nhanh chóng - Hỗ trợ thiết kế và may mẫu tận tâm từ A đến Z
            </p>
          </div>

          {/* Vertical Layout - Sections */}
          <div className="space-y-10">

            {/* ========================================================================= */}
            {/* SECTION 1: QUY TRÌNH 5 BƯỚC ĐẶT HÀNG ĐỒNG PHỤC */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    QUY TRÌNH 5 BƯỚC ĐẶT HÀNG ĐỒNG PHỤC
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                {/* Intro */}
                <p className="font-medium text-slate-800 text-justify sm:text-left bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  Để mang lại trải nghiệm đặt may đồng phục chuẩn xác, đúng ý tưởng và nhanh chóng nhất, Đồng Phục Univi xây dựng quy trình làm việc chuẩn hóa gồm 5 bước chuyên nghiệp:
                </p>

                {/* 5 Steps Process */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm text-sm">
                      01
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg text-sky-950">
                        Bước 1: Tiếp nhận yêu cầu & Tư vấn giải pháp
                      </h3>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Quý khách liên hệ qua Hotline/Zalo <strong>0834.204.999</strong> hoặc để lại thông tin trên website. Chuyên viên tư vấn của Univi sẽ lắng nghe nhu cầu về: loại áo (thể thao, chạy bộ, polo, công sở, áo gió...), số lượng dự kiến, ngân sách và mục đích sử dụng.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm text-sm">
                      02
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg text-sky-950">
                        Bước 2: Lên market thiết kế 2D & Báo giá chi tiết
                      </h3>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Đội ngũ thiết kế chuyên nghiệp của Univi lên bản vẽ phối màu, vị trí in/thêu logo thương hiệu hoàn toàn <strong>miễn phí</strong>. Đồng thời gửi kèm bảng báo giá chi tiết, các phương án chất liệu vải và bảng thông số size chuẩn để Quý khách lựa chọn.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm text-sm">
                      03
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg text-sky-950">
                        Bước 3: Chốt mẫu thiết kế, Ký hợp đồng & Đặt cọc
                      </h3>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Hai bên thống nhất maket thiết kế cuối cùng, chi tiết bảng phân bổ size áo (S, M, L, XL, 2XL...). Tiến hành ký hợp đồng hoặc xác nhận đơn đặt hàng, Quý khách đặt cọc theo thỏa thuận để xưởng bắt đầu đưa vào kế hoạch sản xuất.
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm text-sm">
                      04
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg text-sky-950">
                        Bước 4: Sản xuất hàng loạt & Kiểm định chất lượng (KCS)
                      </h3>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Xưởng tiến hành cắt may, in PET/in chuyển nhiệt công nghệ cao hoặc thêu vi tính theo đúng quy chuẩn. Bộ phận kiểm soát chất lượng (KCS) kiểm tra kỹ lưỡng từng đường chỉ, độ nét hình in, làm sạch chỉ thừa và là ủi phẳng phiu, đóng gói chuyên nghiệp.
                      </p>
                    </div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100 flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm text-sm">
                      05
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg text-sky-950">
                        Bước 5: Giao hàng tận nơi & Chăm sóc bảo hành
                      </h3>
                      <p className="text-slate-700 text-xs sm:text-sm">
                        Đơn hàng được giao đúng hẹn đến địa chỉ Quý khách yêu cầu trên toàn quốc. Quý khách đồng kiểm tra số lượng và chất lượng, thanh toán phần còn lại. Univi kích hoạt chính sách bảo hành sản phẩm may và hình in đồng hành lâu dài.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: THÔNG TIN CẦN CHUẨN BỊ, THANH TOÁN & TIẾN ĐỘ */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">
                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    THÔNG TIN CẦN CHUẨN BỊ, THANH TOÁN & TIẾN ĐỘ
                  </h2>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-7 text-slate-700 leading-relaxed text-sm sm:text-base">

                {/* 1. Thông tin cần chuẩn bị */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Thông tin Quý khách nên chuẩn bị trước
                  </h3>
                  <div className="space-y-3 pl-2 sm:pl-4">
                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        Thông tin nhu cầu sản phẩm:
                      </h4>
                      <ul className="space-y-1.5 pl-4 list-none text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Số lượng áo cần may và phân bổ size nam/nữ (nếu đã có).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Màu sắc mong muốn (theo bảng màu thương hiệu hoặc nhận diện sự kiện).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Yêu cầu chất liệu vải: Vải mè thể thao, thun lạnh 4 chiều, cá sấu Poly, Cotton 100%...</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-sky-50/40 p-4 rounded-xl border border-sky-100 space-y-2">
                      <h4 className="font-bold text-slate-900 text-sky-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        File thiết kế và logo thương hiệu:
                      </h4>
                      <ul className="space-y-1.5 pl-4 list-none text-xs sm:text-sm">
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>File logo gốc (Vector AI, Corel, PDF hoặc hình ảnh PNG/JPG độ phân giải cao).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold text-base leading-tight">•</span>
                          <span>Slogan, câu chữ hoặc danh sách tên/số in ấn riêng cho từng thành viên (nếu có).</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. Phương thức thanh toán */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Quy định đặt cọc & Phương thức thanh toán
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Quy định đặt cọc:</strong> Sau khi chốt thiết kế và số lượng, Quý khách đặt cọc từ <strong>30% - 50%</strong> giá trị đơn hàng để xưởng tiến hành mua vải và lên chuyền sản xuất.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Thanh toán đợt cuối:</strong> Thanh toán số tiền còn lại sau khi nhận bàn giao hàng, đồng kiểm tra đủ số lượng và chất lượng sản phẩm.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Hình thức thanh toán:</strong> Chuyển khoản ngân hàng chính thức, quét mã VietQR hoặc thanh toán tiền mặt trực tiếp tại xưởng; hỗ trợ xuất hóa đơn VAT điện tử đầy đủ theo quy định.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Thời gian sản xuất & Vận chuyển */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Thời gian sản xuất & Giao nhận hàng
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Thời gian sản xuất tiêu chuẩn:</strong> Từ <strong>3 - 7 ngày làm việc</strong> tùy thuộc vào số lượng và độ phức tạp của thiết kế.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Hỗ trợ may gấp sự kiện:</strong> Univi có chuyền sản xuất linh hoạt hỗ trợ các đơn hàng may gấp phục vụ giải đấu, sự kiện teambuilding trong <strong>24h - 48h</strong>.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        <strong>Chính sách giao hàng:</strong> Miễn phí vận chuyển nội thành Hà Nội và hỗ trợ phí ship ưu đãi cho khách hàng trên toàn quốc.
                      </p>
                    </div>
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
                    Tư Vấn & Báo Giá Nhanh 24/7
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Đội ngũ chuyên viên Đồng Phục Univi sẵn sàng hỗ trợ tư vấn chất liệu, thiết kế mẫu demo và gửi bảng giá ưu đãi nhất cho Quý khách:
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
