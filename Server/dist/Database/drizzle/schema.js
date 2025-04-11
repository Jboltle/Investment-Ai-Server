"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.uuid)().primaryKey().notNull(),
    email: (0, pg_core_1.text)().notNull(),
    watchlist: (0, pg_core_1.json)().default([]).notNull(),
    username: (0, pg_core_1.text)().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.foreignKey)({
        columns: [table.id],
        foreignColumns: [table.id],
        name: "users_id_users_id_fk"
    }).onDelete("cascade"),
]);
