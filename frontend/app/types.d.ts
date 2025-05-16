/**
 * Global type declarations for the application
 */

export {};

declare global {
  interface Window {
    logMessage: (msg: string) => void;
  }
} 