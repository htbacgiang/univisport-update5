import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';
import BangMauHero from '../bang-mau/BangMauHero';
import { fabrics } from '../../../data/fabrics';
import FabricCardComponent from '../FabricCardComponent';
const soSanhSoMi = [
  ['Mục tiêu', 'Phù hợp gu mặc và vóc dáng cá nhân', 'Tạo hình ảnh thống nhất cho tổ chức'],
  ['Thiết kế', 'Theo sở thích và dịp sử dụng', 'Theo nhận diện, vai trò và bối cảnh làm việc'],
  ['Màu sắc', 'Tự do lựa chọn', 'Theo hệ màu thương hiệu đã duyệt'],
  ['Size', 'Một người', 'Bảng size và cơ cấu nam/nữ cho nhiều người mặc'],
  ['Đặt bổ sung', 'Không phải ưu tiên', 'Cần lưu mẫu, màu, form và thông số để tái đặt'],
  ['Hình ảnh', 'Cá nhân', 'Corporate image và trải nghiệm khách hàng'],
];

const lyDoSuDung = [
  ['Tạo hình ảnh chuyên nghiệp, gọn gàng', 'Sơ mi có cấu trúc rõ ràng, dễ tạo cảm giác chỉn chu hơn áo thun hay polo trong môi trường văn phòng, tiếp khách hoặc hội họp. Một chiếc sơ mi vừa vặn, sạch nếp gấp thường tạo thiện cảm ban đầu nhanh hơn nhiều chi tiết trang trí khác.'],
  ['Tăng tính nhất quán thương hiệu', 'Khi màu, chất liệu và form được thống nhất, nhân sự ở nhiều phòng ban hoặc cơ sở khác nhau vẫn tạo cảm giác thuộc cùng một tổ chức, dù không cần mặc giống hệt nhau.'],
  ['Linh hoạt trong nhiều bối cảnh', 'Sơ mi có thể mặc rời trong ngày làm việc thường nhật, hoặc phối cùng vest, quần tây trong các dịp cần trang trọng hơn — giúp doanh nghiệp không phải đầu tư quá nhiều bộ trang phục riêng biệt.'],
  ['Hỗ trợ quản trị đồng phục', 'Khi có bảng size và hồ sơ mẫu chuẩn, HR có thể cấp phát cho nhân sự mới hoặc đặt bổ sung sát với chuẩn ban đầu, thay vì mỗi lần đặt lại lại phát sinh một phiên bản khác.'],
  ['Tạo cảm giác gắn kết nội bộ', 'Một mẫu sơ mi chung, có thể linh hoạt theo vai trò, giúp nhân sự cảm nhận rõ hơn việc đang đại diện cho cùng một tổ chức trong công việc hằng ngày.'],
  ['Dễ kết hợp với các dòng đồng phục khác', 'Sơ mi công sở có thể là một lớp trong hệ thống đồng phục rộng hơn của doanh nghiệp, bên cạnh các dòng như <link/>, để cùng chia sẻ một ngôn ngữ màu và chất liệu.'],
];

const nganhPhuHop = [
  ['Ngân hàng, tài chính', 'Giao dịch, tư vấn khách hàng', 'Trang trọng, ổn định'],
  ['Bất động sản', 'Tư vấn, mở bán', 'Chỉn chu, có điểm nhấn'],
  ['Khách sạn, nhà hàng', 'Lễ tân, phục vụ, quản lý ca', 'Thanh lịch, dễ nhận diện'],
  ['Bán lẻ, showroom', 'Tiếp khách, bán hàng', 'Gọn gàng, dễ vận động'],
  ['Giáo dục', 'Giảng dạy, sự kiện', 'Trang nhã, thân thiện'],
  ['Văn phòng, dịch vụ chuyên nghiệp', 'Làm việc hằng ngày, họp', 'Tối giản, dễ phối'],
  ['Doanh nghiệp sản xuất, kỹ thuật', 'Khối văn phòng, quản lý xưởng', 'Bền, dễ bảo quản'],
];

const bangChatLieu = [
  ['UNI QUICK DRY', 'Nhẹ, nhanh khô', 'Hỗ trợ thoát ẩm nhanh', 'Ít nhăn theo knowledge, dễ bảo quản', 'Văn phòng năng động, di chuyển nhiều'],
  ['UNI SUPER COOL', 'Mềm, mượt, mát', 'Hỗ trợ lưu thông không khí', 'Co giãn nhẹ, dễ chịu khi mặc lâu', 'Môi trường ít điều hòa, gặp khách ngoài trời'],
  ['UNI BLENDED', 'Mềm, nhẹ, cân bằng', 'Kết hợp đặc tính của sợi pha', 'Bền màu, chống nhăn theo knowledge', 'Sơ mi phổ thông, dùng hằng ngày'],
];

