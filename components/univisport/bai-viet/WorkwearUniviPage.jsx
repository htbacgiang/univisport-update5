import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';

const lyDoCanDongPhuc = [
  ['Hỗ trợ bảo vệ người lao động', 'Trang phục phù hợp giúp người mặc dễ thao tác, giảm bất tiện do nóng bí hoặc form không phù hợp. Đây là lợi ích về thiết kế và trải nghiệm mặc, không phải chứng nhận bảo vệ trước một mối nguy cụ thể. Nếu môi trường yêu cầu chống cháy, chống điện, chống hóa chất, chống cắt hoặc chống tĩnh điện, doanh nghiệp cần yêu cầu hồ sơ kỹ thuật tương ứng.'],
  ['Nhận diện nhân sự và phân biệt bộ phận', 'Nhân sự vận hành, kỹ thuật, kho, bảo trì và giám sát có thể dùng cùng ngôn ngữ thương hiệu nhưng khác màu phối, viền, bảng tên hoặc vị trí logo, giúp người mới và khách tham quan nhận biết vai trò nhanh hơn.'],
  ['Hỗ trợ quản lý tại nhà máy và công trường', 'Khi mỗi nhóm có quy ước rõ ràng, việc cấp phát, kiểm kê và bổ sung đồng phục dễ quản lý hơn. Doanh nghiệp có thể lập danh sách size theo bộ phận và lưu mẫu chuẩn để các đợt sau không lệch màu hoặc sai chi tiết.'],
  ['Tạo hình ảnh chuyên nghiệp', 'Nhân sự là điểm chạm thương hiệu ở cổng công trường, khu tiếp nhận hàng, kho và khu sản xuất. Một bộ đồng phục sạch, vừa vặn, có màu nhận diện nhất quán giúp doanh nghiệp thể hiện tính tổ chức với khách hàng và đối tác.'],
  ['Đồng bộ thương hiệu', 'Đồng phục bảo hộ có thể nối với hệ thống đồng phục áo gió, polo hoặc trang phục sự kiện của doanh nghiệp. Phần "gốc vững" vẫn là vật liệu, độ bền và sự phù hợp môi trường; sau đó mới đến phối màu và hình ảnh.'],
];

const cacLoaiDongPhuc = [
  ['Quần áo bảo hộ lao động', 'Phù hợp doanh nghiệp cần bộ áo–quần đồng bộ cho công nhân, kỹ thuật viên hoặc nhân sự vận hành. Cần quan tâm form dễ cử động, túi không gây vướng, đường may, khóa/nút, bảng size và khả năng giặt thường xuyên.', '/bhld/dong_phuc_bao_ho_mau_kaki.jpg', 'Bộ quần áo bảo hộ lao động đồng bộ cho công nhân và nhân sự vận hành'],
  ['Áo phản quang', 'Thường được cân nhắc khi cần tăng khả năng nhận diện người mặc trong điều kiện ánh sáng hoặc khu vực có xe, máy móc. Mức độ phù hợp phụ thuộc thiết kế, vật liệu phản quang và tiêu chuẩn áp dụng; cần xác nhận hồ sơ hi-vis trước khi công bố.', '/bhld/bao-ho-lao-dong-phan-quang.jpg', 'Áo phản quang tăng khả năng nhận diện tại khu vực có xe và máy móc'],
  ['Đồng phục công nhân', 'Cần ưu tiên sự dễ mặc, bền khi giặt nhiều lần và phù hợp thao tác lặp lại. Với đơn hàng lớn, nên chuẩn hóa mẫu theo ca, bộ phận và size thay vì chọn một mẫu duy nhất cho tất cả nhân sự.', '/bhld/bao-ho-lao-dong-cong-nhân.jpg', 'Đồng phục công nhân bền, dễ mặc và chuẩn hóa theo ca làm việc'],
  ['Đồng phục kỹ thuật và nhà máy', 'Kỹ thuật viên thường di chuyển, cúi, với và tiếp cận nhiều khu vực. Nhà máy cần hình ảnh nhất quán giữa sản xuất, bảo trì, QA/QC và kho - có thể dùng một nền màu chung cùng điểm phân biệt nhỏ ở tay áo hoặc bảng tên.', '/bhld/bhld-nha-may.jpg', 'Đồng phục kỹ thuật và nhà máy đồng bộ giữa sản xuất, bảo trì và kho'],
];

