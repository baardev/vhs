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
