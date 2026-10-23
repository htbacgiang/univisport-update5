import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ContactForm from '../../header/ContactForm';
import FabricCardComponent from '../FabricCardComponent';
import ProcessSteps from '../ProcessSteps';

const contactHref = '/lien-he';

const heroStats = [
  'Xưởng 2.000m2 tại phường Chương Mỹ, Hà Nội',
  'Công suất 100.000 sản phẩm/tháng',
  'Phòng R&D riêng',
  'Đặt từ 10 áo ở dòng phù hợp',
];

const trustBadges = [
  ['Xưởng sản xuất 2.000m2 tại phường Chương Mỹ, Hà Nội', 'Chủ động sản xuất, QC và tiến độ cho đơn B2B.'],
  ['Công suất 100.000 sản phẩm/tháng', 'Phù hợp CLB, học viện, giải đấu và đội nhóm lớn.'],
  ['Phòng R&D riêng', 'Nghiên cứu chất liệu, form dáng và trải nghiệm vận động.'],
  ['Công nghệ UNI DRY', 'Hỗ trợ thoát ẩm một chiều, giảm cảm giác bí bách.'],
  ['Đặt từ 10 áo ở dòng phù hợp', 'Đội nhóm nhỏ có thể bắt đầu gọn, dễ kiểm chứng mẫu.'],
  ['Thiết kế miễn phí', 'Dễ lên concept màu, logo, tên, số và nhà tài trợ.'],
];

const reasons = [
  ['Thiết kế miễn phí', 'Lên concept theo logo, màu đội, tên, số và nhà tài trợ.'],
  ['Xưởng 2.000m2', 'Chủ động sản xuất, kiểm soát chất lượng và lịch giao hàng.'],
  ['UNI DRY', 'Hỗ trợ thoát ẩm, giảm cảm giác áo bết khi vận động.'],
  ['Đặt từ 10 áo', 'Phù hợp nhóm mới, đội nhỏ hoặc đơn thử nghiệm.'],
  ['Lưu file thiết kế', 'Dễ đặt bổ sung, hạn chế lệch màu và lệch logo.'],
  ['Tư vấn theo vai trò', 'Tách rõ HLV, vận động viên, ban tổ chức, trọng tài và check-in.'],
];

const audienceSolutions = [
  {
    title: 'CLB Pickleball',
    text: 'Tăng nhận diện, gắn kết thành viên và tạo hình ảnh chuyên nghiệp khi giao lưu hoặc thi đấu. CLB mới nên bắt đầu từ Polo hoặc T-shirt đồng bộ; CLB ổn định có thể mở thêm áo ban điều hành, áo đội nữ, áo giải nội bộ và merchandise.',
  },
  {
    title: 'Học viện Pickleball',
    text: 'Cần tách rõ đồng phục huấn luyện viên và học viên. HLV nên dùng Polo hoặc áo thể thao đứng form, còn học viên cần sản phẩm dễ mặc, dễ đặt lại, nhiều size và tối ưu chi phí.',
  },
  {
    title: 'Doanh nghiệp',
    text: 'Phù hợp giải nội bộ, team building hoặc đội thể thao công ty. Polo Pickleball đủ chỉn chu cho ảnh truyền thông nhưng vẫn giữ tinh thần thể thao.',
  },
  {
    title: 'Ban tổ chức giải đấu',
    text: 'Cần đồng phục cho vận động viên, trọng tài, nhân sự check-in, ban tổ chức và nhà tài trợ. Mỗi nhóm nên có màu hoặc dấu hiệu nhận diện riêng để vận hành dễ hơn trong ngày thi đấu.',
  },
];

const painPoints = [
  ['Chọn sai chất liệu', 'Cotton hoặc vải thể thao chất lượng thấp dễ ẩm, nặng, bí và bết khi chơi ngoài trời.'],
  ['Thiết kế rời rạc', 'Logo nhỏ, màu không theo nhận diện, tên số đặt lộn xộn hoặc nhà tài trợ chen sai vị trí khiến đội thiếu chuyên nghiệp.'],
  ['Ngân sách chưa rõ', 'Đội nhóm cần xác định cấu hình: số lượng, vải, kỹ thuật logo, cá nhân hóa, tiến độ và khả năng đặt bổ sung.'],
];

const materials = [
  ['UNI DRY', 'Công nghệ xử lý thoát ẩm trên vải thể thao', 'Hỗ trợ đưa hơi ẩm ra ngoài, giảm cảm giác bí', 'Áo thi đấu, áo tập, áo CLB'],
  ['UNI SUPER COOL', 'Nền Polyamide, hướng đến cảm giác mềm mượt', 'Mềm, mượt, mát, mịn, giảm ma sát', 'CLB cao cấp, HLV, đội nữ, UniPick'],
  ['UNI QUICK DRY', 'Polyester cao cấp, nhanh khô và nhẹ', 'Phù hợp vận động ngoài trời, dễ bảo quản', 'Áo tập, áo sự kiện, giải phong trào'],
  ['UNI BLENDED', 'Kết hợp nhiều loại sợi tùy cấu hình', 'Bền, dễ mặc, cân bằng chi phí', 'Polo ban điều hành, áo giao lưu'],
  ['Lascote thể thao', 'Vải Polo thể thao cao cấp theo từng mã sản phẩm', 'Giữ phong cách Polo, mềm và co giãn', 'Polo Pickleball, doanh nghiệp, CLB'],
];

const roleSolutions = [
  ['Huấn luyện viên', 'Ưu tiên Polo hoặc áo thể thao đứng form, dễ nhận diện trên sân và đủ thoải mái khi thị phạm động tác.'],
  ['Vận động viên thi đấu', 'Cần nhẹ, thoáng, co giãn tốt, có vùng in tên số rõ và không kéo vai khi vung tay.'],
  ['Thành viên CLB', 'Nên dễ mặc, dễ đặt lại, chi phí hợp lý và có thể phát triển thành merchandise cho hội viên.'],
  ['Ban tổ chức giải đấu', 'Cần khác màu vận động viên và trọng tài, có vị trí logo nhà tài trợ rõ trong ảnh và livestream.'],
  ['Lễ tân và check-in', 'Cần lịch sự, nhận diện nhanh và dễ vận động khi phát bib, nhận hồ sơ hoặc hướng dẫn khách.'],
  ['Trọng tài', 'Ưu tiên sự rõ ràng, trang nghiêm, thoáng khí và màu sắc khác nhóm vận động viên.'],
];

