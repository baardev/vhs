import { getCommonDictionary } from '../../dictionaries';

export async function generateMetadata({ params: { lang } }) {
  const dict = await getCommonDictionary(lang);
  
  return {
    title: dict?.termsPage?.title || 'Terms of Service - Virtual Handicap System'
  };
} 