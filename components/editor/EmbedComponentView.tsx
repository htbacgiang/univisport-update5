import React from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";

// Import tất cả các component có thể nhúng để xem trước trực tiếp trong Editor
import ContactForm from "../header/ContactForm";
import PartnersSection from "../univisport/PartnersSection";
import FabricCatalogView from "../univisport/chat-lieu-vai/FabricCatalogView";
import BangMauHero from "../univisport/bang-mau/BangMauHero";
import ProcessSteps from "../univisport/ProcessSteps";
import AoPoloProcessSteps from "../univisport/bai-viet/AoPoloProcessSteps";
import CategoryGrid from "../univisport/CategoryGrid";
import CTABanner from "../univisport/CTABanner";
import FAQComponent from "../univisport/FAQComponent";
import InternalLinks from "../univisport/InternalLinks";
import FabricCardComponent from "../univisport/FabricCardComponent";
import CountdownTimer from "../univisport/CountdownTimer";
import ProductSlider from "../univisport/ProductSlider";

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  ContactForm,
  PartnersSection,
  FabricCatalogView,
  BangMauHero,
  ProcessSteps,
  AoPoloProcessSteps,
  CategoryGrid,
  CTABanner,
  FAQComponent,
  InternalLinks,
  FabricCardComponent,
  CountdownTimer,
  ProductSlider,
};

export default function EmbedComponentView({ node, deleteNode }: NodeViewProps) {
  const componentName = node.attrs.name;
  let parsedProps: Record<string, any> = {};

  try {
    if (node.attrs.props) {
      parsedProps =
        typeof node.attrs.props === "string"
          ? JSON.parse(node.attrs.props)
          : node.attrs.props;
    }
  } catch (e) {
    parsedProps = {};
  }

  const TargetComponent = COMPONENT_MAP[componentName];

  return (
    <NodeViewWrapper className="embed-component-node-view relative my-6 group">
      {/* Thanh tiêu đề thao tác phía trên Component trong Editor */}
      <div className="flex items-center justify-between bg-[#105d97] text-white px-3 py-1.5 rounded-t-lg text-xs font-semibold select-none z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <span>🧩 Component nhúng:</span>
          <span className="bg-white/20 px-2 py-0.5 rounded font-mono">{componentName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/80 text-[11px] font-normal hidden sm:inline">
            (Hiển thị giao diện thực tế)
          </span>
          <button
            type="button"
            onClick={deleteNode}
            className="hover:bg-red-600 bg-red-500/80 text-white px-2.5 py-0.5 rounded transition-colors text-[11px] font-bold cursor-pointer"
            title="Xóa component này khỏi bài viết"
          >
            Xóa
          </button>
        </div>
      </div>

      {/* Khung hiển thị Live Preview của Component */}
      <div className="border-2 border-dashed border-[#105d97] border-t-0 rounded-b-lg p-2 bg-white min-h-[100px] overflow-hidden pointer-events-auto">
        {TargetComponent ? (
          componentName === "FabricCatalogView" ? (
            <div className="container mx-auto px-2 sm:px-4 mb-6 sm:mb-10 mt-3">
              <FabricCatalogView {...parsedProps} />
            </div>
          ) : (
            <TargetComponent {...parsedProps} />
          )
        ) : (
          <div className="p-6 text-center text-amber-600 bg-amber-50 rounded font-medium text-sm">
            ⚠️ Component <strong>{componentName}</strong> chưa được đăng ký trong danh sách xem trước.
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
