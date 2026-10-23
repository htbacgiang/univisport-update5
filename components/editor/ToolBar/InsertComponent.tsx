import { FC, useCallback, useRef, useState } from "react";
import Button from "./Button";
import useOutsideClick from "./useOutsideClick";

// Danh sách các component có sẵn có thể nhúng vào bài viết
export const EMBEDDABLE_COMPONENTS = [

  {
    name: "ContactForm",
    label: "Form liên hệ",
    description: "Chèn form tư vấn/liên hệ ContactForm.jsx",
    icon: "📝",
    category: "Marketing",
  },
  {
    name: "PartnersSection",
    label: "Đối tác",
    description: "Section hiển thị logo các đối tác",
    icon: "🤝",
    category: "Marketing",
  },

  {
    name: "FabricCatalogView",
    label: "Thẻ chất liệu vải",
    description: "Hiển thị thông tin các loại vải",
    icon: "🧵",
    category: "Nội dung",
  },
  {
    name: "BangMauHero",
    label: "Bảng màu vải",
    description: "Hero giới thiệu bảng màu vải & chất liệu Univi",
    icon: "🎨",
    category: "Nội dung",
  },

  {
    name: "ProcessSteps",
    label: "Quy trình đặt may (ProcessSteps)",
    description: "Quy trình 8 bước chuẩn hóa từ tư vấn đến giao hàng (<ProcessSteps />)",
    icon: "🔢",
    category: "Nội dung",
  },
  {
    name: "AoPoloProcessSteps",
    label: "Quy trình áo polo",
    description: "Quy trình đặt may áo polo đồng phục tại Univi",
    icon: "👕",
    category: "Nội dung",
  },
] as const;

export type EmbeddableComponentName = typeof EMBEDDABLE_COMPONENTS[number]["name"];

interface Props {
  onSubmit(name: EmbeddableComponentName, props?: Record<string, string>): void;
  onToggle?(isOpen: boolean): void;
}

// Nhóm component theo category
const grouped = EMBEDDABLE_COMPONENTS.reduce((acc, comp) => {
  if (!acc[comp.category]) acc[comp.category] = [];
  acc[comp.category].push(comp);
  return acc;
}, {} as Record<string, typeof EMBEDDABLE_COMPONENTS[number][]>);

const ComponentIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>Chèn component</title>
    {/* Hình khối puzzle */}
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const PARTNERS_CATEGORY_OPTIONS = [
  { value: "", label: "🌐 Tất cả (trang chủ)", desc: "Hiển thị logo của cả 3 nhóm" },
  { value: "doanh-nghiep", label: "🏢 Doanh nghiệp", desc: "Chỉ hiện logo khách hàng doanh nghiệp" },
  { value: "fitness-gym", label: "🏋️ Fitness / Gym", desc: "Chỉ hiện logo phòng tập Gym" },
  { value: "yoga-studio", label: "🌸 Studio Yoga", desc: "Chỉ hiện logo studio Yoga" },
];

const PROCESS_STEPS_VARIANT_OPTIONS = [
  { value: "", label: "📐 Dạng thẻ lưới (Mặc định)", desc: "Hiển thị lưới 8 bước chuẩn hóa kèm nút đăng ký tư vấn (<ProcessSteps />)" },
  { value: "vertical", label: "📏 Dạng timeline dọc", desc: "Hiển thị danh sách 8 bước dọc nhỏ gọn theo từng bước (<ProcessSteps variant=\"vertical\" />)" },
];

