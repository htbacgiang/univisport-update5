import Link from 'next/link';
import Image from 'next/image';

export default function OfficeUniviPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 leading-6">
              Đồng Phục Công Sở Chuyên Nghiệp
              <span className="text-yellow-300"> Nâng Tầm Hình Ảnh Doanh Nghiệp</span>
            </h2>
            <p className="text-base md:text-lg text-white">
              Khám phá bộ sưu tập đồng phục công sở cao cấp từ Đồng Phục Univi - Giải pháp toàn diện cho doanh nghiệp, tổ chức và đội nhóm chuyên nghiệp
            </p>
          </div>
        </div>

        {/* Main Content */}
        <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">1.</span>
            Tại Sao Lựa Chọn Đồng Phục Công Sở Là Điều Cần Thiết?
          </h2>

          <div className="space-y-3">
            <p className="text-base">
              Trong bối cảnh kinh tế hội nhập và cạnh tranh ngày càng gay gắt, việc xây dựng một hình ảnh doanh nghiệp chuyên nghiệp, đáng tin cậy và mang đậm bản sắc văn hóa riêng là yếu tố then chốt dẫn đến thành công. Đồng phục công sở, vượt xa ý nghĩa của một trang phục thông thường, đã trở thành một công cụ chiến lược, một phần không thể thiếu trong việc kiến tạo và khẳng định vị thế của mỗi tổ chức.
            </p>
            <p className="text-base">
              Khác biệt hoàn toàn với quần áo thông thường, <span className="font-semibold">đồng phục công sở chuyên dụng</span> được thiết kế và sản xuất với những tính năng ưu việt. Đầu tư vào đồng phục công sở chất lượng mang lại nhiều lợi ích không ngờ:
            </p>
          </div>

          <div className="grid gap-1 mt-4">
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-1">Xây dựng hình ảnh chuyên nghiệp, uy tín và đáng tin cậy</h3>
              <p className="text-base">Một đội ngũ nhân viên xuất hiện trong những bộ đồng phục lịch sự, đồng bộ ngay lập tức tạo dựng được thiện cảm và niềm tin nơi khách hàng, đối tác, thể hiện sự tôn trọng và thái độ làm việc nghiêm túc của doanh nghiệp.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-1">Thể hiện sự đồng bộ, gắn kết và sức mạnh của một tập thể vững mạnh</h3>
              <p className="text-base">Đồng phục giúp xóa bỏ những khác biệt không cần thiết về trang phục cá nhân, tạo nên một hình ảnh thống nhất, có tổ chức, từ đó thúc đẩy tinh thần đoàn kết và hợp tác trong nội bộ.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-1">Nâng cao hiệu quả nhận diện và quảng bá thương hiệu</h3>
              <p className="text-base">Logo, màu sắc chủ đạo của doanh nghiệp được thể hiện một cách tinh tế trên đồng phục chính là một công cụ marketing trực quan, giúp tăng cường khả năng nhận diện và ghi nhớ thương hiệu ở mọi điểm tiếp xúc.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-1">Tạo dựng sự tự tin và phong thái chuyên nghiệp cho mỗi nhân viên</h3>
              <p className="text-base">Khi được trang bị những bộ đồng phục vừa vặn, thoải mái và có tính thẩm mỹ cao, nhân viên sẽ cảm thấy tự tin hơn trong giao tiếp, tự hào hơn về tổ chức mình đang cống hiến, từ đó nâng cao hiệu quả công việc và chất lượng dịch vụ.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-1">Góp phần kiến tạo một môi trường làm việc tích cực, có kỷ luật và văn minh</h3>
              <p className="text-base">Sự đồng bộ trong trang phục thể hiện sự tôn trọng quy tắc chung, tạo nên một không gian làm việc ngăn nắp, chuyên nghiệp và có tổ chức.</p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
              <h3 className="font-bold text-base mb-1">Hỗ trợ phân biệt các bộ phận, phòng ban trong tổ chức</h3>
              <p className="text-base">Thông qua các chi tiết thiết kế hoặc màu sắc khác biệt một cách tinh tế, đồng phục giúp tạo ra sự phân biệt rõ ràng giữa các bộ phận trong tổ chức.</p>
            </div>
          </div>
        </article>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-chuyen-nghiep.jpg"
              alt="Nhân viên trong đồng phục công sở Univi, thể hiện sự chuyên nghiệp và bản sắc doanh nghiệp"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
              priority={true}
            />
          </figure>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">2.</span>
            Univi – Đối Tác Chiến Lược Mang Đến Giải Pháp Đồng Phục Công Sở Toàn Diện và Đẳng Cấp
          </h2>
          <p className="text-base mb-2">
            Với sự thấu hiểu sâu sắc về vai trò và những yêu cầu khắt khe đối với đồng phục trong môi trường công sở hiện đại, Đồng Phục Univi tự hào là đơn vị xưởng may chuyên cung cấp đồng phục thể thao, đồng phục công ty, đồng phục công sở, áo polo, áo sơ mi văn phòng cao cấp,… Chúng tôi không chỉ cung cấp sản phẩm, mà mang đến những giải pháp đồng phục toàn diện, được &quot;may đo&quot; theo từng nhu cầu và bản sắc riêng của mỗi doanh nghiệp.
          </p>
          <p className="text-base mb-2">
            Trải qua hơn 8 năm hình thành và phát triển không ngừng, Univi đã khẳng định được vị thế và uy tín của mình, trở thành một cái tên quen thuộc trong ngành thời trang đồng phục, là đối tác chiến lược được tin tưởng lựa chọn bởi hàng trăm doanh nghiệp, tập đoàn và đội nhóm như: Sun Group, Premier Village, Sun World, Thanh Cong Group, Tập đoàn Than Khoáng Sản Việt Nam, KickFit Sport, Fitcare, Yoko Onsen Quang Hanh,… Sự tín nhiệm từ các thương hiệu hàng đầu này chính là sự bảo chứng đanh thép nhất cho năng lực sản xuất, chất lượng sản phẩm vượt trội và dịch vụ chuyên nghiệp mà Univi luôn nỗ lực mang lại.
          </p>
          <p className="text-base mb-2">Cam kết vàng từ Univi, nền tảng cho sự tin tưởng của mọi khách hàng:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Chất lượng sản phẩm là danh dự và ưu tiên tuyệt đối của thương hiệu:</span> Univi kiên định với một chính sách khác biệt và đầy trách nhiệm: &quot;Đồng Phục Univi không chỉ đáp ứng yêu cầu mà còn cam kết không tính phí nếu sản phẩm không đạt chuẩn. Đây là cam kết duy nhất của chúng tôi.&quot;</li>
            <li className="text-base"><span className="font-semibold">Sự am hiểu sâu sắc về đặc thù ngành nghề và văn hóa của từng doanh nghiệp:</span> Đội ngũ chuyên gia của Univi không chỉ giỏi về chuyên môn thiết kế và may mặc, mà còn luôn chủ động lắng nghe, tìm hiểu kỹ lưỡng về đặc thù hoạt động, môi trường làm việc cụ thể và những giá trị văn hóa cốt lõi của từng doanh nghiệp.</li>
          </ul>
        </div>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-doi-tac-uy-tin.jpg"
              alt="Đồng phục công sở Univi với thiết kế tinh tế, chất liệu cao cấp, khẳng định uy tín doanh nghiệp"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
            />
          </figure>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">3.</span>
            Tiêu Chuẩn Vượt Trội Trong Từng Thiết Kế và Chất Liệu Đồng Phục Công Sở Univi
          </h2>
          <p className="text-base mb-2">
            Mỗi bộ đồng phục công sở mang thương hiệu Univi là sự kết tinh hoàn hảo giữa yếu tố thẩm mỹ tinh tế, công năng sử dụng tối ưu và chất lượng vật liệu vượt trội, được chăm chút tỉ mỉ đến từng chi tiết.
          </p>
          <h3 className="text-xl font-bold mb-2">Chất Liệu Vải Cao Cấp – Nền Tảng Của Sự Sang Trọng, Bền Đẹp và Thoải Mái</h3>
          <p className="text-base mb-2">
            Univi đặc biệt khắt khe trong việc lựa chọn chất liệu vải, bởi chúng tôi hiểu rằng đây là yếu tố then chốt quyết định đến vẻ đẹp sang trọng, độ bền vượt trội và cảm giác thoải mái thực sự của mỗi bộ đồng phục. Chúng tôi ưu tiên các dòng vải cao cấp, có nguồn gốc xuất xứ rõ ràng, được kiểm định chất lượng, phù hợp với tính chất công việc thường xuyên phải giao tiếp, di chuyển và yêu cầu cao về hình ảnh của nhân viên công sở:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Đối với Áo Sơ Mi Công Sở:</span> Univi tư vấn và cung cấp các lựa chọn vải như Kate Ford, Kate Silk, Kate Mỹ, Lon Mỹ, Bamboo (vải sợi tre tự nhiên), Modal... Đây là những chất liệu nổi bật với bề mặt vải mềm mại, khả năng ít nhăn nhàu, độ thoáng mát cao, khả năng thấm hút mồ hôi tốt, đồng thời giữ form áo chuẩn mực, mang lại vẻ ngoài lịch lãm và chuyên nghiệp.</li>
            <li className="text-base"><span className="font-semibold">Đối với Quần Tây, Chân Váy, Vest Công Sở:</span> Chúng tôi ưu tiên các chất liệu như Tuytsi, Cashmere, Kaki thun, Wool blend (vải len pha cao cấp), Nano, Ruby... Những dòng vải này đảm bảo độ đứng dáng cần thiết, có độ co giãn nhẹ mang lại sự thoải mái khi vận động, không bị xù lông hay bai dão sau thời gian sử dụng, bền màu và tạo nên vẻ ngoài sang trọng, quyền lực.</li>
            <li className="text-base"><span className="font-semibold">Đối với Áo Dài Công Sở:</span> Univi lựa chọn các chất liệu truyền thống và cao cấp như Lụa tơ tằm tự nhiên, lụa tổng hợp cao cấp, gấm, voan... với sự mềm mại, thướt tha, bay bổng và sang trọng, phù hợp với những dịp đặc biệt hoặc yêu cầu về trang phục mang đậm bản sắc văn hóa.</li>
            <li className="text-base"><span className="font-semibold">Bên cạnh đó:</span> Univi cũng có kinh nghiệm và năng lực cung cấp các dòng vải cao cấp khác như Cotton 100% (cho sự thoải mái tối đa), Polyester cao cấp (PET) (cho độ bền và dễ bảo quản), Polyamide và sẽ tư vấn cụ thể cho từng loại trang phục, đảm bảo phù hợp nhất với yêu cầu và ngân sách của quý khách.</li>
          </ul>
          <p className="text-base mb-2">Đặc tính chung của các chất liệu được Univi ưu tiên lựa chọn:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base">Khả năng giữ form dáng tốt, chống nhăn hiệu quả giúp duy trì vẻ ngoài chỉn chu suốt ngày dài.</li>
            <li className="text-base">Bề mặt vải sang trọng, tinh tế, độ bền màu vượt trội.</li>
            <li className="text-base">Dễ dàng trong việc giặt ủi và bảo quản.</li>
            <li className="text-base">Đảm bảo sự thoải mái tối đa cho người mặc trong mọi điều kiện làm việc.</li>
          </ul>
          <p className="text-base mb-2">
            Bảng màu phong phú, đa dạng và thời thượng: Univi cung cấp một bảng màu đa dạng, từ những gam màu công sở truyền thống, kinh điển (trắng, đen, xanh navy, xám chì) đến những màu sắc hiện đại, trẻ trung, hợp xu hướng, đảm bảo phù hợp với màu sắc nhận diện thương hiệu và thông điệp mà từng doanh nghiệp muốn truyền tải.
          </p>
          <h3 className="text-xl font-bold mb-2">Thiết Kế Tinh Tế - Form Dáng Chuẩn Mực – Khẳng Định Phong Cách Chuyên Nghiệp</h3>
          <p className="text-base mb-2">
            Đội ngũ thiết kế của Univi là những chuyên gia tài năng, giàu kinh nghiệm, không ngừng sáng tạo và cập nhật những xu hướng thời trang công sở trong nước và quốc tế. Quan trọng hơn cả, chúng tôi luôn thấu hiểu tầm quan trọng của việc tạo dựng một hình ảnh chuyên nghiệp, đồng bộ và mang đậm bản sắc văn hóa riêng cho mỗi doanh nghiệp thông qua đồng phục.
          </p>
          <h4 className="text-xl font-bold mb-2">Đa dạng các loại hình đồng phục công sở, đáp ứng mọi vị trí và nhu cầu:</h4>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Áo Sơ Mi (Nam/Nữ):</span> Từ kiểu dáng Classic truyền thống, Regular-fit thoải mái đến Slim-fit hiện đại, trẻ trung. Đa dạng lựa chọn về kiểu cổ áo (cổ Đức lịch sự, cổ Tàu thanh lịch, cổ giai điệu thời trang) và kiểu tay áo (dài tay chuyên nghiệp, tay lỡ năng động, tay ngắn thoải mái cho mùa hè).</li>
            <li className="text-base"><span className="font-semibold">Quần Tây (Nam/Nữ):</span> Thiết kế với nhiều kiểu dáng như dáng đứng (Straight-leg) cổ điển, dáng ôm (Slim-fit) hiện đại, ống côn (Tapered) trẻ trung, hoặc ống rộng (Wide-leg) phá cách (tùy theo xu hướng và yêu cầu cụ thể của doanh nghiệp).</li>
            <li className="text-base"><span className="font-semibold">Chân Váy (Nữ):</span> Các kiểu dáng phổ biến và thanh lịch như chân váy bút chì tôn dáng, chân váy chữ A trẻ trung, năng động, hoặc chân váy xòe duyên dáng (với chiều dài được cân nhắc kỹ lưỡng để phù hợp với môi trường công sở).</li>
            <li className="text-base"><span className="font-semibold">Bộ Vest (Nam/Nữ):</span> Biểu tượng của sự sang trọng, lịch lãm và quyền lực trong môi trường kinh doanh. Univi mang đến các thiết kế vest một hàng cúc hoặc hai hàng cúc, với kiểu dáng ve áo đa dạng (ve nhọn hiện đại, ve chữ K cá tính, ve cổ điển) và đường cắt may chuẩn xác, tôn vinh vóc dáng người mặc.</li>
            <li className="text-base"><span className="font-semibold">Đầm Liền Công Sở (Nữ):</span> Những thiết kế đầm liền thanh lịch, kín đáo, vừa vặn tôn dáng, mang lại vẻ đẹp chuyên nghiệp, nữ tính và cuốn hút cho nhân viên nữ.</li>
            <li className="text-base"><span className="font-semibold">Áo Dài Công Sở (Nữ):</span> Một lựa chọn trang phục mang đậm bản sắc văn hóa Việt Nam, thường được thiết kế kết hợp hài hòa giữa nét đẹp truyền thống và những yếu tố cách tân hiện đại, phù hợp cho các dịp lễ quan trọng, các sự kiện đặc biệt của công ty.</li>
          </ul>
          <h4 className="text-xl font-bold mb-2">Màu Sắc và Họa Tiết Được Tư Vấn Kỹ Lưỡng, Đồng Bộ Hoàn Hảo Với Nhận Diện Thương Hiệu:</h4>
          <p className="text-base mb-2">
            Đội ngũ chuyên gia thiết kế và tư vấn của Univi sẽ làm việc chặt chẽ, trao đổi kỹ lưỡng với quý doanh nghiệp để thấu hiểu về màu sắc chủ đạo trong bộ nhận diện thương hiệu, không gian kiến trúc của văn phòng làm việc, cũng như thông điệp và hình ảnh mà doanh nghiệp muốn truyền tải.
          </p>
          <h4 className="text-xl font-bold mb-2">Đảm Bảo Sự Thoải Mái Tối Đa Cho Người Mặc Trong Mọi Hoạt Động Công Sở:</h4>
          <p className="text-base mb-2">
            Univi hiểu rằng, nhân viên công sở thường xuyên phải ngồi làm việc trong thời gian dài, di chuyển giữa các phòng ban, hoặc tham gia các cuộc họp quan trọng. Do đó, các thiết kế đồng phục của chúng tôi luôn đặt yếu tố thoải mái và tiện dụng lên hàng đầu.
          </p>
        </div>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-chat-lieu-cao-cap.jpg"
              alt="Đồng phục công sở Univi với chất liệu sang trọng, form dáng chuẩn, mang lại sự thoải mái"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
            />
          </figure>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">4.</span>
            Những Lợi Ích Vượt Trội và Thiết Thực Khi Doanh Nghiệp Trang Bị Đồng Phục Công Sở
          </h2>
          <p className="text-base mb-2">
            Đầu tư vào giải pháp đồng phục công sở toàn diện và chất lượng cao từ Univi không chỉ đơn thuần là một khoản chi phí hoạt động, mà chính là một sự đầu tư chiến lược, mang lại nhiều lợi ích thiết thực, giá trị và bền vững:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Nâng tầm hình ảnh, uy tín và đẳng cấp của thương hiệu:</span> Một đội ngũ nhân viên xuất hiện trong những bộ đồng phục công sở được thiết kế đồng bộ, chỉn chu, lịch sự và mang tính thẩm mỹ cao sẽ ngay lập tức tạo dựng được một ấn tượng mạnh mẽ, tích cực.</li>
            <li className="text-base"><span className="font-semibold">Tăng cường tính chuyên nghiệp, sự đồng bộ và tinh thần gắn kết:</span> Đồng phục giúp xóa bỏ những khoảng cách không cần thiết về trang phục cá nhân giữa các nhân viên, tạo ra một hình ảnh thống nhất, chuyên nghiệp.</li>
            <li className="text-base"><span className="font-semibold">Đóng vai trò như một công cụ marketing hiệu quả:</span> Mỗi nhân viên trong bộ đồng phục mang logo và màu sắc đặc trưng của thương hiệu chính là một &quot;đại sứ di động&quot;, một kênh quảng bá trực quan.</li>
            <li className="text-base"><span className="font-semibold">Nâng cao tinh thần làm việc, sự tự tin, lòng tự hào:</span> Khi được khoác lên mình những bộ đồng phục công sở chất lượng, vừa vặn, thoải mái và đẹp mắt, mỗi nhân viên sẽ cảm thấy được doanh nghiệp thực sự quan tâm.</li>
            <li className="text-base"><span className="font-semibold">Giải pháp tối ưu về chi phí trong dài hạn:</span> Các sản phẩm đồng phục công sở được Univi may từ những chất liệu vải cao cấp, kết hợp với kỹ thuật gia công tỉ mỉ sẽ có độ bền vượt trội.</li>
          </ul>
        </div>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-nang-tam-thuong-hieu.jpg"
              alt="Đội ngũ nhân viên trong đồng phục công sở Univi, nâng tầm hình ảnh và thương hiệu doanh nghiệp"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
            />
          </figure>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">5.</span>
            Danh Mục Giải Pháp Đồng Phục Công Sở Toàn Diện Từ Univi
          </h2>
          <p className="text-base mb-2">
            Univi tự hào cung cấp một danh mục đa dạng các sản phẩm đồng phục công sở, được thiết kế và may đo để đáp ứng mọi nhu cầu, phù hợp với mọi vị trí công việc và phong cách đặc trưng của các doanh nghiệp hiện đại:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Áo Sơ Mi Công Sở (Dành cho Nam và Nữ):</span> Kiểu dáng: Classic, Slim-fit, Regular-fit. Thiết kế cổ áo: Cổ Đức, cổ Tàu, cổ cách điệu. Kiểu tay áo: Dài tay, tay lỡ, tay ngắn.</li>
            <li className="text-base"><span className="font-semibold">Quần Tây Công Sở (Dành cho Nam và Nữ):</span> Kiểu dáng: Dáng đứng, dáng ôm, ống côn, ống rộng.</li>
            <li className="text-base"><span className="font-semibold">Chân Váy Công Sở (Dành cho Nữ):</span> Kiểu dáng: Chân váy bút chì, chữ A, xòe.</li>
            <li className="text-base"><span className="font-semibold">Bộ Vest Công Sở (Dành cho Nam và Nữ):</span> Thiết kế: Một hàng cúc, hai hàng cúc; ve áo: nhọn, chữ K, cổ điển.</li>
            <li className="text-base"><span className="font-semibold">Đầm Liền Công Sở (Dành cho Nữ):</span> Thanh lịch, kín đáo, tôn dáng.</li>
            <li className="text-base"><span className="font-semibold">Áo Dài Công Sở (Dành cho Nữ):</span> Kết hợp truyền thống và hiện đại.</li>
            <li className="text-base"><span className="font-semibold">Áo Polo Công Sở:</span> Có thể tích hợp từ trang sản phẩm riêng.</li>
            <li className="text-base"><span className="font-semibold">Các Loại Phụ Kiện Đồng Phục Đi Kèm:</span> Cà vạt, nơ cài áo, khăn lụa, kẹp cà vạt, bảng tên nhân viên.</li>
          </ul>
        </div>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-da-dang-kieu-dang.jpg"
              alt="Bộ sưu tập đồng phục công sở Univi đa dạng: sơ mi, vest, chân váy, áo dài, phù hợp mọi doanh nghiệp"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
            />
          </figure>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">6.</span>
            Quy Trình Tư Vấn, Thiết Kế và May Đo Đồng Phục Công Sở Chuyên Nghiệp
          </h2>
          <p className="text-base mb-2">
            Univi tự hào xây dựng và áp dụng một quy trình làm việc khoa học, chuyên nghiệp và hoàn toàn minh bạch:
          </p>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Tiếp Nhận Yêu Cầu và Khảo Sát Nhu Cầu:</span> Lắng nghe và thu thập chi tiết về phong cách, số lượng, ngân sách, đặc thù ngành nghề, văn hóa doanh nghiệp.</li>
            <li className="text-base"><span className="font-semibold">Tư Vấn Chuyên Sâu và Đề Xuất Giải Pháp:</span> Đưa ra đề xuất về kiểu dáng, chất liệu, màu sắc phù hợp.</li>
            <li className="text-base"><span className="font-semibold">Thiết Kế Mẫu Sáng Tạo:</span> Tạo mẫu 2D/3D, điều chỉnh không giới hạn.</li>
            <li className="text-base"><span className="font-semibold">Sản Xuất Mẫu Thực Tế:</span> Hỗ trợ may mẫu để kiểm tra chất lượng, form dáng.</li>
            <li className="text-base"><span className="font-semibold">Ký Kết Hợp Đồng và Sản Xuất:</span> Triển khai sản xuất với quy trình kiểm soát chặt chẽ.</li>
            <li className="text-base"><span className="font-semibold">Kiểm Tra Chất Lượng (KCS):</span> Kiểm tra tỉ mỉ từng chi tiết trước khi bàn giao.</li>
            <li className="text-base"><span className="font-semibold">Giao Hàng Đúng Tiến Độ:</span> Giao hàng an toàn, đúng hạn trên toàn quốc.</li>
            <li className="text-base"><span className="font-semibold">Chính Sách Bảo Hành và Hậu Mãi:</span> Hỗ trợ nhanh chóng, đảm bảo hài lòng.</li>
          </ol>
        </div>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/quy-trinh-dat-may-dong-phuc-cong-so-univi.jpg"
              alt="Quy trình may đo đồng phục công sở Univi chuyên nghiệp, minh bạch và tận tâm"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
            />
          </figure>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">7.</span>
            Tại Sao Univi Là Sự Lựa Chọn Hàng Đầu và Đối Tác Chiến Lược
          </h2>
          <p className="text-base mb-2">
            Sự tín nhiệm từ hàng trăm đối tác lớn như Sun Group, Premier Village, Thanh Cong Group là minh chứng cho giá trị mà Univi mang lại:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className="text-base"><span className="font-semibold">Kinh nghiệm dày dặn và uy tín:</span> Hơn 8 năm đáp ứng đơn hàng quy mô lớn.</li>
            <li className="text-base"><span className="font-semibold">Chất lượng sản phẩm vượt trội:</span> Từ chất liệu đến kỹ thuật may.</li>
            <li className="text-base"><span className="font-semibold">Thiết kế chuyên nghiệp, sáng tạo:</span> Cập nhật xu hướng, tôn vinh bản sắc doanh nghiệp.</li>
            <li className="text-base"><span className="font-semibold">Giá cả hợp lý, cạnh tranh:</span> Giá trị đầu tư hiệu quả, bền vững.</li>
            <li className="text-base"><span className="font-semibold">Năng lực sản xuất quy mô lớn:</span> Đáp ứng số lượng và tiến độ.</li>
            <li className="text-base"><span className="font-semibold">Dịch vụ khách hàng tận tâm:</span> Minh bạch, chu đáo từ tư vấn đến hậu mãi.</li>
          </ul>
        </div>
        <div className="my-6">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-lua-chon-hang-dau.jpg"
              alt="Doanh nghiệp tin chọn đồng phục công sở Univi nhờ chất lượng vượt trội và dịch vụ chuyên nghiệp"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className="rounded-lg shadow-sm"
              quality={80}
            />
          </figure>
        </div>
        <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
          <h2 className="text-xl md:text-xl font-bold mb-2">
            <span className="font-bold mr-2">8.</span>
            Nâng Tầm Hình Ảnh Doanh Nghiệp Với Giải Pháp Đồng Phục Công Sở Đẳng Cấp
          </h2>
          <p className="text-base mb-2">
            <span className="font-semibold">Tại Đồng Phục Univi</span>, chúng tôi không chỉ tạo ra những bộ đồng phục công sở, chúng tôi kiến tạo những người bạn đồng hành đáng tin cậy trên hành trình xây dựng hình ảnh doanh nghiệp. Chúng tôi tin rằng, một bộ trang phục tốt sẽ góp phần không nhỏ vào thành công và niềm vui của mỗi nhân viên.
          </p>
          <p className="text-base mb-2">
            Hãy để những bộ đồng phục công sở được thiết kế và sản xuất bởi Univi trở thành một yếu tố quan trọng trong việc xây dựng, củng cố và nâng tầm hình ảnh chuyên nghiệp, hiện đại, năng động và gắn kết cho doanh nghiệp của bạn. Với các công nghệ vải tiên tiến và độc quyền, Univi cam kết mang lại trải nghiệm đồng phục vượt trội, giúp bạn luôn cảm thấy thoải mái, tự tin và thể hiện hết mình.
          </p>
          <p className="text-base mb-2">
            Bạn đã sẵn sàng cho những bước tiến mới, những trải nghiệm đồng phục công sở tuyệt vời hơn? Đừng để trang phục giới hạn tiềm năng của bạn!
          </p>
        </article>

        <div className="my-12 text-center">
          <figure className="inline-block rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 relative group">
            <Image
              src="/images/gym/dong-phuc-cong-so-univi-khang-dinh-dang-cap.jpg"
              alt="Đồng phục công sở Univi giúp doanh nghiệp khẳng định đẳng cấp và bản sắc thương hiệu"
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              quality={80}
            />
          </figure>
        </div>

        {/* Contact Section */}
        <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
          <div>
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-xl font-bold mb-2">
                Nhận Tư Vấn & Báo Giá Đồng Phục Công Sở Univi Ngay Hôm Nay!
              </h3>
              <p className="text-base text-white max-w-4xl mx-auto mb-4">
                Đã đến lúc nâng cấp hình ảnh doanh nghiệp của bạn với những bộ đồng phục công sở đẳng cấp từ <span className="text-yellow-300 font-bold">Đồng Phục Univi</span>! Đừng để trang phục kém chất lượng cản trở hành trình xây dựng thương hiệu của bạn.
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
              <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg font-bold text-sm">
                Đồng Phục Univi – Your Uniform, Your Brand!
              </div>
              <p className="text-blue-100 mt-3 font-medium">
                Tự tin khẳng định dấu ấn riêng cùng đồng phục công sở chuyên nghiệp!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
