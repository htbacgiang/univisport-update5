import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';

const gioiHanNhomQua = [
  ['Quà tặng văn phòng', 'Phù hợp khi mục tiêu là sử dụng thường xuyên tại nơi làm việc. Univi chưa có catalogue quà văn phòng được xác thực - hãy chia sẻ nhu cầu cụ thể về nguồn hàng, quy cách in và tiêu chuẩn đóng gói để được tư vấn riêng.', '/qua-tang/qua-tang-tap-doan-thanh-cong.jpg', 'Không gian văn phòng doanh nghiệp - bối cảnh sử dụng quà tặng văn phòng'],
  ['Bình giữ nhiệt và cốc', 'Thường phù hợp chương trình chăm sóc nhân viên, giải chạy hay sự kiện có yếu tố sức khỏe vì có tính sử dụng lặp lại. Hiện chưa có dữ liệu sản phẩm hoặc kỹ thuật gia công nhóm này; cần xác nhận mẫu, giá và kỹ thuật in trước khi đưa vào brief.', '/qua-tang/binh-giu-nhiet-va-coc-sun-ha-long.jpg', 'Hoạt động chạy bộ và chăm sóc sức khỏe nhân viên - bối cảnh dùng bình giữ nhiệt'],
  ['Quà tặng công nghệ', 'Cần kiểm tra kỹ nguồn gốc, bảo hành, tính tương thích và yêu cầu kỹ thuật khi in logo. Đây chưa phải nhóm sản phẩm đã được xác thực cho Univi, nên cần trao đổi riêng trước khi đưa vào phương án.', '/qua-tang/qua-tang-cong-nghe.jpg', 'Định hướng phát triển sản phẩm - quà tặng công nghệ cần xác nhận nguồn riêng'],
  ['Túi và ba lô', 'Dữ liệu sản phẩm Univi xác nhận có thể phối túi trong hệ phụ kiện cho CLB/doanh nghiệp, nhưng chưa có catalogue túi hoặc ba lô quà tặng độc lập. Cần duyệt cấu hình, chất liệu, vị trí nhận diện và mẫu thực tế trước khi chốt.', '/qua-tang/tui-qua-tang-doanh-nghiep.jpg', 'Flat lay túi và phụ kiện trong hệ đồng phục Univi'],
  ['Mũ và phụ kiện', 'Có tính phù hợp cao với giải thể thao, teambuilding hoặc chương trình ngoài trời. Trong hệ sản phẩm golf–tennis, Univi có dữ liệu phối visor, túi và tất để tăng nhận diện - đây là cơ sở để tư vấn phụ kiện cùng đồng phục.', '/qua-tang/mu-dong-phuc.jpg', 'Mũ, visor và phụ kiện trong hệ sản phẩm golf-tennis Univi'],
  ['Quà tặng sức khỏe', 'Phù hợp ngày hội sức khỏe, câu lạc bộ chạy, hoạt động nội bộ hoặc chiến dịch wellness. Lợi thế xác thực của Univi nằm ở trang phục thể thao: áo gió, áo sự kiện và đồng phục theo mục đích vận động.', '/qua-tang/qua-tang-suc-khoe-doanh-nghiep.jpg', 'Đồng phục chạy bộ và trang phục vận động - hướng quà tặng sức khỏe'],
  ['Gift set doanh nghiệp', 'Cách gom các thành phần có cùng thông điệp vào một trải nghiệm trao tặng thống nhất. Univi có thể tư vấn concept nhận diện và cấu phần đồng phục/phụ kiện đã xác thực; vật phẩm ngoài hệ sản phẩm này cần được xác nhận nguồn trước khi công bố.', '/qua-tang/bo-qua-tang-king-fitnes.jpg', 'Gift set doanh nghiệp phối cùng đồng phục và phụ kiện nhận diện'],
  ['Quà tặng cao cấp', '“Cao cấp” không nên chỉ định nghĩa bằng giá. Với B2B, đó là mức độ phù hợp, chất lượng hoàn thiện, cá nhân hóa và đóng gói đúng đối tượng - cần brief riêng về người nhận, ngân sách, số lượng và tiêu chuẩn quà trước khi đề xuất.', '/qua-tang/qua-tang-doanh-nghiep-cao-cap.jpg', 'Kiểm tra chất lượng hoàn thiện cho quà tặng doanh nghiệp cao cấp'],
];

