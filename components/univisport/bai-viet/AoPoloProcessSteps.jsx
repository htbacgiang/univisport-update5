import { Factory, Palette, Ruler, Truck } from "lucide-react";

export const processSteps = [
  {
    title: "Tư vấn nhu cầu & Lên thiết kế",
    text: "Tư vấn kiểu polo phù hợp (basic, premium, cổ dệt...), chọn màu nhận diện và phác thảo market phối màu chi tiết miễn phí.",
    icon: Palette,
  },
  {
    title: "Chọn chất liệu & Thử size",
    text: "Chọn vải QUICK DRY thoáng khí hay BLENDED đứng form. Duyệt màu vải thực tế, may mẫu thử và kiểm tra bộ size nhân sự.",
    icon: Ruler,
  },
  {
    title: "Sản xuất khép kín tại nhà xưởng",
    text: "Quy trình cắt may, thêu logo công nghệ vi tính mật độ cao, hoàn thiện bo cổ nẹp tại xưởng 2.000m² phường Chương Mỹ, Hà Nội.",
    icon: Factory,
  },
  {
    title: "QC kỹ lưỡng & Bàn giao",
    text: "Kiểm tra kỹ lưỡng đường may nách sườn, cúc áo, logo và đóng gói phẳng đẹp. Hỗ trợ giao hàng nhanh toàn quốc.",
    icon: Truck,
  },
];

const stepStyles = [
  {
    solidBg: "bg-[#c22744]",
    borderStyle: "border-[#c22744]",
    textColor: "text-[#c22744]",
    numStr: "01",
  },
  {
    solidBg: "bg-[#f19b00]",
    borderStyle: "border-[#f19b00]",
    textColor: "text-[#f19b00]",
    numStr: "02",
  },
  {
    solidBg: "bg-[#37b5a5]",
    borderStyle: "border-[#37b5a5]",
    textColor: "text-[#37b5a5]",
    numStr: "03",
  },
  {
    solidBg: "bg-[#105d97]",
    borderStyle: "border-[#105d97]",
    textColor: "text-[#105d97]",
    numStr: "04",
  },
];

export default function AoPoloProcessSteps({
  description = "Tối ưu hóa quy trình làm việc chuyên nghiệp, giúp tiết kiệm tối đa thời gian cho doanh nghiệp.",
  steps = processSteps,
}) {
  const visibleSteps = Array.isArray(steps) && steps.length > 0 ? steps : processSteps;

  return (
    <div className="border border-gray-100 rounded-[32px] p-4 md:p-8 my-6">
      <div className="text-center mb-10">
        <p className="text-gray-500 text-sm md:text-base mt-2.5 max-w-4xl mx-auto leading-6">
          {description}
        </p>
        <div className="flex justify-center gap-1.5 mt-4">
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-8 md:gap-10">
        {visibleSteps.map((step, index) => {
          const Icon = step.icon;
          const currentStyle = stepStyles[index] || stepStyles[0];

          return (
            <div key={step.title} className="relative flex items-center pl-8 md:pl-10">
              <div
                className={`w-full border-2 border-dashed ${currentStyle.borderStyle} rounded-[24px] p-6 pl-14 md:pl-20 pr-6 md:pr-10 bg-white flex flex-col md:flex-row justify-between items-center gap-6 min-h-[130px] shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-shadow duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]`}
              >
                <div className="flex-1">
                  <h4 className={`text-lg font-black uppercase tracking-wider ${currentStyle.textColor} mb-1.5`}>
                    {step.title}
                  </h4>
                  <p className="text-gray-600 text-sm md:text-base leading-6 font-medium">
                    {step.text}
                  </p>
                </div>
                {Icon && (
                  <div className={`${currentStyle.textColor} shrink-0 hidden md:block opacity-90`}>
                    <Icon className="h-10 w-10 stroke-[1.5]" />
                  </div>
                )}
              </div>

              <div
                className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-[16px] w-[58px] h-[105px] md:w-[70px] md:h-[120px] flex flex-col justify-center items-center text-white ${currentStyle.solidBg} shadow-lg select-none z-10`}
              >
                <span className="text-xl md:text-2xl font-black tracking-tight leading-none">
                  {currentStyle.numStr}
                </span>
                <div className="w-5 h-0.5 bg-white/70 mt-2.5 rounded-full" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
