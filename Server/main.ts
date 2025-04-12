import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { router } from "./Controller/routes";

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',                     // Local development
  'https://investment-ai-client.vercel.app',   // Production frontend URL
  'https://investment-ai-client-b3wgjtrmg-jboltles-projects.vercel.app', // Current preview URL
  'https://investment-ai-client-git-main-jboltles-projects.vercel.app',  // Git main preview
].filter(Boolean);

// Always use environment PORT or 10000 as fallback
const port = parseInt(process.env.PORT || '10000', 10);
console.log('Starting server with configuration:', {
  port,
  env: process.env.NODE_ENV,
  allowedOrigins
});

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    console.log('Request origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('No origin provided, allowing request');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('Origin not in allowed list:', origin);
      console.log('Allowed origins:', allowedOrigins);
      // Still allow the request but log it
      callback(null, true);
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

// Add CORS headers to all responses
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // If origin is not in allowed list, still allow for development
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(json());
app.use('/api', router);

// Simple test route
app.get('/api/health', (req: Request, res: Response) => {
  console.log('Health check endpoint called');
  res.json({ status: 'ok', message: 'Server is running' });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  
  // Set CORS headers on error responses too
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Health check available at http://localhost:${port}/api/health`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});