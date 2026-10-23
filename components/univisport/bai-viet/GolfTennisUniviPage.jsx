import Link from 'next/link';
import Image from 'next/image';

export default function GolfTennisUniviPage() {
    return (
        <div className="min-h-screen ">
            <div className="relative z-10 container mx-auto py-6">
                {/* Hero Section */}
                <div className="bg-[#105d97] text-white rounded-lg p-6 mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-medium tracking-tight leading-tight mb-4">
                            Đồng Phục Golf & Tennis Univi
                            <span className="text-yellow-300"> Thanh Lịch Tuyệt Đối, Thoải Mái Bứt Phá Hiệu Suất</span>
                        </h2>
                        <p className="text-base md:text-xl text-white">
                            Giải pháp đồng phục Golf/Tennis hoàn hảo! Univi dùng vải Polyamide cao cấp (Uni Super Cool) siêu nhẹ, co giãn 4 chiều, chống nhăn. Thiết kế 2 trong 1: Lịch sự chốn văn phòng, năng động trên sân. Nhận đơn từ 10 chiếc.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <h2 className="mb-2 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
                        <span className="font-medium mr-2">1.</span>
                        Golf & Tennis – Đẳng cấp trên sân đấu và tầm quan trọng của Trang phục Chuyên dụng
                    </h2>

                    <div className="space-y-3">
                        <p className="text-base">
                            Golf và Tennis là những môn thể thao đòi hỏi sự kết hợp hài hòa giữa kỹ thuật chính xác, thể lực bền bỉ và phong thái chuyên nghiệp, thanh lịch. Trang phục trên sân đấu không chỉ là lớp vải thông thường; nó là yếu tố quyết định hiệu suất và hình ảnh cá nhân của bạn.
                        </p>
                        <p className="text-base">
                            Tương tự như Pickleball, một bộ đồng phục Golf/Tennis chất lượng cao sẽ mang lại:
                        </p>
                    </div>

                    <div className="grid gap-1 mt-4">
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Thoải mái và linh hoạt tối đa</h3>
                            <p>Giúp bạn thực hiện cú swing Golf trọn vẹn hoặc cú giao bóng Tennis dứt khoát mà không bị gò bó.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Thoát ẩm và thoáng khí vượt trội</h3>
                            <p>Giữ cơ thể khô ráo, duy trì sự tập trung và năng lượng trong suốt các trận đấu kéo dài dưới ánh nắng.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Tăng sự tự tin và đẳng cấp</h3>
                            <p>Một bộ trang phục vừa vặn, sang trọng khẳng định sự nghiêm túc và phong thái chuyên nghiệp của người chơi.</p>
                        </div>
                    </div>
                </article>

                <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <h2 className="mb-2 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
                        <span className="font-medium mr-2">2.</span>
                        Đồng phục Univi – Giải pháp Đồng phục Polo Golf & Tennis Đẳng cấp
                    </h2>

                    <div className="space-y-3 mb-4">
                        <p className="text-base">
                            Thấu hiểu những yêu cầu khắt khe về hiệu suất (cho Tennis) và sự thanh lịch (cho Golf), <span className="font-semibold">Đồng Phục Univi</span> mang đến giải pháp đồng phục Polo Golf & Tennis được chế tác từ chất liệu công nghệ cao nhất.
                        </p>
                        <p className="text-base">Tại sao Univi là lựa chọn tối ưu cho đồng phục Golf & Tennis?</p>
                    </div>

                    <div className="grid gap-1">
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Chất liệu chuyên môn sâu</h3>
                            <p>Univi tập trung nghiên cứu chuyên sâu để tìm ra dòng vải tốt nhất, phù hợp nhất với đặc thù vận động của từng bộ môn.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Cam kết chất lượng tuyệt đối</h3>
                            <p>Chúng tôi cam kết không tính phí nếu sản phẩm không đạt chuẩn và tất cả chất liệu vải đều được kiểm định an toàn với da.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Uy tín từ đối tác lớn</h3>
                            <p>Sự tin tưởng của các tập đoàn và câu lạc bộ lớn như Sun Group, Vingroup là minh chứng cho chất lượng sản phẩm và dịch vụ của Univi.</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="text-base">
                            Với Univi, chiếc áo Polo không chỉ là đồng phục mà là &quot;vũ khí&quot; giúp bạn tỏa sáng và chinh phục mọi thử thách trên sân đấu.
                        </p>
                    </div>
                </article>

                <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <h2 className="mb-2 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
                        <span className="font-medium mr-2">3.</span>
                        Khám phá Chất liệu Đột phá: Sự khác biệt của Univi trên sân Golf & Tennis
                    </h2>

                    <p className="text-base mb-4">
                        Đồng phục Golf và Tennis của Univi được tạo nên từ sự kết hợp của các dòng vải kỹ thuật cao độc quyền, giúp người mặc duy trì phong thái đỉnh cao từ những phút khởi động đến cú đánh cuối cùng.
                    </p>

                    <div className="mb-6">
                        <h3 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
                            3.1. Dòng UNIVI-SUPER COOL: Thanh lịch và Mềm mại
                        </h3>
                        <p className="text-base mb-4">
                            Đây là dòng vải lý tưởng cho Golf và các hoạt động yêu cầu sự mềm mại tối đa.
                        </p>
                        <div className="grid gap-1">
                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                                <h4 className="mb-1 text-base font-medium text-gray-900">
                                    Thành phần chính: Sợi Polyamide
                                </h4>
                                <p>Nổi bật với MỀM – MƯỢT – MÁT – MỊN, mang lại cảm giác mát lạnh tức thì, là nền tảng cho sự thanh lịch tuyệt đối.</p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                                <h4 className="mb-1 text-base font-medium text-gray-900">
                                    Co giãn vượt trội
                                </h4>
                                <p>Đảm bảo độ đàn hồi và linh hoạt cho cú xoay người chuẩn xác khi đánh Golf.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
                            3.2. Dòng UNIVI-DRY PRO: Hiệu suất bền bỉ dưới nắng
                        </h3>
                        <p className="text-base mb-4">
                            Lựa chọn hoàn hảo cho Tennis và hoạt động ngoài trời cường độ cao.
                        </p>
                        <div className="grid gap-1">
                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                                <h4 className="mb-1 text-base font-medium text-gray-900">
                                    Thành phần chính: Polyester cao cấp (PET)
                                </h4>
                                <p>CẢN NẮNG – CẢN GIÓ – CẢN BỤI – NHANH KHÔ. Khả năng thoát ẩm thần tốc giúp bạn khô ráo ngay cả khi ra mồ hôi nhiều.</p>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                                <h4 className="mb-1 text-base font-medium text-gray-900">
                                    An toàn tuyệt đối
                                </h4>
                                <p>Vải có khả năng chống tia UV hiệu quả, bảo vệ da bạn dưới ánh nắng gay gắt.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="mb-2 text-lg md:text-xl font-medium text-gray-900">
                            3.3. Chất liệu UNIVI  BLENED (Kết hợp thông minh)
                        </h3>
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <p>
                                Sự pha trộn giữa Polyester và Polyamide, tạo ra chất liệu nhẹ, mềm mịn, chống nhăn nhàu và bền màu. Dòng vải này giữ form dáng chuẩn mực, lý tưởng cho đồng phục Polo đòi hỏi tính thẩm mỹ cao và sự thoải mái khi di chuyển.
                            </p>
                        </div>
                    </div>
                </article>

                <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <h2 className="mb-2 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
                        <span className="font-medium mr-2">4.</span>
                        Thiết kế Thông minh – Tối ưu cho mọi chuyển động trên sân
                    </h2>

                    <p className="text-base mb-3">
                        Đồng phục Golf & Tennis Univi được thiết kế tỉ mỉ để tối ưu hóa cả tính năng lẫn phong cách.
                    </p>

                    <div className="grid gap-1">
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">
                                Form dáng Polo Slim-fit hiện đại
                            </h3>
                            <p>Form dáng vừa vặn, lịch sự nhưng vẫn đảm bảo sự năng động, tôn lên vóc dáng khỏe khoắn của người chơi.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">
                                Đường may tinh tế, chống cọ xát
                            </h3>
                            <p>Univi sử dụng kỹ thuật may tỉ mỉ, đảm bảo từng đường kim mũi chỉ chắc chắn. Đặc biệt, đường may kỹ lưỡng cả hai mặt giúp giảm thiểu tối đa sự cọ xát gây khó chịu cho da trong quá trình vận động liên tục.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">
                                In ấn/Thêu logo đẳng cấp
                            </h3>
                            <p>Ứng dụng công nghệ in ấn tiên tiến đảm bảo logo, tên đội nhóm luôn sắc nét, bền màu và không bong tróc, khẳng định dấu ấn chuyên nghiệp của câu lạc bộ hoặc doanh nghiệp.</p>
                        </div>
                    </div>
                </article>

                <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <h2 className="mb-2 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
                        <span className="font-medium mr-2">5.</span>
                        Lợi ích vượt trội khi đầu tư Đồng phục Golf & Tennis Univi
                    </h2>

                    <p className="text-base mb-3">
                        Đầu tư vào đồng phục từ Univi là quyết định chiến lược mang lại nhiều giá trị cộng hưởng:
                    </p>

                    <div className="grid gap-1">
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Nâng cao hiệu suất thi đấu</h3>
                            <p>Trang phục thoải mái, khô thoáng giúp bạn tập trung hoàn toàn vào kỹ thuật, thực hiện cú đánh chính xác và linh hoạt hơn.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Khẳng định Phong thái và Thương hiệu</h3>
                            <p>Đồng phục đồng bộ, chất lượng tạo nên hình ảnh đẳng cấp, chuyên nghiệp cho đội nhóm, dễ dàng ghi điểm với đối thủ và khán giả.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Độ bền và Tiết kiệm chi phí</h3>
                            <p>Chất liệu cao cấp và kỹ thuật may đo chuẩn mực mang lại độ bền vượt trội, giữ form dáng và màu sắc sau nhiều lần giặt, là khoản đầu tư thông minh trong dài hạn.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">An toàn cho Sức khỏe</h3>
                            <p>Cam kết vải đã qua kiểm định, không chứa hóa chất độc hại, bảo vệ làn da của bạn ngay cả khi ra nhiều mồ hôi trên sân.</p>
                        </div>
                    </div>
                </article>

                <article className="bg-white rounded-2xl p-4 md:p-6 mb-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <h2 className="mb-2 text-xl md:text-2xl font-medium tracking-tight leading-tight text-gray-900">
                        <span className="font-medium mr-2">6.</span>
                        Đặt may Đồng phục Golf & Tennis tại Univi – Quy trình chuyên nghiệp
                    </h2>

                    <p className="text-base mb-3">
                        Univi mang đến quy trình đặt hàng đơn giản, nhanh chóng và chuyên nghiệp:
                    </p>

                    <div className="grid gap-1">
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Tư vấn chuyên sâu</h3>
                            <p>Lắng nghe nhu cầu về kiểu dáng, chất liệu, số lượng và ngân sách.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Thiết kế mẫu miễn phí</h3>
                            <p>Lên mẫu demo dựa trên nhận diện thương hiệu của bạn, chỉnh sửa cho đến khi hài lòng.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Duyệt mẫu & Báo giá</h3>
                            <p>Ký hợp đồng sau khi thống nhất thiết kế và báo giá chi tiết.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Sản xuất theo tiêu chuẩn</h3>
                            <p>Đảm bảo chất lượng nghiêm ngặt tại xưởng may hiện đại.</p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-3 hover:shadow-md transition-all">
                            <h3 className="mb-1 text-base font-medium text-gray-900">Giao hàng và Hậu mãi</h3>
                            <p>Kiểm tra chất lượng (KCS) tỉ mỉ, giao hàng tận nơi và cam kết chế độ bảo hành tốt nhất.</p>
                        </div>
                    </div>
                </article>

                {/* Contact Section */}
                <div className="bg-[#105d97] text-white rounded-lg p-6 mt-6">
                    <div>
                        <div className="text-center mb-6">
                            <h3 className="text-xl md:text-2xl font-medium tracking-tight leading-tight mb-2">
                                Nâng tầm Đẳng cấp trên sân đấu cùng Đồng Phục Univi ngay hôm nay!
                            </h3>
                            <p className="text-base text-white max-w-4xl mx-auto mb-4">
                                Đừng để trang phục cản trở hiệu suất hoặc làm giảm đi phong thái chuyên nghiệp của bạn. Hãy để <span className="text-yellow-300 font-bold">Đồng Phục Univi</span> đồng hành cùng bạn và đội nhóm trên mọi sân Golf và Tennis với những bộ trang phục chất lượng, thoải mái và đẳng cấp nhất.
                            </p>
                            <p className="text-sm text-white mb-4">
                                Liên hệ ngay để nhận tư vấn miễn phí và báo giá ưu đãi:
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="font-semibold text-yellow-300 mb-1">Hotline</div>
                                <div className="text-white">083 420 4999</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="font-semibold text-yellow-300 mb-1">Website</div>
                                <div className="text-white">dongphucunivi.com</div>
                            </div>

                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="font-semibold text-yellow-300 mb-1">Địa chỉ</div>
                                <div className="text-white">Nhà D14, ngõ 180 đường Thanh Bình, phường Hà Đông, thành phố Hà Nội</div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="inline-block bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-sm">
                                Đồng Phục Univi – Your Uniform, Your Brand!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
