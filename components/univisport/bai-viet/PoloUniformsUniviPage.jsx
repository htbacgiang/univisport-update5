import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BangMauHero from '../bang-mau/BangMauHero';
import { fabrics } from '../../../data/fabrics';
import FabricCardComponent from '../FabricCardComponent';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';

const baLopGiaTri = [
  ['Polo truyền thống', 'Ưu tiên hình thức gọn gàng và nhận diện cơ bản - chỉ thêm màu thương hiệu, logo và quy cách size lên một chiếc áo cổ bẻ đơn giản.'],
  ['Polo doanh nghiệp', 'Chuẩn hóa màu, logo, form và cách mặc theo tổ chức, giúp đội ngũ đồng bộ hình ảnh trong môi trường công sở.'],
  ['Polo thể thao 2 trong 1', 'Bổ sung sự thoải mái, khả năng vận động và tính đa bối cảnh để một hệ đồng phục phục vụ nhiều điểm chạm: văn phòng, sự kiện và hoạt động ngoài trời.'],
];

const lyDoChonPolo = [
  ['Chỉn chu hơn áo thun', 'Cổ áo, nẹp nút hoặc đường khóa kéo tạo cấu trúc thị giác rõ hơn áo thun cổ tròn. Sự chỉn chu đến từ tổng hòa nhiều chi tiết: cổ cân với gương mặt, nẹp không vặn, vai không kéo căng, logo không quá lớn - không chỉ từ việc thêm logo lên một chiếc áo trơn.'],
  ['Thoải mái hơn sơ mi trong nhiều môi trường', 'Khi nhân viên di chuyển nhiều, làm việc tại sự kiện, hướng dẫn khách hoặc tham gia hoạt động tập thể, polo thường linh hoạt hơn sơ mi. Độ thoải mái vẫn cần được kiểm chứng bằng chất liệu và mẫu thử, không nên suy luận chỉ từ tên gọi "polo thể thao".'],
  ['Dễ nhận diện thương hiệu', 'Thân áo có đủ diện tích để phối màu, đặt logo ngực, logo tay hoặc thông tin lưng theo mức độ cần thiết. Với bộ nhận diện phức tạp, nên ưu tiên một chi tiết đặc trưng dễ lặp lại thay vì đưa toàn bộ tài liệu thương hiệu lên áo.'],
  ['Dễ dùng trong nhiều bối cảnh', 'Áo polo có thể chuyển từ công sở sang sự kiện bằng cách thay quần, giày, áo khoác hoặc phụ kiện. Team Building cần áo nhẹ và hỗ trợ vận động; gặp khách cần form và logo gọn hơn; ngoài trời cần quản lý hơi ẩm và trọng lượng.'],
  ['Kết hợp công sở và thể thao', 'Định hướng của Univi là nghiên cứu đồng phục thể thao chuyên dụng, vì vậy polo được nhìn từ cả hình ảnh doanh nghiệp và trải nghiệm vận động. Tham khảo thêm đồng phục thể thao chuyên dụng để thấy cách một hệ đồng phục được xây dựng quanh môi trường sử dụng thay vì chỉ quanh kiểu áo.'],
];

const baBoiCanh2Trong1 = [
  ['Corporate: văn phòng và gặp khách', 'Ưu tiên form cân đối, màu ổn định, logo rõ nhưng tiết chế, bề mặt vải ít nhăn và cảm giác mặc dễ chịu trong thời gian dài. UNI BLENDED là hướng có thể cân nhắc khi cần cân bằng giữa tính ứng dụng hằng ngày và hiệu năng vận động; cấu hình cuối cùng vẫn cần xác nhận theo mẫu.', '/polo-doanh-nghiep/ao-polo-van-phong.jpg', 'Áo polo doanh nghiệp cho văn phòng và gặp khách hàng'],
  ['Event: Team Building, du lịch và hội nghị', 'Áo cần giúp nhận diện nhóm nhanh từ khoảng cách nhất định - màu, vị trí logo và độ nhẹ của áo thường quan trọng hơn chi tiết trang trí phức tạp. Nếu hoạt động có vận động hoặc ngoài trời, UNI QUICK DRY phù hợp để xem xét vì nhẹ, nhanh khô và hỗ trợ thoát ẩm.', '/polo-doanh-nghiep/polo-teambuilding.png', 'Áo polo doanh nghiệp cho Team Building, du lịch và hội nghị'],
  ['Sport: Golf, Tennis, Pickleball và ngoài trời', 'Đòi hỏi người mặc xoay vai, vung tay, di chuyển liên tục hoặc tiếp xúc nắng nóng. Form, độ co giãn, độ thoáng và quản lý hơi ẩm cần được thử trong chuyển động thật - không nên lấy một mẫu công sở cứng rồi gọi đó là áo polo thể thao doanh nghiệp.', '/polo-doanh-nghiep/ao-polo-team.jpg', 'Áo polo thể thao cho Golf, Tennis, Pickleball và hoạt động ngoài trời'],
];

const bangChonTheoMucDich = [
  ['Văn phòng', 'Chỉn chu + thoải mái', 'Form cân đối, màu ổn định, vải dễ bảo quản'],
  ['Gặp khách', 'Nhận diện + chuyên nghiệp', 'Logo tiết chế, cổ và nẹp gọn, màu bám brand'],
  ['Team Building', 'Nhẹ + thoáng + vận động', 'Chất liệu nhẹ, hỗ trợ thoát ẩm, dễ phân nhóm'],
  ['Sự kiện', 'Nhận diện + dễ nhận biết', 'Màu tương phản vừa đủ, logo nhìn rõ từ xa'],
  ['Ngoài trời', 'Thoát ẩm + nhanh khô', 'UNI QUICK DRY hoặc cấu hình đã được tư vấn theo brief'],
  ['Golf/Tennis', 'Thoáng + co giãn', 'Thử chuyển động vai, form không cản tay'],
  ['Pickleball', 'Nhẹ + linh hoạt', 'Kiểm tra độ thoải mái khi xoay người và vung tay'],
];

