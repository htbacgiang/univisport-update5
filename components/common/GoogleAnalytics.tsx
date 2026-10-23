"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import {
  canLoadGa4WithConsent,
  fetchTrackingConfig,
  getDefaultTrackingConfig,
} from "../../lib/tracking-config";
import type { TrackingConfig } from "../../types/tracking";

const GoogleAnalytics = () => {
  const router = useRouter();
  const { mounted, isAccepted } = useCookieConsent();
  const [config, setConfig] = useState<TrackingConfig>(getDefaultTrackingConfig());

  useEffect(() => {
    let active = true;

    fetchTrackingConfig()
      .then((nextConfig) => {
        if (active) setConfig(nextConfig);
      })
      .catch(() => {
        if (active) setConfig(getDefaultTrackingConfig());
      });

    return () => {
      active = false;
    };
  }, []);

  const shouldLoadGa4 = useMemo(
    () => mounted && canLoadGa4WithConsent(config, isAccepted),
    [config, isAccepted, mounted]
  );

  useEffect(() => {
    if (!shouldLoadGa4) return;

    const handleRouteChange = (url: string) => {
      window.gtag?.("config", config.ga4.measurementId, {
        page_path: url,
      });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [config.ga4.measurementId, router.events, shouldLoadGa4]);

  if (!shouldLoadGa4) return null;

  const measurementId = config.ga4.measurementId;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
