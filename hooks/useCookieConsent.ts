"use client";

import { useCallback, useEffect, useState } from "react";
import type { CookieConsentStatus } from "../types/tracking";
import {
  CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_EVENT,
} from "../lib/tracking-config";
import {
  grantMetaPixelConsent,
  revokeMetaPixelConsent,
} from "../lib/meta-pixel";

const isCookieConsentStatus = (value: string | null): value is CookieConsentStatus =>
  value === "accepted" || value === "rejected" || value === "pending";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

const getCookieValue = (name: string) => {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split("=")[1] || "") : null;
};

const setConsentCookie = (status: CookieConsentStatus) => {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_STORAGE_KEY}=${encodeURIComponent(
    status
  )}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
};

const deleteConsentCookie = () => {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
};

const dispatchCookieConsentEvent = (status: CookieConsentStatus) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: { status },
    })
  );
};

export const getStoredCookieConsent = (): CookieConsentStatus => {
  if (typeof window === "undefined") return "pending";

  const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (isCookieConsentStatus(stored)) return stored;

  const cookieStatus = getCookieValue(CONSENT_STORAGE_KEY);
  if (isCookieConsentStatus(cookieStatus)) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, cookieStatus);
    return cookieStatus;
  }

  return "pending";
};

export const setStoredCookieConsent = (status: CookieConsentStatus) => {
  if (typeof window === "undefined") return;

  if (status === "pending") {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    deleteConsentCookie();
  } else {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, status);
    setConsentCookie(status);
  }

  dispatchCookieConsentEvent(status);
};

export const resetStoredCookieConsent = () => {
  setStoredCookieConsent("pending");
  revokeMetaPixelConsent();
};

export const useCookieConsent = () => {
  const [status, setStatus] = useState<CookieConsentStatus>("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStatus(getStoredCookieConsent());

    const handleStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_STORAGE_KEY) {
        setStatus(getStoredCookieConsent());
      }
    };

    const handleCustomEvent = (event: Event) => {
      const nextStatus = (event as CustomEvent<{ status?: CookieConsentStatus }>).detail?.status;
      if (nextStatus) setStatus(nextStatus);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(COOKIE_CONSENT_EVENT, handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleCustomEvent);
    };
  }, []);

  const acceptCookies = useCallback(() => {
    setStoredCookieConsent("accepted");
    grantMetaPixelConsent();
    setStatus("accepted");
  }, []);

  const rejectCookies = useCallback(() => {
    setStoredCookieConsent("rejected");
    revokeMetaPixelConsent();
    setStatus("rejected");
  }, []);

  const resetConsent = useCallback(() => {
    resetStoredCookieConsent();
    setStatus("pending");
  }, []);

  return {
    status,
    mounted,
    isAccepted: status === "accepted",
    isRejected: status === "rejected",
    isPending: status === "pending",
    acceptCookies,
    rejectCookies,
    resetConsent,
  };
};
