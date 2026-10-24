import { FC, ReactNode, useState, useEffect } from "react";
import AppHead from "../common/AppHead";
import Slidebar from '../backend/Slidebar';
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface Props {
  children: ReactNode;
  title?: string;
}

const AdminLayout: FC<Props> = ({ title, children }): JSX.Element | null => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" || (session?.user as { role?: string })?.role !== "admin") {
      router.replace("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#105d97] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as { role?: string })?.role !== "admin") {
    return null;
  }

  return (
    <>
      <AppHead title={title} />
      <div className="flex">
        <Slidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
        <div
          className={`
            ml-0 flex-grow bg-slate-100 min-h-screen
            transition-all duration-300
            ${collapsed ? 'lg:ml-16' : 'lg:ml-60'}
          `}
        >
          <main className="bg-white dark:bg-slate-900 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
