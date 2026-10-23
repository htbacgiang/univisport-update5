import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../../header/ContactForm';
import PartnersSection from '../PartnersSection';

const soSanhTeambuilding = [
  ['Bối cảnh', 'Văn phòng, gặp khách hàng', 'Sự kiện, company trip, hoạt động nhóm'],
  ['Thời gian sử dụng', 'Thường dài hạn', 'Gắn với chương trình, có thể tái sử dụng'],
  ['Ưu tiên', 'Lịch sự, ổn định', 'Thoải mái, nhận diện, phù hợp hoạt động'],
  ['Thiết kế', 'Tiết chế, theo nhận diện', 'Linh hoạt theo concept sự kiện'],
  ['Màu sắc', 'Bám hệ nhận diện', 'Có thể dùng màu chủ đề nhưng nên giữ liên hệ thương hiệu'],
  ['Hình ảnh', 'Corporate', 'Tập thể, năng động'],
];

const lyDoSuDung = [
  ['Tạo hình ảnh đồng nhất', 'Khi cả tập thể mặc cùng một hệ màu và thiết kế, người tổ chức dễ nhận biết thành viên hơn và ảnh tập thể cũng có hình ảnh thống nhất hơn. Nếu chương trình chia nhiều đội, có thể dùng cùng một thiết kế nền rồi thay đổi ký hiệu hoặc màu phụ.'],
  ['Tăng nhận diện doanh nghiệp trong sự kiện', 'Logo, màu thương hiệu và một thông điệp ngắn giúp doanh nghiệp xuất hiện tự nhiên trong ảnh và video. Không cần đưa quá nhiều thông tin lên áo; nhận diện rõ thường hiệu quả hơn một thiết kế quá nhiều chữ.'],
  ['Tạo dấu hiệu trực quan về tinh thần tập thể', 'Một thiết kế chung tạo ra cảm giác mọi người đang tham gia cùng một chương trình. Đây không phải yếu tố quyết định văn hóa nội bộ, nhưng là một cách đơn giản để tạo sự đồng nhất trong hoạt động.'],
  ['Hỗ trợ vận hành sự kiện', 'Màu áo hoặc ký hiệu team giúp HR/Event phân biệt nhóm nhanh hơn, đặc biệt khi chương trình có nhiều trò chơi và số lượng người tham gia lớn.'],
  ['Tạo hình ảnh tốt cho ảnh và video', 'Ảnh tập thể thường được nhìn từ xa. Vì vậy, màu ổn định, chữ dễ đọc và bố cục ít rối sẽ hiệu quả hơn việc đưa quá nhiều chi tiết lên áo.'],
];

const chonLoaiAo = [
  ['4.1 Áo thun cổ tròn', 'Phù hợp với chương trình năng động, trò chơi tập thể và lịch trình ngoài trời - đây cũng là kiểu áo dễ thể hiện concept, slogan hoặc màu chủ đề. Nên chọn khi chương trình thiên về vận động, đi biển, resort hoặc hoạt động ngoài trời. Lưu ý: nếu chương trình có phần hội nghị hoặc giao lưu trang trọng, polo có thể phù hợp hơn.', '/teambuilding/dong-phuc-teambuilding-vib.jpg', 'Áo thun cổ tròn đồng phục teambuilding'],
  ['4.2 Áo polo', 'Tạo cảm giác gọn gàng hơn và phù hợp với doanh nghiệp muốn cân bằng giữa hoạt động tập thể và hình ảnh chỉn chu. Với polo dành cho vận động, cần kiểm tra chất liệu, cổ áo và độ linh hoạt của mẫu thực tế. Nên chọn khi company trip có nhiều phần giao lưu, chụp ảnh, hội nghị hoặc doanh nghiệp muốn áo có khả năng sử dụng sau sự kiện.', '/teambuilding/dong-phuc-teambuilding-co-tron.jpg', 'Áo polo đồng phục teambuilding'],
  ['4.3 Áo thể thao', 'Phù hợp khi chương trình có cường độ vận động cao hoặc diễn ra ngoài trời trong thời gian dài. Dòng UNI QUICK DRY của Univi được định vị cho nhu cầu nhẹ, thoát ẩm và nhanh khô, phù hợp để trao đổi khi chương trình có nhiều hoạt động vận động. Nên chọn khi chạy nhóm, trò chơi liên tục, hoạt động bãi biển hoặc outdoor nhiều giờ.', '/teambuilding/dong-phuc-teambuilding-the-thao.jpg', 'Áo thể thao đồng phục teambuilding UNI QUICK DRY'],
];

const chonForm = [
  ['Form regular', 'Có độ rộng cân bằng, phù hợp nhóm người mặc đa dạng. Đây thường là lựa chọn dễ triển khai cho doanh nghiệp đông người, nhưng vẫn cần dùng bảng size của đúng mẫu áo.'],
  ['Form thể thao', 'Phù hợp khi người mặc phải giơ tay, cúi người, chạy hoặc vận động liên tục. Không nên chọn form chỉ dựa vào hình ảnh; cần kiểm tra cảm giác mặc và chuyển động trên mẫu thật.'],
  ['Form nam và form nữ', 'Có thể giữ cùng concept, màu và hệ logo nhưng điều chỉnh form để phù hợp cơ thể nam và nữ. Cách này giúp hình ảnh tập thể đồng nhất mà vẫn dễ mặc.'],
  ['Form rộng', 'Có thể thoải mái với một số người nhưng không phải lựa chọn tốt cho mọi hoạt động. Áo quá rộng có thể gây vướng khi chơi trò chơi và làm hình ảnh tập thể thiếu gọn.'],
];

