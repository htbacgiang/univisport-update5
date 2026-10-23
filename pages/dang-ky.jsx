import Link from "next/link";
import { Formik, Form } from "formik";
import Head from "next/head"; // Thêm Head
import * as Yup from "yup";
import { useState } from "react";
import { getCsrfToken, getSession } from "next-auth/react";
import Router from "next/router";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Image from "next/image";

// Schema validation với Yup
const signupValidation = Yup.object({
  username: Yup.string()
    .required("Vui lòng nhập tên người dùng.")
    .min(3, "Tên người dùng phải có ít nhất 3 ký tự."),
  email: Yup.string()
    .required("Vui lòng nhập địa chỉ email.")
    .email("Vui lòng nhập địa chỉ email chính xác."),
  phone: Yup.string()
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})\b$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu.")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
  confirm_password: Yup.string()
    .required("Vui lòng xác nhận mật khẩu.")
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp."),
  agree: Yup.boolean()
    .required("Bạn phải đồng ý với Điều khoản & Chính sách bảo mật.")
    .oneOf([true], "Bạn phải đồng ý với Điều khoản & Chính sách bảo mật."),
});

export default function Signup({ csrfToken, meta }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dongphucunivi.com";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const signUpHandler = async (values, setSubmitting) => {
    try {
      setStatus("Đang đăng ký...");
      console.log("Submitting signup:", values); // Debug
      const { data } = await axios.post(`${baseUrl}/api/auth/signup`, {
        name: values.username,
        email: values.email,
        phone: values.phone,
        password: values.password,
        conf_password: values.confirm_password,
        agree: values.agree,
      });
      console.log("Signup response:", data); // Debug
      setSuccess(data.message);
      setError("");
      setStatus("Đăng ký thành công!");
      toast.success("Đăng ký thành công!");
      setSubmitting(false);
      setTimeout(() => {
        Router.push("/dang-nhap");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      setStatus("");
      setSuccess("");
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
      setSubmitting(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Đăng ký tài khoản - GreenLa Home",
    "description": "Đăng ký tài khoản tại GreenLa Home để trải nghiệm dịch vụ nội thất cao cấp và nhận ưu đãi độc quyền.",
    "url": "https://dongphucunivi.com/dang-ky",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": "https://dongphucunivi.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Đăng ký",
          "item": "https://dongphucunivi.com/dang-ky"
        }
      ]
    }
  };

  return (
    <>
      <Head>
        <title>Đăng Ký Tài Khoản- Đồng Phục Univi</title>
        <meta name="description" content="Đăng ký vào tài khoản Đồng Phục Univi để quản lý đơn hàng, xem lịch sử mua sắm và nhận ưu đãi độc quyền. Chất lượng cao, thiết kế chuyên nghiệp." />
        <meta name="keywords" content="Đăng ký, Đồng Phục Univi, đồng phục thể thao, đồng phục gym, tài khoản khách hàng" />
        <meta name="robots" content="noindex, nofollow" key="robots" /> {/* Login page không cần SEO */}
        <meta name="author" content="Đồng Phục Univi" />
        <link rel="canonical" href="https://dongphucunivi.com/auth/dang-ky" />
        {/* Open Graph */}
        <meta property="og:title" content="Đăng ký - Đồng Phục Univi" />
        <meta property="og:description" content="Đăng ký để trải nghiệm dịch vụ của Đồng Phục Univi. Quản lý đơn hàng và nhận ưu đãi độc quyền." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dongphucunivi.com/dang-ky" />
        <meta property="og:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Đăng ký - Đồng Phục Univi" />
        <meta name="twitter:description" content="Đăng ký để trải nghiệm dịch vụ của Đồng Phục Univi. Quản lý đơn hàng và nhận ưu đãi độc quyền." />
        <meta name="twitter:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
      </Head>
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <section className="min-h-screen flex items-center justify-center relative py-12 px-4">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={"https://res.cloudinary.com/djbmybqt2/image/upload/v1747563139/banner-1_sf65rf.webp"}
            alt="Đồng phục Univi - Đăng ký tài khoản"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#105d97]/40" />
        </div>

        <div className="w-full max-w-lg relative z-10 animate-fade-in-up">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden relative group">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#105d97]/30 rounded-full blur-3xl group-hover:bg-[#105d97]/40 transition-all duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#105d97]/20 rounded-full blur-3xl group-hover:bg-[#105d97]/30 transition-all duration-700" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-600 mb-2 tracking-tight">Đăng ký tài khoản</h1>
                <p className="text-gray-800 text-sm">Bắt đầu hành trình phong cách của bạn ngay hôm nay</p>
              </div>

              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  phone: "",
                  password: "",
                  confirm_password: "",
                  agree: false,
                }}
                validationSchema={signupValidation}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={(values, { setSubmitting }) => {
                  if (!values.agree) {
                    toast.error("Bạn phải đồng ý với Điều khoản & Chính sách bảo mật.");
                    setSubmitting(false);
                    return;
                  }
                  signUpHandler(values, setSubmitting);
                }}
              >
                {({ values, setFieldValue, handleChange, errors, touched, isSubmitting }) => (
                  <Form className="space-y-5" aria-label="Form đăng ký tài khoản">
                    <input type="hidden" name="csrfToken" defaultValue={csrfToken} />

                    {/* Username */}
                    <div className="group/field">
                      <label htmlFor="username" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                        Họ và tên <span className="text-red-400">*</span>
                      </label>
                      <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.username && touched.username ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                        <FaUser className={`text-lg transition-colors duration-300 ${errors.username && touched.username ? 'text-red-400' : 'text-[#105d97]'}`} />
                        <input
                          id="username"
                          type="text"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          className="w-full py-3.5 bg-transparent text-black placeholder-gray-500 outline-none text-sm"
                          placeholder="Nhập họ và tên"
                          required
                        />
                      </div>
                      {errors.username && touched.username && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.username}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div className="group/field">
                        <label htmlFor="email" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.email && touched.email ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                          <FaEnvelope className={`text-lg transition-colors duration-300 ${errors.email && touched.email ? 'text-red-400' : 'text-[#105d97]'}`} />
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            className="w-full py-3.5 bg-transparent text-black placeholder-gray-500 outline-none text-sm"
                            placeholder="Email liên hệ"
                            required
                          />
                        </div>
                        {errors.email && touched.email && (
                          <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="group/field">
                        <label htmlFor="phone" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                          Điện thoại <span className="text-red-400">*</span>
                        </label>
                        <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.phone && touched.phone ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                          <FaPhoneAlt className={`text-lg transition-colors duration-300 ${errors.phone && touched.phone ? 'text-red-400' : 'text-[#105d97]'}`} />
                          <input
                            id="phone"
                            type="text"
                            name="phone"
                            value={values.phone}
                            onChange={handleChange}
                            className="w-full py-3.5 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                            placeholder="Số điện thoại"
                            required
                          />
                        </div>
                        {errors.phone && touched.phone && (
                          <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Password */}
                      <div className="group/field">
                        <label htmlFor="password" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                          Mật khẩu <span className="text-red-400">*</span>
                        </label>
                        <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.password && touched.password ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                          <FaLock className={`text-lg transition-colors duration-300 ${errors.password && touched.password ? 'text-red-400' : 'text-[#105d97]'}`} />
                          <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            className="w-full py-3.5 bg-transparent text-black placeholder-gray-500 outline-none text-sm"
                            placeholder="Mật khẩu"
                            required
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {errors.password && touched.password && (
                          <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="group/field">
                        <label htmlFor="confirm_password" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                          Xác nhận <span className="text-red-400">*</span>
                        </label>
                        <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.confirm_password && touched.confirm_password ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                          <FaLock className={`text-lg transition-colors duration-300 ${errors.confirm_password && touched.confirm_password ? 'text-red-400' : 'text-[#105d97]'}`} />
                          <input
                            id="confirm_password"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm_password"
                            value={values.confirm_password}
                            onChange={handleChange}
                            className="w-full py-3.5 bg-transparent text-white placeholder-gray-500 outline-none text-sm"
                            placeholder="Mật khẩu"
                            required
                          />
                          <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {errors.confirm_password && touched.confirm_password && (
                          <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.confirm_password}</p>
                        )}
                      </div>
                    </div>

                    {/* Agree to Terms */}
                    <div className="flex items-start gap-2 pt-2">
                      <div className="flex items-center h-5">
                        <input
                          id="agree"
                          type="checkbox"
                          name="agree"
                          checked={values.agree}
                          onChange={(e) => setFieldValue("agree", e.target.checked)}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#105d97] focus:ring-[#105d97] cursor-pointer transition-colors"
                        />
                      </div>
                      <label htmlFor="agree" className="text-xs text-gray-900 leading-6">
                        Tôi đồng ý với các{" "}
                        <Link href="/terms" className="text-[#105d97] hover:text-[#1e7bb8] font-medium transition-colors">
                          Điều khoản dịch vụ
                        </Link>{" "}
                        &{" "}
                        <Link href="/privacy" className="text-[#105d97] hover:text-[#1e7bb8] font-medium transition-colors">
                          Chính sách bảo mật
                        </Link>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group/btn overflow-hidden rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-blue-900/40 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#105d97] to-[#1e7bb8] group-hover/btn:from-[#0d4a7a] group-hover/btn:to-[#105d97] transition-all duration-500" />
                      <span className="relative z-10 block py-4 text-center tracking-wide uppercase text-sm">
                        {isSubmitting ? "Đang xử lý..." : "Đăng ký thành viên"}
                      </span>
                    </button>

                    {/* Link to Login */}
                    <div className="text-center pt-2">
                      <p className="text-gray-700 text-sm">
                        Đã có tài khoản?{" "}
                        <Link
                          href="/dang-nhap"
                          className="text-black hover:text-[#105d97] font-semibold underline underline-offset-4 decoration-white/20 hover:decoration-[#105d97] transition-all duration-300"
                        >
                          Đăng nhập ngay
                        </Link>
                      </p>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-center mt-8 text-white/40 text-xs">
            <p>&copy; {new Date().getFullYear()} Đồng Phục Univi. Bản quyền được bảo lưu.</p>
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });

  // Chỉ redirect nếu user thực sự đã đăng nhập (có session.user)
  if (session?.user) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }

  const csrfToken = await getCsrfToken(context);

  const meta = {
    title: "Đăng ký tài khoản - Đồng Phục Univi",
    description: "Đăng ký tài khoản tại Đồng Phục Univi để quản lý đơn hàng, xem lịch sử mua sắm và nhận ưu đãi độc quyền.",
    keywords: "đăng ký, Đồng Phục Univi, đồng phục thể thao, đồng phục gym, tài khoản khách hàng",
    author: "Đồng Phục Univi",
    robots: "noindex, follow",
    canonical: "https://dongphucunivi.com/dang-ky",
    og: {
      title: "Đăng ký tài khoản - Đồng Phục Univi",
      description: "Đăng ký tài khoản tại Đồng Phục Univi để quản lý đơn hàng và nhận ưu đãi độc quyền.",
      type: "website",
      image: "https://dongphucunivi.com/images/banner-home-1.jpg",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://dongphucunivi.com/dang-ky",
      site_name: "Đồng Phục Univi",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Đăng ký tài khoản - Đồng Phục Univi",
      description: "Đăng ký tài khoản tại Đồng Phục Univi để nhận ưu đãi độc quyền và dịch vụ cao cấp.",
      image: "https://dongphucunivi.com/images/banner-home-1.jpg",
    },
  };

  return {
    props: {
      csrfToken: csrfToken || null,
      meta,
    },
  };
}
