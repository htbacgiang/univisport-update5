import React, { useRef } from "react";
import {
  FiX,
  FiPrinter,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiCheck,
} from "react-icons/fi";
import UniformOrderSheet from "./UniformOrderSheet";

const STATUS_MAP = {
  pending: { label: "Chờ xác nhận", color: "bg-amber-100 text-amber-800 border-amber-300" },
  in_production: { label: "Đang sản xuất", color: "bg-blue-100 text-blue-800 border-blue-300" },
  completed: { label: "Xưởng hoàn thành", color: "bg-purple-100 text-purple-800 border-purple-300" },
  delivering: { label: "Đang giao hàng", color: "bg-sky-100 text-sky-800 border-sky-300" },
  delivered: { label: "Đã giao thành công", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  cancelled: { label: "Đã hủy", color: "bg-rose-100 text-rose-800 border-rose-300" },
};

export default function UniformOrderDetailModal({
  isOpen,
  order,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const printableRef = useRef(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentStatus = STATUS_MAP[order.status] || STATUS_MAP.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      {/* Container - hide during print if needed, or print just the sheet */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl w-full max-w-6xl my-auto max-h-[96vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-base text-gray-900 dark:text-white">
              Đơn hàng: #{order.orderCode}
            </span>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border ${currentStatus.color}`}
            >
              {currentStatus.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Status Select */}
            <select
              value={order.status}
              onChange={(e) => onStatusChange?.(order.id || order._id, e.target.value)}
              className="text-xs font-bold px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#0e568f] outline-none"
            >
              <option value="pending">Chờ xác nhận</option>
              <option value="in_production">Đang sản xuất</option>
              <option value="completed">Xưởng đã xong</option>
              <option value="delivering">Đang giao hàng</option>
              <option value="delivered">Đã giao thành công</option>
              <option value="cancelled">Đã hủy</option>
            </select>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0e568f] hover:bg-[#0c4a7c] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-colors"
              title="In biên bản A4 hoặc Lưu file PDF"
            >
              <FiPrinter className="w-4 h-4" />
              In / Xuất PDF
            </button>

            {/* Edit Button */}
            <button
              onClick={() => onEdit?.(order)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <FiEdit className="w-4 h-4" />
              Chỉnh sửa
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete?.(order)}
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Xóa đơn hàng"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors ml-2"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Scrollable Sheet Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 dark:bg-gray-900">
          <div className="sheet-print-container">
            <UniformOrderSheet order={order} printableRef={printableRef} />
          </div>
        </div>
      </div>

      {/* Global CSS for seamless A4 printing */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .sheet-print-container,
          .sheet-print-container * {
            visibility: visible !important;
          }
          .sheet-print-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .uniform-order-sheet {
            box-shadow: none !important;
            border-width: 2px !important;
            max-width: 100% !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
}
