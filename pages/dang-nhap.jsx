import Link from "next/link";
import Head from "next/head"; // Thêm Head
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react"; // Thêm useEffect
import { getCsrfToken, getProviders, getSession, signIn } from "next-auth/react";
import Router from "next/router";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

// Định nghĩa giá trị ban đầu
const initialValues = {
  login_email: "",
  login_password: "",
  success: "",
  error: "",
  login_error: "",
};

// Schema validation với Yup
const loginValidation = Yup.object({
  login_email: Yup.string()
    .required("Nhập địa chỉ email.")
    .email("Vui lòng nhập địa chỉ email chính xác."),
  login_password: Yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function Signin({ providers, callbackUrl, csrfToken }) {
  // Tải dữ liệu từ Local Storage nếu có
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("savedEmail") || "";
      const savedPassword = localStorage.getItem("savedPassword") || "";
      return {
        ...initialValues,
        login_email: savedEmail,
        login_password: savedPassword,
      };
    }
    return initialValues;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State cho checkbox

  const { login_email, login_password } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setStatus("Đang đăng nhập...");
    setSubmitting(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.login_email,
        password: values.login_password,
      });

      if (res?.error) {
        setStatus(`Lỗi: ${res.error}`);
        setFormData((prev) => ({ ...prev, login_error: res.error }));
      } else {
        setStatus("Đăng nhập thành công!");
        // Lưu vào Local Storage nếu checkbox được tích
        if (rememberMe) {
          localStorage.setItem("savedEmail", values.login_email);
          localStorage.setItem("savedPassword", values.login_password);
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("savedPassword");
        }
        setFormData(initialValues);
        setTimeout(() => setStatus(""), 3000);
        Router.push("/dashboard");
      }
    } catch (error) {
      setStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi đăng nhập"}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Đăng Nhập - Đồng Phục Univi</title>
        <meta name="description" content="Đăng nhập vào tài khoản Đồng Phục Univi để quản lý đơn hàng, xem lịch sử mua sắm và nhận ưu đãi độc quyền. Chất lượng cao, thiết kế chuyên nghiệp." />
        <meta name="keywords" content="đăng nhập, Đồng Phục Univi, đồng phục thể thao, đồng phục gym, tài khoản khách hàng" />
        <meta name="robots" content="noindex, nofollow" key="robots" /> {/* Login page không cần SEO */}
        <meta name="author" content="Đồng Phục Univi" />
        <link rel="canonical" href="https://dongphucunivi.vn/auth/dang-nhap" />
        {/* Open Graph */}
        <meta property="og:title" content="Đăng Nhập - Đồng Phục Univi" />
        <meta property="og:description" content="Đăng nhập để trải nghiệm dịch vụ của Đồng Phục Univi. Quản lý đơn hàng và nhận ưu đãi độc quyền." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dongphucunivi.com/dang-nhap" />
        <meta property="og:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Đăng Nhập - Đồng Phục Univi" />
        <meta name="twitter:description" content="Đăng nhập để trải nghiệm dịch vụ của Đồng Phục Univi. Quản lý đơn hàng và nhận ưu đãi độc quyền." />
        <meta name="twitter:image" content="https://dongphucunivi.com/images/banner-home-1.jpg" />
      </Head>
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
            alt="Đồng phục Univi - Đăng nhập"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-[#105d97]/40" />
        </div>

        <div className="w-full max-w-md relative z-10 animate-fade-in-up">
          <div className="backdrop-blur-xl bg-white/80 border border-white/20 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden relative group">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#105d97]/30 rounded-full blur-3xl group-hover:bg-[#105d97]/40 transition-all duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#105d97]/20 rounded-full blur-3xl group-hover:bg-[#105d97]/30 transition-all duration-700" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-extrabold text-gray-600 mb-2 tracking-tight">Đăng nhập</h1>
                <p className="text-gray-800 text-sm">Chào mừng bạn quay trở lại với Univi</p>
              </div>

              <Formik
                enableReinitialize
                initialValues={{
                  login_email,
                  login_password,
                }}
                validationSchema={loginValidation}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-5">
                    <input
                      type="hidden"
                      name="csrfToken"
                      defaultValue={csrfToken}
                    />

                    {/* Email */}
                    <div className="group/field">
                      <label htmlFor="login_email" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                        Địa chỉ Email <span className="text-red-400">*</span>
                      </label>
                      <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.login_email && touched.login_email ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                        <FaUser className={`text-lg transition-colors duration-300 ${errors.login_email && touched.login_email ? 'text-red-400' : 'text-[#105d97]'}`} />
                        <input
                          id="login_email"
                          type="text"
                          name="login_email"
                          value={login_email}
                          onChange={handleChange}
                          className="w-full py-3.5 bg-transparent text-black placeholder-gray-500 outline-none text-sm"
                          placeholder="Email của bạn"
                          required
                        />
                      </div>
                      {errors.login_email && touched.login_email && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.login_email}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="group/field">
                      <label htmlFor="login_password" className="block text-black text-xs font-semibold mb-1.5 ml-1 uppercase tracking-wider">
                        Mật khẩu <span className="text-red-400">*</span>
                      </label>
                      <div className={`flex items-center border transition-all duration-300 rounded-xl bg-white/5 backdrop-blur-sm px-4 gap-3 ${errors.login_password && touched.login_password ? 'border-red-500/50 ring-2 ring-red-500/20' : 'border-white/10 focus-within:border-[#105d97] focus-within:ring-2 focus-within:ring-[#105d97]/30'}`}>
                        <FaLock className={`text-lg transition-colors duration-300 ${errors.login_password && touched.login_password ? 'text-red-400' : 'text-[#105d97]'}`} />
                        <input
                          id="login_password"
                          type={showPassword ? "text" : "password"}
                          name="login_password"
                          value={login_password}
                          onChange={handleChange}
                          className="w-full py-3.5 bg-transparent text-black placeholder-gray-500 outline-none text-sm"
                          placeholder="Mật khẩu"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-400 hover:text-black transition-colors"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.login_password && touched.login_password && (
                        <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fadeIn">{errors.login_password}</p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center">
                        <input
                          id="remember_me"
                          type="checkbox"
                          name="remember_me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-[#105d97] focus:ring-[#105d97] cursor-pointer transition-colors"
                        />
                        <label htmlFor="remember_me" className="ml-2 text-xs text-gray-700 cursor-pointer">Lưu mật khẩu</label>
                      </div>
                      <Link
                        href="/auth/quen-mat-khau"
                        className="text-xs text-[#105d97] hover:text-[#1e7bb8] font-medium transition-colors"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>

                    {/* Status Message */}
                    {status && (
                      <p
                        className={`text-center text-sm font-medium ${status.includes("thành công") ? "text-green-600" : "text-red-500"
                          }`}
                      >
                        {status}
                      </p>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || status === "Đang đăng nhập..."}
                      className="w-full relative group/btn overflow-hidden rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all duration-300 hover:shadow-blue-900/40 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#105d97] to-[#1e7bb8] group-hover/btn:from-[#0d4a7a] group-hover/btn:to-[#105d97] transition-all duration-500" />
                      <span className="relative z-10 block py-4 text-center tracking-wide uppercase text-sm">
                        {isSubmitting || status === "Đang đăng nhập..." ? "Đang xử lý..." : "Đăng nhập ngay"}
                      </span>
                    </button>

                    {/* Link to Signup */}
                    <div className="text-center pt-2">
                      <p className="text-gray-700 text-sm">
                        Chưa có tài khoản?{" "}
                        <Link
                          href="/dang-ky"
                          className="text-black hover:text-[#105d97] font-semibold underline underline-offset-4 decoration-black/20 hover:decoration-[#105d97] transition-all duration-300"
                        >
                          Đăng ký thành viên
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
  const { req, query } = context;
  const session = await getSession({ req });
  const callbackUrl = query.callbackUrl || null;

  // Chỉ redirect nếu user thực sự đã đăng nhập (có session.user)
  if (session?.user) {
    return {
      redirect: {
        destination: "/dashboard",
      },
    };
  }

  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  return {
    props: {
      providers: providers ? Object.values(providers) : [],
      csrfToken: csrfToken || null,
      callbackUrl,
    },
  };
}
