import db from "../../../utils/db";
import DealerContact from '../../../models/DealerContact';
import nodemailer from 'nodemailer';
import { requireAdmin } from "../../../lib/adminAuth";
import { checkRateLimit } from "../../../lib/rateLimit";

async function createTransporter() {
  if (!process.env.SENDER_EMAIL_ADDRESS || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error('Missing email configuration. Please check SENDER_EMAIL_ADDRESS and EMAIL_APP_PASSWORD in .env file');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SENDER_EMAIL_ADDRESS,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
}

let clients = [];

export default async function handler(req, res) {
  await db.connectDb();

  const { method, query, body } = req;

  // Xử lý Server-Sent Events
  if (req.url === '/api/dealer-contact/stream') {
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

        const contacts = await DealerContact.find({})
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);
        const total = await DealerContact.countDocuments();

        return res.status(200).json({
          success: true,
          message: 'Danh sách đăng ký đại lý',
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
      const { name, email, phone, province, type, channels, volume, products, notes, source } = body;

      try {
        const newContact = new DealerContact({
          name,
          email,
          phone,
          province,
          type,
          channels: channels || [],
          volume,
          products: products || [],
          notes,
          source: source || '',
        });
        await newContact.save();

        const transporter = await createTransporter();
        
        const adminEmails = [
          process.env.ADMIN_EMAIL || process.env.SENDER_EMAIL_ADDRESS,
          process.env.ADMIN_EMAIL_2,
          process.env.ADMIN_EMAIL_3,
        ].filter(email => email);
        
        const adminMailOptions = {
          from: process.env.SENDER_EMAIL_ADDRESS,
          to: adminEmails.join(', '),
          subject: '🚀 Thông báo: Đăng ký Đại Lý mới từ website',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                .header { background: linear-gradient(135deg, #105d97 0%, #0d4a7a 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
                .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .info-item { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
                .info-item:last-child { border-bottom: none; }
                .label { font-weight: bold; color: #333; display: inline-block; width: 140px; }
                .value { color: #666; }
                .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                .urgent { color: #e74c3c; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h2>🤝 Đăng Ký Đại Lý Mới</h2>
                  <p>Từ website đồng phục UniVi</p>
                </div>
                <div class="content">
                  <p>Xin chào Admin,</p>
                  <p class="urgent">Một đối tác mới vừa đăng ký làm Đại Lý/CTV!</p>
                  
                  <div class="info-box">
                    <h3 style="color: #105d97; margin-top: 0;">📝 Thông tin đối tác:</h3>
                    <div class="info-item"><span class="label">👤 Họ và tên:</span> <span class="value">${name}</span></div>
                    <div class="info-item"><span class="label">📱 Số điện thoại:</span> <span class="value">${phone}</span></div>
                    ${email ? `<div class="info-item"><span class="label">📧 Email:</span> <span class="value">${email}</span></div>` : ''}
                    <div class="info-item"><span class="label">📍 Tỉnh/Thành phố:</span> <span class="value">${province}</span></div>
                    <div class="info-item"><span class="label">🏢 Hình thức hợp tác:</span> <span class="value">${type}</span></div>
                    ${channels && channels.length > 0 ? `<div class="info-item"><span class="label">🛒 Kênh bán hàng:</span> <span class="value">${channels.join(', ')}</span></div>` : ''}
                    ${volume ? `<div class="info-item"><span class="label">📦 Nhu cầu số lượng:</span> <span class="value">${volume}</span></div>` : ''}
                    ${products && products.length > 0 ? `<div class="info-item"><span class="label">👕 Sản phẩm quan tâm:</span> <span class="value">${products.join(', ')}</span></div>` : ''}
                    ${notes ? `<div class="info-item"><span class="label">📝 Ghi chú:</span> <span class="value">${notes}</span></div>` : ''}
                    ${source ? `<div class="info-item"><span class="label">🔗 Nguồn:</span> <span class="value">${source}</span></div>` : ''}
                    <div class="info-item">
                      <span class="label">⏰ Thời gian gửi:</span>
                      <span class="value">${new Date(newContact.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                  </div>
                  
                  <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #105d97;">
                    <p style="margin: 0; color: #2c3e50;">
                      <strong>📞 Hành động cần thực hiện:</strong><br>
                      Vui lòng liên hệ lại với đối tác trong vòng 2 giờ làm việc để tư vấn chính sách đại lý.
                    </p>
                  </div>
                  
                  <div class="footer">
                    <p>Email này được gửi tự động từ hệ thống website.<br>
                    Vui lòng không trả lời trực tiếp email này.</p>
                  </div>
                </div>
              </div>
            </body>
            </html>
          `,
        };

        await transporter.sendMail(adminMailOptions);

        const eventData = {
          type: 'new_dealer_contact',
          contact: {
            name: newContact.name,
            createdAt: newContact.createdAt,
          },
        };
        clients.forEach((client) =>
          client.res.write(`data: ${JSON.stringify(eventData)}\n\n`)
        );

        return res.status(201).json({
          success: true,
          message: 'Đăng ký thành công',
          data: newContact,
        });
      } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu:', error);
        return res.status(400).json({
          success: false,
          message: 'Lỗi: ' + error.message,
        });
      }
    }
    case 'DELETE': {
      if (!(await requireAdmin(req, res))) return;
      const { id } = query;
      try {
        const deletedContact = await DealerContact.findByIdAndDelete(id);
        if (!deletedContact) {
          return res.status(404).json({
            success: false,
            message: 'Không tìm thấy đăng ký đại lý',
          });
        }
        return res.status(200).json({
          success: true,
          message: 'Xóa đăng ký thành công',
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
