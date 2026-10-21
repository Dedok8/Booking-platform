import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

try {
  process.loadEnvFile('.env.development');
} catch {}

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['./dist/**/*.entity.js'],
  preferTs: true,
  extensions: [Migrator],
  migrations: { path: 'dist/migrations', pathTs: 'src/migrations' },
});
