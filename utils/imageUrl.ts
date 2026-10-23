const SITE_ORIGIN = "https://dongphucunivi.com";

const encodeUrlSafely = (value: string) => {
  try {
    return encodeURI(decodeURI(value));
  } catch {
    return encodeURI(value);
  }
};

const addCloudinaryThumbnailTransform = (value: string) => {
  const match = value.match(
    /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/i
  );
  if (!match) return value;

  const [, prefix, rest] = match;
  if (/^(f_|q_|w_|h_|c_|g_|dpr_|ar_|e_|r_|b_|bo_|co_|o_|x_|y_|z_|t_)/i.test(rest)) {
    return value;
  }

  return `${prefix}f_auto,q_auto,w_1200/${rest}`;
};

export const normalizeImageUrl = (value?: string | null): string => {
  const raw = String(value || "").trim().replace(/\\/g, "/");
  if (!raw) return "";
  if (/^(data:image\/|blob:)/i.test(raw)) return raw;
  if (/^https?:\/\//i.test(raw)) {
    return addCloudinaryThumbnailTransform(encodeUrlSafely(raw));
  }
  if (raw.startsWith("//")) {
    return addCloudinaryThumbnailTransform(encodeUrlSafely(`https:${raw}`));
  }

  const localPath = raw.replace(/^\.?\//, "").replace(/^public\//i, "");
  return `/${encodeUrlSafely(localPath).replace(/^\/+/, "")}`;
};

export const toAbsoluteImageUrl = (value?: string | null): string => {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return "";
  if (/^(https?:\/\/|data:image\/|blob:)/i.test(normalized)) return normalized;
  return `${SITE_ORIGIN}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
};
