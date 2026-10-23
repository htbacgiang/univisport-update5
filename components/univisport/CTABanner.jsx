"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaPhone, FaEnvelope, FaTimes } from "react-icons/fa";
import ContactForm from "../header/ContactForm";

export default function CTABannerSection() {
    const [open, setOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState("");
    const modalRef = useRef(null);
    const prevFocusRef = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setCurrentPath(window.location.pathname);
        }
    }, []);

    useEffect(() => {
        if (!open) return;
        const modal = modalRef.current;
        const focusables = modal?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusables?.[0];
        const last = focusables?.[focusables.length - 1];

        const onEscape = (e) => e.key === "Escape" && setOpen(false);
        const onTab = (e) => {
            if (e.key !== "Tab") return;
            if (e.shiftKey && document.activeElement === first) e.preventDefault(), last?.focus();
            else if (!e.shiftKey && document.activeElement === last) e.preventDefault(), first?.focus();
        };

        prevFocusRef.current = document.activeElement;
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
    }, [open]);

    useEffect(() => {
        const html = document.documentElement;
        if (open) {
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
            const prev = prevFocusRef.current;
            if (prev && typeof prev.focus === "function") {
                try {
                    prev.focus({ preventScroll: true });
                } catch {
                    prev.focus();
                }
            }
        }
    }, [open]);

    return (
        <section
            className="relative min-h-[60vh] flex items-center overflow-hidden bg-center bg-no-repeat bg-[url('/images/menu-banner-1.jpg')] bg-[length:auto_100%] md:bg-[url('/images/banner-cta.jpg')] md:bg-[length:100%_auto] px-6"
            aria-label="Kêu gọi hành động - Nhận tư vấn đồng phục"
        >
            <div className="absolute inset-0 z-[1] bg-black/60" aria-hidden />

            <div className="container mx-auto px-4 relative z-10 py-20 md:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Trái: Tiêu đề + mô tả */}
                    <div className="lg:col-span-7">
                        <h2 className="font-medium tracking-tight text-3xl md:text-3xl text-white leading-6 mb-6">
                            Thiết kế đồng phục riêng cho đội nhóm của bạn!
                        </h2>
                        <p className="text-[#D3D3D3] text-base md:text-lg leading-6 max-w-2xl">
                            Từ GYM, Yoga, Pickleball đến đồng phục doanh nghiệp - Đồng Phục Univi tư vấn miễn phí, thiết kế theo yêu cầu, giao hàng toàn quốc. Chất lượng vải cao cấp, đường may chuẩn chỉnh, bàn giao đúng hẹn.
                        </p>
                    </div>

                    {/* Phải: Nút CTA + Liên hệ */}
                    <div className="lg:col-span-4 md:col-span-6 flex flex-col items-start lg:items-start">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="inline-block w-full px-8 py-4 bg-[#105d97] text-white font-medium uppercase tracking-wider text-sm hover:bg-[#0d4c7a] transition-colors mb-10 rounded-sm"
                            aria-haspopup="dialog"
                            aria-expanded={open}
                        >
                            Nhận tư vấn miễn phí
                        </button>

                        <div className="flex flex-wrap gap-8">
                            <a href="tel:0834204999" className="flex items-start gap-4 group">
                                <span className="flex-shrink-0 w-11 h-11 rounded bg-[#105d97] border border-[#0d4c7a] flex items-center justify-center text-white group-hover:bg-[#0d4c7a] transition-colors">
                                    <FaPhone className="w-4 h-4" />
                                </span>
                                <span className="block">
                                    <span className="block text-white font-semibold">0834 204 999</span>
                                    <span className="block text-[#C0C0C0] text-sm mt-0.5">Hotline tư vấn</span>
                                </span>
                            </a>
                            <a href="mailto:dongphucunivi@gmail.com" className="flex items-start gap-4 group">
                                <span className="flex-shrink-0 w-11 h-11 rounded bg-[#105d97] border border-[#0d4c7a] flex items-center justify-center text-white group-hover:bg-[#0d4c7a] transition-colors">
                                    <FaEnvelope className="w-4 h-4" />
                                </span>
                                <span className="block">
                                    <span className="block text-white font-semibold">dongphucunivi@gmail.com</span>
                                    <span className="block text-[#C0C0C0] text-sm mt-0.5">Liên hệ email</span>
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && setOpen(false)}
                >
                    <div ref={modalRef} className="my-4 mx-4 container max-w-[1100px]" role="dialog" aria-labelledby="cta-contact-form-title">
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                            <div className="bg-gradient-to-r from-[#105d97] to-[#0e4a7a] text-white px-5 py-3.5 flex justify-between items-center">
                                <h2 id="cta-contact-form-title" className="text-lg font-medium uppercase">Liên hệ nhận báo giá</h2>
                                <button
                                    onClick={() => setOpen(false)}
                                    aria-label="Đóng"
                                    className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1.5 focus:outline-none transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="bg-white"><ContactForm source={`CTA Banner (${currentPath})`} /></div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
