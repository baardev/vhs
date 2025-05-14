/**
 * @fileoverview Routes for managing and viewing backend log files.
 *
 * @remarks
 * This module defines API endpoints to interact with a backend log file (`/tmp/backend-debug.log`).
 * It allows for:
 * - Viewing all logs.
 * - Adding new log entries via POST requests.
 * - Clearing the log file.
 * - Searching logs with a query parameter.
 * - A test endpoint to add a sample log entry.
 * The log file is initialized if it doesn't exist upon module load or first access.
 * Note: Many route handlers currently use `@ts-ignore` to bypass TypeScript errors, which should be addressed.
 *
 * Called by:
 * - `backend/src/index.ts`
 *
 * Calls:
 * - `express` (external library)
 * - `fs` (Node.js built-in module - for reading, writing, and checking existence of the log file)
 * - `path` (Node.js built-in module - for constructing the log file path)
 */
import * as express from 'express';
import fs from 'fs';
import path from 'path';

const router: express.Router = express.Router();
const LOG_FILE_PATH = path.join('/tmp', 'backend-debug.log');

// Initialize log file if it doesn't exist
try {
  if (!fs.existsSync(LOG_FILE_PATH)) {
    const timestamp = new Date().toISOString();
    const initialLogMessage = `[${timestamp}] Log file initialized\n`;
    fs.writeFileSync(LOG_FILE_PATH, initialLogMessage);
    console.log(`Log file initialized at ${LOG_FILE_PATH}`);
  }
} catch (error) {
  console.error('Failed to initialize log file:', error);
}

// View all logs
router.get('/', ((req, res) => {
  try {
    // Make sure the file exists
    if (!fs.existsSync(LOG_FILE_PATH)) {
      const timestamp = new Date().toISOString();
      const initialLogMessage = `[${timestamp}] Log file initialized\n`;
      fs.writeFileSync(LOG_FILE_PATH, initialLogMessage);
    }
    
    const logs = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    res.set('Content-Type', 'text/plain');
    return res.send(logs);
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      error: 'No logs found or unable to read log file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}) as unknown as express.RequestHandler);

// Add a log entry via HTTP request
router.post('/', ((req, res) => {
  try {
    const { message, level = 'info', source = 'api' } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }
    
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${source}] [${level}] ${message}\n`;
    
    fs.appendFileSync(LOG_FILE_PATH, formattedMessage);
    
    return res.json({ 
      success: true, 
      message: 'Log entry added' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}) as unknown as express.RequestHandler);

// Clear logs
router.delete('/', ((req, res) => {
  try {
    fs.writeFileSync(LOG_FILE_PATH, '');
    return res.json({ 
      success: true, 
      message: 'Log file cleared' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}) as unknown as express.RequestHandler);

// Search logs
router.get('/search', ((req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Search query is required' 
      });
    }
    
    const logs = fs.readFileSync(LOG_FILE_PATH, 'utf8');
    const lines = logs.split('\n').filter((line: string) => 
      line.toLowerCase().includes(String(query).toLowerCase())
    );
    
    res.set('Content-Type', 'text/plain');
    return res.send(lines.join('\n'));
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}) as unknown as express.RequestHandler);

// Test endpoint
router.get('/test', ((req, res) => {
  const timestamp = new Date().toISOString();
  const testMessage = `[${timestamp}] Test log message\n`;
  
  try {
    fs.appendFileSync(LOG_FILE_PATH, testMessage);
    return res.json({
      success: true,
      message: 'Test log entry added',
      logPath: LOG_FILE_PATH
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}) as unknown as express.RequestHandler);

export default router;
