import { relations } from "drizzle-orm";
import {
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  json
} from "drizzle-orm/pg-core";

// Reference to Supabase auth schema (this is the built-in auth schema)
const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
  // Other Supabase auth fields
});

// Your public schema users table
export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" })
    .notNull(),
  username: text("username").notNull(),
  email: text("email").notNull(),
  watchlist: json("watchlist").$type<string[]>().default([]).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one }) => ({
  auth: one(authUsers, {
    fields: [users.id],
    references: [authUsers.id],
  })
}));

export const schema = {
  users,
  authUsers,
} as const;


