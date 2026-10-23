import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../../../styles/TShirtUniformsUniviPage.module.css';

export default function TShirtUniformsUniviPage() {
  return (
    <>
      <article className="container mx-auto px-4 mt-4">
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>1. Áo Thun Đồng Phục – Giải Pháp Linh Hoạt, Thời Trang và Hiệu Quả Cho Mọi Nhu Cầu</h2>
          <p className={`${styles.tshirtText}`}>
            Áo thun – Item &quot;quốc dân&quot;: Sự phổ biến, tính tiện dụng và khả năng biến hóa đa dạng của áo thun trong đời sống và trong các hoạt động tập thể.
          </p>
          <p className={`${styles.tshirtText}`}>Tại sao áo thun là lựa chọn hàng đầu cho đồng phục?</p>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Sự thoải mái tuyệt đối:</span> Chất liệu mềm mại, co giãn, mang lại cảm giác dễ chịu cho người mặc trong mọi hoạt động.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Tính linh hoạt và dễ phối đồ:</span> Phù hợp với nhiều phong cách, dễ dàng kết hợp với các loại trang phục khác.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Không gian sáng tạo không giới hạn cho thiết kế:</span> Bề mặt rộng lý tưởng để in/thêu logo, slogan, hình ảnh, thông điệp.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Chi phí hợp lý:</span> So với nhiều loại đồng phục khác, áo thun thường có chi phí sản xuất tối ưu hơn, phù hợp với nhiều ngân sách.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Khả năng truyền thông mạnh mẽ:</span> Dễ dàng lan tỏa hình ảnh thương hiệu, thông điệp của đội nhóm, sự kiện.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Tạo sự gắn kết và tinh thần đồng đội:</span> Màu áo chung, hình ảnh chung giúp mọi người cảm thấy gần gũi và đoàn kết hơn.</li>
          </ul>
        </div>
        <div className="my-4">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/tshirt/dong-phuc-ao-thun-univi-nang-dong.jpg"
              alt="Áo thun đồng phục Univi năng động, thoải mái, phù hợp cho sự kiện và đội nhóm."
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className={`${styles.tshirtImage}`}
              quality={80}
              priority={true}
            />
          </figure>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>2. Univi – Nâng Tầm Chiếc Áo Thun Đồng Phục Quen Thuộc Lên Một Đẳng Cấp Mới</h2>
          <p className={`${styles.tshirtText}`}>
            Đồng Phục Univi là đơn vị xưởng may chuyên cung cấp đồng phục thể thao, đồng phục công ty, đồng phục công sở, áo polo, áo sơ mi văn phòng cao cấp, và đặc biệt là áo thun đồng phục. Với hơn 8 năm kinh nghiệm, Univi đã trở thành đối tác tin cậy của hàng trăm doanh nghiệp, tập đoàn và đội nhóm như: Sun Group, Premier Village, Sun World, Thanh Cong Group, KickFit Sport, Fitcare, The Fox Fitness, TeamCap...
          </p>
          <p className={`${styles.tshirtText}`}>Cam kết chất lượng &quot;không đổi&quot; từ Univi cho mỗi chiếc áo thun:</p>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Chất lượng sản phẩm là ưu tiên số một:</span> &quot;Đồng Phục Univi không chỉ đáp ứng yêu cầu mà còn cam kết không tính phí nếu sản phẩm không đạt chuẩn.&quot;</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>An toàn tuyệt đối cho làn da người mặc:</span> &quot;Tất cả chất liệu vải mà Univi sử dụng đều được kiểm định an toàn với da&quot;. Điều này đặc biệt quan trọng đối với áo thun, loại trang phục tiếp xúc trực tiếp và thường xuyên với da.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Sự am hiểu về xu hướng thiết kế và công nghệ sản xuất:</span> Đội ngũ Univi sở hữu kiến thức sâu rộng và kinh nghiệm thực tiễn, mang đến áo thun đồng phục hiện đại, thẩm mỹ và bền bỉ.</li>
          </ul>
        </div>
        <div className="my-4">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/tshirt/ao-thun-cotton-univi-thoang-mat.jpg"
              alt="Áo thun Cotton 100% Univi thoáng mát, thấm hút mồ hôi, lý tưởng cho sự kiện ngoài trời."
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className={`${styles.tshirtImage}`}
              quality={80}
              loading="lazy"
            />
          </figure>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>3. Khám Phá Sự Vượt Trội Trong Từng Sợi Vải và Đường Nét Thiết Kế Áo Thun Đồng Phục Univi</h2>
          <h3 className={`${styles.tshirtSubtitle}`}>3.1 Đa Dạng Chất Liệu Vải &quot;Chất Lượng Vàng&quot; – Đáp Ứng Hoàn Hảo Mọi Yêu Cầu Sử Dụng:</h3>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Cotton 100% Cao Cấp:</span> &quot;Vua&quot; của các loại vải may áo thun nhờ sự mềm mại tự nhiên, thấm hút mồ hôi vượt trội, thoáng mát, phù hợp cho hoạt động ngoài trời.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Cotton Pha (CVC, TC):</span> Kết hợp Cotton và Polyester, ít nhăn, bền màu, khô nhanh, cân bằng giữa chất lượng và chi phí.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Polyester Cao Cấp (PET) & Vải Thể Thao:</span> Nhẹ, bền, giữ form tốt, lý tưởng cho in ấn phức tạp. Các dòng như UNIVI-DRY PRO (cản nắng, gió, bụi, nhanh khô) và UNIVI-BLENED (mềm mịn, chống tia UV) phù hợp cho thể thao, sự kiện vận động.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Thun Lạnh (Interlock/Single Jersey):</span> Mát lạnh, trơn láng, co giãn tốt, ít nhăn, lý tưởng cho sự kiện, quảng cáo.</li>
          </ul>
          <p className={`${styles.tshirtText}`}>Univi cam kết lựa chọn cẩn thận chất liệu vải và sản xuất riêng có nguồn gốc rõ ràng, đảm bảo trải nghiệm tốt nhất.</p>
          <h3 className={`${styles.tshirtSubtitle}`}>3.1 Thiết Kế Sáng Tạo, Trẻ Trung, Hiện Đại – Khẳng Định Phong Cách Riêng:</h3>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Kiểu dáng đa dạng:</span>
              <ul className={`${styles.tshirtList}`}>
                <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Áo Thun Cổ Tròn:</span> Kinh điển, trẻ trung, năng động, phổ biến nhất.</li>
                <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Áo Thun Cổ Tim:</span> Mềm mại, thanh lịch, tạo điểm nhấn tinh tế.</li>
                <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Form dáng:</span> Regular-fit, Slim-fit, Oversize, tùy theo yêu cầu.</li>
                <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Thiết kế riêng:</span> Nam, nữ, trẻ em (nếu cần).</li>
              </ul>
            </li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Màu sắc phong phú:</span> Hàng trăm lựa chọn từ cơ bản đến rực rỡ, theo pantone chuẩn, phù hợp logo và thương hiệu.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Đường may tinh tế:</span> Cẩn thận, chắc chắn, tăng thẩm mỹ và độ bền.</li>
          </ul>
          <h3 className={`${styles.tshirtSubtitle}`}>3.2 Công Nghệ In/Thêu Logo, Hình Ảnh, Thông Điệp Hiện Đại:</h3>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>In Lụa:</span> Kinh tế cho đơn hàng lớn, màu sắc tươi sáng, độ bền cao.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>In Decal Chuyển Nhiệt:</span> Họa tiết phức tạp, sắc nét, linh hoạt.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>In Kỹ Thuật Số (DTG):</span> Màu sắc trung thực, chi tiết cao, phù hợp đơn hàng nhỏ.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>In Thăng Hoa:</span> Màu sắc rực rỡ, không phai, lý tưởng cho vải Polyester.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Thêu Vi Tính:</span> Sang trọng, bền vĩnh cửu, phù hợp logo.</li>
          </ul>
        </div>
        <div className="my-4">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/tshirt/ao-thun-su-kien-univi-in-logo.jpg"
              alt="Áo thun đồng phục Univi với logo in sắc nét, lý tưởng cho sự kiện quảng bá."
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className={`${styles.tshirtImage}`}
              quality={80}
              loading="lazy"
            />
          </figure>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>4. Lợi Ích Vượt Trội Khi Lựa Chọn Giải Pháp Áo Thun Đồng Phục Từ Univi</h2>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Hình ảnh thương hiệu chuyên nghiệp:</span> Thiết kế đẹp mắt, logo nổi bật, tạo ấn tượng tốt.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Tăng cường đoàn kết:</span> Gắn kết đội ngũ, tăng tự hào và động lực cống hiến.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Marketing hiệu quả:</span> Áo thun là công cụ quảng cáo di động, lan tỏa thương hiệu.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Thoải mái, tự tin:</span> Chất liệu cao cấp, form dáng vừa vặn, nâng cao năng suất.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Bền đẹp, tiết kiệm:</span> Tuổi thọ cao, giảm chi phí thay mới.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Linh hoạt ứng dụng:</span> Phù hợp cho nhiều hoàn cảnh, từ công sở đến sự kiện.</li>
          </ul>
        </div>
        <div className="my-4">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/tshirt/dong-phuc-ao-thun-team-building-univi.jpg"
              alt="Áo thun đồng phục Univi trẻ trung, phù hợp cho team building và hoạt động dã ngoại."
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className={`${styles.tshirtImage}`}
              quality={80}
              loading="lazy"
            />
          </figure>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>5. Áo Thun Đồng Phục Univi – Giải Pháp Lý Tưởng Cho Mọi Nhu Cầu và Mục Đích Sử Dụng</h2>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}>Đồng phục nhân viên công ty, doanh nghiệp (bộ phận năng động, ít trang trọng).</li>
            <li className={`${styles.tshirtListItem}`}>Đồng phục cho sự kiện, hội thảo, triển lãm (ban tổ chức, tình nguyện viên).</li>
            <li className={`${styles.tshirtListItem}`}>Đồng phục cho team building, dã ngoại, du lịch công ty.</li>
            <li className={`${styles.tshirtListItem}`}>Đồng phục cho đội nhóm, câu lạc bộ thể thao, lớp học.</li>
            <li className={`${styles.tshirtListItem}`}>Đồng phục cho chiến dịch quảng cáo, activation sản phẩm.</li>
            <li className={`${styles.tshirtListItem}`}>Áo lớp, áo nhóm mang dấu ấn kỷ niệm.</li>
            <li className={`${styles.tshirtListItem}`}>Quà tặng ý nghĩa cho khách hàng, đối tác, nhân viên.</li>
          </ul>
        </div>
        <div className="my-4">
          <figure className="max-w-[800px] mx-auto">
            <Image
              src="/images/tshirt/quy-trinh-dat-may-ao-thun-univi.jpg"
              alt="Sơ đồ quy trình đặt may đồng phục áo thun chuyên nghiệp tại Univi."
              width={800}
              height={400}
              layout="responsive"
              sizes="(max-width: 800px) 100vw, 800px"
              className={`${styles.tshirtImage}`}
              quality={80}
              loading="lazy"
            />
          </figure>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>6. Quy Trình Đặt May Áo Thun Đồng Phục Tại Univi – Chuyên Nghiệp, Nhanh Chóng, Minh Bạch</h2>
          <ol className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Tiếp Nhận Yêu Cầu & Tư Vấn:</span> Chia sẻ mục đích, số lượng, chất liệu, màu sắc, ngân sách. Univi đề xuất giải pháp tối ưu.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Thiết Kế Miễn Phí:</span> Phác thảo mẫu demo 2D/3D, chỉnh sửa không giới hạn.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Chọn Chất Liệu & May Mẫu:</span> Tư vấn chất liệu, sản xuất mẫu thực tế nếu cần.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Sản Xuất:</span> Ký hợp đồng, sản xuất theo thiết kế đã duyệt.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Kiểm Tra Chất Lượng (KCS):</span> Kiểm tra tỉ mỉ từng sản phẩm.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Giao Hàng Đúng Hẹn:</span> Vận chuyển an toàn, đúng tiến độ trên toàn quốc.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Bảo Hành & Hậu Mãi:</span> Cam kết bảo hành, hỗ trợ tận tâm.</li>
          </ol>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>Tại Sao Univi Là Lựa Chọn Hàng Đầu Cho Áo Thun Đồng Phục?</h2>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Kinh nghiệm dày dặn:</span> Hơn 8 năm phục vụ các thương hiệu lớn.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Chất lượng vượt trội:</span> Chất liệu cao cấp, cắt may chuẩn mực.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Thiết kế sáng tạo:</span> Cập nhật xu hướng, tôn vinh thương hiệu.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Giá cả cạnh tranh:</span> Tối ưu chi phí, giá trị đầu tư cao.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Sản xuất linh hoạt:</span> Đáp ứng đơn hàng lớn, tiến độ gấp.</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Dịch vụ tận tâm:</span> Tư vấn, hỗ trợ chuyên nghiệp, minh bạch.</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border-l-4 border-[#105d97]">
          <h2 className={`${styles.tshirtTitle}`}>7. In Đậm Dấu Ấn Cá Nhân, Gắn Kết Tập Thể Cùng Áo Thun Đồng Phục Univi!</h2>
          <p className={`${styles.tshirtText}`}>
            Hãy để những chiếc áo thun đồng phục từ Univi trở thành công cụ hiệu quả, giúp bạn thể hiện cá tính, lan tỏa thông điệp, gắn kết đội ngũ và xây dựng hình ảnh chuyên nghiệp, năng động cho tổ chức, doanh nghiệp hay sự kiện của mình.
          </p>
          <p className={`${styles.tshirtText}`}>Liên hệ ngay để nhận tư vấn chuyên nghiệp và báo giá chi tiết:</p>
          <ul className={`${styles.tshirtList}`}>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Hotline:</span> 083 420 4999</li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Email:</span> dongphucunivi@gmail.com</li>
            <li className={`${styles.tshirtListItem}`}>
              <span className={`${styles.tshirtHighlight}`}>Website:</span>{' '}
              <Link href="https://dongphucunivi.com" legacyBehavior>
                <a
                  className="text-[#105d97] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Đồng Phục Univi website for T-shirt uniforms"
                >
                  dongphucunivi.com
                </a>
              </Link>
            </li>
            <li className={`${styles.tshirtListItem}`}><span className={`${styles.tshirtHighlight}`}>Địa chỉ:</span> Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</li>
          </ul>
          <p className={`${styles.tshirtText}`}>
            <span className={`${styles.tshirtHighlight}`}>Đồng Phục Univi – Your Uniform, Your Brand!</span> Áo Thun Đồng Phục Chất Lượng, Khẳng Định Phong Cách, Lan Tỏa Thông Điệp.
          </p>
        </div>
      </article>
    </>
  );
}