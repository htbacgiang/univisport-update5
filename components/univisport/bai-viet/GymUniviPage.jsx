import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import ContactForm from '../../header/ContactForm';
import FabricCardComponent from '../FabricCardComponent';
import UniformStylesComponent from '../UniformStylesComponent';
import ProcessSteps from '../ProcessSteps';

const heroStats = [
  'Xưởng 2.000m2 tại phường Chương Mỹ, Hà Nội',
  'Công suất 100.000 sản phẩm/tháng',
  'Công nghệ UNI DRY',
  'Phòng R&D riêng',
  'Thiết kế miễn phí',
  'Giao hàng toàn quốc',
];

const trustBadges = [
  ['Xưởng sản xuất 2.000m2 tại phường Chương Mỹ, Hà Nội', 'Chủ động sản xuất, kiểm soát chất lượng và tiến độ cho phòng Gym, PT Studio và chuỗi Fitness Center.'],
  ['Công suất 100.000 sản phẩm/tháng', 'Phù hợp đơn B2B, chuỗi phòng tập, sự kiện hội viên và nhu cầu đặt bổ sung theo từng cơ sở.'],
  ['Công nghệ UNI DRY', 'Hỗ trợ thoát ẩm một chiều, giảm cảm giác bí bách ở vùng lưng, vai, nách và cổ áo.'],
  ['Phòng R&D riêng', 'Nghiên cứu chất liệu, form dáng, trải nghiệm vận động và khả năng tái sản xuất đồng bộ.'],
  ['Thiết kế miễn phí', 'Lên concept theo màu thương hiệu, logo, vai trò nhân sự, Staff Uniform và Member Uniform.'],
  ['Đặt từ 10 áo ở dòng phù hợp', 'Phòng tập mới có thể bắt đầu gọn với đồng phục PT, lễ tân hoặc áo member.'],
];

const reasons = [
  ['Tạo ấn tượng đầu tiên', 'Đồng phục chỉn chu giúp khách mới thấy phòng tập có hệ thống vận hành rõ ràng ngay tại quầy lễ tân và sàn tập.'],
  ['Xây dựng thương hiệu', 'Đội ngũ trở thành bộ nhận diện di động trong ảnh lớp nhóm, video tư vấn, livestream và nội dung social.'],
  ['Phân vai đội ngũ', 'Hội viên dễ nhận ra ai là PT, HLV sàn, lễ tân, sale consultant, quản lý ca hoặc nhân sự vận hành.'],
  ['Gia tăng trải nghiệm hội viên', 'Hội viên mới dễ tìm đúng người hỗ trợ, còn hội viên lâu năm có thêm cảm giác cộng đồng qua áo member, challenge hoặc workshop.'],
  ['Hỗ trợ bán hàng và marketing', 'Hình ảnh đội ngũ ổn định giúp phòng tập sản xuất nội dung, chạy quảng cáo và truyền thông sự kiện tốt hơn.'],
];

const materialRows = [
  ['UNI DRY', 'Công nghệ xử lý thoát ẩm', 'Hỗ trợ đưa hơi ẩm từ da ra lớp ngoài vải để giảm bết lưng, bí nách và ẩm cổ áo.', 'HLV, PT, Functional Training, cardio, ca làm việc dài'],
  ['UNI QUICK DRY', 'Polyester cao cấp nhanh khô', 'Nhẹ, khô nhanh, dễ bảo quản, phù hợp số lượng lớn và tần suất giặt cao.', 'Áo member, áo challenge, T-shirt Gym, áo sự kiện'],
  ['UNI SUPER COOL', 'Polyamide mềm mịn', 'Mềm, mượt, mát, mịn, co giãn tốt và giảm ma sát khi tiếp xúc da.', 'PT cao cấp, boutique gym, GroupX, Yoga trong Fitness Center'],
  ['UNI BLENDED', 'Nhóm vải pha cân bằng', 'Đứng form hơn, dễ mặc hằng ngày, cân bằng hiệu năng vận động và hình ảnh dịch vụ.', 'Lễ tân, sale, quản lý, Polo thể thao'],
  ['UNI POWERZIP', 'Polo thể thao khóa kéo', 'Gọn, hiện đại, cao cấp hơn T-shirt nhưng vẫn giữ tính vận động.', 'PT senior, quản lý sàn, HLV lớp premium, đội sự kiện'],
];

const painPoints = [
  ['Chọn vải quá dày', 'Dày không đồng nghĩa với bền. Nếu thoát ẩm kém, áo sẽ nặng, nóng bí và nhanh bị đội ngũ bỏ qua.'],
  ['Mockup đẹp nhưng mặc không tốt', 'Logo lớn ở vùng kéo căng, phối màu rườm rà ở vai, form quá bó hoặc cổ áo cứng đều có thể cản trở vận động.'],
  ['Không phân vai màu sắc', 'HLV, PT, sale, lễ tân và hội viên dùng chung một mẫu khiến khách khó nhận diện người hỗ trợ trong giờ cao điểm.'],
  ['Không lưu file thiết kế', 'Đợt đặt sau dễ lệch màu, lệch logo hoặc lệch form nếu không lưu mã vải, file thiết kế, size chart và kỹ thuật hoàn thiện.'],
  ['Không tính mở rộng hệ thống', 'Chuỗi phòng tập cần xác định từ đầu mẫu cho nhân sự, hội viên, sự kiện và sản phẩm có thể tái sản xuất khi mở cơ sở mới.'],
];

const designPrinciples = [
  ['Athletic Fit', 'Phù hợp HLV và PT vì tạo hình ảnh gọn, khỏe và thể thao. Form cần ôm vừa, không siết nách hoặc kéo vai khi thị phạm.'],
  ['Raglan tăng biên độ vai', 'Đường ráp chéo từ cổ xuống nách giúp vai linh hoạt hơn khi nâng tay, kéo xô, plank, stretching hoặc demo động tác.'],
  ['Đường may giảm ma sát', 'Nên kiểm tra vùng vai, nách, cổ áo và sườn áo vì đây là các điểm dễ ma sát khi tập lặp lại.'],
  ['Logo không cản chuyển động', 'Logo ngực trái, sau lưng hoặc tay áo nên có thứ bậc rõ; tránh đặt logo quá lớn ở vùng thường xuyên kéo căng.'],
  ['Hỗ trợ cường độ cao', 'Với HIIT, cardio, bootcamp hoặc functional training, áo cần nhẹ, thoát ẩm, co giãn và không gây vướng.'],
];

