import { getCommonDictionary } from '../../dictionaries';

export async function generateMetadata({ params: { lang } }) {
  const dict = await getCommonDictionary(lang);
  
  return {
    title: dict?.resetPassword?.title || 'Reset Password - Virtual Handicap System'
  };
} 