const cacKieuPolo = [
  ['Polo trơn theo màu thương hiệu', 'Lựa chọn dễ triển khai, dễ phối, phù hợp doanh nghiệp muốn hình ảnh tối giản. Khác biệt nằm ở sắc độ màu, cổ, tay, logo và chất liệu - không đồng nghĩa với đơn điệu nếu hệ nhận diện được xây dựng có chủ đích.'],
  ['Polo phối màu', 'Đường phối ở vai, sườn, cổ hoặc tay tạo điểm nhận diện mạnh hơn, nhưng càng nhiều mảng màu thì yêu cầu kiểm soát màu và bố cục càng cao. Nên xác định màu chủ đạo, màu nhấn và màu trung tính trước khi chuyển thành mockup.'],
  ['Polo công sở', 'Ưu tiên bề mặt gọn, form dễ mặc và branding tiết chế - phù hợp nhân viên hành chính, kinh doanh, quản lý, lễ tân hoặc các vị trí giao tiếp thường xuyên.'],
  ['Polo thể thao', 'Hướng tới di chuyển và vận động nhiều hơn, cần quan tâm đường may, nách, vai, độ co giãn và khả năng thoát ẩm. Khi áp dụng cho doanh nghiệp, kiểu cổ cần được thống nhất theo mục đích và bộ nhận diện.'],
  ['Polo Team Building và polo sự kiện', 'Thường cần nhận diện nhanh, dễ phân nhóm và phù hợp ảnh tập thể. Có thể dùng màu bộ phận, tên đội hoặc một chi tiết tay áo, nhưng nên kiểm soát số lượng thông tin để áo vẫn dùng được sau sự kiện.'],
  ['Polo dành cho quản lý và theo bộ phận', 'Quản lý có thể dùng cùng màu với nhân viên nhưng khác cổ, đường phối hoặc vị trí tên. Các bộ phận có thể phân biệt bằng màu nhấn hoặc mã vai trò, trong khi logo thương hiệu vẫn giữ nguyên.'],
];

const chatLieuPolo = [
  ['UNI BLENDED', 'Dòng cân bằng giữa hiệu năng vận động và tính ứng dụng hằng ngày - có thể là Polyester + Polyamide hoặc Cotton + Polyester, với đặc điểm nhanh khô, mềm, mịn, mát, nhẹ và bền màu. Phù hợp cho văn phòng, lễ tân, quản lý, HLV và PT khi cần áo nhìn chỉn chu nhưng vẫn có thể di chuyển. Độ co giãn và trọng lượng cần được xác nhận theo cấu hình mẫu cụ thể.'],
  ['UNI SUPER COOL', 'Dòng cao cấp thành phần Polyamide, bề mặt mềm, mượt, mát và mịn; hỗ trợ giảm ma sát, co giãn tốt, trọng lượng nhẹ và thoáng khí. Phù hợp cân nhắc cho Golf, Fitness, PT và các môi trường cần sự mềm mại, linh hoạt. Nên kiểm tra độ rũ, độ đứng form và sắc độ màu trên mẫu polo hoàn chỉnh.'],
  ['UNI QUICK DRY', 'Định vị cho các bộ môn cần thoát ẩm nhanh và hoạt động ngoài trời - thành phần tham khảo là Polyester cao cấp, khoảng 82%–100% Polyester tùy cấu hình. Đặc điểm gồm nhanh khô, nhẹ, thoát ẩm tốt, chống bám bụi tốt. Phù hợp cho Team Building, Running, Cycling, Gym, Kickfit, Trekking và sự kiện ngoài trời.'],
  ['UNI DRY: công nghệ xử lý thoát ẩm', 'Là công nghệ, không phải tên một thành phần vải độc lập - kiểm soát chuyển động một chiều của hơi ẩm: mồ hôi đi từ bề mặt da qua lớp trong, ra lớp ngoài rồi bay hơi, hạn chế thấm ngược trở lại cơ thể. Hiệu quả cảm nhận còn phụ thuộc chất liệu nền, cấu trúc áo, thời tiết và cường độ vận động - không phải lời hứa áo luôn khô ngay lập tức trong mọi điều kiện.'],
];

const bangChonChatLieu = [
  ['UNI BLENDED', 'Mềm, mịn, cân bằng', 'Nhanh khô, hỗ trợ sử dụng thường xuyên', 'Văn phòng, quản lý, HLV, PT, đồng phục hằng ngày'],
  ['UNI SUPER COOL', 'Mềm, mượt, mát, mịn', 'Thoáng khí, dễ chịu khi tiếp xúc da', 'Golf, Fitness, PT, môi trường di chuyển nhiều'],
  ['UNI QUICK DRY', 'Nhẹ, thiên về vận động', 'Thoát ẩm tốt, nhanh khô', 'Team Building, Running, Gym, ngoài trời'],
  ['UNI DRY', 'Phụ thuộc chất liệu nền', 'Công nghệ hỗ trợ đưa hơi ẩm ra ngoài', 'Các hoạt động cần quản lý mồ hôi'],
];

