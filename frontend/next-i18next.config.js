module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ru', 'he'],
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/locales',
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}