const quaTheoMucDich = [
  ['Quà tặng khách hàng', 'Người nhận là khách hàng hiện hữu, khách hàng thân thiết hoặc khách mời có tiềm năng. Nên chọn quà hữu ích, nhận diện vừa phải, thông điệp rõ; tránh dùng một mẫu chung cho mọi phân khúc nếu giá trị quan hệ khác nhau.', '/qua-tang/qua-tang-khach-hang.jpg', 'Quà tặng khách hàng doanh nghiệp theo nhận diện thương hiệu'],
  ['Quà tặng đối tác', 'Đối tác thường quan tâm sự chỉn chu và tính phù hợp văn hóa hơn số lượng chi tiết trang trí. Ưu tiên quà có câu chuyện, cách trao được chuẩn bị kỹ và quy cách đóng gói đồng nhất.', '/qua-tang/qua-tang-doi-tac.jpg', 'Trao quà tặng đối tác chỉn chu, đồng bộ nhận diện'],
  ['Quà tặng nhân viên', 'Dành cho nhân sự mới, cột mốc hoặc chương trình nội bộ. Áo khoác gió, đồng phục hoạt động, mũ/visor và cấu phần liên quan sức khỏe là hướng phù hợp với năng lực sản phẩm hiện có; cần thu size và chốt kế hoạch phát trước ngày diễn ra.', '/qua-tang/qua-tang-nhan-vien.jpg', 'Nhóm nhân viên nhận quà tặng và đồng phục nội bộ'],
  ['Quà tặng hội nghị', 'Dành cho khách mời, diễn giả, đại biểu hoặc nhà tài trợ. Ưu tiên sản phẩm dễ phân phát, bao bì gọn, có danh sách kiểm đếm và thiết kế đồng bộ với badge, backdrop, trang phục ban tổ chức.', '/qua-tang/qua-tang-hoi-nghi.jpg', 'Quà tặng hội nghị đồng bộ với backdrop và trang phục ban tổ chức'],
  ['Quà tặng sự kiện', 'Cần phục vụ một “khoảnh khắc dùng” rõ ràng: check-in, tham gia hoạt động, chụp ảnh hay mang về sau chương trình. Với giải thể thao và activation ngoài trời, có thể kết nối quà với đồng phục pickleball hoặc áo gió để cùng một bảng màu và logo.', '/qua-tang/qua-tang-dai-hoi-the-duc-the-thao.jpg', 'Quà tặng sự kiện gắn với đồng phục pickleball và áo gió'],
  ['Quà tặng teambuilding', 'Người nhận là tập thể nhân sự hoặc đội liên phòng ban. Quà nên bền, dễ nhận diện theo team và phù hợp môi trường vận động; cần chốt size, bảng màu và điểm phát quà từ sớm.', '/qua-tang/qua-tang-teambuilding.jpg', 'Quà tặng teambuilding bền, dễ nhận diện theo đội'],
  ['Quà tặng khai trương', 'Dành cho khách mời, khách hàng đầu tiên hoặc nội bộ tại điểm mới. Hãy xác định số lượt khách dự kiến, cơ chế nhận quà và vật phẩm cần giữ lại cho đội vận hành trước khi quyết định số lượng.', '/qua-tang/qua-tang-khai-truong.jpg', 'Quà tặng khai trương tạo ấn tượng đầu tiên cho khách mời'],
  ['Quà tặng kỷ niệm thành lập', 'Dịp để kể câu chuyện thương hiệu và ghi nhận hành trình chung. Nếu có hoạt động vận động hoặc giải nội bộ, bộ trang phục mang thương hiệu có thể là điểm neo hữu dụng hơn một vật phẩm chỉ dùng một lần.', '/qua-tang/set-qua-tang-ky-niem-10-nam-thanh-lap-cong-ty-in-logo.jpg', 'Quà tặng kỷ niệm thành lập kể câu chuyện thương hiệu'],
];

const giftSetConcepts = [
  ['Welcome Kit', 'Dành cho nhân sự mới; xác định trang phục nhận diện và thông điệp chào đón trước, rồi mới cân nhắc vật phẩm bổ sung.'],
  ['Employee Kit', 'Dành cho cột mốc nội bộ, hoạt động sức khỏe hoặc chương trình gắn kết; ưu tiên sản phẩm có khả năng sử dụng lặp lại.'],
  ['Event Kit', 'Dành cho khách mời hoặc ban tổ chức; cần phối bộ với badge, backdrop và dress code.'],
  ['Customer Gift Set', 'Dành cho khách hàng; ưu tiên tính phù hợp phân khúc và cách thể hiện thương hiệu tinh tế.'],
  ['Partner Gift Set', 'Dành cho đối tác; cần chú trọng thông điệp, quy cách trao và tính chỉn chu của toàn bộ set.'],
];

