import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';
import FabricCardComponent from '../FabricCardComponent';
import ProcessSteps from '../ProcessSteps';

const contactHref = '/lien-he';

const heroStats = [
  'Xưởng 2.000m² tại phường Chương Mỹ, Hà Nội',
  'Công suất 100.000 sản phẩm/tháng',
  'Lưu chuẩn tái sản xuất',
  'Thiết kế miễn phí',
];

const trustBadges = [
  ['Xưởng sản xuất 2.000m² tại phường Chương Mỹ, Hà Nội', 'Chủ động sản xuất, QC và tiến độ cho đơn B2B.'],
  ['Công suất 100.000 sản phẩm/tháng', 'Phù hợp CLB, phòng tập, giải đấu và doanh nghiệp lớn.'],
  ['Quy trình lưu chuẩn', 'Hỗ trợ đối tác xây dựng hệ áo khoác thống nhất từ lần đặt đầu đến các đợt bổ sung sau.'],
  ['Đặt từ 10 áo ở dòng phù hợp', 'Đội nhóm nhỏ có thể bắt đầu gọn, dễ kiểm chứng mẫu.'],
  ['Thiết kế miễn phí', 'Dễ lên concept màu, logo, tên, số và nhà tài trợ.'],
  ['Tiên phong giải pháp', 'Cung cấp giải pháp đồng phục thể thao cho chuỗi phòng tập và đội nhóm tại Việt Nam.'],
];

export const aoGioFaqs = [
  ['Nên chọn áo gió 1 lớp hay 2 lớp?', 'Chọn áo gió 1 lớp khi cần nhẹ, gấp gọn và vận động nhiều. Chọn áo gió 2 lớp khi cần độ che phủ, đứng form và giữ nhiệt nhẹ hơn.'],
  ['Số lượng đặt đồng phục áo gió tối thiểu là bao nhiêu?', 'Số lượng tối thiểu phụ thuộc mẫu và mức tùy chỉnh. Một số chính sách áp dụng từ 10 sản phẩm; mẫu thiết kế riêng có thể yêu cầu số lượng cao hơn.'],
  ['Univi có hỗ trợ thiết kế đồng phục áo gió miễn phí không?', 'Có. Univi hỗ trợ tư vấn và thiết kế theo màu sắc, logo và mục tiêu sử dụng của đội nhóm.'],
  ['Có thể đặt bổ sung đồng phục áo gió sau này không?', 'Có. Univi lưu cấu hình màu, chất liệu, form, size và vị trí logo để hỗ trợ tái sản xuất, tùy độ sẵn có của vật liệu tại thời điểm đặt.'],
  ['Thời gian sản xuất đồng phục áo gió bao lâu?', 'Tiến độ phụ thuộc số lượng, tồn vật liệu, thời gian duyệt mẫu và kỹ thuật logo. Mốc 2–3 ngày cho mẫu sẵn và 10–12 ngày cho mẫu mới chỉ mang tính tham khảo.'],
  ['Univi có giao đồng phục áo gió toàn quốc không?', 'Có. Univi hỗ trợ giao hàng toàn quốc và có thể đóng gói theo danh sách cơ sở hoặc thành viên.']
];

function Section({ id, title, children, className = '' }) {
  return (
    <article
      id={id}
      className={`scroll-mt-24 bg-white py-4 ${className}`}
    >
      <h2 className="mb-3 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
        {title}
      </h2>
      {children}
    </article>
  );
}

