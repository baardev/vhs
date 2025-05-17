/**
 * @module types
 * @description Global type declarations for the Open Handicap System application.
 * 
 * This module defines TypeScript type extensions and global interfaces that are
 * available throughout the application. It includes:
 * - Extensions to browser global objects (Window)
 * - Custom utility types used across multiple components
 * - Type augmentations for third-party libraries
 * 
 * These declarations ensure type safety and provide proper autocompletion
 * for custom global functions and properties.
 * 
 * @requires
 * - TypeScript configuration
 * - tsconfig.json with declaration files enabled
 */

export {};

declare global {
  /**
   * @interface Window
   * @description Extension of the browser's Window interface to include custom global functions.
   * 
   * This interface augmentation adds utility functions that are accessible globally
   * through the window object, enabling consistent logging and debugging across
   * the entire application.
   * 
   * @property {Function} logMessage - A globally available logging utility function.
   */
  interface Window {
    /**
     * @function logMessage
     * @description Logs a message to the console with a standardized format.
     * 
     * This function provides a consistent logging format by prefixing all messages
     * with "[LOG]:" for easy filtering and identification in browser dev tools.
     * 
     * @param {string} msg - The message to log to the console
     * @returns {void}
     */
    logMessage: (msg: string) => void;
  }
} 