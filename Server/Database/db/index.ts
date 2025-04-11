import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

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
const client = postgres(process.env.DATABASE_URL, {
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
const drizzleInstance = drizzle(client, { schema });

// Export a function that returns the singleton instance
export default function db() {
    return drizzleInstance;
}

// Handle unexpected errors
process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled database promise rejection:', err);
});

// Handle process termination
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing database connections...');
    try {
        await client.end();
        console.log('Database connections closed');
    } catch (err) {
        console.error('Error closing database connections:', err);
    }
});

export { schema };

