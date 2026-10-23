import type {
  FbqFunction,
  FbqStandardEvent,
  TrackingEventName,
} from "../types/tracking";
import { CONSENT_STORAGE_KEY } from "./tracking-config";

type TrackingParams = Record<string, unknown>;

const META_PIXEL_SCRIPT_SRC = "https://connect.facebook.net/en_US/fbevents.js";

const isBrowser = () => typeof window !== "undefined";

export const isCookieConsentAccepted = () => {
  if (!isBrowser()) return false;
  return window.localStorage.getItem(CONSENT_STORAGE_KEY) === "accepted";
};

export const setTrackingAllowedOverride = (allowed: boolean) => {
  if (!isBrowser()) return;
  window.__UNIVI_TRACKING_ALLOWED__ = allowed;
};

export const isMetaPixelReady = () =>
  isBrowser() && typeof window.fbq === "function";

const createFbqStub = () => {
  if (!isBrowser() || window.fbq) return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) {
      fbq.callMethod(...args);
      return;
    }

    fbq.queue?.push(args);
  }) as FbqFunction;

  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.push = fbq;

  window.fbq = fbq;
  window._fbq = fbq;
};

export const loadMetaPixelForTest = (pixelId: string): Promise<void> => {
  if (!isBrowser()) return Promise.resolve();

  if (window.__META_PIXEL_INITIALIZED__ && window.__META_PIXEL_ID__ === pixelId) {
    return Promise.resolve();
  }

  if (window.__META_PIXEL_LOADING_PROMISE__) {
    return window.__META_PIXEL_LOADING_PROMISE__;
  }

  createFbqStub();

  const loadingPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${META_PIXEL_SCRIPT_SRC}"]`
    );

    const initialize = () => {
      window.fbq?.("consent", "grant");
      window.fbq?.("init", pixelId);
      window.__META_PIXEL_INITIALIZED__ = true;
      window.__META_PIXEL_ID__ = pixelId;
      resolve();
    };

    if (existingScript) {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = META_PIXEL_SCRIPT_SRC;
    script.onload = initialize;
    script.onerror = () => reject(new Error("Không thể tải Meta Pixel"));
    document.head.appendChild(script);
  });

  window.__META_PIXEL_LOADING_PROMISE__ = loadingPromise;
  loadingPromise.finally(() => {
    window.__META_PIXEL_LOADING_PROMISE__ = undefined;
  });

  return loadingPromise;
};

export const grantMetaPixelConsent = () => {
  if (!isMetaPixelReady()) return;
  window.fbq?.("consent", "grant");
};

export const revokeMetaPixelConsent = () => {
  if (!isMetaPixelReady()) return;
  window.fbq?.("consent", "revoke");
};

const canTrack = () =>
  isMetaPixelReady() &&
  (isCookieConsentAccepted() || window.__UNIVI_TRACKING_ALLOWED__ === true);

export const fbqTrack = (
  eventName: FbqStandardEvent,
  parameters?: TrackingParams
) => {
  if (!canTrack()) return false;
  window.fbq?.("track", eventName, parameters);
  return true;
};

export const fbqTrackCustom = (
  eventName: TrackingEventName | string,
  parameters?: TrackingParams
) => {
  if (!canTrack()) return false;
  window.fbq?.("trackCustom", eventName, parameters);
  return true;
};

export const trackPageView = (parameters?: TrackingParams) =>
  fbqTrack("PageView", parameters);

export const trackViewContent = (parameters?: TrackingParams) =>
  fbqTrack("ViewContent", parameters);

export const trackLead = (parameters?: TrackingParams) =>
  fbqTrack("Lead", parameters);

export const trackContact = (parameters?: TrackingParams) =>
  fbqTrack("Contact", parameters);

export const trackPhoneClick = (phone?: string, parameters?: TrackingParams) =>
  fbqTrackCustom("PhoneClick", {
    phone,
    channel: "hotline",
    ...parameters,
  });

export const trackZaloClick = (parameters?: TrackingParams) =>
  fbqTrackCustom("ZaloClick", {
    channel: "zalo",
    ...parameters,
  });

export const trackMessengerClick = (parameters?: TrackingParams) =>
  fbqTrackCustom("MessengerClick", {
    channel: "messenger",
    ...parameters,
  });

export const trackScrollDepth = (percent: number, parameters?: TrackingParams) =>
  fbqTrackCustom("ScrollDepth", {
    percent,
    ...parameters,
  });

export const trackTimeOnPage = (seconds: number, parameters?: TrackingParams) =>
  fbqTrackCustom("TimeOnPage", {
    seconds,
    ...parameters,
  });
