export const newUserNotificationTemplate = (userData) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          font-family: Arial, sans-serif; 
        }
        .header { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 10px 10px 0 0; 
        }
        .content { 
          background: #f8f9fa; 
          padding: 30px; 
          border-radius: 0 0 10px 10px; 
        }
        .info-box { 
          background: white; 
          padding: 20px; 
          border-radius: 8px; 
          margin: 20px 0; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        }
        .info-item { 
          margin: 10px 0; 
          padding: 8px 0; 
          border-bottom: 1px solid #eee; 
        }
        .info-item:last-child { 
          border-bottom: none; 
        }
        .label { 
          font-weight: bold; 
          color: #333; 
          display: inline-block; 
          width: 120px; 
        }
        .value { 
          color: #666; 
        }
        .footer { 
          text-align: center; 
          margin-top: 20px; 
          color: #666; 
          font-size: 14px; 
        }
        .urgent { 
          color: #e74c3c; 
          font-weight: bold; 
        }
        .success { 
          color: #27ae60; 
          font-weight: bold; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🎉 Thông báo: Người dùng mới đăng ký</h2>
          <p>Từ website đồng phục UniVi</p>
        </div>
        <div class="content">
          <p>Xin chào Admin,</p>
          <p class="success">Một người dùng mới vừa đăng ký tài khoản!</p>
          
          <div class="info-box">
            <h3 style="color: #333; margin-top: 0;">👤 Thông tin người dùng:</h3>
            <div class="info-item">
              <span class="label">📝 Họ và tên:</span>
              <span class="value">${userData.name}</span>
            </div>
            <div class="info-item">
              <span class="label">📧 Email:</span>
              <span class="value">${userData.email}</span>
            </div>
            <div class="info-item">
              <span class="label">📱 Số điện thoại:</span>
              <span class="value">${userData.phone}</span>
            </div>
            <div class="info-item">
              <span class="label">⏰ Thời gian đăng ký:</span>
              <span class="value">${new Date(userData.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            <div class="info-item">
              <span class="label">✅ Trạng thái:</span>
              <span class="value">Chờ kích hoạt email</span>
            </div>
          </div>
          
          <div class="info-box">
            <h3 style="color: #333; margin-top: 0;">📋 Hành động cần thực hiện:</h3>
            <ul style="color: #666; line-height: 1.6;">
              <li>Kiểm tra thông tin người dùng</li>
              <li>Xác nhận email đã được gửi kích hoạt</li>
              <li>Theo dõi quá trình kích hoạt tài khoản</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>Email này được gửi tự động từ hệ thống đồng phục UniVi</p>
            <p>Thời gian: ${new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