const modelSolutions = [
  ['Gym Private', 'Ưu tiên đồng phục PT và HLV trước: Polo hoặc T-shirt Athletic Fit, màu tiết chế, logo gọn và chất liệu SUPER COOL hoặc BLENDED theo định vị.'],
  ['Boutique Fitness Studio', 'Cần nhận diện rõ trong ảnh, video và social. HLV lớp nhóm có thể dùng T-shirt, tanktop hoặc áo phối màu theo bộ nhận diện.'],
  ['Fitness Center', 'Có nhiều điểm chạm: lễ tân, sale, PT, HLV sàn, quản lý, hội viên, lớp nhóm và sự kiện. Nên triển khai theo hệ thống thay vì từng mẫu rời.'],
  ['Chuỗi phòng tập', 'Cần chuẩn hóa form, màu, chất liệu, vị trí logo và file thiết kế để mỗi cơ sở mới không lệch hình ảnh.'],
  ['Cross Training Studio', 'Ưu tiên chất liệu thoát ẩm, nhanh khô, co giãn và form không cản vai lưng cho HIIT, bootcamp hoặc lớp cường độ cao.'],
  ['Functional Training Studio', 'Cần kiểm tra kỹ vùng vai, nách, lưng trên và gấu áo. Nếu có sự kiện ngoài trời, nên có thêm áo member nhanh khô.'],
  ['Hybrid Training và Strength & Conditioning', 'Cần form Athletic Fit, biên độ vai rộng và chất liệu chịu được cả bài sức mạnh, conditioning lẫn các buổi tập hỗn hợp cường độ cao.'],
  ['Recovery Zone', 'Nhân sự hỗ trợ phục hồi cần trang phục mềm, gọn, đứng form vừa đủ và khác màu đội HLV để hội viên nhận diện đúng khu vực dịch vụ.'],
];

const productGroups = [
  ['Polo PT', 'PT senior, Head Coach, quản lý sàn hoặc phòng tập cần hình ảnh tư vấn cao hơn.', 'SUPER COOL, BLENDED hoặc cấu hình Polo thể thao', 'https://live.staticflickr.com/65535/55265084647_9069991283_b.jpg'],
  ['T-shirt PT', 'HLV lớp nhóm, functional training, HIIT hoặc đội ngũ thường xuyên thị phạm.', 'UNI DRY, UNI QUICK DRY, vải co giãn thoát ẩm', 'https://live.staticflickr.com/65535/55266185304_dc8d39cfde_b.jpg'],
  ['Áo dài tay raglan', 'Phòng máy lạnh, mùa lạnh, lớp ngoài trời, PT Studio hoặc đội nhóm cần hình ảnh gọn hơn.', 'QUICK DRY, UNI DRY', 'https://live.staticflickr.com/65535/55344727492_5af4cfe3e6_b.jpg'],
  ['Đồng phục lễ tân, sale, quản lý', 'Nhóm cần hình ảnh dịch vụ, đứng form và khác biệt vừa đủ với HLV.', 'UNI BLENDED, Polo thể thao', 'https://live.staticflickr.com/65535/55358736832_0baa501a38_b.jpg'],
  ['Áo member, VIP, challenge', 'Hội viên, cộng đồng lớp nhóm, workshop, sự kiện hoặc merchandise.', 'QUICK DRY, UNI DRY, cấu hình dễ mặc', 'https://live.staticflickr.com/65535/55342902322_3613b86d05_b.jpg'],
];


const rolloutScenarios = [
  ['Gym Private', 'Bắt đầu từ đồng phục PT và HLV, sau đó mở rộng sang áo member hoặc VIP.'],
  ['Fitness Center', 'Triển khai theo vai trò: lễ tân, sale, PT, HLV, quản lý và hội viên để vận hành rõ ràng hơn.'],
  ['Chuỗi phòng tập', 'Ưu tiên bộ quy chuẩn tái sản xuất để các cơ sở không lệch màu, lệch form hoặc lệch nhận diện theo thời gian.'],
  ['Franchise', 'Đưa đồng phục vào brand manual: màu, logo, chất liệu, size, vị trí in và quy trình đặt bổ sung.'],
];

const relatedLinks = [
  ['Giải pháp 2S Uniform', '/giai-phap-2s'],
  ['Công nghệ UNI DRY', '/cong-nghe-uni-dry'],
  ['Vải Super Cool là gì', '/vai-super-cool-la-gi'],
  ['Đồng phục Fitness Center', '/dong-phuc-fitness-center'],
  ['Đồng phục PT Gym', '/dong-phuc-pt'],
  ['Đồng phục lễ tân phòng Gym', '/bai-viet/dong-phuc-le-tan-phong-gym'],
  ['Đồng phục phòng tập theo yêu cầu', '/bai-viet/dong-phuc-phong-tap-theo-yeu-cau'],
  ['Xưởng may đồng phục thể thao UNIVI', '/xuong-may-dong-phuc-univi'],
];

