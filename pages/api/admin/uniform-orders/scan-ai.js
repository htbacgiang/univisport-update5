import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import axios from "axios";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "20mb", // Hỗ trợ ảnh chụp độ phân giải cao
    },
  },
};

const SYSTEM_PROMPT = `
Bạn là chuyên gia OCR và phân tích dữ liệu kỹ thuật sản xuất của xưởng may "ĐỒNG PHỤC UNIVI".
Nhiệm vụ của bạn là đọc hình ảnh "Biên bản đơn hàng" / "Lệnh sản xuất đồng phục" và trích xuất CHÍNH XÁC mọi thông tin thành định dạng JSON chuẩn.

Hãy phân tích kỹ các thành phần trên hình ảnh:
1. NGÀY LÊN ĐƠN (thường ở khung banner trên cùng) và "Ngày lên biên bản" (thường in chữ nghiêng màu đỏ góc phải, ví dụ "10/10").
2. Khách hàng / Phòng tập / Đơn vị (nếu có ghi trên áo hoặc văn bản).
3. Mockup áo: Màu sắc chính, phối màu, chất liệu vải (nếu có ghi).
4. Khung thông tin thiết kế (thường ở cột trái dưới ảnh mockup):
   - Mã thiết kế / mã sản phẩm (ví dụ: "MAG18_UA01DE08_UNIA12_VC02", "GAG18_UA01DE08_UNIA12_VC02").
   - Các dòng gạch đầu dòng quy cách may (ví dụ: "Chỉ trần Vàng chanh", "Phối vải lỗ vàng chanh", "Cổ trụ, khoá kéo").
5. Bốn vị trí chế tác in / thêu (thường ở 4 ô vuông cột phải trên):
   - "MẶT TRƯỚC": Chế tác (ví dụ: In pet, in lụa...), Kích thước (ví dụ: 8x6cm), Ghi chú.
   - "TAY TRÁI": Chế tác, Kích thước, Ghi chú.
   - "MẶT SAU": Chế tác, Kích thước, Ghi chú (ví dụ: in chữ PERSONAL TRAINER).
   - "TAY PHẢI": Chế tác, Kích thước, Ghi chú.
6. Bảng số lượng Size (Ma trận Nam / Nữ x S, M, L, XL, 2XL, 3XL, 4XL, 5XL):
   - Đọc kỹ từng ô số lượng của hàng Nam và hàng Nữ.
   - Nếu ô trống thì gán là 0.
   - Đọc tổng Nam, tổng Nữ và tổng cộng số lượng áo (thường là số màu đỏ to ở góc phải bảng, ví dụ: 14).
7. Tiến độ & Ghi chú (cột phải dưới):
   - NGÀY XONG (hạn xưởng hoàn thành).
   - NGÀY TRẢ (hạn giao cho khách).
   - Ô "Lưu ý:": Các ghi chú đặc biệt cho thợ may và xưởng in.

YÊU CẦU ĐỊNH DẠNG TRẢ VỀ:
Chỉ trả về duy nhất chuỗi JSON hợp lệ (không kèm markdown \`\`\`json):
{
  "orderDate": "...",
  "reportDate": "...",
  "customerName": "...",
  "customerPhone": "...",
  "customerFacebook": "...",
  "customerWebsite": "...",
  "designCodes": ["Mã 1", "Mã 2"],
  "sewingDetails": ["Quy cách 1", "Quy cách 2", "Quy cách 3"],
  "fabric": "...",
  "colors": "...",
  "craftPositions": {
    "front": { "technique": "...", "size": "...", "note": "..." },
    "leftSleeve": { "technique": "...", "size": "...", "note": "..." },
    "back": { "technique": "...", "size": "...", "note": "..." },
    "rightSleeve": { "technique": "...", "size": "...", "note": "..." }
  },
  "sizes": {
    "men": { "S": 0, "M": 0, "L": 0, "XL": 0, "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0 },
    "women": { "S": 0, "M": 0, "L": 0, "XL": 0, "2XL": 0, "3XL": 0, "4XL": 0, "5XL": 0 }
  },
  "totalQuantity": 0,
  "completionDate": "...",
  "deliveryDate": "...",
  "note": "..."
}
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Chỉ admin mới có quyền truy cập" });
  }

  try {
    const { imageBase64, mimeType = "image/jpeg", apiKey: customKey } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ message: "Vui lòng cung cấp dữ liệu hình ảnh (imageBase64)" });
    }

    const apiKey = customKey?.trim() || process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(400).json({
        message:
          "Chưa cấu hình GEMINI_API_KEY. Vui lòng thêm vào file .env hoặc nhập trực tiếp API Key vào cài đặt.",
        needsKey: true,
      });
    }

    // Làm sạch base64 nếu có prefix data:image/...;base64,
    let cleanBase64 = imageBase64;
    let actualMime = mimeType;
    if (imageBase64.includes(";base64,")) {
      const parts = imageBase64.split(";base64,");
      const match = parts[0].match(/data:(.*?)$/);
      if (match) actualMime = match[1];
      cleanBase64 = parts[1];
    }

    // Ưu tiên model gemini-3.8-flash mới nhất, kèm fallback
    const modelsToTry = [
      "gemini-3.8-flash",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-2.5-flash",
    ];

    let geminiResponse = null;
    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
        const payload = {
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                {
                  inline_data: {
                    mime_type: actualMime,
                    data: cleanBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            response_mime_type: "application/json",
          },
        };

        const response = await axios.post(url, payload, {
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          timeout: 60000,
        });

        if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          geminiResponse = response.data.candidates[0].content.parts[0].text;
          console.log(`Quét ảnh thành công với model ${model}`);
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Thử model ${model} thất bại:`, err.response?.data?.error?.message || err.message);
      }
    }

    if (!geminiResponse) {
      const errMsg =
        lastError?.response?.data?.error?.message ||
        lastError?.message ||
        "Không nhận được phản hồi từ Google Gemini";
      return res.status(500).json({ message: `Lỗi kết nối Gemini AI: ${errMsg}` });
    }

    // Parse JSON
    let parsedData;
    try {
      // Loại bỏ markdown codeblocks nếu có
      let cleanJson = geminiResponse.trim();
      if (cleanJson.startsWith("```json")) {
        cleanJson = cleanJson.slice(7);
      } else if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith("```")) {
        cleanJson = cleanJson.slice(0, -3);
      }
      parsedData = JSON.parse(cleanJson.trim());
    } catch (parseErr) {
      console.error("Lỗi parse JSON từ Gemini:", parseErr, geminiResponse);
      return res.status(500).json({
        message: "Không thể phân tích dữ liệu JSON từ AI",
        raw: geminiResponse,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Quét ảnh và trích xuất thông tin thành công!",
      data: parsedData,
    });
  } catch (error) {
    console.error("Lỗi scan-ai handler:", error);
    return res.status(500).json({
      message: error.message || "Lỗi máy chủ khi quét ảnh",
    });
  }
}
