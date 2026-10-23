import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FabricCardComponent from '../FabricCardComponent';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';
import BangMauHero from '../bang-mau/BangMauHero';
import { fabrics } from '../../../data/fabrics';

const soSanhVest = [
  ['Mục tiêu', 'Thể hiện phong cách một người', 'Tạo hình ảnh thống nhất cho tổ chức'],
  ['Thiết kế', 'Theo gu và vóc dáng cá nhân', 'Theo nhận diện, vai trò và bối cảnh'],
  ['Màu sắc', 'Theo sở thích', 'Theo hệ màu thương hiệu và môi trường'],
  ['Size', 'Một người', 'Bảng size và cơ cấu nam/nữ'],
  ['Đặt bổ sung', 'Không phải ưu tiên', 'Cần lưu mẫu, màu, form và thông số'],
  ['Hình ảnh', 'Cá nhân', 'Corporate image và trải nghiệm khách hàng'],
];

const lyDoDauTuVest = [
  ['Tạo hình ảnh chuyên nghiệp tại điểm gặp khách hàng', 'Form vest, sơ mi và phụ kiện được thiết kế theo một bộ quy chuẩn, giúp nhân sự xuất hiện nhất quán trong cuộc họp, quầy lễ tân hoặc sự kiện. Vest không thể tự tạo ra niềm tin, nhưng một bộ đồng phục vừa vặn, sạch sẽ và đúng hoàn cảnh sẽ giúp hình ảnh của đội ngũ chỉn chu ngay từ đầu cuộc gặp — doanh nghiệp kiểm soát được ấn tượng đầu tiên thay vì lệ thuộc vào gu mặc cá nhân.'],
  ['Tăng tính nhất quán của thương hiệu', 'Màu, đường phối, phụ kiện và vị trí nhận diện được quy định chung để các phòng ban và cơ sở khác nhau vẫn có cùng ngôn ngữ thị giác. Đồng phục vest công sở không cần làm mọi người giống hệt nhau; sự nhất quán nên nằm ở hệ màu, chất liệu, tinh thần thiết kế và những chi tiết nhận diện được lựa chọn có chủ đích.'],
  ['Hỗ trợ trải nghiệm khách hàng', 'Vai trò được phân biệt bằng cấu hình vest, phụ kiện hoặc cách phối, giúp khách hàng dễ nhận biết lễ tân, tư vấn viên, quản lý và nhân sự sự kiện. Từ màu áo đến phụ kiện, mọi chi tiết nên giúp người mặc dễ được nhận diện mà không biến không gian thành một bảng quảng cáo.'],
  ['Hỗ trợ quản trị đồng phục', 'Khi có bảng size, mẫu chuẩn và hồ sơ cấu hình, HR có thể cấp phát cho nhân sự mới và đặt bổ sung gần với chuẩn ban đầu. Doanh nghiệp nên xem bộ vest là một phần của hệ thống đồng phục, không phải một đơn hàng dùng một lần — nếu dữ liệu mẫu không được lưu, chi phí ẩn sẽ xuất hiện ở các lần thay thế, tuyển mới và mở rộng chi nhánh.'],
  ['Tạo cảm giác gắn kết nội bộ', 'Một bộ quy chuẩn chung nhưng có thể phân vai linh hoạt giúp nhân sự nhận thấy mình đang đại diện cho cùng một tổ chức, làm hình ảnh đội ngũ nhất quán hơn trong hoạt động nội bộ, đối ngoại và truyền thông tuyển dụng.'],
];

const nganhPhuHop = [
  ['Ngân hàng', 'Giao dịch, tư vấn', 'Trang trọng, ổn định'],
  ['Tài chính, bảo hiểm', 'Gặp khách, hội thảo', 'Tin cậy, tiết chế'],
  ['Bất động sản', 'Tư vấn, mở bán', 'Cao cấp, có điểm nhấn'],
  ['Khách sạn', 'Lễ tân, tiếp khách', 'Thanh lịch, dễ nhận diện'],
  ['Nhà hàng', 'Quản lý, sự kiện', 'Chỉn chu, linh hoạt'],
  ['Giáo dục', 'Lễ khai giảng, sự kiện', 'Trang nhã, thân thiện'],
  ['Doanh nghiệp lớn', 'Hội nghị, đối ngoại', 'Corporate, đồng bộ'],
];

const sauPhongCach = [
  ['Tối giản hiện đại', 'Đường nét sạch, ít chi tiết, màu navy hoặc xám; phù hợp công nghệ, dịch vụ chuyên nghiệp và văn phòng trẻ.'],
  ['Thanh lịch', 'Tỷ lệ mềm, phụ kiện tiết chế; phù hợp khách sạn, giáo dục và tư vấn.'],
  ['Cao cấp', 'Chất liệu, cấu trúc và hoàn thiện được ưu tiên trước; phù hợp tiếp khách VIP, lãnh đạo và sự kiện.'],
  ['Trẻ trung', 'Form hiện đại, phối màu có điểm nhấn; phù hợp doanh nghiệp có văn hóa mở.'],
  ['Trang trọng', 'Màu trầm, phối sơ mi và cà vạt rõ quy chuẩn; phù hợp tài chính, hội nghị và đối ngoại.'],
  ['Nhận diện mạnh', 'Màu hoặc chi tiết thương hiệu được đưa vào có kiểm soát; phù hợp nơi cần tăng khả năng nhận biết từ xa.'],
];