const quyTrinhSteps = [
  ['Tiếp nhận nhu cầu', 'Ghi nhận dịp tặng, người nhận, số lượng, ngân sách, thời gian và địa điểm giao.'],
  ['Tư vấn', 'Làm rõ mục tiêu thương hiệu, bối cảnh sử dụng và mức độ cá nhân hóa cần thiết.'],
  ['Xác định ngân sách', 'Phân bổ cho cấu phần chính, nhận diện, đóng gói và các chi phí triển khai liên quan.'],
  ['Lựa chọn sản phẩm', 'Chỉ chốt sản phẩm/cấu hình đã có xác nhận về nguồn và khả năng thực hiện.'],
  ['Thiết kế', 'Phát triển bố cục nhận diện, màu sắc và vị trí logo phù hợp vật phẩm.'],
  ['Duyệt mẫu', 'Duyệt mockup; nếu hạng mục yêu cầu, cần duyệt mẫu thực tế trước sản xuất hoặc đặt số lượng lớn.'],
  ['Sản xuất/đặt nguồn', 'Triển khai theo mẫu đã duyệt và cấu hình được chốt bằng văn bản.'],
  ['Kiểm tra', 'Kiểm tra số lượng, nhận diện, quy cách đóng gói theo checklist đã thống nhất.'],
  ['Đóng gói', 'Phân loại theo người nhận, đội, cơ sở hoặc danh sách phát quà khi cần.'],
  ['Giao hàng', 'Xác nhận lịch, điểm nhận, đầu mối kiểm đếm và biên bản bàn giao phù hợp.'],
];

const checklistItems = [
  ['Xác định người nhận', 'Khách hàng, đối tác, nhân viên hay khách mời có nhu cầu và kỳ vọng khác nhau.'],
  ['Xác định mục đích', 'Tri ân, onboarding, hội nghị, teambuilding hay kỷ niệm cần thông điệp khác nhau.'],
  ['Xác định ngân sách', 'Tính theo suất quà và tách rõ khoản sản phẩm, cá nhân hóa, đóng gói, giao nhận.'],
  ['Xác định số lượng', 'Cần có số dự phòng hợp lý, nhưng không nên suy đoán khi chưa có danh sách.'],
  ['Chọn sản phẩm', 'Ưu tiên công năng phù hợp bối cảnh và nguồn cung đã được xác nhận.'],
  ['Kiểm tra nhận diện', 'Logo, màu, slogan và bao bì phải nhất quán với brand guideline.'],
  ['Kiểm tra thời gian', 'Khóa mốc duyệt thiết kế, duyệt mẫu, sản xuất và giao trước ngày cần sử dụng.'],
  ['Kiểm tra đóng gói', 'Xác định đóng theo set, theo người, theo đội hay theo địa điểm.'],
  ['Duyệt mẫu', 'Không bỏ qua mockup; với hạng mục mới, cần duyệt mẫu thực tế.'],
  ['Kiểm tra giao hàng', 'Có đầu mối nhận, phương án kiểm đếm và xử lý phần quà thiếu/thừa.'],
];

