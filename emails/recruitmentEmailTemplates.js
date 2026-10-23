export const newApplicationNotificationTemplate = ({ name, email, phone, position, cvUrl, message }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #105d97, #0ea5e9); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-row { margin: 15px 0; padding: 15px; background: white; border-left: 4px solid #105d97; border-radius: 4px; }
        .label { font-weight: bold; color: #105d97; display: inline-block; width: 150px; }
        .value { color: #333; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">🎯 Ứng Viên Mới</h1>
          <p style="margin: 10px 0 0;">Đồng Phục Univi - Tuyển Dụng</p>
        </div>
        <div class="content">
          <h2 style="color: #105d97; margin-top: 0;">Thông Tin Ứng Viên</h2>
          
          <div class="info-row">
            <span class="label">Họ và tên:</span>
            <span class="value">${name}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">${email}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Số điện thoại:</span>
            <span class="value">${phone}</span>
          </div>
          
          <div class="info-row">
            <span class="label">Vị trí ứng tuyển:</span>
            <span class="value"><strong>${position}</strong></span>
          </div>

          ${cvUrl ? `
          <div class="info-row">
            <span class="label">Link CV:</span>
            <span class="value"><a href="${cvUrl}" target="_blank">Xem CV trên Cloudinary</a></span>
          </div>
          ` : ''}
          
          ${message ? `
          <div class="info-row">
            <span class="label">Giới thiệu:</span>
            <div class="value" style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>Email này được gửi từ hệ thống tuyển dụng Đồng Phục Univi</p>
            <p style="margin: 5px 0;">📞 Hotline: 0123456789 | 📧 Email: tuyendung@dongphucunivi.com</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const applicationReceivedTemplate = ({ name, email, phone, position }) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #105d97, #0ea5e9); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 60px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">✨ Cảm Ơn Bạn Đã Ứng Tuyển!</h1>
          <p style="margin: 10px 0 0;">Đồng Phục Univi</p>
        </div>
        <div class="content">
          <div class="success-icon" style="text-align: center;">✅</div>
          
          <p><strong>Xin chào ${name},</strong></p>
          
          <p>Chúng tôi đã nhận được hồ sơ ứng tuyển của bạn cho vị trí <strong>${position}</strong>.</p>
          
          <p>Bộ phận nhân sự của chúng tôi sẽ xem xét hồ sơ và liên hệ với bạn trong thời gian sớm nhất.</p>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #0ea5e9; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0;"><strong>📋 Thông tin đã gửi:</strong></p>
            <p style="margin: 10px 0 0;">Vị trí: ${position}</p>
            <p style="margin: 5px 0 0;">Email: ${email}</p>
            <p style="margin: 5px 0 0;">Số điện thoại: ${phone}</p>
          </div>
          
          <p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ:</p>
          <p>📧 Email: dongphucunivi@gmail.com<br>
          📞 Hotline: 0834.204.999</p>
          
          <div class="footer">
            <p><strong>Đồng Phục Univi</strong></p>
            <p>Đồng phục thể thao chất lượng cao - Thương hiệu hàng đầu Việt Nam</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};
