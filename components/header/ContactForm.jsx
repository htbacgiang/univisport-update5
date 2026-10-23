"use client";
import { useState, useEffect, useRef } from "react";
import { trackLead } from "../../lib/meta-pixel";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";

export default function ContactForm({ source, isModal = false, isOpen = false, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    source: source || "",
  });
  const [resolvedSource, setResolvedSource] = useState(source || "");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const modalRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ (VD: 0987654321)";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (formData.message.length > 500)
      newErrors.message = "Tin nhắn không được vượt quá 500 ký tự";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (source) {
      setResolvedSource(source);
    } else {
      setResolvedSource(window.location.pathname || window.location.href);
    }
  }, [source]);

  useEffect(() => {
    const currentFormRef = formRef.current;
    if (!currentFormRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation =
              "cfSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(currentFormRef);
    return () => {
      observer.unobserve(currentFormRef);
    };
  }, []);

  // Modal event listeners (Escape, Tab focus trapping)
  useEffect(() => {
    if (!isModal || !isOpen) return;
    const modal = modalRef.current;
    const focusables = modal?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusables?.[0];
    const last = focusables?.[focusables.length - 1];

    const onEscape = (e) => e.key === "Escape" && onClose && onClose();
    const onTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    if (first && typeof first.focus === "function") {
      try {
        first.focus({ preventScroll: true });
      } catch {
        first.focus();
      }
    }

    window.addEventListener("keydown", onEscape);
    modal?.addEventListener("keydown", onTab);
    return () => {
      window.removeEventListener("keydown", onEscape);
      modal?.removeEventListener("keydown", onTab);
    };
  }, [isModal, isOpen, onClose]);

  // Modal body scroll lock
  useEffect(() => {
    if (!isModal) return;
    const html = document.documentElement;
    if (isOpen) {
      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "contain";
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "contain";
      document.body.style.touchAction = "none";
    } else {
      html.style.overflow = "";
      html.style.overscrollBehavior = "";
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.touchAction = "";
    }
  }, [isModal, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: resolvedSource }),
      });
      const result = await response.json();
      if (response.ok) {
        trackLead({
          content_name: "Form đăng ký tư vấn",
          source: resolvedSource,
          phone_provided: Boolean(formData.phone),
          email_provided: Boolean(formData.email),
        });
        setStatus("Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm nhất.");
        setFormData({ name: "", phone: "", email: "", message: "", source: source || "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        throw new Error(result.message || "Không thể gửi yêu cầu");
      }
    } catch {
      setStatus("Lỗi: Vui lòng thử lại hoặc liên hệ qua hotline.");
    }
  };

  const inputBase =
    "w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#105d97] focus:ring-1 focus:ring-[#105d97]/20 transition-colors duration-200";

  const formContent = (
    <section className={`${isModal ? "bg-white p-0" : "bg-[#f3f3f0] py-6 px-6 md:px-6"} font-sans`}>
      <div
        ref={formRef}
        className={`cf-animate mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 items-start ${isModal ? "max-w-full p-6 md:p-8" : "max-w-[1100px]"}`}
      >
        {/* ── LEFT: info + image ── */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
            <Image
              src="/images/dong-phuc-cong-ty.webp"
              alt="UniviSport showroom"
              fill
              sizes="(max-width: 1100px) 35vw, 380px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* ── RIGHT: form ── */}
        <div>
          <form onSubmit={handleSubmit} role="form" className="flex flex-col gap-[18px]">
            {/* Row 1: Họ tên + Điện thoại */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-[13px] font-medium text-gray-600">
                  Họ và Tên <span className="text-[#105d97]">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nguyễn Văn A"
                  className={`${inputBase} ${errors.name ? "border-red-400" : ""}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-[13px] font-medium text-gray-600">
                  Điện thoại <span className="text-[#105d97]">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0834.204.999"
                  className={`${inputBase} ${errors.phone ? "border-red-400" : ""}`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Row 2: Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-gray-600">
                Email{" "}
                <span className="text-[11px] font-normal text-gray-400 ml-1">
                  (tùy chọn)
                </span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="dongphucunivi@gmail.com"
                className={`${inputBase} ${errors.email ? "border-red-400" : ""}`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Row 3: Nội dung */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-[13px] font-medium text-gray-600">
                Nội dung{" "}
                <span className="text-[11px] font-normal text-gray-400 ml-1">
                  (tùy chọn)
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="VD: Tôi cần may 50 bộ đồng phục gym cho CLB thể thao, màu xanh navy phối trắng, có in logo và tên CLB. Deadline giao hàng trước 15/7. Liên hệ lại giờ hành chính."
                rows={5}
                className={`${inputBase} resize-y min-h-[120px] md:min-h-[160px] ${errors.message ? "border-red-400" : ""}`}
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            {/* Submit button */}
            <div className="mt-1 flex justify-end">
              <button
                type="submit"
                disabled={status === "Đang gửi..."}
                className="inline-flex items-center gap-2.5 bg-white text-gray-900 border-2 border-gray-200 rounded-full px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 hover:border-[#105d97] hover:text-[#105d97] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "Đang gửi..." ? "Đang gửi..." : "Gửi tin nhắn"}
                {status !== "Đang gửi..." && (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#105d97] text-white flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>

            {/* Status message */}
            {status && status !== "Đang gửi..." && (
              <p
                className={`text-[13px] font-medium px-4 py-3 rounded-lg border-l-4 ${status.includes("thành công")
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
                  }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <style>{`
        @keyframes cfSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cf-animate {
          animation: cfSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {isModal ? (
        isOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
            role="dialog"
            aria-modal="true"
          >
            <div
              ref={modalRef}
              className="relative max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-xl w-full max-w-[1100px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white px-6 py-4 flex justify-center items-center border-b rounded-t-lg relative">
                <h3 className="text-[#105d97] font-bold text-base md:text-lg tracking-wide uppercase text-center">
                  Đăng ký tư vấn đồng phục Univi
                </h3>
                <button
                  onClick={onClose}
                  className="absolute right-4 text-[#105d97] hover:text-[#0d4c7a] transition-colors rounded-full p-1 hover:rotate-90 duration-300"
                  aria-label="Đóng"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              {formContent}
            </div>
          </div>
        )
      ) : (
        formContent
      )}
    </>
  );
}
