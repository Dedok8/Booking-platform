import { DBService } from '@/core/db/db.service.js';
import { Module } from '@nestjs/common';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/core/config/validation/env.validation.js';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [ConfigService],
      useFactory: (config: ConfigService<Env, true>) => ({
        clientUrl: config.get('DATABASE_URL', { infer: true }),
        autoLoadEntities: true,
        extensions: [Migrator],
        migrations: { path: 'dist/migrations', pathTs: 'src/migrations' },
      }),
    }),
  ],
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {}
