import React from "react";
import Image from "next/image";

const SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

export default function UniformOrderSheet({ order, printableRef }) {
  if (!order) return null;

  const designCodes = Array.isArray(order.designCodes)
    ? order.designCodes.filter(Boolean)
    : order.designCodes
      ? [order.designCodes]
      : [];

  const sewingDetails = Array.isArray(order.sewingDetails)
    ? order.sewingDetails.filter(Boolean)
    : order.sewingDetails
      ? [order.sewingDetails]
      : [];

  const craftPositions = order.craftPositions || {};
  const frontCraft = craftPositions.front || {};
  const leftCraft = craftPositions.leftSleeve || {};
  const backCraft = craftPositions.back || {};
  const rightCraft = craftPositions.rightSleeve || {};

  const menSizes = order.sizes?.men || {};
  const womenSizes = order.sizes?.women || {};

  // Check which sizes actually have data or default to S-4XL
  const activeSizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];
  if (Number(menSizes["5XL"] || 0) > 0 || Number(womenSizes["5XL"] || 0) > 0) {
    activeSizes.push("5XL");
  }

  return (
    <div
      ref={printableRef}
      className="uniform-order-sheet bg-white text-gray-900 border-[3px] border-[#0e568f] rounded-2xl relative overflow-hidden shadow-lg p-5 sm:p-7 max-w-[1000px] mx-auto font-sans"
      style={{
        WebkitPrintColorAdjust: "exact",
        printColorAdjust: "exact",
      }}
    >
      {/* Decorative top polygon header bar like the original sample */}
      <div className="absolute top-0 right-0 left-0 h-4 bg-gradient-to-r from-transparent via-[#0e568f] to-[#0e568f] opacity-90 pointer-events-none" />

      {/* ── HEADER ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-4 mb-5">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-28 h-12 flex items-center">
            {/* Fallback to text logo if logo image is not found */}
            <Image
              src="/logo-univi.webp"
              alt="Đồng Phục Univi"
              width={110}
              height={45}
              className="object-contain"
              priority
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="border-l-2 border-[#0e568f] pl-3">
            <h2 className="text-xl font-extrabold tracking-tight text-[#0e568f] uppercase leading-none">
              Đồng Phục UNIVI
            </h2>
            <p className="text-[11px] font-medium text-gray-500 tracking-wider uppercase mt-0.5">
              Uniform & Sportswear Production
            </p>
          </div>
        </div>

        {/* Center: NGÀY LÊN ĐƠN */}
        <div className="flex items-center">
          <div className="bg-[#0e568f] text-white px-5 py-2 rounded-xl shadow-sm flex items-center gap-2">
            <span className="font-extrabold text-sm uppercase tracking-wide">
              NGÀY LÊN ĐƠN:
            </span>
            <span className="font-bold text-sm bg-white/20 px-2.5 py-0.5 rounded-md">
              {order.orderDate || new Date().toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Right: Ngày lên biên bản */}
        <div className="text-right">
          <div className="text-red-600 italic font-black text-lg tracking-wide">
            Ngày lên biên bản:{" "}
            <span className="underline decoration-2">
              {order.reportDate ||
                order.orderDate?.slice(0, 5) ||
                new Date().toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}
            </span>
          </div>
          <p className="text-xs font-mono font-semibold text-gray-500 mt-0.5">
            Mã đơn: <span className="text-[#0e568f] font-bold">#{order.orderCode}</span>
          </p>
        </div>
      </div>

      {/* Customer summary strip (Compact, clear) */}
      <div className="bg-sky-50/70 border border-sky-100 rounded-xl px-4 py-2.5 mb-5 flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div>
            <span className="text-gray-500 font-medium">Khách hàng: </span>
            <span className="font-bold text-gray-900 text-sm">
              {order.customerName || "Chưa cập nhật"}
            </span>
            {order.customerPhone && (
              <span className="ml-2 text-gray-600 font-medium">
                - ĐT: <span className="font-bold text-gray-800">{order.customerPhone}</span>
              </span>
            )}
          </div>
          {order.customerFacebook && (
            <a
              href={order.customerFacebook.startsWith("http") ? order.customerFacebook : `https://${order.customerFacebook}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md hover:underline"
              title={order.customerFacebook}
            >
              <span>Facebook ↗</span>
            </a>
          )}
          {order.customerWebsite && (
            <a
              href={order.customerWebsite.startsWith("http") ? order.customerWebsite : `https://${order.customerWebsite}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md hover:underline"
              title={order.customerWebsite}
            >
              <span>Website ↗</span>
            </a>
          )}
        </div>
        <div className="flex items-center gap-4">
          {order.channel && (
            <div>
              <span className="text-gray-500">Kênh: </span>
              <span className="font-semibold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded-md">
                {order.channel}
              </span>
            </div>
          )}
          {order.salesRep && (
            <div>
              <span className="text-gray-500">Phụ trách: </span>
              <span className="font-semibold text-gray-800">{order.salesRep}</span>
            </div>
          )}
          {order.customerAddress && (
            <div className="max-w-xs truncate" title={order.customerAddress}>
              <span className="text-gray-500">Giao tới: </span>
              <span className="font-medium text-gray-700">{order.customerAddress}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN BODY GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* ── LEFT COLUMN (Mockup + Specs) ── */}
        <div className="md:col-span-5 flex flex-col gap-4">
          {/* Mockup Container */}
          <div className="border-2 border-slate-200 rounded-2xl p-3  flex items-center justify-center min-h-[290px] relative shadow-inner overflow-hidden">
            {order.mockupFull ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={order.mockupFull}
                alt="Thiết kế đồng phục"
                className="max-h-[300px] w-auto object-contain mx-auto transition-transform hover:scale-105"
              />
            ) : order.mockupFront || order.mockupBack ? (
              <div className="grid grid-cols-2 gap-2 w-full">
                {order.mockupFront && (
                  <div className="flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.mockupFront}
                      alt="Mặt trước"
                      className="max-h-[260px] object-contain"
                    />
                    <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase">
                      Mặt trước
                    </span>
                  </div>
                )}
                {order.mockupBack && (
                  <div className="flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={order.mockupBack}
                      alt="Mặt sau"
                      className="max-h-[260px] object-contain"
                    />
                    <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase">
                      Mặt sau
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <svg
                  className="w-16 h-16 stroke-1 text-gray-300 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-xs font-semibold text-gray-500">Chưa có ảnh Mockup</p>
                <p className="text-[10px] text-gray-400">Chọn ảnh từ Cloudflare R2 hoặc tải lên</p>
              </div>
            )}
          </div>

          {/* Design Codes & Sewing Details Box */}
          <div className="border-2 border-[#105d97]/40 rounded-xl p-4 bg-white shadow-sm flex-1 flex flex-col justify-center">
            {/* Design codes */}
            <div className="space-y-1 mb-3">
              {designCodes.length > 0 ? (
                designCodes.map((code, idx) => (
                  <div
                    key={idx}
                    className="font-black text-sm sm:text-base tracking-wide text-gray-900 font-mono"
                  >
                    {code}
                  </div>
                ))
              ) : (
                <div className="font-bold text-sm text-gray-400 italic">
                  Chưa nhập mã thiết kế
                </div>
              )}
            </div>

            {/* Bullet points: Sewing specs in Red / Accent */}
            <ul className="space-y-1.5 text-xs sm:text-sm font-semibold text-rose-600">
              {sewingDetails.length > 0 ? (
                sewingDetails.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-black leading-tight text-base">•</span>
                    <span className="text-rose-600 italic font-bold">{detail}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 italic font-normal text-xs">
                  (Chưa có thông số quy cách may)
                </li>
              )}
              {order.fabric && (
                <li className="flex items-start gap-2 text-indigo-700 italic">
                  <span className="text-indigo-500 font-black">•</span>
                  <span>Chất liệu vải: {order.fabric}</span>
                </li>
              )}
              {order.colors && (
                <li className="flex items-start gap-2 text-emerald-700 italic">
                  <span className="text-emerald-500 font-black">•</span>
                  <span>Màu sắc: {order.colors}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── RIGHT COLUMN (Craft Positions + Size Table + Timeline) ── */}
        <div className="md:col-span-7 flex flex-col gap-4">
          {/* 4 Craft Positions (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-3">
            {/* 1. MẶT TRƯỚC */}
            <div className="relative pt-3 border-2 border-slate-300 rounded-xl p-3 bg-white min-h-[105px] flex flex-col justify-between">
              <span className="absolute -top-3 left-4 bg-[#0e568f] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wider">
                MẶT TRƯỚC
              </span>
              <div className="space-y-1 mt-1 text-xs text-gray-800">
                <div>
                  <span className="text-gray-500 font-medium">- Chế tác: </span>
                  <span className="font-bold text-[#0e568f]">
                    {frontCraft.technique || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">- Kích thước: </span>
                  <span className="font-semibold text-gray-900">
                    {frontCraft.size || "—"}
                  </span>
                </div>
                {frontCraft.note && (
                  <p className="text-[11px] text-gray-500 italic truncate" title={frontCraft.note}>
                    {frontCraft.note}
                  </p>
                )}
              </div>
            </div>

            {/* 2. TAY TRÁI */}
            <div className="relative pt-3 border-2 border-slate-300 rounded-xl p-3 bg-white min-h-[105px] flex flex-col justify-between">
              <span className="absolute -top-3 left-4 bg-[#0e568f] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wider">
                TAY TRÁI
              </span>
              <div className="space-y-1 mt-1 text-xs text-gray-800">
                <div>
                  <span className="text-gray-500 font-medium">- Chế tác: </span>
                  <span className="font-bold text-[#0e568f]">
                    {leftCraft.technique || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">- Kích thước: </span>
                  <span className="font-semibold text-gray-900">
                    {leftCraft.size || "—"}
                  </span>
                </div>
                {leftCraft.note && (
                  <p className="text-[11px] text-gray-500 italic truncate" title={leftCraft.note}>
                    {leftCraft.note}
                  </p>
                )}
              </div>
            </div>

            {/* 3. MẶT SAU */}
            <div className="relative pt-3 border-2 border-slate-300 rounded-xl p-3 bg-white min-h-[105px] flex flex-col justify-between">
              <span className="absolute -top-3 left-4 bg-[#0e568f] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wider">
                MẶT SAU
              </span>
              <div className="space-y-1 mt-1 text-xs text-gray-800">
                <div>
                  <span className="text-gray-500 font-medium">- Chế tác: </span>
                  <span className="font-bold text-[#0e568f]">
                    {backCraft.technique || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">- Kích thước: </span>
                  <span className="font-semibold text-gray-900">
                    {backCraft.size || "—"}
                  </span>
                </div>
                {backCraft.note && (
                  <p className="text-[11px] text-gray-500 italic truncate" title={backCraft.note}>
                    {backCraft.note}
                  </p>
                )}
              </div>
            </div>

            {/* 4. TAY PHẢI */}
            <div className="relative pt-3 border-2 border-slate-300 rounded-xl p-3 bg-white min-h-[105px] flex flex-col justify-between">
              <span className="absolute -top-3 left-4 bg-[#0e568f] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm tracking-wider">
                TAY PHẢI
              </span>
              <div className="space-y-1 mt-1 text-xs text-gray-800">
                <div>
                  <span className="text-gray-500 font-medium">- Chế tác: </span>
                  <span className="font-bold text-[#0e568f]">
                    {rightCraft.technique || "—"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">- Kích thước: </span>
                  <span className="font-semibold text-gray-900">
                    {rightCraft.size || "—"}
                  </span>
                </div>
                {rightCraft.note && (
                  <p className="text-[11px] text-gray-500 italic truncate" title={rightCraft.note}>
                    {rightCraft.note}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Size Breakdown Table Matrix */}
          <div className="border-2 border-slate-400 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center text-xs">
                <thead>
                  <tr className="bg-slate-100/90 text-gray-900 font-black border-b-2 border-slate-400 divide-x-2 divide-slate-300">
                    <th className="py-2 px-2 w-14"></th>
                    {activeSizes.map((sz) => (
                      <th key={sz} className="py-2 px-1 text-sm font-extrabold tracking-wider">
                        {sz}
                      </th>
                    ))}
                    <th className="py-2 px-2 text-sm font-extrabold bg-slate-200/80">Tổng</th>
                    <th className="py-2 px-3 text-sm font-extrabold text-red-600 bg-red-50/50">
                      TỔNG SỐ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-300 font-semibold text-gray-900">
                  {/* Row: Nam */}
                  <tr className="divide-x-2 divide-slate-300 hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 font-black text-sm bg-slate-50">Nam</td>
                    {activeSizes.map((sz) => {
                      const val = Number(menSizes[sz] || 0);
                      return (
                        <td key={sz} className="py-2.5 px-1 font-bold text-sm">
                          {val > 0 ? val : ""}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-2 font-extrabold text-base bg-slate-100 text-gray-900">
                      {order.totalMen || 0}
                    </td>
                    {/* Merged cell for Grand Total Red text */}
                    <td
                      rowSpan={2}
                      className="py-3 px-3 align-middle bg-white border-l-2 border-slate-400"
                    >
                      <div className="font-black text-3xl sm:text-4xl text-red-600 leading-none tracking-tight">
                        {order.totalQuantity || 0}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Áo
                      </div>
                    </td>
                  </tr>

                  {/* Row: Nữ */}
                  <tr className="divide-x-2 divide-slate-300 hover:bg-slate-50/50">
                    <td className="py-2.5 px-2 font-black text-sm bg-slate-50">Nữ</td>
                    {activeSizes.map((sz) => {
                      const val = Number(womenSizes[sz] || 0);
                      return (
                        <td key={sz} className="py-2.5 px-1 font-bold text-sm">
                          {val > 0 ? val : ""}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-2 font-extrabold text-base bg-slate-100 text-gray-900">
                      {order.totalWomen || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Timeline Badges & Notes Box */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
            {/* Timeline Pills */}
            <div className="sm:col-span-5 flex flex-col justify-between gap-2.5">
              <div className="bg-[#0e568f] text-white px-4 py-2 rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-extrabold text-xs uppercase tracking-wide">
                  NGÀY XONG:
                </span>
                <span className="font-bold text-sm bg-white/20 px-2 py-0.5 rounded-md">
                  {order.completionDate || "Chưa đặt"}
                </span>
              </div>

              <div className="bg-[#0e568f] text-white px-4 py-2 rounded-xl flex items-center justify-between shadow-sm">
                <span className="font-extrabold text-xs uppercase tracking-wide">
                  NGÀY TRẢ:
                </span>
                <span className="font-bold text-sm bg-white/20 px-2 py-0.5 rounded-md">
                  {order.deliveryDate || "Chưa đặt"}
                </span>
              </div>
            </div>

            {/* Note Box */}
            <div className="sm:col-span-7 border-2 border-slate-300 rounded-xl p-3 bg-white min-h-[85px] flex flex-col justify-start">
              <span className="font-black text-xs text-gray-900 uppercase tracking-wide mb-1">
                Lưu ý:
              </span>
              <p className="text-xs text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                {order.note || "(Không có ghi chú thêm)"}
              </p>
            </div>
          </div>

          {/* Optional Financial mini summary if price is configured */}
          {order.unitPrice > 0 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl px-4 py-2 flex flex-wrap items-center justify-between text-xs text-amber-950 print:hidden">
              <div>
                <span className="text-amber-800">Đơn giá: </span>
                <span className="font-bold">{order.unitPrice?.toLocaleString("vi-VN")} đ</span>
              </div>
              <div>
                <span className="text-amber-800">Tổng tiền: </span>
                <span className="font-extrabold text-sm text-blue-700">
                  {order.totalAmount?.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div>
                <span className="text-amber-800">Đã cọc: </span>
                <span className="font-bold text-emerald-700">
                  {order.deposit?.toLocaleString("vi-VN")} đ
                </span>
              </div>
              <div>
                <span className="text-amber-800">Còn lại: </span>
                <span className="font-bold text-red-600">
                  {order.remaining?.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer stamp line for factory and signoff */}
      <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-gray-400 font-medium">
        <span>Biên bản sản xuất nội bộ - UNIVI SPORT & UNIFORM</span>
        <span>Hotline: 0834.204.999 - www.dongphucunivi.com</span>
      </div>
    </div>
  );
}
