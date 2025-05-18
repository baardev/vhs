import { getCommonDictionary } from '../../dictionaries';

export async function generateMetadata({ params: { lang } }) {
  const dict = await getCommonDictionary(lang);
  
  return {
    title: dict?.debugLogs?.title || 'Debug Logs - Virtual Handicap System'
  };
} 