const bangChatLieu = [
  ['UNI SUPER COOL', 'Mềm, mượt, mát, mịn', 'Hỗ trợ lưu thông không khí', 'Co giãn tốt, nhẹ', 'Yoga, Pilates, Fitness, PT'],
  ['UNI QUICK DRY', 'Nhẹ, nhanh khô', 'Hỗ trợ thoát ẩm nhanh', 'Dễ bảo quản, ít nhăn theo knowledge', 'Running, Gym, MMA, hoạt động ngoài trời'],
  ['UNI BLENDED', 'Mềm, nhẹ, cân bằng', 'Kết hợp đặc tính của sợi pha', 'Bền màu, chống nhăn theo knowledge', 'Đồng phục phòng tập, PT, Fitness'],
];

const formVest = [
  ['Regular', 'Khoảng mặc rộng hơn, dễ triển khai cho nhiều vóc dáng và phù hợp khi nhân sự cần vận động hoặc ngồi lâu.'],
  ['Modern', 'Cân bằng giữa gọn gàng và thoải mái, thường phù hợp với đội ngũ văn phòng và tư vấn.'],
  ['Slim', 'Đường nét ôm hơn, tạo hình ảnh hiện đại nhưng đòi hỏi bảng size, thử mẫu và kiểm soát sai số kỹ hơn.'],
];

const vaiTroNhanSu = [
  ['Lãnh đạo', 'Đối ngoại, tiếp khách VIP', 'Trang trọng, màu trầm', 'Vest, sơ mi, cà vạt hoặc khăn túi'],
  ['Quản lý', 'Họp, vận hành, tiếp khách', 'Modern, dễ vận động', 'Vest, sơ mi, quần tây'],
  ['Kinh doanh', 'Tư vấn, gặp đối tác', 'Gọn, linh hoạt', 'Vest, sơ mi, phụ kiện tiết chế'],
  ['Tư vấn viên', 'Giao tiếp thường xuyên', 'Dễ mặc trong thời gian dài', 'Vest, sơ mi, quần hoặc váy'],
  ['Lễ tân', 'Quầy tiếp đón', 'Nhận diện rõ, thanh lịch', 'Vest, chân váy/quần, bảng tên'],
  ['Đội sự kiện', 'Hội nghị, ra mắt', 'Có điểm nhấn thương hiệu', 'Vest, phụ kiện đồng bộ'],
];

const boiCanhPhongCach = [
  ['Văn phòng', 'Thanh lịch, thoải mái'],
  ['Gặp khách hàng', 'Chuyên nghiệp, dễ tạo tin cậy'],
  ['Hội nghị', 'Trang trọng, đồng nhất'],
  ['Sự kiện', 'Nhận diện rõ, dễ lên hình'],
  ['Lễ tân', 'Cao cấp, sạch và dễ nhận biết'],
  ['Tư vấn', 'Gọn, linh hoạt, thân thiện'],
  ['Tiếp khách VIP', 'Premium, phụ kiện tiết chế'],
];

const quyTrinh11Buoc = [
  ['Tiếp nhận brief', 'Về thương hiệu, vai trò, số lượng và bối cảnh.'],
  ['Tư vấn cấu hình', 'Xác định cấu hình vest và phân nhóm người mặc.'],
  ['Xác định nhận diện', 'Màu, logo, phụ kiện và mức độ trang trọng.'],
  ['Chọn chất liệu', 'Dựa trên mẫu vải, cảm giác mặc và yêu cầu giữ form.'],
  ['Chọn form và size', 'Form, bảng size và cách đo.'],
  ['Thiết kế mockup', 'Thống nhất chi tiết trước khi làm mẫu.'],
  ['Làm mẫu thực tế', 'Khi brief cần kiểm tra form hoặc vật liệu.'],
  ['Duyệt mẫu', 'Màu, form, logo, phụ kiện và bảng size.'],
  ['Chốt cấu hình', 'Số lượng, tiến độ và hạng mục kiểm tra.'],
  ['Sản xuất và QC', 'Đóng gói và bàn giao theo thỏa thuận.'],
  ['Lưu mẫu chuẩn', 'Bảng size và thông số để đặt bổ sung.'],
];

const yeuToChiPhi = [
  'Chất liệu và cấu trúc vải',
  'Form, số lớp và chi tiết may',
  'Áo vest, quần, váy và các hạng mục đi kèm',
  'Cúc, lót, ve, túi và phụ kiện',
  'Kỹ thuật logo, số vị trí và mức độ tùy biến',
  'Số lượng, cơ cấu size và tỷ lệ nam/nữ',
  'Mẫu thử, chỉnh sửa, QC, đóng gói và vận chuyển',
  'Nhu cầu đặt bổ sung, lưu mẫu và quản lý thông số',
];

