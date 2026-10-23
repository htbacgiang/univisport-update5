import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload
} from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import styles from '../../styles/Profile.module.css';
import DefaultLayout from '../../components/layout/DefaultLayout';

if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

export default function Profile({ meta }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputPage, setInputPage] = useState('1');
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const [showDownloadOnly, setShowDownloadOnly] = useState(false);
  const containerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setInputPage('1');
    setError(null);
    setUseFallback(false);
  };

  const onDocumentLoadError = (err) => {
    console.error('Failed to load PDF with react-pdf:', err);
    setUseFallback(true);
  };

  const handleIframeError = () => {
    setShowDownloadOnly(true);
    setError('Không thể hiển thị PDF trực tiếp. Vui lòng tải về để xem.');
  };

  const goToPage = (newPage) => {
    const page = Math.max(1, Math.min(newPage, numPages || 1));
    setPageNumber(page);
    setInputPage(String(page));
  };

  const handlePageInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= (numPages || 1)) {
      setPageNumber(page);
    } else {
      setInputPage(String(pageNumber));
    }
  };

  useEffect(() => {
    setIsClient(true);

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(Math.min(window.innerWidth - 32, 900));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <DefaultLayout>
      <section className="w-full pb-8 sm:pb-10">
        <div className={`container mx-auto px-4 ${styles.container}`}>
          <div className="mt-[60px] sm:mt-[91px]"></div>
          <main className={styles.main}>
            <div ref={containerRef} className="w-full max-w-6xl mx-auto overflow-x-hidden">
              {/* Navigation & Controls Toolbar */}
              {numPages && (
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl p-3 mb-4 shadow-sm sticky  z-20">
                  {/* Left: Prev / Page Input / Next */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => goToPage(pageNumber - 1)}
                      disabled={pageNumber <= 1}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm font-medium"
                      title="Trang trước"
                    >
                      <FaChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Trước</span>
                    </button>

                    <form onSubmit={handlePageSubmit} className="flex items-center space-x-1.5">
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">Trang</span>
                      <input
                        type="number"
                        min={1}
                        max={numPages || 1}
                        value={inputPage}
                        onChange={handlePageInputChange}
                        onBlur={handlePageSubmit}
                        className="w-14 text-center py-1 px-1.5 border border-gray-300 rounded-md text-sm font-semibold focus:ring-2 focus:ring-[#105d97] focus:outline-none"
                      />
                      <span className="text-xs sm:text-sm text-gray-600 font-medium">
                        / {numPages}
                      </span>
                    </form>

                    <button
                      type="button"
                      onClick={() => goToPage(pageNumber + 1)}
                      disabled={pageNumber >= numPages}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-sm font-medium"
                      title="Trang sau"
                    >
                      <span className="hidden sm:inline">Sau</span>
                      <FaChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Right: Zoom & Download */}
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setScale(s => Math.max(s - 0.1, 0.6))}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                      title="Thu nhỏ"
                    >
                      <FaSearchMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-semibold text-gray-600 w-12 text-center select-none">
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setScale(s => Math.min(s + 0.1, 2.0))}
                      className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
                      title="Phóng to"
                    >
                      <FaSearchPlus className="w-3.5 h-3.5" />
                    </button>

                    <a
                      href="/ho-so-nang-luc.pdf"
                      download
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#105d97] hover:bg-[#0c4d7d] text-white text-xs sm:text-sm font-medium rounded-lg transition shadow-sm ml-2"
                    >
                      <FaDownload className="w-3.5 h-3.5" />
                      <span>Tải PDF</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Main PDF Viewer */}
              <div className={styles.pdfContainer}>
                {error && <p className={styles.error}>{error}</p>}
                {!useFallback ? (
                  <Document
                    file="/ho-so-nang-luc.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="py-20 text-gray-500 flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#105d97]"></div>
                        <span className="text-sm font-medium">Đang tải hồ sơ năng lực...</span>
                      </div>
                    }
                  >
                    {numPages && (
                      <Page
                        key={`page_${pageNumber}`}
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className={styles.pdfPage}
                        scale={scale}
                        width={containerWidth ? Math.min(containerWidth - 16, 950) : 800}
                      />
                    )}
                  </Document>
                ) : (
                  <div className={styles.fallbackContainer}>
                    {showDownloadOnly ? (
                      <div className={styles.downloadOnlyContainer}>
                        <div className={styles.downloadIcon}>📄</div>
                        <h3 className={styles.downloadTitle}>Hồ sơ năng lực Đồng phục Univi</h3>
                        <p className={styles.downloadDescription}>
                          Để xem hồ sơ năng lực, vui lòng tải file PDF về thiết bị của bạn.
                        </p>
                        <a
                          href="/ho-so-nang-luc.pdf"
                          download
                          className={styles.downloadButton}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📥 Tải hồ sơ năng lực (PDF)
                        </a>
                      </div>
                    ) : (
                      <>
                        <iframe
                          src={`/ho-so-nang-luc.pdf#page=${pageNumber}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                          width="100%"
                          height="100%"
                          title="Hồ sơ năng lực Đồng phục Univi"
                          className={styles.pdfIframe}
                          style={{ border: 'none', overflow: 'hidden' }}
                          onError={handleIframeError}
                        />

                        <div className={styles.downloadSection}>
                          <a
                            href="/ho-so-nang-luc.pdf"
                            download
                            className={styles.downloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            📄 Tải hồ sơ năng lực (PDF)
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>
          </main>
        </div>
      </section>
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Hồ sơ năng lực Đồng phục Univi - Quần áo thể thao chất lượng cao",
    content:
      "Đồng phục Univi – Thương hiệu quần áo thể thao với công nghệ Uni Dry, chất liệu vải chuyên dụng cho gym, yoga, chạy bộ và golf. An toàn cho da, thoải mái khi vận động.",
    keywords:
      "hồ sơ năng lực Đồng phục Univi, quần áo thể thao, công nghệ Uni Dry, vải thể thao, trang phục gym, quần áo yoga, chạy bộ, vải an toàn cho da",
    robots: "index, follow",
    author: "Đồng phục Univi",
    canonical: "https://dongphucunivi.com/ho-so-nang-luc",

    og: {
      title: "Đồng phục Univi – Quần áo thể thao chuyên dụng",
      description:
        "Khám phá hồ sơ năng lực Đồng phục Univi: quần áo thể thao với công nghệ Uni Dry, chất liệu cao cấp, an toàn cho da, phù hợp cho gym, yoga, chạy bộ.",
      type: "website",
      image: "https://dongphucunivi.com/images/banner-1.webp",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://dongphucunivi.com/ho-so-nang-luc",
    },
    twitter: {
      card: "summary_large_image",
      title: "Hồ sơ năng lực Đồng phục Univi - Quần áo thể thao chất lượng cao",
      description:
        "Đồng phục Univi – Thương hiệu quần áo thể thao với công nghệ Uni Dry, chất liệu vải chuyên dụng cho gym, yoga, chạy bộ và golf.",
      image: "https://dongphucunivi.com/images/banner-1.webp",
    },
    schema: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "https://dongphucunivi.com" },
          { "@type": "ListItem", "position": 2, "name": "Hồ sơ năng lực", "item": "https://dongphucunivi.com/ho-so-nang-luc" },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://dongphucunivi.com/ho-so-nang-luc#webpage",
        "name": "Hồ sơ năng lực Đồng phục Univi - Quần áo thể thao chất lượng cao",
        "description": "Đồng phục Univi – Thương hiệu quần áo thể thao với công nghệ Uni Dry, chất liệu vải chuyên dụng cho gym, yoga, chạy bộ và golf.",
        "url": "https://dongphucunivi.com/ho-so-nang-luc",
        "isPartOf": { "@id": "https://dongphucunivi.com/#website" },
        "about": { "@id": "https://dongphucunivi.com/#organization" },
      }
    ],
  };

  return {
    props: {
      meta,
    },
  };
}