const theoNganhNghe = [
  ['Bảo hộ lao động ngành xây dựng', 'Môi trường xây dựng thường có nhiều nhóm nhân sự: công nhân, kỹ thuật viên, kỹ sư, giám sát và quản lý công trường. Đồng phục có thể được tổ chức theo nhóm nhân sự để dễ nhận diện, với các yếu tố cần cân nhắc gồm form dáng, khả năng vận động, chất liệu, màu sắc, logo, chi tiết nhận diện và điều kiện thời tiết. Đối với các yêu cầu bảo hộ chuyên dụng của công trường, doanh nghiệp cần xác định riêng theo từng vị trí và tiêu chuẩn áp dụng.', '/bhld/dong_phuc_bao_ho_xay_dung.jpg', 'Đồng phục bảo hộ cho công nhân, kỹ thuật và giám sát công trường xây dựng'],
  ['Bảo hộ lao động ngành cơ khí', 'Trong môi trường cơ khí, trang phục thường phải đáp ứng yêu cầu sử dụng thực tế cao hơn so với môi trường văn phòng. Các nhóm nhân sự phổ biến gồm công nhân cơ khí, kỹ thuật, bảo trì, vận hành và giám sát. Khi thiết kế, nên quan tâm đến độ bền, sự thuận tiện khi vận động và bố trí các chi tiết phục vụ công việc - không nên chỉ chọn mẫu dựa trên hình ảnh đẹp mà bỏ qua trải nghiệm sử dụng thực tế.', '/bhld/dong_phuc_bao_ho_kaki_co_khi.jpg', 'Đồng phục cho xưởng cơ khí, gia công và bảo trì'],
  ['Bảo hộ lao động ngành điện', 'Nhân sự ngành điện có thể làm việc tại nhiều môi trường khác nhau. Vì vậy, trước khi đặt đồng phục cần xác định công việc, khu vực làm việc, tần suất di chuyển, môi trường trong nhà hoặc ngoài trời và yêu cầu kỹ thuật của vị trí. Đặc biệt, cần phân biệt giữa đồng phục nhận diện của đội kỹ thuật điện và trang phục có tính năng bảo hộ điện chuyên dụng; không nên mặc định một bộ đồng phục thông thường có khả năng cách điện hoặc chống hồ quang nếu không có tài liệu kỹ thuật chứng minh.', '/bhld/dong_phuc_bao_ho_dien_luc.jpg', 'Đồng phục nhận diện cho đội kỹ thuật thi công và vận hành điện'],
  ['Bảo hộ lao động nhà máy', 'Nhà máy là một trong những môi trường phù hợp để triển khai hệ thống đồng phục theo cấp độ, ví dụ từ công nhân đến kỹ thuật, bảo trì, giám sát rồi đến quản lý. Mỗi nhóm có thể được nhận diện bằng cách phối màu hoặc chi tiết thiết kế khác nhau nhưng vẫn nằm trong cùng một hệ thống thương hiệu, giúp doanh nghiệp tránh tình trạng mỗi phòng ban tự sử dụng một mẫu đồng phục riêng.', '/bhld/dong_phuc_bao_ho_linama.jpg', 'Đồng phục nhà máy phân nhóm theo sản xuất, QC, kho, bảo trì và quản lý'],
  ['Bảo hộ lao động kho vận – logistics', 'Nhân sự kho vận thường phải di chuyển, kiểm kê, xử lý hàng hóa hoặc làm việc tại nhiều khu vực. Các yếu tố cần quan tâm gồm sự linh hoạt, khả năng vận động, độ thoải mái, khả năng nhận diện, độ phù hợp với môi trường, logo và màu thương hiệu. Nếu doanh nghiệp có cả nhân sự kho và nhân sự giao nhận, có thể xây dựng hai biến thể đồng phục trong cùng một hệ thống nhận diện.', '/bhld/dong_phuc_bao_ho_kho_van_tai.jpg', 'Đồng phục kho vận hỗ trợ di chuyển và nhận diện nhanh giữa các bộ phận'],
  ['Bảo hộ lao động ngành xăng dầu', 'Ngành xăng dầu có nhiều nhóm nhân sự như nhân viên cây xăng, nhân viên cửa hàng, nhân viên kho, nhân viên kỹ thuật, nhân viên vận hành, giám sát và quản lý. Với nhóm ngành này, đồng phục thường đóng vai trò rất rõ trong nhận diện thương hiệu; các yếu tố nên được xem xét gồm màu sắc thương hiệu, kiểu dáng, logo, vị trí logo, phân biệt nhân sự, khả năng vận động, điều kiện môi trường, chất liệu và yêu cầu kỹ thuật của từng vị trí. Các truy vấn thường gặp trong nhóm này bao gồm đồng phục xăng dầu, đồng phục cây xăng, đồng phục nhân viên cây xăng, đồng phục kho xăng dầu và đồng phục kỹ thuật xăng dầu. Tuy nhiên, cần phân biệt rõ: đồng phục ngành xăng dầu và trang thiết bị bảo hộ chuyên dụng cho môi trường có nguy cơ cháy nổ là hai vấn đề khác nhau - không nên tự mặc định một bộ đồng phục thông thường có khả năng chống cháy, chống tĩnh điện, chống xăng dầu hoặc chống nổ nếu không có tài liệu kỹ thuật và tiêu chuẩn tương ứng.', '/bhld/bao-ho-lao-dong-xang-dau.jpg', 'Đồng phục nhận diện thương hiệu cho nhân viên cây xăng và kho xăng dầu'],
  ['Bảo hộ lao động ngành công nghiệp và kỹ thuật', 'Nhóm ngành công nghiệp có phạm vi rất rộng, có thể bao gồm vận hành, bảo trì, kỹ thuật, sản xuất, kiểm tra và giám sát. Vì vậy, cách tiếp cận tốt hơn là thiết kế theo vai trò công việc và môi trường, thay vì chỉ dựa trên tên ngành.', '/bhld/dong_phuc_bao_ho_ky_thuat.jpg', 'Đồng phục cho đội kỹ thuật và công nghiệp theo vai trò công việc'],
];

