import { ChangeEventHandler, FC, useEffect, useState } from "react";
import classnames from "classnames";
import slugify from "slugify";
import axios from "axios";
import { toast } from "react-toastify";
import { FiZap } from "react-icons/fi";
import SeoAnalysisV2 from "./SeoAnalysisV2";

// Ánh xạ ký tự tiếng Việt
const vietnameseCharMap: { [key: string]: string } = {
  á: "a",
  à: "a",
  ả: "a",
  ã: "a",
  ạ: "a",
  ă: "a",
  ắ: "a",
  ằ: "a",
  ẳ: "a",
  ẵ: "a",
  ặ: "a",
  â: "a",
  ấ: "a",
  ầ: "a",
  ẩ: "a",
  ẫ: "a",
  ậ: "a",
  é: "e",
  è: "e",
  ẻ: "e",
  ẽ: "e",
  ẹ: "e",
  ê: "e",
  ế: "e",
  ề: "e",
  ể: "e",
  ễ: "e",
  ệ: "e",
  í: "i",
  ì: "i",
  ỉ: "i",
  ĩ: "i",
  ị: "i",
  ó: "o",
  ò: "o",
  ỏ: "o",
  õ: "o",
  ọ: "o",
  ô: "o",
  ố: "o",
  ồ: "o",
  ổ: "o",
  ỗ: "o",
  ộ: "o",
  ơ: "o",
  ớ: "o",
  ờ: "o",
  ở: "o",
  ỡ: "o",
  ợ: "o",
  ú: "u",
  ù: "u",
  ủ: "u",
  ũ: "u",
  ụ: "u",
  ư: "u",
  ứ: "u",
  ừ: "u",
  ử: "u",
  ữ: "u",
  ự: "u",
  ý: "y",
  ỳ: "y",
  ỷ: "y",
  ỹ: "y",
  ỵ: "y",
  đ: "d",
  Á: "A",
  À: "A",
  Ả: "A",
  Ã: "A",
  Ạ: "A",
  Ă: "A",
  Ắ: "A",
  Ằ: "A",
  Ẳ: "A",
  Ẵ: "A",
  Ặ: "A",
  Â: "A",
  Ấ: "A",
  Ầ: "A",
  Ẩ: "A",
  Ẫ: "A",
  Ậ: "A",
  É: "E",
  È: "E",
  Ẻ: "E",
  Ẽ: "E",
  Ẹ: "E",
  Ê: "E",
  Ế: "E",
  Ề: "E",
  Ể: "E",
  Ễ: "E",
  Ệ: "E",
  Í: "I",
  Ì: "I",
  Ỉ: "I",
  Ĩ: "I",
  Ị: "I",
  Ó: "O",
  Ò: "O",
  Ỏ: "O",
  Õ: "O",
  Ọ: "O",
  Ô: "O",
  Ố: "O",
  Ồ: "O",
  Ổ: "O",
  Ỗ: "O",
  Ộ: "O",
  Ơ: "O",
  Ớ: "O",
  Ờ: "O",
  Ở: "O",
  Ỡ: "O",
  Ợ: "O",
  Ú: "U",
  Ù: "U",
  Ủ: "U",
  Ũ: "U",
  Ụ: "U",
  Ư: "U",
  Ứ: "U",
  Ừ: "U",
  Ử: "U",
  Ữ: "U",
  Ự: "U",
  Ý: "Y",
  Ỳ: "Y",
  Ỷ: "Y",
  Ỹ: "Y",
  Ỵ: "Y",
  Đ: "D",
};

// Cấu hình slugify để hỗ trợ tiếng Việt
import { DEFAULT_BLOG_CATEGORIES } from "../../lib/blogCategories";

slugify.extend(vietnameseCharMap);

export interface SeoResult {
  meta: string;
  slug: string;
  tags: string;
  category: string;
  focusKeyword: string;
}

interface Props {
  initialValue?: SeoResult;
  title?: string;
  editor?: any;
  onChange(result: SeoResult): void;
}


