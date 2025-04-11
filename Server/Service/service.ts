import { eq } from "drizzle-orm";
import db from "../Database/db";
import { users } from "../Database/db/schema";

const database = db();

export async function createUser(userId:string, username:string, email:string) {
    try {
        // First check if user already exists
        const existingUser = await database.query.users.findFirst({
            where: eq(users.id, userId)
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const user = await database.insert(users).values({
            id: userId,
            username: username,
            email: email,
            watchlist: []
        }).returning();

        return user[0];
    } catch (error) {
        console.error('Error in createUser service:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
        throw new Error('Failed to create user: Unknown error');
    }
}

export async function getUser(userId: string) {
    try {
        console.log('Attempting to get user with ID:', userId);
        
        const user = await database.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                id: true,
                username: true,
                email: true,
                watchlist: true
            }
        });

        if (!user) {
            console.log('No user found with ID:', userId);
        } else {
            console.log('Successfully retrieved user:', user.id);
        }

        return user;
    } catch (error) {
        console.error('Database error in getUser:', error);
        throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function updateStocks(userId: string, symbols: string[]) {
    if (!Array.isArray(symbols)) {
        throw new Error('Symbols must be an array');
    }

    const stock = await database.update(users)
        .set({
            watchlist: symbols
        })
        .where(eq(users.id, userId));
    
    return await getUser(userId);
}

