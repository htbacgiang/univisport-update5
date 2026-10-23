"use client";

import { useState, useEffect, useRef } from "react";
import ContactForm from "../header/ContactForm";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tư vấn nhu cầu",
    time: "Bước 1",
    desc: "Ai mặc, lớp mat hay lớp máy, bao nhiêu cơ sở, mặc thường xuyên đến đâu và vai trò của từng nhóm.",
  },
  {
    step: "02",
    title: "Thiết kế, mockup",
    time: "Bước 2",
    desc: "Đưa logo, màu chủ đạo và vị trí nhận diện vào phương án; duyệt trước khi sản xuất.",
  },
  {
    step: "03",
    title: "Chọn chất liệu, xem mẫu vải",
    time: "Bước 3",
    desc: "Ưu tiên cảm giác mặc, độ che phủ, co giãn, hồi form và thoát ẩm.",
  },
  {
    step: "04",
    title: "May mẫu",
    time: "Bước 4",
    desc: "May mẫu thật theo cấu hình đã thống nhất.",
  },
  {
    step: "05",
    title: "HLV mặc thử và vận động",
    time: "Bước 5",
    desc: "Cúi, xoay, nằm, giơ tay, đổi tư thế; nếu có Reformer thì thử luôn trên máy.",
  },
  {
    step: "06",
    title: "Điều chỉnh và chốt mẫu chuẩn",
    time: "Bước 6",
    desc: "Ghi rõ form, màu, logo, bảng size và quy cách may.",
  },
  {
    step: "07",
    title: "Sản xuất và kiểm tra chất lượng",
    time: "Bước 7",
    desc: "Kiểm form, đường may, màu và logo qua từng công đoạn.",
  },
  {
    step: "08",
    title: "Giao hàng toàn quốc và lưu thông số",
    time: "Bước 8",
    desc: "Lưu mẫu chuẩn để đặt lại khi tuyển thêm HLV hoặc mở cơ sở.",
  },
];

export default function ProcessSteps({ variant = "default" }) {
  const [contactOpen, setContactOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleForm = () => setContactOpen((v) => !v);

  useEffect(() => {
    if (!contactOpen) return;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [contactOpen]);

  if (variant === "vertical") {
    return (
      <div className="space-y-3">
        {PROCESS_STEPS.map((s, i) => (
          <div key={s.step} className="flex gap-4 border-l-4 border-[#105d97]/20 py-2 pl-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#105d97] text-sm font-bold text-white">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-900">{s.title}</h3>
                <span className="rounded-full bg-[#105d97]/10 px-2 py-0.5 text-xs font-medium text-[#105d97]">
                  {s.time}
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-600">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl uppercase font-bold text-gray-900 mb-1 max-w-6xl mx-auto leading-6">
            Từ yêu cầu đến sản phẩm{" "}
            <span className="text-[#105d97]">{PROCESS_STEPS.length} bước chuẩn hóa</span>
          </h2>
          <p className="text-gray-500 max-w-4xl mx-auto text-base leading-6">
            Quy trình được thiết kế để tiết kiệm tối đa thời gian của doanh nghiệp — rõ ràng, không phát sinh, đúng tiến độ.
          </p>
        </div>

        {/* Step cards grid — 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {PROCESS_STEPS.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between gap-3 hover:shadow-md transition-all duration-300 border-l-4 border-l-[#105d97]"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#105d97] text-sm font-bold text-white shadow-sm">
                    {s.step}
                  </span>
                  <span className="text-xs bg-[#105d97]/10 text-[#105d97] rounded-full px-2.5 py-1 font-medium">
                    {s.time}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={toggleForm}
            className="inline-flex items-center gap-2 bg-[#105d97] hover:bg-[#0d4f82] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Bắt đầu quy trình ngay →
          </button>
        </div>
      </div>

      {contactOpen && (
        <div
          className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center px-4"
          onClick={(e) => e.target === e.currentTarget && toggleForm()}
        >
          <div
            ref={modalRef}
            className="modal-content rounded-lg overflow-hidden"
          >
            <div className="bg-white px-6 py-4 flex justify-center items-center border-b rounded-t-lg relative">
              <h3 className="text-[#105d97] font-bold text-base md:text-lg tracking-wide uppercase text-center">
                Đăng ký tư vấn đồng phục Univi
              </h3>

              <button
                onClick={toggleForm}
                aria-label="Đóng form liên hệ"
                className="absolute right-4 text-[#105d97] hover:text-[#0d4c7a] focus:outline-none rounded-full p-2 transition-all hover:rotate-90 duration-300 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="bg-white">
              <ContactForm source="Process Steps" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