const SEOForm: FC<Props> = ({
  initialValue,
  title = "",
  editor,
  onChange,
}): JSX.Element => {
  // Initialize state with all SeoResult fields
  const [values, setValues] = useState<SeoResult>({
    meta: "",
    slug: "",
    tags: "",
    category: "",
    focusKeyword: "",
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [isSlugModified, setIsSlugModified] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const handleGenerateAiDescription = async () => {
    const editorContent = editor ? editor.getHTML() : "";
    const cleanContent = editor ? editor.getText().trim() : "";

    if (!title?.trim() && cleanContent.length < 30) {
      toast.warning("Vui lòng nhập tiêu đề hoặc nội dung bài viết trước khi tạo mô tả bằng Gemini AI!");
      return;
    }

    setGeneratingDesc(true);
    try {
      const { data } = await axios.post("/api/ai/generate", {
        type: "description",
        title: title || "",
        content: editorContent || cleanContent,
        focusKeyword: values.focusKeyword || "",
      });

      if (data?.description) {
        const newValues = { ...values, meta: data.description };
        setValues(newValues);
        onChange(newValues);
        toast.success("Đã tạo Meta Description bằng Gemini AI thành công!");
      }
    } catch (err: any) {
      console.error("Lỗi tạo mô tả AI:", err);
      toast.error(err.response?.data?.error || "Không thể tạo mô tả bằng Gemini AI. Vui lòng thử lại!");
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handleChange: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
  > = ({ target }) => {
    let { name, value } = target;
    if (name === "meta") value = value.substring(0, 250);
    if (name === "slug") setIsSlugModified(true);
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange(newValues);
  };

  useEffect(() => {
    if (!isSlugModified) {
      const slug = slugify(title.toLowerCase(), {
        strict: true,
      });
      const newValues = { ...values, slug };
      setValues(newValues);
      onChange(newValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, isSlugModified]);

  useEffect(() => {
    if (initialValue) {
      const cat = initialValue.category || "";
      setValues({
        meta: initialValue.meta || "",
        slug: slugify(initialValue.slug || "", {
          strict: true,
        }),
        tags: initialValue.tags || "",
        category: cat,
        focusKeyword: initialValue.focusKeyword || "",
      });
      if (cat && !DEFAULT_BLOG_CATEGORIES.includes(cat as any)) {
        setIsCustomCategory(true);
      }
      if (initialValue.slug) setIsSlugModified(true);
    }
  }, [initialValue]);

  const { meta, slug, category, focusKeyword } = values;

  return (
    <div className="space-y-2">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Danh mục bài viết
        </label>
        {!isCustomCategory ? (
          <div className="space-y-2">
            <select
              name="category"
              value={category}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setIsCustomCategory(true);
                  handleChange({ target: { name: "category", value: "" } } as any);
                } else {
                  handleChange(e);
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-gray-800 bg-gray-50/50 focus:bg-white transition-colors text-sm"
            >
              <option value="">-- Chọn danh mục bài viết --</option>
              {DEFAULT_BLOG_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="__custom__">+ Nhập danh mục khác...</option>
            </select>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              name="category"
              value={category}
              onChange={handleChange}
              placeholder="Tên danh mục mới..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-gray-800 text-sm"
            />
            <button
              type="button"
              onClick={() => setIsCustomCategory(false)}
              className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Chọn lại
            </button>
          </div>
        )}
      </div>

      {/* Focus Keyword */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Từ khóa chính
        </label>
        <input
          type="text"
          name="focusKeyword"
          value={focusKeyword}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-gray-800 bg-gray-50/50 focus:bg-white transition-colors"
          placeholder="Ví dụ: hướng dẫn chọn đồng phục GYM..."
        />
      </div>

      <div>
        <Input
          value={slug}
          onChange={handleChange}
          name="slug"
          placeholder="huong-dan-chay-bo"
          label="Đường dẫn tĩnh (Slug)"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Mô tả ngắn (Meta Description)
          </label>
          <button
            type="button"
            onClick={handleGenerateAiDescription}
            disabled={generatingDesc}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 rounded-lg transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
            title="Dùng Gemini AI tự động tạo mô tả ngắn chuẩn SEO theo nội dung bài viết"
          >
            <FiZap size={13} className={generatingDesc ? "animate-spin text-purple-600" : "text-purple-600"} />
            <span>{generatingDesc ? "Đang tạo..." : "✨ Tạo với Gemini AI"}</span>
          </button>
        </div>
        <div>
          <textarea
            name="meta"
            value={meta}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-gray-800 bg-gray-50/50 focus:bg-white transition-colors resize-none leading-6 text-sm"
            placeholder="Tóm tắt nội dung bài viết. Chiều dài hợp lý nhất là từ 150 đến 180 ký tự..."
          ></textarea>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-500">Hiển thị khi tìm kiếm trên Google</span>
            <span className={`text-xs font-medium ${meta.length > 200 ? 'text-orange-500' : 'text-gray-500'}`}>
              {meta.length}/250 ký tự
            </span>
          </div>
        </div>
      </div>

      {/* SEO Analysis */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <h4 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#105d97]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Kết quả phân tích
        </h4>

        {!focusKeyword ? (
          <div className="p-3 bg-blue-50/80 border border-blue-100 rounded-lg shadow-sm">
            <p className="text-blue-700 text-sm text-center font-medium">
              💡 Hãy nhập &quot;Từ khóa chính&quot; để hệ thống chấm điểm SEO
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-4 py-3 bg-green-50/80 border border-green-100 rounded-lg shadow-sm">
              <p className="text-green-800 text-sm text-center">
                Đang phân tích từ khóa: <span className="font-bold text-green-900">&quot;{focusKeyword}&quot;</span>
              </p>
            </div>
            <div className="bg-white">
              {(() => {
                try {
                  return (
                    <SeoAnalysisV2
                      editor={editor}
                      title={title}
                      meta={meta}
                      slug={slug}
                      focusKeyword={focusKeyword}
                    />
                  );
                } catch (error) {
                  console.error('Error rendering SeoAnalysis:', error);
                  return (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-red-700 text-sm text-center">
                        ❌ Lỗi khi tải đánh giá SEO
                      </p>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Input: FC<{
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ name, value, placeholder, label, onChange }) => {
  return (
    <label className="block relative">
      <span className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </span>

      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#105d97] focus:border-transparent outline-none text-gray-800 bg-gray-50/50 focus:bg-white transition-colors"
        onChange={onChange}
      />
    </label>
  );
};

export default SEOForm;