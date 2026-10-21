import { Migration } from '@mikro-orm/migrations';

export class Migration20261021134327 extends Migration {
  override name = 'Migration20261021134327';

  override up(): void | Promise<void> {
    this.addSql(
      `create table "users" ("id" uuid not null, "name" varchar(60) not null, "email" varchar(255) not null, "password_hash" varchar(255) not null, "refresh_token" varchar(255) null, "role" text not null default 'USER', "bio" varchar(200) null, "email_verified_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );

    this.addSql(
      `create table "refresh_session" ("id" uuid not null, "user_id" uuid not null, "family_id" uuid not null, "token_hash" varchar(64) not null, "expires_at" timestamptz not null, "revoke_at" timestamptz null, "user_agent" varchar(45) null, "ip" varchar(45) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, primary key ("id"));`,
    );
    this.addSql(
      `create index "refresh_session_user_id_index" on "refresh_session" ("user_id");`,
    );
    this.addSql(
      `create index "refresh_session_family_id_index" on "refresh_session" ("family_id");`,
    );
    this.addSql(
      `create index "refresh_session_expires_at_index" on "refresh_session" ("expires_at");`,
    );

    this.addSql(
      `alter table "users" add constraint "users_role_check" check ("role" in ('USER', 'MANAGER', 'ADMIN'));`,
    );

    this.addSql(
      `alter table "refresh_session" add constraint "refresh_session_user_id_foreign" foreign key ("user_id") references "users" ("id") on delete cascade;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "refresh_session" drop constraint "refresh_session_user_id_foreign";`,
    );

    this.addSql(`drop table if exists "users" cascade;`);
    this.addSql(`drop table if exists "refresh_session" cascade;`);
  }
}
