// pages/api/contact.js
import db from "../../../utils/db";
import Contact from '../../../models/Contact'; // Thay bằng đường dẫn của bạn nếu khác
import nodemailer from 'nodemailer';
import { requireAdmin } from "../../../lib/adminAuth";
import { checkRateLimit } from "../../../lib/rateLimit";

// Cấu hình email đơn giản với App Password
async function createTransporter() {
  // Debug: Kiểm tra environment variables
  console.log('Email config debug:', {
    senderEmail: process.env.SENDER_EMAIL_ADDRESS,
    adminEmail: process.env.ADMIN_EMAIL,
    hasPassword: !!process.env.EMAIL_APP_PASSWORD,
    passwordLength: process.env.EMAIL_APP_PASSWORD?.length || 0
  });

  if (!process.env.SENDER_EMAIL_ADDRESS || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Missing email configuration. Please check SENDER_EMAIL_ADDRESS and EMAIL_APP_PASSWORD in .env file');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL_ADDRESS,
      pass: process.env.EMAIL_APP_PASSWORD, // App Password từ Gmail
    },
  });
}

let clients = [];

export default async function handler(req, res) {
  await db.connectDb();

  const { method, query, body } = req;

  // Xử lý Server-Sent Events
  if (req.url === '/api/contact/stream') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on('close', () => {
      clients = clients.filter((client) => client.id !== clientId);
    });

    return;
  }

  switch (method) {
    case 'GET': {
      if (!(await requireAdmin(req, res))) return;
      try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const contacts = await Contact.find({})
          .sort({ createdAt: -1 }) // Thay submittedAt bằng createdAt nếu dùng schema trước đó
          .skip(skip)
          .limit(limit);
        const total = await Contact.countDocuments();

        return res.status(200).json({
          success: true,
          message: 'Danh sách thông tin liên hệ',
          data: contacts,
          total,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi server: ' + error.message,
        });
      }
    }
    case 'POST': {
      if (!checkRateLimit(req, res, { limit: 5, windowMs: 15 * 60 * 1000 })) return;
      const { name, email, phone, message, note, source } = body;

      try {
        const newContact = new Contact({
          name,
          email: email || '',
          phone: phone || (email ? `Email: ${email}` : 'Chưa cung cấp'),
          message,
          note,
          source: source || 'Trang liên hệ',
        });
        await newContact.save();

        const transporter = await createTransporter();
        
        // Danh sách email admin để nhận thông báo
        const adminEmails = [
          process.env.ADMIN_EMAIL || process.env.SENDER_EMAIL_ADDRESS,
          process.env.ADMIN_EMAIL_2, // Admin 2
          process.env.ADMIN_EMAIL_3, // Admin 3
        ].filter(email => email); // Lọc bỏ email null/undefined
        
        console.log("Contact admin emails to notify:", adminEmails);
        
        const adminMailOptions = {
          from: process.env.SENDER_EMAIL_ADDRESS,
          to: adminEmails.join(', '), // Gửi cho tất cả admin
          subject: '🔔 Thông báo: Yêu cầu tư vấn mới từ website',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .info-item { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
                .info-item:last-child { border-bottom: none; }
                .label { font-weight: bold; color: #333; display: inline-block; width: 120px; }
                .value { color: #666; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                .urgent { color: #e74c3c; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>📧 Yêu cầu tư vấn mới</h2>
                  <p>Từ website đồng phục UniVi</p>
                </div>
                <div class="content">
                  <p>Xin chào Admin,</p>
                  <p class="urgent">Một khách hàng mới vừa đăng ký yêu cầu tư vấn!</p>
                  
                  <div class="info-box">
                    <h3 style="color: #333; margin-top: 0;">📝 Thông tin khách hàng:</h3>
                    <div class="info-item">
                      <span class="label">👤 Họ và tên:</span>
                      <span class="value">${name}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">📱 Số điện thoại:</span>
                      <span class="value">${phone || 'Chưa cung cấp'}</span>
                    </div>
                    ${email ? `
                    <div class="info-item">
                      <span class="label">📧 Email:</span>
                      <span class="value">${email}</span>
                    </div>
                    ` : ''}
                    <div class="info-item">
                      <span class="label">💬 Yêu cầu:</span>
                      <span class="value">${message || 'Không có yêu cầu cụ thể'}</span>
                    </div>
                    ${source ? `
                    <div class="info-item">
                      <span class="label">📍 Trang:</span>
                      <span class="value">${source}</span>
                    </div>
                    ` : ''}
                    ${note ? `
                    <div class="info-item">
                      <span class="label">📝 Ghi chú:</span>
                      <span class="value">${note}</span>
                    </div>
                    ` : ''}
                    <div class="info-item">
                      <span class="label">⏰ Thời gian gửi:</span>
                      <span class="value">${new Date(newContact.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}</span>
                    </div>
                  </div>
                  
                  <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
                    <p style="margin: 0; color: #2c3e50;">
                      <strong>📞 Hành động cần thực hiện:</strong><br>
                      Vui lòng liên hệ lại với khách hàng trong vòng 24 giờ để tư vấn và báo giá sản phẩm.
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>Email này được gửi tự động từ hệ thống website.<br>
                    Vui lòng không trả lời trực tiếp email này.</p>
                    <p><strong>🌐 Website:</strong> dongphucunivi.com</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        await transporter.sendMail(adminMailOptions);

        // Gửi sự kiện SSE
        const eventData = {
          type: 'new_contact',
          contact: {
            name: newContact.name,
            createdAt: newContact.createdAt, // Thay submittedAt bằng createdAt nếu dùng schema trước đó
          },
        };
        clients.forEach((client) =>
          client.res.write(`data: ${JSON.stringify(eventData)}\n\n`)
        );

        return res.status(201).json({
          success: true,
          message: 'Thông tin đã được gửi thành công',
          data: newContact,
        });
      } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu:', error);
        return res.status(400).json({
          success: false,
          message: 'Dữ liệu không hợp lệ hoặc lỗi gửi email: ' + error.message,
        });
      }
    }
    case 'DELETE': {
      if (!(await requireAdmin(req, res))) return;
      const { id } = query;
      try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy thông tin liên hệ',
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Xóa thông tin thành công',
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Lỗi khi xóa: ' + error.message,
        });
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`,
      });
  }
}