const cacKieuSoMi = [
  ['Sơ mi công sở cơ bản', 'Cổ đứng hoặc cổ Ý, tay dài, phù hợp làm nền cho phần lớn hoạt động văn phòng hằng ngày.'],
  ['Sơ mi form hiện đại (Modern/Slim)', 'Đường cắt gọn hơn, tạo cảm giác trẻ trung — cần thử trên nhiều vóc dáng trước khi triển khai đại trà.'],
  ['Sơ mi tay ngắn', 'Phù hợp môi trường nóng, ít điều hòa hoặc văn hóa doanh nghiệp thiên về thoải mái, năng động.'],
  ['Sơ mi phối vest', 'Đóng vai trò lớp nền màu khi phối cùng vest hoặc blazer trong các dịp cần trang trọng hơn.'],
  ['Sơ mi lễ tân', 'Ưu tiên form thanh lịch, dễ nhận diện và thoải mái khi phải đứng hoặc di chuyển trong ca dài.'],
  ['Sơ mi sự kiện có điểm nhấn', 'Có thể thêm chi tiết phối màu hoặc logo rõ hơn để tăng khả năng nhận diện tại hội nghị, triển lãm.'],
  ['Sơ mi phối đồng phục thể thao', 'Dùng khi doanh nghiệp cần một lớp trang phục chuyển tiếp giữa giờ làm việc và hoạt động ngoài trời, teambuilding.'],
];

const vaiTroNhanSu = [
  'Thương hiệu (logo vector, màu chính/phụ, quy chuẩn nhận diện đã duyệt)',
  'Nhân sự (số lượng, nam/nữ, vai trò, bộ phận, bảng size hiện có)',
  'Thiết kế (form, cổ áo, tay áo, túi ngực, đường phối, vị trí logo)',
  'Sử dụng (văn phòng, gặp khách, sự kiện, tần suất mặc, môi trường làm việc)',
  'Vận hành (deadline nội bộ, người duyệt mẫu, kế hoạch tuyển mới và đặt bổ sung)',
];

const quyTrinh11Buoc = [
  ['Tiếp nhận brief', 'Về thương hiệu, vai trò, số lượng và bối cảnh sử dụng.'],
  ['Tư vấn cấu hình', 'Xác định kiểu sơ mi và phân nhóm người mặc theo vai trò.'],
  ['Xác định nhận diện', 'Màu, logo, chi tiết phối và mức độ trang trọng.'],
  ['Chọn chất liệu', 'Dựa trên mẫu vải, cảm giác mặc và tần suất sử dụng.'],
  ['Chọn form và size', 'Form, bảng size và cách đo cho nam và nữ.'],
  ['Thiết kế mockup', 'Thống nhất chi tiết trước khi làm mẫu thật.'],
  ['Làm mẫu thực tế', 'Khi brief cần kiểm tra form, chất liệu hoặc màu.'],
  ['Duyệt mẫu', 'Màu, form, logo, chi tiết phối và bảng size.'],
  ['Chốt cấu hình', 'Số lượng, tiến độ và hạng mục kiểm tra chất lượng.'],
  ['Sản xuất và QC', 'Đóng gói và bàn giao theo thỏa thuận.'],
  ['Lưu mẫu chuẩn', 'Bảng size và thông số để đặt bổ sung về sau.'],
];

const yeuToChiPhi = [
  'Chất liệu và cấu trúc vải',
  'Form, số chi tiết may và độ phức tạp thiết kế',
  'Kiểu cổ, tay áo, túi và các chi tiết đi kèm',
  'Kỹ thuật logo, số vị trí in/thêu và mức độ tùy biến',
  'Số lượng, cơ cấu size và tỷ lệ nam/nữ',
  'Mẫu thử, chỉnh sửa, QC, đóng gói và vận chuyển',
  'Nhu cầu đặt bổ sung, lưu mẫu và quản lý thông số',
];

const saiLamThuongGap = [
  ['Chỉ quan tâm giá', 'Giá không có ý nghĩa nếu chưa biết cấu hình. Hãy yêu cầu báo giá cùng một dòng vải, form, logo, số lượng và hạng mục giao hàng.'],
  ['Chọn mẫu trước khi xác định nhu cầu', 'Một mẫu đẹp trên ảnh có thể không phù hợp với lễ tân đứng lâu hoặc nhân viên kinh doanh di chuyển nhiều.'],
  ['Dùng một form cho tất cả', 'Nam, nữ, lễ tân, quản lý và nhân sự sự kiện có thể cần các biến thể khác nhau trong cùng một hệ nhận diện.'],
  ['Không duyệt mẫu thật', 'Mockup không thể thay thế hoàn toàn việc kiểm tra chất liệu, màu, vai, tay và độ thoáng khi mặc.'],
  ['Không kiểm tra màu dưới nhiều điều kiện ánh sáng', 'Màu trên màn hình, mẫu in và vải thật có thể tạo cảm nhận khác nhau. Cần chốt mẫu vật lý được hai bên xác nhận.'],
  ['Logo quá lớn hoặc đặt sai vị trí', 'Logo lớn không đồng nghĩa nhận diện cao cấp. Vị trí và tỷ lệ thường quan trọng hơn kích thước tuyệt đối.'],
  ['Bỏ qua bảng size nữ', 'Sơ mi nữ cần bảng số đo riêng, không nên thu nhỏ trực tiếp từ bảng size nam.'],
  ['Không lưu thông số mẫu chuẩn', 'Không lưu mẫu chuẩn khiến mỗi đợt đặt lại có nguy cơ thành một sản phẩm khác với ban đầu.'],
];

