import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { projects } from "../../components/univisport/data/projects";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";


const PropertyDetail = ({ project }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    if (!project?.id) {
      setFeaturedProjects([]);
      return;
    }
    const otherProjects = projects.filter((proj) => proj.id !== project.id);
    const randomProjects = getRandomProjects(otherProjects, 3);
    setFeaturedProjects(randomProjects);
  }, [project?.id]);

  if (!project) {
    return <div className="text-center text-white py-10">Dự án không tồn tại</div>;
  }

  const images = project.images?.length > 0 ? project.images : [project.image ?? "/fallback-image.jpg"];
  const swipeThreshold = 50;
  const maxDots = 5; // Maximum number of dots
  const totalDots = Math.min(maxDots, images.length); // Cap at 5 dots
  // Calculate which dot should be active based on currentImage
  const activeDot = Math.floor((currentImage / images.length) * totalDots);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const deltaX = touchEndX.current - touchStartX.current;
    if (deltaX > swipeThreshold) {
      handlePrevImage();
    } else if (deltaX < -swipeThreshold) {
      handleNextImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể kết nối với máy chủ");
      }

      setStatus("Gửi thông tin thành công!");
      setFormData({ name: "", phone: "", message: "" });
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      setStatus(`Lỗi: ${error.message || "Không thể gửi thông tin. Vui lòng thử lại sau."}`);
    }
  };

  const getRandomProjects = (projectsArray, count) => {
    const result = [];
    const available = [...projectsArray];
    for (let i = 0; i < count && available.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      result.push(available.splice(randomIndex, 1)[0]);
    }
    return result;
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle dot click: Jump to the first image of the corresponding segment
  const handleDotClick = (dotIndex) => {
    const imagesPerDot = Math.ceil(images.length / totalDots);
    const targetImage = dotIndex * imagesPerDot;
    setCurrentImage(Math.min(targetImage, images.length - 1));
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative md:h-[40vh] h-[30vh] w-full">
          <Image
            src={project.image ?? "/images/dong-phuc-1.jpg"}
            alt={`Hình ảnh chính của ${project.title}`}
            layout="fill"
            objectFit="cover"
            quality={100}
            className="opacity-70 brightness-75"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="p-6 md:p-10">
              <p className="text-sm uppercase text-gray-400">
                <Link href="/">
                  <span className="hover:text-blue-400 cursor-pointer">Trang chủ</span>
                </Link>{" "}
                /{" "}
                <Link href="/feedback">
                  <span className="hover:text-blue-400 cursor-pointer">Feedback</span>
                </Link>{" "}
                / {project.title}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{project.title}</h1>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-6">
          <div className="flex flex-col md:flex-row mt-4">
            <div className="md:w-3/4">
              {/* Image Gallery */}
              <div
                className="relative mt-4"
                style={{ aspectRatio: "3 / 2" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={images[currentImage]}
                  alt={`Hình ảnh ${currentImage + 1} của ${project.title}`}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                  quality={100}
                  className="rounded-lg"
                />
                <button
                  onClick={handlePrevImage}
                  className="absolute opacity-80 left-2 top-1/2 transform -translate-y-1/2 bg-[#105d97] text-white md:p-3 p-1 rounded-full hover:bg-blue-400"
                  aria-label="Xem hình ảnh trước"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute opacity-80 right-2 top-1/2 transform -translate-y-1/2 bg-[#105d97] text-white md:p-3 p-1 rounded-full hover:bg-blue-400"
                  aria-label="Xem hình ảnh tiếp theo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {Array.from({ length: totalDots }).map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full ${activeDot === index ? "bg-[#105d97]" : "bg-gray-400"}`}
                      onClick={() => handleDotClick(index)}
                      aria-label={`Xem nhóm hình ảnh ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 md:grid-cols-5 md:gap-3 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative w-full" style={{ aspectRatio: "3 / 2" }}>
                    <Image
                      src={image}
                      alt={`Hình ảnh phụ ${index + 1} của ${project.title}`}
                      layout="fill"
                      objectFit="cover"
                      quality={75}
                      loading="lazy"
                      className="rounded-lg cursor-pointer"
                      onClick={() => setCurrentImage(index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:w-1/4 md:ml-6 mt-6 md:mt-0">
              {/* Featured Projects */}
              <div className="mt-6">
                <h2 className="text-base font-bold text-[#105d97] uppercase">Dự án đồng phục tiêu biểu</h2>
                <div className="mt-4 space-y-4">
                  {featuredProjects.map((featuredProject) => (
                    <Link
                      key={featuredProject.id}
                      href={`/feedback/${featuredProject.slug}`}
                      className="flex flex-col items-center hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={featuredProject.image}
                        alt={featuredProject.title}
                        width={300}
                        height={180}
                        className="w-full h-40 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <p className="tex`t-gray-400 text-center mt-2">{featuredProject.title}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact Form */}
              <div className="gradient-univi-primary p-6 mt-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">

                  <div>
                    <h2 className="text-xl font-bold text-white">ĐẶT LỊCH TƯ VẤN</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Họ và tên *"
                        aria-label="Họ và tên"
                        aria-required="true"
                        className={`w-full p-4 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 rounded-xl border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 ${errors.name ? "border-red-300 bg-red-500/20" : "hover:border-white/30"
                          }`}
                      />
                      {errors.name && (
                        <p className="text-red-300 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠</span>{errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại *"
                        aria-label="Số điện thoại"
                        aria-required="true"
                        className={`w-full p-4 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 rounded-xl border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 ${errors.phone ? "border-red-300 bg-red-500/20" : "hover:border-white/30"
                          }`}
                      />
                      {errors.phone && (
                        <p className="text-red-300 text-sm mt-2 flex items-center">
                          <span className="mr-1">⚠</span>{errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Yêu cầu thiết kế đồng phục của bạn..."
                      aria-label="Yêu cầu thiết kế đồng phục"
                      rows={4}
                      className={`w-full p-4 bg-white/10 backdrop-blur-sm text-white placeholder-blue-100 rounded-xl border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 resize-none ${errors.message ? "border-red-300 bg-red-500/20" : "hover:border-white/30"
                        }`}
                    />
                    {errors.message && (
                      <p className="text-red-300 text-sm mt-2 flex items-center">
                        <span className="mr-1">⚠</span>{errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "Đang gửi..."}
                    className="w-full bg-white text-[#105d97] p-4 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {status === "Đang gửi..." ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#105d97] border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        GỬI THÔNG TIN
                        <span className="text-lg">→</span>
                      </>
                    )}
                  </button>
                </form>

                {status && (
                  <div className={`mt-4 p-4 rounded-xl text-center ${status.includes("thành công")
                    ? "bg-green-500/20 text-green-100 border border-green-300/30"
                    : "bg-red-500/20 text-red-100 border border-red-300/30"
                    }`}>
                    <div className="flex items-center justify-center gap-2">
                      {status.includes("thành công") ? (
                        <span className="text-green-300">✓</span>
                      ) : (
                        <span className="text-red-300">⚠</span>
                      )}
                      <span className="font-medium">{status}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

PropertyDetail.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    image: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string),
    customer: PropTypes.string,
    category: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default PropertyDetail;

export async function getStaticPaths() {
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const project = projects.find((p) => p.slug === params.slug);
  return { props: { project: project || null } };
}