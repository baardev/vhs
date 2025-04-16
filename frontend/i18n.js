import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// The translations are loaded via next-i18next serverSideTranslations in getStaticProps/getServerSideProps
// This file is for client-side i18n initialization

i18n
  // Enable client-side loading of translations
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // This configuration is merged with the one from next-i18next.config.js
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // Default namespace is 'common'
    defaultNS: 'common',

    react: {
      useSuspense: false, // Disable Suspense for server-side rendering
    },
  });

export default i18n;