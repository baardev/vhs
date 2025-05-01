// Script to disable HMR for Next.js

// Set environment variables to disable HMR
process.env.FAST_REFRESH = 'false';
process.env.NEXT_DISABLE_HMR = '1';

console.log('🚫 Hot Module Replacement (HMR) has been disabled');
console.log('🔧 Fast Refresh has been disabled');

// Continue with normal execution by spawning next process
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextBin = resolve(__dirname, 'node_modules/.bin/next');
const args = process.argv.slice(2);

const nextProcess = spawn(nextBin, args, { 
  stdio: 'inherit',
  env: process.env
});

nextProcess.on('close', (code) => {
  process.exit(code);
}); 