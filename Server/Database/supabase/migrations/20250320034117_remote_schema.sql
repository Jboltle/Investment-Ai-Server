revoke delete on table "public"."auth" from "anon";

revoke insert on table "public"."auth" from "anon";

revoke references on table "public"."auth" from "anon";

revoke select on table "public"."auth" from "anon";

revoke trigger on table "public"."auth" from "anon";

revoke truncate on table "public"."auth" from "anon";

revoke update on table "public"."auth" from "anon";

revoke delete on table "public"."auth" from "authenticated";

revoke insert on table "public"."auth" from "authenticated";

revoke references on table "public"."auth" from "authenticated";

revoke select on table "public"."auth" from "authenticated";

revoke trigger on table "public"."auth" from "authenticated";

revoke truncate on table "public"."auth" from "authenticated";

revoke update on table "public"."auth" from "authenticated";

revoke delete on table "public"."auth" from "service_role";

revoke insert on table "public"."auth" from "service_role";

revoke references on table "public"."auth" from "service_role";

revoke select on table "public"."auth" from "service_role";

revoke trigger on table "public"."auth" from "service_role";

revoke truncate on table "public"."auth" from "service_role";

revoke update on table "public"."auth" from "service_role";

alter table "public"."auth" drop constraint "auth_email_unique";

alter table "public"."users" drop constraint "users_email_unique";

alter table "public"."auth" drop constraint "auth_pkey";

drop index if exists "public"."auth_email_unique";

drop index if exists "public"."auth_pkey";

drop index if exists "public"."users_email_unique";

drop table "public"."auth";

alter table "public"."users" add column "created_at" timestamp without time zone not null default now();

alter table "public"."users" alter column "email" set data type text using "email"::text;

alter table "public"."users" alter column "id" drop default;

alter table "public"."users" alter column "username" set data type text using "username"::text;

alter table "public"."users" add constraint "users_id_users_id_fk" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_users_id_fk";


