"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    dbCredentials: {
        url: process.env.DATABASE_URL,
        // host: "aws-0-us-east-2.pooler.supabase.com",
        // port: 6543,
        // database: "investment-ai",
        // user: "postgres.ausydguaxrvhilspunoz",
        // password: process.env.SUPABASE_PASSWORD!,
        // ssl: "allow",
    },
    out: "./drizzle"
});
