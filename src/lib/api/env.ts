import { DEFAULTS } from './constants';

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured) return DEFAULTS.siteUrl;

  try {
    return new URL(configured).origin;
  } catch {
    console.error('Invalid NEXT_PUBLIC_SITE_URL:', configured);
    return DEFAULTS.siteUrl;
  }
}
