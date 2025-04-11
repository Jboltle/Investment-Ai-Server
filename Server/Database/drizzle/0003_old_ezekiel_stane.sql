CREATE TABLE "auth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"watchlist" json DEFAULT '[]'::json NOT NULL,
	CONSTRAINT "auth_email_unique" UNIQUE("email")
);
