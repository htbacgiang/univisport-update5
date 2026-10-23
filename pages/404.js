import Head from "next/head";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Không tìm thấy trang | UniviSport</title>
        <meta name="description" content="Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng quay lại trang chủ của UniviSport." />
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white px-4 text-center py-20">
        {/* 404 Text */}
        <h1 className="text-9xl font-extrabold text-blue-600 mb-4 tracking-tighter">404</h1>

        {/* Error Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Oops! Trang Không Tìm Thấy.
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mb-8">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không thể truy cập. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
        </p>

        {/* Back to Home Button */}
        <Link href="/">
          <button
            className="flex items-center bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-full shadow hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            aria-label="Quay về trang chủ"
          >
            Quay Về Trang Chủ
            <FaArrowRight className="ml-2" />
          </button>
        </Link>
      </div>
    </>
  );
}