const saiLamThuongGap = [
  ['Chỉ quan tâm giá', 'Giá không có ý nghĩa nếu chưa biết cấu hình. Hãy yêu cầu báo giá cùng một dòng vải, form, logo, số lượng và hạng mục giao hàng.'],
  ['Chọn mẫu trước khi xác định nhu cầu', 'Một mẫu đẹp trên ảnh có thể không phù hợp với lễ tân phải đứng lâu hoặc nhân viên kinh doanh di chuyển nhiều.'],
  ['Dùng một form cho tất cả', 'Nam, nữ, lãnh đạo, lễ tân và nhân sự sự kiện có thể cần các biến thể khác nhau trong cùng một hệ nhận diện.'],
  ['Không duyệt mẫu thật', 'Mockup không thể thay thế hoàn toàn việc kiểm tra chất liệu, màu, vai, tay và khả năng vận động.'],
  ['Không kiểm tra màu', 'Màu trên màn hình, mẫu in và vải thật có thể tạo cảm nhận khác nhau. Cần chốt mẫu vật lý hoặc tiêu chí được hai bên xác nhận.'],
  ['Logo quá lớn', 'Logo lớn không đồng nghĩa nhận diện cao cấp. Khoảng thở, vị trí và tỷ lệ thường quan trọng hơn kích thước tuyệt đối.'],
  ['Không đồng bộ phụ kiện', 'Vest chuẩn nhưng cà vạt, giày hoặc bảng tên lệch tinh thần vẫn làm tổng thể thiếu nhất quán.'],
  ['Không lưu thông số', 'Không lưu mẫu chuẩn khiến mỗi đợt đặt lại có nguy cơ thành một sản phẩm mới.'],
  ['Không tính nhu cầu đặt bổ sung', 'Hãy xác định từ đầu cách cấp phát cho nhân sự mới, thay thế và mở rộng chi nhánh.'],
];

const nangLucB2B = [
  ['Năng lực sản xuất', 'Univi công bố xưởng 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất 100.000 sản phẩm/tháng — nền tảng sản xuất trực tiếp cho các dự án cần điều phối nhiều hạng mục. Doanh nghiệp có thể trao đổi bài toán triển khai theo hệ thống thay vì chỉ mua từng sản phẩm rời.'],
  ['R&D chất liệu', 'Univi có hoạt động R&D về chất liệu, form dáng, hiệu suất và trải nghiệm người dùng; các dòng UNI DRY, UNI SUPER COOL, UNI QUICK DRY và UNI BLENDED. Brief có cơ sở hơn khi doanh nghiệp cần cân bằng hình ảnh, cảm giác mặc và chi phí sử dụng.'],
  ['Định vị B2B và giải pháp hệ thống', 'Univi định vị B2B và phát triển giải pháp đồng phục, trong đó có 2S Uniform cho hệ thống phòng tập. Doanh nghiệp có thể dùng tư duy phân vai, lưu chuẩn và đặt bổ sung khi xây corporate outfit.'],
];

