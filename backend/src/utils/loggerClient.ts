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