const cachLuaChon = [
  ['Môi trường làm việc', 'Ghi rõ trong nhà hay ngoài trời, nóng hay điều hòa, bụi hay sạch, ca ngắn hay dài, có làm gần máy móc/xe cộ hay không. Đây là cơ sở chọn trọng lượng, độ thoáng, khả năng vận động và lớp mặc.'],
  ['Vị trí công việc', 'Một mẫu cho công nhân có thể không phù hợp với kỹ sư hoặc giám sát. Hãy lập bảng vị trí, số người, tần suất cấp phát, yêu cầu size và mức độ tiếp xúc môi trường trước khi chốt.'],
  ['Chất liệu và trải nghiệm mặc', 'Đánh giá cảm giác trên da, độ thoáng khí, thoát ẩm, co giãn, trọng lượng và khả năng giặt. Không dùng cụm "chất liệu tốt" chung chung; cần mô tả cụ thể theo use case.'],
  ['Kiểu dáng và độ bền', 'Kiểm tra cổ, tay, đường ráp, túi, khóa/nút, gấu áo, đường may chịu lực và khoảng cử động. Mẫu phải được thử trong động tác thật: cúi, với, xoay, ngồi, đi nhanh và làm việc theo ca.'],
  ['Màu sắc, logo và tiêu chuẩn', 'Màu theo thương hiệu cần cân bằng với khả năng nhận diện tại nơi làm việc. Tiêu chí lựa chọn chung không đồng nghĩa với tính năng bảo hộ đã được chứng nhận; hai nhóm thông tin cần tách riêng trong hồ sơ mua hàng.'],
];

const chatLieuVai = [
  ['UNI QUICK DRY', 'Nền Polyester cao cấp, nhẹ, thoát ẩm, nhanh khô, dễ bảo quản, phù hợp hoạt động ngoài trời hoặc thường xuyên. Phù hợp nhóm cần đồng phục nhẹ, vận động nhiều hoặc làm việc trong điều kiện nóng - cần thử mẫu thật trước khi chốt.'],
  ['UNI SUPER COOL', 'Polyamide, bề mặt mềm, mượt, mát và mịn, hỗ trợ thoáng khí, giảm ma sát và co giãn tốt. Phù hợp nhóm phải di chuyển nhiều hoặc ưu tiên sự dễ chịu trong ca dài, sau khi xác nhận độ bền với môi trường sử dụng.'],
  ['UNI BLENDED', 'Kết hợp Polyester–Polyamide hoặc Cotton–Polyester, cân bằng giữa độ bền, độ mềm, nhanh khô, chống nhăn và bền màu. Phù hợp đồng phục sử dụng thường xuyên, cần hình ảnh gọn và bảo quản thuận tiện.'],
  ['UNI DRY', 'Công nghệ xử lý thoát ẩm, không phải một loại vải độc lập - hỗ trợ hơi ẩm đi từ phía da ra mặt ngoài để bay hơi. Phù hợp khi doanh nghiệp ưu tiên cảm giác khô thoáng cho đồng phục có vận động; thông số riêng cho bảo hộ lao động cần được xác nhận trước khi công bố.'],
];

const mauSacNhanDien = [
  ['Logo, in và thêu', 'Logo ngực tạo nhận diện khi giao tiếp; logo lưng phù hợp khi nhìn từ phía sau; tay áo hoặc bảng tên dùng cho phân vai. In, ép hoặc thêu phải chọn theo vật liệu, kích thước logo và số lần giặt. Duyệt mockup chưa thay thế việc duyệt mẫu thật.'],
  ['Quy chuẩn hình ảnh', 'Doanh nghiệp nên lưu màu chuẩn, mã logo, vị trí đặt, bảng size và quy ước từng bộ phận - tài sản vận hành giúp các đợt đặt bổ sung giữ được tính đồng bộ, đặc biệt với chuỗi nhiều cơ sở.'],
];

