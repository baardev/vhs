/**
 * @module dictionaries
 * @description Core internationalization module for the Open Handicap System.
 * 
 * This module provides the foundation for multilingual support by:
 * - Defining language dictionary loaders for supported languages (en, es, zh, ru, he)
 * - Handling dynamic import of language-specific JSON files
 * - Implementing fallback mechanisms to ensure stable language support
 * - Exposing a consistent API for dictionary access throughout the application
 * 
 * The dictionaries are loaded dynamically to improve initial load performance
 * by only loading language resources when needed. English is used as the fallback
 * language when a requested language is unavailable or fails to load.
 */

// Ensure no import of getTranslations exists here
// import { getTranslations } from '../i18n'; // REMOVE IF PRESENT

/**
 * @interface DictionaryModule
 * @description Defines the structure for dynamically imported dictionary modules.
 * @property {Record<string, any>} default - The default export from the JSON dictionary file.
 *                                          Contains all translation keys and values for a specific language.
 */
interface DictionaryModule {
  default: Record<string, any>; // Or a more specific type for your dictionary
}

/**
 * @constant dictionaries
 * @description A map holding functions that dynamically import the dictionary for each supported language.
 * Each key represents a language code (ISO 639-1) and the value is a function that returns
 * a Promise resolving to the corresponding dictionary module.
 */
const dictionaries: Record<string, () => Promise<DictionaryModule>> = {
  en: () => import('../public/locales/en/common.json'),
  es: () => import('../public/locales/es/common.json'),
  zh: () => import('../public/locales/zh/common.json'),
  ru: () => import('../public/locales/ru/common.json'),
  he: () => import('../public/locales/he/common.json'),
};

/**
 * @function getCommonDictionary
 * @description Asynchronously loads and returns the common dictionary for the specified language.
 * Falls back to English if the specified language is not found or fails to load.
 * 
 * This function handles all error cases gracefully:
 * - If the requested language is not supported, it falls back to English
 * - If loading the requested language fails, it attempts to load English
 * - If English fails as a fallback, it throws a clear error
 * 
 * @calledBy
 * - [lang]/layout.tsx (Next.js language-specific layout component)
 * - i18n.ts (internationalization configuration)
 * - All components needing localized strings via server components
 * - Dictionary loader utilities for client components
 * 
 * @calls
 * - Dynamic import() for loading language JSON files
 * - console.error/warn for logging issues with dictionary loading
 * 
 * @requires
 * - Language JSON files in the expected directory structure
 * - At minimum, a functioning English dictionary as fallback
 * - Support for dynamic imports in the JavaScript environment
 * 
 * @param {string} lang The language code (e.g., 'en', 'es').
 * @returns {Promise<Record<string, any>>} A promise that resolves to the dictionary object.
 * @throws {Error} Will throw an error if the default (English) dictionary cannot be loaded.
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