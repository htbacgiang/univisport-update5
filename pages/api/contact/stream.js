import db from "../../../utils/db";
import Contact from "../../../models/Contact";
import { google } from "googleapis";
import nodemailer from "nodemailer";

// Cấu hình OAuth2 cho Google API
const oAuth2Client = new google.auth.OAuth2(
  process.env.MAILING_SERVICE_CLIENT_ID,
  process.env.MAILING_SERVICE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.MAILING_SERVICE_REFRESH_TOKEN,
});

async function createTransporter() {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.SENDER_EMAIL_ADDRESS,
      clientId: process.env.MAILING_SERVICE_CLIENT_ID,
      clientSecret: process.env.MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: process.env.MAILING_SERVICE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}

// Danh sách client kết nối SSE
let clients = [];

export default async function handler(req, res) {
  await db.connectDb();
  const { method, query } = req;

  if (req.url === "/api/contact/stream") {
    // Xử lý Server-Sent Events
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on("close", () => {
      clients = clients.filter((client) => client.id !== clientId);
    });

    return;
  }

  switch (method) {
    case "GET": {
      try {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        const contacts = await Contact.find({})
          .sort({ submittedAt: -1 })
          .skip(skip)
          .limit(limit);
        const total = await Contact.countDocuments();

        return res.status(200).json({
          success: true,
          message: "Danh sách thông tin liên hệ",
          data: contacts,
          total,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Lỗi server: " + error.message,
        });
      }
    }
    case "POST": {
      const { name, phone, email, subject, message } = req.body;

      try {
        const newContact = new Contact({
          name,
          phone,
          email,
          subject,
          message,
        });
        await newContact.save();

        const transporter = await createTransporter();
        
        // Danh sách email admin để nhận thông báo
        const adminEmails = [
          process.env.ADMIN_EMAIL || process.env.SENDER_EMAIL_ADDRESS,
          process.env.ADMIN_EMAIL_2, // Admin 2
          process.env.ADMIN_EMAIL_3, // Admin 3
        ].filter(email => email); // Lọc bỏ email null/undefined
        
        console.log("Stream contact admin emails to notify:", adminEmails);
        
        const adminMailOptions = {
          from: process.env.SENDER_EMAIL_ADDRESS,
          to: adminEmails.join(', '), // Gửi cho tất cả admin
          subject: "Có khách hàng mới đăng ký tại Eco Bắc Giang",
          html: `
            <h3>Xin chào,</h3>
            <p>Một khách hàng mới vừa đăng ký:</p>
            <ul>
              <li><strong>Họ và tên:</strong> ${name}</li>
              <li><strong>Số điện thoại:</strong> ${phone}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Chủ đề:</strong> ${subject || "Không có"}</li>
              <li><strong>Tin nhắn:</strong> ${message || "Không có"}</li>
              <li><strong>Thời gian gửi:</strong> ${new Date(newContact.submittedAt).toLocaleString("vi-VN")}</li>
            </ul>
            <p>Vui lòng kiểm tra và xử lý.</p>
          `,
        };

        await transporter.sendMail(adminMailOptions);

        // Gửi sự kiện qua SSE cho tất cả client
        const eventData = {
          type: "new_contact",
          contact: {
            name: newContact.name,
            submittedAt: newContact.submittedAt,
          },
        };
        clients.forEach((client) =>
          client.res.write(`data: ${JSON.stringify(eventData)}\n\n`)
        );

        return res.status(201).json({
          success: true,
          message: "Thông tin đã được gửi thành công",
          data: newContact,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Dữ liệu không hợp lệ hoặc lỗi gửi email: " + error.message,
        });
      }
    }
    case "DELETE": {
      const { id } = query;
      try {
        const deletedContact = await Contact.findByIdAndDelete(id);
        if (!deletedContact) {
          return res.status(404).json({
            success: false,
            message: "Không tìm thấy thông tin liên hệ",
          });
        }
        return res.status(200).json({
          success: true,
          message: "Xóa thông tin thành công",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Lỗi khi xóa: " + error.message,
        });
      }
    }
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      return res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`,
      });
  }
}