function TextCard({ title, children }) {
  return (
    <div className="border-l-4 border-[#105d97]/20 py-1 pl-4">
      <h3 className="mb-1 text-base font-medium text-gray-900">{title}</h3>
      <div className="text-sm leading-6 text-gray-700 md:text-base">{children}</div>
    </div>
  );
}

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left font-semibold text-gray-900">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row) => (
            <tr key={row.join('-')}>
              {row.map((cell, index) => (
                <td key={`${cell}-${index}`} className="px-4 py-3 align-top text-gray-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ImageBlock({ src, alt, caption }) {
  return (
    <figure className="overflow-hidden my-4">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 900px"
      />
      <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function AoGioUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="text-gray-700">
      <section className="bg-white pb-8">
        <p className="mb-2 text-xs font-medium text-[#105d97] uppercase tracking-[0.15em]">Đồng phục thể thao Univi</p>
        <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight text-gray-900">
          May Đồng Phục Áo Gió Thể Thao Theo Yêu Cầu Cho Doanh Nghiệp Và Đội Nhóm
        </h2>
        <div className="mt-4 text-base leading-6 text-gray-700 space-y-2">
          <p>
            Một chiếc đồng phục áo gió dùng cho đội nhóm phải làm được nhiều hơn việc che gió. Sản phẩm cần đủ nhẹ để vận động, phù hợp thời tiết sử dụng, giữ hình ảnh chỉn chu và thể hiện đúng màu sắc thương hiệu. Nếu chọn sai cấu trúc, áo có thể bí khi chạy bộ, quá mỏng khi di chuyển sáng sớm hoặc nhanh mất tính đồng bộ khi đặt bổ sung.
          </p>
          <p>
            Vì vậy, đồng phục áo gió nên được xem là một phần của hệ nhận diện, không phải món quà tặng mua theo cảm tính. Sản phẩm phù hợp cho CLB thể thao, phòng Gym, Fitness Center, Yoga–Pilates Studio, đội Pickleball, Running Club, doanh nghiệp, sự kiện ngoài trời và chương trình team building.
          </p>

        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="rounded border border-[#105d97] bg-[#105d97] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0e4f82]"
          >
            Nhận báo giá
          </button>
          <Link
            href="#cac-dong-ao-gio"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#105d97] hover:text-[#105d97]"
          >
            Xem các dòng áo gió
          </Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {heroStats.map((stat) => (
            <span key={stat} className="rounded border border-gray-200 px-3 py-1 text-sm text-gray-700">
              {stat}
            </span>
          ))}
        </div>
      </section>

      <Section id="trust-badge" title="Năng lực sản xuất Univi" className="border-t border-gray-100">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trustBadges.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="xu-huong-doi-nhom" title="1. Vì Sao Đồng Phục Áo Gió Đang Trở Thành Xu Hướng Của Các Đội Nhóm?">
        <p className="mb-4 leading-6">
          Đồng phục áo gió nằm ở giao điểm giữa trang phục vận động, lớp bảo vệ ngoài trời và phương tiện nhận diện. Một đội chạy có thể mặc áo khi khởi động sáng sớm. Nhân sự phòng tập dùng áo khi di chuyển hoặc tổ chức sự kiện. Doanh nghiệp có thể sử dụng trong outing, giải chạy nội bộ và hoạt động cộng đồng. Một sản phẩm vì thế tạo ra nhiều điểm chạm thương hiệu hơn áo chỉ dùng trong một ngày.
        </p>
        <div className="my-6">
          <div className="relative w-full container mx-auto aspect-[9/16] md:aspect-[16/9] bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
            <div className="h-full aspect-[9/16] relative">
              <iframe
                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent("https://www.facebook.com/reel/4066273986958048")}&show_text=false&width=500&height=888`}
                width="100%"
                height="100%"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
          <p className="px-4 py-3 text-center text-sm italic text-gray-500">
            Áo gió giúp đội nhóm đồng bộ trong nhiều bối cảnh ngoài trời
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <TextCard title="1.1 Đồng Bộ Hình Ảnh Thương Hiệu">
            <p>
              Màu áo, logo, form dáng và chi tiết phối giúp đội nhóm xuất hiện nhất quán trong ảnh tập thể, video sự kiện và hoạt động hằng ngày. Với doanh nghiệp hoặc CLB nhiều thành viên, sự đồng bộ còn giúp người tham dự nhận ra ban tổ chức, huấn luyện viên và nhóm hỗ trợ.
            </p>
            <p className="mt-2">
              Hiệu quả nhận diện không đến từ việc in logo thật lớn. Logo cần nằm ở vị trí dễ nhìn nhưng không bị gấp, kéo hoặc che bởi dây đeo. Bảng màu nên bám nhận diện chính và có phương án tương phản đủ rõ khi chụp ngoài trời.
            </p>
          </TextCard>

          <TextCard title="1.2 Bảo Vệ Người Mặc Khi Tập Luyện Ngoài Trời">
            <p>
              Bề mặt vải dệt khít giúp hạn chế luồng gió tác động trực tiếp lên cơ thể. Với cấu hình phù hợp, áo còn có thể hỗ trợ trượt nước nhẹ trong mưa phùn hoặc sương. Đây không phải áo mưa chuyên dụng; mức cản gió và kháng nước phải được xác nhận theo từng mã vải, mẫu thử và điều kiện sử dụng.
            </p>
            <p className="mt-2">
              Người chạy bộ, đạp xe hoặc chơi thể thao ngoài trời nên ưu tiên form gọn, trọng lượng thấp và khả năng điều chỉnh độ thoáng bằng khóa kéo. Chi tiết phản quang cũng đáng cân nhắc nếu đội thường tập sáng sớm hoặc buổi tối. Tham khảo thêm hệ <Link href="/dong-phuc-chay-bo" className="text-[#105d97] font-semibold hover:underline">đồng phục chạy bộ</Link> để phối áo gió với áo chạy, quần short và phụ kiện theo cùng nhận diện.
            </p>
          </TextCard>

          <TextCard title="1.3 Tăng Tính Chỉn Chu Khi Tổ Chức Sự Kiện">
            <p>
              Trong team building, giải đấu hoặc ngày hội thể thao, đồng phục áo gió giúp ban tổ chức và thành viên có diện mạo thống nhất dù thời tiết thay đổi. Khác áo thun sự kiện chỉ phù hợp khi trời nóng, áo khoác có thể dùng lúc di chuyển, chờ khai mạc, nghỉ giữa hoạt động và sau chương trình.
            </p>
            <p className="mt-2">
              Giá trị sử dụng dài hơn giúp doanh nghiệp tránh biến đồng phục thành vật phẩm dùng một lần. Khi thiết kế đủ gọn và màu sắc dễ phối, nhân sự có thể tiếp tục mặc sau sự kiện. Thương hiệu nhờ đó xuất hiện tự nhiên hơn trong đời sống hằng ngày.
            </p>
          </TextCard>

          <TextCard title="1.4 Dễ Phối Cùng Hệ Đồng Phục Hiện Có">
            <p>
              Đồng phục áo gió không cần thay thế toàn bộ hệ trang phục. Nó là lớp ngoài bổ sung cho hệ đang vận hành: áo polo cho PT và quản lý; áo thun cho hội viên; áo gió cho đội ngũ di chuyển, tổ chức sự kiện hoặc làm việc ngoài trời.
            </p>
            <p className="mt-2">
              Với phòng tập, cách phối này phù hợp tư duy giải pháp <Link href="/giai-phap-2s" className="text-[#105d97] font-semibold hover:underline">giải pháp 2S Uniform</Link>: Staff Uniform cho HLV, PT, lễ tân, quản lý; Student/Member Uniform cho hội viên và cộng đồng. Cùng một hệ màu nhưng khác cấu trúc sản phẩm giúp người nhìn nhận ra thương hiệu và vai trò mà không tạo cảm giác tất cả phải mặc giống hệt nhau.
            </p>
          </TextCard>
        </div>
      </Section>

      <Section id="doi-tuong-su-dung" title="2. Những Đơn Vị Nào Nên Sử Dụng Đồng Phục Áo Gió?">
        <p className="mb-4 leading-6">
          Không phải đơn vị nào cũng cần cùng một loại đồng phục áo gió. Môi trường tập, thời gian sử dụng, mức vận động và mục tiêu hình ảnh sẽ quyết định nên chọn áo một lớp, hai lớp hay siêu nhẹ.
        </p>
        <ImageBlock
          src="https://live.staticflickr.com/65535/55342774364_05dbcee2cb_b.jpg"
          alt="Các đơn vị phù hợp sử dụng đồng phục áo gió"
          caption="Mỗi mô hình cần một cấu hình áo gió khác nhau"
        />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <TextCard title="2.1 Phòng Gym Và Fitness Center">
            <p>
              Phòng Gym có thể dùng đồng phục áo gió cho quản lý, PT, HLV tham gia sự kiện ngoài trời hoặc đội đại diện trong giải đấu. Áo khoác cũng hữu ích khi nhân sự di chuyển giữa các cơ sở, làm activation hoặc đồng hành cùng khách hàng trong giải chạy.
            </p>
            <p className="mt-2">
              Để hệ nhận diện không rời rạc, màu áo nên liên kết với <Link href="/dong-phuc-gym" className="text-[#105d97] font-semibold hover:underline">đồng phục Gym</Link> và <Link href="/dong-phuc-fitness-center" className="text-[#105d97] font-semibold hover:underline">đồng phục Fitness Center</Link> hiện có. Logo, font chữ, màu phụ và cách phân vai cần được quy chuẩn ngay từ bản thiết kế.
            </p>
          </TextCard>

          <TextCard title="2.2 Yoga Và Pilates Studio">
            <p>
              Giáo viên Yoga hoặc Pilates thường cần một lớp khoác nhẹ trước và sau buổi tập, đặc biệt khi di chuyển từ môi trường nóng sang phòng điều hòa. Áo nên mềm, nhẹ, dễ tháo mặc và không có chi tiết cứng gây cấn khi mang theo.
            </p>
            <p className="mt-2">
              Studio có thể phối đồng phục áo gió với <Link href="/dong-phuc-yoga-pilates" className="text-[#105d97] font-semibold hover:underline">đồng phục Yoga–Pilates</Link> theo cùng bảng màu. Cấu trúc siêu nhẹ phù hợp workshop, retreat hoặc lớp ngoài trời; cấu trúc hai lớp phù hợp di chuyển sáng sớm và thời tiết lạnh hơn.
            </p>
          </TextCard>

          <TextCard title="2.3 Câu Lạc Bộ Pickleball">
            <p>
              Đồng phục áo gió phù hợp giai đoạn khởi động, nghỉ giữa trận, di chuyển tới sân hoặc tham gia giải giao lưu. Form cần đủ gọn để không vướng tay, đồng thời có thể phối cùng polo, váy, short hoặc quần jogger.
            </p>
            <p className="mt-2">
              CLB nên chọn màu nổi vừa đủ để nhận diện ngoài sân và logo không bị mất nét ở khoảng cách xa. Các mã AGBG01, AGBG02 và GAG1-2-3 có thể phối cùng <Link href="/dong-phuc-pickleball" className="text-[#105d97] font-semibold hover:underline">đồng phục Pickleball</Link> để tạo set đầy đủ cho vận động viên, HLV và ban tổ chức.
            </p>
          </TextCard>

          <TextCard title="2.4 Doanh Nghiệp Tổ Chức Team Building">
            <p>
              Với doanh nghiệp, đồng phục áo gió có thể phục vụ team building, outing, giải thể thao nội bộ, quà tặng nhân sự và chương trình cộng đồng. Nên ưu tiên form dễ mặc cho nhiều vóc dáng, bảng size rõ và thiết kế không quá thiên về một bộ môn.
            </p>
            <p className="mt-2">
              Nếu thời gian chương trình ngắn, doanh nghiệp cần chốt sớm số lượng, size, màu, kỹ thuật logo và phương án đóng gói. Tiến độ chỉ nên cam kết sau khi mẫu và vật liệu được duyệt, vì thay đổi thiết kế giữa quá trình sản xuất thường làm tăng rủi ro giao chậm.
            </p>
          </TextCard>

          <div className="md:col-span-2">
            <TextCard title="2.5 Đội Chạy Bộ Và Câu Lạc Bộ Thể Thao">
              <p>
                Running Club, đội đạp xe, trekking, Tennis hoặc Golf thường cần lớp áo ngoài dễ gấp gọn. Người mặc có thể cởi áo khi cơ thể nóng lên, vì vậy trọng lượng và kích thước sau khi gấp quan trọng không kém khả năng cản gió.
              </p>
              <p className="mt-2">
                Với đội chạy, nên kiểm tra áo trong các động tác vung tay, cúi người và chạy nhẹ. Gấu áo không nên cuộn; vai không được kéo căng; khóa kéo không cấn cổ; túi không làm đồ vật nảy quá nhiều. Đó là các chi tiết nhỏ nhưng quyết định người dùng có tiếp tục mặc áo sau sự kiện hay không.
              </p>
            </TextCard>
          </div>
        </div>
      </Section>

      <Section id="cac-dong-ao-gio" title="3. Các Dòng Đồng Phục Áo Gió Phổ Biến Hiện Nay">
        <p className="mb-4 leading-6">
          Ba nhóm đồng phục áo gió phổ biến là một lớp, hai lớp và siêu nhẹ. Tên nhóm chỉ mô tả cấu trúc chung; độ dày, trọng lượng, độ thoáng và khả năng kháng nước vẫn phụ thuộc mã vải cụ thể.
        </p>
        <ImageBlock
          src="/images/so-sanh-3-mau-ao-gio.png"
          alt="So sánh áo gió 1 lớp 2 lớp và áo gió siêu nhẹ"
          caption="Ba cấu trúc áo gió phổ biến cho đội nhóm"
        />
        <div className="grid gap-6 mt-6">
          <div className="border-l-4 border-[#105d97]/20 py-1 pl-4">
            <h3 className="mb-1 text-base font-medium text-gray-900">3.1 Đồng Phục Áo Gió 1 Lớp</h3>
            <p className="text-sm leading-6 text-gray-700 md:text-base">
              Đồng phục áo gió một lớp có cấu trúc gọn, nhẹ và dễ đóng gói. Đây là lựa chọn thực tế cho chạy bộ, team building, sự kiện, đội hỗ trợ hoặc đơn vị cần số lượng lớn nhưng vẫn muốn sản phẩm có giá trị sử dụng sau chương trình.
            </p>
            <p className="text-sm leading-6 text-gray-700 md:text-base mt-2">
              Mẫu <Link href="/san-pham/dong-phuc-ao-gio-1-lop" className="text-[#105d97] font-semibold hover:underline">đồng phục áo gió 1 lớp AGBG01</Link> phù hợp CLB Pickleball, Tennis, Golf và đội nhóm thể thao. AGBG01A là phiên bản cropped trẻ trung, định hướng cản gió, nhanh khô và hỗ trợ trượt nước nhẹ; phù hợp nhóm nữ, phòng tập và team building cần phong cách hiện đại.
            </p>
            <p className="text-sm leading-6 text-gray-700 md:text-base mt-2 italic text-gray-500">
              Hạn chế của áo một lớp là khả năng giữ ấm thấp hơn áo hai lớp. Nếu hoạt động diễn ra lâu trong gió lạnh hoặc người mặc ít vận động, cần cân nhắc cấu trúc có lót.
            </p>
          </div>

          <div className="border-l-4 border-[#105d97]/20 py-1 pl-4">
            <h3 className="mb-1 text-base font-medium text-gray-900">3.2 Đồng Phục Áo Gió 2 Lớp</h3>
            <p className="text-sm leading-6 text-gray-700 md:text-base">
              Đồng phục áo gió hai lớp có lớp ngoài cản gió và lớp trong tăng độ che phủ, giúp áo đứng form hơn. Lớp trong có thể là lưới hoặc vật liệu lót khác tùy cấu hình. Loại này phù hợp di chuyển ngoài trời, hoạt động sáng sớm, sự kiện mùa lạnh và đội nhóm muốn hình ảnh chỉn chu hơn.
            </p>
            <p className="text-sm leading-6 text-gray-700 md:text-base mt-2">
              Mẫu <Link href="/san-pham/dong-phuc-ao-gio-2-lop-agbg02" className="text-[#105d97] font-semibold hover:underline">áo gió hai lớp AGBG02</Link> có mũ liền, khóa kéo, bo chun và có thể phối quần jogger đồng bộ. Dòng này phù hợp Pickleball, Tennis, Golf, Running nhẹ, học viện thể thao và doanh nghiệp.
            </p>
            <p className="text-sm leading-6 text-gray-700 md:text-base mt-2 italic text-gray-500">
              Áo hai lớp nặng và chiếm diện tích hơn áo siêu nhẹ. Khi dùng cho hoạt động cường độ cao, cần kiểm tra khả năng thoát nhiệt, độ rộng nách và thiết kế thông khí để tránh bí.
            </p>
          </div>

          <div className="border-l-4 border-[#105d97]/20 py-1 pl-4">
            <h3 className="mb-1 text-base font-medium text-gray-900">3.3 Đồng Phục Áo Gió Siêu Nhẹ</h3>
            <p className="text-sm leading-6 text-gray-700 md:text-base">
              Đồng phục áo gió siêu nhẹ ưu tiên trọng lượng thấp, gấp gọn và mang theo dễ dàng. Dòng này phù hợp runner, người đạp xe, trekking, đội thể thao thường di chuyển hoặc sự kiện cần phát áo ngay tại điểm tập trung.
            </p>
            <p className="text-sm leading-6 text-gray-700 md:text-base mt-2">
              Mẫu <Link href="/san-pham/ao-gio-sieu-nhe-gag1-2-3" className="text-[#105d97] font-semibold hover:underline">áo gió siêu nhẹ GAG1-2-3</Link> có thiết kế mũ liền, khóa kéo và form gọn. Sản phẩm có thể phối với quần jogger, short thể thao, áo thun hoặc bra để tạo set đồng phục hoàn chỉnh.
            </p>
            <p className="text-sm leading-6 text-gray-700 md:text-base mt-2 italic text-gray-500">
              “Siêu nhẹ” không đồng nghĩa với phù hợp mọi thời tiết. Vải mỏng thường ưu tiên tính cơ động hơn giữ nhiệt. Đội nhóm nên thử mẫu trong điều kiện gần nhất với thực tế trước khi duyệt số lượng lớn.
            </p>
          </div>
        </div>
      </Section>

      <Section id="chon-chat-lieu" title="4. Cách Chọn Chất Liệu Đồng Phục Áo Gió">
        <p className="mb-4 leading-6">
          Tên thương mại của vải chưa đủ để quyết định. Khi duyệt vật liệu, cần đánh giá ít nhất năm yếu tố: cảm giác chạm, độ thoáng, cách quản lý hơi ẩm, độ co giãn và bối cảnh sử dụng. Với đồng phục áo gió, cần bổ sung trọng lượng, độ cản gió, mức trượt nước và tiếng sột soạt khi vận động.
        </p>
        <ImageBlock
          src="https://live.staticflickr.com/65535/55359817861_3bdf75b8fb_b.jpg"
          alt="Chất liệu may đồng phục áo gió cản gió kháng nước nhẹ"
          caption="Chọn vải theo cảm giác, độ thoáng và môi trường sử dụng"
        />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <TextCard title="4.1 Vải Micro Polyester">
            <p>
              Micro Polyester thường có sợi nhỏ, bề mặt tương đối mịn, nhẹ và nhanh khô. Cảm giác mặc gọn hơn nhóm vải dày; độ thoáng phụ thuộc mật độ dệt và cấu trúc hoàn thiện. Vải Polyester không tự động “thoát ẩm tốt”, vì vậy phải kiểm tra từng mã thay vì chỉ nhìn thành phần.
            </p>
            <p className="mt-2">
              Loại này phù hợp áo một lớp, sự kiện, team building và hoạt động cần gấp gọn. Nếu người mặc vận động nhiều, nên ưu tiên cấu trúc hỗ trợ khô nhanh và có đường thoát khí. <Link href="/cong-nghe-uni-dry" className="text-[#105d97] font-semibold hover:underline">Công nghệ UNI DRY</Link> là hướng xử lý đưa hơi ẩm từ mặt trong ra ngoài để giảm cảm giác bết; việc có áp dụng hay không phải xác nhận theo mã sản phẩm.
            </p>
          </TextCard>

          <TextCard title="4.2 Vải Dù Cản Gió">
            <p>
              “Vải dù” là tên gọi thị trường cho nhiều cấu trúc Polyester hoặc Nylon dệt khít. Ưu điểm là cản gió, nhẹ, bền và dễ vệ sinh. Cảm giác có thể hơi khô hoặc phát tiếng khi ma sát; độ thoáng thường thấp hơn vải áo thun thể thao.
            </p>
            <p className="mt-2">
              Vải dù phù hợp áo khoác một lớp, áo sự kiện và lớp ngoài của áo hai lớp. Khi chọn, cần thử độ mềm, độ nhăn, tiếng vải, khả năng in/thêu và mức bí khi vận động. Với đội chạy hoặc đạp xe, form và khe thông khí có thể quan trọng hơn việc tăng độ dày.
            </p>
          </TextCard>

          <TextCard title="4.3 Vải Tráng PU Chống Thấm Nhẹ">
            <p>
              Lớp phủ PU có thể giúp bề mặt hạn chế thấm nước tốt hơn trong mưa nhỏ hoặc sương. Đổi lại, lớp phủ thường làm giảm độ thoáng và có thể thay đổi cảm giác vải. Khả năng chống nước thực tế còn phụ thuộc đường may, khóa kéo, áp lực nước và độ bền lớp phủ sau giặt.
            </p>
            <p className="mt-2">
              Vì vậy, nên mô tả đúng là “kháng nước” or “hỗ trợ trượt nước nhẹ” nếu chưa có chỉ số kiểm định chống nước. Dòng này phù hợp nhân sự di chuyển ngoài trời và sự kiện có nguy cơ gặp mưa nhỏ; không nên thay thế áo mưa chuyên dụng.
            </p>
          </TextCard>

          <TextCard title="4.4 Vải Co Giãn Thể Thao">
            <p>
              Vải có Spandex hoặc cấu trúc đàn hồi giúp vai, lưng và khuỷu tay cử động dễ hơn. Cảm giác mặc linh hoạt, ít kéo căng khi vung tay; khả năng thoáng và quản lý mồ hôi phụ thuộc sợi nền cùng công nghệ hoàn thiện.
            </p>
            <p className="mt-2">
              Đây là lựa chọn phù hợp cho đồng phục áo gió form ôm, Running, Cycling và đội nhóm cần vận động biên độ lớn. Tuy nhiên, co giãn nhiều có thể làm tăng chi phí và ảnh hưởng kỹ thuật logo. Mẫu thử cần được kiểm tra khi kéo, gập và giặt để bảo đảm hình in không nứt, logo không biến dạng.
            </p>
          </TextCard>
        </div>

        <div className="mt-6">
          <SimpleTable
            headers={['Nhu cầu sử dụng', 'Cấu trúc gợi ý', 'Tiêu chí cần kiểm tra']}
            rows={[
              ['Chạy bộ', 'Siêu nhẹ, form gọn', 'Trọng lượng, thông khí, phản quang, gấp gọn'],
              ['Team building', 'Dù một lớp', 'Dễ mặc, độ bền màu, in logo, bảng size'],
              ['Di chuyển ngoài trời', 'Hai lớp hoặc vải kháng nước nhẹ', 'Cản gió, độ thoáng, mũ, khóa kéo'],
              ['Mùa lạnh', 'Hai lớp có lót', 'Giữ nhiệt nhẹ, thoát ẩm, không quá nặng'],
              ['Pickleball/Tennis', 'Một lớp hoặc siêu nhẹ', 'Biên độ vai, độ gọn, dễ tháo mặc'],
              ['Trekking/đạp xe', 'Siêu nhẹ, có đàn hồi', 'Gấp gọn, cản gió, phản quang, túi an toàn']
            ]}
          />
        </div>

        <div className="mt-6">
          <FabricCardComponent />
        </div>
      </Section>

      <Section id="quy-trinh" title="5. Quy Trình Thiết Kế Và Sản Xuất Đồng Phục Áo Gió Tại Univi">
        <p className="mb-4 leading-6">
          Quy trình rõ ràng giúp giảm ba rủi ro phổ biến: chọn sai cấu trúc, logo không phù hợp bề mặt vải và đơn bổ sung bị lệch so với đơn đầu. Univi triển khai theo bảy bước:
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-5">
          <ol className="list-decimal pl-5 space-y-2 text-sm md:text-base text-gray-700">
            <li><strong>Tiếp nhận yêu cầu:</strong> xác định người mặc, môi trường, thời gian sử dụng, ngân sách, số lượng, bảng size và lịch bàn giao.</li>
            <li><strong>Tư vấn hệ đồng phục:</strong> phân vai áo cho quản lý, HLV, thành viên, ban tổ chức hoặc khách mời; xác định đồng phục áo gió đứng độc lập hay phối cùng polo, T-shirt, jogger.</li>
            <li><strong>Thiết kế miễn phí:</strong> dựng mockup theo logo, màu thương hiệu, vị trí nhận diện và yêu cầu tài trợ. Thiết kế cần tính tới nếp gấp, khóa, túi và biên độ vận động.</li>
            <li><strong>Chọn chất liệu:</strong> so sánh cảm giác, độ thoáng, khả năng quản lý ẩm, độ co giãn và điều kiện sử dụng; không chọn chỉ bằng tên vải.</li>
            <li><strong>Duyệt mẫu:</strong> kiểm tra màu, form, size, logo, khóa kéo, mũ, bo chun, túi và trải nghiệm vận động. Đơn vị nên cho người mặc thật thử trước khi duyệt.</li>
            <li><strong>Sản xuất và kiểm soát chất lượng:</strong> triển khai theo mẫu đã chốt, kiểm tra các chi tiết chính trong quá trình hoàn thiện và trước bàn giao.</li>
            <li><strong>Bàn giao, lưu chuẩn tái sản xuất:</strong> lưu file thiết kế, mã màu, mã vải, thông số size, vị trí logo và cấu hình hoàn thiện để hỗ trợ đặt bổ sung.</li>
          </ol>
        </div>
        <p className="leading-6 text-sm md:text-base text-gray-700">
          Với phòng tập, quy trình này được mở rộng theo <strong>2S Uniform</strong>: đồng bộ Staff và Student/Member thay vì xử lý từng chiếc áo rời rạc. Khi đội ngũ tăng người hoặc mở thêm cơ sở, bộ hồ sơ chuẩn giúp giảm nguy cơ lệch màu, lệch logo và thay đổi form.
        </p>
        <div className="mt-6">
          <ProcessSteps variant="vertical" />
        </div>
      </Section>

      <Section id="nang-luc" title="6. Năng Lực Sản Xuất Đồng Phục Áo Gió Của Univi">
        <div className="space-y-4 leading-6 text-sm md:text-base text-gray-700">
          <p>
            Đơn hàng đồng phục áo gió B2B cần năng lực duy trì chất lượng và tái sản xuất, không chỉ khả năng hoàn thành một lô hàng. Univi có <Link href="/xuong-may-dong-phuc-univi" className="text-[#105d97] font-semibold hover:underline">xưởng sản xuất 2.000m² tại phường Chương Mỹ, Hà Nội</Link>, công suất 100.000 sản phẩm/tháng và hơn 9 năm kinh nghiệm trong nhóm đồng phục thể thao.
          </p>
          <ImageBlock
            src="https://live.staticflickr.com/65535/55260155236_1052c9e90c_b.jpg"
            alt="Xưởng sản xuất đồng phục áo gió 2000m2 của Univi"
            caption="Năng lực sản xuất phục vụ đơn B2B và đặt bổ sung"
          />
          <p>
            Hệ thống sản xuất hỗ trợ đơn cho phòng tập, CLB và doanh nghiệp trên toàn quốc. Quy mô xưởng là điều kiện để chủ động, nhưng chất lượng cuối cùng vẫn phụ thuộc hồ sơ kỹ thuật, mẫu duyệt, vật liệu và khâu kiểm soát. Vì vậy, mỗi dự án cần một cấu hình rõ thay vì dùng chung một lời hứa cho mọi loại áo.
          </p>
          <p>
            Chất liệu của Univi được định hướng kiểm định theo QCVN 01:2017/BCT, gồm giới hạn Formaldehyde và amin thơm chuyển hóa từ thuốc nhuộm Azo. Nói đơn giản, đây là các tiêu chí an toàn cần quan tâm khi sản phẩm tiếp xúc da và được sử dụng lặp lại. Đối tác nên yêu cầu xác nhận phù hợp với mã vải thực tế trong báo giá.
          </p>
          <p>
            Năng lực R&D giúp Univi đánh giá chất liệu, form dáng, độ thoáng, độ bền, độ co giãn và trải nghiệm vận động. Với đồng phục áo gió, hoạt động thử cần mô phỏng điều kiện thật: di chuyển, vung tay, kéo khóa, đội mũ, gấp áo và mặc chồng lên lớp bên trong.
          </p>
        </div>
      </Section>

      <Section id="bao-gia" title="7. Báo Giá May Đồng Phục Áo Gió Theo Yêu Cầu">
        <p className="mb-4 leading-6">
          Giá đồng phục áo gió không nên được so sánh chỉ bằng số lớp. Hai mẫu cùng là áo một lớp có thể khác nhau về trọng lượng vải, lớp phủ, khóa kéo, số mảng phối, kỹ thuật logo và số lượng. Bảng dưới dùng để tham khảo theo dữ liệu sản phẩm hiện có; báo giá B2B cuối cùng được xác lập sau khi chốt cấu hình.
        </p>
        <ImageBlock
          src="https://live.staticflickr.com/65535/55341996717_e884553f62_b.jpg"
          alt="Báo giá may đồng phục áo gió theo yêu cầu"
          caption="Giá phụ thuộc cấu trúc, vật liệu, logo và số lượng"
        />
        <div className="mt-4">
          <SimpleTable
            headers={['Loại áo', 'Mã tham khảo', 'Giá niêm yết tham khảo*', 'Phù hợp']}
            rows={[
              ['Áo gió một lớp', 'AGBG01/AGBG01A', 'Từ 499.000đ', 'Team building, sự kiện, CLB'],
              ['Áo gió hai lớp', 'AGBG02', 'Từ 499.000đ', 'Di chuyển ngoài trời, sáng sớm, set thể thao'],
              ['Áo gió siêu nhẹ', 'GAG1-2-3', 'Từ 499.000đ', 'Running, đạp xe, trekking, đội nhóm']
            ]}
          />
          <p className="text-xs italic text-gray-500 mt-2">
            *Mức trên là giá niêm yết tham khảo của mã sản phẩm, không phải cam kết báo giá may số lượng. Giá có thể thay đổi theo thời điểm và cấu hình. Quý đối tác nên yêu cầu báo giá bằng văn bản trước khi duyệt đơn.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">7.2 Những Yếu Tố Ảnh Hưởng Đến Báo Giá</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-gray-700">
            <li><strong>Số lượng:</strong> số lượng lớn có thể tối ưu chi phí rập, in, thêu, cắt và vận hành chuyền.</li>
            <li><strong>Chất liệu:</strong> mật độ vải, lớp phủ, độ co giãn, lớp lót và yêu cầu kháng nước ảnh hưởng trực tiếp đến giá.</li>
            <li><strong>Cấu trúc:</strong> một lớp, hai lớp, mũ rời/liền, túi khóa, bo chun, phối mảng và quần đồng bộ tạo mức độ phức tạp khác nhau.</li>
            <li><strong>Kỹ thuật logo:</strong> in chuyển nhiệt, ép decal, in lụa hoặc thêu cần được chọn theo bề mặt vải, độ bền mong muốn và kích thước hình.</li>
            <li><strong>Cá nhân hóa:</strong> tên riêng, số áo, logo nhà tài trợ và đóng gói theo từng người làm tăng công xử lý.</li>
            <li><strong>Tiến độ:</strong> lịch gấp chỉ khả thi khi vật liệu, năng lực chuyền và thời gian duyệt mẫu cho phép.</li>
          </ul>
          <p className="mt-4 text-sm md:text-base text-gray-700">
            Số lượng tối thiểu phụ thuộc dòng và mức tùy chỉnh. Dữ liệu chính sách hiện có ghi nhận đơn từ 10 sản phẩm cho một số mẫu/chính sách đối tác, trong khi mẫu riêng có thể yêu cầu mức cao hơn. Cách an toàn là gửi nhu cầu thực tế để Univi xác nhận MOQ, mẫu thử và tiến độ theo đúng mã áo. Hãy <Link href={contactHref} className="text-[#105d97] font-semibold hover:underline">liên hệ Univi để nhận tư vấn mẫu và báo giá</Link> chi tiết.
          </p>
        </div>
      </Section>

      <Section id="sai-lam" title="8. Những Sai Lầm Khi Đặt May Đồng Phục Áo Gió">
        <p className="mb-4 leading-6">
          Sai lầm thường không lộ ở mockup. Chúng xuất hiện khi người dùng mặc ngoài trời, giặt nhiều lần hoặc đặt bổ sung sau vài tháng.
        </p>
        <ImageBlock
          src="https://live.staticflickr.com/65535/55360239850_b5a8b9f742_b.jpg"
          alt="Sai lầm khi đặt may đồng phục áo gió"
          caption="Vải quá dày và thiết kế quá nhiều màu làm giảm hiệu quả"
        />
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <TextCard title="8.1 Chọn Vải Quá Dày">
            <p>
              Nhiều đơn vị mặc định vải dày sẽ bền và giữ ấm tốt. Với người vận động, lớp vải quá dày có thể giữ nhiệt, hạn chế thoát ẩm và làm áo nặng khi mang theo. Độ bền cần được đánh giá cùng mật độ sợi, đường may, khóa kéo và cách sử dụng; không thể suy ra chỉ từ độ dày.
            </p>
          </TextCard>

          <TextCard title="8.2 Không Tính Đến Môi Trường Sử Dụng">
            <p>
              Áo cho chạy bộ khác áo cho nhân sự đứng ngoài trời. Runner cần nhẹ và thông khí; ban tổ chức ít vận động có thể cần hai lớp; đội trekking cần gấp gọn; doanh nghiệp cần form dễ mặc. Chọn sản phẩm trước rồi mới tìm mục đích sử dụng thường dẫn đến cấu hình thừa hoặc thiếu.
            </p>
          </TextCard>

          <TextCard title="8.3 Thiết Kế Quá Nhiều Màu">
            <p>
              Nhiều mảng màu làm tăng đường ráp, khó kiểm soát sai lệch và khiến logo mất trọng tâm. Thiết kế hiệu quả thường dùng một màu chính, một màu phụ và một điểm nhấn. Nếu có nhiều nhà tài trợ, cần thiết lập thứ bậc logo thay vì đặt tất cả cùng kích thước.
            </p>
          </TextCard>

          <TextCard title="8.4 Không Lưu Chuẩn Để Tái Sản Xuất">
            <p>
              File hình đơn thuần không đủ cho lần đặt sau. Hồ sơ cần có mã vải, mã màu, thông số size, rập, vị trí logo, kích thước hình, kỹ thuật hoàn thiện và mẫu đã duyệt. Thiếu các dữ liệu này, lô bổ sung dễ lệch với lô đầu, làm giảm tính nhất quán của thương hiệu.
            </p>
          </TextCard>
        </div>
      </Section>

      <Section id="faq" title="9. Câu Hỏi Thường Gặp Về Đồng Phục Áo Gió">
        <div className="space-y-3 mt-4">
          {aoGioFaqs.map(([question, answer]) => (
            <details key={question} className="group rounded-lg border border-gray-200 bg-gray-50">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-900">
                {question}
              </summary>
              <p className="px-4 py-3 text-sm leading-6 text-gray-700">{answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section id="tien-phong" title="10. Đồng Phục Univi – Tiên Phong Giải Pháp Đồng Phục Thể Thao Cho Đội Nhóm">
        <div className="space-y-4 leading-6 text-sm md:text-base text-gray-700">
          <p>
            Một dự án đồng phục áo gió hiệu quả bắt đầu từ bối cảnh sử dụng, không bắt đầu từ mẫu đang thịnh hành. Khi cấu trúc áo, chất liệu, form, màu và logo được chọn đúng, đội nhóm có một lớp bảo vệ dễ dùng, một công cụ nhận diện và một tài sản có thể tái sử dụng qua nhiều hoạt động.
          </p>
          <ImageBlock
            src="https://live.staticflickr.com/65535/55342001057_0c6a0bbbfd_b.jpg"
            alt="Đồng Phục Univi áo gió thể thao cho doanh nghiệp và CLB"
            caption="Giải pháp áo gió đồng bộ từ thiết kế đến tái sản xuất"
          />
          <p>
            Đồng Phục Univi hỗ trợ đối tác từ tư vấn cấu hình, thiết kế miễn phí, gửi mẫu, duyệt vật liệu, sản xuất đến lưu chuẩn tái sản xuất. Xưởng 2.000m² và công suất 100.000 sản phẩm/tháng tạo nền tảng phục vụ đơn B2B; quy trình thử mẫu và hồ sơ kỹ thuật giúp biến năng lực đó thành sản phẩm nhất quán.
          </p>
          <p className="font-semibold">
            Nếu doanh nghiệp, phòng tập hoặc CLB đang cần may áo gió đồng phục theo yêu cầu, hãy chuẩn bị bốn thông tin: người mặc, mục đích sử dụng, số lượng và ngày cần hàng. Sau đó, liên hệ Univi để nhận tư vấn mẫu và báo giá theo cấu hình thực tế.
          </p>
        </div>
      </Section>

      {/* Đối tác Doanh nghiệp */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 mb-3 mt-4">
        <h2 className="text-xl md:text-xl font-bold mb-2 text-center text-gray-900">
          Đối Tác Doanh Nghiệp Đồng Hành Cùng Univi
        </h2>
        <p className="text-sm md:text-base text-gray-600 text-center mb-4">
          Các tập đoàn, doanh nghiệp và đối tác đã tin tưởng sản xuất áo gió đồng phục tại Univi
        </p>
        <PartnersSection category="doanh-nghiep" />
      </section>

      <section className="bg-[#105d97] p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-blue-100">
              UNIVI SPORTS UNIFORM - YOUR UNIFORM, YOUR BRAND!
            </p>
            <h2 className="mt-1 text-xl md:text-2xl font-medium tracking-tight leading-tight">
              Liên Hệ Với Xưởng May Đồng Phục UNIVI Ngay Hôm Nay
            </h2>
            <p className="mt-2 text-sm leading-6 text-blue-50">
              Gửi UNIVI logo, màu thương hiệu, vai trò nhân sự, số lượng dự kiến, mô hình phòng tập
              và ngày cần hàng để được tư vấn chất liệu, mockup và giải pháp 2S Uniform phù hợp.
            </p>
            <div className="mt-3 grid gap-1 text-sm text-blue-50">
              <p><span className="font-semibold">Văn phòng:</span> Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</p>
              <p><span className="font-semibold">Xưởng sản xuất:</span> Phường Chương Mỹ, Thành phố Hà Nội</p>
              <p><span className="font-semibold">Hotline:</span> 0834.204.999 / 096.156.7997</p>
              <p><span className="font-semibold">Email:</span> dongphucunivi@gmail.com</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#105d97] hover:bg-blue-50"
          >
            Nhận tư vấn đồng phục Áo gió
          </button>
        </div>
      </section>

      <ContactForm
        source="Đồng phục áo gió - Nhận báo giá"
        isModal
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}
