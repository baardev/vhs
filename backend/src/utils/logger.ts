/**
 * @fileoverview Simple file-based logging utility for the backend.
 *
 * @description This module provides a basic `logToFile` function that appends messages
 * to a specified log file (`/tmp/backend-debug.log` within the container).
 * It handles timestamps, converts JavaScript objects to JSON strings for logging,
 * and includes a fallback to `console.error` if file writing fails.
 * The logging is synchronous to maintain simplicity.
 *
 * @module utils/logger
 *
 * @requires fs - Node.js built-in file system module for writing to the log file.
 * @requires path - Node.js built-in path module for constructing the log file path.
 *
 * @remarks
 * - The log file path is hardcoded to `/tmp/backend-debug.log`.
 * - This logger is currently a standalone utility. If it were to be used more broadly,
 *   consider making the log path configurable or integrating with a more robust logging library.
 * - Related functionality for managing and viewing this log file via API endpoints
 *   can be found in `backend/src/routes/logs.ts`.
 */
import fs from 'fs';
import path from 'path';

// Set the log file path to somewhere in your container that's writable
const LOG_FILE_PATH = path.join('/tmp', 'backend-debug.log');

export function logToFile(message: any): void {
  const timestamp = new Date().toISOString();
  let logMessage: string;
  
  // Convert objects to readable format
  if (typeof message === 'object') {
    try {
      logMessage = JSON.stringify(message, null, 2);
    } catch (err) {
      logMessage = `[Object conversion failed]: ${message}`;
    }
  } else {
    logMessage = String(message);
  }
  
  // Format with timestamp
  const formattedMessage = `[${timestamp}] ${logMessage}\n`;
  
  // Append to log file (synchronous to avoid complexity)
  try {
    fs.appendFileSync(LOG_FILE_PATH, formattedMessage);
  } catch (error) {
    // Fallback to console if file writing fails
    console.error('Failed to write to log file:', error);
    console.log(formattedMessage);
  }
} 