const bangChatLieu = [
  ['UNI QUICK DRY', 'Nhẹ, nhanh khô', 'Hỗ trợ thoát ẩm nhanh', 'Chương trình ngoài trời, mùa hè, lịch trình nhiều vận động'],
  ['UNI SUPER COOL', 'Mềm, mượt, mát, nhẹ', 'Ưu tiên cảm giác tiếp xúc với da', 'Chương trình quan tâm độ linh hoạt và hình ảnh cao cấp hơn'],
  ['UNI BLENDED', 'Kết hợp nhiều nhóm sợi theo cấu hình', 'Cân bằng giữa hiệu năng vận động và tính ứng dụng', 'Đồng phục teambuilding phổ thông, dùng đa dạng hoạt động'],
];

const thietKeLogo = [
  ['7.1 Thiết kế tối giản', 'Một thiết kế có logo, màu thương hiệu và một điểm nhấn thường dễ đọc và ít rối khi chụp ảnh tập thể. Đây cũng là hướng dễ tái sử dụng sau sự kiện.'],
  ['7.2 Thiết kế theo màu thương hiệu', 'Màu áo có thể lấy từ hệ nhận diện nhưng không nhất thiết phải dùng nguyên một màu logo. Có thể dùng màu thương hiệu ở nền, mảng phối, viền hoặc chữ. Cần kiểm tra độ tương phản trên vải thật.'],
  ['7.3 Thiết kế slogan', 'Slogan nên ngắn và gắn với chủ đề chương trình. Câu quá dài thường khó đọc khi in sau lưng và khó thể hiện rõ trong ảnh tập thể.'],
  ['7.4 Thiết kế theo concept', 'Chủ đề như "kết nối", "bứt phá" hay "vươn xa" có thể được thể hiện bằng màu, đường nét và một điểm nhấn đồ họa. Không cần biến chiếc áo thành một poster.'],
  ['7.5 Vị trí logo và thông tin', 'Các vị trí thường dùng gồm logo trước ngực, logo sau lưng, logo tay áo, slogan, tên chương trình và năm tổ chức, tên team. Không nên đưa logo, slogan, địa điểm, hashtag và quá nhiều thông tin vào cùng một mặt áo. Một thiết kế tốt cần giữ được quan hệ giữa logo + màu sắc + slogan + concept.'],
];

const chonMauAo = [
  ['8.1 Màu nhận diện thương hiệu', 'Phù hợp khi doanh nghiệp muốn hình ảnh sự kiện gắn chặt với thương hiệu. Nên kiểm tra màu trên vải thật vì màu màn hình và màu thực tế có thể khác nhau.'],
  ['8.2 Màu theo chủ đề chương trình', 'Màu campaign có thể tạo cảm giác mới cho sự kiện nhưng nên giữ một chi tiết liên hệ với thương hiệu. Có thể tham khảo <bangmau/> của Univi khi cần chốt màu chính, màu phụ và màu phối.'],
  ['8.3 Màu theo địa điểm', 'Teambuilding đi biển, resort và outdoor có điều kiện ánh sáng khác nhau. Màu áo cần được xem trong chính bối cảnh dự kiến chụp ảnh, thay vì chỉ nhìn một chiếc áo trong studio.'],
  ['8.4 Màu khi chụp ảnh tập thể', 'Nhóm đông cần màu đủ đồng đều và chữ đủ tương phản. Nếu chia nhiều team, nên giữ chung một hệ màu và chỉ tạo khác biệt vừa đủ.'],
];

const cacMauPhoBien = [
  ['9.1 Mẫu tối giản', 'Logo + màu thương hiệu + một điểm nhấn. Phù hợp doanh nghiệp muốn áo có thể dùng lại.'],
  ['9.2 Mẫu theo màu thương hiệu', 'Tập trung vào nhận diện. Phù hợp doanh nghiệp có guideline rõ ràng.'],
  ['9.3 Mẫu slogan', 'Tập trung vào một thông điệp ngắn của chương trình. Phù hợp campaign nội bộ và hoạt động gắn kết.'],
  ['9.4 Mẫu theo chủ đề', 'Phù hợp company trip, family day hoặc chương trình kỷ niệm. Concept nên thống nhất với backdrop và các vật phẩm sự kiện.'],
  ['9.5 Mẫu áo thể thao', 'Phù hợp chương trình có nhiều hoạt động vận động. Chọn vải theo thời tiết và mức độ ra mồ hôi.'],
  ['9.6 Mẫu polo teambuilding', 'Phù hợp chương trình cần hình ảnh gọn gàng, có phần giao lưu hoặc hoạt động kết hợp hội nghị.'],
  ['9.7 Mẫu áo thun teambuilding', 'Phù hợp hoạt động năng động và dễ thể hiện chủ đề. Cần cân bằng giữa màu, form, chất liệu và kỹ thuật in.'],
];