const nangLucB2B = [
  ['Năng lực sản xuất', 'Univi công bố xưởng 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất 100.000 sản phẩm/tháng — nền tảng để triển khai các đơn hàng cần điều phối nhiều hạng mục và nhiều đợt giao.'],
  ['R&D chất liệu', 'Univi có hoạt động R&D về chất liệu, form dáng và trải nghiệm người mặc; knowledge ghi nhận các dòng UNI QUICK DRY, UNI SUPER COOL, UNI BLENDED và công nghệ UNI DRY. Brief có cơ sở hơn khi doanh nghiệp cần cân bằng hình ảnh, cảm giác mặc và chi phí sử dụng.'],
  ['Định vị B2B và giải pháp hệ thống', 'Univi định vị B2B và phát triển giải pháp đồng phục theo hệ thống, trong đó có giải pháp 2S Uniform. Doanh nghiệp có thể tham khảo tư duy phân vai, lưu chuẩn và đặt bổ sung khi xây dựng bộ sơ mi công sở.'],
  ['Kinh nghiệm triển khai', 'Với hơn 9 năm hoạt động trong ngành, Univi có kinh nghiệm làm việc với nhiều loại brief khác nhau, từ đơn hàng nhỏ theo phòng ban đến triển khai đồng loạt cho toàn doanh nghiệp.'],
];

