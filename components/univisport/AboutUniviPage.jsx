import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Target, Scale, Lightbulb, Zap, Network, Shirt, Building2, Users } from 'lucide-react';

const SectionHeader = ({ roman, title, highlight }) => (
  <div className="text-center mb-8">
    <h2 className="text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900 uppercase">
      {roman}{title && <> {title}</>}{highlight && <> <span className="text-[#105d97]">{highlight}</span></>}
    </h2>
    <div className="w-16 h-1 mx-auto mt-3 rounded-full bg-[#105d97]" />
  </div>
);

const StepCard = ({ number, title, children, accent }) => (
  <div className={`rounded-xl p-6 ${accent ? 'bg-blue-50 border-l-4 border-[#105d97]' : 'bg-gray-50'}`}>
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#105d97] flex items-center justify-center text-white font-bold text-sm">
        {number}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-base md:text-lg text-gray-900 mb-2">{title}</h4>
        {children}
      </div>
    </div>
  </div>
);

const Bullet = ({ children }) => (
  <li className="flex items-start gap-2 text-gray-700">
    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#105d97] flex-shrink-0" />
    {children}
  </li>
);

export default function AboutUniviPage() {
  return (
    <article className="max-w-none">

      {/* II. Định hướng & Mục tiêu */}
      <section className="py-6 md:py-12 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="II." title="Định hướng" highlight="phát triển và mục tiêu" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { title: 'ĐỊNH HƯỚNG PHÁT TRIỂN', body: 'Univi tập trung nghiên cứu và phát triển sản phẩm Đồng Phục Thể Thao, chú trọng vào chất liệu và mẫu mã phù hợp cho từng bộ môn thể thao.' },
            { title: 'MỤC TIÊU DÀI HẠN', body: 'Trở thành công ty niêm yết trên sàn chứng khoán, đồng thời triển khai phát triển hệ sinh thái Univi.' },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-7 rounded-full bg-[#105d97]" />
                <h3 className="font-medium text-gray-900">{card.title}</h3>
              </div>
              <p className="text-gray-700 leading-6">{card.body}</p>
            </div>
          ))}
        </div>

        {/* Giá trị cốt lõi */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="font-medium text-lg md:text-xl text-gray-900 text-center mb-6">GIÁ TRỊ CỐT LÕI</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: 'CHÂN THÀNH', desc: 'Nghĩ thẳng - nói thật', icon: CheckCircle },
              { title: 'TRÁCH NHIỆM', desc: 'Nghĩ tới - Làm tới', icon: Target },
              { title: 'KỶ LUẬT', desc: 'Nghĩ chuẩn - Làm đúng', icon: Scale },
              { title: 'SÁNG TẠO', desc: 'Nghĩ khác - Làm mới', icon: Lightbulb },
              { title: 'QUYẾT LIỆT', desc: 'Nghĩ nhanh - Làm nhanh', icon: Zap },
            ].map(({ title, desc, icon: Icon }) => (
              <div key={title} className="text-center bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#105d97] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-medium text-gray-900 text-xs mb-1">{title}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hệ sinh thái */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-lg md:text-xl text-gray-900 text-center mb-6">HỆ SINH THÁI UNIVI</h3>
          <p className="text-center text-gray-500 text-sm mb-6">Đa dạng thương hiệu phục vụ mọi nhu cầu</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { name: 'SPORT', desc: 'Thể thao chuyên nghiệp' },
              { name: 'ELEGANT', desc: 'Thời trang cao cấp' },
              { name: 'OFFICE', desc: 'Công sở lịch sự' },
              { name: 'KIDS', desc: 'Trẻ em năng động' },
              { name: 'UNDERWEAR', desc: 'Đồ lót tiện nghi' },
              { name: 'UNIFORM', desc: 'Đồng phục doanh nghiệp' },
            ].map(({ name, desc }) => (
              <div key={name} className="text-center bg-gray-50 rounded-xl p-3 hover:shadow-sm transition-shadow">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[#105d97]/10 flex items-center justify-center">
                  <Network className="w-5 h-5 text-[#105d97]" />
                </div>
                <p className="font-medium text-gray-900 text-xs mb-1">{name}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content paragraph */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <div className="bg-white rounded-2xl md:p-8 p-4 shadow-sm border border-gray-100 space-y-5">
          <p className="text-gray-700 leading-6 text-base">
            Trong giai đoạn <span className="font-semibold text-[#105d97]">2023 - 2028</span>, Univi tập trung nghiên cứu và phát triển sản phẩm Đồng Phục Thể Thao, chú trọng vào chất liệu và mẫu mã phù hợp cho từng bộ môn thể thao. Đồng thời, tối ưu hóa dịch vụ tư vấn và trải nghiệm khách hàng, cùng với quản lý thông tin và mối quan hệ khách hàng.
          </p>
          <p className="text-gray-700 leading-6 text-base">
            Với mục tiêu phát triển thương hiệu qua truyền thông, marketing và mở rộng cửa hàng trưng bày, Univi tăng cường độ phủ trên toàn quốc, đặc biệt là ở các khu kinh tế trọng điểm. Nâng cao năng lực sản xuất bằng việc mở rộng quy mô và đầu tư vào công nghệ cao, giúp tăng năng suất và chất lượng sản phẩm.
          </p>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <p className="text-gray-700 leading-6 font-medium">
              Mục tiêu lớn của Univi là duy trì quan hệ tốt với <span className="font-semibold text-[#105d97]">hàng trăm nghìn khách hàng</span> và đối tác trên cả nước. Chiến lược 2025-2028 nhấn mạnh việc trở thành lựa chọn hàng đầu trong mảng Đồng Phục Thể Thao và xây dựng thương hiệu mạnh mẽ trong ngành sản xuất thời trang tại Việt Nam.
            </p>
          </div>
        </div>
      </section>

      {/* III. Tầm nhìn chiến lược */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="III." title="Tầm nhìn chiến lược" />

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[
            { n: '01', title: 'Biểu tượng sáng tạo hàng đầu', sub: 'trong lĩnh vực Đồng Phục', icon: Lightbulb },
            { n: '02', title: 'Số 1 Đồng Phục Thể Thao', sub: 'tại Việt Nam', icon: Target },
            { n: '03', title: 'Kiến tạo thương hiệu', sub: 'qua Đồng Phục', icon: Network },
            { n: '04', title: 'Đồng Phục Toàn Diện', sub: 'cho doanh nghiệp', icon: CheckCircle },
            { n: '05', title: 'Ngôn ngữ thương hiệu', sub: 'mạnh mẽ nhất', icon: Zap },
          ].map(({ n, title, sub, icon: Icon }) => (
            <div key={n} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[#105d97] flex items-center justify-center text-white font-bold text-sm">
                {n}
              </div>
              <h4 className="font-medium text-gray-900 text-sm mb-1">{title}</h4>
              <p className="text-gray-500 text-xs">{sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-6 text-base">
            Univi định hướng trở thành <strong className="text-[#105d97]">biểu tượng sáng tạo hàng đầu</strong> trong lĩnh vực Đồng Phục tại Việt Nam, đặc biệt là mảng <strong className="text-[#105d97]">Đồng Phục Thể Thao chuyên sâu</strong>. Chúng tôi kiến tạo hình ảnh thương hiệu thông qua sự kết hợp tinh tế giữa:
          </p>
          <ul className="bg-gray-50 rounded-xl p-5 space-y-2">
            <Bullet><strong>Công nghệ sản xuất hiện đại</strong></Bullet>
            <Bullet><strong>Thiết kế đột phá mang dấu ấn riêng</strong></Bullet>
            <Bullet><strong>Giải pháp cá nhân hóa linh hoạt cho từng đội nhóm</strong></Bullet>
          </ul>
          <p className="text-gray-700 leading-6 text-base">
            Với tầm nhìn dài hạn, Univi không đơn thuần là một đơn vị sản xuất đồng phục, mà là <strong className="text-[#105d97]">người bạn đồng hành chiến lược</strong> – mang đến giải pháp <strong className="text-[#105d97]">đồng phục toàn diện</strong> cho các doanh nghiệp, tổ chức và cộng đồng yêu thể thao.
          </p>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <p className="text-gray-700 leading-6 italic">
              Chúng tôi tin rằng: <strong className="text-[#105d97]">khi đồng phục thể hiện được bản sắc – nó trở thành ngôn ngữ mạnh mẽ nhất để truyền tải giá trị của tập thể, đội nhóm.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* IV. Năng lực sản xuất */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="IV." title="Năng lực sản xuất" />

        <figure className="max-w-4xl mx-auto mb-8">
          <div className="overflow-hidden rounded-xl shadow-sm">
            <Image
              src="/images/gioi-thieu/nang-luc-san-xuat.jpg"
              alt="Phân xưởng sản xuất số 03 tại Hà Nội"
              width={800} height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-xl hover:scale-105 transition-transform duration-300"
            />
          </div>
          <figcaption className="text-center text-sm text-gray-500 pt-4 italic">
            Hình ảnh tại phân xưởng sản tại Hà Nội
          </figcaption>
        </figure>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-5">
            <p className="text-gray-700 leading-6">
              Xưởng may Univi là nơi kết tinh giữa <strong className="text-[#105d97]">công nghệ hiện đại</strong>, <strong className="text-[#105d97]">tay nghề tinh hoa</strong> cùng sự nghiên cứu chuyên sâu về chất liệu tạo nên sự khác biệt vượt trội trong ngành đồng phục tại Việt Nam.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Dây chuyền sản xuất tiên tiến', body: 'Với dây chuyền sản xuất tiên tiến được tối ưu hóa từng khâu, Univi không chỉ đảm bảo hiệu suất sản xuất vượt trội mà còn duy trì sự đồng nhất và hoàn hảo trong từng chi tiết sản phẩm.' },
              { title: 'Đội ngũ thợ lành nghề', body: 'Đội ngũ thợ lành nghề của chúng tôi không chỉ làm việc bằng kinh nghiệm mà còn bằng đam mê sáng tạo, luôn đặt chất lượng và sự hài lòng của khách hàng lên hàng đầu.' },
            ].map((c) => (
              <div key={c.title} className="bg-white rounded-xl p-5 border border-gray-100">
                <h4 className="font-medium text-gray-900 mb-2">{c.title}</h4>
                <p className="text-gray-700 leading-6">{c.body}</p>
              </div>
            ))}
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">
            <h4 className="font-medium text-gray-900 mb-2">Quy trình sản xuất khép kín</h4>
            <p className="text-gray-700 leading-6">
              Quy trình sản xuất khép kín của Univi không chỉ giúp đối tác tiết kiệm được các chi phí trung gian mà còn giảm thiểu rủi ro, đảm bảo mỗi sản phẩm khi rời khỏi xưởng đều là một thiết kế chuyên biệt chuẩn mực, khác biệt hoàn toàn với nhiều sản phẩm thị trường.
            </p>
          </div>
        </div>
      </section>

      {/* V. Quy trình lên mẫu */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="V." title="Quy trình lên mẫu đồng phục" />

        <div className="space-y-4">
          <StepCard number="1" title="Lên ý tưởng thiết kế áo đồng phục">
            <p className="text-gray-700 leading-6">
              Khách hàng cung cấp yêu cầu ban đầu về phong cách, màu sắc, logo, và nội dung muốn in/thêu trên áo. Univi hỗ trợ tư vấn và đề xuất các ý tưởng thiết kế phù hợp với bộ môn thể thao hoặc văn hóa và hình ảnh doanh nghiệp khách hàng.
            </p>
          </StepCard>
          <StepCard number="2" title="Giai đoạn thiết kế áo đồng phục">
            <p className="text-gray-700 leading-6">
              Bộ phận thiết kế tạo mẫu phác thảo (Mockup) dựa trên ý tưởng đã thống nhất. Khách hàng xem và duyệt mẫu thiết kế trước khi chuyển sang bước tiếp theo.
            </p>
          </StepCard>
          <StepCard number="3" title="Lựa chọn nguyên phụ liệu">
            <p className="text-gray-700 leading-6">
              Univi cung cấp chất liệu vải, loại sợi và màu sắc để khách hàng lựa chọn. Tư vấn các loại vải phù hợp với nhu cầu sử dụng. Univi cam kết tất cả vải sử dụng đều có kiểm định an toàn với da.
            </p>
          </StepCard>
          <StepCard number="4" title="Sản xuất">
            <ul className="space-y-2">
              <Bullet>Đối với mẫu có sẵn, Univi có thể giao hàng trong vòng <strong className="text-[#105d97]">3 ngày</strong> (bao gồm thời gian in Logo).</Bullet>
              <Bullet>Đối với đơn hàng thiết kế, thời gian gia công mẫu trong vòng <strong className="text-[#105d97]">2 ngày</strong> từ ngày chốt mẫu rập.</Bullet>
            </ul>
          </StepCard>
          <StepCard number="5" title="Kiểm tra và đánh giá" accent>
            <p className="text-gray-700 leading-6">
              Univi kiểm tra chất lượng sản phẩm theo tiêu chuẩn form dáng, đường may, màu sắc và logo. Khách hàng nhận áo mẫu để kiểm tra và duyệt lần cuối trước khi sản xuất toàn bộ đơn hàng.
            </p>
          </StepCard>
        </div>
      </section>

      {/* VI. Lĩnh vực hoạt động */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="VI." title="Lĩnh vực hoạt động của đồng phục Univi" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            {
              n: '1', title: 'ĐỒNG PHỤC THỂ THAO', icon: Shirt,
              items: ['Đồng phục HLV, PT dành cho các phòng tập', 'Đồng phục đội nhóm Yoga, Pilates, Aerobic,...', 'Đồng phục đội nhóm Pickleball, Tennis, Cầu lông, Bóng đá,...', 'Đồng phục giải chạy bộ', 'Đồng phục MMA, Boxing,...', 'Đồng phục bơi, cứu hộ,...'],
            },
            {
              n: '2', title: 'ĐỒNG PHỤC DOANH NGHIỆP', icon: Building2,
              items: ['Đồng phục Áo thun, áo Polo, áo Sơ mi, Vest,...', 'Đồng phục công sở/ văn phòng', 'Đồng phục Team building,...', 'Đồng phục Sự kiện'],
            },
            {
              n: '3', title: 'ĐỒNG PHỤC KHÁC', icon: Users,
              items: ['Đồng phục trường học', 'Đồng phục gia đình, du lịch,...', 'Đồng phục họp lớp', 'Đồng phục ngành nghề', 'Đồng phục bảo hộ lao động'],
            },
          ].map(({ n, title, icon: Icon, items }) => (
            <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 bg-[#105d97]/5 border-b border-gray-100 px-5 py-4">
                <div className="w-7 h-7 rounded-full bg-[#105d97] flex items-center justify-center text-white font-bold text-sm">{n}</div>
                <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
              </div>
              <div className="p-5">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-500" />
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  {items.map((item) => <Bullet key={item}>{item}</Bullet>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sub-sections: 1. Thể thao, 2. Doanh nghiệp, 3. Khác */}
      {[
        {
          n: '1', title: '1. Đồng phục thể thao',
          body1: <p className="text-gray-700 leading-6 text-base">Univi hiện đang tập trung cung cấp giải pháp <strong className="text-[#105d97]">Đồng Phục Thể Thao</strong>, đặc biệt tập trung vào thị trường Việt Nam với đối tượng chủ yếu là người tập thể thao, đội nhóm tập thể thao.</p>,
          body2: <p className="text-gray-700 leading-6 font-medium">Đồng phục Univi không ngừng cố gắng nghiên cứu để mang đến sản phẩm mang <strong className="text-[#105d97]">chất lượng Quốc tế</strong> nhưng giá lại <strong className="text-[#105d97]">phù hợp với người dùng Việt Nam</strong>.</p>,
          img: { src: '/images/gioi-thieu/dong-phuc-the-thao.jpg', alt: 'Đồng phục thể thao chất lượng cao từ Univi', h: 600 },
        },
        {
          n: '2', title: '2. Đồng phục doanh nghiệp',
          body1: <p className="text-gray-700 leading-6 text-base">Với xuất phát điểm là đơn vị sản xuất <strong className="text-[#105d97]">Đồng phục doanh nghiệp</strong>, Univi hiểu rằng thị trường đồng phục cho hội nhóm, cơ quan, tổ chức, và doanh nghiệp, nhu cầu chuyên nghiệp hóa ngày càng được ưu tiên.</p>,
          body2: <p className="text-gray-700 leading-6 font-medium">Univi, với phương châm luôn phát triển và đổi mới, hướng đến việc mở rộng thị phần <Link href="/dong-phuc-doanh-nghiep" legacyBehavior><a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">đồng phục doanh nghiệp</a></Link>. Công ty cung cấp đa dạng sản phẩm từ <strong className="text-[#105d97]">trung cấp đến cận cao cấp</strong>.</p>,
          imgs: [
            { src: '/images/gioi-thieu/dong-phuc-doanh-nghiep.jpg', alt: 'Đồng phục doanh nghiệp chuyên nghiệp từ Univi' },
            { src: '/images/gioi-thieu/dong-phuc-doanh-nghiep-2.jpg', alt: 'Các loại đồng phục khác từ Univi' },
          ],
        },
        {
          n: '3', title: '3. Đồng phục khác',
          body1: <p className="text-gray-700 leading-6 text-base">Đồng phục khác của <strong className="text-[#105d97]">UNIVI</strong> bao gồm các sản phẩm đa dạng như đồng phục sự kiện, đồng phục teambuilding, áo lớp, áo nhóm và các loại trang phục đặc thù theo yêu cầu. Với sự linh hoạt trong thiết kế và chất liệu cao cấp như <strong className="text-[#105d97]">Cotton, Polyester, hay Piquecool</strong>.</p>,
          body2: <p className="text-gray-700 leading-6 font-medium">Tất cả sản phẩm đều được sản xuất theo <strong className="text-[#105d97]">quy trình khép kín</strong>, đảm bảo chất lượng đồng nhất và an toàn cho người mặc.</p>,
          img: { src: '/images/gioi-thieu/dong-phuc-khac.jpg', alt: 'Các loại đồng phục khác từ Univi', h: 400 },
        },
      ].map(({ n, title, body1, body2, img, imgs }) => (
        <section key={n} className="py-6 px-4 md:px-12 container mx-auto">
          <h3 className="text-xl font-medium text-gray-900 mb-6">{title}</h3>
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-xl p-5">{body1}</div>
            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-[#105d97]">{body2}</div>
          </div>
          {img && (
            <figure className="max-w-4xl mx-auto">
              <div className="overflow-hidden rounded-xl shadow-sm">
                <Image src={img.src} alt={img.alt} width={800} height={img.h}
                  layout="responsive" sizes="(max-width: 800px) 100vw, 800px"
                  className="rounded-xl hover:scale-105 transition-transform duration-300" />
              </div>
            </figure>
          )}
          {imgs && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {imgs.map((im) => (
                <div key={im.src} className="overflow-hidden rounded-xl shadow-sm">
                  <Image src={im.src} alt={im.alt} width={800} height={600}
                    layout="responsive" sizes="(max-width: 768px) 100vw, 50vw"
                    className="rounded-xl hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}

      {/* VII. Cam kết */}
      <section className="py-6 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="VII." title="Cam kết của Univi" />

        <div className="space-y-4">
          <StepCard number="1" title="Thông Tin Rõ Ràng">
            <p className="text-gray-700 leading-6">
              Khi lựa chọn Đồng phục Univi, quý khách sẽ hoàn toàn yên tâm về sự minh bạch của chúng tôi. Tất cả thông tin liên quan như địa chỉ, số điện thoại, và tài khoản ngân hàng đều được công khai chi tiết.
            </p>
          </StepCard>
          <StepCard number="2" title="Chất Lượng Sản Phẩm Đặt Lên Hàng Đầu">
            <p className="text-gray-700 leading-6 mb-3">
              Chất lượng áo từ Đồng Phục Univi không chỉ đáp ứng yêu cầu mà còn cam kết không tính phí nếu sản phẩm không đạt chuẩn.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
              <strong>Các dòng vải cao cấp tại Univi:</strong> Polyamide, Polyester cao cấp (PET), Cotton 100%, Piquecool, Lacoste USA,…
            </div>
          </StepCard>
        </div>

        <figure className="max-w-4xl mx-auto my-6">
          <div className="overflow-hidden rounded-xl shadow-sm">
            <Image src="/images/gioi-thieu/chat-luong-san-pham.jpg" alt="Chất lượng sản phẩm đồng phục từ Univi"
              width={800} height={600} layout="responsive" sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-xl hover:scale-105 transition-transform duration-300" />
          </div>
        </figure>

        <div className="space-y-4">
          <StepCard number="3" title="An toàn với sức khỏe người mặc">
            <p className="text-gray-700 leading-6">Tất cả chất liệu vải mà Univi sử dụng đều được kiểm định an toàn với da.</p>
          </StepCard>


          <StepCard number="4" title="Giá Cả Hợp Lí Nhất">
            <p className="text-gray-700 leading-6">
              Tất cả sản phẩm của Univi đều có mức giá hợp lý. Cam kết chất lượng đi kèm mức giá hấp dẫn chỉ từ <strong className="text-[#105d97]">99.000 đ</strong> cho các sản phẩm trung cao cấp.
            </p>
          </StepCard>
          <StepCard number="5" title="Chế Độ Bảo Hành và Hậu Mãi" accent>
            <p className="text-gray-700 leading-6">
              Univi bảo hành chất lượng áo, logo,…, đội ngũ chăm sóc khách hàng chuyên nghiệp sẵn sàng hỗ trợ mọi vấn đề và giải đáp mọi thắc mắc của quý khách hàng.
            </p>
          </StepCard>

          <figure className="max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-xl shadow-sm">
              <Image src="/images/gioi-thieu/che-do-hau-mai.jpg" alt="Chế độ bảo hành và hậu mãi từ Univi"
                width={800} height={400} layout="responsive" sizes="(max-width: 800px) 100vw, 800px"
                className="rounded-xl hover:scale-105 transition-transform duration-300" />
            </div>
          </figure>
        </div>
      </section>

      {/* VIII. Univi vì cộng đồng */}
      <section className="py-6 pb-20 px-4 md:px-12 container mx-auto">
        <SectionHeader roman="VIII." title="Univi vì cộng đồng" />

        <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-[#105d97] mb-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#105d97] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-700 leading-6 text-base">
              <strong className="text-[#105d97]">Quỹ UNIVI vì cộng đồng</strong> được sáng lập ngày <strong className="text-[#105d97]">9/12/2023</strong> bởi thương hiệu Đồng phục UNIVI. Mục đích của quỹ nhằm hỗ trợ và giúp đỡ trẻ mồ côi, gia đình có hoàn cảnh khó khăn trên khắp mọi miền của Tổ Quốc.
            </p>
          </div>
        </div>

        <figure className="max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-xl shadow-sm">
            <Image src="/images/gioi-thieu/univi-vi-cong-dong.jpg" alt="Quỹ UNIVI vì cộng đồng"
              width={800} height={400} layout="responsive" sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-xl hover:scale-105 transition-transform duration-300" />
          </div>
        </figure>
      </section>
    </article>
  );
}
