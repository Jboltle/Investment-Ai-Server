"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const routes_1 = require("./Controller/routes");
const drizzle_orm_1 = require("drizzle-orm");
const app = (0, express_1.default)();
// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000', // Local development
    "https://investment-ai-client.vercel.app", // Production frontend URL
    'https://investment-ai-client-b3wgjtrmg-jboltles-projects.vercel.app', // Current preview URL
    'https://investment-ai-client-git-main-jboltles-projects.vercel.app', // Git main preview
];
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
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            callback(null, true);
            return;
        }
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        }
        else {
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
app.use((0, body_parser_1.json)());
// Error handling for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        console.error('JSON parsing error:', err);
        res.status(400).json({ error: 'Invalid JSON' });
        return;
    }
    next(err);
});
// Health check route - more detailed
app.get('/api/health', (req, res) => {
    console.log('Health check endpoint called');
    res.json({ "Status": "OK" });
});
// Test database connection route
app.get('/api/dbtest', async (req, res) => {
    try {
        const { default: db } = await Promise.resolve().then(() => __importStar(require('./Database/db')));
        const client = db();
        await client.execute((0, drizzle_orm_1.sql) `SELECT 1`);
        res.json({ status: 'Database connection successful' });
    }
    catch (error) {
        console.error('Database test failed:', error);
        res.status(500).json({
            error: 'Database connection failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// Mount the router
app.use('/api', routes_1.router);
// Global error handler
app.use((err, req, res) => {
    console.error('Error:', err);
    console.error('Stack trace:', err.stack);
    const errorResponse = {
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
}).on('error', (error) => {
    console.error('Failed to start server:', error);
    console.error('Error details:', {
        code: error.code,
        syscall: error.syscall,
        port: port,
        address: error.address
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
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception:', error);
    console.error('Stack trace:', error.stack);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
});
