import { getSession } from "next-auth/react";
import Link from "next/link";
import CustomDataTable from "../../components/backend/dashboard/CustomDataTable";
import AdminLayout from "../../components/layout/AdminLayout";
import { GetServerSidePropsContext } from "next";
import {
  LayoutGrid,
  Database,
  Package,
  Plus,
  ChevronRight,
} from "lucide-react";

export default function Dashboard({ user }: { user: { role: string } }) {
  return (
    <AdminLayout title="Dashboard">
      <div className="p-6 bg-[#f8fafc] min-h-screen space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center gap-2.5">
          <LayoutGrid className="w-5 h-5 text-[#105d97] shrink-0" />
          <h1 className="text-[1.375rem] font-bold text-[#0f172a] m-0">Dashboard</h1>
        </div>

        {/* ── Quick links ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.04em] text-[#105d97] mb-4 pb-3 border-b border-[#f1f5f9]">
            <Database className="w-3.5 h-3.5 shrink-0" />
            Quản lý sản phẩm
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard/san-pham">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-[#e2e8f0] hover:border-[#105d97] hover:bg-[#f0f7ff] transition-colors duration-150 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#105d97]/10 flex items-center justify-center shrink-0">
                    <Database className="w-4 h-4 text-[#105d97]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Danh sách sản phẩm</p>
                    <p className="text-xs text-[#64748b]">Xem và quản lý sản phẩm</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#105d97] transition-colors shrink-0" />
              </div>
            </Link>

            <Link href="/dashboard/them-san-pham">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-[#e2e8f0] hover:border-[#16a34a] hover:bg-[#f0fdf4] transition-colors duration-150 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#16a34a]/10 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-[#16a34a]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Thêm sản phẩm mới</p>
                    <p className="text-xs text-[#64748b]">Tạo sản phẩm mới</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#16a34a] transition-colors shrink-0" />
              </div>
            </Link>
          </div>
        </div>

        {/* ── Uniform Orders quick link ── */}
        <div className="bg-white border border-[#e2e8f0] rounded-[10px] p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.04em] text-[#105d97] mb-4 pb-3 border-b border-[#f1f5f9]">
            <Package className="w-3.5 h-3.5 shrink-0" />
            Đơn may đồng phục Univi
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard/don-hang">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-[#e2e8f0] hover:border-[#105d97] hover:bg-[#f0f7ff] transition-colors duration-150 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#105d97]/10 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-[#105d97]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Quản lý đơn đồng phục</p>
                    <p className="text-xs text-[#64748b]">Theo dõi tiến độ, in biên bản sản xuất xưởng</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#105d97] transition-colors shrink-0" />
              </div>
            </Link>

            <Link href="/dashboard/don-hang">
              <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border border-[#e2e8f0] hover:border-[#0e568f] hover:bg-[#f0f9ff] transition-colors duration-150 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0e568f]/10 flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4 text-[#0e568f]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0f172a]">Tạo đơn đồng phục mới</p>
                    <p className="text-xs text-[#64748b]">Lên biên bản may, mockup, bảng size</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-[#0e568f] transition-colors shrink-0" />
              </div>
            </Link>
          </div>
        </div>

        {/* ── Contacts table ── */}
        <CustomDataTable />

      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return {
      redirect: { destination: "/", permanent: false },
    };
  }

  return { props: { user: session.user as { role: string } } };
}
