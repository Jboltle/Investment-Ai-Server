import express, { Request, Response } from "express";
import cors from "cors";
import { json } from "body-parser";
import { router } from "./Controller/routes";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:3000',                     // Local development
  'https://investment-ai-client.vercel.app',   // Production frontend URL
  process.env.NEXT_PUBLIC_URL,                 // Dynamic URL from env
];

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
    console.log('Incoming request from origin:', origin);
    console.log('Allowed origins:', allowedOrigins);
    
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log('CORS rejection for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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
  res.status(500).json({ error: 'Internal Server Error' });
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