const theoViTri = [
  ['Công nhân và nhân viên kho', 'Ưu tiên form dễ vận động, cảm giác thoải mái, túi thuận tay và vật liệu chịu được tần suất giặt theo quy định. Nhận diện nên rõ nhưng không làm cản trở thao tác.'],
  ['Kỹ thuật viên, kỹ sư và bảo trì', 'Nhóm này cần chuyển đổi tư thế thường xuyên. Hãy thử mẫu với động tác cúi, với, nâng tay và leo bậc; tính năng chuyên dụng chỉ được ghi khi có hồ sơ.'],
  ['Giám sát và quản lý nhà máy', 'Có thể dùng cùng màu thương hiệu với chi tiết khác biệt vừa đủ như cổ áo, viền, bảng tên hoặc áo khoác - mục tiêu là nhận diện vai trò nhanh mà vẫn thống nhất với toàn hệ thống.'],
  ['Nhân viên vận hành và giao nhận', 'Đánh giá điều kiện di chuyển, thời gian ngoài trời, khu vực xe cộ và việc phối hợp với PPE. Nếu cần áo phản quang, hãy xác định tiêu chuẩn và hồ sơ trước khi đặt.'],
];

const quyTrinhSteps = [
  ['Tiếp nhận thông tin', 'Ghi nhận ngành nghề, môi trường, vị trí, số lượng và yêu cầu nhận diện.'],
  ['Làm rõ yêu cầu HSE', 'Tách phần đồng phục khỏi PPE chuyên dụng ngay từ brief.'],
  ['Tư vấn chất liệu', 'Dựa trên cảm giác mặc, độ thoáng, thoát ẩm, co giãn và độ bền cần kiểm tra.'],
  ['Xây dựng thiết kế', 'Kiểu dáng, màu, logo, bảng size và phân vai theo bộ phận.'],
  ['Gửi mockup', 'Doanh nghiệp duyệt bố cục nhận diện trước khi triển khai.'],
  ['May mẫu', 'Khi brief cần kiểm tra form hoặc vật liệu thực tế.'],
  ['Chốt cấu hình', 'Hồ sơ kỹ thuật và yêu cầu QC được thống nhất bằng văn bản.'],
  ['Sản xuất', 'Triển khai theo đơn đã duyệt.'],
  ['Kiểm tra', 'Đường may, màu, logo, size, số lượng và hoàn thiện.'],
  ['Đóng gói và giao hàng', 'Giao hàng và lưu mẫu chuẩn cho lần đặt bổ sung.'],
];

const checklistKiemTra = [
  'Đường may, chỉ thừa và điểm chịu lực',
  'Khóa, nút, cổ, tay áo và gấu áo',
  'Túi, nắp túi và khả năng thao tác',
  'Form, kích thước và độ đồng đều giữa size',
  'Màu sắc so với mẫu đã duyệt',
  'Logo: vị trí, kích thước, màu và độ hoàn thiện',
  'Chất liệu đúng cấu hình và cảm giác mặc',
  'Độ co giãn/thoáng/thoát ẩm theo phạm vi đã thống nhất',
  'Số lượng, đóng gói và nhãn phân loại',
  'Hồ sơ tiêu chuẩn hoặc chứng nhận nếu hợp đồng có yêu cầu',
];

