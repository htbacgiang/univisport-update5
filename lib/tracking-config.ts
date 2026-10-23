import type { TrackingConfig, TrackingEventName, TrackingMode } from "../types/tracking";

export const CONSENT_STORAGE_KEY = "univi_cookie_consent";
export const NOTICE_DISMISSED_STORAGE_KEY = "univi_tracking_notice_dismissed";
export const TRACKING_CONFIG_STORAGE_KEY = "univi_tracking_config_cache";
export const TRACKING_CONFIG_EVENT = "univi:tracking-config-updated";
export const COOKIE_CONSENT_EVENT = "univi:cookie-consent-changed";

export const META_PIXEL_PLACEHOLDER = "YOUR_PIXEL_ID";
export const BRAND_PRIMARY_COLOR = "#105d97";
export const TRACKING_MODES: TrackingMode[] = ["consent", "notice", "always"];

export const SUPPORTED_TRACKING_EVENTS: TrackingEventName[] = [
  "PageView",
  "ViewContent",
  "Lead",
  "Contact",
  "PhoneClick",
  "ZaloClick",
  "MessengerClick",
  "ScrollDepth",
  "TimeOnPage",
];

const DEFAULT_COOKIE_MESSAGE =
  "Website sử dụng cookie để cải thiện trải nghiệm. Bạn có thể đồng ý hoặc từ chối bất cứ lúc nào.";

const isConfiguredId = (value?: string, placeholder = META_PIXEL_PLACEHOLDER) => {
  const id = value?.trim();
  return Boolean(id && id !== placeholder && !id.includes("YOUR_"));
};

export const getDefaultTrackingConfig = (): TrackingConfig => {
  const metaPixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || META_PIXEL_PLACEHOLDER;
  const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || "";
  const tiktokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID || "";
  const gtmContainerId = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID || "";

  return {
    trackingMode: "consent",
    metaPixel: {
      enabled: isConfiguredId(metaPixelId),
      pixelId: metaPixelId,
    },
    ga4: {
      enabled: isConfiguredId(ga4MeasurementId, ""),
      measurementId: ga4MeasurementId,
    },
    tiktokPixel: {
      enabled: false,
      pixelId: tiktokPixelId,
    },
    googleTagManager: {
      enabled: false,
      containerId: gtmContainerId,
    },
    cookieConsent: {
      enabled: true,
      message: DEFAULT_COOKIE_MESSAGE,
      primaryColor: BRAND_PRIMARY_COLOR,
      defaultConsent: "revoked",
    },
    supportedEvents: SUPPORTED_TRACKING_EVENTS,
  };
};

const asBoolean = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

const asString = (value: unknown, fallback: string) =>
  typeof value === "string" ? value : fallback;

const isValidColor = (value: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);

export const normalizeTrackingConfig = (input?: Partial<TrackingConfig> | null): TrackingConfig => {
  const defaults = getDefaultTrackingConfig();
  const cookiePrimaryColor = asString(
    input?.cookieConsent?.primaryColor,
    defaults.cookieConsent.primaryColor
  );

  return {
    trackingMode: TRACKING_MODES.includes(input?.trackingMode as TrackingMode)
      ? (input?.trackingMode as TrackingMode)
      : defaults.trackingMode,
    metaPixel: {
      enabled: asBoolean(input?.metaPixel?.enabled, defaults.metaPixel.enabled),
      pixelId: asString(input?.metaPixel?.pixelId, defaults.metaPixel.pixelId).trim(),
    },
    ga4: {
      enabled: asBoolean(input?.ga4?.enabled, defaults.ga4.enabled),
      measurementId: asString(input?.ga4?.measurementId, defaults.ga4.measurementId).trim(),
    },
    tiktokPixel: {
      enabled: asBoolean(input?.tiktokPixel?.enabled, defaults.tiktokPixel.enabled),
      pixelId: asString(input?.tiktokPixel?.pixelId, defaults.tiktokPixel.pixelId).trim(),
    },
    googleTagManager: {
      enabled: asBoolean(input?.googleTagManager?.enabled, defaults.googleTagManager.enabled),
      containerId: asString(
        input?.googleTagManager?.containerId,
        defaults.googleTagManager.containerId
      ).trim(),
    },
    cookieConsent: {
      enabled: asBoolean(input?.cookieConsent?.enabled, defaults.cookieConsent.enabled),
      message:
        asString(input?.cookieConsent?.message, defaults.cookieConsent.message).trim() ||
        defaults.cookieConsent.message,
      primaryColor: isValidColor(cookiePrimaryColor) ? cookiePrimaryColor : BRAND_PRIMARY_COLOR,
      defaultConsent:
        input?.cookieConsent?.defaultConsent === "granted" ? "granted" : defaults.cookieConsent.defaultConsent,
    },
    supportedEvents: SUPPORTED_TRACKING_EVENTS,
  };
};

export const isMetaPixelConfigured = (config: TrackingConfig) =>
  isConfiguredId(config.metaPixel.pixelId);

export const canLoadMetaPixel = (config: TrackingConfig) =>
  config.metaPixel.enabled && isMetaPixelConfigured(config);

export const isTrackingAllowed = (config: TrackingConfig, isAccepted: boolean) =>
  config.trackingMode === "consent" ? isAccepted : true;

export const canLoadMetaPixelWithConsent = (
  config: TrackingConfig,
  isAccepted: boolean
) => canLoadMetaPixel(config) && isTrackingAllowed(config, isAccepted);

export const isGa4Configured = (config: TrackingConfig) =>
  isConfiguredId(config.ga4.measurementId, "");

export const canLoadGa4 = (config: TrackingConfig) =>
  config.ga4.enabled && isGa4Configured(config);

export const canLoadGa4WithConsent = (config: TrackingConfig, isAccepted: boolean) =>
  canLoadGa4(config) && isTrackingAllowed(config, isAccepted);

export const fetchTrackingConfig = async (): Promise<TrackingConfig> => {
  const response = await fetch("/api/tracking/config", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    return getDefaultTrackingConfig();
  }

  const data = (await response.json()) as { config?: Partial<TrackingConfig> };
  return normalizeTrackingConfig(data.config);
};