const chonTheoBoiCanh = [
  ['10.1 Teambuilding tại biển', 'Ưu tiên áo nhẹ, phù hợp nắng, gió và hoạt động liên tục. Thiết kế nên có độ tương phản tốt để nhìn rõ trong ảnh ngoài trời.'],
  ['10.2 Teambuilding tại resort', 'Lịch trình thường gồm trò chơi, ăn uống, chụp ảnh và tiệc. Polo hoặc áo thun có form gọn có thể giúp chuyển tiếp giữa các phần của chương trình dễ hơn.'],
  ['10.3 Teambuilding ngoài trời', 'Nên cung cấp cho nhà cung cấp thông tin về thời tiết dự kiến, khung giờ và mức vận động. Đây là dữ liệu ảnh hưởng trực tiếp tới lựa chọn chất liệu và form.'],
  ['10.4 Teambuilding trong nhà', 'Không gian điều hòa giảm áp lực về nắng nhưng vẫn cần sự linh hoạt khi vận động. Ưu tiên form vừa vặn và chất liệu phù hợp thời gian mặc.'],
  ['10.5 Company Trip và Family Day', 'Company Trip thường cần cân bằng giữa hình ảnh doanh nghiệp và không khí du lịch. Family Day có nhiều độ tuổi, vì vậy khâu phân size cần được chuẩn bị kỹ hơn, đặc biệt nếu có trẻ em.'],
];

const chiaAoTheoTeam = [
  ['11.1 Cùng màu, khác ký hiệu', 'Giữ nhận diện chung mạnh nhất. Có thể khác bằng số, biểu tượng nhỏ hoặc tên team.'],
  ['11.2 Khác màu theo team', 'Phù hợp trò chơi cần nhận biết nhanh. Nên giới hạn số màu và giữ chung logo, font và vị trí nhận diện.'],
  ['11.3 Cùng thiết kế, khác slogan', 'Phù hợp khi mỗi phòng ban có thông điệp riêng nhưng doanh nghiệp vẫn muốn toàn bộ áo thuộc cùng một concept.'],
  ['11.4 Dùng tên team', 'Tên team có thể đặt sau lưng hoặc tay áo. Cần chuẩn hóa danh sách trước khi in để tránh sai chính tả.'],
];

const quyTrinhLaySize = [
  ['Lập danh sách', 'Lập danh sách người tham gia.'],
  ['Gửi bảng size', 'Gửi bảng size đúng mẫu áo dự kiến.'],
  ['Thu size', 'Thu size bằng một biểu mẫu thống nhất.'],
  ['Đánh dấu trường hợp đặc biệt', 'Ghi chú riêng những trường hợp ngoài bảng size chuẩn.'],
  ['Kiểm tra dữ liệu', 'Kiểm tra dữ liệu trùng, thiếu hoặc sai.'],
  ['Chốt file size cuối cùng', 'Chốt một file size cuối cùng, không sửa thêm sau đó.'],
  ['Lưu file', 'Lưu file để đối chiếu khi nhận hàng.'],
];

const yeuToChiPhi = [
  'Kiểu áo',
  'Chất liệu và cấu hình mẫu',
  'Số lượng',
  'Cơ cấu nam nữ và size đặc biệt',
  'Thiết kế riêng hoặc mẫu có sẵn',
  'Kỹ thuật in/thêu',
  'Số vị trí logo, slogan và tên team',
  'Phụ kiện hoặc đóng gói riêng nếu có',
  'Phương án vận chuyển',
];

const quyTrinh12Buoc = [
  ['Tiếp nhận brief', 'Ngày tổ chức, địa điểm, hoạt động và số người.'],
  ['Xác định concept', 'Màu thương hiệu, chủ đề và đối tượng mặc.'],
  ['Chọn kiểu áo', 'Thun, polo hoặc thể thao.'],
  ['Tư vấn chất liệu', 'Theo thời tiết, mức vận động và thời gian mặc.'],
  ['Chọn màu', 'Đối chiếu màu và mẫu vải.'],
  ['Thiết kế mockup', 'Logo, slogan, tên chương trình và team.'],
  ['Chốt danh sách', 'Chuẩn hóa tên, team và số lượng.'],
  ['Chốt size', 'Dùng bảng size của đúng mẫu.'],
  ['Duyệt mẫu', 'Kiểm tra form, màu, logo và vị trí in/thêu.'],
  ['Sản xuất', 'Triển khai theo cấu hình đã duyệt.'],
  ['Kiểm tra chất lượng', 'Kiểm tra các hạng mục cần thiết trước bàn giao.'],
  ['Đóng gói và giao hàng', 'Phân size/team theo phương án đã thống nhất.'],
];

