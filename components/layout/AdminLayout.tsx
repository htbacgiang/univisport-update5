import { FC, ReactNode, useState } from "react";
import AppHead from "../common/AppHead";
import Slidebar from '../backend/Slidebar';

interface Props {
  children: ReactNode;
  title?: string;
}

const AdminLayout: FC<Props> = ({ title, children }): JSX.Element => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
