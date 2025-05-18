import { getCommonDictionary } from '../../dictionaries';

export async function generateMetadata({ params: { lang } }) {
  const dict = await getCommonDictionary(lang);
  
  return {
    title: dict?.privacyPage?.title || 'Privacy Policy - Virtual Handicap System'
  };
} 