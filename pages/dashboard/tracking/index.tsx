import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { GetServerSidePropsContext } from "next";
import { BarChart3, ShieldAlert } from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import TrackingSettingsForm from "../../../components/dashboard/tracking/TrackingSettingsForm";
import TrackingStatusCards from "../../../components/dashboard/tracking/TrackingStatusCards";
import TrackingTestPanel from "../../../components/dashboard/tracking/TrackingTestPanel";
import {
  fetchTrackingConfig,
  getDefaultTrackingConfig,
} from "../../../lib/tracking-config";
import type { TrackingConfig } from "../../../types/tracking";

export default function TrackingDashboardPage() {
  const [config, setConfig] = useState<TrackingConfig>(getDefaultTrackingConfig());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchTrackingConfig()
      .then((nextConfig) => {
        if (active) setConfig(nextConfig);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminLayout title="Cài đặt Tracking">
      <div className="min-h-screen space-y-5 bg-[#f8fafc] p-6">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 shrink-0 text-[#105d97]" />
            <h1 className="m-0 text-[1.375rem] font-bold text-[#0f172a]">
              Cài đặt Tracking
            </h1>
          </div>
        </div>

        <TrackingStatusCards config={config} loading={loading} />
        <TrackingSettingsForm config={config} onSaved={setConfig} />
        <TrackingTestPanel config={config} />
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

  return { props: {} };
}
