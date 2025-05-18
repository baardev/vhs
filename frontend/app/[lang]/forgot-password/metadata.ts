import { getCommonDictionary } from '../../dictionaries';

export async function generateMetadata({ params: { lang } }) {
  const dict = await getCommonDictionary(lang);
  
  return {
    title: dict?.forgotPasswordPage?.title || 'Forgot Password - Virtual Handicap System'
  };
} 