const faqs = [
  [
    'Quà tặng doanh nghiệp là gì?',
    'Quà tặng doanh nghiệp là sản phẩm hoặc bộ sản phẩm được doanh nghiệp chuẩn bị cho khách hàng, đối tác, nhân viên, khách mời hoặc cộng đồng trong một dịp cụ thể. Việc lựa chọn nên dựa trên người nhận, mục đích, ngân sách, số lượng, thời gian và nhận diện thương hiệu.'
  ],
  [
    'Phụ kiện doanh nghiệp gồm những gì?',
    'Phụ kiện doanh nghiệp có thể gồm mũ, khăn, túi, balo hoặc các vật phẩm hỗ trợ sự kiện và nhận diện tùy nhu cầu. Danh mục thực tế nên được xác định theo người sử dụng, mục đích, số lượng và khả năng cá nhân hóa của từng sản phẩm.'
  ],
  [
    'Doanh nghiệp nên chọn quà tặng theo tiêu chí nào?',
    'Nên bắt đầu từ người nhận, dịp trao tặng, ngân sách trên mỗi suất, số lượng, thông điệp muốn truyền tải và thời gian cần nhận hàng. Sau đó mới chọn sản phẩm, cách cá nhân hóa và phương án đóng gói.'
  ],
  [
    'Nên tặng gì cho khách hàng doanh nghiệp?',
    'Nên ưu tiên món quà phù hợp với nhóm khách hàng, có khả năng sử dụng thực tế và thể hiện nhận diện thương hiệu vừa đủ. Với khách hàng quan trọng, có thể cân nhắc bộ quà thay vì một vật phẩm đơn lẻ nếu ngân sách và bối cảnh phù hợp.'
  ],
  [
    'Nên tặng gì cho đối tác doanh nghiệp?',
    'Quà tặng cho đối tác nên ưu tiên sự chỉn chu, phù hợp mối quan hệ và bối cảnh trao tặng. Doanh nghiệp có thể cân nhắc vật phẩm sử dụng thường xuyên hoặc bộ quà có cách đóng gói đồng bộ nhận diện.'
  ],
  [
    'Có nên tặng quà cho nhân viên không?',
    'Có thể. Quà tặng cho nhân viên thường phục vụ các dịp như kỷ niệm, chương trình nội bộ, lễ tết hoặc hoạt động gắn kết. Nên cân nhắc tính hữu dụng, số lượng và sự phù hợp với nhóm người nhận.'
  ],
  [
    'Có thể in hoặc thêu logo lên quà tặng không?',
    'Có thể với những sản phẩm có bề mặt và cấu trúc phù hợp. Kỹ thuật in, thêu hoặc phương pháp thể hiện logo cần được lựa chọn theo vật liệu, kích thước, vị trí và yêu cầu thẩm mỹ của từng sản phẩm.'
  ],
  [
    'Có thể làm quà tặng theo màu nhận diện thương hiệu không?',
    'Có thể trong phạm vi sản phẩm và vật liệu cho phép. Doanh nghiệp nên cung cấp mã màu hoặc bộ nhận diện để đơn vị triển khai có cơ sở tư vấn màu sản phẩm, logo và các chi tiết đi kèm.'
  ],
  [
    'Nên chọn quà tặng đơn lẻ hay bộ quà tặng?',
    'Quà đơn phù hợp khi cần triển khai số lượng lớn hoặc phát rộng trong sự kiện. Bộ quà phù hợp hơn với một số chương trình dành cho khách hàng, đối tác hoặc khách mời quan trọng. Không nên mặc định bộ quà luôn tốt hơn; quyết định phụ thuộc vào người nhận, ngân sách và mục đích.'
  ],
  [
    'Quà tặng doanh nghiệp có thể kết hợp với đồng phục không?',
    'Có. Quà tặng có thể được triển khai cùng đồng phục trong các chương trình sự kiện, Teambuilding, hoạt động nội bộ hoặc chiến dịch thương hiệu. Việc kết hợp giúp màu sắc, logo và thông điệp được triển khai nhất quán hơn.'
  ],
  [
    'Quà tặng doanh nghiệp phù hợp với những dịp nào?',
    'Quà tặng có thể được sử dụng trong hội nghị, hội thảo, khai trương, kỷ niệm, tri ân khách hàng, chăm sóc đối tác, chương trình nội bộ, Teambuilding, Company Trip và các sự kiện thương hiệu tùy mục tiêu.'
  ],
  [
    'Chi phí quà tặng doanh nghiệp phụ thuộc vào những yếu tố nào?',
    'Chi phí phụ thuộc vào loại sản phẩm, số lượng, ngân sách trên mỗi suất, mức độ cá nhân hóa, kỹ thuật in hoặc thêu, đóng gói, số lượng vật phẩm trong bộ quà và yêu cầu giao hàng.'
  ],
  [
    'Số lượng đặt quà tặng doanh nghiệp có ảnh hưởng đến đơn giá không?',
    'Có thể. Đơn giá thường cần được xem xét cùng số lượng, loại sản phẩm, phương pháp cá nhân hóa, đóng gói và cấu hình đơn hàng. Doanh nghiệp nên yêu cầu báo giá trên cùng một cấu hình để so sánh chính xác.'
  ],
  [
    'Có nên duyệt mẫu quà tặng trước khi sản xuất số lượng lớn không?',
    'Nên, đặc biệt khi sản phẩm có logo, màu thương hiệu, bao bì hoặc yêu cầu cá nhân hóa riêng. Mẫu giúp kiểm tra vật liệu, màu sắc, kích thước, vị trí logo và cách hoàn thiện trước khi triển khai toàn bộ.'
  ],
  [
    'Nên đặt quà tặng doanh nghiệp trước sự kiện bao lâu?',
    'Nên chốt sớm vì thời gian triển khai phụ thuộc vào sản phẩm, số lượng, mức độ cá nhân hóa, duyệt mẫu, đóng gói và địa điểm giao hàng. Ngày cần nhận hàng nên được xác định ngay từ lúc gửi brief.'
  ],
  [
    'UNIVI có nhận thiết kế quà tặng doanh nghiệp theo yêu cầu không?',
    'Univi có thể tiếp nhận brief để tư vấn cấu hình sản phẩm, nhận diện và phương án triển khai theo từng dự án. Phạm vi thiết kế, mẫu thử và mức độ tùy chỉnh cần được xác nhận theo sản phẩm và đơn hàng cụ thể.'
  ],
  [
    'UNIVI có nhận đơn hàng số lượng lớn không?',
    'Univi công bố năng lực sản xuất gồm xưởng 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất khoảng 100.000 sản phẩm mỗi tháng. Khả năng triển khai thực tế đối với từng nhóm phụ kiện hoặc quà tặng cần được xác nhận theo sản phẩm, số lượng và thời gian yêu cầu.'
  ],
  [
    'Có thể đặt lại cùng mẫu quà tặng cho những chương trình sau không?',
    'Có thể thuận tiện tái đặt nếu doanh nghiệp lưu lại mẫu chuẩn, thông tin sản phẩm, màu sắc, logo, quy cách đóng gói và file thiết kế. Việc lưu chuẩn giúp hạn chế sai khác giữa các đợt đặt hàng.'
  ]
];

