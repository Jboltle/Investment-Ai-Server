create table "public"."auth" (
    "id" uuid not null default gen_random_uuid(),
    "email" character varying(255) not null,
    "password" character varying(255) not null,
    "username" character varying(255) not null,
    "watchlist" json not null default '[]'::json
);


CREATE UNIQUE INDEX auth_email_unique ON public.auth USING btree (email);

CREATE UNIQUE INDEX auth_pkey ON public.auth USING btree (id);

alter table "public"."auth" add constraint "auth_pkey" PRIMARY KEY using index "auth_pkey";

alter table "public"."auth" add constraint "auth_email_unique" UNIQUE using index "auth_email_unique";

grant delete on table "public"."auth" to "anon";

grant insert on table "public"."auth" to "anon";

grant references on table "public"."auth" to "anon";

grant select on table "public"."auth" to "anon";

grant trigger on table "public"."auth" to "anon";

grant truncate on table "public"."auth" to "anon";

grant update on table "public"."auth" to "anon";

grant delete on table "public"."auth" to "authenticated";

grant insert on table "public"."auth" to "authenticated";

grant references on table "public"."auth" to "authenticated";

grant select on table "public"."auth" to "authenticated";

grant trigger on table "public"."auth" to "authenticated";

grant truncate on table "public"."auth" to "authenticated";

grant update on table "public"."auth" to "authenticated";

grant delete on table "public"."auth" to "service_role";

grant insert on table "public"."auth" to "service_role";

grant references on table "public"."auth" to "service_role";

grant select on table "public"."auth" to "service_role";

grant trigger on table "public"."auth" to "service_role";

grant truncate on table "public"."auth" to "service_role";

grant update on table "public"."auth" to "service_role";


