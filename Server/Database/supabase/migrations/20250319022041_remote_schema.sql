revoke delete on table "public"."auth.users" from "anon";

revoke insert on table "public"."auth.users" from "anon";

revoke references on table "public"."auth.users" from "anon";

revoke select on table "public"."auth.users" from "anon";

revoke trigger on table "public"."auth.users" from "anon";

revoke truncate on table "public"."auth.users" from "anon";

revoke update on table "public"."auth.users" from "anon";

revoke delete on table "public"."auth.users" from "authenticated";

revoke insert on table "public"."auth.users" from "authenticated";

revoke references on table "public"."auth.users" from "authenticated";

revoke select on table "public"."auth.users" from "authenticated";

revoke trigger on table "public"."auth.users" from "authenticated";

revoke truncate on table "public"."auth.users" from "authenticated";

revoke update on table "public"."auth.users" from "authenticated";

revoke delete on table "public"."auth.users" from "service_role";

revoke insert on table "public"."auth.users" from "service_role";

revoke references on table "public"."auth.users" from "service_role";

revoke select on table "public"."auth.users" from "service_role";

revoke trigger on table "public"."auth.users" from "service_role";

revoke truncate on table "public"."auth.users" from "service_role";

revoke update on table "public"."auth.users" from "service_role";

alter table "public"."auth.users" drop constraint "auth.users_email_unique";

alter table "public"."auth.users" drop constraint "auth.users_pkey";

drop index if exists "public"."auth.users_email_unique";

drop index if exists "public"."auth.users_pkey";

drop table "public"."auth.users";

create table "public"."users" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying(255) not null,
    "watchlist" json not null default '[]'::json,
    "username" character varying(255) not null
);


CREATE UNIQUE INDEX users_email_unique ON public.users USING btree (email);

CREATE UNIQUE INDEX "auth.users_pkey" ON public.users USING btree (id);

alter table "public"."users" add constraint "auth.users_pkey" PRIMARY KEY using index "auth.users_pkey";

alter table "public"."users" add constraint "users_email_unique" UNIQUE using index "users_email_unique";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";


