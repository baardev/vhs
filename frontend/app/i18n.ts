// import { createInstance } from 'i18next';
// import resourcesToBackend from 'i18next-resources-to-backend';
// import { initReactI18next } from 'react-i18next';

// Language options
export const locales = ['en', 'es', 'zh', 'ru', 'he'];
export const defaultLocale = 'en';

/*
// Helper function to create instance
export const getI18nInstance = async (locale: string, ns: string[]) => {
  const i18nInstance = createInstance();
  
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../public/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      supportedLngs: locales,
      fallbackLng: defaultLocale,
      ns,
      defaultNS: 'common',
      fallbackNS: 'common',
      react: {
        useSuspense: false,
      },
    });

  return i18nInstance;
};

// Translation function
export async function getTranslations(locale: string = defaultLocale, ns: string[] = ['common']) {
  const i18nextInstance = await getI18nInstance(locale, ns);
  
  return {
    t: i18nextInstance.getFixedT(locale, ns),
    i18n: i18nextInstance,
  };
}
*/ 