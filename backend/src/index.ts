// backend/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import newsRouter from './routes/news';
import randomQuoteRouter from './routes/randomQuote';
import coursesRouter from './routes/courses';
import adminRouter from './routes/admin';
import handicapCalcRouter from './routes/handicapCalc';
import logsRouter from './routes/logs';
import playerCardsRouter from './routes/playerCards';
import coursesDataRouter from './routes/coursesData';


// Load environment variables
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`
# robots.txt for VHS website API
User-agent: *
Allow: /health
Allow: /api/health
Disallow: /api/
Disallow: /
`);
});

// Route handlers
// Mount news router at the correct path
app.use('/', newsRouter);

// Other routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/handicap-calc', handicapCalcRouter);
app.use('/api/logs', logsRouter);
app.use('/api', randomQuoteRouter);
app.use('/api', playerCardsRouter);
app.use('/api', coursesDataRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from VHS backend!');
});

app.get('/api', (req: Request, res: Response) => {
  res.send('API is working');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Backend is healthy!' });
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Global error handler middleware (must be after all routes)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`VHS backend listening at http://0.0.0.0:${port}`);
});

// Handle server errors
server.on('error', (error: NodeJS.ErrnoException) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error);
  // Give the server some time to send any pending responses before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Continue running, but log the error
});

export { app };


