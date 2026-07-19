export function safeInternalRedirect(value: string | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || /^\/[\\/]/.test(value)) return fallback;
  return value;
}

export function loginUrl(callbackUrl: string) {
  return `/login?callbackUrl=${encodeURIComponent(safeInternalRedirect(callbackUrl, "/client"))}`;
}
