import nodemailer from 'nodemailer';
import formidable from 'formidable';
import cloudinary from 'cloudinary';
import db from '../../../utils/db';
import { Application } from '../../../models/Application';
import { Job } from '../../../models/Job'; // In case we need it, though we might only receive jobId
import { newApplicationNotificationTemplate, applicationReceivedTemplate } from '../../../emails/recruitmentEmailTemplates';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.CLOUD_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await db.connectDb();

  try {
    const form = formidable({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // In formidable v3 fields values are arrays
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
    const position = Array.isArray(fields.position) ? fields.position[0] : fields.position;
    const jobId = Array.isArray(fields.jobId) ? fields.jobId[0] : fields.jobId;
    const message = Array.isArray(fields.message) ? fields.message[0] : fields.message;

    // Validate required fields
    if (!name || !email || !phone || !position) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      });
    }

    let cvUrl = '';
    const attachments = [];

    // Process CV Upload
    if (files.cv) {
      const cvFile = Array.isArray(files.cv) ? files.cv[0] : files.cv;
      
      try {
        const result = await cloudinary.v2.uploader.upload(cvFile.filepath, {
          folder: 'univisport/cv',
          public_id: `cv_${Date.now()}_${name.replace(/\s+/g, '_')}`,
          resource_type: 'auto',
        });
        cvUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Continue even if upload fails, just won't have cvUrl
      }

      attachments.push({
        filename: cvFile.originalFilename,
        path: cvFile.filepath,
      });
    }

    // Save to Database
    const newApplication = new Application({
      name,
      email,
      phone,
      position,
      message,
      cvUrl,
      jobId: jobId || null,
    });
    
    await newApplication.save();

    // Send Emails
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to company
    const htmlContent = newApplicationNotificationTemplate({ name, email, phone, position, cvUrl, message });

    // Send email to company
    await transporter.sendMail({
      from: `"Tuyển Dụng Univi" <${process.env.EMAIL_USER}>`,
      to: process.env.RECRUITMENT_EMAIL || process.env.EMAIL_USER,
      subject: `🎯 Ứng viên mới: ${position} - ${name}`,
      html: htmlContent,
      attachments: attachments,
    });

    // Send confirmation email to candidate
    const candidateHtml = applicationReceivedTemplate({ name, email, phone, position });

    await transporter.sendMail({
      from: `"Đồng Phục Univi" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Xác nhận nhận hồ sơ ứng tuyển - ${position}`,
      html: candidateHtml,
    });

    return res.status(200).json({
      success: true,
      message: 'Gửi hồ sơ ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm.',
    });

  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua email.',
    });
  }
}
