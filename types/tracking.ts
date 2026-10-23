export type CookieConsentStatus = "accepted" | "rejected" | "pending";

export type ConsentDefaultState = "revoked" | "granted";

export type TrackingMode = "consent" | "notice" | "always";

export type TrackingEventName =
  | "PageView"
  | "ViewContent"
  | "Lead"
  | "Contact"
  | "PhoneClick"
  | "ZaloClick"
  | "MessengerClick"
  | "ScrollDepth"
  | "TimeOnPage";

export interface TrackingProviderConfig {
  enabled: boolean;
}

export interface MetaPixelConfig extends TrackingProviderConfig {
  pixelId: string;
}

export interface GoogleAnalyticsConfig extends TrackingProviderConfig {
  measurementId: string;
}

export interface TikTokPixelConfig extends TrackingProviderConfig {
  pixelId: string;
}

export interface GoogleTagManagerConfig extends TrackingProviderConfig {
  containerId: string;
}

export interface CookieConsentConfig {
  enabled: boolean;
  message: string;
  primaryColor: string;
  defaultConsent: ConsentDefaultState;
}

export interface TrackingConfig {
  trackingMode: TrackingMode;
  metaPixel: MetaPixelConfig;
  ga4: GoogleAnalyticsConfig;
  tiktokPixel: TikTokPixelConfig;
  googleTagManager: GoogleTagManagerConfig;
  cookieConsent: CookieConsentConfig;
  supportedEvents: TrackingEventName[];
}

export type FbqStandardEvent = "PageView" | "ViewContent" | "Lead" | "Contact";

export type FbqConsentAction = "grant" | "revoke";

export type FbqFunction = {
  (command: "track", eventName: FbqStandardEvent, parameters?: Record<string, unknown>): void;
  (command: "trackCustom", eventName: TrackingEventName | string, parameters?: Record<string, unknown>): void;
  (command: "init", pixelId: string): void;
  (command: "consent", action: FbqConsentAction): void;
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: FbqFunction;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    ttq?: unknown;
    __META_PIXEL_INITIALIZED__?: boolean;
    __META_PIXEL_ID__?: string;
    __META_PIXEL_LOADING_PROMISE__?: Promise<void>;
    __UNIVI_TRACKING_ALLOWED__?: boolean;
  }
}

export {};
