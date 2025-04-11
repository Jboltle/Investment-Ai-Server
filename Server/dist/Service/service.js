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
    const user = await database.insert(schema_1.users).values({
        id: userId,
        username: username,
        email: email,
        watchlist: []
    });
    return user;
}
async function getUser(userId) {
    const user = await database.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.id, userId),
        columns: {
            id: true,
            username: true,
            email: true,
            watchlist: true
        }
    });
    return user;
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
