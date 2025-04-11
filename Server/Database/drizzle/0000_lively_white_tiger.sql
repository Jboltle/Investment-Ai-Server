CREATE TABLE "news" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"symbol" varchar NOT NULL,
	"datetime" timestamp NOT NULL,
	"val_at_posting" numeric(10, 2) NOT NULL,
	"val_at_close" numeric(10, 2) NOT NULL,
	"change_percentage" numeric(5, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stocks" (
	"symbol" text PRIMARY KEY NOT NULL,
	"current_val" numeric(10, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_stocks" (
	"user_id" integer NOT NULL,
	"stock_id" text NOT NULL,
	CONSTRAINT "user_stocks_user_id_stock_id_pk" PRIMARY KEY("user_id","stock_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "news" ADD CONSTRAINT "news_symbol_stocks_symbol_fk" FOREIGN KEY ("symbol") REFERENCES "public"."stocks"("symbol") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stocks" ADD CONSTRAINT "user_stocks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_stocks" ADD CONSTRAINT "user_stocks_stock_id_stocks_symbol_fk" FOREIGN KEY ("stock_id") REFERENCES "public"."stocks"("symbol") ON DELETE cascade ON UPDATE no action;