const needSuggestions = [
  ['CLB mới', 'APL01, APL05'],
  ['Đội thi đấu', 'APL02, APL03, APL08'],
  ['Đội nữ', 'APL06, APL16'],
  ['Doanh nghiệp', 'APL09, APL11'],
  ['Resort / CLB lifestyle', 'APL10, APL12'],
  ['Giải đấu', 'APL03, APL04, APL08'],
  ['Đơn cần tùy biến nhiều', 'APL04, APL15'],
];

const unipickModels = [
  ['APL01', 'Áo Polo Pickleball Univi APL01', 'Mẫu nền thể thao cho CLB mới, vải UNI DRY, đặt từ 10 chiếc.', 'https://live.staticflickr.com/65535/55269983608_5ac04e4026_b.jpg', 'CLB mới'],
  ['APL02', 'Áo Polo Pickleball Univi APL02', 'Tông đen hiện đại, phù hợp team thi đấu và HLV.', 'https://live.staticflickr.com/65535/55269774088_1efbb8f0ee_b.jpg', 'Đội thi đấu, HLV'],
  ['APL03', 'Áo Polo Pickleball Univi APL03', 'Họa tiết Matrix, hợp giải đấu và đội muốn hình ảnh công nghệ.', '/san-pham/ao-polo-pickleball-univi-apl03', 'Giải đấu'],
  ['APL04', 'Áo Polo Pickleball Univi APL04', 'Matrix đa tông, dễ chia đội hoặc chia bảng đấu.', '/san-pham/ao-polo-pickleball-univi-apl04', 'Chia đội'],
  ['APL05', 'Áo Polo Pickleball Univi APL05', 'Xanh mint trẻ trung, phù hợp CLB cộng đồng.', '/san-pham/ao-polo-pickleball-univi-apl05', 'Cộng đồng'],
  ['APL06', 'Áo Polo Pickleball Univi APL06', 'Hồng tím nhẹ, Lascote thể thao, phù hợp đội nữ.', '/san-pham/ao-polo-pickleball-univi-apl06', 'Đội nữ'],
  ['APL07', 'Áo Polo Pickleball Univi APL07', 'Lascote thể thao, co giãn, khô nhanh, dễ phối logo.', '/san-pham/ao-polo-pickleball-univi-apl07', 'CLB cần logo nổi'],
  ['APL08', 'Áo Polo Pickleball Univi APL08', 'Tông đỏ nổi bật, hợp team thi đấu và branding mạnh.', '/san-pham/ao-polo-pickleball-univi-apl08', 'Branding mạnh'],
  ['APL09', 'Áo Polo Pickleball Univi APL09', 'Navy - trắng thanh lịch, hợp doanh nghiệp và CLB cao cấp.', '/san-pham/ao-polo-pickleball-univi-apl09', 'Doanh nghiệp'],
  ['APL10', 'Áo Polo Pickleball Univi APL10', 'Đen premium tối giản, hợp CLB VIP và đội HLV.', '/san-pham/ao-polo-pickleball-univi-apl10', 'Resort, CLB VIP'],
  ['APL11', 'Áo Polo Pickleball Univi APL11', 'Xám premium, phù hợp giải giao hữu doanh nghiệp.', '/san-pham/ao-polo-pickleball-univi-apl11', 'Team building'],
  ['APL12', 'Áo Polo Pickleball Univi APL12', 'Xanh dương nhạt dịu, hợp CLB cộng đồng nhiều độ tuổi.', '/san-pham/ao-polo-pickleball-univi-apl12', 'CLB nhiều độ tuổi'],
  ['APL15', 'Áo Polo Pickleball Univi APL15', 'Tông trắng, dễ tùy biến theo nhận diện CLB.', '/san-pham/ao-polo-pickleball-univi-apl15', 'Đơn cần tùy biến'],
  ['APL16', 'Áo Polo Pickleball Univi APL16', 'Tím pastel khác biệt, hợp đội nữ và nhóm lifestyle.', '/san-pham/ao-polo-pickleball-univi-apl16', 'Đội nữ, lifestyle'],
];

const unipickModelImages = [
  'https://live.staticflickr.com/65535/55269983608_5ac04e4026_b.jpg',
  'https://live.staticflickr.com/65535/55271421035_ecc6512c79_b.jpg',
  'https://live.staticflickr.com/65535/55270123037_fcc692a2d8_b.jpg',
  'https://live.staticflickr.com/65535/55270130717_5c0a98e7b6_b.jpg',
  'https://live.staticflickr.com/65535/55271052291_703d4f9f90_b.jpg',
  'https://live.staticflickr.com/65535/55272988954_7d58037dcf_b.jpg',
  'https://live.staticflickr.com/65535/55273172915_803301c388_b.jpg',
  'https://live.staticflickr.com/65535/55272926178_6d9e19751c_b.jpg',
  'https://live.staticflickr.com/65535/55272807631_1450f36e0b_b.jpg',
  'https://live.staticflickr.com/65535/55273211115_23241d6522_b.jpg',
  'https://live.staticflickr.com/65535/55273076969_4d0c36cd22_b.jpg',
  'https://live.staticflickr.com/65535/55273055741_60258693b7_b.jpg',
  'https://live.staticflickr.com/65535/55273056416_5b339e86f2_b.jpg',
  'https://live.staticflickr.com/65535/55273478970_df7d6cb417_b.jpg',
];

const productSystem = [
  'Áo T-shirt Pickleball cho buổi tập và cộng đồng trẻ.',
  'Chân váy Pickleball có quần bảo hộ bên trong cho đội nữ.',
  'Quần short Pickleball nhẹ, thoáng, linh hoạt.',
  'Áo khoác Pickleball hoặc áo gió cho di chuyển, khởi động và sự kiện ngoài trời.',
  'Đồng phục HLV, trọng tài, ban tổ chức, lễ tân, check-in và tình nguyện viên.',
  'Merchandise như áo lưu niệm, áo giải, áo nhà tài trợ hoặc sản phẩm bán cho thành viên.',
];

