import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { json } from "body-parser";
import { router } from "./Controller/routes";
import { sql } from 'drizzle-orm';

interface AppError extends Error {
  status?: number;
}

const app = express();

// Define allowed origins without paths
const allowedOrigins = [
    'http://localhost:3000',
    'https://investment-ai-client.vercel.app',
    'https://investment-ai-client-b3wgjtrmg-jboltles-projects.vercel.app',
    'https://investment-ai-client-git-main-jboltles-projects.vercel.app',
    'https://investment-ai-client-git-watchlist-aut-75a255-jboltles-projects.vercel.app',
    'https://investment-ai-server-production.up.railway.app'
];

// Log configuration on startup
console.log('Starting server with configuration:', {
    port: process.env.PORT || '10000',
    env: process.env.NODE_ENV,
    allowedOrigins,
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    nodeVersion: process.version,
    platform: process.platform
});

// CORS configuration - must be before other middleware
app.use(cors({
    origin: function(origin, callback) {
        console.log('Incoming request from origin:', origin);
        console.log('Allowed origins:', allowedOrigins);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('No origin provided, allowing request');
            callback(null, true);
            return;
        }

        // Allow all origins in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode, allowing all origins');
            callback(null, true);
            return;
        }

        // Debug: Log exact comparison results
        allowedOrigins.forEach(allowedOrigin => {
            console.log(`Comparing origin "${origin}" with allowed origin "${allowedOrigin}"`);
            console.log(`Direct comparison (===): ${origin === allowedOrigin}`);
            console.log(`Includes check: ${origin.includes(allowedOrigin)}`);
            console.log(`Trim comparison: ${origin.trim() === allowedOrigin.trim()}`);
        });

        // Check if origin is allowed - try multiple matching strategies
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            // Try exact match first
            if (origin === allowedOrigin) return true;
            
            // Try trimmed match
            if (origin.trim() === allowedOrigin.trim()) return true;
            
            // Try case-insensitive match
            if (origin.toLowerCase() === allowedOrigin.toLowerCase()) return true;
            
            return false;
        });

        console.log(`Origin ${origin} is ${isAllowed ? 'allowed' : 'not allowed'}`);

        if (isAllowed) {
            // Important: Use the actual origin in the response header
            callback(null, true);
        } else {
            console.warn(`Blocked request from unauthorized origin: ${origin}`);
            console.warn('Expected one of:', allowedOrigins);
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
        'apikey',
        'Cookie',
        'Set-Cookie'
    ],
    exposedHeaders: [
        'Content-Range', 
        'X-Content-Range',
        'Set-Cookie'
    ],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Cookie middleware configuration
app.use((req: Request, res: Response, next: NextFunction) => {
    // Set secure cookie policy
    res.cookie('cookieName', 'cookieValue', {
        secure: true, // Requires HTTPS
        sameSite: 'none', // Allow cross-site cookie
        httpOnly: true, // Cannot be accessed by client-side scripts
        path: '/'
    });
    next();
});

// Basic middleware for parsing JSON
app.use(json());

// Request logging middleware - after CORS
app.use((req, res, next) => {
    const start = Date.now();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Starting`);
    console.log('Request headers:', req.headers);

    // Log response details
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
        console.log('Response headers:', res.getHeaders());
    });

    next();
});

// Error handling for JSON parsing
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('JSON parsing error:', err);
        res.status(400).json({ error: 'Invalid JSON' });
        return;
    }
    next(err);
});

// Health check route
app.get('/api/health', (req: Request, res: Response) => {
    console.log('Health check endpoint called');
    res.json({ "status": "OK", "timestamp": new Date().toISOString() });
});

// CORS test endpoint
app.get('/api/cors-test', (req: Request, res: Response) => {
    try {
        console.log('CORS test endpoint called');
        console.log('Request headers:', JSON.stringify(req.headers, null, 2));
        console.log('Origin:', req.headers.origin);
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        
        res.json({
            status: 'OK',
            origin: req.headers.origin,
            timestamp: new Date().toISOString(),
            headers: req.headers,
            allowedOrigins: allowedOrigins
        });
    } catch (error) {
        console.error('Error in CORS test endpoint:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: process.env.NODE_ENV !== 'production' ? (error instanceof Error ? error.stack : undefined) : undefined
        });
    }
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

// Global error handler - must be last
app.use((err: AppError, req: Request, res: Response, next: NextFunction): void => {
    console.error('Global Error Handler');
    console.error('Error:', err);
    console.error('Stack trace:', err.stack);
    console.error('Request URL:', req.url);
    console.error('Request Method:', req.method);
    console.error('Request Headers:', JSON.stringify(req.headers, null, 2));

    // Ensure CORS headers are set even in error cases
    const origin = req.headers.origin;
    if (origin) {
        console.log('Setting CORS headers for origin:', origin);
        const isAllowed = allowedOrigins.includes(origin);
        console.log('Origin is allowed:', isAllowed);
        
        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Credentials', 'true');
        }
    }
    
    const errorResponse = {
        error: err.message || 'Internal Server Error',
        status: err.status || 500,
        timestamp: new Date().toISOString(),
        path: req.path,
        method: req.method,
        stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
        headers: req.headers,
        origin: req.headers.origin
    };

    console.log('Sending error response:', JSON.stringify(errorResponse, null, 2));
    res.status(errorResponse.status).json(errorResponse);
});

// Start server
const port = parseInt(process.env.PORT || '10000', 10);
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Health check available at http://localhost:${port}/api/health`);
    console.log(`Database test available at http://localhost:${port}/api/dbtest`);
}).on('error', (error: Error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

// Handle process events
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