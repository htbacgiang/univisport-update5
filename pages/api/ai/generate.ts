import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "../../../lib/adminAuth";

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function callGemini(prompt: string, apiKey: string) {
  const models = ["gemini-3.8-flash", "gemini-3.8-flash-lite", "gemini-3.5-flash"];
  let lastError = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000);

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json();
      if (res.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }

      lastError = data.error?.message || `Model ${model} trả về mã ${res.status}`;
      console.warn(`Gemini model ${model} issue:`, lastError);
    } catch (err: any) {
      lastError = err.message || `Lỗi kết nối tới ${model}`;
      console.warn(`Gemini model ${model} fetch exception:`, lastError);
    }
  }

  throw new Error(lastError || "Tất cả các mô hình Gemini đều không phản hồi.");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  if (!(await requireAdmin(req, res))) return;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Chưa cấu hình GEMINI_API_KEY trong file .env của hệ thống.",
    });
  }

  const { type, title, content, focusKeyword } = req.body || {};

  if (!type || (type !== "description" && type !== "faqs")) {
    return res.status(400).json({
      error: "Tham số type không hợp lệ. Chỉ chấp nhận 'description' hoặc 'faqs'.",
    });
  }

  const cleanContent = stripHtml(content || "");
  const cleanTitle = (title || "").trim();

  if (!cleanTitle && cleanContent.length < 30) {
    return res.status(400).json({
      error: "Vui lòng nhập tiêu đề hoặc nội dung bài viết trước khi tạo bằng Gemini AI.",
    });
  }

  try {
    if (type === "description") {
      const prompt = `Bạn là chuyên gia SEO bài viết tiếng Việt cho thương hiệu may đồng phục Univi.
Hãy viết 1 đoạn Meta Description ngắn gọn, thu hút, chuẩn SEO (chiều dài tối ưu từ 150 đến 175 ký tự, tuyệt đối không quá 190 ký tự) dựa vào tiêu đề và nội dung bài viết dưới đây.

Yêu cầu:
1. Tóm tắt nội dung cốt lõi và nêu bật điểm hấp dẫn nhất để người tìm kiếm Google muốn nhấp vào xem ngay lập tức.
2. ${focusKeyword ? `Chứa từ khóa chính "${focusKeyword}" một cách khéo léo, tự nhiên.` : "Chứa các cụm từ khóa tự nhiên liên quan đến bài viết."}
3. Câu văn mạch lạc, hấp dẫn, chuẩn tiếng Việt, không dùng đại từ rườm rà.
4. Tuyệt đối KHÔNG đặt trong dấu ngoặc kép, KHÔNG dùng hashtag, KHÔNG chứa markdown hay icon.
5. Chỉ trả về DUY NHẤT một đoạn văn bản mô tả ngắn, không thêm bất kỳ lời dẫn hay giải thích nào khác.

Tiêu đề bài viết: ${cleanTitle || "Chưa có tiêu đề"}
Nội dung bài viết: ${cleanContent.slice(0, 3500)}`;

      const rawDesc = await callGemini(prompt, apiKey);
      let description = rawDesc.trim().replace(/^["']|["']$/g, "").trim();

      // Nếu dài hơn 195 ký tự, cắt ngắn bớt tại dấu chấm hoặc dấu cách
      if (description.length > 195) {
        const lastPeriod = description.lastIndexOf(".", 190);
        if (lastPeriod > 140) {
          description = description.slice(0, lastPeriod + 1);
        } else {
          const lastSpace = description.lastIndexOf(" ", 185);
          description = (lastSpace > 140 ? description.slice(0, lastSpace) : description.slice(0, 185)) + "...";
        }
      }

      return res.status(200).json({ description });
    }

    if (type === "faqs") {
      const prompt = `Bạn là chuyên gia nội dung và chăm sóc khách hàng cho thương hiệu may đồng phục Univi.
Hãy dựa vào tiêu đề và nội dung bài viết dưới đây để tạo từ 3 đến 5 câu hỏi thường gặp (FAQ) kèm câu trả lời hữu ích, chuẩn xác để tích hợp FAQ Schema vào bài viết.

Yêu cầu:
1. Câu hỏi là những thắc mắc thực tế, quan trọng nhất mà người đọc/khách hàng muốn biết liên quan trực tiếp đến bài viết.
2. Câu trả lời ngắn gọn, súc tích (khoảng 2-3 câu), văn phong chuyên nghiệp, dễ hiểu, uy tín.
3. BẮT BUỘC trả về duy nhất định dạng JSON array hợp lệ, KHÔNG bọc trong markdown block (như \`\`\`json), KHÔNG kèm bất kỳ text lời dẫn nào khác.

Cấu trúc JSON:
[
  {"question": "Câu hỏi 1?", "answer": "Câu trả lời 1..."},
  {"question": "Câu hỏi 2?", "answer": "Câu trả lời 2..."}
]

Tiêu đề bài viết: ${cleanTitle || "Chưa có tiêu đề"}
Nội dung bài viết: ${cleanContent.slice(0, 3500)}`;

      const rawFaqs = await callGemini(prompt, apiKey);
      let cleanJson = rawFaqs.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();

      const match = cleanJson.match(/\[[\s\S]*\]/);
      if (match) {
        cleanJson = match[0];
      }

      let parsedFaqs = JSON.parse(cleanJson);

      if (!Array.isArray(parsedFaqs)) {
        throw new Error("Dữ liệu trả về không phải là mảng FAQ hợp lệ.");
      }

      parsedFaqs = parsedFaqs
        .filter((item) => item && typeof item.question === "string" && typeof item.answer === "string")
        .map((item) => ({
          question: item.question.trim(),
          answer: item.answer.trim(),
        }));

      return res.status(200).json({ faqs: parsedFaqs });
    }
  } catch (error: any) {
    console.error("Lỗi Gemini API generate:", error);
    return res.status(500).json({
      error: error.message || "Không thể tạo nội dung bằng Gemini AI. Vui lòng thử lại sau.",
    });
  }
}
