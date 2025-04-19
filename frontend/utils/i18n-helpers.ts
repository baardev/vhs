import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getI18nProps(locale: string | undefined, namespaces: string[] = ['common']) {
  const safeLocale = locale || 'en';
  const translations = await serverSideTranslations(safeLocale, namespaces);
  
  if (translations && translations._nextI18Next && translations._nextI18Next.userConfig) {
    delete translations._nextI18Next.userConfig;
  }
  
  // Return the full result from serverSideTranslations
  return {
    props: {
      ...translations,
      // We might not even need to add locale manually, 
      // as serverSideTranslations usually includes it.
      locale: safeLocale, 
    },
  };
} 