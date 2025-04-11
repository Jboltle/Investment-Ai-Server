"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = exports.usersRelations = exports.users = exports.authUsers = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
// Reference to Supabase auth schema (this is the built-in auth schema)
const authSchema = (0, pg_core_1.pgSchema)("auth");
exports.authUsers = authSchema.table("users", {
    id: (0, pg_core_1.uuid)("id").primaryKey(),
    email: (0, pg_core_1.text)("email"),
    // Other Supabase auth fields
});
// Your public schema users table
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)("id")
        .primaryKey()
        .references(() => exports.authUsers.id, { onDelete: "cascade" })
        .notNull(),
    username: (0, pg_core_1.text)("username").notNull(),
    email: (0, pg_core_1.text)("email").notNull(),
    watchlist: (0, pg_core_1.json)("watchlist").$type().default([]).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
});
// Define relations
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    auth: one(exports.authUsers, {
        fields: [exports.users.id],
        references: [exports.authUsers.id],
    })
}));
exports.schema = {
    users: exports.users,
    authUsers: exports.authUsers,
};