function BulletGrid({ items, cols = 'md:grid-cols-2' }) {
  return (
    <div className={`grid gap-1 ${cols}`}>
      {items.map(([title, text]) => (
        <div key={title} className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3">
          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
}

function SubsectionWithImage({ number, title, text, image, alt }) {
  return (
    <div className="mb-3 last:mb-0">
      <h3 className="text-lg md:text-xl font-bold mb-2">
        <span className="text-[#105d97] mr-1">{number}</span> {title}
      </h3>
      <p className="text-base mb-3">{text}</p>
      <figure className=" overflow-hidden ">
        <Image
          src={image}
          alt={alt}
          width={800}
          height={400}
          layout="responsive"
          sizes="(max-width: 800px) 100vw, 800px"
          quality={80}
          className="object-cover"
        />
      </figure>
    </div>
  );
}

function NumberedList({ items }) {
  return (
    <ol className="grid gap-1 mb-2">
      {items.map(([title, text], index) => (
        <li key={title} className="bg-white p-4 border border-slate-200 relative">
          <span className="font-bold text-[#105d97] mr-2">{index + 1}.</span>
          <strong>{title}:</strong> {text}
        </li>
      ))}
    </ol>
  );
}

function ArticleImage({ src, alt }) {
  return (
    <div className="my-6">
      <figure className="w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={800}
          height={400}
          layout="responsive"
          sizes="100vw"
          className="w-full h-auto"
          quality={80}
        />
      </figure>
    </div>
  );
}

export default function GiftAccessoriesUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-xl  mb-4 leading-6">
              Quà Tặng Doanh Nghiệp
              <span className="text-yellow-300"> Giải Pháp Mang Dấu Ấn Thương Hiệu</span>
            </h2>
            <p className="text-base  text-white">
              Chọn quà cho doanh nghiệp thường khó hơn chọn một món đồ đẹp: cần cân bằng ngân sách, số lượng, thông điệp, thời gian triển khai và trải nghiệm người nhận. Đồng Phục Univi tiếp cận theo hướng giải pháp - làm rõ mục tiêu, chọn cấu phần phù hợp, cá nhân hóa nhận diện rồi kết nối quà tặng với đồng phục, sự kiện hoặc hoạt động nội bộ.
            </p>
          </div>
        </div>

        {/* 1 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Quà Tặng Doanh Nghiệp Là Gì?
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Quà tặng doanh nghiệp là sản phẩm hoặc bộ sản phẩm được doanh nghiệp chuẩn bị cho khách hàng, đối tác, nhân viên, khách mời hay cộng đồng trong một bối cảnh xác định. Giá trị của quà không chỉ nằm ở vật phẩm, mà ở việc món quà có phù hợp người nhận, đúng dịp, thể hiện nhận diện nhất quán và có thể sử dụng sau thời điểm trao tặng hay không.
            </p>
            <p className="text-base">
              Trong môi trường B2B, một brief quà tặng tốt thường trả lời năm câu hỏi: ai nhận, trao vào dịp nào, doanh nghiệp muốn người nhận cảm nhận điều gì, số lượng cần triển khai và ngân sách trên mỗi suất là bao nhiêu. Với các chương trình có vận động hoặc cộng đồng thể thao, quà có thể gắn với <Link href="/dong-phuc-chay-bo" className="font-semibold text-[#105d97]">đồng phục chạy bộ</Link> hay đồng phục sự kiện để tăng mức độ sử dụng thực tế.
            </p>
          </div>
        </article>
        <ArticleImage src="/qua-tang/qua-tang-in-logo.jpg" alt="Bộ quà tặng doanh nghiệp được chuẩn bị theo nhận diện thương hiệu Univi" />

        {/* 2 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Vì Sao Doanh Nghiệp Nên Sử Dụng Quà Tặng Thương Hiệu?
          </h2>
          <p className="text-base mb-3">
            Quà tặng thương hiệu tạo một điểm chạm hữu hình trong hành trình quan hệ. Khi vật phẩm có ích, thiết kế phù hợp và mang nhận diện vừa đủ, nó có cơ hội tiếp tục xuất hiện trong công việc, hoạt động cộng đồng hoặc đời sống hằng ngày - khác biệt giữa phát quà theo sự kiện và đầu tư vào trải nghiệm thương hiệu.
          </p>
          <div className="grid gap-1 md:grid-cols-2">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3">
              <h3 className="font-bold text-base mb-1">Với khách hàng</h3>
              <p>Quà là cách ghi nhận mối quan hệ sau dự án, dịp lễ hoặc cột mốc hợp tác.</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3">
              <h3 className="font-bold text-base mb-1">Với đối tác</h3>
              <p>Quà cho thấy sự chuẩn bị và tính nhất quán trong cách doanh nghiệp làm việc.</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3">
              <h3 className="font-bold text-base mb-1">Với nhân viên</h3>
              <p>Quà có thể củng cố cảm giác thuộc về, đặc biệt ở ngày hội nội bộ, onboarding và hoạt động sức khỏe.</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3">
              <h3 className="font-bold text-base mb-1">Với hội nghị, sự kiện</h3>
              <p>Một bộ quà đồng bộ giúp khách mời nhận biết chương trình nhanh hơn và hình ảnh truyền thông thống nhất hơn.</p>
            </div>
          </div>
          <p className="text-base mt-3">
            Tuy nhiên, không nên xem logo càng lớn càng tốt. Nhận diện hiệu quả cần cân đối giữa khả năng nhận biết, thẩm mỹ và bối cảnh sử dụng: logo xuất hiện ở đâu, màu nào phù hợp, bao bì có cần mang thông điệp không và vật phẩm có còn hữu ích sau sự kiện hay không.
          </p>
        </article>
        <ArticleImage src="/qua-tang/tieu-chi-chon-qua-tang-doanh-nghiep-cao-cap.jpg" alt="Doanh nghiệp trao quà tặng thương hiệu cho khách mời sự kiện" />

        {/* 3 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Các Nhóm Quà Tặng Doanh Nghiệp Phổ Biến
          </h2>
          <p className="text-base mb-3">
            Danh mục quà nên được xác lập theo mục đích và dữ liệu năng lực cung ứng, thay vì chạy theo một danh sách sản phẩm thật dài. Univi xác thực rõ năng lực về đồng phục, áo khoác gió và phụ kiện thể thao như mũ/visor, túi trong cấu hình đồng phục; các nhóm dưới đây được dùng như khung chọn lựa và được phân biệt minh bạch.
          </p>
          <div className="space-y-6">
            {gioiHanNhomQua.map(([title, text, image, alt], index) => (
              <SubsectionWithImage
                key={title}
                number={`3.${index + 1}`}
                title={title}
                text={text}
                image={image}
                alt={alt}
              />
            ))}
          </div>
        </article>

        {/* 4 */}
        <article className="bg-white  mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Quà Tặng Doanh Nghiệp Theo Mục Đích
          </h2>
          <div className="space-y-6">
            {quaTheoMucDich.map(([title, text, image, alt], index) => (
              <SubsectionWithImage
                key={title}
                number={`4.${index + 1}`}
                title={title}
                text={text}
                image={image}
                alt={alt}
              />
            ))}
          </div>

        </article>

        {/* 5 */}
        <article className="bg-white ">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Quà Tặng Doanh Nghiệp In Logo Và Cá Nhân Hóa Thương Hiệu
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Cá nhân hóa không chỉ là đặt logo lên vật phẩm. Một hệ nhận diện nhất quán thường gồm màu sắc, vị trí logo, cách dùng slogan, tem nhãn, bao bì và thông điệp đi kèm - kỹ thuật cần được chọn theo chất liệu, bề mặt và tần suất sử dụng để logo không làm giảm trải nghiệm sản phẩm.
            </p>
            <p className="text-base">
              Với nhóm đồng phục và áo khoác gió, Univi có thể tư vấn các kỹ thuật như in chuyển nhiệt, ép decal thể thao, thêu logo nhỏ hoặc phối tag nhận diện tùy chất liệu và số lượng. Mọi phương án cần được duyệt mockup/mẫu trước khi triển khai. Tham khảo thêm năng lực kiểm soát quy trình tại <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97]">xưởng may đồng phục Univi</Link>.
            </p>
            <p className="text-base">
              Riêng khắc laser, hộp quà thiết kế riêng, card/thiệp in riêng hoặc in logo trên bình/cốc là các hạng mục chưa có dữ liệu xác thực - nên đưa vào brief dưới dạng nhu cầu cần xác nhận, thay vì cam kết trước.
            </p>
          </div>
        </article>
        <ArticleImage src="/qua-tang/set-qua-tang-but-bi-thien-long.jpg" alt="Logo thương hiệu được in và thêu trên đồng phục quà tặng doanh nghiệp" />

        {/* 6 */}
        <article className="bg-white ">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Gift Set Doanh Nghiệp
          </h2>
          <p className="text-base mb-3">
            Gift set doanh nghiệp là một bộ quà được thiết kế như một câu chuyện thống nhất, thay vì tập hợp các vật phẩm ngẫu nhiên. Concept nên bắt đầu từ phần đã xác thực: trang phục/áo khoác gió theo nhận diện, mũ hoặc visor và các phụ kiện phù hợp hoạt động thể thao. Năm concept có thể dùng trong brief:
          </p>
          <BulletGrid items={giftSetConcepts} />
          <p className="text-base mt-3">
            Mỗi set nên có một &quot;hero item&quot; - món mang giá trị sử dụng hoặc thông điệp chính - thay vì tăng số món cho đầy hộp. Từ hero item, doanh nghiệp quyết định các món bổ trợ, cách đóng gói và ngân sách.
          </p>
        </article>

        {/* 7 */}
        <article className="bg-white mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            Đồng Phục Và Quà Tặng: Giải Pháp Nhận Diện Thương Hiệu Đồng Bộ
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Khi doanh nghiệp có sự kiện, chương trình nội bộ hoặc cộng đồng vận động, đồng phục và quà không cần tách thành hai hạng mục độc lập. Một hệ thống có thể bắt đầu từ áo đồng phục, áo sự kiện hoặc áo khoác gió; sau đó nối với mũ, túi, phụ kiện và quà theo cùng bảng màu, vị trí logo, thông điệp và quy cách phát.
            </p>
            <p className="text-base">
              Giá trị nằm ở khả năng nhận biết khi chụp ảnh, sự thuận tiện khi vận hành và cảm giác thuộc về của người nhận - không nằm ở việc gắn logo lên mọi bề mặt. Univi là đơn vị <span className="font-semibold">TIÊN PHONG</span> trong nghiên cứu và phát triển đồng phục thể thao chuyên dụng cho chuỗi phòng tập, câu lạc bộ và đội nhóm, nên trang này không định vị Univi như shop quà tặng bán lẻ mà là hướng tư vấn B2B lấy hệ nhận diện và bối cảnh sử dụng làm trung tâm. Với các chuỗi phòng tập, có thể xem <Link href="/giai-phap-2s" className="font-semibold text-[#105d97]">giải pháp 2S Uniform</Link> để hiểu cách tổ chức đồng phục cho nhân sự và hội viên theo một hệ thống.
            </p>
          </div>
        </article>
        <ArticleImage src="/qua-tang/dong-phuc-doanh-nghiep.webp" alt="Hệ đồng phục và quà tặng đồng bộ cho sự kiện doanh nghiệp" />

        {/* 8 */}
        <article className="bg-white ">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Quy Trình Đặt Quà Tặng Doanh Nghiệp Tại Univi
          </h2>
          <p className="text-base mb-3">
            Quy trình dưới đây là khung triển khai cần xác nhận lại theo cấu hình quà và nguồn hàng thực tế. Với hạng mục đồng phục, khách hàng có thể đối chiếu thêm tại <Link href="/huong-dan-dat-hang" className="font-semibold text-[#105d97]">hướng dẫn đặt hàng</Link>.
          </p>
          <NumberedList items={quyTrinhSteps} />
          <p className="text-base mt-3">
            Các yêu cầu về thời gian sản xuất, số lượng tối thiểu, giao hàng và mẫu vật phẩm ngoài đồng phục chưa được xác thực sẵn; cần xác nhận riêng ở báo giá. Không nên đặt &quot;gấp&quot; mà chưa chốt mẫu, logo và danh sách size - đây là ba nguyên nhân thường làm kéo dài tiến độ.
          </p>
        </article>

        {/* 9 */}
        <article className="bg-white mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">9.</span>
            Kinh Nghiệm Lựa Chọn Quà Tặng Doanh Nghiệp
          </h2>
          <p className="text-base mb-3">
            Một checklist thực tế giúp hạn chế mua theo cảm tính và giảm rủi ro khi triển khai số lượng lớn:
          </p>
          <NumberedList items={checklistItems} />
          <p className="text-base mt-3">
            Với quà có yếu tố trang phục, kiểm tra thêm size, form, điều kiện sử dụng và mục đích vận động. Chất liệu không thể được mô tả chung chung là &quot;tốt&quot;: cần làm rõ cảm giác mặc, độ thoáng, quản lý ẩm, độ co giãn và bối cảnh sử dụng. Ví dụ, khi chọn áo cho sự kiện vận động, có thể tham khảo <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97]">công nghệ UNI DRY</Link> để đánh giá yếu tố thoát ẩm theo nhu cầu thực tế.
          </p>
        </article>

        {/* FAQ */}
        <article className="bg-white mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">10.</span>
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-2 mt-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-lg bg-gradient-to-r from-blue-50 to-slate-50 p-3">
                <summary className="cursor-pointer font-bold text-base text-gray-900">
                  {question}
                </summary>
                <p className="text-base mt-2">{answer}</p>
              </details>
            ))}
          </div>
        </article>

        {/* Kết luận */}
        <article className="bg-white mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">Kết Luận</h2>
          <p className="text-base">
            Quà tặng doanh nghiệp tạo giá trị khi được xem là một phần của trải nghiệm thương hiệu: đúng người nhận, đúng mục tiêu, có công năng và triển khai đồng bộ. Với chương trình có yếu tố đội nhóm, sự kiện hoặc vận động, doanh nghiệp có thể kết nối quà với đồng phục để tạo một hệ nhận diện nhất quán. Tại Univi, lợi thế xác thực nằm ở giải pháp đồng phục B2B, cá nhân hóa trên sản phẩm phù hợp và năng lực triển khai theo quy trình; các hạng mục quà ngoài danh mục cần được minh bạch kiểm tra trước khi chốt.
          </p>
        </article>

        {/* Đối tác Doanh nghiệp */}
        <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 mb-3 mt-4">
          <h2 className="text-xl md:text-xl font-bold mb-2 text-center text-gray-900">
            Đối Tác Doanh Nghiệp Đồng Hành Cùng Univi
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center mb-4">
            Các tập đoàn, doanh nghiệp và đối tác đã tin tưởng sản xuất quà tặng & phụ kiện tại Univi
          </p>
          <PartnersSection category="doanh-nghiep" />
        </section>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Nhận Tư Vấn Quà Tặng Doanh Nghiệp Ngay Hôm Nay!
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Gửi brief về đối tượng nhận, số lượng, ngân sách, thời điểm và yêu cầu nhận diện để <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> tư vấn cấu hình phù hợp. Khi chương trình cần đồng phục, áo gió hoặc phụ kiện đồng bộ, hãy liên hệ để xác nhận phạm vi triển khai trước khi báo giá.
              </p>
              <p className="text-sm text-white mb-4">
                Liên hệ ngay với Univi để được tư vấn miễn phí, nhận thiết kế độc quyền và báo giá ưu đãi nhất:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-yellow-300 mb-1">Hotline</div>
                <div className="text-white">083 420 4999</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-yellow-300 mb-1">Email</div>
                <div className="text-white">dongphucunivi@gmail.com</div>
              </div>

              <div className="bg-white/10 rounded-lg p-4">
                <div className="font-semibold text-yellow-300 mb-1">Địa chỉ</div>
                <div className="text-white">Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</div>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsQuoteFormOpen(true)}
                className="inline-block bg-white text-[#105d97] px-5 py-2 rounded-lg font-bold text-sm"
              >
                Liên hệ Univi để trao đổi nhu cầu
              </button>
              <p className="text-white mt-3 font-medium">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </p>
            </div>
          </div>
        </div>

        <ContactForm
          source="Quà tặng doanh nghiệp - Nhận tư vấn"
          isModal
          isOpen={isQuoteFormOpen}
          onClose={() => setIsQuoteFormOpen(false)}
        />
      </div>
    </div>
  );
}
