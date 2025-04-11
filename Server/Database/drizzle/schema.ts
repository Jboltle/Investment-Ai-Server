import { pgTable, foreignKey, uuid, text, json, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().primaryKey().notNull(),
	email: text().notNull(),
	watchlist: json().default([]).notNull(),
	username: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [table.id],
			name: "users_id_users_id_fk"
		}).onDelete("cascade"),
]);