export const gymFaqs = [
  ['Đồng phục Gym nên dùng chất liệu gì?', 'Đồng phục Gym nên chọn chất liệu theo vai trò. HLV và PT nên ưu tiên UNI SUPER COOL hoặc cấu hình vải co giãn, thoát ẩm tốt. Hội viên, áo sự kiện và áo member có thể dùng UNI QUICK DRY vì nhẹ, nhanh khô và dễ bảo quản. Lễ tân, sale và quản lý phù hợp với UNI BLENDED hoặc Polo thể thao đứng form.'],
  ['Đồng phục Gym có cần co giãn 4 chiều không?', 'Có, đặc biệt với HLV, PT và Fitness Instructor. Co giãn 4 chiều giúp người mặc nâng tay, xoay vai, cúi người, plank, squat và thị phạm động tác linh hoạt hơn, từ đó giảm cảm giác bị kéo căng ở vai, lưng và nách.'],
  ['Phòng Gym nên chọn Polo hay T-shirt cho HLV?', 'Polo phù hợp với PT senior, Head Coach, quản lý sàn hoặc mô hình cần hình ảnh dịch vụ cao hơn. T-shirt thể thao phù hợp với HLV lớp nhóm, functional training, cardio và môi trường phòng Gym năng động. Nhiều phòng tập nên kết hợp cả hai theo vai trò.'],
  ['Đồng phục PT khác gì đồng phục hội viên?', 'Đồng phục PT ưu tiên nhận diện rõ, form gọn, hình ảnh chuyên nghiệp và khả năng hỗ trợ vận động khi huấn luyện trực tiếp. Đồng phục hội viên ưu tiên sự thoải mái, dễ mặc, nhanh khô và phù hợp nhiều vóc dáng.'],
  ['Phòng tập có nên bán đồng phục cho hội viên không?', 'Có. Áo hội viên, áo challenge, áo workshop hoặc áo VIP giúp tăng nhận diện thương hiệu, tạo cảm giác cộng đồng và mở thêm giá trị merchandise cho phòng tập. Đây là một phần quan trọng của Member Uniform trong hệ 2S Uniform.'],
  ['UNIVI có hỗ trợ thiết kế theo màu thương hiệu không?', 'Có. UNIVI hỗ trợ tư vấn phối màu, vị trí logo, form dáng, chất liệu và mockup theo bộ nhận diện thương hiệu của từng phòng Gym, PT Studio hoặc Fitness Center.'],
  ['Có lên mockup trước khi sản xuất không?', 'Có. Mockup giúp phòng tập hình dung phối màu, logo, vị trí in, vai trò nhân sự và tổng thể hệ đồng phục trước khi chuyển sang sản xuất.'],
  ['Số lượng đặt tối thiểu là bao nhiêu?', 'Theo chính sách đối tác trong dữ liệu sản phẩm, một số dòng phù hợp có thể bắt đầu từ 10 áo. Với mẫu riêng hoàn toàn theo yêu cầu, số lượng tối thiểu có thể thay đổi theo cấu hình sản phẩm, chất liệu và mức độ tùy chỉnh.'],
  ['Có đặt bổ sung sau khi tuyển thêm nhân sự không?', 'Có. Để đặt bổ sung không lệch màu hoặc lệch logo, phòng tập nên lưu lại file thiết kế, mã màu, chất liệu, form, bảng size và kỹ thuật hoàn thiện ngay từ đơn đầu tiên.'],
  ['UNIVI có hỗ trợ chuỗi phòng tập nhiều cơ sở không?', 'Có. Với chuỗi phòng tập, UNIVI có thể tư vấn hệ đồng phục theo 2S Uniform, gồm Staff Uniform cho nhân sự và Member Uniform cho hội viên, đồng thời lưu chuẩn tái sản xuất để triển khai đồng bộ cho nhiều cơ sở.'],
];

