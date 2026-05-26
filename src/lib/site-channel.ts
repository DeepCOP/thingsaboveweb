export type SiteChannel = 'beta' | 'production';

export const siteChannel: SiteChannel =
  process.env.NEXT_PUBLIC_SITE_CHANNEL === 'beta' ? 'beta' : 'production';

export const isBetaSite = siteChannel === 'beta';
