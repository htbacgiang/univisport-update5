"use client";
import { useState } from "react";

export default function SidebarCTAForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    note: "",
  });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if ((errors as any)[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, message: "Đăng ký tư vấn từ Sidebar", service: "dong-phuc-univi" }),
      });
      if (response.ok) {
        setStatus("Đăng ký thành công!");
        setFormData({ name: "", phone: "", note: "" });
        setTimeout(() => setStatus(""), 5000);
      } else {
        throw new Error("Lỗi");
      }
    } catch {
      setStatus("Lỗi, vui lòng thử lại.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Đăng ký nhận báo giá</h3>
      <p className="text-sm text-gray-600 mb-4">Để lại thông tin, chúng tôi sẽ liên hệ tư vấn và báo giá ngay.</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên *"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#105d97] ${
              (errors as any).name ? "border-red-400" : "border-gray-200"
            }`}
          />
          {(errors as any).name && <p className="text-red-500 text-xs mt-1">{(errors as any).name}</p>}
        </div>
        
        <div>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại *"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#105d97] ${
              (errors as any).phone ? "border-red-400" : "border-gray-200"
            }`}
          />
          {(errors as any).phone && <p className="text-red-500 text-xs mt-1">{(errors as any).phone}</p>}
        </div>

        <div>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange as any}
            placeholder="Ghi chú thêm (không bắt buộc)"
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#105d97] resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={status === "Đang gửi..."}
          className="w-full py-2.5 bg-[#105d97] text-white rounded-lg font-semibold hover:bg-[#0d4a7a] transition-colors disabled:opacity-70 text-sm"
        >
          {status === "Đang gửi..." ? "Đang xử lý..." : "Nhận tư vấn ngay"}
        </button>

        {status && status !== "Đang gửi..." && (
          <p className={`text-xs text-center mt-2 ${status.includes("thành công") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
