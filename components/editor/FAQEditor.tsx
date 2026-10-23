import { FC } from "react";
import { FiPlus, FiTrash2, FiZap, FiHelpCircle } from "react-icons/fi";

export interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  value: FAQ[];
  onChange: (faqs: FAQ[]) => void;
  onGenerateAi?: () => void;
  isGenerating?: boolean;
}

const FAQEditor: FC<Props> = ({
  value,
  onChange,
  onGenerateAi,
  isGenerating = false,
}) => {
  const addFaq = () => {
    onChange([...value, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", text: string) => {
    onChange(value.map((faq, i) => (i === index ? { ...faq, [field]: text } : faq)));
  };

  const removeFaq = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Top action row */}
      {onGenerateAi && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500">
            {value.length > 0 ? `${value.length} câu hỏi đang có` : "Chưa có câu hỏi"}
          </span>

          <button
            type="button"
            onClick={onGenerateAi}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-lg transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Dùng Gemini AI tự động đọc bài viết và tạo 3-5 câu hỏi thường gặp"
          >
            <FiZap
              size={13}
              className={isGenerating ? "animate-spin text-purple-600" : "text-purple-600"}
            />
            <span>{isGenerating ? "Đang tạo FAQ..." : "✨ Tạo FAQ với Gemini"}</span>
          </button>
        </div>
      )}

      {/* FAQ items list */}
      {value.length === 0 ? (
        <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 text-center space-y-2">
          <div className="w-8 h-8 mx-auto rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <FiHelpCircle size={18} />
          </div>
          <p className="text-xs text-gray-500">
            Chưa có câu hỏi thường gặp nào cho bài viết.
          </p>
          {onGenerateAi && (
            <button
              type="button"
              onClick={onGenerateAi}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <FiZap size={13} />
              <span>{isGenerating ? "Đang tạo bằng Gemini..." : "✨ Tự động tạo bằng Gemini AI"}</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {value.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 rounded-xl p-3.5 space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#105d97]/10 text-[#105d97] flex items-center justify-center text-[10px] font-mono">
                    {index + 1}
                  </span>
                  Câu hỏi {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/60 rounded-md transition-colors cursor-pointer"
                  title="Xóa câu hỏi này"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Câu hỏi:
                </label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                  placeholder="Ví dụ: Áo thun đồng phục Univi may mất bao lâu?"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-[#105d97] outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Câu trả lời:
                </label>
                <textarea
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  placeholder="Nhập câu trả lời chi tiết và hữu ích..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-[#105d97] outline-none text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 resize-none leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Button thêm câu hỏi thủ công */}
      <button
        type="button"
        onClick={addFaq}
        className="w-full py-2 text-xs font-semibold border border-dashed border-[#105d97] text-[#105d97] dark:border-sky-500 dark:text-sky-400 rounded-xl hover:bg-blue-50/60 dark:hover:bg-sky-950/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <FiPlus size={14} />
        <span>Thêm câu hỏi thủ công</span>
      </button>
    </div>
  );
};

export default FAQEditor;
