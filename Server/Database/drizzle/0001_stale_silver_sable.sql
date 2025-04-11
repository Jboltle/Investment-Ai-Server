ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "stocks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user_stocks" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "news" CASCADE;--> statement-breakpoint
DROP TABLE "stocks" CASCADE;--> statement-breakpoint
DROP TABLE "user_stocks" CASCADE;--> statement-breakpoint
ALTER TABLE "users" RENAME TO "auth.users";--> statement-breakpoint
ALTER TABLE "auth.users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
ALTER TABLE "auth.users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "auth.users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "auth.users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "auth.users" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "auth.users" ADD COLUMN "watchlist" json DEFAULT '[]'::json NOT NULL;--> statement-breakpoint
ALTER TABLE "auth.users" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "auth.users" ADD CONSTRAINT "auth.users_email_unique" UNIQUE("email");