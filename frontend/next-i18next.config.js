import path from 'path';

/** @type {import('next-i18next').UserConfig} */
export const i18nConfig = {
  i18n: {
    locales: ['en', 'es', 'zh', 'ru', 'he'],
    defaultLocale: 'en'
  },

  // use the files you really have
  ns: ['common'],
  defaultNS: 'common',

  // don't look for en-US first
  load: 'languageOnly',


  localePath: './public/locales'
};

// Add this line so next.config.js can import { i18n }
export const i18n = i18nConfig.i18n;

export default i18nConfig;