const faqs = [
  [
    'Bảo hộ lao động là gì?',
    'Bảo hộ lao động là hệ thống các biện pháp tổ chức, kỹ thuật, đào tạo và phương tiện nhằm giảm rủi ro trong quá trình làm việc. Đồng phục bảo hộ chỉ là một thành phần của hệ thống này và không mặc nhiên thay thế PPE hoặc các phương tiện bảo vệ chuyên dụng.'
  ],
  [
    'Đồng phục bảo hộ lao động khác PPE như thế nào?',
    'Đồng phục bảo hộ lao động chủ yếu phục vụ trang phục làm việc, nhận diện, trải nghiệm mặc và các yêu cầu thao tác theo môi trường. PPE là các phương tiện bảo vệ cá nhân như mũ, kính, găng tay, giày hoặc thiết bị chuyên dụng được lựa chọn theo đánh giá rủi ro và yêu cầu an toàn cụ thể.'
  ],
  [
    'Đồng phục bảo hộ gồm những gì?',
    'Tùy brief, đồng phục bảo hộ có thể gồm áo, quần, áo khoác, áo phản quang hoặc các cấu hình khác. Thành phần cụ thể cần được xác định theo môi trường làm việc, vị trí, thời tiết, yêu cầu nhận diện và yêu cầu HSE.'
  ],
  [
    'Quần áo bảo hộ chuyên dụng khác đồng phục công nhân như thế nào?',
    'Đồng phục công nhân thường tập trung vào sự đồng bộ, nhận diện và trải nghiệm làm việc. Quần áo bảo hộ chuyên dụng phải đáp ứng tính năng bảo vệ cụ thể và cần có thông số kỹ thuật, tiêu chuẩn hoặc chứng nhận phù hợp khi yêu cầu đó được đặt ra.'
  ],
  [
    'Nên chọn vải gì để may đồng phục bảo hộ lao động?',
    'Không có một loại vải phù hợp cho mọi môi trường. Chất liệu nên được lựa chọn dựa trên nhiệt độ, thời lượng mặc, mức độ vận động, tần suất giặt, yêu cầu về form, cảm giác mặc và các yêu cầu kỹ thuật đã được HSE xác định.'
  ],
  [
    'Có thể dùng chất liệu UNI QUICK DRY cho đồng phục bảo hộ không?',
    'UNI QUICK DRY có thể được xem xét cho đồng phục làm việc khi doanh nghiệp ưu tiên trọng lượng nhẹ, cảm giác khô thoáng hoặc sử dụng trong điều kiện nóng, tùy cấu hình thực tế. Đây không phải là chứng nhận PPE và không nên được hiểu là tính năng bảo vệ chuyên dụng nếu chưa có hồ sơ kỹ thuật tương ứng.'
  ],
  [
    'Có thể dùng UNI SUPER COOL cho đồng phục bảo hộ lao động không?',
    'UNI SUPER COOL có thể được xem xét cho nhóm đồng phục làm việc cần ưu tiên cảm giác mềm, mát và dễ chịu khi di chuyển. Việc lựa chọn cuối cùng cần dựa trên môi trường sử dụng và yêu cầu độ bền thực tế; chất liệu này không mặc nhiên là vật liệu PPE chuyên dụng.'
  ],
  [
    'Có thể thiết kế đồng phục bảo hộ theo màu nhận diện thương hiệu không?',
    'Có. Màu chủ đạo, màu phối, logo và các chi tiết nhận diện có thể được xây dựng theo hệ nhận diện doanh nghiệp. Tuy nhiên, màu sắc cuối cùng nên được duyệt trên mẫu vải hoặc mẫu thực tế thay vì chỉ dựa vào hình ảnh trên màn hình.'
  ],
  [
    'Có thể in hoặc thêu logo lên đồng phục bảo hộ không?',
    'Có. Kỹ thuật in, ép hoặc thêu cần được lựa chọn theo chất liệu, kích thước logo, vị trí đặt và tần suất giặt. Mockup giúp kiểm tra bố cục nhưng nên duyệt mẫu thật trước sản xuất số lượng lớn khi dự án yêu cầu độ chính xác cao.'
  ],
  [
    'Có thể thiết kế đồng phục riêng cho công nhân, kỹ thuật viên và quản lý không?',
    'Có. Doanh nghiệp có thể giữ chung ngôn ngữ thương hiệu nhưng điều chỉnh form, màu phối, logo hoặc chi tiết nhận diện theo từng nhóm nhân sự. Cách này giúp dễ nhận diện vai trò mà vẫn duy trì hình ảnh thống nhất.'
  ],
  [
    'Đồng phục bảo hộ có thể dùng cho ngành xây dựng không?',
    'Có thể thiết kế đồng phục làm việc cho nhóm xây dựng theo đặc thù công việc, thời tiết, mức độ vận động, nhóm nhân sự và yêu cầu nhận diện. Nếu công việc yêu cầu PPE hoặc tính năng bảo vệ chuyên dụng, các yêu cầu đó cần được xác định và kiểm chứng riêng.'
  ],
  [
    'Đồng phục bảo hộ có thể dùng cho nhà máy và kho vận không?',
    'Có. Với nhà máy và kho vận, thiết kế có thể tập trung vào sự thoải mái, khả năng vận động, túi và chi tiết thao tác, nhận diện bộ phận và khả năng duy trì đồng bộ giữa nhiều ca làm việc. Các yêu cầu bảo vệ đặc thù cần được tách riêng theo đánh giá rủi ro.'
  ],
  [
    'Có cần may mẫu trước khi sản xuất đồng phục bảo hộ không?',
    'Nên may hoặc duyệt mẫu khi đơn hàng có số lượng lớn, thiết kế riêng hoặc có yêu cầu cao về form và chất liệu. Mẫu thực tế giúp kiểm tra kích thước, màu sắc, logo, cấu trúc, cảm giác mặc và các chi tiết trước khi sản xuất toàn bộ.'
  ],
  [
    'Quy trình đặt đồng phục bảo hộ lao động tại Univi gồm những bước nào?',
    'Quy trình có thể gồm tiếp nhận thông tin, làm rõ môi trường và yêu cầu HSE, tư vấn chất liệu, xây dựng thiết kế, gửi mockup, may mẫu khi cần, chốt cấu hình, sản xuất, kiểm tra và bàn giao. Các bước cụ thể cần được xác nhận theo brief và cấu hình của từng đơn hàng.'
  ],
  [
    'Chi phí may đồng phục bảo hộ lao động phụ thuộc vào yếu tố nào?',
    'Chi phí phụ thuộc vào kiểu áo quần, chất liệu, form, số lượng, màu sắc, logo, kỹ thuật in hoặc thêu, cấu trúc túi và chi tiết, mẫu thử, đóng gói, kiểm tra và vận chuyển. Với yêu cầu kỹ thuật đặc thù, hồ sơ hoặc tiêu chuẩn cần thiết cũng phải được xác định riêng.'
  ],
  [
    'UNIVI có nhận may đồng phục bảo hộ số lượng lớn không?',
    'Univi công bố năng lực sản xuất gồm xưởng 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất khoảng 100.000 sản phẩm mỗi tháng. Số lượng, tiến độ và cấu hình thực tế của đơn hàng bảo hộ cần được xác nhận theo từng dự án.'
  ],
  [
    'UNIVI có cung cấp PPE chuyên dụng không?',
    'Trang này tập trung vào giải pháp đồng phục bảo hộ và không mặc nhiên xem PPE chuyên dụng là sản phẩm do Univi cung cấp. Với yêu cầu PPE hoặc tính năng bảo vệ cụ thể, doanh nghiệp nên xác định tiêu chuẩn và hồ sơ kỹ thuật cần thiết trước khi lựa chọn nhà cung cấp.'
  ],
  [
    'Đồng phục bảo hộ có được xem là chống cháy, chống hóa chất hoặc chống tĩnh điện không?',
    'Không thể xác định chỉ dựa trên màu sắc, kiểu dáng hoặc cấu trúc may. Các tính năng như chống cháy, chống hóa chất hoặc chống tĩnh điện cần có thông số kỹ thuật, thử nghiệm hoặc chứng nhận phù hợp với yêu cầu cụ thể trước khi công bố.'
  ],
  [
    'Có thể đặt lại cùng mẫu đồng phục bảo hộ cho những lần sau không?',
    'Có thể thuận tiện tái đặt nếu doanh nghiệp lưu mẫu chuẩn, chất liệu, màu sắc, bảng size, vị trí logo, file thiết kế và yêu cầu QC. Việc lưu chuẩn giúp hạn chế sai khác giữa các đợt sản xuất khi doanh nghiệp tuyển thêm nhân sự hoặc mở rộng nhà máy, chi nhánh.'
  ],
  [
    'UNIVI có giao đồng phục bảo hộ lao động toàn quốc không?',
    'Univi cung cấp giải pháp đồng phục theo yêu cầu và hỗ trợ giao hàng theo từng dự án. Địa điểm, số lượng, tiến độ sản xuất và phương án bàn giao cần được xác nhận theo từng đơn hàng.'
  ]
];

