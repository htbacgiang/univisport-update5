"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import {
  canLoadMetaPixelWithConsent,
  fetchTrackingConfig,
  getDefaultTrackingConfig,
} from "../../lib/tracking-config";
import {
  trackMessengerClick,
  trackPageView,
  trackPhoneClick,
  trackScrollDepth,
  trackTimeOnPage,
  trackZaloClick,
  setTrackingAllowedOverride,
} from "../../lib/meta-pixel";
import type { TrackingConfig } from "../../types/tracking";

const ROUTE_CHANGE_EVENT = "routeChangeComplete";

export default function MetaPixel() {
  const router = useRouter();
  const { mounted, isAccepted } = useCookieConsent();
  const [config, setConfig] = useState<TrackingConfig>(getDefaultTrackingConfig());
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const trackedScrollDepthsRef = useRef<Set<number>>(new Set());
  const trackedTimeMarksRef = useRef<Set<number>>(new Set());

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

  const shouldLoadPixel = useMemo(
    () => mounted && canLoadMetaPixelWithConsent(config, isAccepted),
    [config, isAccepted, mounted]
  );

  useEffect(() => {
    setTrackingAllowedOverride(shouldLoadPixel);
  }, [shouldLoadPixel]);

  useEffect(() => {
    if (!shouldLoadPixel || !scriptLoaded) return;

    const handleRouteChange = (url: string) => {
      trackedScrollDepthsRef.current = new Set();
      trackedTimeMarksRef.current = new Set();
      trackPageView({ path: url });
    };

    router.events.on(ROUTE_CHANGE_EVENT, handleRouteChange);
    return () => router.events.off(ROUTE_CHANGE_EVENT, handleRouteChange);
  }, [router.events, scriptLoaded, shouldLoadPixel]);

  useEffect(() => {
    if (!shouldLoadPixel || !scriptLoaded) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const clickable = target?.closest("a,button");
      if (!clickable) return;
      if (clickable.getAttribute("data-meta-tracked") === "true") return;

      const href = clickable instanceof HTMLAnchorElement ? clickable.href : "";
      const label =
        clickable.getAttribute("aria-label") ||
        clickable.textContent?.trim() ||
        undefined;

      if (href.startsWith("tel:")) {
        trackPhoneClick(href.replace("tel:", ""), { label, path: router.asPath });
        return;
      }

      if (href.includes("zalo.me")) {
        trackZaloClick({ label, path: router.asPath });
        return;
      }

      if (href.includes("m.me") || href.includes("messenger.com")) {
        trackMessengerClick({ label, path: router.asPath });
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router.asPath, scriptLoaded, shouldLoadPixel]);

  useEffect(() => {
    if (!shouldLoadPixel || !scriptLoaded) return;

    const scrollDepths = [25, 50, 75, 100];
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const currentDepth = Math.min(
        100,
        Math.round((window.scrollY / scrollableHeight) * 100)
      );

      scrollDepths.forEach((depth) => {
        if (currentDepth >= depth && !trackedScrollDepthsRef.current.has(depth)) {
          trackedScrollDepthsRef.current.add(depth);
          trackScrollDepth(depth, { path: router.asPath });
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [router.asPath, scriptLoaded, shouldLoadPixel]);

  useEffect(() => {
    if (!shouldLoadPixel || !scriptLoaded) return;

    const marks = [30, 60, 120];
    const timers = marks.map((seconds) =>
      window.setTimeout(() => {
        if (!trackedTimeMarksRef.current.has(seconds)) {
          trackedTimeMarksRef.current.add(seconds);
          trackTimeOnPage(seconds, { path: router.asPath });
        }
      }, seconds * 1000)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [router.asPath, scriptLoaded, shouldLoadPixel]);

  if (!shouldLoadPixel) return null;

  const pixelId = config.metaPixel.pixelId;

  return (
    <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setScriptLoaded(true)}>
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq&&f.__META_PIXEL_INITIALIZED__&&f.__META_PIXEL_ID__==='${pixelId}')return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('consent', 'revoke');
        fbq('init', '${pixelId}');
        fbq('consent', 'grant');
        fbq('track', 'PageView');
        window.__META_PIXEL_INITIALIZED__ = true;
        window.__META_PIXEL_ID__ = '${pixelId}';
      `}
    </Script>
  );
}