const loiThuongGap = [
  ['Chọn áo chỉ vì đẹp trên ảnh', 'Hậu quả: áo lên hình tốt nhưng không phù hợp khi vận động. Cách tránh: mô tả lịch trình trước khi chọn kiểu áo và chất liệu.'],
  ['Không tính đến vận động', 'Hậu quả: form hoặc cấu trúc áo gây khó chịu khi giơ tay, chạy hoặc chơi trò chơi. Cách tránh: kiểm tra mẫu bằng các động tác thực tế.'],
  ['Chọn màu chỉ trên màn hình', 'Hậu quả: màu thực tế không giống kỳ vọng. Cách tránh: kiểm tra mẫu vải và tương phản logo.'],
  ['Thiết kế quá nhiều chữ', 'Hậu quả: khó đọc từ xa và ảnh tập thể bị rối. Cách tránh: giữ một thông điệp chính và thông tin phụ ở mức cần thiết.'],
  ['Không thống nhất size', 'Hậu quả: thiếu size, nhầm người hoặc phải đổi gấp. Cách tránh: dùng một file size cuối cùng và có người chịu trách nhiệm duyệt.'],
  ['Không duyệt mẫu', 'Hậu quả: lỗi logo, màu, vị trí in hoặc form chỉ phát hiện khi sản xuất xong. Cách tránh: duyệt mockup và mẫu thật khi đơn hàng cần kiểm soát cao.'],
  ['Đặt quá sát ngày', 'Hậu quả: không còn thời gian xử lý sai size hoặc phát sinh sản xuất. Cách tránh: đưa hạng mục áo vào timeline ngay khi bắt đầu lập kế hoạch sự kiện.'],
];

const checklistGroups = [
  ['Thông tin chương trình', ['Ngày tổ chức', 'Địa điểm và điều kiện thời tiết', 'Chủ đề, slogan, hashtag', 'Lịch trình và mức vận động']],
  ['Nhân sự', ['Tổng số người', 'Cơ cấu nam/nữ/trẻ em nếu có', 'Danh sách size', 'Phân team hoặc phòng ban']],
  ['Thiết kế', ['Logo đúng file', 'Màu thương hiệu hoặc màu campaign', 'Vị trí logo', 'Slogan, tên chương trình, năm tổ chức']],
  ['Sản xuất', ['Kiểu áo', 'Chất liệu', 'Kỹ thuật in/thêu', 'Mẫu thiết kế đã duyệt', 'Mẫu thật nếu cần']],
  ['Bàn giao', ['File size cuối cùng', 'Cách phân túi theo người/team', 'Địa chỉ giao hàng', 'Người nhận', 'Deadline']],
];

const viSaoUnivi = [
  ['Nền tảng sản xuất và R&D', 'Univi công bố xưởng sản xuất 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất 100.000 sản phẩm/tháng. Website cũng giới thiệu hoạt động R&D liên quan đến chất liệu, form dáng, hiệu suất vận động và trải nghiệm người dùng.'],
  ['Tư vấn theo bối cảnh sử dụng', 'Một đơn hàng teambuilding nên bắt đầu bằng brief về địa điểm, hoạt động, thời tiết, số lượng và nhận diện. Từ đó mới chọn kiểu áo, chất liệu và thiết kế. Cách tiếp cận này giúp doanh nghiệp hạn chế quyết định chỉ dựa trên hình ảnh.'],
  ['Kiểm soát đơn hàng theo từng điểm duyệt', 'Website Univi mô tả quy trình từ lên ý tưởng, thiết kế mockup, chọn nguyên phụ liệu, sản xuất đến kiểm tra và duyệt mẫu. Với đơn hàng doanh nghiệp, việc có các điểm duyệt rõ giúp HR/Event kiểm soát logo, màu, size và thời điểm bàn giao.'],
];

