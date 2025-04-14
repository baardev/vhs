module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'he', 'ru', 'zh'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}