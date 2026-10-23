import Head from "next/head";
import Link from "next/link";
import { ShieldCheck, Sparkles, Phone, Mail, MapPin, Clock, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import DefaultLayout from "../components/layout/DefaultLayout";

export default function WarrantyPolicy() {
  const meta = {
    title: "Chính Sách Bảo Hành Sản Phẩm & Hình In - Đồng Phục Univi",
    description: "Chính sách bảo hành toàn diện sản phẩm may và hình in tại Đồng Phục Univi. Cam kết bảo hành 100% lỗi sản xuất và hỗ trợ tối đa cho khách hàng.",
    keywords: "chính sách bảo hành, bảo hành may, bảo hành hình in, bảo hành đồng phục, đồng phục univi",
    robots: "index, follow",
    author: "Đồng Phục Univi",
    canonical: "https://dongphucunivi.com/chinh-sach-bao-hanh",
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
              Cam Kết Chất Lượng & Dịch Vụ
            </div>
            <h1 className="text-xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              CHÍNH SÁCH BẢO HÀNH ĐỒNG PHỤC UNIVI
            </h1>
            <p className="mt-2.5 text-slate-600 text-sm md:text-base max-w-2xl mx-auto">
              Minh bạch - Nhanh chóng - Bảo vệ tối đa quyền lợi và trải nghiệm của Quý khách hàng
            </p>
          </div>

          {/* Vertical Layout - Section 1 & Section 2 Stacked Top to Bottom */}
          <div className="space-y-10">

            {/* ========================================================================= */}
            {/* SECTION 1: CHÍNH SÁCH BẢO HÀNH SẢN PHẨM LỖI DO MAY */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">

                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    BẢO HÀNH SẢN PHẨM LỖI DO MAY
                  </h2>

                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
                {/* Intro */}
                <p className="font-medium text-slate-800 text-justify sm:text-left bg-sky-50/60 p-4 rounded-xl border border-sky-100">
                  Univi cam kết chịu trách nhiệm đối với các sản phẩm phát sinh lỗi kỹ thuật may hoặc lỗi thuộc về nhà sản xuất, nhằm đảm bảo quyền lợi và trải nghiệm tốt nhất cho khách hàng.
                </p>

                {/* 1. Các trường hợp được bảo hành */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Các trường hợp được bảo hành
                  </h3>
                  <p className="text-slate-700">
                    Univi tiếp nhận bảo hành đối với các lỗi được xác định phát sinh từ quá trình sản xuất, bao gồm:
                  </p>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span><strong>Bung, tuột hoặc lỗi đường may.</strong> - Bục đường chỉ bất thường do kỹ thuật may.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>May sai chi tiết, sai quy cách so với mẫu đã được hai bên xác nhận.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Lỗi khóa, cúc hoặc phụ kiện do quá trình sản xuất/lắp ráp.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Các lỗi kỹ thuật khác được Univi xác nhận thuộc trách nhiệm của nhà sản xuất.</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Thời gian bảo hành */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">2.</span> Thời gian bảo hành
                  </h3>
                  <div className="flex items-start gap-2 pl-4 sm:pl-6">
                    <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                    <p className="text-slate-700">
                      Trong vòng <strong>30 ngày</strong> kể từ ngày khách hàng nhận sản phẩm, nếu phát hiện lỗi thuộc trách nhiệm sản xuất, Univi sẽ bảo hành <strong>100% chi phí</strong> sửa chữa hoặc xử lý sản phẩm. Trường hợp lỗi không thể khắc phục nhưng được xác định rõ là lỗi từ nhà sản xuất, Univi sẽ xem xét đổi mới sản phẩm tương ứng để đảm bảo quyền lợi cho khách hàng.
                    </p>
                  </div>
                </div>

                {/* 3. Quy trình tiếp nhận */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Quy trình tiếp nhận
                  </h3>
                  <div className="space-y-2 pl-4 sm:pl-6">
                    <div className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <p className="text-slate-700">
                        Khi phát hiện sản phẩm có vấn đề, Quý khách vui lòng gửi cho Univi:
                      </p>
                    </div>
                    <div className="pl-6 space-y-1.5">
                      <p className="flex items-center gap-2 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        Hình ảnh/video thể hiện rõ vị trí lỗi.
                      </p>
                      <p className="flex items-center gap-2 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        Số lượng sản phẩm gặp lỗi.
                      </p>
                      <p className="flex items-center gap-2 text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                        Thông tin đơn hàng.
                      </p>
                    </div>
                    <p className="text-slate-700 pt-1">
                      Univi sẽ kiểm tra nguyên nhân và đưa ra phương án xử lý phù hợp trong thời gian sớm nhất.
                    </p>
                  </div>
                </div>

                {/* 4. Các trường hợp không thuộc phạm vi bảo hành */}
                <div className="space-y-2.5">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">4.</span> Các trường hợp không được bảo hành
                  </h3>
                  <div className="flex items-start gap-2 pl-4 sm:pl-6">
                    <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                    <p className="text-slate-700">
                      Chính sách không áp dụng đối với các trường hợp hư hỏng phát sinh do quá trình sử dụng hoặc bảo quản không đúng hướng dẫn như: rách do va quệt, tác động ngoại lực, sử dụng hóa chất/tẩy rửa mạnh, giặt hoặc sấy ở nhiệt độ không phù hợp, tự ý sửa chữa sản phẩm hoặc hao mòn tự nhiên trong quá trình sử dụng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 2: CHÍNH SÁCH BẢO HÀNH HÌNH IN */}
            {/* ========================================================================= */}
            <div className="relative bg-white rounded-3xl border-2 border-sky-400/80 shadow-[0_12px_36px_rgba(56,189,248,0.18)] overflow-hidden transition-all duration-300 hover:shadow-[0_16px_44px_rgba(56,189,248,0.25)]">
              {/* Header Badge Banner */}
              <div className="p-4 sm:p-6 pb-2">
                <div className="w-full bg-gradient-to-r from-sky-500 via-sky-400 to-sky-500 rounded-full py-3 px-4 sm:px-6 shadow-md flex items-center justify-center gap-2 sm:gap-3 text-white">

                  <h2 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wider text-center drop-shadow-sm">
                    CHÍNH SÁCH BẢO HÀNH HÌNH IN
                  </h2>

                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-8 pt-4 space-y-7 text-slate-700 leading-relaxed text-sm sm:text-base">

                {/* 1. Tuổi thọ hình in */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">1.</span> Tuổi thọ hình in:
                  </h3>
                  <p className="text-slate-700">
                    Univi hiện sử dụng công nghệ in PET, in lưới chuyển nhiệt cho phần lớn các sản phẩm đồng phục thể thao. Trong điều kiện sử dụng và bảo quản đúng hướng dẫn, hình in PET có tuổi thọ trung bình từ <strong>18 - 24 tháng</strong>, thậm chí lâu hơn tùy theo:
                  </p>
                  <ul className="space-y-1.5 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Tần suất sử dụng sản phẩm</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Môi trường làm việc và vận động</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Phương pháp giặt giũ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Điều kiện bảo quản của người sử dụng</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 italic bg-sky-50/50 p-3 rounded-lg border border-sky-100 text-xs sm:text-sm">
                    Do đặc thù đồng phục thể thao thường được sử dụng với tần suất cao, tiếp xúc nhiều với mồ hôi, ma sát và giặt thường xuyên nên độ bền thực tế của hình in sẽ có sự khác biệt giữa từng người dùng.
                  </p>
                </div>

                {/* 2. Hướng dẫn sử dụng để đảm bảo độ bền hình in */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    <span className="text-sky-600">2.</span> Hướng dẫn sử dụng để đảm bảo độ bền hình in
                  </h3>
                  <p className="text-slate-800 font-medium">
                    Để hình in và sản phẩm luôn bền đẹp trong quá trình sử dụng, Quý khách vui lòng lưu ý:
                  </p>
                  <ul className="space-y-2 pl-4 sm:pl-6 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Lộn trái sản phẩm trước khi giặt.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Ưu tiên giặt tay hoặc giặt máy bằng chế độ giặt nhẹ.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Không ngâm sản phẩm quá lâu trong nước hoặc các chất tẩy rửa mạnh.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Không giặt bằng nước nóng trên 40°C.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Phơi sản phẩm trong bóng mát hoặc nơi thoáng gió, tránh ánh nắng gắt trực tiếp trong thời gian dài.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Không sử dụng máy sấy nhiệt độ cao.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                      <span>Không ủi trực tiếp lên bề mặt hình in.</span>
                    </li>
                  </ul>
                  <p className="text-slate-700 bg-sky-50/50 p-3 rounded-lg border border-sky-100 text-xs sm:text-sm">
                    Univi luôn lựa chọn các vật tư in chất lượng cao nhằm đảm bảo tính thẩm mỹ và độ bền trong quá trình sử dụng. Tuy nhiên, độ bền của hình in vẫn chịu ảnh hưởng bởi tần suất sử dụng và cách bảo quản thực tế của người dùng.
                  </p>
                </div>

                {/* 3. Chính sách bảo hành */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-sky-600">3.</span> Chính sách bảo hành
                  </h3>
                  <div className="space-y-4 pl-1 sm:pl-2">
                    {/* Month 1 */}
                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
                      <p className="font-semibold text-slate-900 mb-1.5 text-sky-800">
                        Trong vòng 01 tháng kể từ ngày nhận hàng:
                      </p>
                      <div className="flex items-start gap-2 pl-3">
                        <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                        <p className="text-slate-700">
                          Univi <strong>bảo hành 100%</strong> đối với các trường hợp hình in bong tróc, nứt vỡ hoặc lỗi phát sinh do kỹ thuật sản xuất. Univi sẽ hỗ trợ xử lý và in lại theo đúng nội dung thiết kế ban đầu.
                        </p>
                      </div>
                    </div>

                    {/* Month 2 to 6 */}
                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
                      <p className="font-semibold text-slate-900 mb-1.5 text-sky-800">
                        Từ tháng thứ 2 đến tháng thứ 6 kể từ ngày nhận hàng:
                      </p>
                      <div className="flex items-start gap-2 pl-3">
                        <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                        <p className="text-slate-700">
                          Univi <strong>hỗ trợ 50% chi phí</strong> in lại đối với các trường hợp hình in xuống cấp bất thường sau khi đã được kiểm tra và xác nhận nguyên nhân lỗi do nhà sản xuất.
                        </p>
                      </div>
                    </div>

                    {/* After 12 Months */}
                    <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100">
                      <p className="font-semibold text-slate-900 mb-1.5 text-sky-800">
                        Sau 12 tháng kể từ ngày nhận hàng:
                      </p>
                      <div className="flex items-start gap-2 pl-3">
                        <span className="text-sky-500 font-bold text-lg leading-tight">•</span>
                        <p className="text-slate-700">
                          Nếu quý khách muốn in lại hình in trên áo cũ, Univi sẵn sàng hỗ trợ in lại, toàn bộ chi phí tẩy hình in và in mới khách hàng sẽ thanh toán 100%.
                        </p>
                      </div>
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
                    Hỗ Trợ Bảo Hành Nhanh Chóng
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Nếu sản phẩm có bất kỳ vấn đề gì cần bảo hành hoặc hỗ trợ kỹ thuật, Quý khách vui lòng liên hệ ngay với đội ngũ Chăm sóc khách hàng của Đồng phục Univi:
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
