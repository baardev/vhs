import path from 'path';

const config = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ru', 'he', 'zh'],
  },
  defaultNS: 'common',
  localePath: typeof window === 'undefined' ? path.resolve('./public/locales') : '/locales',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};

export default config;
export const i18n = config.i18n;