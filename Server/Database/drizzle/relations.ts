import { relations } from "drizzle-orm/relations";
import { users, authUsers } from "../db/schema";

export const usersRelations = relations(users, ({ one }) => ({
	auth: one(authUsers, {
		fields: [users.id],
		references: [authUsers.id],
	}),
}));

export const authUsersRelations = relations(authUsers, ({ many }) => ({
	users: many(users),
}));