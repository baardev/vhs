// import { getTranslations } from '../i18n'; // REMOVED

// Create a cache for dictionaries to avoid reloading the same dictionary multiple times
const dictionaryCache: Record<string, Record<string, any>> = {};

// Helper to directly load the JSON for the common namespace
// This is similar to what's in app/dictionaries.ts but kept here as this file
// seems to be the intended provider for these page-specific dictionary functions.
const loadCommonJson = async (locale: string): Promise<Record<string, any>> => {
  console.log(`[dictionaries.ts] Attempting to load common.json for locale: ${locale}`);
  // Check if the dictionary is already in cache
  if (dictionaryCache[locale]) {
    console.log(`[dictionaries.ts] Cache hit for locale: ${locale}`);
    return dictionaryCache[locale];
  }
  console.log(`[dictionaries.ts] Cache miss for locale: ${locale}, importing file.`);

  try {
    // Dynamically import the common.json for the given locale
    const module = await import(`../../public/locales/${locale}/common.json`);
    if (!module || typeof module.default !== 'object' || module.default === null) {
      console.error(`[dictionaries.ts] Failed to load or parse common.json for locale '''${locale}'''. Module or default export is invalid:`, module);
      throw new Error(`Invalid dictionary structure for locale '''${locale}'''.`);
    }
    // Cache the dictionary
    dictionaryCache[locale] = module.default;
    console.log(`[dictionaries.ts] Successfully loaded and cached common.json for locale: ${locale}`);
    return module.default; // .json files are imported with a 'default' export
  } catch (error) {
    console.error(`[dictionaries.ts] Error loading common.json for lang '''${locale}''':`, error);
    // Fallback to English if the requested language failed
    if (locale !== 'en') {
      try {
        console.warn(`[dictionaries.ts] Falling back to English common.json for lang '''${locale}'''.`);
        const fallbackModule = await import(`../../public/locales/en/common.json`);
        if (!fallbackModule || typeof fallbackModule.default !== 'object' || fallbackModule.default === null) {
          console.error(`[dictionaries.ts] Failed to load or parse FALLBACK English common.json. Module or default export is invalid:`, fallbackModule);
          throw new Error('Invalid fallback English dictionary structure.');
        }
        // Cache the fallback dictionary
        dictionaryCache[locale] = fallbackModule.default; // Cache it under the original failing locale
        console.log(`[dictionaries.ts] Successfully loaded and cached FALLBACK English common.json for originally requested locale: ${locale}`);
        return fallbackModule.default;
      } catch (fallbackError) {
        console.error('[dictionaries.ts] Error loading fallback English common.json:', fallbackError);
        throw new Error('Failed to load any common.json dictionary after fallback attempt.');
      }
    }
    throw error; // Re-throw original error if English also failed or was the original request
  }
};

export const getCommonDictionary = async (locale: string) => {
  console.log(`[dictionaries.ts] getCommonDictionary called for locale: ${locale}`);
  let t: Record<string, any> | undefined;
  try {
    t = await loadCommonJson(locale);
  } catch (error) {
    console.error(`[dictionaries.ts] getCommonDictionary: Error from loadCommonJson for locale '''${locale}''':`, error);
    // Return a very basic structure or rethrow to ensure consuming code doesn't hit secondary errors
    // For now, let's rethrow to make the failure obvious.
    // Alternatively, return a minimal dictionary: return { errorState: true, errorMessage: "Dictionary load failed" };
    throw error;
  }

  if (!t || typeof t !== 'object' || t === null) {
    console.error(`[dictionaries.ts] getCommonDictionary: loadCommonJson returned invalid data for locale '''${locale}'''. Received:`, t);
    // This case should ideally be caught by errors in loadCommonJson, but as a safeguard:
    throw new Error(`Dictionary for locale '''${locale}''' is null, undefined, or not an object.`);
  }

  console.log(`[dictionaries.ts] getCommonDictionary: Successfully retrieved 't' for locale '''${locale}'''. Keys:`, Object.keys(t).slice(0, 10)); // Log first 10 keys

  // Defensive checks before accessing specific properties
  const navigation = t.navigation && typeof t.navigation === 'object' ? t.navigation : {};
  const buttons = t.buttons && typeof t.buttons === 'object' ? t.buttons : {};
  const formLabels = t.formLabels && typeof t.formLabels === 'object' ? t.formLabels : {};
  const errors = t.errors && typeof t.errors === 'object' ? t.errors : {};

  return {
    navigation,
    buttons,
    formLabels,
    errors,
    // Spreading the whole common dictionary. Ensure 't' is a valid object.
    ...t
  };
};

export const getHomeDictionary = async (locale: string) => {
  console.log(`[dictionaries.ts] getHomeDictionary called for locale: ${locale}`);
  const t = await loadCommonJson(locale); // Assuming home translations are in common.json
  if (!t || typeof t !== 'object' || t === null) { // Safeguard
    console.error(`[dictionaries.ts] getHomeDictionary: common.json (t) is invalid for locale '''${locale}'''.`);
    return { title: 'Welcome (Error)', subtitle: 'Dictionary load failed.' };
  }
  return {
    title: t.home?.title || 'Welcome', // Accessing nested keys, ensure structure in common.json
    subtitle: t.home?.subtitle || 'Discover amazing features.',
  };
};

export const getLoginDictionary = async (locale: string) => {
  console.log(`[dictionaries.ts] getLoginDictionary called for locale: ${locale}`);
  const t = await loadCommonJson(locale); // Assuming login translations are in common.json
  if (!t || typeof t !== 'object' || t === null) { // Safeguard
    console.error(`[dictionaries.ts] getLoginDictionary: common.json (t) is invalid for locale '''${locale}'''.`);
    return { title: 'Login (Error)', subtitle: 'Dictionary load failed.', forgotPassword: '', noAccount: '' };
  }
  return {
    title: t.login?.title || 'Login',
    subtitle: t.login?.subtitle || 'Access your account',
    forgotPassword: t.login?.forgotPassword || 'Forgot Password?',
    noAccount: t.login?.noAccount || "Don't have an account?",
  };
};

// If you have other dictionary functions (e.g., getProfileDictionary)
// and they use translations from common.json, they would follow the same pattern:
// export const getProfileDictionary = async (locale: string) => {
//   const t = await loadCommonJson(locale);
//   return {
//     profileTitle: t.profile?.title || 'Your Profile',
//     // ... other profile specific translations from t.profile object in common.json
//   };
// }; 