// THAY 3 ẢNH SECTION 11 TẠI ĐÂY.
const SECTION_11_IMAGES_TO_REPLACE = [
  {
    src: 'https://live.staticflickr.com/65535/55352010156_ba6863d984_b.jpg',
    alt: 'Áo Polo Pickleball UNIVI trong hệ đồng phục đội nhóm',
  },
  {
    src: 'https://live.staticflickr.com/65535/55351075527_5714ae5988_b.jpg',
    alt: 'Chân váy Pickleball nữ trong hệ sản phẩm UniPick',
  },
  {
    src: 'https://live.staticflickr.com/65535/55352010281_41b2cd227c_b.jpg',
    alt: 'Hệ sản phẩm đồng phục Pickleball gồm áo và phụ kiện thể thao',
  },
];

const pricingRows = [
  ['10+', 'Nhóm mới, đội nhỏ', 'Ưu tiên mẫu có sẵn, logo gọn.'],
  ['30+', 'CLB ổn định', 'Có thể cá nhân hóa tên số.'],
  ['50+', 'Học viện, giải nội bộ', 'Cần quản lý size và dữ liệu.'],
  ['100+', 'Giải đấu, doanh nghiệp lớn', 'Cần kế hoạch sản xuất và QC.'],
  ['300+', 'Sự kiện quy mô lớn', 'Cần chia lô, đóng gói theo đội hoặc size.'],
];

const relatedLinks = [
  ['10 mẫu áo đồng phục Pickleball đẹp năm 2026', '/bai-viet/10-mau-ao-dong-phuc-pickleball-dep-nam-2026'],
  ['May đồng phục Pickleball theo yêu cầu', '/bai-viet/may-dong-phuc-pickleball'],
  ['Đồng phục Pickleball cho câu lạc bộ', '/bai-viet/dong-phuc-pickleball-cho-cau-lac-bo'],
  ['Công nghệ UNI DRY', '/cong-nghe-uni-dry'],
  ['Vải Super Cool là gì', '/vai-super-cool-la-gi'],
  ['Xưởng may đồng phục thể thao Univi', '/xuong-may-dong-phuc-univi'],
];

const checklistGroups = [
  ['Brief', 'Logo gốc, bảng màu thương hiệu, số lượng dự kiến, dải size, nhóm người mặc, sản phẩm cần làm, môi trường sân, ngày cần hàng, yêu cầu tên số, logo nhà tài trợ và ngân sách tham khảo.'],
  ['Thiết kế', 'Khóa mặt trước, mặt sau, tay áo, cổ áo, vị trí logo chính, logo phụ, tên vận động viên, số áo và màu nền trước khi sản xuất.'],
  ['Size', 'Có người phụ trách xác nhận lần cuối; nếu đội có cả nam và nữ, cần quyết định dùng form chung hay tách form.'],
  ['Chất liệu', 'Kiểm tra bằng chuyển động thật: nâng tay, xoay vai, cúi người, hạ trọng tâm và di chuyển ngang.'],
  ['Đặt lại', 'Lưu file thiết kế, mã màu, mã vải, kỹ thuật logo, thông số size và đầu mối phụ trách.'],
  ['Truyền thông', 'Chuẩn bị ảnh tập thể, ảnh cận chất liệu, ảnh logo, ảnh vận động trên sân và video ngắn sau khi nhận hàng.'],
];

