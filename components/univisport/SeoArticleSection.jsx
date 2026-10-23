import Link from 'next/link';
import Image from 'next/image';
import PartnersSection from './PartnersSection';
const SeoArticleSection = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Opening Section (Sapo) */}
        <article className="bg-white p-4 md:p-6 mb-6 border">

          <div className="space-y-3">
            <p className="text-base mb-2">
              Bạn là chủ chuỗi phòng tập, huấn luyện viên, đơn vị thương mại (sỉ), hay quản lý đội nhóm đang tìm kiếm nguồn hàng
              đồng phục thể thao ổn định, chất lượng cao với mức giá tối ưu? Đừng lãng phí thời gian và ngân sách với những sản phẩm
              kém chất lượng, nguồn gốc không rõ ràng, hay những đơn vị chỉ cung cấp áo thun thông thường.
            </p>
            <p className="text-base mb-2">
              <span className="font-semibold">Đồng phục Univi</span> ra đời với sứ mệnh giải quyết trọn vẹn những thách thức đó. Chúng tôi tự hào là
              <span className="font-semibold"> Thương hiệu Đồng phục Thể thao Việt</span>, với bề dày <span className="font-semibold">5 năm kinh nghiệm</span> chuyên sâu trong ngành sản xuất hàng may mặc.
            </p>
            <p className="text-base mb-4 font-semibold">
              Giải pháp của Univi nằm ở ba giá trị cốt lõi không thể thay thế:
            </p>
            <div className="grid gap-3">
              <div className="bg-gray-50 p-4 border">
                <h3 className="font-bold text-base mb-2">1. Công nghệ Độc quyền</h3>
                <p className="text-base">
                  Sở hữu các dòng vải kỹ thuật cao như <span className="font-semibold">Uni Dry</span> và <span className="font-semibold">UNIVI-SUPER COOL</span>, được nghiên cứu và chọn lọc từ các nhà máy lớn nhất trên thế giới.
                </p>
              </div>
              <div className="bg-gray-50 p-4 border">
                <h3 className="font-bold text-base mb-2">2. Sản xuất Khép kín (Giá gốc)</h3>
                <p className="text-base">
                  Kiểm soát chất lượng từ A đến Z tại xưởng riêng, loại bỏ hoàn toàn chi phí trung gian, đảm bảo bạn nhận được sản phẩm với mức giá tốt nhất.
                </p>
              </div>
            </div>
            <p className="text-base mt-4">
              Hãy cùng Univi khám phá giải pháp đồng phục thể thao toàn diện, giúp bạn nâng tầm thương hiệu và tăng trưởng bền vững.
            </p>
          </div>
        </article>

        {/* Section I: Core Differences - E-E-A-T Standards */}
        <article className="bg-white p-4 md:p-6 mb-6 border">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-lg ">I.</span>
            <h2 className="text-xl md:text-2xl font-bold">
              Sự khác biệt cốt lõi của đồng phục thể thao Univi
            </h2>
          </div>

          <p className="text-base mb-6">
            Univi không chỉ đơn thuần là một nhà sản xuất, mà còn là một đối tác chuyên môn, xây dựng niềm tin tuyệt đối với khách hàng B2B.
            Câu trả lời cho câu hỏi &quot;Tại sao Univi khác biệt?&quot; nằm ở sự đầu tư nghiêm túc vào chất lượng và quy trình.
          </p>

          {/* Subsection 1.1 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              1.1. Chất liệu Độc quyền và Cam kết An toàn Sức khỏe
            </h3>
            <p className="text-base mb-3">
              Độ tin cậy (Trustworthiness) của đồng phục Univi được xây dựng từ nguồn gốc và sự an toàn của vật liệu:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Nguồn gốc Quốc tế:</span>
                  <span className="ml-2">Tất cả các dòng vải Univi đều là độc quyền tại thị trường Việt Nam. Vải được nghiên cứu và chọn lọc từ các nhà máy sản xuất vải lớn nhất trên thế giới, những đơn vị chuyên cung cấp cho các thương hiệu thời trang thể thao lớn.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Cam kết An toàn Tuyệt đối:</span>
                  <span className="ml-2">Univi cam kết mạnh mẽ về sức khỏe người tiêu dùng. Tất cả sản phẩm đều được làm từ những chất liệu an toàn và đã được kiểm định nghiêm ngặt theo đúng quy định của Nhà nước.</span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Đa dạng Chuyên môn:</span>
                  <span className="ml-2">Univi sở hữu gần <span className="font-semibold">50 dòng vải thể thao chuyên dụng cao cấp</span>, được thiết kế để tối ưu hóa hiệu suất cho từng bộ môn cụ thể.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 1.1 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/gym/dong-phuc-gym-univi-nhom-7-nguoi-trang-den.jpg"

                alt="Đồng phục thể thao Univi kiểm định an toàn"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>

          {/* Subsection 1.2 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              1.2. Công nghệ Vải Chuyên sâu – Tối ưu Hiệu suất
            </h3>
            <p className="text-base mb-4">
              Chuyên môn (Expertise) của Univi được thể hiện qua các công nghệ vải kỹ thuật cao, vốn chỉ thường thấy ở các thương hiệu toàn cầu:
            </p>
            <div className="grid gap-3">
              <div className="bg-gray-50 p-4 border">
                <h4 className="font-bold text-base mb-2">
                  Uni Dry
                </h4>
                <p className="text-base">
                  Đây là công nghệ độc quyền giúp kiểm soát chuyển động một chiều của các phân tử nước. Nó cho phép hơi ẩm thoát ra ngoài và bay hơi nhanh chóng, mang lại cảm giác khô thoáng, mát mẻ cho người mặc.
                </p>
              </div>

              <div className="bg-gray-50 p-4 border">
                <h4 className="font-bold text-base mb-2">
                  UNIVI-DRY PRO
                </h4>
                <p className="text-base">
                  Dòng vải này cực kỳ phù hợp cho các hoạt động ngoài trời. Nó có đặc tính <span className="font-semibold">Cản Nắng – Cản Gió – Cản Bụi – Nhanh Khô</span>.
                </p>
              </div>

              <div className="bg-gray-50 p-4 border">
                <h4 className="font-bold text-base mb-2">
                  UNIVI-SUPER COOL
                </h4>
                <p className="text-base">
                  Dòng vải cao cấp chủ yếu từ sợi Polyamide. Nó mang lại cảm giác <span className="font-semibold">MỀM – MƯỢT – MÁT – MỊN</span>, là lựa chọn lý tưởng cho Yoga, Pilates và các bộ môn đòi hỏi sự co giãn cao.
                </p>
              </div>
            </div>
          </div>

          {/* Hình ảnh 1.2 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/gym/dong-phuc-gym-univi-kiem-dinh-chat-lieu-vai.jpg"
                alt="Công nghệ Uni Dry độc quyền trên vải đồng phục Univi giúp thoát ẩm nhanh chóng"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>

          {/* Subsection 1.3 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              1.3. Năng lực Sản xuất Khép kín (Uy tín & Giá Gốc)
            </h3>
            <p className="text-base mb-3">
              Uy tín (Authoritativeness) của Univi được củng cố bằng năng lực sản xuất vượt trội, loại bỏ rủi ro về chất lượng và chi phí:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Quy trình Kiểm soát Tuyệt đối:</span>
                  <span className="ml-2">Univi áp dụng quy trình sản xuất khép kín, kiểm soát chất lượng từ A đến Z.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Loại bỏ Trung gian:</span>
                  <span className="ml-2">Từ khâu nghiên cứu chất liệu, thiết kế mẫu mã đến sản xuất, Univi chủ động trong tất cả các khâu, loại bỏ hoàn toàn các chi phí trung gian không cần thiết.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Lợi ích Kinh tế:</span>
                  <span className="ml-2">Điều này giúp Univi tối ưu hóa chi phí sản xuất mà vẫn đảm bảo chất lượng cao nhất.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Năng lực Sản xuất:</span>
                  <span className="ml-2">Xưởng của Univi tọa lạc tại Phường Chương Mỹ, Thành phố Hà Nội, có diện tích <span className="font-semibold">2.000m²</span>, sẵn sàng đáp ứng các đơn hàng lớn với công suất lên đến <span className="font-semibold">100.000 sản phẩm mỗi tháng</span>.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 1.3 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/gioi-thieu/xuong-san-xuat.jpg"
                alt="Quy trình sản xuất đồng phục thể thao khép kín tại xưởng Univi phường Chương Mỹ, Hà Nội"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>
        </article>

        {/* Section II: Specialized Solutions by Sport */}
        <article className="bg-white p-4 md:p-6 mb-6 border">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-lg ">II.</span>
            <h2 className="text-xl md:text-2xl font-bold">
              Giải pháp Đồng phục Chuyên biệt theo Từng Bộ Môn
            </h2>
          </div>

          <p className="text-base mb-6">
            Univi không chỉ sản xuất đồng phục đại trà mà còn tạo ra những trang phục được &quot;may đo&quot; riêng cho từng bộ môn,
            tối ưu hóa hiệu suất và sự thoải mái cho người mặc.
          </p>

          {/* Subsection 2.1: Gym & MMA */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              2.1. Đồng phục Gym & MMA: Hỗ trợ Cơ bắp và Chống Ma sát
            </h3>
            <p className="text-base mb-3">
              Trong môi trường tập luyện cường độ cao, đồng phục Univi được thiết kế để giải phóng sức mạnh và bảo vệ cơ thể:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Hỗ trợ Cơ bắp:</span>
                  <span className="ml-2">Trang phục được nghiên cứu và thiết kế để tạo lực nén nhẹ lên cơ bắp, giúp tăng cường tuần hoàn máu. Lực nén này hỗ trợ cơ bắp hoạt động hiệu quả hơn, giảm tình trạng mệt mỏi, đau nhức, nguy cơ chuột rút và chấn thương trong quá trình tập luyện.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Chống Ma sát:</span>
                  <span className="ml-2">Sử dụng đường may phẳng (flatlock seams) giúp giảm thiểu tối đa sự cọ xát lên da, tránh gây kích ứng hay phồng rộp trong quá trình vận động mạnh.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Thấm hút và Nhanh khô:</span>
                  <span className="ml-2">Với các công nghệ vải như UNIVI-DRY PRO, trang phục giúp người mặc luôn khô ráo và thoáng mát, duy trì sự tập trung cao độ.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 2.1 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/gym/dong-phuc-gym-univi-nhom-5-nguoi-phong-gym.jpg"
                alt="Đồng phục Gym Univi thiết kế lực nén nhẹ, hỗ trợ cơ bắp và chống ma sát"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>

          {/* Subsection 2.2: Yoga & Pilates */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              2.2. Đồng phục Yoga & Pilates: &quot;Như Làn da Thứ hai&quot;
            </h3>
            <p className="text-base mb-3">
              Với các bộ môn đòi hỏi sự linh hoạt và kết nối cơ thể, chất liệu là yếu tố quyết định:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Chất liệu Chuyên biệt:</span>
                  <span className="ml-2">Đồng phục Yoga và Pilates của Univi với chất liệu UNIVI-SUPER COOL là lựa chọn hoàn hảo.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">&quot;Như làn da thứ hai&quot;:</span>
                  <span className="ml-2">Chất liệu mềm mại, mượt mà và mát mịn, ôm vừa vặn nhưng không gò bó, giúp người mặc hoàn toàn đắm chìm vào buổi tập.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Độ co giãn:</span>
                  <span className="ml-2">Độ đàn hồi cực cao (4 chiều) cho phép người mặc thực hiện mọi tư thế Yoga phức tạp hay chuỗi động tác Pilates một cách dễ dàng và chuẩn xác.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 2.2 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/yoga-5.webp"
                alt="Đồng phục Yoga Univi chất liệu Uni Super Cool co giãn 4 chiều hoàn hảo"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>

          {/* Subsection 2.3: Pickleball */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              2.3. Đồng phục Pickleball: Khô thoáng Tức thì và Phong cách
            </h3>
            <p className="text-base mb-3">
              Pickleball là môn thể thao hot, đòi hỏi tốc độ cao và sự thanh lịch của trang phục Polo/Tennis:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Giải pháp Thoát ẩm:</span>
                  <span className="ml-2">Ứng dụng <span className="font-semibold">UNIVI-QUICK DRY</span> giúp thấm hút và thoát hơi ẩm nhanh chóng, giải quyết tình trạng &quot;ướt sũng&quot; trên sân đấu.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Chất liệu Đa dụng:</span>
                  <span className="ml-2">Có thể ứng dụng dòng vải <span className="font-semibold">UNIVI-BLENDED</span> (kết hợp Polyester và Cotton) để tạo ra chất liệu nhanh khô, mềm mịn, mát, nhẹ, chống nhăn nhàu và rất bền màu.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Độ bền:</span>
                  <span className="ml-2">Chất liệu chống nhăn, giữ form dáng lịch sự, kết hợp hoàn hảo giữa tính năng thể thao và thẩm mỹ.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Tầm quan trọng:</span>
                  <span className="ml-2">Trang phục chuyên dụng giúp duy trì sự tập trung, tránh mất nước nhanh và giảm nguy cơ sốc nhiệt.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 2.3 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="https://live.staticflickr.com/65535/54895785772_f33da0245e_b.jpg"
                alt="Đồng phục Polo Pickleball Univi Uni Quick Dry, phong cách thanh lịch"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>

          {/* Subsection 2.4: Running & Cycling */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              2.4. Đồng phục Chạy bộ & Đạp xe: Bứt phá Giới hạn Tốc độ
            </h3>
            <p className="text-base mb-3">
              Đối với hoạt động ngoài trời, trang phục cần tối ưu hóa hiệu suất và bảo vệ môi trường:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Công nghệ Bảo vệ:</span>
                  <span className="ml-2">Ứng dụng <span className="font-semibold">UNIVI-DRY PRO</span> có khả năng cản nắng, cản gió và cản bụi, bảo vệ người mặc khỏi những tác động của môi trường ngoài trời.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Trọng lượng:</span>
                  <span className="ml-2">Giảm thiểu tối đa sức nặng không cần thiết, giúp người mặc di chuyển thanh thoát và tiết kiệm năng lượng trên từng cây số (trọng lượng siêu nhẹ).</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Giảm Ma sát:</span>
                  <span className="ml-2">Đường may phẳng giúp bảo vệ làn da nhạy cảm, tránh bị phồng rộp, một vấn đề thường gặp khi chạy các cự ly dài.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 2.4 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/chay-bo.jpg"
                alt="Đồng phục chạy bộ Univi vải UNIVI-DRY PRO cản nắng, cản gió"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>
        </article>

        {/* Section III: Strategic B2B Partner */}
        <article className="bg-white p-4 md:p-6 mb-6 border">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-bold text-lg ">III.</span>
            <h2 className="text-xl md:text-2xl font-bold">
              Univi – Đối tác Chiến lược cho Doanh nghiệp B2B
            </h2>
          </div>

          <p className="text-base mb-6">
            Univi không chỉ là một nhà cung cấp đồng phục; chúng tôi là đối tác chiến lược giúp các doanh nghiệp, phòng tập và đội nhóm
            giải quyết triệt để vấn đề nguồn hàng, chất lượng và nhận diện thương hiệu.
          </p>

          {/* Subsection 3.1 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              3.1. Giải pháp Toàn diện cho Phòng tập và Đội nhóm
            </h3>
            <p className="text-base mb-3">
              Univi cung cấp các giải pháp kinh doanh thông minh nhằm tối đa hóa hiệu quả cho đối tác:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Chuẩn hóa Hình ảnh:</span>
                  <span className="ml-2">Univi cung cấp giải pháp <span className="font-semibold">&quot;Smart Sports Uniform&quot;</span> để chuẩn hóa trang phục, giúp đồng bộ hóa hình ảnh của nhân viên, tạo sự chuyên nghiệp và uy tín cao trong mắt khách hàng.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Tiết kiệm Chi phí Vận hành:</span>
                  <span className="ml-2">Univi cung cấp sản phẩm có chất liệu tốt và độ bền cao, giúp các đối tác tiết kiệm chi phí đầu tư đồng phục hàng năm.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Tăng Lợi nhuận:</span>
                  <span className="ml-2">Phòng tập có thể cung cấp thêm sản phẩm đồng phục cho khách hàng đăng ký gói tập, tạo thêm doanh thu mà không tốn chi phí quảng cáo.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hình ảnh 3.1 */}
          <div className="my-6 text-center">
            <figure className="inline-block border">
              <Image
                src="/images/giai-phap-2s.jpg"
                alt="Đồng phục Univi giải pháp Smart Sport Uniform chuẩn hóa hình ảnh phòng tập"
                width={800}
                height={400}
                layout="responsive"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </figure>
          </div>

          {/* Subsection 3.2 */}
          <div className="mb-6 bg-gray-50 p-4 border">
            <h3 className="text-lg font-bold mb-3">
              3.2. Cá nhân hóa Linh hoạt: Đặt 10 Áo, Vẫn Có Thiết kế Riêng
            </h3>
            <p className="text-base mb-3">
              Univi loại bỏ rào cản về số lượng tối thiểu, tạo điều kiện cho các đội nhóm nhỏ và startup xây dựng thương hiệu riêng:
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-white border">
                <div>
                  <span className="font-semibold">Giải quyết rào cản số lượng:</span>
                  <span className="ml-2">Dù là team thể thao, startup hay văn phòng nhỏ, Univi mang đến giải pháp linh hoạt – sáng tạo – cá nhân hóa.</span>
                </div>
              </div>
              <div className="p-3 bg-white border">
                <div>
                  <span className="font-semibold">Đặc quyền Thiết kế:</span>
                  <span className="ml-2">Chỉ từ <span className="font-semibold">10 áo</span>, bạn đã được thiết kế riêng hoàn toàn miễn phí.</span>
                </div>
              </div>
              <div className="p-3 bg-white border">
                <div>
                  <span className="font-semibold">Khẳng định Chất riêng:</span>
                  <span className="ml-2">Univi cam kết thiết kế theo màu sắc – tinh thần – câu chuyện riêng của từng team, đảm bảo không dùng mẫu sẵn để tạo chất riêng cho đội ngũ của bạn.</span>
                </div>
              </div>
              <div className="p-3 bg-white border">
                <div>
                  <span className="font-semibold">Phạm vi ứng dụng:</span>
                  <span className="ml-2">Dù là <Link href="/dong-phuc-gym" className="text-blue-600 hover:underline">Đồng phục Gym</Link>, <Link href="/dong-phuc-pickleball" className="text-blue-600 hover:underline">Pickleball</Link>, <Link href="/dong-phuc-yoga-pilates" className="text-blue-600 hover:underline">Yoga</Link>, <Link href="/dong-phuc-chay-bo" className="text-blue-600 hover:underline">Chạy bộ</Link>, <Link href="/dong-phuc-pickleball" className="text-blue-600 hover:underline">Pickleball</Link>, hay là
                    <Link href="/dong-phuc-team-building" className="text-blue-600 hover:underline">Đồng phục Team building</Link> Univi luôn sẵn sàng lắng nghe mong muốn của bạn.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsection 3.3 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">
              3.3. Cam kết Giá trị và Uy tín Đã được Chứng minh
            </h3>
            <p className="text-base mb-3">
              Uy tín và kinh nghiệm của Univi là minh chứng rõ ràng nhất cho chất lượng sản phẩm và dịch vụ (E-E-A-T):
            </p>
            <div className="grid gap-2">
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Uy tín Doanh nghiệp:</span>
                  <span className="ml-2">Univi là nhà cung cấp lâu năm cho nhiều tập đoàn lớn và uy tín tại Việt Nam như <span className="font-semibold">Sun Group, Vingroup</span> và <span className="font-semibold">Tập đoàn Than Khoáng Sản Việt Nam</span>.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Hợp tác Toàn diện:</span>
                  <span className="ml-2">Univi không chỉ đơn thuần bán sản phẩm mà còn là đối tác đồng hành, tư vấn chiến lược marketing, xây dựng thương hiệu và phát triển sản phẩm.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 border">
                <div>
                  <span className="font-semibold">Giá trị Bền vững:</span>
                  <span className="ml-2">Bằng cách hợp tác với Univi, khách hàng đang góp phần thúc đẩy sản xuất nội địa và tạo việc làm cho người lao động Việt Nam. Univi cũng hướng tới mục tiêu trở thành thương hiệu thể thao quốc dân.</span>
                </div>
              </div>
            </div>
          </div>

          <PartnersSection />
        </article>

        {/* Section IV: Conclusion & CTA */}
        <div className="bg-[#105d97] text-white p-6 mt-6 border">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Liên Hệ Ngay Để Nhận Tư Vấn Chuyên Nghiệp!
              </h3>
              <p className="text-base text-blue-100 max-w-5xl mx-auto mb-3">
                Univi không chỉ đơn thuần là một nhà sản xuất đồng phục thể thao, mà là một đối tác chiến lược, cung cấp các
                giải pháp toàn diện và chuyên biệt cho từng nhu cầu.
              </p>
              <p className="text-base text-blue-100 max-w-5xl mx-auto mb-3">
                <span className="font-semibold">Tóm tắt Giá trị:</span> Với cam kết về chất lượng, công nghệ độc quyền và quy trình sản xuất khép kín,
                Univi mang đến những sản phẩm có giá trị vượt xa số tiền khách hàng bỏ ra. Chúng tôi cam kết mang đến sản phẩm
                không chỉ có tính thẩm mỹ cao mà còn tối ưu hóa hiệu suất và sự thoải mái cho người mặc.
              </p>
              <p className="text-base text-blue-100 max-w-5xl mx-auto mb-3">
                <span className="font-semibold">Giá trị bền vững:</span> Bằng cách hợp tác với Univi, khách hàng đang góp phần thúc đẩy sản xuất nội địa
                và tạo việc làm cho người lao động Việt Nam.
              </p>
              <p className="text-base text-blue-100 mb-4">
                Đừng để trang phục cản trở hiệu suất! Đã đến lúc nâng cấp trải nghiệm luyện tập và khẳng định phong cách riêng,
                dù là cho cá nhân, đội nhóm Pickleball, hay chuỗi phòng tập của bạn.
              </p>
            </div>

            <div className="text-center mb-6">
              <h4 className="text-lg font-bold mb-4">
                UNIVI – TIÊN PHONG ĐỒNG PHỤC THỂ THAO TẠI VIỆT NAM
              </h4>
              <div className="space-y-2 text-blue-100">
                <p className="text-base">
                  <span className="font-semibold">Hotline:</span> <a href="tel:0834204999" className="text-yellow-300 hover:text-yellow-200 underline">0834.204.999</a>
                </p>
                <p className="text-base">
                  <span className="font-semibold">Website:</span> <a href="https://dongphucunivi.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 underline">https://dongphucunivi.com/</a>
                </p>
                <p className="text-base">
                  <span className="font-semibold">Fanpage:</span> <a href="https://web.facebook.com/Dongphucunivi" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-200 underline">https://web.facebook.com/Dongphucunivi</a>
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-white/20 text-white px-3 py-2 border font-bold text-sm">
                Đồng phục Univi – Your Uniform, Your Brand!
              </div>
              <p className="text-blue-100 mt-2 font-medium">
                Tự tin bứt phá mọi giới hạn cùng đồng phục thể thao chuyên nghiệp!
              </p>
            </div>
          </div>
        </div>

        {/* SEO Keywords (hidden) */}
        <div className="sr-only">
          <p>
            Keywords: đồng phục thể thao, đồng phục gym, đồng phục yoga, đồng phục pickleball, đồng phục HLV, áo polo thể thao, nguồn phôi áo gym, đồng phục Univi
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeoArticleSection;