function Section({ id, title, children, className = '' }) {
  return (
    <article id={id} className={`scroll-mt-24 bg-white py-4 ${className}`}>
      <h2 className="mb-3 text-xl md:text-2xl font-medium tracking-tight leading-6 text-gray-900">
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

function ImageBlock({ src, alt, caption, priority = false }) {
  return (
    <figure className="overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 900px"
        priority={priority}
      />
      <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function GymUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="text-gray-700">
      <section className="bg-white pb-8">
        <p className="mb-2 text-xs font-medium text-[#105d97] uppercase tracking-[0.15em]">Smart Sport Uniform by UNIVI</p>
        <p className="text-2xl md:text-3xl font-medium tracking-tight leading-6 text-gray-900">
          May Đồng Phục Gym Theo Yêu Cầu Cho Phòng Tập, PT Studio Và Fitness Center        </p>
        <div className="mt-4 space-y-3 text-base leading-6 text-gray-700">
          <p>
            Đồng Phục Univi tiên phong cung cấp giải pháp đồng phục thể thao
            chuyên nghiệp cho phòng Gym, Fitness Center và PT Studio tại Việt Nam.
          </p>
          <p>
            Đồng phục Gym không chỉ là áo để nhân sự mặc trong ca làm việc. Với{' '}
            <Link href="/gioi-thieu" className="font-semibold text-[#105d97] hover:underline">
              Đồng Phục Univi
            </Link>
            , đây là hệ thống nhận diện giúp phân vai đội ngũ, hỗ trợ vận hành, tăng sự chuyên nghiệp
            và tạo cảm giác tin cậy cho hội viên.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setIsQuoteFormOpen(true)}
            className="rounded border border-[#105d97] bg-[#105d97] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0e4f82]"
          >
            Nhận thiết kế miễn phí
          </button>
          <Link
            href="#bo-suu-tap-gym"
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#105d97] hover:text-[#105d97]"
          >
            Xem bộ sưu tập
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

      <Section id="dong-phuc-gym-la-gi" title="1. Đồng Phục Gym Là Gì?" className="border-t border-gray-100">
        <div className="space-y-2 leading-6">
          <p>
            Đồng phục Gym là hệ trang phục thể thao được thiết kế cho môi trường phòng Gym, Fitness Center, PT Studio, lớp Group X và các mô hình huấn luyện vận động. Người mặc có thể là HLV, PT, lễ tân, quản lý, nhân viên tư vấn hoặc hội viên. Vì nhiệm vụ của từng nhóm khác nhau, đồng phục Gym không nên được hiểu là một mẫu áo thun in logo dùng chung cho toàn bộ hệ thống.
          </p>
          <p>
            Điểm khác biệt nằm ở mục đích sử dụng. HLV và PT phải nâng tay, xoay vai, squat, plank và thị phạm liên tục. Lễ tân cần vẻ chỉn chu nhưng vẫn di chuyển nhiều trong ca làm. Hội viên cần áo dễ mặc, khô nhanh và phù hợp nhiều vóc dáng. Một cấu hình đúng phải nối được ba yếu tố: trải nghiệm vận động, nhận diện thương hiệu và hiệu quả vận hành.
          </p>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
                1.1 Feature: Cấu Trúc Được Phát Triển Cho Vận Động
              </h3>
              <p className="mb-3">
                Áo Gym chuyên dụng ưu tiên độ co giãn, khả năng thoát ẩm, form phù hợp chuyển động và kỹ thuật hoàn thiện tương ứng với tần suất sử dụng. Đây là phần “gốc” quyết định người mặc có muốn dùng áo mỗi ngày hay không.
              </p>
              <p>
                Khi duyệt mẫu, đừng chỉ nhìn người mẫu đứng thẳng. Hãy yêu cầu người mặc nâng tay qua đầu, xoay thân, gập người, chống đẩy và chạy nhẹ. Áo phù hợp không kéo căng vùng nách, không cuộn gấu quá mức và không làm logo biến dạng khi cơ thể chuyển động.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
                1.2 Advantage: Đồng Bộ Nhưng Không Đồng Nhất Máy Móc
              </h3>
              <p>
                Một hệ đồng phục Gym có thể dùng chung màu chủ đạo, ngôn ngữ phối màu và vị trí logo nhưng thay đổi form hoặc chi tiết theo vai trò. PT có thể mặc Athletic Fit; lễ tân dùng polo đứng form; hội viên dùng T-shirt Regular Fit. Nhờ vậy, phòng tập giữ được nhận diện chung mà mỗi nhóm vẫn có trang phục phù hợp với công việc.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
                1.3 Benefit: Một Khoản Đầu Tư Cho Trải Nghiệm Dịch Vụ
              </h3>
              <p>
                Khi hội viên dễ nhận ra người hỗ trợ, đội ngũ thoải mái khi làm việc và hình ảnh trong ảnh/video được nhất quán, đồng phục Gym tạo giá trị vượt ra ngoài chiếc áo. Nó trở thành một phần của quy trình dịch vụ, nội dung marketing và văn hóa đội nhóm. Với mô hình đa dịch vụ, bạn có thể tham khảo thêm cách tổ chức{' '}
                <Link href="/dong-phuc-fitness-center" className="font-semibold text-[#105d97] hover:underline">
                  đồng phục Fitness Center
                </Link>{' '}
                cho toàn hệ thống.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55231241008_13de6ef716_b.jpg"
            alt="Đồng phục Gym thiết kế theo yêu cầu cho phòng tập và Fitness Center"
            caption="Hệ đồng phục Gym giúp phòng tập tạo nhận diện ngay từ điểm chạm đầu tiên."
            priority
          />
        </div>
      </Section>

      <Section id="nang-luc-univi" title="2. Năng Lực Sản Xuất Và Proof Point">
        <p className="mb-3 leading-6">
          Với UNIVI, đồng phục không bắt đầu từ câu hỏi mẫu nào đẹp. Câu hỏi đúng hơn là: ai mặc,
          mặc trong bối cảnh nào, vận động ra sao, cần hình ảnh thương hiệu thế nào và phòng tập có
          cần đặt bổ sung cho giai đoạn sau không. Chủ đầu tư có thể đối chiếu{' '}
          <Link href="/ho-so-nang-luc" className="font-semibold text-[#105d97] hover:underline">
            hồ sơ năng lực
          </Link>{' '}
          và khả năng vận hành của{' '}
          <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97] hover:underline">
            xưởng may đồng phục thể thao
          </Link>{' '}
          trước khi triển khai cho toàn hệ thống.
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

      <Section id="vi-sao-phong-gym-can-dong-phuc" title="3. Vì Sao Phòng Gym Cần Đồng Phục Chuyên Nghiệp?">
        <p className="mb-4 leading-6">
          “Điều đầu tiên hội viên nhìn thấy không phải thiết bị tập.” Trước khi đánh giá máy móc hay giáo án, khách thường gặp lễ tân, nhân viên tư vấn và đội ngũ HLV. Trang phục của những người này góp phần hình thành ấn tượng ban đầu về mức độ tổ chức của phòng tập.

        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {reasons.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="giai-phap-theo-vai-tro" title="4. Giải Pháp Đồng Phục Theo Từng Vai Trò Trong Phòng Tập">
        <p className="mb-6 leading-6 text-gray-700">
          Sai lầm phổ biến khi đặt đồng phục Gym là dùng một loại vải và một form cho mọi vị trí. Cách làm tiết kiệm thời gian ở bước đầu nhưng thường không phù hợp khi vận hành. Bản đồ vai trò dưới đây giúp phòng tập xác định đúng nhu cầu trước khi chọn mẫu.
        </p>

        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-gray-900">4.1 Đồng Phục Huấn Luyện Viên Gym</h3>
            <div className="space-y-2 text-gray-700 leading-6">
              <p>
                HLV sàn và HLV lớp nhóm cần áo co giãn, nhẹ, quản lý ẩm tốt và dễ nhận diện từ xa. T-shirt phù hợp môi trường năng động hoặc lớp cường độ cao. Polo thể thao phù hợp với phòng tập muốn hình ảnh dịch vụ chỉn chu hơn, nhưng phải dùng chất liệu dành cho vận động thay vì polo văn phòng dày và giữ ẩm.
              </p>
              <p>
                Form Athletic Fit thường ôm vừa phần vai, ngực và thân áo. Mục tiêu là tạo hình ảnh gọn gàng mà không cản trở động tác. Với lớp Group X, vùng vai và nách cần được kiểm tra kỹ vì HLV liên tục nâng tay, xoay người và thị phạm theo nhạc.
              </p>
            </div>
            <div className="mt-3">
              <ImageBlock
                src="/images/gym/dong-phuc-hlv.jpg"
                alt="Đồng phục Huấn Luyện Viên Gym"
                caption="Áo thun thể thao năng động co giãn 4 chiều cho huấn luyện viên Gym."
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-gray-900">4.2 Đồng Phục PT Gym</h3>
            <div className="space-y-2 text-gray-700 leading-6">
              <p>
                PT tiếp xúc trực tiếp với hội viên trong buổi đánh giá thể trạng, hướng dẫn kỹ thuật và tư vấn gói tập. Áo PT vì vậy vừa phải hỗ trợ vận động, vừa phải truyền tải hình ảnh chuyên môn. Form quá rộng làm dáng thiếu gọn; form quá bó có thể kéo căng vai và làm logo biến dạng.
              </p>
              <p>
                Một cấu hình thực tế là polo khóa kéo hoặc T-shirt Athletic Fit, dùng UNI SUPER COOL hoặc UNI BLENDED tùy cường độ và định vị dịch vụ. Phòng tập có thể xem sâu hơn về cách chọn đồng phục PT theo vai trò và hình ảnh thương hiệu.
              </p>
            </div>
            <div className="mt-3">
              <ImageBlock
                src="/images/gym/dong-phuc-pt-ao-polo.jpg"
                alt="Đồng phục PT Gym"
                caption="Áo Polo PT chuyên nghiệp tôn dáng và co giãn thoải mái khi hướng dẫn."
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-gray-900">4.3 Đồng Phục Lễ Tân Và Tư Vấn Viên</h3>
            <div className="space-y-2 text-gray-700 leading-6">
              <p>
                Lễ tân là điểm chạm đầu tiên nhưng không vận động giống HLV. Nhóm này cần bề mặt vải dễ chịu, form đứng, ít nhăn và màu ổn định trong ca làm. UNI BLENDED là lựa chọn cân bằng cho polo hoặc áo phối nhận diện vì chú trọng độ bền, tính ứng dụng và vẻ chỉn chu.
              </p>
              <p>
                Thiết kế nên liên quan rõ tới hệ đồng phục HLV qua màu chủ đạo hoặc chi tiết bo cổ, nhưng không cần ôm sát. Bảng tên, logo ngực và màu vai trò có thể giúp hội viên nhận biết nhanh tại quầy check-in.
              </p>
            </div>
            <div className="mt-3">
              <ImageBlock
                src="/images/gym/dong-phuc-le-tan.jpg"
                alt="Đồng phục Lễ Tân và Tư Vấn Viên"
                caption="Áo thun polo đứng form lịch sự cho nhân sự quầy lễ tân và tư vấn phòng tập."
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-gray-900">4.4 Đồng Phục Quản Lý Và Vận Hành</h3>
            <div className="space-y-2 text-gray-700 leading-6">
              <p>
                Quản lý cần hòa vào hệ nhận diện chung nhưng có dấu hiệu phân cấp vừa đủ. Polo thể thao màu trung tính, viền màu thương hiệu hoặc tag vai trò là phương án dễ triển khai. Nhân sự kỹ thuật và vận hành cần áo bền, ít nhăn, dễ giặt và không cản trở thao tác.
              </p>
              <p>
                Không nên tạo quá nhiều mẫu nếu quy mô đội ngũ nhỏ. Một ngôn ngữ thiết kế chung với 2–3 biến thể vai trò thường dễ quản lý size, tồn kho và đơn bổ sung hơn.
              </p>
            </div>
            <div className="mt-3">
              <ImageBlock
                src="/images/gym/dong-phuc-quan-ly.jpg"
                alt="Đồng phục Quản Lý và Vận Hành"
                caption="Áo khoác gió thể thao cao cấp hoặc áo polo dài tay phù hợp cho quản lý, vận hành."
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg md:text-xl font-medium text-gray-900">4.5 Đồng Phục Hội Viên, VIP Và Sự Kiện</h3>
            <div className="space-y-2 text-gray-700 leading-6">
              <p>
                Hội viên ưu tiên cảm giác dễ mặc, nhanh khô, bảng size rộng và chi phí phù hợp để triển khai số lượng lớn. UNI QUICK DRY thường phù hợp với áo member, giải đấu nội bộ, workshop hoặc challenge. Nếu chương trình có hoạt động ngoài trời, cần xác nhận thêm tính năng chống nắng của đúng mã vải; không nên mặc định mọi loại Polyester đều có cùng chỉ số bảo vệ UV.
              </p>
              <p>
                Phiên bản hội viên nên giữ màu thương hiệu nhưng khác Staff Uniform ở phối màu, nhãn vai trò hoặc vị trí logo. Điều này vừa tăng cảm giác cộng đồng, vừa giữ khả năng nhận diện nhân sự trên sàn tập.
              </p>
            </div>
            <div className="mt-3">
              <ImageBlock
                src="/images/gym/dong-phuc-member.webp"
                alt="Đồng phục Hội Viên, VIP và Sự Kiện"
                caption="Áo thun thể thao cổ tròn năng động phục vụ giải chạy, sự kiện, thử thách hội viên."
              />
            </div>
          </div>
        </div>
      </Section>

      <Section id="chat-lieu" title="5. Chọn Chất Liệu Quyết Định Trải Nghiệm Tập Luyện">
        <div className="space-y-3 leading-6">
          <p>
            Chất liệu là phần quyết định đồng phục có được đội ngũ sử dụng lâu dài hay không. Một
            mẫu áo nhìn đẹp trên mockup nhưng nóng, giữ mồ hôi hoặc thiếu co giãn sẽ nhanh chóng bị
            bỏ qua trong vận hành thật.
          </p>
          <p>
            <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97] hover:underline">
              Công nghệ UNI DRY
            </Link>{' '}
            hỗ trợ đưa hơi ẩm từ bề mặt da ra lớp ngoài vải, giúp giảm cảm giác bí bách khi HLV và
            PT vận động trong ca dài.
          </p>
        </div>
        <div className="mt-6">
          <FabricCardComponent />
        </div>
        <div className="mt-8">
          <UniformStylesComponent />
        </div>
        <div className="mt-6">
          <SimpleTable
            headers={['Chất liệu', 'Cấu tạo / định vị', 'Ưu điểm', 'Phù hợp']}
            rows={materialRows}
          />
        </div>
      </Section>

      <Section id="sai-lam" title="6. Những Sai Lầm Khi Đặt Đồng Phục Gym">
        <p className="mb-4 leading-6">
          Phần lớn lỗi đồng phục Gym không xuất hiện ở bản thiết kế. Chúng xuất hiện sau khi đội ngũ
          mặc thật: áo nóng, nhanh bết, logo lệch, form không hợp vai trò, hoặc các đợt đặt sau
          không giống đợt đầu.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {painPoints.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <figure className="mt-6 overflow-hidden">
          <Image
            src="/images/gym/thiet-ke-dong-phuc-gym-dep.jpg"
            alt="Nhóm huấn luyện viên trong hệ đồng phục cho các mô hình phòng Gym"
            width={1200}
            height={1200}
            quality={90}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
            Mỗi mô hình phòng tập cần cấu hình riêng, nhưng toàn đội ngũ vẫn nên giữ chung màu sắc, form dáng và hệ nhận diện.
          </figcaption>
        </figure>
      </Section>

      <Section id="cong-nghe-vai" title="7. Công Nghệ Vải Chuyên Dụng Của UNIVI">
        <div className="space-y-3 leading-6">
          <p>
            UNIVI phát triển chất liệu theo triết lý đúng bộ môn, đúng chất liệu, đúng trải nghiệm.
            Gym khác{' '}
            <Link href="/dong-phuc-yoga-pilates" className="font-semibold text-[#105d97] hover:underline">
              Yoga Pilates
            </Link>
            , Running khác{' '}
            <Link href="/dong-phuc-pickleball" className="font-semibold text-[#105d97] hover:underline">
              Pickleball
            </Link>
            , vì vậy không nên dùng một loại vải cho mọi vai trò.
          </p>
          <p>
            <Link href="/vai-super-cool-la-gi" className="font-semibold text-[#105d97] hover:underline">
              UNI SUPER COOL
            </Link>{' '}
            phù hợp với PT cao cấp, boutique gym hoặc phòng tập định vị dịch vụ cao. UNI QUICK DRY
            phù hợp áo member và sự kiện; UNI BLENDED phù hợp lễ tân, sale, quản lý hoặc Polo đứng
            form.
          </p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <TextCard title="UNI DRY">
            <p>Hỗ trợ thoát ẩm ở vùng lưng, vai, nách và cổ áo, nơi dễ bết khi HLV vận động liên tục.</p>
          </TextCard>
          <TextCard title="UNI QUICK DRY">
            <p>Nhẹ, nhanh khô, thực dụng cho áo T-shirt Gym, áo dài tay vận động, áo challenge và áo cộng đồng.</p>
          </TextCard>
          <TextCard title="UNI SUPER COOL">
            <p>Mềm, mượt, mát, mịn, giảm ma sát và phù hợp môi trường PT cao cấp hoặc lớp GroupX cần cảm giác da tốt hơn.</p>
          </TextCard>
          <TextCard title="UNI POWERZIP">
            <p>Polo khóa kéo cân bằng giữa hình ảnh dịch vụ, sự gọn gàng và hiệu suất vận động.</p>
          </TextCard>
        </div>
        <figure className="mt-6 overflow-hidden">
          <Image
            src="/images/gym/uni-super-col.webp"
            alt="Cận cảnh vải UNI SUPER COOL chuyên dụng cho đồng phục Gym"
            width={1200}
            height={1200}
            quality={90}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
            Bề mặt vải UNI SUPER COOL mềm mịn, co giãn và phù hợp với đồng phục PT, HLV và Boutique Fitness.
          </figcaption>
        </figure>
      </Section>

      <Section id="thiet-ke" title="8. Thiết Kế Tối Ưu Hiệu Suất Vận Động">
        <p className="mb-4 leading-6">
          Thiết kế đồng phục Gym không nên chỉ xử lý màu sắc và logo. Một mẫu áo tốt cần hỗ trợ
          chuyển động thật: nâng tay, xoay vai, cúi người, chống đẩy, kéo giãn, chạy ngắn, hướng dẫn
          máy và giao tiếp với hội viên trong nhiều giờ.
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {designPrinciples.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
      </Section>

      <Section id="mo-hinh-phong-tap" title="9. Giải Pháp Theo Từng Mô Hình Phòng Tập">
        <p className="mb-4 leading-6">
          Không phải mọi phòng Gym đều cần cùng một cấu hình đồng phục. Boutique Fitness, Hybrid
          Training, Strength & Conditioning, Cross Training và Recovery Zone có bản đồ vai trò
          khác nhau; mô hình vận hành sẽ quyết định số nhóm người mặc, mức độ phân vai, chất liệu và
          ngân sách.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {modelSolutions.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <figure className="mt-6 overflow-hidden">
          <Image
            src="https://live.staticflickr.com/65535/55348303761_ed7662817d_b.jpg"
            alt="Đồng phục PT, HLV tại phòng tập"
            width={1200}
            height={1200}
            quality={90}
            className="h-auto w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
          <figcaption className="px-4 py-3 text-center text-sm italic text-gray-500">
            Mỗi mô hình phòng tập cần cấu hình riêng, nhưng toàn đội ngũ vẫn nên giữ chung màu sắc, form dáng và hệ nhận diện.
          </figcaption>
        </figure>
      </Section>

      <Section id="phong-rd-feedback" title="10. Phòng R&D Và Feedback Chất Lượng">
        <div className="space-y-4 leading-6 text-gray-700">
          <p>
            Phòng R&D của Univi tập trung nghiên cứu các yếu tố ảnh hưởng trực tiếp đến trải nghiệm
            sử dụng thực tế như chất liệu, form dáng, độ co giãn, độ thoáng khí, khả năng thoát ẩm,
            chống xù và độ bền màu sau nhiều chu kỳ sử dụng.
          </p>
          <p>
            Thay vì áp dụng một cấu hình vải duy nhất cho mọi bộ môn, đội ngũ phát triển sản phẩm
            tiếp cận theo hướng tối ưu theo đặc thù vận động của từng nhóm người mặc. Một bộ đồng
            phục dành cho Gym sẽ có yêu cầu khác với Yoga, Running hay MMA về mức độ co giãn, khả
            năng giữ form và cường độ vận động thực tế.
          </p>
          <p>
            Triết lý phát triển sản phẩm được xây dựng dựa trên nguyên tắc:
          </p>
          <blockquote className="border-l-4 border-[#105d97] bg-blue-50 py-3 pl-5 pr-4 font-quote text-[#105d97]">
            Đúng bộ môn – Đúng chất liệu – Đúng trải nghiệm.
          </blockquote>
          <p>
            Cách tiếp cận này giúp hệ thống đồng phục phù hợp hơn với môi trường sử dụng thực tế
            thay vì chỉ đáp ứng yêu cầu về hình ảnh hoặc chi phí sản xuất.
          </p>
        </div>

        {/* 10.1 */}
        <div className="mt-8 space-y-3">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            10.1 Goldmark Fitness: Khi Đồng Phục HLV Phải Hoạt Động Trong Chuyển Động Thực
          </h3>
          <div className="space-y-3 leading-6 text-gray-700">
            <p>
              Dự án đồng phục cho <Link href="/bai-viet/dong-phuc-hlv-goldmark-fitness" className="font-semibold text-[#105d97] hover:underline">Goldmark Fitness</Link> cho thấy một yêu cầu rất đặc thù của môi trường
              Gym: đồng phục không chỉ cần đẹp khi đứng yên mà còn phải giữ được form và sự thoải
              mái khi HLV squat, thị phạm kỹ thuật hoặc hỗ trợ hội viên trong suốt ca làm việc.
            </p>
            <p>
              Phản hồi từ đội ngũ vận hành tập trung vào các yếu tố như form áo gọn gàng, khả năng
              vận động linh hoạt, độ thoáng khí và khả năng giữ hình ảnh chuyên nghiệp trong nhiều
              giờ làm việc liên tục.
            </p>
            <p>
              Đây cũng là lý do các tiêu chí như form vai, độ co giãn vùng nách, tốc độ thoát ẩm
              và khả năng giữ form sau nhiều lần giặt được đưa vào quá trình phát triển sản phẩm
              thay vì chỉ đánh giá thông qua hình ảnh studio.
            </p>
          </div>
          <div className="mt-4">
            <ImageBlock
              src="/images/gym/dong-phuc-hlv-goldmark-fitness-univi.jpg"
              alt="Đồng phục HLV Goldmark Fitness – thiết kế tối ưu cho vận động thực tế"
              caption="Đồng phục Goldmark Fitness: form áo gọn gàng, thoáng khí và giữ hình ảnh chuyên nghiệp trong ca làm việc dài."
            />
          </div>
        </div>

        {/* 10.2 */}
        <div className="mt-8 space-y-3">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            10.2 The One KickFit: Đồng Phục Trong Môi Trường Vận Động Cường Độ Cao
          </h3>
          <div className="space-y-3 leading-6 text-gray-700">
            <p>
              Nếu Goldmark đại diện cho môi trường Fitness Center tổng hợp thì{' '}
              <Link href="/bai-viet/feedback-the-one-kickfit-ao-gym-pt-thoang-nhe-univi" className="font-semibold text-[#105d97] hover:underline">The One KickFit</Link>{' '}
              lại là bài toán của vận động cường độ cao với lượng mồ hôi lớn và thời gian mặc kéo dài.
            </p>
            <p>
              Trong bối cảnh đó, các yếu tố như trọng lượng vải, khả năng thoát nhiệt, tốc độ khô
              và cảm giác bám dính khi vận động trở thành những tiêu chí quan trọng hơn yếu tố hình
              ảnh đơn thuần.
            </p>
            <p>
              Đối với các phòng tập chuyên về Boxing, Kickboxing hoặc Functional Training, việc lựa
              chọn chất liệu phù hợp thường tạo ra khác biệt rõ rệt về trải nghiệm mặc trong quá
              trình huấn luyện kéo dài nhiều giờ liên tục.
            </p>
          </div>
          <div className="mt-4">
            <ImageBlock
              src="/images/gym/univi-dong-hanh-cung-the-one-kickfit-3.jpg"
              alt="Đồng phục The One KickFit – vải thoát nhiệt nhanh khô cho vận động cường độ cao"
              caption="The One KickFit: trọng lượng vải, tốc độ khô và cảm giác thoáng khí là tiêu chí quan trọng nhất."
            />
          </div>
        </div>

        {/* 10.3 */}
        <div className="mt-8 space-y-3">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            10.3 AhaGym: Cân Bằng Giữa Form Dáng Và Sự Thoải Mái
          </h3>
          <div className="space-y-3 leading-6 text-gray-700">
            <p>
              Feedback từ{' '}
              <Link href="/bai-viet/feedback-ahagym" className="font-semibold text-[#105d97] hover:underline">AhaGym</Link>{' '}
              phản ánh một nhu cầu rất phổ biến trong ngành Fitness: đồng phục
              cần đủ đứng form để tạo hình ảnh chuyên nghiệp nhưng vẫn phải đảm bảo sự thoải mái
              trong quá trình coaching và thị phạm.
            </p>
            <p>
              Một chiếc áo quá rộng dễ làm mất đi hình ảnh gọn gàng của đội ngũ, trong khi một
              chiếc áo quá bó lại ảnh hưởng trực tiếp tới khả năng vận động và sự tự tin khi làm
              việc với hội viên.
            </p>
            <p>
              Vì vậy, việc lựa chọn form dáng phù hợp với từng vai trò như PT, GroupX, lễ tân hay
              quản lý thường quan trọng không kém việc lựa chọn chất liệu.
            </p>
          </div>
          <div className="mt-4">
            <ImageBlock
              src="/images/gym/univi-dong-hanh-cung-ahagym-1.jpg"
              alt="Đồng phục AhaGym – cân bằng form dáng và sự thoải mái khi coaching"
              caption="AhaGym: cân bằng hình ảnh chuyên nghiệp và sự thoải mái cho từng vai trò PT, GroupX, lễ tân và quản lý."
            />
          </div>
        </div>

        {/* 10.4 */}
        <div className="mt-8 space-y-3">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            10.4 FitCaree: Khi Đồng Phục Trở Thành Một Phần Của Thương Hiệu
          </h3>
          <div className="space-y-3 leading-6 text-gray-700">
            <p>
              Dự án đồng hành cùng{' '}
              <Link href="/bai-viet/univi-dong-hanh-cung-fitcaree" className="font-semibold text-[#105d97] hover:underline">FitCaree</Link>{' '}
              cho thấy một hệ đồng phục Gym hiện đại không chỉ phục
              vụ hoạt động huấn luyện hàng ngày mà còn xuất hiện xuyên suốt trong nhiều điểm chạm
              thương hiệu khác nhau.
            </p>
            <p>
              Từ hình ảnh đội ngũ trong phòng tập, nội dung mạng xã hội, workshop, sự kiện ngoài
              trời cho tới các hoạt động cộng đồng, đồng phục đóng vai trò như một thành phần nhận
              diện giúp duy trì sự nhất quán của thương hiệu trong mắt hội viên và khách hàng tiềm
              năng.
            </p>
            <p>
              Điều này cũng đặt ra yêu cầu khác cho quá trình phát triển sản phẩm. Một bộ đồng phục
              phù hợp không chỉ cần đảm bảo sự thoải mái khi vận động mà còn phải giữ được form
              dáng, màu sắc và hình ảnh chuyên nghiệp trong nhiều bối cảnh sử dụng khác nhau.
            </p>
            <p>
              Bài học rút ra cho các chủ phòng tập là không nên đánh giá đồng phục chỉ dựa trên
              một ảnh studio hoặc một buổi thử đồ ngắn. Giá trị thực sự của đồng phục chỉ xuất
              hiện khi quan sát trong quá trình vận hành thực tế: khi huấn luyện viên làm việc với
              hội viên, khi đội ngũ chụp ảnh tập thể hoặc khi thương hiệu xuất hiện trên các nền
              tảng truyền thông.
            </p>
          </div>
          <div className="mt-4">
            <ImageBlock
              src="/images/gym/univi-dong-hanh-cung-fitcaree-2.jpg"
              alt="FitCaree – đồng phục Gym xuất hiện xuyên suốt các điểm chạm thương hiệu"
              caption="FitCaree: đồng phục không chỉ phục vụ sàn tập – đây là một thành phần nhận diện thương hiệu xuất hiện nhất quán ở mọi điểm chạm."
            />
          </div>
        </div>

        {/* 10.5 */}
        <div className="mt-8 space-y-3">
          <h3 className="text-lg md:text-xl font-medium text-gray-900">
            10.5 Đồng Phục Gym Không Chỉ Xuất Hiện Trên Sàn Tập
          </h3>
          <div className="space-y-3 leading-6 text-gray-700">
            <p>Một hệ đồng phục hiện đại thường xuất hiện ở nhiều điểm chạm khác nhau:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Hoạt động coaching hàng ngày.</li>
              <li>Hình ảnh đội ngũ trên mạng xã hội.</li>
              <li>Video hướng dẫn kỹ thuật.</li>
              <li>Workshop và sự kiện ngoài trời.</li>
              <li>Nội dung tuyển dụng và truyền thông thương hiệu.</li>
            </ul>
            <p>
              Vì vậy, việc đánh giá đồng phục chỉ thông qua một ảnh studio thường chưa phản ánh
              đầy đủ trải nghiệm sử dụng thực tế.
            </p>
            <p>
              Chủ phòng tập nên hình dung đồng phục trong bối cảnh đội ngũ làm việc, khi chụp ảnh
              tập thể hoặc khi thương hiệu xuất hiện trên các nền tảng truyền thông thay vì chỉ
              nhìn vào một mẫu áo riêng lẻ.
            </p>
          </div>
          <div className="mt-4">
            <ImageBlock
              src="/images/gym/dong-phuc-gym-xuat-hien-da-diem-cham.jpg"
              alt="Đồng phục Gym xuất hiện đa điểm chạm – mạng xã hội, sự kiện, video"
              caption="Đồng phục Gym không chỉ là trang phục sàn tập – đây là bộ nhận diện thương hiệu xuất hiện ở mọi điểm chạm."
            />
          </div>
        </div>

        {/* Closing summary */}
        <div className="mt-8 space-y-3 leading-6 text-gray-700">
          <p>
            Các dự án đã được công bố trên hệ thống nội dung của Univi trải dài từ phòng Gym truyền
            thống, PT Studio, Kickboxing, Pilates cho tới các chuỗi Fitness nhiều cơ sở.
          </p>
          <p>
            Mỗi mô hình vận hành đều đặt ra những yêu cầu khác nhau về chất liệu, form dáng, mức
            độ co giãn, khả năng thoát ẩm, độ bền màu và cách đồng phục xuất hiện trong quá trình
            vận hành thương hiệu.
          </p>
          <p>
            Có dự án ưu tiên sự linh hoạt trong vận động cường độ cao, có dự án tập trung vào hình
            ảnh đội ngũ huấn luyện viên, trong khi một số hệ thống lại đặt trọng tâm vào khả năng
            tái sản xuất đồng bộ khi mở rộng nhiều cơ sở. Tham khảo thêm{' '}
            <Link href="/feedback" className="font-semibold text-[#105d97] hover:underline">toàn bộ feedback và dự án đã triển khai tại Univi</Link>.
          </p>
        </div>
      </Section>


      <Section id="giai-phap-2s" title="11. Giải Pháp 2S Uniform Cho Phòng Tập Và Chuỗi Fitness">
        <div className="space-y-3 leading-6">
          <p>
            Với phòng tập có nhiều nhóm nhân sự hoặc chuỗi đang mở rộng, đặt từng mẫu áo riêng lẻ
            thường tạo ra hệ thống rời rạc. Đây là lý do{' '}
            <Link href="/giai-phap-2s" className="font-semibold text-[#105d97] hover:underline">
              giải pháp 2S Uniform
            </Link>{' '}
            phù hợp với Gym và Fitness Center.
          </p>
          <p>
            2S Uniform gồm Staff Uniform cho HLV, PT, lễ tân, sale, quản lý và vận hành; Member
            Uniform cho hội viên, VIP, lớp cộng đồng, sự kiện, workshop hoặc merchandise.
          </p>
        </div>
        <div className="mt-6">
          <ProcessSteps variant="vertical" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {rolloutScenarios.map(([title, text]) => (
            <TextCard key={title} title={title}>
              <p>{text}</p>
            </TextCard>
          ))}
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55315396424_112c185301_b.jpg"
            alt="Quy trình triển khai đồng phục Gym theo giải pháp 2S Uniform"
            caption="2S Uniform giúp phòng tập đồng bộ Staff Uniform và Member Uniform theo cùng một ngôn ngữ thương hiệu."
          />
        </div>
      </Section>

      <Section id="internal-link-hub" title="12. Bài Viết Liên Quan">
        <div className="grid gap-3 md:grid-cols-2">
          {relatedLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium text-[#105d97] transition hover:border-[#105d97] hover:bg-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </Section>

      <Section id="footer-seo" title="13. Đồng Phục Gym Theo Yêu Cầu Tại UNIVI">
        <div className="space-y-4 leading-6">
          <p>
            Đồng phục Gym không chỉ là trang phục cho nhân sự phòng tập. Đó là một phần của vận hành
            thương hiệu, trải nghiệm hội viên và khả năng mở rộng hệ thống.
          </p>
          <p>
            Phòng Gym không nên chọn đồng phục theo một mẫu áo chung cho tất cả. Cách đúng hơn là
            phân vai đội ngũ, chọn chất liệu theo cường độ vận động, thiết kế theo nhận diện thương
            hiệu và lưu chuẩn tái sản xuất cho dài hạn.
          </p>
          <p>
            Với nền tảng R&D, công nghệ UNI DRY, hệ chất liệu thể thao chuyên dụng và giải pháp 2S
            Uniform, UNIVI có thể đồng hành với Gym Owner, PT Studio và chuỗi Fitness Center trong
            việc xây dựng hệ đồng phục chuyên dụng, đồng bộ và có giá trị thương hiệu rõ ràng.
          </p>
        </div>
        <div className="mt-6">
          <ImageBlock
            src="https://live.staticflickr.com/65535/55231505620_c9ef4cb492_b.jpg"
            alt="Đồng phục Gym theo yêu cầu tại UNIVI"
            caption="Một bộ đồng phục đúng giúp hội viên nhận diện người hỗ trợ, giúp đội ngũ tự tin hơn và giúp phòng tập duy trì hình ảnh nhất quán."
          />
        </div>
      </Section>

      <section className="bg-[#105d97] p-5 text-white">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-blue-100">
              UNIVI SPORTS UNIFORM - YOUR UNIFORM, YOUR BRAND!
            </p>
            <h2 className="mt-1 text-xl md:text-2xl font-medium tracking-tight leading-6">
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
            Nhận tư vấn đồng phục Gym
          </button>
        </div>
      </section>

      <Section id="faq" title="Câu Hỏi Thường Gặp Về Đồng Phục Gym">
        <div className="space-y-3">
          {gymFaqs.map(([question, answer]) => (
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
        source="Đồng phục Gym - Nhận tư vấn"
        isModal
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
      />
    </div>
  );
}
