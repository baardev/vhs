/**
 * @fileoverview Universal logger client for isomorphic applications.
 *
 * @description This module provides a flexible logging utility that can be used on both the
 * server-side and client-side. 
 * - On the server (when `window` is undefined), it logs messages directly to a local file
 *   (`/tmp/backend-debug.log`) and to the console.
 * - On the client, it sends log messages to a backend API endpoint (`/api/logs` by default,
 *   configurable via `process.env.API_URL`) using an HTTP POST request via `axios`.
 *
 * It exports a main `log` function and several convenience functions (`logInfo`, `logWarning`,
 * `logError`, `logDebug`) for different log levels.
 *
 * @module utils/loggerClient
 *
 * @requires axios - External library for making HTTP requests (client-side logging).
 * @requires fs - Node.js built-in file system module (server-side file logging).
 * @requires path - Node.js built-in path module (server-side file logging).
 * @requires process.env - Node.js global for accessing `API_URL` environment variable.
 *
 * @remarks
 * - The server-side log file path is hardcoded to `/tmp/backend-debug.log`.
 * - The client-side logging relies on the `/api/logs` endpoint (see `backend/src/routes/logs.ts`)
 *   being available and correctly configured.
 * - This module is currently not actively imported or used by other modules based on the last codebase scan.
 *   If intended for wider use, ensure it is integrated where logging is needed.
 */
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const LOG_FILE_PATH = path.join('/tmp', 'backend-debug.log');
const IS_SERVER = typeof window === 'undefined';
const API_URL = process.env.API_URL || 'http://localhost:4000/api/logs'; // Use environment variable if available

// Direct file logging for server-side to avoid self-referential API calls
function appendToLogFile(message: string): void {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] ${message}\n`;
  
  try {
    fs.appendFileSync(LOG_FILE_PATH, formattedMessage);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

export async function log(message: string, level: string = 'info', source: string = 'server') {
  const formattedMessage = `[${source}] [${level}] ${message}`;
  
  // For server-side, log directly to file
  if (IS_SERVER) {
    appendToLogFile(formattedMessage);
    console.log(formattedMessage); // Also log to console
    return true;
  }
  
  // For client-side, make an API call
  try {
    await axios.post(API_URL, {
      message,
      level,
      source
    });
    return true;
  } catch (error) {
    console.error('Failed to log to API:', error);
    return false;
  }
}

// Convenience methods for different log levels
export const logInfo = (message: string, source?: string) => log(message, 'info', source);
export const logWarning = (message: string, source?: string) => log(message, 'warning', source);
export const logError = (message: string, source?: string) => log(message, 'error', source);
export const logDebug = (message: string, source?: string) => log(message, 'debug', source);
