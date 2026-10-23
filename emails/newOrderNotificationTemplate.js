const paymentMethodText = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BankTransfer: "Chuyển khoản ngân hàng",
  MoMo: "Thanh toán qua MoMo",
};

function formatCurrency(amount) {
  return Number(amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export const newOrderNotificationTemplate = (order) => {
  const {
    orderCode,
    name,
    phone,
    shippingAddress,
    note,
    orderItems = [],
    totalPrice,
    discount,
    coupon,
    shippingFee,
    finalTotal,
    paymentMethod,
    paymentCode,
    status,
    createdAt,
  } = order;

  const itemsHtml = orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;">
          <div style="display:flex;align-items:center;gap:10px;">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;border:1px solid #eee;" />` : ""}
            <div>
              <div style="font-weight:600;color:#1a1a1a;">${item.title}</div>
              ${item.unit ? `<div style="font-size:12px;color:#888;">Đơn vị: ${item.unit}</div>` : ""}
            </div>
          </div>
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:center;color:#555;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;color:#555;">${formatCurrency(item.price)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:600;color:#105d97;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `
    )
    .join("");

  const statusLabel = {
    pending: "Chờ xử lý",
    paid: "Đã thanh toán",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
  }[status] || status;

  const statusColor = {
    pending: "#f59e0b",
    paid: "#10b981",
    shipped: "#3b82f6",
    delivered: "#6b7280",
    cancelled: "#ef4444",
  }[status] || "#6b7280";

  const orderTime = createdAt
    ? new Date(createdAt).toLocaleString("vi-VN")
    : new Date().toLocaleString("vi-VN");

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Thông báo đơn hàng mới</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:620px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#105d97 0%,#0ea5e9 100%);padding:30px 24px;text-align:center;">
      <div style="font-size:32px;margin-bottom:8px;">🛒</div>
      <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Đơn hàng mới vừa được đặt!</h1>
      <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Đồng Phục Univi – Hệ thống quản lý đơn hàng</p>
    </div>

    <!-- Order code banner -->
    <div style="background:#f0f7ff;border-left:4px solid #105d97;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <div style="font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Mã đơn hàng</div>
        <div style="font-size:18px;font-weight:700;color:#105d97;font-family:monospace;">#${orderCode || "—"}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;color:#6b7280;">Thời gian đặt</div>
        <div style="font-size:13px;font-weight:600;color:#374151;">${orderTime}</div>
      </div>
    </div>

    <div style="padding:24px;">

      <!-- Trạng thái -->
      <div style="margin-bottom:20px;">
        <span style="background:${statusColor}20;color:${statusColor};border:1px solid ${statusColor}40;padding:5px 14px;border-radius:20px;font-size:13px;font-weight:600;">${statusLabel}</span>
      </div>

      <!-- Thông tin khách hàng -->
      <div style="background:#f9fafb;border-radius:10px;padding:18px;margin-bottom:20px;">
        <h2 style="margin:0 0 14px;font-size:15px;color:#374151;font-weight:700;display:flex;align-items:center;gap:6px;">
          👤 Thông tin khách hàng
        </h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:5px 0;color:#6b7280;width:140px;">Họ và tên</td>
            <td style="padding:5px 0;font-weight:600;color:#1a1a1a;">${name}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;">Số điện thoại</td>
            <td style="padding:5px 0;font-weight:600;color:#1a1a1a;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#6b7280;">Địa chỉ giao hàng</td>
            <td style="padding:5px 0;color:#374151;">${shippingAddress?.address || "—"}</td>
          </tr>
          ${note ? `
          <tr>
            <td style="padding:5px 0;color:#6b7280;">Ghi chú</td>
            <td style="padding:5px 0;color:#374151;font-style:italic;">${note}</td>
          </tr>` : ""}
        </table>
      </div>

      <!-- Thanh toán -->
      <div style="background:#f9fafb;border-radius:10px;padding:18px;margin-bottom:20px;">
        <h2 style="margin:0 0 14px;font-size:15px;color:#374151;font-weight:700;">💳 Thanh toán</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:5px 0;color:#6b7280;width:140px;">Phương thức</td>
            <td style="padding:5px 0;font-weight:600;color:#1a1a1a;">${paymentMethodText[paymentMethod] || paymentMethod}</td>
          </tr>
          ${paymentCode ? `
          <tr>
            <td style="padding:5px 0;color:#6b7280;">Mã giao dịch</td>
            <td style="padding:5px 0;font-family:monospace;color:#105d97;font-weight:600;">${paymentCode}</td>
          </tr>` : ""}
        </table>
      </div>

      <!-- Sản phẩm -->
      <div style="margin-bottom:20px;">
        <h2 style="margin:0 0 14px;font-size:15px;color:#374151;font-weight:700;">📦 Sản phẩm đặt hàng</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;border-radius:10px;overflow:hidden;border:1px solid #f0f0f0;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:10px 8px;text-align:left;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Sản phẩm</th>
              <th style="padding:10px 8px;text-align:center;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">SL</th>
              <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Đơn giá</th>
              <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6b7280;font-weight:600;text-transform:uppercase;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>

      <!-- Tổng kết -->
      <div style="background:#f0f7ff;border-radius:10px;padding:18px;">
        <h2 style="margin:0 0 14px;font-size:15px;color:#374151;font-weight:700;">🧾 Tổng kết đơn hàng</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr>
            <td style="padding:5px 0;color:#6b7280;">Tạm tính</td>
            <td style="padding:5px 0;text-align:right;color:#374151;">${formatCurrency(totalPrice)}</td>
          </tr>
          ${discount > 0 ? `
          <tr>
            <td style="padding:5px 0;color:#10b981;">Giảm giá${coupon ? ` (${coupon})` : ""}</td>
            <td style="padding:5px 0;text-align:right;color:#10b981;">- ${formatCurrency(discount)}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:5px 0;color:#6b7280;">Phí vận chuyển</td>
            <td style="padding:5px 0;text-align:right;color:#374151;">${formatCurrency(shippingFee)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top:10px;border-top:2px solid #dbeafe;"></td>
          </tr>
          <tr>
            <td style="padding:8px 0 0;font-size:16px;font-weight:700;color:#1a1a1a;">Tổng thanh toán</td>
            <td style="padding:8px 0 0;text-align:right;font-size:18px;font-weight:700;color:#105d97;">${formatCurrency(finalTotal)}</td>
          </tr>
        </table>
      </div>

      <!-- CTA -->
      <div style="text-align:center;margin-top:24px;">
        <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/don-hang"
           style="display:inline-block;background:linear-gradient(135deg,#105d97,#0ea5e9);color:#ffffff;text-decoration:none;padding:13px 32px;border-radius:8px;font-weight:700;font-size:15px;">
          Xem đơn hàng trong Dashboard →
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:16px 24px;text-align:center;">
      <p style="margin:0;font-size:12px;color:#9ca3af;">
        Email này được gửi tự động từ hệ thống Đồng Phục Univi.<br/>
        Thời gian gửi: ${new Date().toLocaleString("vi-VN")}
      </p>
    </div>

  </div>
</body>
</html>
  `;
};