const mauLogoForm = [
  ['Chọn màu áo theo hệ nhận diện', 'Doanh nghiệp nên tách ba quyết định: màu nền thân áo, màu phối ở cổ/tay/nẹp và màu logo. Trước khi chốt, hãy đối chiếu logo trên nền sáng và tối, kiểm tra khả năng đọc ở khoảng cách giao tiếp và xem màu dưới ánh sáng văn phòng lẫn ngoài trời.'],
  ['Logo ngực, tay, lưng và slogan', 'Logo ngực phù hợp nhận diện ở khoảng cách gần; logo tay thể hiện đơn vị hoặc bộ phận; logo lưng dễ nhìn trong ảnh tập thể. Slogan chỉ nên xuất hiện khi có vai trò rõ - quá nhiều logo và thông tin dễ biến áo thành bảng quảng cáo di động.'],
  ['In logo hay thêu logo?', 'In phù hợp logo nhiều màu, chi tiết mảnh hoặc cần giữ trọng lượng nhẹ. Thêu tạo cảm giác nổi, bền thị giác, hợp với polo công sở nhưng cần cân nhắc mật độ mũi thêu trên chất liệu mỏng hoặc co giãn. Quyết định nên dựa trên kích thước, số màu, vị trí, loại vải và tần suất giặt - hãy yêu cầu mẫu logo trên đúng chất liệu.'],
  ['Form Regular, Modern và Sport', 'Regular Fit dễ mặc, phù hợp nhiều vóc dáng và môi trường văn phòng. Modern Fit gọn hơn, hiện đại. Sport Fit ưu tiên chuyển động, cần thử với thao tác nâng tay, xoay vai, cúi người. "Cùng nhận diện – khác form" thường là phương án tốt: giữ chung màu, logo, quy tắc phối; điều chỉnh rập theo nam/nữ để nhân viên thực sự muốn mặc.'],
];

const nhomNguoiMac = [
  ['Nhân viên văn phòng', 'Ưu tiên cảm giác dễ chịu trong ngày làm việc, bề mặt gọn và form không quá ôm. UNI BLENDED là hướng nên xem xét nếu cần cân bằng giữa hình ảnh công sở và sử dụng thường xuyên.'],
  ['Kinh doanh và chăm sóc khách hàng', 'Cần logo dễ nhận diện trong giao tiếp nhưng không gây cảm giác phô trương. Cổ áo, nẹp và độ ổn định màu nên được duyệt kỹ vì đây là nhóm tiếp xúc trực tiếp với khách.'],
  ['Marketing và đội sự kiện', 'Có thể cần màu nổi hơn, logo lưng hoặc chi tiết phân nhóm. Nếu làm việc ngoài trời, UNI QUICK DRY là hướng phù hợp để trao đổi; mẫu vẫn cần được thử trong điều kiện vận động.'],
  ['Kỹ thuật và nhân viên cửa hàng', 'Ưu tiên độ bền, dễ bảo quản, dễ bổ sung size và phù hợp thao tác. Thiết kế cần hạn chế chi tiết dễ vướng hoặc dễ biến dạng khi sử dụng thường xuyên.'],
  ['Quản lý', 'Có thể dùng Modern Fit hoặc một đường phối tinh tế để tạo phân cấp mà không tách khỏi nhận diện chung - mục tiêu là dễ nhận diện vai trò nhưng vẫn thuộc cùng một hệ.'],
  ['Đội thể thao', 'Sport Fit, chất liệu nhẹ, độ thoáng và khả năng quản lý hơi ẩm là các yếu tố cần thử. Với hệ thống phòng tập, mô hình 2S Uniform giúp tư duy đồng bộ Staff Uniform và Member/Student Uniform theo một ngôn ngữ thương hiệu.'],
];

const quyTrinh7Buoc = [
  ['Tư vấn', 'Gửi mục đích sử dụng, nhóm người mặc, số lượng dự kiến và thời điểm cần hàng.'],
  ['Xác định nhu cầu', 'Khóa bối cảnh, màu, form, chất liệu, kỹ thuật logo và yêu cầu giao.'],
  ['Dựng mockup', 'Thể hiện mặt trước, sau, tay, cổ, logo và màu phối để các bên cùng duyệt.'],
  ['Gửi vải hoặc mẫu thực tế', 'Kiểm tra cảm giác, bề mặt, màu và độ phù hợp với môi trường.'],
  ['May mẫu', 'Đánh giá form nam/nữ, cổ, nẹp, đường may, logo và khả năng vận động.'],
  ['Sản xuất và QC', 'Đối chiếu với mẫu đã duyệt, kiểm soát size, màu, logo, số lượng và đóng gói.'],
  ['Bàn giao và lưu thông số', 'Lưu mã màu, rập, bảng size, vị trí logo và mẫu đối chứng để tái đặt.'],
];

const loiPhoBien = [
  ['Chỉ so giá', 'Đơn giá không có ý nghĩa nếu hai báo giá khác vải, form, kỹ thuật logo, đóng gói hoặc điều kiện giao. Hãy so trên cùng cấu hình.'],
  ['Chọn vải trước khi hiểu nhu cầu', 'Tên vải không thay thế cho môi trường sử dụng. Hãy mô tả nhân viên mặc ở đâu, vận động ra sao và tần suất thế nào.'],
  ['Không thử mẫu và không kiểm tra form', 'Ảnh đẹp không cho biết cổ có cấn, tay có kéo, thân có bí hay size nữ có phù hợp. Mẫu thật là bước kiểm soát rủi ro.'],
  ['Không lưu thông số', 'Không lưu mã màu, rập và logo khiến lần đặt sau phải làm lại từ đầu - đây là chi phí ẩn mà TCO cần tính đến.'],
  ['Đưa quá nhiều logo lên áo', 'Nhận diện hiệu quả cần có thứ tự ưu tiên. Logo chính, vai trò phụ và slogan nên được phân cấp rõ.'],
  ['Chỉ thiết kế cho một sự kiện', 'Nếu ngân sách cho phép, hãy thiết kế áo để sau Team Building vẫn có thể mặc ở hoạt động nội bộ hoặc ngày hội thương hiệu.'],
  ['Không phân biệt dữ liệu thật và ví dụ', 'Các con số về giá, tuổi thọ, tỷ lệ lỗi, thời gian khô, MOQ hay thời gian làm mẫu phải được xác nhận trước khi đưa vào brief hoặc nội dung thương mại.'],
];

