// backend/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import newsRouter from './routes/news';


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Route handlers
// Mount news router at the correct path
app.use('/', newsRouter);

// Other routes
app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from VHS backend!');
});

app.get('/api', (req: Request, res: Response) => {
  res.send('API is working');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Backend is healthy!' });
});

// Start server
app.listen(port, () => {
  console.log(`VHS backend listening at http://localhost:${port}`);
});


