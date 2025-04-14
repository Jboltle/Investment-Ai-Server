import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json } from "body-parser";
import { router } from "./Controller/routes";
import { sql } from 'drizzle-orm';

interface AppError extends Error {
  status?: number;
}

const app = express();

// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000',                     // Local development
    "https://investment-ai-client.vercel.app",   // Production frontend URL
    'https://investment-ai-client-b3wgjtrmg-jboltles-projects.vercel.app', // Current preview URL
    'https://investment-ai-client-git-main-jboltles-projects.vercel.app',  // Git main preview
]

// Always use environment PORT or 10000 as fallback
const port = parseInt(process.env.PORT || '10000', 10);
console.log('Starting server with configuration:', {
  port,
  env: process.env.NODE_ENV,
  allowedOrigins,
  databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
  nodeVersion: process.version,
  platform: process.platform
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Starting`);
  
  // Log request headers in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('Request headers:', req.headers);
  }

  // Log when the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
  });

  next();
});

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      callback(null, true);
      return;
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept',
    'Origin',
    'X-Requested-With',
    'X-Client-Info',
    'X-Supabase-Api-Version',
    'apikey'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Basic middleware for parsing JSON and handling errors
app.use(json());

// Error handling for JSON parsing
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError && 'body' in err) {
    console.error('JSON parsing error:', err);
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }
  next(err);
});

// Health check route - more detailed
app.get('/api/health', (req: Request, res: Response) => {
  console.log('Health check endpoint called');
  res.json({"Status": "OK"});
});

// Test database connection route
app.get('/api/dbtest', async (req: Request, res: Response) => {
  try {
    const { default: db } = await import('./Database/db');
    const client = db();
    await client.execute(sql`SELECT 1`);
    res.json({ status: 'Database connection successful' });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Mount the router
app.use('/api', router);

// Global error handler
app.use((err: AppError, req: Request, res: Response): void => {
  console.error('Error:', err);
  console.error('Stack trace:', err.stack);
  
  const errorResponse: {
    error: string;
    status: number;
    timestamp: Date;
    path: string;
    method: string;
    stack?: string;
  } = {
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
    timestamp: new Date(),
    path: req.path,
    method: req.method,
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
});

// Start server with error handling
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check available at http://localhost:${port}/api/health`);
  console.log(`Database test available at http://localhost:${port}/api/dbtest`);
  console.log('Allowed origins:', allowedOrigins);
}).on('error', (error: Error) => {
  console.error('Failed to start server:', error);
  console.error('Error details:', {
    code: (error as any).code,
    syscall: (error as any).syscall,
    port: port,
    address: (error as any).address
  });
  process.exit(1);
});

// Handle various process events
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught exception:', error);
  console.error('Stack trace:', error.stack);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});