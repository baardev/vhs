/**
 * @module dictionaries
 * @description Internationalization module for the Open Handicap System.
 * 
 * This module provides a robust translation system for the application, handling:
 * - Loading and caching of locale-specific dictionaries
 * - Intelligent fallback to English when translations are missing
 * - Timeout protection for dictionary loading operations
 * - Error handling with graceful fallbacks
 * 
 * The module implements a defensive approach to internationalization, ensuring
 * that the application never crashes due to missing or invalid translations.
 * Dictionary entries are accessed with optional chaining to prevent runtime errors.
 * 
 * @calledBy
 * - Page components throughout the application
 * - Layout components requiring translations
 * - UI components with text content
 * - Error handling systems requiring localized messages
 * 
 * @calls
 * - Dynamic imports of JSON translation files
 * - Browser's localStorage API (via caching mechanism)
 * 
 * @requires
 * - JSON translation files in /public/locales/{locale}/common.json
 * - At minimum, an English (en) translation file as fallback
 * - Proper locale parameter being passed from page components
 */

// import { getTranslations } from '../i18n'; // REMOVED

// Create a cache for dictionaries to avoid reloading the same dictionary multiple times
const dictionaryCache: Record<string, Record<string, any>> = {};

// Add timeout functionality for dictionary loading
const loadWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number = 3000): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Dictionary loading timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    // Race between the actual promise and the timeout
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

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
    // Dynamically import the common.json for the given locale with a timeout
    const importPromise = import(`../../public/locales/${locale}/common.json`);
    const module = await loadWithTimeout(importPromise);
    
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
        const fallbackImportPromise = import(`../../public/locales/en/common.json`);
        const fallbackModule = await loadWithTimeout(fallbackImportPromise);
        
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
        // Return minimal dictionary instead of throwing
        return createFallbackDictionary();
      }
    }
    // Return minimal dictionary instead of throwing
    return createFallbackDictionary();
  }
};

// Create a minimal fallback dictionary with essential keys
const createFallbackDictionary = () => {
  return {
    navigation: {
      home: 'Home',
      courses: 'Courses',
      dashboard: 'Dashboard',
      login: 'Login',
      register: 'Register'
    },
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel'
    },
    formLabels: {
      username: 'Username',
      email: 'Email',
      password: 'Password'
    },
    errors: {
      general: 'An error occurred'
    },
    login: {
      title: 'Sign in to OHS',
      forgotPassword: 'Forgot Password?',
      noAccount: "Don't have an account?"
    },
    home: {
      title: 'Welcome',
      subtitle: 'A free alternative to expensive handicapping services'
    }
  };
};

export const getCommonDictionary = async (locale: string) => {
  console.log(`[dictionaries.ts] getCommonDictionary called for locale: ${locale}`);
  let t: Record<string, any> | undefined;
  try {
    t = await loadCommonJson(locale);
  } catch (error) {
    console.error(`[dictionaries.ts] getCommonDictionary: Error from loadCommonJson for locale '''${locale}''':`, error);
    return createFallbackDictionary();
  }

  if (!t || typeof t !== 'object' || t === null) {
    console.error(`[dictionaries.ts] getCommonDictionary: loadCommonJson returned invalid data for locale '''${locale}'''. Received:`, t);
    return createFallbackDictionary();
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
  try {
    const t = await loadCommonJson(locale); // Assuming home translations are in common.json
    return {
      title: t.home?.title || 'Welcome',
      subtitle: t.home?.subtitle || 'A free alternative to expensive handicapping services',
    };
  } catch (error) {
    console.error(`[dictionaries.ts] getHomeDictionary error:`, error);
    return { 
      title: 'Welcome', 
      subtitle: 'A free alternative to expensive handicapping services' 
    };
  }
};

export const getLoginDictionary = async (locale: string) => {
  console.log(`[dictionaries.ts] getLoginDictionary called for locale: ${locale}`);
  try {
    const t = await loadCommonJson(locale); // Assuming login translations are in common.json
    return {
      title: t.login?.title || 'Login',
      subtitle: t.login?.subtitle || 'Access your account',
      forgotPassword: t.login?.forgotPassword || 'Forgot Password?',
      noAccount: t.login?.noAccount || "Don't have an account?",
    };
  } catch (error) {
    console.error(`[dictionaries.ts] getLoginDictionary error:`, error);
    return { 
      title: 'Login', 
      subtitle: 'Access your account', 
      forgotPassword: 'Forgot Password?', 
      noAccount: "Don't have an account?" 
    };
  }
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