const nhomThongTinBaoGia = [
  ['Người mặc', 'Số lượng, nam/nữ, bộ phận và bảng size dự kiến.'],
  ['Bối cảnh', 'Văn phòng, sự kiện, ngoài trời hay thể thao.'],
  ['Sản phẩm', 'Form, chất liệu, màu, cổ, nẹp và các chi tiết phối.'],
  ['Nhận diện', 'Logo, vị trí logo, kỹ thuật in/thêu và màu thương hiệu.'],
  ['Vận hành', 'Thời điểm cần hàng, địa điểm giao, đóng gói và nhu cầu đặt bổ sung.'],
];

const faqs = [
  [
    'Đồng phục áo polo doanh nghiệp là gì?',
    'Đồng phục áo polo doanh nghiệp là hệ áo polo được thiết kế và chuẩn hóa theo nhận diện thương hiệu, gồm màu sắc, logo, form áo, chất liệu và quy cách sử dụng. Polo có thể được cấu hình cho văn phòng, kinh doanh, lễ tân, sự kiện, Team Building hoặc hoạt động thể thao tùy nhu cầu của doanh nghiệp.'
  ],
  [
    'Vì sao doanh nghiệp nên chọn áo polo thay vì áo thun hoặc sơ mi?',
    'Áo polo tạo sự cân bằng giữa hình ảnh chỉn chu của trang phục công sở và sự linh hoạt khi vận động. So với áo thun, polo thường phù hợp hơn với môi trường giao tiếp và gặp khách hàng; so với sơ mi, polo dễ vận động và phù hợp hơn với các hoạt động ngoài văn phòng.'
  ],
  [
    'Áo polo thể thao 2 trong 1 là gì?',
    'Áo polo thể thao 2 trong 1 là định hướng thiết kế một hệ polo vừa giữ hình ảnh corporate vừa linh hoạt hơn khi tham gia sự kiện, Team Building và hoạt động vận động. Đây là định hướng cấu hình theo bối cảnh sử dụng, không phải claim rằng một mẫu áo phù hợp tuyệt đối với mọi bộ môn thể thao.'
  ],
  [
    'Nên chọn chất liệu nào cho áo polo doanh nghiệp?',
    'Nên chọn chất liệu dựa trên môi trường sử dụng, mức độ vận động, yêu cầu về độ thoáng, độ nhẹ, khả năng nhanh khô và cảm giác mặc. UNI BLENDED phù hợp bài toán cân bằng và sử dụng hằng ngày; UNI SUPER COOL thiên về mềm, mượt, mát, nhẹ; UNI QUICK DRY thiên về nhẹ, nhanh khô và sử dụng ngoài trời.'
  ],
  [
    'UNI DRY hoạt động như thế nào?',
    'UNI DRY là công nghệ hỗ trợ thoát ẩm, giúp kiểm soát chuyển động một chiều của hơi ẩm từ mặt da qua lớp trong, lớp ngoài rồi bay hơi ra môi trường. Hiệu quả cảm nhận còn phụ thuộc chất liệu nền, cấu trúc áo, thời tiết và cường độ vận động; UNI DRY không phải là một thành phần vải độc lập.'
  ],
  [
    'Nên in hay thêu logo trên áo polo doanh nghiệp?',
    'In phù hợp với logo nhiều màu hoặc các chi tiết cần giữ trọng lượng nhẹ; thêu tạo bề mặt nổi và cảm giác chắc hơn. Việc lựa chọn nên dựa trên đặc điểm logo, chất liệu, kích thước, vị trí đặt logo và mẫu thực tế trước khi sản xuất hàng loạt.'
  ],
  [
    'Có thể thiết kế form nam và nữ riêng không?',
    'Có thể thiết kế form nam và nữ riêng nhưng vẫn giữ chung hệ nhận diện thương hiệu. Việc điều chỉnh rập và bảng size theo nhóm người mặc giúp áo phù hợp hơn với tỷ lệ cơ thể và trải nghiệm sử dụng; bảng size và mẫu thử nên được duyệt trước khi sản xuất hàng loạt.'
  ],
  [
    'UNIVI có nhận may áo polo doanh nghiệp số lượng lớn không?',
    'Có. Năng lực thương mại được xác nhận gồm xưởng sản xuất 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất khoảng 100.000 sản phẩm mỗi tháng. Số lượng tối thiểu, tiến độ và cấu hình sản phẩm thực tế cần được xác nhận theo từng báo giá và yêu cầu của dự án.'
  ],
  [
    'Có được xem mẫu trước khi sản xuất hàng loạt không?',
    'Quy trình có thể bao gồm mockup, duyệt vải hoặc swatch, mẫu thực tế và mẫu đối chứng trước khi sản xuất hàng loạt. Phạm vi, chi phí và thời gian làm mẫu cần được xác nhận rõ trong báo giá của từng dự án.'
  ],
  [
    'Chi phí may áo polo doanh nghiệp phụ thuộc vào yếu tố nào?',
    'Chi phí phụ thuộc vào chất liệu, form áo, số lượng, màu sắc, kỹ thuật in hoặc thêu logo, mức độ hoàn thiện, yêu cầu làm mẫu, đóng gói, phân loại, giao hàng và các yêu cầu đặc biệt khác. Doanh nghiệp nên so sánh báo giá trên cùng một cấu hình sản phẩm để đánh giá chính xác.'
  ],
  [
    'Có thể dùng áo polo doanh nghiệp cho Team Building, Golf hoặc Pickleball không?',
    'Có thể thiết kế áo polo cho các bối cảnh này, nhưng chất liệu, form và chi tiết kỹ thuật cần được lựa chọn theo chuyển động và môi trường sử dụng. Mỗi hoạt động nên có brief riêng về thời tiết, cường độ và thời lượng vận động thay vì sử dụng một cấu hình áo cho mọi bộ môn.'
  ],
  [
    'Áo polo doanh nghiệp có thể thiết kế theo nhận diện thương hiệu không?',
    'Có. Màu áo, màu phối, cổ áo, tay áo, logo, slogan và các chi tiết nhận diện có thể được xây dựng theo hệ nhận diện của doanh nghiệp. Với bộ nhận diện phức tạp, nên ưu tiên những yếu tố đặc trưng và có khả năng duy trì nhất quán trên toàn bộ đồng phục.'
  ],
  [
    'Nên chọn polo công sở hay polo thể thao cho doanh nghiệp?',
    'Nên lựa chọn theo môi trường sử dụng. Polo công sở phù hợp với nhân viên văn phòng, kinh doanh, quản lý và các vị trí thường xuyên giao tiếp; polo thể thao phù hợp hơn với đội ngũ vận động nhiều, hoạt động ngoài trời, Team Building hoặc doanh nghiệp muốn kết hợp đồng phục corporate với hoạt động thể thao.'
  ],
  [
    'Có thể sử dụng cùng một mẫu polo cho nhiều nhóm nhân sự không?',
    'Có thể giữ chung màu sắc, logo và hệ nhận diện nhưng điều chỉnh form, bảng size hoặc cấu hình áo theo từng nhóm nhân sự. Cách này giúp doanh nghiệp duy trì hình ảnh đồng bộ nhưng vẫn đáp ứng khác biệt về vóc dáng, vai trò và môi trường sử dụng.'
  ],
  [
    'Có thể đặt lại cùng mẫu áo polo trong những lần sau không?',
    'Có thể thuận tiện tái đặt nếu thông số sản phẩm được chuẩn hóa và lưu lại từ đơn hàng trước. Doanh nghiệp nên lưu màu, chất liệu, form, bảng size, quy cách logo và các thông số kỹ thuật để đảm bảo tính nhất quán khi đặt bổ sung hoặc mở rộng số lượng.'
  ],
  [
    'Thời gian sản xuất áo polo doanh nghiệp là bao lâu?',
    'Thời gian sản xuất phụ thuộc vào số lượng, mức độ tùy chỉnh, chất liệu, quá trình duyệt mẫu và kế hoạch sản xuất của từng đơn hàng. Tiến độ cụ thể nên được xác nhận sau khi doanh nghiệp chốt cấu hình sản phẩm và mẫu duyệt.'
  ],
  [
    'UNIVI có giao áo polo doanh nghiệp toàn quốc không?',
    'Có. Univi cung cấp giải pháp áo polo doanh nghiệp theo yêu cầu và giao hàng toàn quốc. Phương án giao hàng và tiến độ cụ thể được xác nhận theo số lượng, địa điểm nhận hàng và kế hoạch của từng đơn hàng.'
  ]
];
function BulletGrid({ items, cols = 'md:grid-cols-2' }) {
  return (
    <div className={`grid gap-1 ${cols}`}>
      {items.map(([title, text]) => (
        <div key={title} className="bg-white rounded-xl ">
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

function SubsectionWithImage({ number, title, text, image, alt }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-lg md:text-xl font-bold mb-2">
        <span className="text-[#105d97] mr-1">{number}</span> {title}
      </h3>
      <p className="text-base mb-3">{text}</p>
      <figure className="overflow-hidden">
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

export default function PoloUniformsUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-xl mb-4 leading-6">
              Đồng Phục Áo Polo Doanh Nghiệp
              <span className="text-yellow-300"> Giải Pháp Polo 2 Trong 1 Cho Công Ty</span>
            </h2>
            <p className="text-base text-white">
              Lịch sự chốn văn phòng – Năng động khi ra sân. Một hệ thống áo polo doanh nghiệp có thể đi từ văn phòng, gặp khách hàng, sự kiện, Team Building, du lịch doanh nghiệp đến Golf, Tennis, Pickleball và hoạt động ngoài trời mà vẫn giữ nhận diện thống nhất.
            </p>
          </div>
        </div>

        {/* 1 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Áo Polo Doanh Nghiệp Đang Thay Đổi Như Thế Nào?
          </h2>
          <p className="text-base mb-3">
            Polo truyền thống thường là một chiếc áo cổ bẻ, thân áo đơn giản, dùng trong môi trường có mức độ trang trọng vừa phải. Cách làm cũ vẫn hữu ích nhưng chưa giải quyết hết bài toán vận hành hiện đại: một đội ngũ có thể làm việc tại văn phòng buổi sáng, tiếp khách buổi chiều và tham gia hoạt động ngoài trời cuối tuần. Vì vậy, áo polo doanh nghiệp đang chuyển qua ba lớp giá trị:
          </p>
          <BulletGrid items={baLopGiaTri} cols="md:grid-cols-1" />
          <p className="text-base mt-3">
            Điều quan trọng là doanh nghiệp xác định tỷ trọng giữa công sở, sự kiện và vận động, rồi chọn chất liệu, cổ áo, đường phối, form cùng kỹ thuật logo tương ứng.
          </p>
        </article>
        <ArticleImage src="/images/dong-phuc-ao-polo.jpg" alt="Đồng phục áo polo doanh nghiệp Univi cho văn phòng và sự kiện" />

        {/* 2 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Vì Sao Áo Polo Phù Hợp Làm Đồng Phục Doanh Nghiệp?
          </h2>
          <BulletGrid items={lyDoChonPolo} cols="md:grid-cols-1" />
        </article>
        <ArticleImage src="/polo-doanh-nghiep/dong-phuc-polo-doanh-nghiep.png" alt=" Áo polo doanh nghiệp Univi phù hợp làm đồng phục công ty" />

        {/* 3 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Polo Thể Thao 2 Trong 1 Là Gì?
          </h2>
          <p className="text-base mb-3">
            Polo thể thao 2 trong 1 là cách thiết kế áo polo doanh nghiệp để cùng lúc đáp ứng hai nhóm yêu cầu: hình ảnh corporate và sự linh hoạt của sportswear. "2 trong 1" không phải một claim kỹ thuật về việc chiếc áo thay đổi cấu trúc, mà là một định hướng giải pháp: cùng hệ nhận diện có thể được triển khai cho công việc, sự kiện và vận động.
          </p>
          <div className="space-y-6">
            {baBoiCanh2Trong1.map(([title, text, image, alt], index) => (
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
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Chọn Áo Polo Theo Bối Cảnh Và Kiểu Dáng
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">4.1 Bảng chọn theo mục đích sử dụng</h3>
          <div className="overflow-x-auto border border-gray-200 mb-4">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Nhu cầu</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Ưu tiên</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Gợi ý xem xét</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {bangChonTheoMucDich.map(([nhuCau, uuTien, goiY]) => (
                  <tr key={nhuCau}>
                    <td className="px-4 py-3 align-top font-semibold text-gray-900">{nhuCau}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{uuTien}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{goiY}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-base mb-4">
            Bảng trên là khung ra quyết định, không phải bảng thông số cố định cho mọi đơn hàng. Cùng một chất liệu có thể cho cảm giác khác nhau tùy định lượng, cấu trúc dệt và kiểu may. Doanh nghiệp nên duyệt swatch, mẫu thực tế và bảng size trước khi sản xuất hàng loạt.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">4.2 Các kiểu áo polo đồng phục doanh nghiệp</h3>
          <BulletGrid items={cacKieuPolo} />
          <p className="text-base mt-3">
            Doanh nghiệp chưa có hình dung rõ về phong cách có thể bắt đầu từ <Link href="/bo-suu-tap" className="font-semibold text-[#105d97]">Bộ sưu tập áo polo doanh nghiệp</Link> để so sánh form, màu, kiểu phối và cách ứng dụng. Sau khi xác định được hướng thiết kế, doanh nghiệp có thể chuyển sang <Link href="/bang-mau" className="font-semibold text-[#105d97]">Bảng màu Univi</Link> để đối chiếu màu áo, màu phối và phương án triển khai theo nhận diện.
          </p>
        </article>
        <ArticleImage src="/images/dong-phuc-cong-so.webp" alt="Các kiểu áo polo doanh nghiệp: trơn, phối màu, công sở và thể thao" />

        {/* 5 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Chất Liệu Và Công Nghệ Cho Áo Polo Doanh Nghiệp
          </h2>
          <p className="text-base mb-3">
            Khi đánh giá chất liệu may áo polo doanh nghiệp, hãy hỏi năm câu: bề mặt chạm vào da ra sao; áo có thoáng trong môi trường thực tế không; hơi ẩm được xử lý như thế nào; độ co giãn có phù hợp chuyển động không; và bối cảnh sử dụng tốt nhất là gì. "Mát" hay "thể thao" chỉ là mô tả rộng, không thay thế cho việc thử mẫu.
          </p>
          <BulletGrid items={chatLieuPolo} cols="md:grid-cols-1" />
          <h3 className="text-lg md:text-xl font-bold mb-2 mt-4">Bảng chọn chất liệu theo nhu cầu</h3>
          <div className="overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Chất liệu</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Cảm giác</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Độ thoáng / hơi ẩm</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Môi trường phù hợp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {bangChonChatLieu.map(([vai, camGiac, thoang, moiTruong]) => (
                  <tr key={vai}>
                    <td className="px-4 py-3 align-top font-semibold text-gray-900">{vai}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{camGiac}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{thoang}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{moiTruong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-base mt-3">
            Univi ưu tiên kiểm định độc lập các chất liệu theo tiêu chí như formaldehyde và amin thơm chuyển hóa từ thuốc nhuộm Azo. Procurement nên yêu cầu tài liệu áp dụng cho đúng lô hoặc cấu hình khi hồ sơ chất lượng là điều kiện bắt buộc của doanh nghiệp. Tham khảo thêm <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97]">công nghệ UNI DRY</Link> trước khi chọn vải.
          </p>
        </article>
        <FabricCardComponent />
        {/* 6 */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Màu Sắc, Logo Và Form Áo Theo Nhận Diện
          </h2>
          <BulletGrid items={mauLogoForm} />
          <p className="text-base mt-3">
            Doanh nghiệp có thể tham khảo <Link href="/bang-mau" className="font-semibold text-[#105d97]">Bảng màu Univi</Link> để lựa chọn màu áo, màu phối và phương án triển khai phù hợp với nhận diện thương hiệu.
          </p>
        </article>
        <BangMauHero fabrics={fabrics} />

        {/* 7 */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            TCO Và Cấu Hình Theo Nhóm Người Mặc
          </h2>
          <p className="text-base mb-3">
            TCO, hay Total Cost of Ownership, là tổng chi phí sở hữu trong suốt quá trình sử dụng - không chỉ giá mua ban đầu mà còn gồm khả năng áo được mặc thường xuyên, số lần thay, lỗi size, hỏng logo, chi phí đặt bù, đóng gói, quản lý dữ liệu và rủi ro mỗi chi nhánh dùng một thông số. Khi so sánh báo giá, hãy yêu cầu các nhà cung cấp báo cùng cấu hình: vải, form, số lượng, logo, mẫu, đóng gói, giao hàng, điều kiện đặt bổ sung và tài liệu chất lượng.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">Theo nhóm nhân sự</h3>
          <BulletGrid items={nhomNguoiMac} />
        </article>
        <ArticleImage src="/polo-doanh-nghiep/ao-polo-phong-cach-doanh-nghiep.jpg" alt="Áo polo doanh nghiệp theo nhóm nhân sự và hoạt động Team Building" />

        {/* 8 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Polo Theo Ngành Và Hoạt Động Thể Thao
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Doanh nghiệp công nghệ thường hợp với polo tối giản và form hiện đại; tài chính – ngân hàng cần cảm giác chuẩn mực, logo tiết chế; bất động sản, giáo dục và du lịch cần áo chuyển tốt giữa văn phòng, tư vấn và sự kiện. Nhà hàng – dịch vụ và chuỗi cửa hàng nên ưu tiên nhận diện từ xa, dễ phân biệt vai trò và dễ đặt bổ sung. Sản xuất cần cân nhắc môi trường, thao tác, độ bền và quy định an toàn; polo không thay thế trang phục bảo hộ.
            </p>
            <p className="text-base">
              Với phòng tập và Fitness Center, polo có thể dành cho quản lý, lễ tân, HLV hoặc sự kiện cộng đồng - tham khảo thêm <Link href="/dong-phuc-fitness-center" className="font-semibold text-[#105d97]">đồng phục Fitness Center</Link> và <Link href="/dong-phuc-pt" className="font-semibold text-[#105d97]">đồng phục PT</Link> để mở rộng hệ theo vai trò thay vì dùng một mẫu cho tất cả.
            </p>
            <p className="text-base">
              Golf cần polo có vẻ ngoài gọn, thoáng và đủ linh hoạt cho động tác xoay thân. Tennis và Pickleball đòi hỏi chuyển động vai, cánh tay và thân người; mẫu phải được thử khi vung tay, xoay người và di chuyển ngang - tham khảo <Link href="/dong-phuc-pickleball" className="font-semibold text-[#105d97]">đồng phục Pickleball</Link> để xem cách triển khai theo CLB. Gym và Fitness có cường độ vận động đa dạng, có thể tham khảo <Link href="/dong-phuc-gym" className="font-semibold text-[#105d97]">đồng phục Gym</Link>. Running ưu tiên nhẹ và quản lý hơi ẩm, trong khi Team Building cần nhận diện nhóm và dễ mặc.
            </p>
          </div>
        </article>
        <ArticleImage src="/polo-doanh-nghiep/dong-phuc-le-tan.jpg" alt="Áo polo doanh nghiệp cho Golf, Tennis, Pickleball và hoạt động thể thao" />

        {/* 9 */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">9.</span>
            Quy Trình Đặt May, Duyệt Mẫu Và Triển Khai B2B
          </h2>
          <p className="text-base mb-3">
            Quy trình có thể điều chỉnh theo đơn hàng. Không nên tự mặc định thời gian, MOQ hay chính sách mẫu nếu chưa có báo giá và xác nhận bằng văn bản.
          </p>
          <NumberedList items={quyTrinh7Buoc} />
          <p className="text-base mt-3">
            Mockup trả lời "áo sẽ trông như thế nào?", còn mẫu thật trả lời "áo mặc có ổn không?". HR kiểm tra size; Brand kiểm tra nhận diện; Procurement kiểm tra thông số, số lượng và khả năng tái đặt.
          </p>
          <p className="text-base mt-3">
            Năng lực thương mại của Univi xác nhận xưởng sản xuất 2.000 m² tại phường Chương Mỹ, Hà Nội, công suất 100.000 sản phẩm/tháng và kinh nghiệm 9+ năm - nền tảng để triển khai các dự án B2B cần quy trình rõ và sản lượng, không phải cam kết tiến độ cho mọi đơn hàng. Xem thêm <Link href="/gioi-thieu" className="font-semibold text-[#105d97]">giới thiệu Univi</Link> và <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97]">xưởng sản xuất đồng phục Univi</Link> để đánh giá năng lực theo hồ sơ hiện có.
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

        {/* 10 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">10.</span>
            Năng Lực Triển Khai, Brief Và Các Lỗi Cần Tránh
          </h2>
          <p className="text-base mb-3">
            Đơn hàng nhiều chi nhánh cần một bảng dữ liệu duy nhất: tên nhân sự, bộ phận, giới tính, size, màu, vị trí nhận diện và điểm giao. Đặt bổ sung cần dựa trên mẫu đối chứng và thông số đã lưu - nếu thay vải, màu hoặc rập mà không ghi nhận, lô sau có thể lệch cảm giác và hình ảnh so với lô đầu.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">Checklist brief đặt áo polo</h3>
          <p className="text-base mb-3">
            Thương hiệu (logo gốc, màu chủ đạo, màu nhấn, slogan và vùng an toàn logo) - Nhân sự (số lượng theo màu, nam/nữ, bộ phận, vai trò, bảng size, môi trường mặc) - Sản phẩm (Regular/Modern/Sport Fit, chất liệu, màu thân/cổ/tay/nẹp, vị trí và kỹ thuật logo) - Vận hành (deadline, địa điểm giao, cách chia gói, nhu cầu lưu mẫu và đặt bổ sung) - Ngân sách (mức dự kiến theo cấu hình, ưu tiên giữa cảm giác mặc, hiệu năng, độ bền và thời gian giao).
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">Những sai lầm phổ biến</h3>
          <BulletGrid items={loiPhoBien} />
        </article>
        <ArticleImage src="/images/gioi-thieu/nang-luc-san-xuat.jpg" alt="Năng lực sản xuất và triển khai B2B áo polo doanh nghiệp tại Univi" />

        {/* 11 */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">11.</span>
            Bộ Sưu Tập, Bảng Màu, Cấu Hình Và Chi Phí
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Nếu chưa biết bắt đầu từ form trơn, phối màu hay polo thể thao, hãy xem <Link href="/bo-suu-tap" className="font-semibold text-[#105d97]">Bộ sưu tập đồng phục Univi</Link> để hình dung cách phối, sau đó mới lọc theo ngành, bối cảnh và nhóm người mặc. Đây là bước tham khảo, không thay thế tư vấn cấu hình riêng.
            </p>
            <p className="text-base">
              Màu sắc cần được kiểm tra trên vải, dưới ánh sáng và cạnh logo thật. Hãy tham khảo <Link href="/bang-mau" className="font-semibold text-[#105d97]">bảng màu đồng phục</Link> để chọn màu áo, màu phối và phương án triển khai phù hợp với nhận diện.
            </p>
          </div>
          <h3 className="text-lg md:text-xl font-bold mb-2 mt-4">Trước khi hỏi giá, hãy chốt cấu hình</h3>
          <p className="text-base mb-3">
            Một yêu cầu báo giá càng rõ thì khả năng so sánh giữa các nhà cung cấp càng cao. Tối thiểu nên chốt năm nhóm thông tin:
          </p>
          <BulletGrid items={nhomThongTinBaoGia} />
          <p className="text-base mt-3 mb-3">
            Khi năm nhóm thông tin này đã rõ, doanh nghiệp có thể so sánh đúng cấu hình thay vì chỉ so một con số đơn giá.
          </p>
          <div className="space-y-3">
            <p className="text-base">
              Chi phí phụ thuộc loại chất liệu và cấu trúc vải; form, cổ, nẹp, bo và đường phối; số lượng theo màu, size và bộ phận; kỹ thuật logo, số vị trí và dữ liệu tên riêng; làm mẫu, đóng gói, phân loại và giao hàng; cùng các yêu cầu đặc biệt về tiến độ, hồ sơ hoặc tái đặt. Không nên công bố một giá chung khi chưa biết cấu hình - hãy gửi logo, số lượng, nhóm người mặc và bối cảnh sử dụng qua <Link href="/lien-he" className="font-semibold text-[#105d97]">liên hệ Univi</Link> để nhận tư vấn và báo giá theo yêu cầu.
            </p>
          </div>
        </article>
        <ArticleImage src="/polo-doanh-nghiep/dong-phuc-ao-polo-nam-nu.png" alt="Bộ sưu tập áo polo doanh nghiệp nam nữ và đa dạng cấu hình  " />

        {/* Kết luận */}
        <article className="bg-white mb-3 mt-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">Kết Luận</h2>
          <p className="text-base">
            Đồng phục áo polo doanh nghiệp có giá trị nhất khi được xem như một hệ thống: cùng nhận diện, khác cấu hình theo người mặc và bối cảnh. Polo thể thao 2 trong 1 giúp doanh nghiệp nối văn phòng với sự kiện, Team Building, du lịch và hoạt động thể thao mà không biến đồng phục thành một chiếc áo chỉ dùng một lần. Lựa chọn đúng cần bắt đầu từ môi trường sử dụng, sau đó mới đến vải, form, màu, logo, mẫu thử và TCO. Cấu hình, tiến độ và điều kiện thương mại cuối cùng vẫn cần được xác nhận cho từng dự án.
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
            Các tập đoàn, doanh nghiệp và đối tác đã tin tưởng sản xuất đồng phục polo tại Univi
          </p>
          <PartnersSection category="doanh-nghiep" />
        </section>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Nhận Tư Vấn Áo Polo Doanh Nghiệp
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Gửi logo, số lượng, nhóm người mặc, môi trường sử dụng và mục đích triển khai. <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> sẽ tư vấn phương án kiểu dáng, màu sắc và chất liệu phù hợp, đồng thời hướng dẫn các bước mockup, mẫu thử và báo giá theo cấu hình thực tế.
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
                Nhận tư vấn đồng phục áo polo
              </button>
              <p className="text-white mt-3 font-medium">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </p>
            </div>
          </div>
        </div>

        <ContactForm
          source="Đồng phục áo polo doanh nghiệp - Nhận tư vấn"
          isModal
          isOpen={isQuoteFormOpen}
          onClose={() => setIsQuoteFormOpen(false)}
        />
      </div>
    </div>
  );
}