function BulletGrid({ items, cols = 'md:grid-cols-2' }) {
  return (
    <div className={`grid gap-1 ${cols}`}>
      {items.map(([title, text]) => (
        <div key={title} className="bg-white rounded-xl mr-3">
          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
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

export default function WorkwearUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-xl mb-4 leading-6">
              Bảo Hộ Lao Động
              <span className="text-yellow-300"> Giải Pháp Đồng Phục An Toàn Và Chuyên Nghiệp</span>
            </h2>
            <p className="text-base text-white">
              Khi doanh nghiệp có hàng trăm nhân sự làm việc tại nhà máy, công trường, kho vận hoặc khu kỹ thuật, đồng phục không chỉ là một khoản mua sắm hành chính. Thiết kế đúng giúp nhân sự dễ mặc, dễ nhận diện và duy trì hình ảnh đồng bộ qua nhiều ca làm việc.
            </p>
          </div>
        </div>

        {/* 1 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Bảo Hộ Lao Động Là Gì?
          </h2>
          <div className="space-y-3">
            <p className="text-base">
              Bảo hộ lao động là tập hợp biện pháp tổ chức, kỹ thuật, đào tạo và phương tiện nhằm giảm rủi ro trong quá trình làm việc. <span className="font-semibold">Đồng phục bảo hộ lao động</span> hoặc <span className="font-semibold">quần áo bảo hộ</span> là nhóm trang phục được thiết kế để sử dụng trong môi trường công việc cụ thể - hỗ trợ nhận diện, tạo sự thoải mái, bố trí túi và chi tiết phù hợp thao tác.
            </p>
            <p className="text-base">
              Đồng phục tạo một lớp nhận diện trực quan giữa nhân sự và khách đến nhà máy, nhưng hiệu quả an toàn vẫn phụ thuộc vào đánh giá rủi ro, đào tạo, quy trình và việc sử dụng đầy đủ PPE tương ứng. Doanh nghiệp cần phân biệt rõ ba khái niệm sau trước khi đặt hàng:
            </p>
          </div>
          <div className="mt-4 overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Khái niệm</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Vai trò</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Lưu ý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr>
                  <td className="px-4 py-3 align-top font-semibold text-gray-900">Đồng phục bảo hộ</td>
                  <td className="px-4 py-3 align-top text-gray-700">Trang phục làm việc, nhận diện và hỗ trợ thao tác</td>
                  <td className="px-4 py-3 align-top text-gray-700">Cần chọn theo môi trường và vị trí</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top font-semibold text-gray-900">Quần áo bảo hộ chuyên dụng</td>
                  <td className="px-4 py-3 align-top text-gray-700">Trang phục có tính năng bảo vệ cụ thể</td>
                  <td className="px-4 py-3 align-top text-gray-700">Phải có thông số, tiêu chuẩn hoặc chứng nhận xác thực</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top font-semibold text-gray-900">PPE</td>
                  <td className="px-4 py-3 align-top text-gray-700">Hệ thống phương tiện bảo vệ cá nhân như mũ, kính, găng, giày</td>
                  <td className="px-4 py-3 align-top text-gray-700">Không mặc nhiên do Univi cung cấp</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-base mt-3">
            Một bộ đồng phục có màu sắc phù hợp hoặc đường may chắc chắn không thể được gọi là chống cháy, chống hóa chất hay chống tĩnh điện nếu chưa có bằng chứng kỹ thuật. Trước khi đặt hàng, bộ phận HSE nên xác định yêu cầu bắt buộc và yêu cầu nào thuộc về nhận diện, công năng mặc thông thường.
          </p>
        </article>
        <ArticleImage src="/bhld/bao-ho-lao-dong-cho-cac-nghanh-nghe.jpg" alt="Đồng phục bảo hộ lao động Univi cho công nhân, kỹ thuật và nhà máy" />

        {/* 2 */}
        <article className="bg-white  mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Vì Sao Doanh Nghiệp Cần Đồng Phục Bảo Hộ?
          </h2>
          <BulletGrid items={lyDoCanDongPhuc} cols="md:grid-cols-1" />
        </article>
        <ArticleImage src="/bhld/kien-truc-su-dong-phuc.jpg" alt="Đồng phục bảo hộ giúp nhận diện nhân sự và quản lý tại nhà máy" />

        {/* 3 */}
        <article className="bg-white  mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Các Loại Đồng Phục Bảo Hộ Lao Động
          </h2>
          <p className="text-base mb-3">
            Không phải ngành nào cũng cần một mẫu. Cấu hình nên được chốt sau khi biết môi trường, tần suất mặc, vị trí công việc, quy định HSE và mục tiêu nhận diện.
          </p>
          <div className="space-y-6">
            {cacLoaiDongPhuc.map(([title, text, image, alt], index) => (
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
        <article className="bg-white p-4 mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Bảo Hộ Lao Động Theo Ngành Nghề
          </h2>
          <div className="space-y-3 mb-3">
            <p className="text-base">
              Đây là một trong những yếu tố quan trọng nhất khi xây dựng giải pháp đồng phục bảo hộ. Mỗi ngành có điều kiện làm việc, nhóm nhân sự và yêu cầu sử dụng khác nhau.
            </p>
            <p className="text-base">
              Vì vậy, thay vì tìm một mẫu đồng phục "dùng cho mọi ngành", doanh nghiệp nên lựa chọn dựa trên đặc thù thực tế.
            </p>
          </div>
          <div className="space-y-6">
            {theoNganhNghe.map(([title, text, image, alt], index) => (
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
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Cách Lựa Chọn Đồng Phục Bảo Hộ
          </h2>
          <BulletGrid items={cachLuaChon} />
        </article>

        {/* 6 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Chất Liệu Vải May Đồng Phục Bảo Hộ
          </h2>
          <p className="text-base mb-3">
            Nền tảng chất liệu của Univi được xây dựng chủ yếu cho trang phục thể thao. Các dòng dưới đây nên được xem là phương án tham khảo cho đồng phục làm việc cần thoải mái, không phải chứng nhận PPE chuyên dụng.
          </p>
          <BulletGrid items={chatLieuVai} />

        </article>

        {/* 7 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            Màu Sắc Và Nhận Diện Thương Hiệu
          </h2>
          <p className="text-base mb-3">
            Doanh nghiệp có thể tham khảo <Link href="/bang-mau" className="font-semibold text-[#105d97]">bảng màu của Univi</Link> để chọn màu nhận diện phù hợp trước khi lên mockup và duyệt mẫu thật.
          </p>
          <BulletGrid items={mauSacNhanDien} />
        </article>

        {/* 8 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Đồng Phục Theo Vị Trí Công Việc
          </h2>
          <BulletGrid items={theoViTri} />
        </article>
        <ArticleImage src="/bhld/quan-ao-bao-ho-lao-dong.jpg" alt="Đồng phục bảo hộ theo vị trí công việc: công nhân, kỹ thuật, giám sát, vận hành" />

        {/* 9 */}
        <article className="bg-white  mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">9.</span>
            Đồng Phục Bảo Hộ Trong Hệ Sinh Thái Doanh Nghiệp
          </h2>
          <p className="text-base mb-1">
            Đồng phục bảo hộ có thể là một lớp trong hệ thống gồm đồng phục công sở cho khối văn phòng, đồng phục kỹ thuật cho đội triển khai, đồng phục nhà máy/bảo hộ cho sản xuất, áo khoác cho ca ngoài trời và các nhóm PPE do nhà cung cấp chuyên dụng khác đảm nhiệm nếu cần.
          </p>
          <p className="text-base">
            Màu sắc, logo, kiểu nhận diện, phân nhóm nhân sự và quy chuẩn hình ảnh nên được thiết kế như một hệ thống. Mô hình này kế thừa tư duy đồng bộ Staff Uniform và Member Uniform trong lĩnh vực thể thao của Univi, điều chỉnh thành bài toán nhận diện doanh nghiệp. Với doanh nghiệp cần một hệ đồng phục rộng hơn, có thể tham khảo <Link href="/giai-phap-2s" className="font-semibold text-[#105d97]">giải pháp 2S Uniform</Link> và <Link href="/xuong-may-dong-phuc-univi" className="font-semibold text-[#105d97]">xưởng may đồng phục Univi</Link>.
          </p>
        </article>

        {/* 10 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">10.</span>
            Quy Trình Đặt Hàng Tại Univi
          </h2>
          <p className="text-base mb-3">
            Quy trình cụ thể cần chốt theo brief và sản phẩm, không cam kết cứng thời gian, số lượng tối thiểu hay mẫu miễn phí khi chưa có báo giá chính thức. Tham khảo thêm <Link href="/huong-dan-dat-hang" className="font-semibold text-[#105d97]">hướng dẫn đặt hàng</Link> để chuẩn bị brief.
          </p>
          <NumberedList items={quyTrinhSteps} />
        </article>

        {/* 11 */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">11.</span>
            Tiêu Chí Kiểm Tra Đồng Phục Bảo Hộ
          </h2>
          <p className="text-base mb-3">
            Trước nghiệm thu, doanh nghiệp nên lập checklist gồm:
          </p>
          <div className="grid gap-1 md:grid-cols-2">
            {checklistKiemTra.map((item) => (
              <div key={item} className="bg-white rounded-xl p-3">
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="text-base mt-3">
            Với yêu cầu kỹ thuật đặc thù, doanh nghiệp cần bổ sung tiêu chuẩn kỹ thuật riêng. Không dùng checklist ngoại quan để thay cho thử nghiệm hoặc chứng nhận bảo hộ.
          </p>
        </article>

        {/* Kết luận */}
        <article className="bg-white mb-6">
          <h2 className="text-xl md:text-xl font-bold mb-2">Kết Luận</h2>
          <p className="text-base">
            Bảo hộ lao động trong doanh nghiệp cần được nhìn như một bài toán hệ thống. Đồng phục bảo hộ hỗ trợ nhận diện, trải nghiệm mặc, phân vai và hình ảnh chuyên nghiệp; PPE chuyên dụng và yêu cầu an toàn riêng phải được đánh giá bằng hồ sơ kỹ thuật phù hợp. Khi đặt hàng, hãy bắt đầu từ môi trường và công việc, sau đó mới chọn chất liệu, form, màu và logo.
          </p>
        </article>

        {/* FAQ */}
        <article className="bg-white mb-6">
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
            Các tập đoàn, doanh nghiệp và nhà xưởng đã tin tưởng sản xuất bảo hộ lao động tại Univi
          </p>
          <PartnersSection category="doanh-nghiep" />
        </section>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Doanh Nghiệp Đang Cần Đồng Phục Bảo Hộ Lao Động?
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Gửi cho <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> thông tin về ngành nghề, môi trường làm việc, số lượng, vị trí sử dụng và yêu cầu nhận diện. Univi sẽ tư vấn cấu hình phù hợp dựa trên dữ liệu sản phẩm và yêu cầu thực tế.
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
                Nhận tư vấn đồng phục bảo hộ
              </button>
              <p className="text-white mt-3 font-medium">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </p>
            </div>
          </div>
        </div>

        <ContactForm
          source="Đồng phục bảo hộ lao động - Nhận tư vấn"
          isModal
          isOpen={isQuoteFormOpen}
          onClose={() => setIsQuoteFormOpen(false)}
        />
      </div>
    </div>
  );
}
