import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1);
}

// Create a single Postgres client instance
const client = postgres(process.env.DATABASE_URL, {
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Idle connection timeout in seconds
  connect_timeout: 10, // Connection timeout in seconds
  prepare: false, // Disable prepared statements for Railway deployment
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

export { schema };

