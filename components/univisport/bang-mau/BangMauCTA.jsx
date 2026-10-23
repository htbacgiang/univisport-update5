import { useState } from "react";
import { ShieldCheck, PackageCheck, Factory, Headset } from "lucide-react";
import ContactForm from "../../header/ContactForm";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Đảm bảo màu chuẩn",
    desc: "Màu thực tế trên từng loại vải",
  },
  {
    icon: PackageCheck,
    title: "Hỗ trợ mẫu vải",
    desc: "Gửi mẫu tận nơi miễn phí",
  },
  {
    icon: Factory,
    title: "Sản xuất theo yêu cầu",
    desc: "Đồng màu - đúng chất liệu",
  },
  {
    icon: Headset,
    title: "Tư vấn chuyên nghiệp",
    desc: "Đồng hành cùng thương hiệu",
  },
];

export default function BangMauCTA() {
  const [contactModal, setContactModal] = useState({ open: false, source: "" });

  const openContact = (source) => setContactModal({ open: true, source });

  return (
    <>
      <section className="bg-gradient-to-br from-[#105d97] to-[#0c4d7d] py-14 md:py-18">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Đã chọn được màu?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white md:text-base">
            Gửi mã màu cho Univi. Đội ngũ tư vấn sẽ giúp bạn lựa chọn chất liệu, kiểu dáng và phương án
            phối màu phù hợp với bộ nhận diện thương hiệu.
          </p>
          <div className="mt-8 flex flex-col-2 justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openContact("Bảng màu - CTA: Yêu cầu tư vấn")}
              className="rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-[#105d97] transition-colors hover:bg-gray-100"
            >
              Yêu cầu tư vấn
            </button>
            <button
              type="button"
              onClick={() => openContact("Bảng màu - CTA: Nhận mẫu vải")}
              className="rounded-full border-2 border-white/70 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
            >
              Nhận mẫu vải
            </button>
          </div>
        </div>
      </section>
      <ContactForm
        isModal
        isOpen={contactModal.open}
        source={contactModal.source}
        onClose={() => setContactModal({ open: false, source: "" })}
      />
    </>
  );
}
