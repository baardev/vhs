#!/usr/bin/env node

// Simple script to initialize the logs file
const fs = require('fs');
const path = require('path');

const LOG_FILE_PATH = path.join('/tmp', 'backend-debug.log');

// Create the log file with a timestamp
const timestamp = new Date().toISOString();
const initialLogMessage = `[${timestamp}] Log file initialized\n`;

try {
  // Write the initial message
  fs.writeFileSync(LOG_FILE_PATH, initialLogMessage);
  console.log(`Log file initialized at ${LOG_FILE_PATH}`);
} catch (error) {
  console.error('Failed to initialize log file:', error);
  process.exit(1);
} 