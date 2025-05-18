import { getCommonDictionary } from '../../dictionaries';

export async function generateMetadata({ params: { lang } }) {
  const dict = await getCommonDictionary(lang);
  
  return {
    title: dict?.viewLogsPage?.title || 'Logs Viewer - Virtual Handicap System'
  };
} 