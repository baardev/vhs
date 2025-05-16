// Ensure no import of getTranslations exists here
// import { getTranslations } from '../i18n'; // REMOVE IF PRESENT

// Defines the structure for dynamically importing dictionary modules.
interface DictionaryModule {
  default: Record<string, any>; // Or a more specific type for your dictionary
}

// A map holding functions that dynamically import the dictionary for each language.
const dictionaries: Record<string, () => Promise<DictionaryModule>> = {
  en: () => import('../public/locales/en/common.json'),
  es: () => import('../public/locales/es/common.json'),
  zh: () => import('../public/locales/zh/common.json'),
  ru: () => import('../public/locales/ru/common.json'),
  he: () => import('../public/locales/he/common.json'),
};

/**
 * Asynchronously loads and returns the common dictionary for the specified language.
 * Falls back to English if the specified language is not found.
 * 
 * @param lang The language code (e.g., 'en', 'es').
 * @returns A promise that resolves to the dictionary object.
 * @throws Will throw an error if the default (English) dictionary cannot be loaded.
 */
export const getCommonDictionary = async (lang: string): Promise<Record<string, any>> => {
  const loadDictionaryModule = dictionaries[lang] || dictionaries.en;

  if (!loadDictionaryModule) {
    // This should ideally not happen if 'en' is always in dictionaries
    console.error('Default English dictionary loader not found.');
    throw new Error('Failed to load default dictionary.');
  }

  try {
    const module = await loadDictionaryModule();
    return module.default; // .json files are imported with a 'default' export
  } catch (error) {
    console.error(`Error loading dictionary for lang '''${lang}''':`, error);
    // Attempt to load English as a fallback if the requested language failed,
    // unless it was already English that failed.
    if (lang !== 'en' && dictionaries.en) {
      try {
        console.warn(`Falling back to English dictionary for lang '''${lang}'''.`);
        const fallbackModule = await dictionaries.en();
        return fallbackModule.default;
      } catch (fallbackError) {
        console.error('Error loading fallback English dictionary:', fallbackError);
        throw new Error('Failed to load any dictionary.');
      }
    }
    throw new Error(`Failed to load dictionary for lang '''${lang}''' and fallback.`);
  }
}; 