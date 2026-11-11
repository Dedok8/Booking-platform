import { Migration } from '@mikro-orm/migrations';

export class Migration20261027221040 extends Migration {

  override name = 'Migration20261027221040';

  override up(): void | Promise<void> {
    this.addSql(`alter table "refresh_session" alter column "user_agent" type varchar(255) using ("user_agent"::varchar(255));`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "refresh_session" alter column "user_agent" type varchar(45) using ("user_agent"::varchar(45));`);
  }

}