const faqs = [
  [
    'Sơ mi công sở đồng phục doanh nghiệp là gì?',
    'Sơ mi công sở đồng phục doanh nghiệp là hệ áo sơ mi được thiết kế và chuẩn hóa cho nhiều nhân sự theo cùng một nhận diện thương hiệu, gồm màu sắc, chất liệu, form dáng, logo và cơ cấu size. Khác với sơ mi cá nhân, đồng phục doanh nghiệp cần đảm bảo tính nhất quán khi sử dụng và đặt bổ sung trong thời gian dài.'
  ],
  [
    'Sơ mi doanh nghiệp khác sơ mi cá nhân như thế nào?',
    'Sơ mi cá nhân chủ yếu được lựa chọn theo gu mặc, vóc dáng và nhu cầu của một người; sơ mi doanh nghiệp phải giải quyết thêm bài toán nhận diện thương hiệu, nhiều người mặc, nhiều vai trò, cơ cấu size và khả năng tái đặt nhất quán.'
  ],
  [
    'Sơ mi đồng phục doanh nghiệp có thể thiết kế theo nhận diện thương hiệu không?',
    'Có. Màu sắc, logo, cổ áo, tay áo, đường phối và các chi tiết nhận diện có thể được xây dựng theo hệ nhận diện của doanh nghiệp. Khi thiết kế, nên ưu tiên những yếu tố đặc trưng nhưng vẫn đảm bảo tính lịch sự và khả năng sử dụng lâu dài.'
  ],
  [
    'Sơ mi nam và nữ có cần dùng cùng một form không?',
    'Không nhất thiết. Doanh nghiệp có thể giữ chung màu sắc, chất liệu và hệ nhận diện nhưng sử dụng form nam và nữ riêng để phù hợp tỷ lệ cơ thể và trải nghiệm mặc. Bảng size và mẫu thực tế nên được duyệt theo từng nhóm người mặc.'
  ],
  [
    'Nên chọn sơ mi công sở theo tiêu chí nào?',
    'Nên bắt đầu từ môi trường sử dụng và vai trò người mặc, sau đó mới lựa chọn chất liệu, form, màu sắc, cổ áo, tay áo và cách triển khai logo. Với doanh nghiệp, cần đồng thời xem xét khả năng duy trì mẫu và đặt bổ sung trong tương lai.'
  ],
  [
    'Nên chọn chất liệu nào cho sơ mi đồng phục doanh nghiệp?',
    'Nên chọn chất liệu dựa trên môi trường làm việc, tần suất sử dụng, yêu cầu về độ thoáng, độ ít nhăn, cảm giác mặc, khả năng bảo quản và ngân sách. Doanh nghiệp nên kiểm tra mẫu vải thực tế trước khi chốt số lượng lớn.'
  ],
  [
    'Sơ mi công sở nên chọn màu gì cho doanh nghiệp?',
    'Màu sơ mi nên được lựa chọn dựa trên màu nhận diện thương hiệu, môi trường làm việc và mức độ trang trọng cần thiết. Các doanh nghiệp có thể sử dụng màu thương hiệu làm màu chủ đạo hoặc kết hợp màu trung tính để tạo hệ đồng phục dễ sử dụng lâu dài.'
  ],
  [
    'Có thể phối màu sơ mi với vest và quần tây không?',
    'Có. Sơ mi thường đóng vai trò lớp nền trong trang phục công sở nên có thể phối với vest, quần tây hoặc chân váy. Khi phối màu, nên duy trì độ tương phản vừa phải để tổng thể chuyên nghiệp và không làm hệ nhận diện trở nên quá rối.'
  ],
  [
    'Có nên làm mẫu sơ mi trước khi sản xuất số lượng lớn không?',
    'Nên. Mockup giúp kiểm tra hình ảnh thiết kế, còn mẫu thực tế giúp doanh nghiệp đánh giá form, chất liệu, màu sắc, logo và cảm giác mặc. Các thông số đã duyệt nên được lưu lại để làm mẫu đối chứng cho những lần sản xuất sau.'
  ],
  [
    'Có thể đặt form riêng cho từng nhóm nhân sự không?',
    'Có thể. Doanh nghiệp có thể giữ chung nhận diện nhưng điều chỉnh form, bảng size hoặc một số chi tiết theo nhóm như lễ tân, kinh doanh, quản lý và nhân sự văn phòng. Cách này giúp đồng phục phù hợp với từng vai trò mà vẫn duy trì hình ảnh thống nhất.'
  ],
  [
    'Sơ mi đồng phục doanh nghiệp có thể dùng cho lễ tân và đội ngũ đối ngoại không?',
    'Có. Sơ mi công sở phù hợp với lễ tân, kinh doanh, tư vấn và các vị trí thường xuyên gặp khách hàng khi được thiết kế theo hướng chỉn chu, dễ phối và phù hợp với nhận diện thương hiệu của doanh nghiệp.'
  ],
  [
    'Sơ mi doanh nghiệp có phù hợp với nhiều ngành nghề không?',
    'Có. Sơ mi doanh nghiệp có thể được cấu hình cho văn phòng, bất động sản, ngân hàng và tài chính, khách sạn – nhà hàng, bán lẻ, showroom, giáo dục, dịch vụ chuyên nghiệp hoặc khối văn phòng của doanh nghiệp sản xuất. Mỗi ngành nên có brief riêng về vai trò và môi trường sử dụng.'
  ],
  [
    'UNIVI có nhận may sơ mi doanh nghiệp số lượng lớn không?',
    'Có. Năng lực thương mại được xác nhận gồm xưởng sản xuất 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất khoảng 100.000 sản phẩm mỗi tháng. Số lượng, tiến độ và cấu hình thực tế cần được xác nhận theo từng dự án và báo giá.'
  ],
  [
    'Có thể đặt lại cùng mẫu sơ mi doanh nghiệp trong những lần sau không?',
    'Có thể thuận tiện tái đặt nếu doanh nghiệp lưu lại mẫu chuẩn, màu sắc, chất liệu, form, bảng size, vị trí logo và các thông số kỹ thuật. Việc lưu chuẩn giúp hạn chế sai khác giữa các đợt sản xuất khi doanh nghiệp tuyển thêm nhân sự hoặc mở rộng chi nhánh.'
  ],
  [
    'Chi phí may sơ mi đồng phục doanh nghiệp phụ thuộc vào yếu tố nào?',
    'Chi phí phụ thuộc vào chất liệu, form áo, số lượng, màu sắc, kiểu dáng, kỹ thuật logo, yêu cầu làm mẫu, đóng gói, phân loại, giao hàng và các yêu cầu đặc biệt. Nên so sánh báo giá trên cùng một cấu hình sản phẩm để đánh giá chính xác.'
  ],
  [
    'Quy trình đặt sơ mi đồng phục doanh nghiệp gồm những bước nào?',
    'Quy trình có thể gồm tiếp nhận brief, tư vấn cấu hình, xác định nhận diện, chọn chất liệu, chọn form và size, thiết kế mockup, làm mẫu thực tế, duyệt mẫu, chốt cấu hình, sản xuất – kiểm tra chất lượng và lưu mẫu chuẩn để tái đặt.'
  ],
  [
    'UNIVI có giao sơ mi đồng phục doanh nghiệp toàn quốc không?',
    'Có. Univi cung cấp giải pháp sơ mi đồng phục doanh nghiệp theo yêu cầu và giao hàng toàn quốc. Tiến độ và phương án giao hàng được xác nhận theo số lượng, địa điểm nhận hàng và kế hoạch của từng dự án.'
  ]
];
function BulletGrid({ items, cols = 'md:grid-cols-2' }) {
  return (
    <div className={`grid gap-1 ${cols}`}>
      {items.map(([title, text]) => (
        <div key={title} className="bg-white rounded-xl">
          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p>{text}</p>
        </div>
      ))}
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

export default function ShirtUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-xl mb-4 leading-6">
              Sơ Mi Công Sở
              <span className="text-yellow-300"> Đồng Phục Doanh Nghiệp</span>
            </h2>
            <p className="text-base text-white">
              Sơ mi công sở là lớp trang phục xuất hiện thường xuyên nhất trong ngày làm việc — từ bàn làm việc, phòng họp đến các buổi gặp khách hàng. Một chiếc sơ mi đồng phục doanh nghiệp không chỉ cần đẹp, mà phải giải quyết được bài toán số lượng lớn, nhiều vai trò và một hệ nhận diện thống nhất theo thời gian.
            </p>
          </div>
        </div>

        {/* 1 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Sơ Mi Công Sở Đồng Phục Doanh Nghiệp Là Gì?
          </h2>
          <p className="text-base mb-3">
            Sơ mi cá nhân được chọn chủ yếu theo gu mặc, vóc dáng và dịp sử dụng của một người. Sơ mi đồng phục doanh nghiệp phải giải quyết bài toán ở cấp hệ thống: nhiều người mặc, nhiều vai trò, một ngôn ngữ thương hiệu và khả năng duy trì chuẩn khi nhân sự thay đổi theo thời gian.
          </p>
          <SimpleTable headers={['Tiêu chí', 'Sơ mi cá nhân', 'Sơ mi doanh nghiệp']} rows={soSanhSoMi} />
          <p className="text-base mt-3">
            Điểm khác biệt nằm ở cách chọn. Thay vì chỉ hỏi "mẫu nào đẹp?", doanh nghiệp nên xác định trước ai sẽ mặc, mặc trong bối cảnh nào và bộ sơ mi cần vận hành ra sao trong 12–24 tháng tới trước khi chốt cấu hình.
          </p>
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-tim-nhat.png" alt="Sơ mi công sở đồng phục doanh nghiệp Univi" />

        {/* 2 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Vì Sao Doanh Nghiệp Nên Sử Dụng Sơ Mi Đồng Phục?
          </h2>
          <div className="grid gap-1 md:grid-cols-1">
            {lyDoSuDung.map(([title, text]) => (
              <div key={title} className="bg-white rounded-xl">
                <h3 className="font-bold text-base mb-1">{title}</h3>
                <p>
                  {title === 'Dễ kết hợp với các dòng đồng phục khác' ? (
                    <>
                      Sơ mi công sở có thể là một lớp trong hệ thống đồng phục rộng hơn của doanh nghiệp, bên cạnh các dòng như{' '}
                      <Link href="/dong-phuc-the-thao" className="font-semibold text-[#105d97]">
                        đồng phục thể thao doanh nghiệp
                      </Link>
                      , để cùng chia sẻ một ngôn ngữ màu và chất liệu.
                    </>
                  ) : (
                    text
                  )}
                </p>
              </div>
            ))}
          </div>
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-trang.jpg" alt="Lý do doanh nghiệp nên sử dụng sơ mi đồng phục" />

        {/* 3 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Sơ Mi Nam Và Sơ Mi Nữ: Đồng Bộ Nhưng Không Rập Khuôn
          </h2>
          <p className="text-base mb-3">
            Nam và nữ không nhất thiết phải mặc cùng một kiểu mới gọi là đồng bộ. Điều cần thống nhất là màu, chất liệu và ngôn ngữ thiết kế; form và chi tiết cần tôn trọng khác biệt vóc dáng và thói quen vận động.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2">3.1 Sơ mi nam doanh nghiệp</h3>
              <p className="text-base">
                Cần xem xét tỷ lệ vai, chiều dài tay áo, độ rộng ở phần ngực và eo. Cổ áo, cách phối cà vạt (nếu có) và độ đứng nếp có thể làm tổng thể nghiêng về cổ điển hoặc hiện đại. Sơ mi nên tạo nền sạch để phối với vest, quần tây hoặc mặc rời trong ngày làm việc thường nhật.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2">3.2 Sơ mi nữ doanh nghiệp</h3>
              <p className="text-base">
                Cần bảng số đo riêng, không nên thu nhỏ trực tiếp từ form nam. Chiết eo, chiều dài áo và độ ôm cần được thử trên nhiều nhóm vóc dáng — nên ưu tiên form vừa vặn, dễ vận động thay vì xem kiểu dáng quá ôm là mặc định của sự chỉn chu.
              </p>
            </div>
          </div>
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nu-ao-so-mi-be.jpg" alt="Sơ mi công sở nam nữ đồng bộ nhận diện thương hiệu doanh nghiệp" />

        {/* 4 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Form, Cổ Áo Và Chi Tiết Thiết Kế
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">4.1 Form Regular, Modern hay Slim</h3>
              <p className="text-base">Regular dễ triển khai cho nhiều vóc dáng; Modern cân bằng giữa gọn gàng và thoải mái; Slim tạo hình ảnh hiện đại nhưng cần thử mẫu kỹ hơn trước khi may đại trà.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">4.2 Kiểu cổ áo</h3>
              <p className="text-base">Cổ đứng và cổ Ý thường dễ phối với môi trường công sở; cổ button-down phù hợp phong cách năng động, ít trang trọng hơn. Nên chọn kiểu cổ theo mức độ trang trọng chung của thương hiệu.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">4.3 Tay dài và tay ngắn</h3>
              <p className="text-base">Tay dài phù hợp môi trường có điều hòa và bối cảnh trang trọng; tay ngắn phù hợp khí hậu nóng hoặc văn hóa doanh nghiệp thiên về thoải mái.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">4.4 Cúc, nẹp áo và túi ngực</h3>
              <p className="text-base">Đây là những chi tiết nhỏ nhưng ảnh hưởng đến cảm giác hoàn thiện tổng thể — nên thống nhất về màu cúc, kiểu nẹp và có hay không có túi ngực trong toàn bộ hệ đồng phục.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">4.5 Đường may và khả năng chống nhăn</h3>
              <p className="text-base">Đường may cần chắc chắn để chịu được giặt ủi thường xuyên; một số dòng vải có đặc tính ít nhăn theo knowledge, giúp sơ mi giữ form tốt hơn trong ngày làm việc dài.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">4.6 Chi tiết nhận diện</h3>
              <p className="text-base">Logo thêu ở ngực hoặc tay áo, lót cổ phối màu thương hiệu là những chi tiết thường được dùng để tăng nhận diện mà không làm thiết kế trở nên rườm rà.</p>
            </div>
          </div>
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-xam.jpg" alt="Form, cổ áo và chi tiết thiết kế sơ mi công sở doanh nghiệp" />

        {/* 5 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Chất Liệu Sơ Mi Công Sở
          </h2>
          <p className="text-base mb-3">
            Với các cấu hình có liên quan đến hệ sinh thái chất liệu Univi, có thể tham khảo các nguyên tắc sau:
          </p>
          <SimpleTable
            headers={['Dòng chất liệu', 'Cảm giác / đặc điểm', 'Thoáng khí và quản lý ẩm', 'Co giãn, bảo quản', 'Bối cảnh sử dụng']}
            rows={bangChatLieu}
          />
          <div className="space-y-3 mt-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.1 UNI QUICK DRY</h3>
              <p className="text-base">Ưu tiên khả năng thoát ẩm và nhanh khô, phù hợp nhân sự di chuyển nhiều trong ngày.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.2 UNI SUPER COOL</h3>
              <p className="text-base">
                Hướng đến cảm giác mát, mềm khi mặc trong thời gian dài. Doanh nghiệp có thể tham khảo thêm{' '}
                <Link href="/vai-super-cool-la-gi" className="font-semibold text-[#105d97]">
                  vải Super Cool là gì
                </Link>{' '}
                để hiểu rõ hơn đặc tính trước khi chọn cho sơ mi công sở.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.3 UNI BLENDED</h3>
              <p className="text-base">Dòng vải pha, cân bằng giữa cảm giác mặc, độ bền màu và chi phí — phù hợp làm nền cho phần lớn sơ mi công sở phổ thông.</p>
            </div>

            <FabricCardComponent />

            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.4 Kiểm soát chất lượng vải</h3>
              <p className="text-base">Vải trước khi đưa vào sản xuất cần được kiểm tra theo tiêu chí nội bộ về độ bền màu, độ co giãn và cảm giác mặc, nhằm đảm bảo các đợt sản xuất khác nhau vẫn giữ được sự đồng nhất.</p>
            </div>
          </div>
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-xanh-than.jpg" alt="Chất liệu sơ mi công sở đồng phục doanh nghiệp Univi" />

        {/* 6 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Màu Sắc Và Nhận Diện Thương Hiệu
          </h2>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">6.1 Chọn màu theo nhận diện thương hiệu</h3>
              <p className="text-base">
                Trắng và xanh nhạt thường dễ triển khai và dễ phối. Nếu thương hiệu có màu riêng, cần đánh giá màu đó với ngành, khách hàng và bối cảnh sử dụng trước khi chốt. Doanh nghiệp có thể tham khảo{' '}
                <Link href="/bang-mau" className="font-semibold text-[#105d97]">
                  bảng màu vải của Univi
                </Link>{' '}
                để chọn màu chính, màu phụ và màu phối phù hợp.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">6.2 Phối màu sơ mi với vest và quần</h3>
              <p className="text-base">Sơ mi thường đóng vai trò lớp nền màu. Khi phối cùng vest hoặc quần tây, nên ưu tiên tương phản vừa phải để tổng thể không bị rối mắt, đặc biệt trong các dịp cần độ trang trọng cao.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">6.3 Kiểm tra màu trong thực tế</h3>
              <p className="text-base">Màu trên màn hình, mẫu in và vải thật có thể tạo cảm nhận khác nhau. Nên đối chiếu màu trên mẫu vải thật dưới ánh sáng văn phòng trước khi duyệt số lượng lớn.</p>
            </div>
          </div>
        </article>
        <BangMauHero fabrics={fabrics} />

        {/* 7 */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            Các Kiểu Sơ Mi Và Cách Phối Thành Hệ Đồng Phục
          </h2>
          <BulletGrid items={cacKieuSoMi} />
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-xanh-quan-vay-den.jpg" alt="Các kiểu sơ mi công sở và cách phối thành hệ đồng phục doanh nghiệp" />

        {/* 8 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Chọn Sơ Mi Theo Ngành Và Vị Trí
          </h2>
          <p className="text-base mb-3">
            Không phải mọi vị trí đều cần cùng một cấu hình sơ mi. Doanh nghiệp có thể xây dựng theo ngành nghề trước, sau đó phân nhỏ theo vai trò cụ thể.
          </p>
          <SimpleTable headers={['Ngành / mô hình', 'Bối cảnh', 'Phong cách nên cân nhắc']} rows={nganhPhuHop} />
          <p className="text-base mt-3">
            Trong cùng một doanh nghiệp, lễ tân và bộ phận kinh doanh thường cần mức độ chỉn chu cao hơn khối vận hành nội bộ — có thể giữ chung màu và chất liệu nhưng linh hoạt về form và chi tiết phối theo từng nhóm.
          </p>
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-ao-so-mi-ke-caro.jpg" alt="Sơ mi công sở theo ngành nghề và vị trí trong doanh nghiệp" />

        {/* 9 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">9.</span>
            Bộ Sưu Tập, Bảng Màu Và Quy Trình Đặt May
          </h2>
          <div className="space-y-3 mb-4">
            <p className="text-base">
              Doanh nghiệp có thể bắt đầu từ{' '}
              <Link href="/bo-suu-tap" className="font-semibold text-[#105d97]">
                bộ sưu tập đồng phục Univi
              </Link>{' '}
              để tham khảo form, cách phối màu và ngôn ngữ thiết kế trước khi phát triển mẫu riêng, kết hợp cùng{' '}
              <Link href="/bang-mau" className="font-semibold text-[#105d97]">
                bảng màu Univi
              </Link>{' '}
              để chốt màu chính, màu phụ và màu phối.
            </p>
            <p className="text-base">
              Quy trình dưới đây là khung triển khai đề xuất, cần xác nhận riêng theo brief và mẫu thực tế:
            </p>
          </div>
          <NumberedList items={quyTrinh11Buoc} />
          <p className="text-base mt-3">
            Doanh nghiệp có thể tham khảo{' '}
            <Link href="/huong-dan-dat-hang" className="font-semibold text-[#105d97]">
              hướng dẫn đặt hàng
            </Link>{' '}
            và{' '}
            <Link href="/giai-phap-2s" className="font-semibold text-[#105d97]">
              giải pháp 2S Uniform
            </Link>{' '}
            để hiểu cách Univi phân tầng sản phẩm theo nhóm người mặc khi cần mở rộng hệ đồng phục ngoài sơ mi công sở.
          </p>
        </article>
        <ArticleImage src="/so-mi-cong-so/quy-trinh-len-mau.jpg" alt="Quy trình tư vấn, duyệt mẫu và đặt may sơ mi công sở doanh nghiệp" />

        {/* 10 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">10.</span>
            Duyệt Mẫu, Chi Phí Và Checklist
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">10.1 Vì sao phải duyệt mẫu trước khi sản xuất hàng loạt?</h3>
          <p className="text-base mb-3">
            Mẫu duyệt cần kiểm tra: màu thật, vai, tay, chiều dài, form khi cài khuy, logo và chất liệu — nên thử trên nhiều nhóm vóc dáng và thực hiện các động tác ngồi, đưa tay, đi lại trước khi chốt số lượng lớn.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">10.2 Chi phí phụ thuộc vào đâu?</h3>
          <p className="text-base mb-3">
            Univi chưa có bảng giá sơ mi công sở chính thức trong knowledge được duyệt, vì vậy bài viết không đưa đơn giá, MOQ hay thời gian giao hàng cụ thể. Khi yêu cầu báo giá, doanh nghiệp nên tách các yếu tố sau:
          </p>
          <div className="grid gap-1 md:grid-cols-2 mb-4">
            {yeuToChiPhi.map((item) => (
              <div key={item} className="bg-white rounded-xl p-3">
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="text-base mb-4">
            Có thể tham khảo thêm cách Univi trình bày yếu tố chi phí qua bài viết{' '}
            <Link href="/bai-viet/bao-gia-may-dong-phuc-phong-tap" className="font-semibold text-[#105d97]">
              báo giá may đồng phục
            </Link>{' '}
            như một khung tham chiếu, dù cấu hình sơ mi công sở cần báo giá riêng theo brief thực tế.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">10.3 Checklist brief đặt sơ mi</h3>
          <div className="grid gap-1 md:grid-cols-1">
            {vaiTroNhanSu.map((item) => (
              <div key={item} className="bg-white rounded-xl">
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>

        {/* 11 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">11.</span>
            Sai Lầm Thường Gặp
          </h2>
          <BulletGrid items={saiLamThuongGap} />
        </article>
        <ArticleImage src="/so-mi-cong-so/dong-phuc-cong-so-nam-nu-ao-so-mi-ke-soc-xanh.png" alt="Sai lầm thường gặp khi đặt may sơ mi công sở đồng phục doanh nghiệp" />

        {/* 12 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">12.</span>
            Năng Lực B2B Của Univi
          </h2>
          <BulletGrid items={nangLucB2B} cols="md:grid-cols-1" />
          <p className="text-base mt-3">
            Doanh nghiệp có thể tìm hiểu thêm về{' '}
            <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97]">
              xưởng may đồng phục Univi
            </Link>
            , trang{' '}
            <Link href="/gioi-thieu" className="font-semibold text-[#105d97]">
              giới thiệu Univi
            </Link>{' '}
            và{' '}
            <Link href="/ho-so-nang-luc" className="font-semibold text-[#105d97]">
              hồ sơ năng lực
            </Link>{' '}
            để đối chiếu năng lực đã công bố với yêu cầu triển khai thực tế của mình.
          </p>
          <div className="mt-4 overflow-hidden border border-gray-200">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube.com/embed/0AABoh2a-Sk"
              title="Năng lực sản xuất đồng phục thể thao UNIVI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </article>

        {/* 13 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">13.</span>
            Ai Nên Đặt Sơ Mi Đồng Phục Doanh Nghiệp?
          </h2>
          <p className="text-base mb-3">
            Sơ mi đồng phục phù hợp nhất với doanh nghiệp cần một lớp trang phục nền cho toàn bộ khối văn phòng — nơi nhân sự thường xuyên tiếp xúc khách hàng, đối tác hoặc cần hình ảnh nhất quán trong công việc hằng ngày. Doanh nghiệp nên cân nhắc triển khai khi:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-base">
            <li>Đang xây dựng hoặc chuẩn hóa lại bộ nhận diện thương hiệu cho nhân sự văn phòng.</li>
            <li>Có nhiều phòng ban hoặc cơ sở cần cùng một chuẩn hình ảnh khi tiếp khách.</li>
            <li>Cần một trang phục có thể mặc rời hoặc phối cùng vest tùy theo bối cảnh.</li>
            <li>Đang chuẩn bị mở rộng nhân sự và cần hồ sơ mẫu chuẩn để đặt bổ sung lâu dài.</li>
          </ul>
        </article>

        {/* Kết luận */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">Kết Luận</h2>
          <p className="text-base">
            Sơ mi công sở đồng phục doanh nghiệp là một phần của hệ thống nhận diện, không chỉ là trang phục mặc trong ngày làm việc. Quyết định tốt cần kết nối bối cảnh sử dụng, vai trò nhân sự, form, chất liệu, màu sắc, quy trình duyệt mẫu và kế hoạch đặt bổ sung. Khi các yếu tố này được chuẩn hóa, sơ mi có thể hỗ trợ hình ảnh đội ngũ, trải nghiệm khách hàng và khả năng vận hành đồng bộ theo thời gian.
          </p>
        </article>

        {/* FAQ */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">14.</span>
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-2 mt-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-lg bg-white p-3">
                <summary className="cursor-pointer font-bold text-base text-gray-900">
                  {question}
                </summary>
                <p className="text-base mt-2">
                  {answer.includes('<link/>') ? (
                    <>
                      {answer.split('<link/>')[0]}
                      <Link href="/dong-phuc-gym" className="font-semibold text-[#105d97]">
                        đồng phục phòng gym
                      </Link>
                      {answer.split('<link/>')[1]}
                    </>
                  ) : (
                    answer
                  )}
                </p>
              </details>
            ))}
          </div>
        </article>

        {/* Đối tác Doanh nghiệp */}
        <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 mb-3 mt-4">
          <h2 className="text-xl md:text-xl font-bold mb-2 text-center text-gray-900">
            Đối Tác Doanh Nghiệp Đồng Hành Cùng Univi
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center mb-4">
            Các tập đoàn, doanh nghiệp và đối tác đã tin tưởng sản xuất đồng phục sơ mi tại Univi
          </p>
          <PartnersSection category="doanh-nghiep" />
        </section>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Đang Chuẩn Bị Brief May Sơ Mi Công Sở Doanh Nghiệp?
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Hãy tổng hợp logo, màu thương hiệu, số lượng, vai trò, bối cảnh sử dụng và yêu cầu đặt bổ sung trước khi gửi yêu cầu. <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> sẽ tư vấn cấu hình, kiểm tra khả năng phát triển mẫu và gửi báo giá theo đúng cấu hình đã thống nhất.
              </p>
              <p className="text-sm text-white mb-4">
                Liên hệ ngay với Univi để được tư vấn miễn phí và nhận báo giá theo cấu hình:
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
                Nhận tư vấn đồng phục sơ mi công sở
              </button>
              <p className="text-white mt-3 font-medium">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </p>
            </div>
          </div>
        </div>

        <ContactForm
          source="Sơ mi công sở đồng phục doanh nghiệp - Nhận tư vấn"
          isModal
          isOpen={isQuoteFormOpen}
          onClose={() => setIsQuoteFormOpen(false)}
        />
      </div>
    </div>
  );
}
