/*
 * @module i18n
 * @description Core internationalization configuration for the Open Handicap System.
 * 
 * This module defines the supported languages and default locale for the application.
 * It provides essential internationalization constants used throughout the system
 * for language detection, routing, and fallback handling.
 * 
 * @calledBy
 * - Language-specific layout components
 * - Routing configuration
 * - Dictionary loading utilities
 * 
 * @requires
 * - Corresponding language files in the locales directory
 */

/*
 * @constant locales
 * @description Array of supported language codes in the application.
 * These ISO 639-1 language codes represent all languages that have
 * translation resources available.
 */
export const locales = ['en', 'es', 'zh', 'ru', 'he'];

/*
 * @constant defaultLocale
 * @description The fallback language code used when a requested locale
 * is not available or when no specific locale is requested.
 */
export const defaultLocale = 'en';
