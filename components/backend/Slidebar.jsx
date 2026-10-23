"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutGrid,
  Notebook,
  SquarePen,
  Users2,
  UserCircle,
  ClipboardList,
  Database,
  Package,
  Settings,
  BarChart3,
  Activity,
  LogOut,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
  LayoutTemplate,
  FileText,
  Star,
  CircleHelp,
  Handshake,
  FileSearch,
  Network,
  Sparkles,
  Link2,
  Video,
} from "lucide-react";
import { useRouter } from "next/router";

const NAV_GROUPS = [
  {
    label: "Tổng quan",
    items: [
      { title: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    ],
  },
  {
    label: "Đơn hàng",
    items: [
      { title: "Đơn hàng đồng phục", icon: ClipboardList, href: "/dashboard/don-hang" },
    ],
  },
  {
    label: "Nội dung",
    items: [
      { title: "Bài viết", icon: Notebook, href: "/dashboard/bai-viet" },
      { title: "Thêm bài viết", icon: SquarePen, href: "/dashboard/them-bai-viet" },
      { title: "Tác giả", icon: UserCircle, href: "/dashboard/tac-gia" },
      { title: "Feedback", icon: MessageSquare, href: "/dashboard/feedback" },
      { title: "Video Feedback", icon: Video, href: "/dashboard/video-feedback" },
    ],
  },
  {
    label: "Khách hàng",
    items: [
      { title: "Liên hệ", icon: Users2, href: "/dashboard/khach-hang" },
      { title: "Đại lý", icon: ClipboardList, href: "/dashboard/dai-ly" },
      { title: "Người dùng", icon: UserCircle, href: "/dashboard/nguoi-dung" },
    ],
  },
  {
    label: "Sản phẩm",
    items: [
      { title: "Danh sách", icon: Database, href: "/dashboard/san-pham" },
      { title: "Thêm mới", icon: Package, href: "/dashboard/them-san-pham" },
      { title: "Đánh giá", icon: Star, href: "/dashboard/danh-gia" },
      { title: "Bài viết danh mục", icon: FileText, href: "/dashboard/danh-muc" },
      { title: "Sections trang chủ", icon: LayoutTemplate, href: "/dashboard/homepage-sections" },
      { title: "Quản lý Lookbook", icon: LayoutTemplate, href: "/dashboard/lookbook" },
      { title: "FAQ trang chủ", icon: CircleHelp, href: "/dashboard/faq" },
      { title: "Logo đối tác", icon: Handshake, href: "/dashboard/partner-logos" },
      { title: "Banner sidebar", icon: LayoutTemplate, href: "/dashboard/sidebar-banners" },
    ],
  },
  {
    label: "Tuyển dụng",
    items: [
      { title: "Tin tuyển dụng", icon: Notebook, href: "/dashboard/tuyen-dung" },
      { title: "Ứng viên", icon: Users2, href: "/dashboard/ung-vien" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { title: "SEO Dashboard", icon: BarChart3, href: "/dashboard/seo" },
      { title: "SEO Content", icon: FileSearch, href: "/dashboard/seo/content" },
      { title: "Keyword Hub", icon: FileText, href: "/dashboard/seo/keyword-hub" },
      { title: "Topical Map", icon: Network, href: "/dashboard/seo/topical-map" },
      { title: "Entity", icon: Sparkles, href: "/dashboard/seo/entities" },
      { title: "Internal Links", icon: Link2, href: "/dashboard/seo/internal-links" },
      { title: "Tracking", icon: BarChart3, href: "/dashboard/tracking" },
      { title: "Phân tích người dùng", icon: Activity, href: "/dashboard/phan-tich" },
    ],
  },
];

export default function Sidebar({ showSidebar, setShowSidebar, collapsed, setCollapsed }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  const isActive = (href) => pathname === href;

  return (
    <aside
      className={`
        fixed left-0 top-0 z-40 h-screen
        bg-white dark:bg-gray-900
        border-r border-gray-100 dark:border-gray-800
        flex flex-col overflow-hidden
        transition-all duration-300
        ${collapsed ? "w-16" : "w-60"}
        ${showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
      `}
    >
      {/* ── Logo + collapse toggle ── */}
      <div className="flex items-center h-16 border-b border-gray-100 dark:border-gray-800 shrink-0 px-2 gap-2">
        {!collapsed && (
          <Link href="/" onClick={() => setShowSidebar(false)} className="flex-1 flex justify-center overflow-hidden">
            <Image
              src="/logo-univi.webp"
              alt="Logo Đồng phục UniVi"
              width={90}
              height={52}
              className="object-contain"
            />
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
          className={`
            shrink-0 flex items-center justify-center
            w-8 h-8 rounded-lg
            text-gray-400 hover:text-[#105d97] hover:bg-[#105d97]/10
            transition-colors duration-150
            ${collapsed ? "mx-auto" : ""}
          `}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />
          }
        </button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {/* Group label */}
            {!collapsed ? (
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {group.label}
              </p>
            ) : (
              <div className="mx-2 mb-2 border-t border-gray-100 dark:border-gray-800" />
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setShowSidebar(false)}
                    title={collapsed ? item.title : undefined}
                    className={`
                      flex items-center rounded-lg text-sm font-medium
                      transition-colors duration-150 group relative
                      ${collapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2.5"}
                      ${active
                        ? "bg-[#105d97]/10 text-[#105d97] dark:bg-[#105d97]/20 dark:text-blue-300"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      }
                    `}
                  >
                    {/* Active left indicator */}
                    {active && !collapsed && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#105d97] rounded-r-full" />
                    )}

                    <Icon
                      className={`shrink-0 transition-colors duration-150 ${collapsed ? "w-5 h-5" : "w-4 h-4"
                        } ${active
                          ? "text-[#105d97] dark:text-blue-300"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        }`}
                    />

                    {!collapsed && (
                      <>
                        <span className="truncate">{item.title}</span>
                        {active && (
                          <ChevronRight className="w-3.5 h-3.5 ml-auto text-[#105d97]/60 dark:text-blue-400/60" />
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Bottom: Settings + User + Logout ── */}
      <div className="shrink-0 border-t border-gray-100 dark:border-gray-800">

        {/* User + Logout */}
        {session && (
          <div className="px-2 py-2 mt-0.5">
            {collapsed ? (
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                  {session.user?.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#105d97] flex items-center justify-center text-white text-xs font-bold">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Đăng xuất"
                  className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                {session.user?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#105d97] flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {session.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {session.user?.name}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                    {session.user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                  </p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  title="Đăng xuất"
                  className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
