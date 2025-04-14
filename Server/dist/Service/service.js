"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUser = getUser;
exports.updateStocks = updateStocks;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = __importDefault(require("../Database/db"));
const schema_1 = require("../Database/db/schema");
const database = (0, db_1.default)();
async function createUser(userId, username, email) {
    try {
        // First check if user already exists
        const existingUser = await database.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId)
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await database.insert(schema_1.users).values({
            id: userId,
            username: username,
            email: email,
            watchlist: []
        }).returning();
        return user[0];
    }
    catch (error) {
        console.error('Error in createUser service:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
        throw new Error('Failed to create user: Unknown error');
    }
}
async function getUser(userId) {
    try {
        console.log('Attempting to get user with ID:', userId);
        const user = await database.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
            columns: {
                id: true,
                username: true,
                email: true,
                watchlist: true
            }
        });
        if (!user) {
            console.log('No user found with ID:', userId);
        }
        else {
            console.log('Successfully retrieved user:', user.id);
        }
        return user;
    }
    catch (error) {
        console.error('Database error in getUser:', error);
        throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function updateStocks(userId, symbols) {
    if (!Array.isArray(symbols)) {
        throw new Error('Symbols must be an array');
    }
    const stock = await database.update(schema_1.users)
        .set({
        watchlist: symbols
    })
        .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
    return await getUser(userId);
}
