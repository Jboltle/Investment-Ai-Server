"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUsersRelations = exports.usersRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const schema_1 = require("../db/schema");
exports.usersRelations = (0, relations_1.relations)(schema_1.users, ({ one }) => ({
    auth: one(schema_1.authUsers, {
        fields: [schema_1.users.id],
        references: [schema_1.authUsers.id],
    }),
}));
exports.authUsersRelations = (0, relations_1.relations)(schema_1.authUsers, ({ many }) => ({
    users: many(schema_1.users),
}));
