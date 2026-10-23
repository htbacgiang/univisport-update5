import { getSession } from "next-auth/react";
import DealerContactTable from "../../../components/backend/dashboard/DealerContactTable";
import AdminLayout from "../../../components/layout/AdminLayout";
import { GetServerSidePropsContext } from "next";

export default function DaiLyDashboard({ user }: { user: { role: string } }) {
  return (
    <AdminLayout title="Danh sách đại lý đăng ký">
      <div className="p-6 bg-[#f8fafc] min-h-screen space-y-5">
        <DealerContactTable />
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