export const pickleballFaqs = [
  ['Univi có nhận đơn từ 10 áo không?', 'Có. Chính sách đồng phục Pickleball xác nhận đơn đối tác từ 10 chiếc. Cấu hình sản phẩm, mức giá và tiến độ vẫn cần được xác nhận theo mẫu, chất liệu và cá nhân hóa.'],
  ['Có in tên và số riêng cho từng người không?', 'Có. Khách hàng nên gửi một bảng dữ liệu duy nhất, kiểm tra dấu tiếng Việt, số áo, size và mẫu trước khi khóa sản xuất.'],
  ['Có giao đồng phục Pickleball toàn quốc không?', 'Có. Địa chỉ nhận, thời gian và chi phí vận chuyển cần được ghi rõ trong báo giá hoặc xác nhận đơn hàng.'],
  ['Univi có xuất hóa đơn VAT không?', 'Có. Doanh nghiệp nên cung cấp thông tin xuất hóa đơn và xác nhận giá đã gồm hay chưa gồm VAT trước khi duyệt.'],
  ['Đồng phục có chống UV không?', 'Một số mã vải/sản phẩm có tính năng chống UV, nhưng không nên mặc định cho mọi mẫu. Hãy yêu cầu xác nhận tính năng trên đúng cấu hình được báo giá.'],
  ['Có gửi mẫu vải hoặc mẫu thử không?', 'Có hỗ trợ mẫu thử/mẫu vải theo yêu cầu. Hai bên cần thống nhất hình thức gửi, chi phí nếu có và thời gian hoàn trả trước khi triển khai.'],
  ['Có đổi size sau khi nhận hàng không?', 'Khả năng đổi phụ thuộc chính sách và việc sản phẩm có cá nhân hóa hay không. Áo đã in tên số thường khó đổi, nên thử size trước khi sản xuất.'],
  ['Làm sao đặt bổ sung không lệch màu?', 'Lưu file gốc, mã màu, mã vải, thông số form, kỹ thuật logo và mẫu chuẩn. Đợt sau vẫn cần đối chiếu vì lô nguyên liệu có thể có sai khác.'],
  ['Polo hay T-shirt phù hợp hơn?', 'Polo phù hợp CLB, học viện và doanh nghiệp cần hình ảnh chỉn chu. T-shirt phù hợp buổi tập, giải phong trào và cộng đồng trẻ. Quyết định theo bối cảnh, không theo xu hướng.'],
  ['Chất liệu nào phù hợp cho Pickleball?', 'Chất liệu đồng phục Pickleball có thể là UNI SUPER COOL, UNI QUICK DRY, nền vải ứng dụng UNI DRY, UNI BLENDED hoặc Lascote thể thao. Chọn theo cảm giác, độ thoáng, thoát ẩm, co giãn và use case.'],
  ['Có form riêng cho nam và nữ không?', 'Có thể triển khai form nam và nữ tùy mẫu, số lượng và yêu cầu. Nên thử size bằng các động tác vươn tay, xoay vai, hạ trọng tâm và bước ngang.'],
  ['Có thể in logo nhà tài trợ không?', 'Có. Cần file logo chuẩn, quy định vị trí, kích thước và phiên bản màu. Nên lập sơ đồ tài trợ trước khi duyệt thiết kế cuối.'],
  ['Có sản xuất áo cho giải đấu không?', 'Có. Brief nên tách vận động viên, BTC, trọng tài, check-in và tình nguyện viên để mỗi vai trò có màu và nhận diện phù hợp.'],
  ['Thời gian sản xuất bao lâu?', 'Mẫu sẵn có thể 2–3 ngày và mẫu mới 10–12 ngày. Đây là mốc tham khảo; tiến độ chính thức phải xác nhận theo số lượng, mẫu và lịch xưởng.'],
  ['Có hỗ trợ thiết kế không?', 'Có. Univi hỗ trợ tư vấn và thiết kế theo nhận diện. Khách hàng cần cung cấp logo, màu, đối tượng mặc, ngày cần hàng và vị trí nhà tài trợ.'],
  ['Có thể làm nhiều vai trò trong một đơn không?', 'Có. Nên dùng cùng hệ màu/cổ/họa tiết và thay màu nền hoặc nhãn vai trò để HLV, BTC, trọng tài và check-in dễ phân biệt.'],
  ['Giá 360.000 đồng có áp dụng cho mọi đơn không?', 'Không. Đây là giá niêm yết được xác nhận cho 14 mã polo UniPick trong dữ liệu hiện tại. Đơn tùy chỉnh cần báo lại theo số lượng, vải, logo, tên số và tiến độ.'],
  ['Có thể làm áo khoác và merchandise cùng bộ không?', 'Có thể xây dựng hệ mở rộng gồm áo khoác, mũ, túi hoặc áo cổ động. Phạm vi sản phẩm và MOQ cần được xác nhận trong brief cụ thể.'],
  ['Làm sao chọn màu dễ lên hình?', 'Kiểm tra màu dưới nắng, ánh sáng trong nhà và camera điện thoại. Giữ tương phản giữa nền áo, logo CLB, tên số và nhà tài trợ; tránh quá nhiều mảng nhỏ.'],
  ['Cần chuẩn bị gì để nhận báo giá chính xác?', 'Chuẩn bị số lượng theo vai trò/size, mẫu mong muốn, loại vải, logo, tên số, địa chỉ giao và ngày cần nhận. Brief đủ giúp báo giá ít điều kiện ẩn hơn.'],
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
    <figure className="overflow-hidden">
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

export default function PickleballUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="text-gray-700">
      <section className="bg-white pb-8">
        <p className="mb-2 text-xs font-medium text-[#105d97] uppercase tracking-[0.15em]">UniPick by UNIVI</p>
        <p className="text-2xl md:text-3xl font-medium tracking-tight leading-tight text-gray-900">
          Đồng Phục Pickleball Thiết Kế Theo Yêu Cầu Cho CLB, Học Viện & Giải Đấu
        </p>
        <p className="mt-4 max-w-4xl text-base leading-6 text-gray-700">
          Đồng phục Pickleball không chỉ là một chiếc áo giống nhau. Với CLB, học viện,
          doanh nghiệp và giải đấu, đây là nhận diện thương hiệu, công cụ gắn kết thành
          viên, tài sản truyền thông và một phần trực tiếp của trải nghiệm vận động.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="rounded border border-[#105d97] bg-[#105d97] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0e4f82]"
          >
            Nhận báo giá
          </button>
          <Link
            href="#bo-suu-tap-unipick"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#105d97] hover:text-[#105d97]"
          >
            Xem Bộ sưu tập
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

      <Section id="dong-phuc-pickleball-khong-chi-la-ao" title="1. Đồng Phục Pickleball Không Chỉ Là Một Chiếc Áo" className="border-t border-gray-100">
        <div className="space-y-2 leading-6">
          <p>
            Đồng phục Pickleball xuất hiện ở gần như mọi điểm chạm của một cộng đồng: trên sân,
            trong ảnh đội, video recap, livestream, lễ trao giải, buổi giao lưu và bài đăng của
            thành viên. Nếu được xây dựng có chủ đích, chiếc áo trở thành một tài sản nhận diện có
            thể được sử dụng lặp lại thay vì một khoản chi chỉ phục vụ ngày thi đấu.
          </p>
          <p>
            Với CLB, màu áo và bố cục logo giúp thành viên nhận ra nhau nhanh hơn, nhất là trong
            buổi giao lưu đông người. Với học viện, đồng phục Pickleball phân biệt huấn luyện viên,
            học viên và bộ phận vận hành. Với doanh nghiệp, đây là cách đưa bộ nhận diện vào hoạt
            động thể thao mà không biến người mặc thành một bảng quảng cáo. Với giải đấu, hệ áo theo
            vai trò giúp vận động viên dễ tìm đúng người hỗ trợ.
          </p>
          <p>
            Giá trị cộng đồng cũng quan trọng không kém. Khi thành viên chủ động mặc áo trong buổi
            chơi thường kỳ, họ đang thể hiện cảm giác thuộc về một nhóm. Hình ảnh đồng nhất tạo
            thêm chất liệu cho truyền thông, giúp nhà tài trợ được ghi nhận đúng vị trí và mở đường
            cho merchandise như áo phiên bản mùa giải, mũ, khăn, túi hoặc áo khoác.
          </p>
          <p>
            Điều kiện là đồng phục phải thực sự dễ mặc. Nếu áo nóng, form không hợp hoặc tên số
            nhanh xuống cấp, thành viên sẽ ngừng sử dụng. Vì vậy, nhận diện chỉ bền khi trải nghiệm
            mặc đủ tốt.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55373546615_224cae8dae_b.jpg"
            alt="Đồng phục Pickleball CLB học viện và giải đấu"
            caption="Đồng phục Pickleball được xây dựng có chủ đích trở thành tài sản nhận diện, không chỉ là trang phục thi đấu một lần."
          />
        </div>
      </Section>

      <Section id="trust-badge" eyebrow="" title="2. Năng lực sản xuất" className="">
        <p className="mb-3 leading-6">
          UNIVI không định vị là xưởng may áo thun giá rẻ. UNIVI là thương hiệu nghiên cứu và
          phát triển đồng phục thể thao chuyên dụng cho chuỗi phòng tập, CLB và đội nhóm thể
          thao tại Việt Nam. Với Pickleball, phần proof nên tập trung vào năng lực sản xuất và
          năng lực thể thao chuyên dụng.
        </p>
        <div className="mb-6 overflow-hidden border border-gray-200">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/0AABoh2a-Sk"
            title="Năng lực sản xuất đồng phục thể thao UNIVI"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trustBadges.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="dong-phuc-pickleball-la-gi" eyebrow="" title="3. Đồng Phục Pickleball Là Gì?">
        <div className="space-y-2 leading-6">
          <p>
            Đồng phục Pickleball là hệ trang phục được thiết kế cho một đội nhóm hoặc tổ chức,
            đồng thời đáp ứng hai yêu cầu: hỗ trợ vận động đặc thù và truyền tải nhận diện
            chung. Nó khác áo thể thao thông thường ở việc có brief rõ về người mặc, môi trường
            sân, tần suất sử dụng, form nam nữ, màu thương hiệu, logo, tên số và khả năng đặt
            bổ sung.
          </p>
          <p>
            Khi phát triển đồng phục Pickleball, cần tính đến các nhịp chạy ngắn, dừng và đổi
            hướng nhanh. Người chơi liên tục di chuyển ngang ở khu vực gần lưới, hạ trọng tâm
            để xử lý bóng thấp, vươn tay và xoay vai khi giao hoặc đánh bóng. Áo vì thế không
            nên kéo căng ở lưng trên, siết nách hoặc cuộn gấu khi người mặc nâng tay. Quần và
            chân váy cần cho phép bước ngang rộng mà vẫn giữ kín đáo.
          </p>
          <p>
            Về chất liệu đồng phục Pickleball, ưu tiên không chỉ là &ldquo;thấm hút&rdquo;. Vải
            cần đưa ẩm ra bề mặt ngoài để bay hơi, khô tương đối nhanh, nhẹ khi đã thấm mồ hôi
            và có độ co giãn phù hợp. Với sân ngoài trời, cần kiểm tra riêng tính năng chống UV
            của đúng mã vải; không nên mặc định mọi loại vải thể thao đều có khả năng này.
          </p>
          <p>
            Về form, athletic fit ôm vừa thường phù hợp thi đấu, trong khi regular fit dễ dùng
            cho thành viên nhiều độ tuổi. Nữ có thể cần cấu trúc eo, hông và chiều dài riêng.
            Đây là lý do một bảng size chung cho mọi người thường không đủ.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55271837427_17c3ae7f93_b.jpg"
            alt="Đồng phục Pickleball cho người chơi huấn luyện viên và thành viên CLB"
            caption="Đồng phục Pickleball phục vụ vận động, nhận diện và kết nối cộng đồng."
          />
        </div>
      </Section>

      <Section id="vi-sao-clb-can-dong-phuc-rieng" eyebrow="" title="4. Vì Sao CLB Pickleball Nên Xây Dựng Đồng Phục Riêng?">
        <div className="space-y-6 leading-6">
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">4.1 Tăng nhận diện CLB</h3>
            <p>
              Màu chủ đạo, logo, kiểu cổ và hệ họa tiết đồng phục Pickleball nhất quán giúp CLB
              được nhận ra trong ảnh toàn sân hoặc video góc rộng. Nhận diện tốt không đồng nghĩa
              với in logo thật lớn. Một bố cục có khoảng thở, tương phản đúng và vị trí ổn định
              thường dễ nhớ hơn.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">4.2 Tạo cảm giác thuộc về cộng đồng</h3>
            <p>
              Đồng phục Pickleball tạo một nghi thức gia nhập đơn giản: thành viên mới nhận áo,
              hiểu màu đội và xuất hiện trong buổi chơi cùng nhóm. Giá trị này tăng lên khi form
              đủ dễ mặc cho nhiều vóc dáng và thành viên muốn dùng áo ngoài sự kiện chính.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">4.3 Chuyên nghiệp khi giao lưu và thi đấu</h3>
            <p>
              Khi hai hoặc nhiều CLB cùng giao lưu, màu áo giúp phân đội và tạo hình ảnh có tổ
              chức. Với đội thi đấu, tên, số và logo cần được chốt theo một quy chuẩn để trọng tài,
              người xem và bộ phận truyền thông nhận diện thuận lợi.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">4.4 Hỗ trợ truyền thông và tài trợ</h3>
            <p>
              Nhà tài trợ cần vùng hiển thị đủ rõ nhưng không xung đột với logo CLB. File thiết kế
              nên quy định vị trí ngực, tay và lưng; kích thước tối đa; màu âm bản/dương bản;
              khoảng cách an toàn. Nhờ đó, logo vẫn đọc được trên ảnh và livestream.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">4.5 Dễ mở rộng thành merchandise</h3>
            <p>
              Một ngôn ngữ thiết kế tốt có thể mở rộng từ áo thi đấu sang áo cổ động, áo khoác,
              mũ và túi. CLB vừa tăng nhận diện vừa có thêm sản phẩm dành cho người thân, cổ động
              viên hoặc thành viên không thi đấu.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55377342940_fb6d2bb599_b.jpg"
            alt="CLB Pickleball xây dựng đồng phục riêng để tăng nhận diện và gắn kết cộng đồng"
            caption="Đồng phục riêng giúp CLB Pickleball tăng nhận diện, tạo cảm giác thuộc về và hỗ trợ truyền thông hiệu quả."
          />
        </div>
      </Section>

      <Section id="vi-sao-chon-univi" eyebrow="" title="5. Vì Sao CLB Chọn Univi?">
        <div className="space-y-4 leading-6">
          <p>
            Trong lĩnh vực đồng phục Pickleball, Đồng Phục Univi là đơn vị tiên phong cung cấp
            giải pháp đồng phục thể thao chuyên nghiệp cho chuỗi phòng tập và đội nhóm thể thao
            tại Việt Nam. Điểm khác biệt không nằm ở việc bán một mẫu polo, mà ở cách nghiên cứu
            theo bộ môn, vai trò và trải nghiệm sử dụng.
          </p>
          <div className="mb-3">
            <ImageBlock
              src="https://live.staticflickr.com/65535/55260155236_1052c9e90c_b.jpg"
              alt="Năng lực sản xuất đồng phục Pickleball chuyên nghiệp tại UNIVI"
              caption="UNIVI tư vấn đồng phục Pickleball từ chất liệu, thiết kế đến khả năng đặt bổ sung."
            />
          </div>
          <ul className="space-y-2">
            {[
              'Xưởng sản xuất 2.000m² tại phường Chương Mỹ, Hà Nội.',
              'Công suất 100.000 sản phẩm/tháng.',
              'Phòng R&D nghiên cứu chất liệu, form, độ co giãn, thoáng khí, thoát ẩm, chống xù và độ bền màu.',
              'Công nghệ UNI DRY hỗ trợ thoát ẩm.',
              'Hỗ trợ tư vấn và thiết kế theo bộ nhận diện.',
              'Có thể lưu chuẩn mẫu để phục vụ tái sản xuất.',
            ].map((item) => (
              <li key={item} className="flex gap-2 text-gray-700">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#105d97]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            Năng lực lớn chỉ có ý nghĩa khi được chuyển thành quy trình kiểm soát cho từng đơn
            đồng phục Pickleball. Với CLB, giá trị thực tế là có người cùng kiểm brief, chọn đúng
            nền vải, phân vai, quản lý danh sách tên số và chuẩn hóa lần đặt sau. Với giải đấu,
            đó là khả năng phối hợp nhiều mẫu trong cùng hệ nhận diện.
          </p>
          <p>
            Thông tin xưởng và công suất giúp đánh giá năng lực; mẫu thật và điều khoản báo giá
            giúp đánh giá độ phù hợp. Quý đối tác nên yêu cầu mẫu vải, mockup, bảng size, phạm
            vi QC và mốc duyệt trước khi chốt đơn.
          </p>
        </div>
      </Section>

      <Section id="giai-phap-theo-doi-tuong" eyebrow="" title="6. Giải Pháp Đồng Phục Theo Từng Đối Tượng">
        <div className="space-y-6 leading-6">
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.1 Đồng phục CLB Pickleball</h3>
            <p>
              Với đồng phục Pickleball cho CLB, cần ưu tiên tính dễ mặc, khả năng bổ sung và nhận
              diện dài hạn. Nên có một mẫu lõi dùng nhiều mùa, sau đó phát triển phiên bản giải
              đấu hoặc kỷ niệm. Polo phù hợp hình ảnh chỉn chu; T-shirt phù hợp nhóm trẻ và buổi
              tập thường kỳ.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.2 Đồng phục học viện Pickleball</h3>
            <p>
              Học viện nên phân vai đồng phục Pickleball bằng chi tiết rõ nhưng vẫn cùng hệ màu:
              huấn luyện viên, trợ giảng, học viên và vận hành. Áo HLV cần vận động tốt và dễ nhận
              ra từ xa. Áo học viên nên dễ cấp phát, dễ giặt và dễ đặt thêm theo khóa.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.3 Đồng phục doanh nghiệp</h3>
            <p>
              Đồng phục cho team building hoặc câu lạc bộ nội bộ cần cân bằng giữa nhận diện công
              ty và tinh thần thể thao. Logo doanh nghiệp nên có mặt nhưng không lấn át trải nghiệm.
              Nếu dùng sau sự kiện, nhân viên sẽ tiếp tục biến chiếc áo thành một điểm chạm thương
              hiệu tự nhiên.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.4 Đồng phục giải đấu</h3>
            <p>
              Ban tổ chức cần lập ma trận màu trước khi thiết kế: vận động viên, BTC, trọng tài,
              check-in, y tế và tình nguyện viên. Màu phải đủ khác nhau để nhận diện nhanh trên
              sân, đồng thời giữ vị trí cho logo giải và nhà tài trợ.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.5 Đồng phục ban tổ chức</h3>
            <p>
              Áo BTC nên dễ nhìn, có vùng lưng rõ và đủ lịch sự khi tiếp khách. Polo hoặc polo zip
              là lựa chọn thực tế; chất liệu cần phù hợp với việc di chuyển liên tục giữa sân, khu
              kỹ thuật và sân khấu.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.6 Đồng phục trọng tài</h3>
            <p>
              Trọng tài cần màu tách biệt với vận động viên, form gọn và khả năng thoát ẩm. Chi
              tiết trang trí nên tiết chế để vai trò chuyên môn được nhận ra ngay.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">6.7 Đồng phục check-in và lễ tân</h3>
            <p>
              Nhóm check-in giao tiếp gần với khách và nhà tài trợ nên ưu tiên form đứng, ít nhăn
              và bảng tên dễ đọc. Cách phân vai này tương đồng tư duy{' '}
              <Link href="/giai-phap-2s" className="font-semibold text-[#105d97] hover:underline">
                Giải pháp 2S Uniform
              </Link>
              : không dùng một mẫu cho mọi nhiệm vụ, mà đồng bộ bằng cùng hệ nhận diện.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55341996717_e884553f62_b.jpg"
            alt="Đồng phục Pickleball cho CLB học viện doanh nghiệp và giải đấu"
            caption="Mỗi nhóm khách hàng cần một cấu hình đồng phục Pickleball riêng theo mục tiêu sử dụng."
          />
        </div>
      </Section>

      <Section id="pain-points" eyebrow="" title="7. Lỗi Đau Khi Chọn Đồng Phục Pickleball">
        <div className="grid gap-4 md:grid-cols-3">
          {painPoints.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55273287874_96694796ef_b.jpg"
            alt="Người chơi Pickleball gặp lỗi trang phục khi chọn sai đồng phục"
            caption="Sai chất liệu, thiết kế rời rạc và ngân sách không rõ là ba vấn đề phổ biến khi chọn đồng phục Pickleball."
          />
        </div>
        <div className="mt-6 space-y-4 leading-6">
          <p>
            Thông điệp cần nhấn mạnh là lỗi không luôn nằm ở cường độ vận động. Nhiều khi vấn đề
            đến từ trang phục: áo cotton dày giữ mồ hôi, áo thun giá rẻ thiếu co giãn, quần không
            phù hợp khiến người chơi khó với bóng hoặc phải gồng người khi di chuyển.
          </p>
          <p>
            UNIVI giải quyết nhóm pain point này bằng hướng tư vấn rõ hơn: chọn chất liệu thể thao
            chuyên dụng, ưu tiên cấu trúc thoát ẩm, co giãn, nhẹ và dễ bảo quản; đồng thời xử lý
            thiết kế theo logo, màu đội, tên số và nhà tài trợ.
          </p>
        </div>
      </Section>

      <Section id="chat-lieu" eyebrow="" title="8. Chất Liệu Chuyên Dụng Cho Pickleball">
        <p className="mb-5 leading-6">
          Chất liệu là phần quyết định trải nghiệm thật trên sân. Một mẫu tốt phải được thử trong
          chuyển động: giao bóng, vung tay, xoay vai, hạ trọng tâm và di chuyển ngang.
        </p>
        <div className="mb-6">
          <FabricCardComponent />
        </div>
        <SimpleTable
          headers={['Chất liệu', 'Cấu tạo / định vị', 'Ưu điểm', 'Phù hợp']}
          rows={materials}
        />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <TextCard title="37°C trên sân khác phòng máy lạnh">
            <p>
              Khi chơi ngoài trời, đội nên tránh áo quá dày, màu quá hấp nhiệt nếu không có cấu
              trúc vải phù hợp, form bó cứng ở vai và quần không co giãn.
            </p>
          </TextCard>
          <TextCard title="Tính năng cần xác nhận theo mã vải">
            <p>
              Các tính năng như hỗ trợ kháng khuẩn hoặc chống UV nên được tư vấn theo đúng mã vải,
              cùng với độ thoáng, độ co giãn, độ bền màu và cảm giác tiếp xúc da.
            </p>
          </TextCard>
        </div>
      </Section>

      <Section id="uni-dry" eyebrow="" title="9. Công Nghệ UNI DRY">
        <div className="space-y-2 leading-6">
          <p>
            <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97] hover:underline">
              UNI DRY
            </Link>{' '}
            là công nghệ xử lý thoát ẩm được UNIVI ứng dụng trên các dòng chất liệu thể thao
            chuyên dụng. Nguyên lý cốt lõi là kiểm soát chuyển động một chiều của hơi ẩm: từ
            bề mặt da, qua lớp trong vải, ra lớp ngoài vải và bay hơi ra môi trường.
          </p>
          <p>
            Với Pickleball, UNI DRY có ý nghĩa rõ ở vùng lưng, vai, nách và cổ áo. Đây là các
            khu vực dễ bết khi người chơi chạy, đổi hướng và vung tay liên tục.
          </p>
          <p>
            Công nghệ không thay thế việc chọn đúng form, nhưng là nền tảng quan trọng để áo
            mặc dễ chịu hơn trong thời gian dài.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55255352906_17d6019050_b.jpg"
            alt="Infographic công nghệ UNI DRY thoát ẩm một chiều cho áo Pickleball"
            caption="UNI DRY hỗ trợ đưa hơi ẩm từ da ra bề mặt vải để giảm cảm giác bết dính."
          />
        </div>
      </Section>

      <Section id="vai-tro-trong-clb" eyebrow="" title="10. Giải Pháp Theo Từng Vai Trò Trong CLB">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roleSolutions.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="quy-trinh" eyebrow="" title="11. Quy Trình Đặt May Đồng Phục Pickleball">
        <ProcessSteps variant="vertical" />
        <p className="mt-5 leading-6">
          Brief tốt nên có logo gốc, màu thương hiệu, số lượng dự kiến, nhóm người mặc, sản
          phẩm cần làm, môi trường sân, ngày cần hàng, yêu cầu tên số và logo nhà tài trợ.
          Sau khi hoàn tất, CLB nên lưu mã vải, mã màu, file thiết kế và thông số size để đặt
          bổ sung không lệch.
        </p>
      </Section>

      <Section id="14-mau-ao-polo-pickleball" eyebrow="" title="12. 14 Mẫu Áo Polo Pickleball UniPick">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
          {unipickModels.map(([code, name, summary, href, fit], index) => (
            <Link
              key={code}
              href={href}
              className="block pb-6"
            >
              <div className="mb-4 w-full overflow-hidden bg-white">
                <Image
                  src={unipickModelImages[index % unipickModelImages.length]}
                  alt={name}
                  width={900}
                  height={1200}
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
              <div className="mt-1 space-y-1">
                <h3 className="text-lg md:text-xl font-medium text-gray-900">
                  {name}
                </h3>
                <p className="text-sm leading-6 text-gray-700">{summary}</p>
                <p className="text-sm font-semibold text-gray-900">Phù hợp: {fit}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="he-san-pham" eyebrow="" title="13. Không Chỉ Có Polo Pickleball">
        <p className="mb-5 leading-6">
          Polo là sản phẩm mũi nhọn vì vừa lịch sự vừa thể thao. Tuy nhiên, một hệ đồng phục
          Pickleball theo yêu cầu có thể gồm nhiều dòng để phù hợp vai trò, vóc dáng và bối cảnh
          sử dụng.
        </p>
        <div className="mb-5 grid grid-cols-3 gap-3">
          {SECTION_11_IMAGES_TO_REPLACE.map((image) => (
            <div key={image.src} className="relative aspect-[3/4] w-full overflow-hidden bg-gray-50">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 260px"
              />
            </div>
          ))}
        </div>
        <ul className="grid gap-3 md:grid-cols-2">
          {productSystem.map((item) => (
            <li key={item} className="rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 leading-6">
          UNIVI có thể tư vấn outfit đồng bộ như Polo + quần short dáng suông, T-shirt + chân váy
          có quần bảo hộ, áo sát nách có cổ + chân váy xếp ly, hoặc áo khoác gió nhẹ + Polo/T-shirt
          cho di chuyển ngoài trời.
        </p>
      </Section>

      <Section id="bang-gia" eyebrow="" title="14. Bảng Giá Đồng Phục Pickleball">
        <p className="mb-5 leading-6">
          Giá đồng phục Pickleball sẽ phụ thuộc vào số lượng đặt may, chất liệu, kiểu sản phẩm,
          kỹ thuật hoàn thiện logo, tên số, tiến độ cần hàng và mức độ tùy biến của từng dự án.
        </p>
        <SimpleTable headers={['Quy mô', 'Nhu cầu thường gặp', 'Hướng tư vấn']} rows={pricingRows} />
        <div className="mt-6 rounded-xl bg-[#105d97] p-5 text-white">
          <p className="text-lg font-medium">Cần báo giá theo cấu hình thực tế?</p>
          <p className="mt-2 text-sm text-blue-50">
            Gửi logo, số lượng, ngày cần hàng, môi trường sân, sản phẩm muốn làm và yêu cầu cá nhân hóa để UNIVI đề xuất chất liệu, form, mockup và phương án báo giá.
          </p>
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="mt-4 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-medium text-[#105d97] hover:bg-blue-50"
          >
            Liên hệ báo giá đồng phục Pickleball
          </button>
        </div>
      </Section>

      <Section id="dong-phuc-pickleball-theo-khu-vuc" eyebrow="" title="15. Đồng Phục Pickleball Tại Hà Nội, TP.HCM Và Toàn Quốc">
        <div className="space-y-6 leading-6">
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">15.1 Đồng phục Pickleball Hà Nội</h3>
            <p>
              Khách hàng đặt đồng phục Pickleball tại Hà Nội có lợi thế tiếp cận văn phòng ở Hà
              Đông và xưởng tại phường Chương Mỹ, Hà Nội để xem mẫu, trao đổi brief hoặc đối chiếu màu khi cần.
              Với dự án có nhiều vai trò, buổi duyệt mẫu trực tiếp giúp chốt form và chất liệu
              nhanh hơn.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">15.2 Đồng phục Pickleball TP.HCM</h3>
            <p>
              Univi hỗ trợ đồng phục Pickleball TP.HCM theo quy trình từ xa: nhận brief, gửi
              mockup, thống nhất mẫu vải/mẫu thử, chốt danh sách size và giao hàng. Cần cộng thời
              gian vận chuyển vào kế hoạch, đặc biệt khi hàng phục vụ ngày khai mạc cố định.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">15.3 Đồng phục Pickleball Đà Nẵng</h3>
            <p>
              CLB, resort và ban tổ chức tại Đà Nẵng có thể dùng quy trình duyệt từ xa tương tự.
              Brief nên ghi rõ sân trong nhà hay ngoài trời, lịch sự kiện, cơ cấu khách du
              lịch/thành viên và địa chỉ nhận. Với resort, nên gửi ảnh không gian để bảng màu
              đồng phục hài hòa với kiến trúc.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-gray-900">15.4 Đồng phục Pickleball toàn quốc</h3>
            <p>
              Với các tỉnh thành khác, điều quan trọng là quản lý mẫu và dữ liệu. Ảnh màu trên
              màn hình có thể sai khác, vì vậy dự án nhạy màu nên duyệt mẫu vật lý. Danh sách
              size, tên số và kiện hàng cần có mã đối chiếu. Thời gian và phí vận chuyển cụ thể
              cần xác nhận theo địa chỉ và đơn hàng.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55372197542_63bfd8685b_b.jpg"
            alt="Đồng phục Pickleball giao hàng toàn quốc từ xưởng UNIVI tại Hà Nội"
            caption="UNIVI sản xuất và giao đồng phục Pickleball toàn quốc, hỗ trợ tư vấn từ xa cho CLB, học viện và giải đấu tại TP.HCM, Đà Nẵng và các tỉnh thành."
          />
        </div>
      </Section>

      <Section id="footer-seo" eyebrow="" title="16. Đồng Phục Pickleball Theo Yêu Cầu Tại UNIVI">
        <div className="space-y-4 leading-6">
          <p>
            Đồng Phục Univi là đơn vị cung cấp giải pháp đồng phục thể thao chuyên dụng cho CLB,
            học viện, doanh nghiệp và đội nhóm thể thao tại Việt Nam. Với Pickleball, UNIVI phát
            triển hệ sản phẩm UniPick nhằm giải quyết đồng thời nhu cầu vận động, hình ảnh đội
            nhóm và khả năng đặt may theo nhận diện riêng.
          </p>
          <p>
            UNIVI sở hữu xưởng sản xuất 2.000m2 tại phường Chương Mỹ, Hà Nội, công suất 100.000 sản phẩm/tháng,
            phòng R&D nghiên cứu chất liệu và quy trình tư vấn từ brief đến giao hàng.
          </p>
          <p>
            Nếu bạn cần may đồng phục Pickleball cho CLB, học viện, giải đấu hoặc doanh nghiệp,
            hãy chuẩn bị logo, số lượng, ngày cần hàng và nhu cầu sản phẩm để UNIVI tư vấn cấu
            hình phù hợp.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55365932019_08b8ae116e_b.jpg"
            alt="Đồng phục Pickleball theo yêu cầu tại UNIVI"
            caption="UNIVI tư vấn và sản xuất đồng phục Pickleball theo cấu hình thực tế của từng CLB, học viện, doanh nghiệp và giải đấu."
          />
        </div>
      </Section>

      <Section id="checklist" eyebrow="" title="17. Checklist Chốt Đơn Cho CLB, Học Viện Và Giải Đấu">
        <p className="mb-5 leading-6">
          Trước khi yêu cầu báo giá, người phụ trách nên xác định rõ đồng phục sẽ phục vụ mục tiêu
          nào: áo thành viên CLB, áo thi đấu, áo giải đấu, đồng phục ban tổ chức hay hệ sản phẩm
          dài hạn cho học viện.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {checklistGroups.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>
      <section className="bg-[#105d97] p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-blue-100">
              UNIVI SPORTS UNIFORM - YOUR UNIFORM, YOUR BRAND!
            </p>
            <h2 className="mt-1 text-xl md:text-2xl font-medium tracking-tight leading-tight">
              Liên Hệ Với Xưởng May Đồng Phục Univi Ngay Hôm Nay
            </h2>
            <p className="mt-2  text-sm leading-6 text-blue-50">
              Bạn đang cần may đồng phục Pickleball cho CLB, học viện, doanh nghiệp hoặc giải đấu?
              Hãy gửi UNIVI logo, số lượng dự kiến, ngày cần hàng, môi trường sân, sản phẩm muốn làm
              và yêu cầu cá nhân hóa.
            </p>
            <div className="mt-3 grid gap-1 text-sm text-blue-50">
              <p><span className="font-semibold">Văn phòng:</span> Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</p>
              <p><span className="font-semibold">Xưởng sản xuất:</span> Phường Chương Mỹ, Thành phố Hà Nội</p>
              <p><span className="font-semibold">Hotline:</span> 0834.204.999 / 096.156.7997</p>
              <p><span className="font-semibold">Email:</span> dongphucunivi@gmail.com</p>
            </div>
          </div>

        </div>
      </section>
      <Section id="faq" eyebrow="" title="Câu Hỏi Thường Gặp Về Đồng Phục Pickleball">
        <div className="space-y-3">
          {pickleballFaqs.map(([question, answer]) => (
            <details key={question} className="group rounded-lg border border-gray-200 bg-gray-50">
              <summary className="cursor-pointer px-4 py-3 font-semibold text-gray-900">
                {question}
              </summary>
              <p className="px-4 py-3 text-sm leading-6 text-gray-700">{answer}</p>
            </details>
          ))}
        </div>
      </Section>
      <ContactForm
        source="Đồng phục Pickleball - Nhận báo giá"
        isModal
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}
