export function WEB_DOMAIN(): string | undefined {
  return process.env.NEXT_PUBLIC_WEB_DOMAIN;
}

export const __PROD__ = process.env.NODE_ENV === 'production';
export const __DEV__ = process.env.NODE_ENV !== 'production';
export const __TEST__ = process.env.NODE_ENV === 'test';
export const __PREVIEW__ = process.env.IS_PREVIEW === 'true';