const faqs = [
  [
    'Vest công sở đồng phục doanh nghiệp là gì?',
    'Vest công sở đồng phục doanh nghiệp là hệ trang phục vest được thiết kế và chuẩn hóa cho nhiều nhân sự theo cùng một nhận diện thương hiệu, đồng thời điều chỉnh form, cơ cấu size và cách phối theo vai trò sử dụng. Khác với vest cá nhân, vest doanh nghiệp cần duy trì tính nhất quán khi nhân sự thay đổi hoặc doanh nghiệp đặt bổ sung.'
  ],
  [
    'Vest doanh nghiệp khác vest cá nhân như thế nào?',
    'Vest cá nhân chủ yếu được lựa chọn theo vóc dáng, gu mặc và dịp sử dụng của một người. Vest doanh nghiệp phải giải quyết thêm bài toán nhận diện thương hiệu, nhiều người mặc, cơ cấu size, vai trò nhân sự, khả năng tái đặt và sự nhất quán giữa các đợt sản xuất.'
  ],
  [
    'Vest nam và nữ có cần giống nhau không?',
    'Không cần giống hệt nhau. Hai nhóm nên đồng bộ về màu sắc, chất liệu, ngôn ngữ thiết kế và mức độ trang trọng; form, rập và cách phối có thể được điều chỉnh để phù hợp tỷ lệ cơ thể và vai trò của người mặc.'
  ],
  [
    'Có thể thiết kế vest doanh nghiệp theo nhận diện thương hiệu không?',
    'Có. Màu sắc, ve áo, cúc, lót, đường phối, logo và các chi tiết nhận diện có thể được xây dựng theo hệ nhận diện thương hiệu. Khi thiết kế, nên ưu tiên những yếu tố đặc trưng nhưng vẫn giữ được sự cân bằng và tính trang trọng của vest công sở.'
  ],
  [
    'Nên chọn màu vest nào cho doanh nghiệp?',
    'Đen, navy, xám và xám than thường dễ triển khai trong môi trường công sở. Nếu doanh nghiệp có màu thương hiệu riêng, nên đánh giá màu đó trên vải thật và trong bối cảnh sử dụng trước khi chốt để đảm bảo hình ảnh chuyên nghiệp và khả năng phối lâu dài.'
  ],
  [
    'Có thể dùng màu thương hiệu làm màu vest không?',
    'Có thể xem xét, nhưng không phải màu thương hiệu nào cũng phù hợp làm màu chủ đạo cho toàn bộ vest. Doanh nghiệp nên đánh giá màu theo ngành nghề, khách hàng, môi trường sử dụng và khả năng phối với sơ mi, quần, chân váy hoặc phụ kiện.'
  ],
  [
    'Có thể gắn logo lên vest doanh nghiệp không?',
    'Có. Vị trí và kỹ thuật logo cần được lựa chọn theo chất liệu, kích thước logo, cấu trúc vest và mục tiêu nhận diện. Logo nên đủ rõ để nhận biết nhưng không làm mất sự cân bằng của thiết kế.'
  ],
  [
    'Nên chọn vest một hàng khuy hay hai hàng khuy?',
    'Việc lựa chọn phụ thuộc vào hình ảnh thương hiệu, vóc dáng người mặc và mức độ trang trọng mong muốn. Vest một hàng khuy thường dễ triển khai đồng bộ cho nhiều nhóm nhân sự; các cấu hình khác có thể được cân nhắc khi doanh nghiệp muốn tạo dấu ấn riêng.'
  ],
  [
    'Vest doanh nghiệp nên phối với sơ mi và quần như thế nào?',
    'Nên xây dựng thành một hệ phối hoàn chỉnh gồm vest, sơ mi, quần hoặc chân váy và phụ kiện. Màu sắc cần có độ tương phản phù hợp để tổng thể dễ nhận diện nhưng không bị rối, đặc biệt trong môi trường gặp khách hàng hoặc sự kiện.'
  ],
  [
    'Nên chọn chất liệu nào cho vest doanh nghiệp?',
    'Nên chọn chất liệu dựa trên môi trường sử dụng, thời tiết, tần suất mặc, yêu cầu về form dáng, cảm giác mặc và ngân sách. Với dự án B2B, doanh nghiệp nên kiểm tra mẫu vải và mẫu thực tế trước khi chốt số lượng lớn.'
  ],
  [
    'Có nên làm mẫu vest trước khi sản xuất hàng loạt không?',
    'Nên. Mockup giúp kiểm tra hình ảnh thiết kế, còn mẫu thực tế giúp đánh giá form, chất liệu, màu sắc, cấu trúc, logo và cách phối. Các thông số đã duyệt nên được lưu lại để làm mẫu đối chứng cho những lần sản xuất sau.'
  ],
  [
    'Có thể thiết kế vest riêng cho từng nhóm nhân sự không?',
    'Có thể giữ chung hệ nhận diện nhưng điều chỉnh cấu hình theo vai trò như quản lý, lễ tân, tư vấn viên hoặc nhân sự sự kiện. Cách này giúp doanh nghiệp phân vai rõ hơn mà vẫn duy trì một ngôn ngữ thương hiệu thống nhất.'
  ],
  [
    'Vest doanh nghiệp có phù hợp với lễ tân và đội ngũ đối ngoại không?',
    'Có. Vest phù hợp với các vị trí thường xuyên tiếp xúc khách hàng, đối tác hoặc đại diện thương hiệu khi được thiết kế phù hợp với vai trò, môi trường và mức độ trang trọng cần thiết. Phụ kiện và cách phối có thể được sử dụng để phân biệt từng nhóm nhân sự.'
  ],
  [
    'UNIVI có nhận may vest doanh nghiệp số lượng lớn không?',
    'Univi công bố năng lực sản xuất gồm xưởng 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất khoảng 100.000 sản phẩm mỗi tháng. Với vest công sở, cấu hình, số lượng, tiến độ và phạm vi sản xuất thực tế cần được xác nhận riêng theo từng dự án.'
  ],
  [
    'Chi phí may vest doanh nghiệp phụ thuộc vào yếu tố nào?',
    'Chi phí phụ thuộc vào chất liệu, cấu trúc vải, form, số lớp, áo vest, quần hoặc chân váy, cúc, lót, ve, túi, phụ kiện, kỹ thuật logo, số lượng, cơ cấu size, mẫu thử, QC, đóng gói, vận chuyển và yêu cầu tái đặt. Hai báo giá chỉ nên được so sánh khi cùng một cấu hình.'
  ],
  [
    'Có thể đặt lại cùng mẫu vest doanh nghiệp trong những lần sau không?',
    'Có thể thuận tiện tái đặt nếu doanh nghiệp lưu mẫu chuẩn, màu sắc, chất liệu, form, bảng size, vị trí logo và các thông số kỹ thuật. Việc lưu chuẩn giúp hạn chế sai khác giữa các đợt sản xuất khi doanh nghiệp tuyển thêm nhân sự hoặc mở rộng chi nhánh.'
  ],
  [
    'Quy trình đặt vest đồng phục doanh nghiệp gồm những bước nào?',
    'Quy trình có thể gồm tiếp nhận brief, tư vấn cấu hình, xác định nhận diện, chọn chất liệu, chọn form và size, thiết kế mockup, làm mẫu thực tế, duyệt mẫu, chốt cấu hình, sản xuất và kiểm tra chất lượng, sau đó lưu mẫu chuẩn để thuận tiện cho các lần đặt bổ sung.'
  ],
  [
    'UNIVI có giao vest đồng phục doanh nghiệp toàn quốc không?',
    'Univi cung cấp giải pháp đồng phục doanh nghiệp theo yêu cầu và hỗ trợ giao hàng theo từng dự án. Phương án giao hàng và tiến độ cụ thể cần được xác nhận theo số lượng, địa điểm nhận hàng và kế hoạch sản xuất của đơn hàng.'
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

export default function VestUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-xl mb-4 leading-6">
              Vest Công Sở
              <span className="text-yellow-300"> Đồng Phục Doanh Nghiệp Cao Cấp</span>
            </h2>
            <p className="text-base text-white">
              Khi nhân sự trực tiếp gặp khách hàng, đối tác hay xuất hiện tại một sự kiện, trang phục là thứ được nhìn thấy đầu tiên. Vest công sở đồng phục doanh nghiệp cao cấp không chỉ là chọn một bộ vest đẹp — mà phải phù hợp với nhận diện, vai trò người mặc và những tình huống nhân sự thường xuyên xuất hiện trước khách hàng.
            </p>
          </div>
        </div>

        {/* 1 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Vest Đồng Phục Doanh Nghiệp Là Gì?
          </h2>
          <p className="text-base mb-3">
            Vest công sở là trang phục có cấu trúc rõ ràng, thường gồm áo vest phối với sơ mi, quần tây hoặc chân váy. Vest cá nhân được chọn chủ yếu theo vóc dáng, gu mặc và dịp sử dụng của một người. Trong khi đó, vest đồng phục doanh nghiệp phải giải quyết bài toán ở cấp hệ thống: nhiều người mặc, nhiều vai trò, một ngôn ngữ thương hiệu và khả năng duy trì chuẩn khi nhân sự thay đổi.
          </p>
          <SimpleTable headers={['Tiêu chí', 'Vest cá nhân', 'Vest doanh nghiệp']} rows={soSanhVest} />
          <p className="text-base mt-3">
            Điểm khác biệt nằm ở cách chọn. Thay vì chỉ hỏi "mẫu nào đẹp?", doanh nghiệp nên xác định trước ai sẽ mặc, mặc ở đâu, cần truyền tải điều gì và bộ vest phải vận hành ra sao trong 12–24 tháng. Khi đã trả lời được các câu hỏi này, việc may vest đồng phục doanh nghiệp mới có cơ sở.
          </p>
        </article>
        <ArticleImage src="/vest-cong-so/vest-cong-so-dong-phuc-doanh-nghiep-cao-cap.jpg" alt="Vest công sở đồng phục doanh nghiệp cao cấp Univi" />

        {/* 2 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Vì Sao Doanh Nghiệp Đầu Tư Vest Đồng Phục?
          </h2>
          <BulletGrid items={lyDoDauTuVest} cols="md:grid-cols-1" />
        </article>
        <ArticleImage src="/vest-cong-so/vest-doanh-nghiep-theo-nganh.jpg" alt="Vest công sở tạo hình ảnh chuyên nghiệp và nhất quán cho doanh nghiệp" />

        {/* 3 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Doanh Nghiệp Nào Phù Hợp Với Vest Đồng Phục?
          </h2>
          <p className="text-base mb-3">
            Vest phù hợp nhất khi nhân sự thường xuyên xuất hiện trước khách hàng, đối tác hoặc công chúng. Không phải mọi vị trí đều cần mặc vest mỗi ngày; doanh nghiệp có thể xây dựng cấu hình theo vai trò và lịch sử dụng.
          </p>
          <SimpleTable headers={['Ngành / mô hình', 'Bối cảnh', 'Phong cách nên cân nhắc']} rows={nganhPhuHop} />
          <p className="text-base mt-3">
            Doanh nghiệp có thể bắt đầu với nhóm lễ tân, quản lý, kinh doanh và đội ngũ sự kiện trước. Các bộ phận ít gặp khách có thể dùng sơ mi, polo hoặc cấu hình nhẹ hơn để cân bằng tính trang trọng với tần suất sử dụng. Với tổ chức đang xây dựng hệ thống đồng phục, <Link href="/dong-phuc-the-thao" className="font-semibold text-[#105d97]">giải pháp đồng phục thể thao chuyên dụng</Link> có thể là tài liệu tham chiếu cho cách phân vai, dù cấu hình vest công sở cần được phát triển riêng.
          </p>
        </article>
        <ArticleImage src="/vest-cong-so/vest-nam-nu-dong-phuc-doanh-nghiep.jpg" alt="Mẫu vest công sở phù hợp theo ngành nghề và bối cảnh doanh nghiệp" />

        {/* 4 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Vest Nam Và Vest Nữ: Đồng Bộ Nhưng Không Rập Khuôn
          </h2>
          <p className="text-base mb-3">
            Nam và nữ không nhất thiết phải mặc cùng một kiểu mới gọi là đồng bộ. Điều cần thống nhất là màu, chất liệu, ngôn ngữ thiết kế và cấp độ trang trọng. Form, cấu trúc và cách phối cần tôn trọng khác biệt cơ thể, thói quen vận động và vai trò công việc.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2">4.1 Vest nam doanh nghiệp</h3>
              <p className="text-base">
                Với vest nam đồng phục công ty, doanh nghiệp cần xem xét tỷ lệ vai, độ thoải mái khi ngồi, chiều dài tay áo, độ cân bằng giữa áo và quần tây. Ve áo, số hàng khuy và cách phối cà vạt có thể làm tổng thể nghiêng về cổ điển, hiện đại hoặc trang trọng. Áo sơ mi nên tạo nền sạch để vest và màu thương hiệu phát huy tác dụng; cà vạt có thể dùng cho lãnh đạo, quản lý hoặc sự kiện quan trọng, còn ngày làm việc thường nhật có thể phối mở cổ nếu văn hóa cho phép.
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-2">4.2 Vest nữ doanh nghiệp</h3>
              <p className="text-base">
                Vest nữ đồng phục công ty có thể phối với quần tây hoặc chân váy. Form nên tạo cảm giác gọn gàng nhưng vẫn cho phép ngồi, di chuyển, đưa tay và làm việc trong thời gian dài. Chiết eo, chiều dài áo, độ mở ve và cách phối áo bên trong cần được thử trên các nhóm vóc dáng khác nhau — nên ưu tiên form vừa vặn và dễ mặc thay vì xem kiểu dáng quá ôm là mặc định của sự cao cấp.
              </p>
            </div>
          </div>
        </article>
        <ArticleImage src="/vest-cong-so/vest-nu-cho-doanh-nghiep.jpg" alt="Vest công sở nam nữ đồng bộ nhận diện thương hiệu doanh nghiệp" />

        {/* 5 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Kiểu Vest Và Phong Cách Thường Dùng
          </h2>
          <div className="space-y-3 mb-4">
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.1 Vest một hàng khuy</h3>
              <p className="text-base">Cấu trúc dễ ứng dụng, tạo cảm giác gọn và phù hợp với nhiều bối cảnh — thích hợp cho văn phòng, tư vấn khách hàng, hội họp và các chương trình cần sự linh hoạt. Khi chọn kiểu này, hãy tập trung vào tỷ lệ ve áo, chiều dài áo và khả năng phối với sơ mi.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.2 Vest hai hàng khuy</h3>
              <p className="text-base">Tạo cảm giác trang trọng và có trọng lượng thị giác rõ hơn — phù hợp với lãnh đạo, quản lý, tiếp khách VIP hoặc sự kiện corporate. Nếu nhân sự cần vận động nhiều hoặc môi trường làm việc thiên về casual, kiểu này nên được cân nhắc kỹ trước khi triển khai đại trà.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.3 Vest phối quần tây</h3>
              <p className="text-base">Cấu hình phổ biến cho nam và nữ vì cân bằng được tính chuyên nghiệp, khả năng di chuyển và sự linh hoạt khi cấp phát. Quần tây nên được xem như một phần của hệ thống, không chọn tách rời áo vest về màu, độ đứng form và cảm giác mặc.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.4 Vest phối chân váy</h3>
              <p className="text-base">Thường phù hợp với lễ tân, dịch vụ khách hàng, khách sạn và các vị trí cần hình ảnh thanh lịch. Chân váy cần có độ dài, độ ôm và độ thoải mái phù hợp thực tế công việc; không nên đánh đổi khả năng di chuyển để lấy một đường nét quá bó.</p>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold mb-1">5.5 Vest lễ tân và vest quản lý</h3>
              <p className="text-base">Vest lễ tân nên ưu tiên khả năng nhận diện, cảm giác mặc trong ca làm việc và sự hài hòa với không gian tiếp khách. Vest quản lý có thể trang trọng hơn ở ve áo, phụ kiện hoặc cấu trúc phối. Hai nhóm này nên cùng hệ màu nhưng không bắt buộc dùng đúng một mẫu.</p>
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2">5.6 Sáu phong cách phát triển mẫu</h3>
          <BulletGrid items={sauPhongCach} />
        </article>
        <ArticleImage src="/vest-cong-so/corporate-outfit-vest-doanh-nghiep.jpg" alt="Các kiểu vest công sở: một hàng khuy, hai hàng khuy, phối quần tây và chân váy" />

        {/* 6 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Chất Liệu, Form Và Màu Sắc
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">6.1 Chọn chất liệu theo trải nghiệm mặc</h3>
          <p className="text-base mb-3">
            Với các cấu hình có liên quan đến hệ sinh thái chất liệu Univi, có thể tham khảo các nguyên tắc sau:
          </p>
          <SimpleTable
            headers={['Dòng chất liệu', 'Cảm giác / đặc điểm', 'Thoáng khí và quản lý ẩm', 'Co giãn, bảo quản', 'Bối cảnh sử dụng']}
            rows={bangChatLieu}
          />
          <p className="text-base mt-3 mb-4">
            Một quy trình R&D tốt nên giải thích rõ thông số kỹ thuật bằng ngôn ngữ đời thường: vải thoáng nghĩa là người mặc ít cảm thấy bí hơn; vải có độ co giãn phù hợp nghĩa là dễ đưa tay, ngồi và di chuyển hơn; giữ form nghĩa là bộ vest duy trì dáng thiết kế sau quá trình sử dụng theo hướng dẫn bảo quản.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">6.2 Chọn form Regular, Modern hay Slim</h3>
          <BulletGrid items={formVest} />
          <p className="text-base mt-3 mb-4">
            Một bộ vest cao cấp không nhất thiết phải thật ôm. Mục tiêu đúng là đúng người + đúng vai trò + đúng môi trường. HR nên khảo sát nhóm người mặc trước, thay vì chỉ duyệt trên một người mẫu có vóc dáng đặc biệt.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">6.3 Màu sắc theo nhận diện thương hiệu</h3>
          <p className="text-base">
            Màu vest cần cân bằng bốn yếu tố: nhận diện thương hiệu, ngành nghề, khách hàng và bối cảnh. Đen tạo cảm giác trang trọng và dễ phối; navy giữ vẻ corporate nhưng thân thiện hơn; xám và xám than phù hợp môi trường cần sự ổn định; nâu hoặc màu trung tính có thể dùng khi thương hiệu muốn tạo cảm giác ấm và khác biệt. Nếu màu nhận diện quá sáng hoặc quá bão hòa, doanh nghiệp có thể đưa vào lớp lót, đường phối, khăn túi, cà vạt, nơ hoặc phụ kiện thay vì phủ toàn bộ áo. Trước khi chốt, nên đối chiếu màu trên mẫu vải thật dưới ánh sáng văn phòng và ánh sáng sự kiện.
          </p>
        </article>
        <BangMauHero fabrics={fabrics} />

        {/* 7 */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            Thiết Kế Nhận Diện Và Corporate Outfit
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Logo không cần đặt thật lớn mới tạo được nhận diện. Một hệ nhận diện cao cấp có thể nằm trong màu, tỷ lệ form, cúc, lót, ve áo, khăn túi, cà vạt, nơ và cách phối sơ mi. Vị trí logo cần cân nhắc kích thước, kỹ thuật thêu hoặc in, độ tương phản và khoảng thở quanh biểu tượng.
            </p>
            <p className="text-base">
              Một bộ trang phục hoàn chỉnh có thể gồm vest, sơ mi, quần hoặc chân váy, cà vạt hoặc nơ, giày và phụ kiện — vest tạo cấu trúc và cấp độ trang trọng; sơ mi tạo nền màu và cảm giác tiếp xúc với da; quần hoặc chân váy quyết định sự cân bằng hình thể và khả năng di chuyển; cà vạt, nơ, khăn túi tạo điểm nhận diện có thể thay đổi theo sự kiện; giày nên thống nhất về mức độ formal và màu cơ bản; bảng tên, kẹp cà vạt hoặc phụ kiện khác chỉ nên dùng khi thực sự hỗ trợ vai trò.
            </p>
            <p className="text-base">
              Khi thiết kế theo hệ thống, doanh nghiệp có thể tạo nhiều cách phối từ cùng một ngôn ngữ hình ảnh thay vì phải làm quá nhiều mẫu riêng. Khi cần mở rộng sang trang phục hoạt động hoặc sự kiện, có thể tham khảo <Link href="/giai-phap-2s" className="font-semibold text-[#105d97]">giải pháp 2S Uniform</Link> như một cách phân tầng theo nhóm người mặc; cấu hình vest vẫn cần brief riêng.
            </p>
          </div>
        </article>
        <ArticleImage src="/vest-cong-so/dong-phuc-vest-cong-so.jpg" alt="Corporate outfit đồng bộ vest, sơ mi và phụ kiện theo nhận diện thương hiệu" />

        {/* 8 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Vai Trò Và Bối Cảnh Sử Dụng
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">8.1 Theo vai trò nhân sự</h3>
          <div className="mb-4">
            <SimpleTable headers={['Vai trò', 'Bối cảnh', 'Form / màu', 'Phối đồ gợi ý']} rows={vaiTroNhanSu} />
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2">8.2 Theo bối cảnh</h3>
          <SimpleTable headers={['Bối cảnh', 'Phong cách phù hợp']} rows={boiCanhPhongCach} />
          <p className="text-base mt-3">
            Một doanh nghiệp có thể xây "tủ đồng phục" theo bối cảnh: bộ tiêu chuẩn cho văn phòng, bộ formal cho sự kiện và bộ nhận diện mạnh cho lễ tân hoặc activation. Cách này thường thực tế hơn việc bắt toàn bộ nhân sự mặc một cấu hình vest trong mọi ngày.
          </p>
        </article>
        <ArticleImage src="/vest-cong-so/dong-phuc-vest.jpg" alt="Vest công sở theo vai trò nhân sự và bối cảnh sử dụng trong doanh nghiệp" />

        {/* 9 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">9.</span>
            Bộ Sưu Tập, Bảng Màu Và Quy Trình
          </h2>
          <div className="space-y-3 mb-4">
            <p className="text-base">
              Doanh nghiệp có thể bắt đầu từ <Link href="/bo-suu-tap" className="font-semibold text-[#105d97]">bộ sưu tập đồng phục Univi</Link> để tham khảo form, cách phối màu và ngôn ngữ thiết kế trước khi phát triển mẫu riêng. Vai trò của bộ sưu tập là tham khảo → cân nhắc: giúp đội ngũ có ngôn ngữ chung khi trao đổi nội bộ, không phải để sao chép nguyên mẫu của đơn vị khác.
            </p>
            <p className="text-base">
              Marketing nên cung cấp màu chính, màu phụ, màu phối và màu phụ kiện qua <Link href="/bang-mau" className="font-semibold text-[#105d97]">bảng màu Univi</Link>. Procurement cần ghi rõ màu áp dụng cho từng hạng mục để báo giá không bị hiểu khác nhau. HR nên kiểm tra màu dưới môi trường văn phòng và sự kiện.
            </p>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2">9.3 Quy trình đặt may vest doanh nghiệp</h3>
          <p className="text-base mb-3">
            Quy trình dưới đây là khung triển khai đề xuất, cần xác nhận riêng theo brief và mẫu thực tế.
          </p>
          <NumberedList items={quyTrinh11Buoc} />
          <p className="text-base mt-3 mb-4">
            Khi làm việc với <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97]">xưởng may đồng phục thể thao Univi</Link>, doanh nghiệp nên xác nhận rõ hạng mục nào thuộc năng lực đã công bố và hạng mục nào cần phát triển riêng cho vest công sở.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">9.4 Vì sao phải duyệt mẫu trước sản xuất hàng loạt?</h3>
          <p className="text-base">
            Vest là sản phẩm mà sai form có thể ảnh hưởng trực tiếp đến hình ảnh doanh nghiệp. Mẫu duyệt cần kiểm tra: màu thật, vai, tay, chiều dài, độ cân đối khi cài khuy, logo, chất liệu, quần/chân váy và phụ kiện — hãy thử trên nhiều nhóm vóc dáng và thực hiện động tác ngồi, đưa tay, đi lại. Bản duyệt cũng nên ghi rõ phiên bản màu, vị trí logo, kỹ thuật hoàn thiện, bảng size và người phê duyệt, làm cơ sở để Procurement và nhà cung cấp cùng hiểu một sản phẩm, tránh tranh luận dựa trên ảnh mockup hoặc màn hình có màu hiển thị khác nhau.
          </p>
        </article>
        <ArticleImage src="/vest-cong-so/quy-trinh-len-mau.jpg" alt="Quy trình tư vấn, duyệt mẫu và sản xuất vest công sở doanh nghiệp" />

        {/* 10 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">10.</span>
            Chi Phí, Checklist Và Sai Lầm Cần Tránh
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">10.1 Chi phí may vest doanh nghiệp phụ thuộc vào đâu?</h3>

          <div className="grid gap-1 md:grid-cols-2 mb-4">
            {yeuToChiPhi.map((item) => (
              <div key={item} className="bg-white rounded-xl p-3">
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="text-base mb-4">
            Hai báo giá chỉ có ý nghĩa khi đặt trên cùng một cấu hình. Hãy dùng tư duy tổng chi phí sử dụng: chi phí ban đầu + chi phí thay thế + chi phí sửa sai + chi phí quản lý + rủi ro lệch chuẩn ở các đợt bổ sung. Một mẫu có giá thấp hơn nhưng nhanh mất form hoặc không có dữ liệu tái đặt có thể tạo tổng chi phí cao hơn.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">10.2 Checklist brief đặt vest</h3>
          <p className="text-base mb-4">
            Thương hiệu (logo vector, màu chính/phụ, quy chuẩn nhận diện, hình ảnh muốn truyền tải) — Nhân sự (số lượng, nam/nữ, vai trò, bộ phận, bảng size hiện có, nhóm cần may bổ sung) — Thiết kế (form, màu, ve, cúc, lót, quần, váy, sơ mi, cà vạt, nơ, khăn túi) — Sử dụng (văn phòng, gặp khách, hội nghị, lễ tân, sự kiện, tần suất mặc, điều kiện di chuyển) — Vận hành (deadline nội bộ, địa điểm giao, người duyệt mẫu, yêu cầu hóa đơn, kế hoạch tuyển mới và đặt bổ sung).
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">10.3 Những sai lầm thường gặp</h3>
          <BulletGrid items={saiLamThuongGap} />
        </article>
        <ArticleImage src="/images/gioi-thieu/che-do-hau-mai.jpg" alt="Checklist chi phí và brief đặt may vest công sở doanh nghiệp" />

        {/* 11 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">11.</span>
            Năng Lực B2B Của Univi Và Decision Framework
          </h2>
          <BulletGrid items={nangLucB2B} cols="md:grid-cols-1" />
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

        {/* Kết luận */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">Kết Luận</h2>
          <p className="text-base">
            Vest doanh nghiệp là một phần của hệ thống nhận diện, không chỉ là trang phục mặc trong ngày làm việc. Quyết định tốt cần kết nối bối cảnh sử dụng, vai trò nhân sự, form, chất liệu, màu, phụ kiện, quy trình duyệt mẫu và kế hoạch đặt bổ sung. Khi các yếu tố này được chuẩn hóa, vest có thể hỗ trợ hình ảnh đội ngũ, trải nghiệm khách hàng và khả năng vận hành đồng bộ.
          </p>
        </article>

        {/* FAQ */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">12.</span>
            Câu Hỏi Thường Gặp
          </h2>
          <div className="space-y-2 mt-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group rounded-lg bg-white p-3">
                <summary className="cursor-pointer font-bold text-base text-gray-900">
                  {question}
                </summary>
                <p className="text-base mt-2">{answer}</p>
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
            Các tập đoàn, doanh nghiệp và đối tác đã tin tưởng sản xuất đồng phục vest tại Univi
          </p>
          <PartnersSection category="doanh-nghiep" />
        </section>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Đang Chuẩn Bị Brief May Vest Công Sở Doanh Nghiệp?
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Hãy tổng hợp logo, màu thương hiệu, số lượng, vai trò, bối cảnh sử dụng và yêu cầu đặt bổ sung trước khi gửi yêu cầu. <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> sẽ tư vấn cấu hình đồng phục, kiểm tra khả năng phát triển mẫu và gửi báo giá theo đúng cấu hình đã thống nhất.
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
                Nhận tư vấn đồng phục vest công sở
              </button>
              <p className="text-white mt-3 font-medium">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </p>
            </div>
          </div>
        </div>

        <ContactForm
          source="Vest công sở đồng phục doanh nghiệp - Nhận tư vấn"
          isModal
          isOpen={isQuoteFormOpen}
          onClose={() => setIsQuoteFormOpen(false)}
        />
      </div>
    </div>
  );
}