const faqs = [
  [
    'Đồng phục Teambuilding là gì?',
    'Đồng phục Teambuilding là trang phục được thiết kế cho các chương trình gắn kết nội bộ như company trip, family day, kick-off và hoạt động sự kiện của doanh nghiệp. Cấu hình áo nên được lựa chọn theo người mặc, hoạt động, địa điểm, thời tiết và yêu cầu nhận diện thương hiệu.'
  ],
  [
    'Có nên làm đồng phục Teambuilding cho công ty không?',
    'Nên nếu doanh nghiệp cần hình ảnh tập thể đồng nhất, hỗ trợ nhận diện thành viên và tạo hình ảnh, video nhất quán trong chương trình. Giá trị của đồng phục không chỉ nằm ở chiếc áo mà còn ở khả năng phục vụ hoạt động và nhận diện thương hiệu.'
  ],
  [
    'Nên chọn áo thun, polo hay áo thể thao cho Teambuilding?',
    'Nên chọn theo lịch trình và mức độ vận động. Áo thun phù hợp với nhiều chương trình tập thể; polo phù hợp khi doanh nghiệp muốn hình ảnh chỉn chu hơn; áo thể thao có thể phù hợp với chương trình có nhiều hoạt động vận động. Không nên chọn một kiểu áo chỉ dựa trên hình ảnh mẫu.'
  ],
  [
    'Nên chọn chất liệu nào cho đồng phục Teambuilding?',
    'Nên chọn chất liệu dựa trên thời tiết, thời lượng mặc, mức độ vận động, địa điểm và ngân sách. Với chương trình ngoài trời hoặc vận động nhiều, cần ưu tiên cảm giác mặc, độ thoáng và khả năng xử lý ẩm phù hợp với cấu hình áo.'
  ],
  [
    'Đồng phục Teambuilding có phù hợp cho hoạt động ngoài trời không?',
    'Có. Tuy nhiên kiểu áo, chất liệu và form cần được lựa chọn theo thời tiết, cường độ hoạt động và thời lượng sử dụng. Một mẫu áo phù hợp cho hoạt động nhẹ có thể không phù hợp với chương trình vận động liên tục ngoài trời.'
  ],
  [
    'Có thể thiết kế đồng phục Teambuilding theo chủ đề sự kiện không?',
    'Có. Màu sắc, hình ảnh, logo, slogan và các chi tiết thiết kế có thể được xây dựng theo chủ đề của chương trình. Nên xác định chủ đề, màu nhận diện và bối cảnh sử dụng trước khi triển khai mockup.'
  ],
  [
    'Có thể in logo và slogan lên áo Teambuilding không?',
    'Có. Logo, slogan và thông điệp sự kiện có thể được triển khai bằng các kỹ thuật phù hợp với chất liệu và thiết kế. Số vị trí, kích thước và kỹ thuật in hoặc thêu nên được chốt trên mockup trước khi sản xuất.'
  ],
  [
    'Nên đặt logo ở vị trí nào trên áo Teambuilding?',
    'Vị trí logo phụ thuộc vào mục tiêu nhận diện và thiết kế tổng thể. Logo doanh nghiệp thường được đặt ở vị trí dễ nhìn; logo chương trình, slogan hoặc thông điệp có thể được bố trí ở mặt trước, mặt sau hoặc tay áo tùy cấu hình.'
  ],
  [
    'Có thể thiết kế áo nam và nữ riêng không?',
    'Có thể. Doanh nghiệp có thể giữ chung màu sắc, logo và hệ nhận diện nhưng sử dụng form nam và nữ riêng để phù hợp tỷ lệ cơ thể. Bảng size và mẫu thử nên được duyệt theo nhóm người mặc trước khi sản xuất hàng loạt.'
  ],
  [
    'Quy trình lấy size đồng phục Teambuilding cho nhiều người như thế nào?',
    'Nên lập danh sách người tham gia, gửi đúng bảng size của mẫu áo dự kiến, thu size bằng một biểu mẫu thống nhất, đánh dấu trường hợp đặc biệt, kiểm tra dữ liệu, chốt một file size cuối cùng và lưu file để đối chiếu khi nhận hàng.'
  ],
  [
    'Có nên duyệt áo mẫu trước khi sản xuất toàn bộ không?',
    'Nên, đặc biệt với đơn hàng đông người hoặc thiết kế riêng. Mẫu thực tế giúp kiểm tra form, chất liệu, màu sắc, logo và cách mặc trước khi sản xuất toàn bộ; mẫu đã duyệt cũng có thể được dùng làm mẫu đối chứng.'
  ],
  [
    'Chi phí đồng phục Teambuilding phụ thuộc vào những yếu tố nào?',
    'Chi phí phụ thuộc vào kiểu áo, chất liệu, số lượng, thiết kế, màu sắc, kỹ thuật in hoặc thêu, số vị trí thể hiện, yêu cầu làm mẫu, đóng gói và vận chuyển. Nên gửi brief đầy đủ để báo giá theo cùng một cấu hình.'
  ],
  [
    'Nên đặt đồng phục Teambuilding trước sự kiện bao lâu?',
    'Nên chốt càng sớm càng tốt vì thời gian thực tế còn phụ thuộc vào số lượng, mức độ tùy chỉnh, duyệt thiết kế, làm mẫu, sản xuất, kiểm tra và giao hàng. Doanh nghiệp nên xác định ngày cần nhận hàng ngay từ khi gửi brief.'
  ],
  [
    'UNIVI có nhận thiết kế đồng phục Teambuilding riêng không?',
    'Website Univi mô tả quy trình tiếp nhận yêu cầu, lên ý tưởng và thiết kế mockup để khách hàng xem trước. Khả năng và điều kiện áp dụng cần được xác nhận theo từng đơn hàng, số lượng và mức độ tùy chỉnh.'
  ],
  [
    'UNIVI có nhận đơn hàng Teambuilding số lượng lớn không?',
    'Univi công bố năng lực sản xuất gồm xưởng 2.000 m² tại phường Chương Mỹ, Hà Nội và công suất khoảng 100.000 sản phẩm mỗi tháng. Số lượng, tiến độ và cấu hình thực tế của đơn hàng Teambuilding cần được xác nhận theo từng dự án.'
  ],
  [
    'Có thể đặt lại cùng mẫu đồng phục Teambuilding cho chương trình sau không?',
    'Có thể nếu doanh nghiệp lưu lại mẫu chuẩn, màu sắc, chất liệu, form, bảng size, vị trí logo và file thiết kế. Việc lưu các thông số này giúp thuận tiện khi tổ chức chương trình tiếp theo hoặc đặt bổ sung.'
  ],
  [
    'UNIVI có giao đồng phục Teambuilding toàn quốc không?',
    'Univi cung cấp giải pháp đồng phục theo yêu cầu và hỗ trợ giao hàng theo từng dự án. Tiến độ và phương án giao hàng cần được xác nhận theo số lượng, địa điểm nhận hàng và lịch bàn giao của chương trình.'
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

function ImageBulletList({ items }) {
  return (
    <div className="grid gap-4">
      {items.map(([title, text, src, alt]) => (
        <div
          key={title}
          className="bg-white"
        >
          <h3 className="font-bold text-base mb-1">{title}</h3>
          <p className="mb-3">{text}</p>
          <div className="w-full overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={alt}
              width={800}
              height={400}
              sizes="100vw"
              className="w-full h-auto rounded-lg"
              quality={80}
            />
          </div>
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

export default function TeamBuildingUniviPage() {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-xl mb-4 leading-6">
              Đồng Phục Teambuilding
              <span className="text-yellow-300"> Cho Doanh Nghiệp</span>
            </h2>
            <p className="text-base text-white">
              Một chiếc áo có thể trông rất đẹp trên bản thiết kế nhưng lại không phù hợp khi cả đội phải di chuyển ngoài trời, chơi trò vận động hoặc mặc liên tục nhiều giờ. Đồng phục teambuilding nên được chuẩn bị như một hạng mục của chương trình, không phải việc mua áo bổ sung vào phút cuối - kiểu áo, chất liệu, form và thiết kế cần được chọn dựa trên người mặc, hoạt động, địa điểm và thời tiết.
            </p>
          </div>
        </div>

        {/* 1 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Đồng Phục Teambuilding Là Gì?
          </h2>
          <p className="text-base mb-3">
            Đồng phục teambuilding là trang phục được thiết kế cho các chương trình gắn kết nội bộ, company trip, family day, kick-off hoặc sự kiện doanh nghiệp. Các cách gọi phổ biến gồm áo teambuilding, áo team building công ty và áo đồng phục sự kiện.
          </p>
          <p className="text-base mb-3">
            Điểm đặc biệt của nhóm áo này là người mặc thường sử dụng trong một lịch trình có nhiều hoạt động khác nhau: di chuyển, chơi trò chơi, chụp ảnh, giao lưu hoặc tham gia hoạt động ngoài trời. Vì vậy, một chiếc áo phù hợp không chỉ cần đẹp mà còn phải dễ mặc, dễ nhận diện và phù hợp với điều kiện thực tế.
          </p>
          <p className="text-base">
            Đồng phục công sở ưu tiên hình ảnh lịch sự trong môi trường làm việc. Đồng phục thể thao chuyên dụng lại tập trung vào yêu cầu của từng bộ môn. Đồng phục teambuilding nằm ở giữa hai nhu cầu: giữ được nhận diện doanh nghiệp nhưng vẫn đủ linh hoạt cho hoạt động tập thể.
          </p>
        </article>
        <ArticleImage src="/polo-doanh-nghiep/polo-teambuilding.png" alt="Chọn áo thun, polo hay áo thể thao cho đồng phục teambuilding" />


        {/* 2 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Vì Sao Doanh Nghiệp Nên Sử Dụng Đồng Phục Teambuilding?
          </h2>
          <BulletGrid items={lyDoSuDung} cols="md:grid-cols-1" />
        </article>
        <ArticleImage src="/teambuilding/dong-phuc-teambuilding-bai-bien-tro-choi-tap-the.jpg" alt="Lý do doanh nghiệp nên sử dụng đồng phục teambuilding" />

        {/* 3 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Đồng Phục Teambuilding Khác Đồng Phục Công Sở Thế Nào?
          </h2>
          <SimpleTable headers={['Tiêu chí', 'Đồng phục công sở', 'Đồng phục teambuilding']} rows={soSanhTeambuilding} />
          <p className="text-base mt-3">
            Ranh giới này không tuyệt đối. Một company trip có phần hội nghị hoặc giao lưu đối tác có thể phù hợp polo. Một ngày hội vận động ngoài trời lại thường phù hợp áo thun hoặc áo thể thao hơn.
          </p>
        </article>
        <ArticleImage src="/teambuilding/dong-phuc-teambuilding-doanh-nghiep-tap-the.jpg" alt="So sánh đồng phục teambuilding và đồng phục công sở" />

        {/* 4 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Nên Chọn Áo Thun, Polo Hay Áo Thể Thao?
          </h2>
          <ImageBulletList items={chonLoaiAo} />
          <p className="text-base mt-3">
            Nếu cần tham khảo cách Univi phát triển sản phẩm theo mục đích vận động, có thể xem{' '}
            <Link href="/dong-phuc-the-thao" className="font-semibold text-[#105d97]">
              đồng phục thể thao doanh nghiệp
            </Link>
            .
          </p>
        </article>

        {/* 5 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Chọn Form Áo Theo Hoạt Động
          </h2>
          <BulletGrid items={chonForm} />
        </article>
        <ArticleImage src="/teambuilding/dong-phuc-teambuilding-tro-choi-bai-bien.jpg" alt="Chọn form áo đồng phục teambuilding theo hoạt động" />

        {/* 6 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Chọn Chất Liệu Theo Thời Tiết Và Thời Gian Mặc
          </h2>
          <p className="text-base mb-3">
            Đừng bắt đầu bằng câu hỏi "vải nào tốt nhất?". Hãy xác định trước: người mặc hoạt động bao lâu, ở đâu, thời tiết thế nào và có cần tiếp tục sử dụng áo sau chương trình hay không.
          </p>
          <SimpleTable headers={['Dòng chất liệu', 'Cảm giác / đặc điểm', 'Thoáng khí và quản lý ẩm', 'Bối cảnh sử dụng']} rows={bangChatLieu} />
          <p className="text-base mt-3">
            Các thông tin chi tiết hơn về công nghệ có thể xem tại{' '}
            <Link href="/cong-nghe-uni-dry" className="font-semibold text-[#105d97]">
              công nghệ UNI DRY
            </Link>
            . Thông số cụ thể cần xác nhận theo mẫu và cấu hình đơn hàng. Không nên chọn chất liệu chỉ vì tên gọi - hãy đặt chất liệu cạnh hoạt động, thời tiết, thời gian mặc và yêu cầu hình ảnh của chương trình.
          </p>
        </article>

        {/* 7 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            Thiết Kế Logo, Slogan Và Chủ Đề Chương Trình
          </h2>
          <BulletGrid items={thietKeLogo} cols="md:grid-cols-1" />
        </article>
        <ArticleImage src="/teambuilding/dong-phuc-teambuilding-hoat-dong-team-building-bai-bien.jpg" alt="Thiết kế logo, slogan và chủ đề đồng phục teambuilding" />

        {/* 8 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Chọn Màu Áo Teambuilding
          </h2>
          <div className="grid gap-1 md:grid-cols-1">
            {chonMauAo.map(([title, text]) => (
              <div key={title} className="bg-white rounded-xl">
                <h3 className="font-bold text-base mb-1">{title}</h3>
                <p>
                  {text.includes('<bangmau/>') ? (
                    <>
                      {text.split('<bangmau/>')[0]}
                      <Link href="/bang-mau" className="font-semibold text-[#105d97]">
                        bảng màu
                      </Link>
                      {text.split('<bangmau/>')[1]}
                    </>
                  ) : (
                    text
                  )}
                </p>
              </div>
            ))}
          </div>
        </article>
        <ArticleImage src="/teambuilding/dong-phuc-teambuilding-tap-the-cong-ty.jpg" alt="Chọn màu áo đồng phục teambuilding theo nhận diện thương hiệu" />

        {/* 9 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">9.</span>
            Các Mẫu Đồng Phục Teambuilding Phổ Biến
          </h2>
          <BulletGrid items={cacMauPhoBien} />
        </article>
        <ArticleImage src="/khach-hang/gofit/8.jpg" alt="Các mẫu đồng phục teambuilding phổ biến" />

        {/* 10 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">10.</span>
            Chọn Áo Theo Từng Bối Cảnh Chương Trình
          </h2>
          <BulletGrid items={chonTheoBoiCanh} cols="md:grid-cols-1" />
        </article>
        <ArticleImage src="/teambuilding/dong-phuc-teambuilding-cong-ty-tren-bai-bien.jpg" alt="Chọn áo teambuilding theo từng bối cảnh chương trình" />

        {/* 11 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">11.</span>
            Chia Áo Theo Team Hoặc Phòng Ban
          </h2>
          <BulletGrid items={chiaAoTheoTeam} />
        </article>
        <ArticleImage src="/khach-hang/fitcare/12.jpg" alt="Chia áo teambuilding theo team hoặc phòng ban" />

        {/* 12 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">12.</span>
            Quản Lý Size Cho Đơn Hàng Doanh Nghiệp
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">12.1 Không dùng một bảng size cho mọi mẫu</h3>
          <p className="text-base mb-3">
            Form, chất liệu và thông số từng mẫu có thể khác nhau. Không nên lấy một bảng size trên mạng làm bảng chính thức của Univi nếu chưa được xác nhận.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">12.2 Quy trình lấy size cho HR/Event</h3>
          <NumberedList items={quyTrinhLaySize} />
          <h3 className="text-lg md:text-xl font-bold mb-2">12.3 Có nên duyệt áo mẫu?</h3>
          <p className="text-base">
            Với đơn hàng đông người hoặc mẫu thiết kế riêng, nên xem hoặc duyệt mẫu trước khi sản xuất toàn bộ. Cần kiểm tra form, màu, logo, vị trí in và cảm giác mặc.
          </p>
        </article>
        <ArticleImage src="/images/gioi-thieu/che-do-hau-mai.jpg" alt="Quản lý size đồng phục teambuilding cho đơn hàng doanh nghiệp" />

        {/* 13 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">13.</span>
            Đặt Áo Trước Bao Lâu Và Chi Phí Phụ Thuộc Vào Đâu?
          </h2>
          <h3 className="text-lg md:text-xl font-bold mb-2">13.1 Khi nào nên bắt đầu?</h3>
          <p className="text-base mb-3">
            Không nên chờ sát ngày tổ chức mới làm áo. Số lượng, thiết kế, thu size, duyệt mẫu, sản xuất, kiểm tra chất lượng, đóng gói và vận chuyển đều cần thời gian.
          </p>
          <p className="text-base mb-3">
            Website Univi hiện công bố mẫu có sẵn có thể giao trong vòng 3 ngày, bao gồm thời gian in logo; đơn thiết kế có thời gian gia công mẫu trong vòng 2 ngày từ khi chốt mẫu rập. Đây là thông tin tham khảo trên website và không nên hiểu là cam kết áp dụng cho mọi đơn teambuilding - cần xác nhận theo số lượng và cấu hình thực tế.
          </p>
          <h3 className="text-lg md:text-xl font-bold mb-2">13.2 Chi phí phụ thuộc vào đâu?</h3>
          <p className="text-base mb-3">Chi phí thực tế thường phụ thuộc vào:</p>
          <div className="grid gap-1 md:grid-cols-2 mb-4">
            {yeuToChiPhi.map((item) => (
              <div key={item} className="bg-white rounded-xl p-3">
                <p>{item}</p>
              </div>
            ))}
          </div>
          <p className="text-base">
            Thay vì so sánh một mức giá không cùng cấu hình, doanh nghiệp nên gửi brief để nhận{' '}
            <Link href="/lien-he" className="font-semibold text-[#105d97]">
              tư vấn và báo giá
            </Link>
            .
          </p>
        </article>
        <ArticleImage src="/images/gioi-thieu/nang-luc-san-xuat.jpg" alt="Chi phí và thời gian đặt may đồng phục teambuilding" />

        {/* 14 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">14.</span>
            Quy Trình Đặt May Đồng Phục Teambuilding
          </h2>
          <p className="text-base mb-3">
            Quy trình dưới đây là khung tham khảo, cần xác nhận lại với tư vấn viên theo từng đơn hàng:
          </p>
          <NumberedList items={quyTrinh12Buoc} />
          <p className="text-base mt-3">
            Doanh nghiệp có thể xem thêm{' '}
            <Link href="/huong-dan-dat-hang" className="font-semibold text-[#105d97]">
              hướng dẫn đặt hàng
            </Link>{' '}
            trước khi gửi yêu cầu.
          </p>
        </article>
        <ArticleImage src="/so-mi-cong-so/quy-trinh-len-mau.jpg" alt="Quy trình đặt may đồng phục teambuilding tại Univi" />

        {/* 15 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">15.</span>
            Những Lỗi Thường Gặp Khi Đặt Áo
          </h2>
          <BulletGrid items={loiThuongGap} />
        </article>
        <ArticleImage src="/images/gioi-thieu/xuong-san-xuat.jpg" alt="Những lỗi thường gặp khi đặt may đồng phục teambuilding" />

        {/* 16 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">16.</span>
            Checklist Dành Cho HR/Event
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {checklistGroups.map(([group, items]) => (
              <div key={group} className="bg-white border border-slate-200 p-4">
                <h3 className="font-bold text-base mb-2">{group}</h3>
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item} className="text-base flex items-start gap-2">
                      <span className="mt-1 inline-block h-3 w-3 flex-shrink-0 border border-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </article>

        {/* 17 */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">17.</span>
            Vì Sao Nên Cân Nhắc Univi Cho Đơn Hàng B2B?
          </h2>
          <BulletGrid items={viSaoUnivi} cols="md:grid-cols-1" />
          <p className="text-base mt-3">
            Có thể xem thêm{' '}
            <Link href="/ho-so-nang-luc" className="font-semibold text-[#105d97]">
              hồ sơ năng lực Univi
            </Link>{' '}
            trước khi gửi brief.
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

        {/* FAQ */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">18.</span>
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

        {/* Kết luận */}
        <article className="bg-white mb-3">
          <h2 className="text-xl md:text-xl font-bold mb-2">Kết Luận</h2>
          <p className="text-base mb-3">
            Đặt đồng phục teambuilding cho doanh nghiệp không nên bắt đầu bằng việc chọn một mẫu áo đẹp nhất. Cách làm hiệu quả hơn là xác định chương trình tổ chức ở đâu, hoạt động gì, ai sẽ mặc, cần thể hiện thương hiệu thế nào và khi nào phải bàn giao.
          </p>
          <p className="text-base">
            Từ brief đó, doanh nghiệp mới chọn kiểu áo, chất liệu, form, màu, logo, size và phương án sản xuất. Khi các quyết định được chốt theo cùng một logic, chiếc áo vừa phục vụ hoạt động, vừa tạo hình ảnh đồng nhất cho chương trình. Nếu doanh nghiệp đang chuẩn bị company trip, family day hoặc chương trình teambuilding, có thể gửi brief cho Univi để được tư vấn và báo giá.
          </p>
        </article>

        {/* Đối tác Doanh nghiệp */}
        <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-6 mb-3 mt-4">
          <h2 className="text-xl md:text-xl font-bold mb-2 text-center text-gray-900">
            Đối Tác Doanh Nghiệp Đồng Hành Cùng Univi
          </h2>
          <p className="text-sm md:text-base text-gray-600 text-center mb-4">
            Các tập đoàn, doanh nghiệp và đối tác đã tin tưởng sản xuất đồng phục teambuilding tại Univi
          </p>
          <PartnersSection category="doanh-nghiep" />
        </section>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Đang Chuẩn Bị Brief May Đồng Phục Teambuilding?
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Hãy tổng hợp ngày tổ chức, địa điểm, hoạt động, số lượng, màu và logo trước khi gửi yêu cầu. <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> sẽ tư vấn cấu hình áo, kiểm tra khả năng phát triển mẫu và gửi báo giá theo đúng cấu hình đã thống nhất.
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
                Nhận tư vấn đồng phục teambuilding
              </button>
              <p className="text-white mt-3 font-medium">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </p>
            </div>
          </div>
        </div>

        <ContactForm
          source="Đồng phục teambuilding - Nhận tư vấn"
          isModal
          isOpen={isQuoteFormOpen}
          onClose={() => setIsQuoteFormOpen(false)}
        />
      </div>
    </div>
  );
}
