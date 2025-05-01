import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// Completely disable HMR
process.env.NEXT_DISABLE_HMR = '1';
process.env.FAST_REFRESH = 'false';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Prepare Next.js app with HMR disabled
const app = next({ 
  dev, 
  hostname, 
  port,
  conf: {
    onDemandEntries: {
      // Disable on-demand entries
      maxInactiveAge: 0,
      pagesBufferLength: 0,
    }
  }
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Disable HMR endpoint completely
      const parsedUrl = parse(req.url, true);
      if (parsedUrl.pathname === '/_next/webpack-hmr') {
        res.statusCode = 404;
        res.end('HMR disabled');
        return;
      }
      
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}); 