const InsertComponent: FC<Props> = ({ onSubmit, onToggle }): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [pickingSubOption, setPickingSubOption] = useState<"partners" | "processSteps" | null>(null);
  const [pendingName, setPendingName] = useState<EmbeddableComponentName | null>(null);

  const hideForm = useCallback(() => {
    setVisible(false);
    setSearch("");
    setPickingSubOption(null);
    setPendingName(null);
    onToggle?.(false);
  }, [onToggle]);

  useOutsideClick(containerRef, visible, hideForm);

  const showForm = () => {
    setVisible(true);
    onToggle?.(true);
  };

  const handleSelect = (name: EmbeddableComponentName) => {
    if (name === "PartnersSection") {
      setPendingName(name);
      setPickingSubOption("partners");
      return;
    }
    if (name === "ProcessSteps") {
      setPendingName(name);
      setPickingSubOption("processSteps");
      return;
    }
    onSubmit(name);
    hideForm();
  };

  const handleSubOptionPick = (val: string) => {
    if (!pendingName) return;
    let props: Record<string, string> = {};
    if (pendingName === "PartnersSection" && val) {
      props = { category: val };
    } else if (pendingName === "ProcessSteps" && val) {
      props = { variant: val };
    }
    onSubmit(pendingName, Object.keys(props).length > 0 ? props : undefined);
    hideForm();
  };

  // Lọc theo search
  const filteredComponents = EMBEDDABLE_COMPONENTS.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGrouped = filteredComponents.reduce((acc, comp) => {
    if (!acc[comp.category]) acc[comp.category] = [];
    acc[comp.category].push(comp);
    return acc;
  }, {} as Record<string, typeof EMBEDDABLE_COMPONENTS[number][]>);

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={({ key }) => {
        if (key === "Escape") hideForm();
      }}
    >
      <Button onClick={visible ? hideForm : showForm}>
        <ComponentIcon />
      </Button>

      {visible && (
        <div
          className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl"
          style={{ width: "340px" }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-[#105d97]">🧩</span>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-6">
                Chèn Component
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                Nhúng component có sẵn vào bài viết
              </p>
            </div>
          </div>

          {pickingSubOption === "partners" ? (
            <>
              <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <button onClick={() => setPickingSubOption(null)} className="text-[#105d97] hover:text-[#0d4a7a] text-xs flex items-center gap-1 cursor-pointer">← Quay lại</button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Chọn nhóm đối tác</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Tối đa 7 logo mỗi nhóm</p>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
                {PARTNERS_CATEGORY_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => handleSubOptionPick(opt.value)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#105d97]/5 transition-colors text-left border-b border-gray-50 dark:border-gray-700/50 last:border-0 cursor-pointer">
                    <span className="text-xl flex-shrink-0 mt-0.5">{opt.label.split(" ")[0]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 dark:text-gray-100">{opt.label.split(" ").slice(1).join(" ")}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : pickingSubOption === "processSteps" ? (
            <>
              <div className="flex items-center gap-2 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                <button onClick={() => setPickingSubOption(null)} className="text-[#105d97] hover:text-[#0d4a7a] text-xs flex items-center gap-1 cursor-pointer">← Quay lại</button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">Chọn kiểu hiển thị ProcessSteps</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Quy trình 8 bước chuẩn hóa Univi</p>
                </div>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
                {PROCESS_STEPS_VARIANT_OPTIONS.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => handleSubOptionPick(opt.value)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#105d97]/5 transition-colors text-left border-b border-gray-50 dark:border-gray-700/50 last:border-0 cursor-pointer">
                    <span className="text-xl flex-shrink-0 mt-0.5">{opt.label.split(" ")[0]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-800 dark:text-gray-100">{opt.label.split(" ").slice(1).join(" ")}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <input autoFocus type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm component (ví dụ: ProcessSteps, ContactForm...)..."
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#105d97]/30 focus:border-[#105d97] outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100" />
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
                {Object.keys(filteredGrouped).length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-gray-400">Không tìm thấy component</div>
                ) : (
                  Object.entries(filteredGrouped).map(([grp, comps]) => (
                    <div key={grp}>
                      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{grp}</span>
                      </div>
                      {comps.map((comp) => (
                        <button key={comp.name} type="button" onClick={() => handleSelect(comp.name as EmbeddableComponentName)}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#105d97]/5 dark:hover:bg-[#105d97]/10 transition-colors text-left border-b border-gray-50 dark:border-gray-700/50 last:border-0 cursor-pointer">
                          <span className="text-xl flex-shrink-0 mt-0.5">{comp.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-800 dark:text-gray-100">{comp.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-6">{comp.description}</div>
                          </div>
                          <span className="text-[#105d97] flex-shrink-0 mt-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </span>
                        </button>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl">
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center">Component sẽ được render đầy đủ khi xem bài viết</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsertComponent;
