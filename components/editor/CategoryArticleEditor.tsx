import { FC, useState } from "react";
import SimpleEditor from "./SimpleEditor";
import FAQEditor, { FAQ } from "./FAQEditor";
import AuthorSelector from "./AuthorSelector";
import { CATEGORY_ARTICLE_OPTIONS } from "../../lib/categoryArticleConstants";
import { Save } from "lucide-react";

export interface CategoryArticleFormValue {
  id?: string;
  title?: string;
  categorySlug: string;
  content: string;
  faqs: FAQ[];
  postAuthorId: string;
}

interface Props {
  initialValue?: CategoryArticleFormValue;
  busy?: boolean;
  buttonTitle?: string;
  onSubmit: (value: CategoryArticleFormValue) => void;
}

const emptyValue: CategoryArticleFormValue = {
  categorySlug: CATEGORY_ARTICLE_OPTIONS[0]?.slug || "",
  content: "",
  faqs: [],
  postAuthorId: "",
};

const CategoryArticleEditor: FC<Props> = ({
  initialValue,
  busy = false,
  buttonTitle = "Lưu bài viết",
  onSubmit,
}) => {
  const [value, setValue] = useState<CategoryArticleFormValue>({
    ...emptyValue,
    ...initialValue,
  });

  const updateValue = (updates: Partial<CategoryArticleFormValue>) => {
    setValue((current) => ({ ...current, ...updates }));
  };

  const submit = () => {
    onSubmit(value);
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="m-0 text-xl font-bold text-gray-900">Nội dung bài viết</h2>
            <button
              type="button"
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#105d97] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0e4d7a] disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {busy ? "Đang lưu..." : buttonTitle}
            </button>
          </div>
          <SimpleEditor
            content={value.content}
            onChange={(content) => updateValue({ content })}
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">FAQ</h2>
          <FAQEditor value={value.faqs} onChange={(faqs) => updateValue({ faqs })} />
        </div>
      </div>

      <aside className="h-fit space-y-4 lg:sticky lg:top-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Thông tin bài danh mục</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Danh mục sản phẩm *
              </label>
              <select
                value={value.categorySlug}
                onChange={(event) => updateValue({ categorySlug: event.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-[#105d97]"
              >
                {CATEGORY_ARTICLE_OPTIONS.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tác giả
              </label>
              <AuthorSelector
                value={value.postAuthorId}
                onChange={(postAuthorId) => updateValue({ postAuthorId })}
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CategoryArticleEditor;
