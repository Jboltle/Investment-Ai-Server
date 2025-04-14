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
exports.schema = void 0;
exports.default = db;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const schema = __importStar(require("./schema"));
exports.schema = schema;
// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
}
// Parse the DATABASE_URL to ensure IPv4
const dbUrl = new URL(process.env.DATABASE_URL);
// Extract the hostname without port
const hostname = dbUrl.hostname;
// Create a single Postgres client instance
const client = (0, postgres_1.default)(process.env.DATABASE_URL, {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
    prepare: false, // Disable prepared statements for Railway deployment
    connection: {
        application_name: 'investment-ai-server',
        keepalive: true,
        keepaliveInitialDelayMillis: 10000,
    },
    host: hostname, // Use the extracted hostname
    ssl: {
        rejectUnauthorized: false // Required for Railway's SSL connection
    },
    debug: (connection_id, str, args) => {
        console.log('Database debug:', { connection_id, str, args });
    },
    onnotice: (notice) => {
        console.log('Database notice:', notice);
    },
    onparameter: (parameterStatus) => {
        console.log('Database parameter changed:', parameterStatus);
    }
});
// Create a single Drizzle instance
const drizzleInstance = (0, postgres_js_1.drizzle)(client, { schema });
// Export a function that returns the singleton instance
function db() {
    return drizzleInstance;
}
// Handle unexpected errors
process.on('unhandledRejection', (err) => {
    console.error('Unhandled database promise rejection:', err);
});
// Handle process termination
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing database connections...');
    try {
        await client.end();
        console.log('Database connections closed');
    }
    catch (err) {
        console.error('Error closing database connections:', err);
    }
});
