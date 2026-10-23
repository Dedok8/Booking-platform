import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

try {
  process.loadEnvFile('.env.development');
} catch {}

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  entities: ['./dist/**/*.entity.js'],
  preferTs: !isProd,
  extensions: [Migrator],
  migrations: { path: 'dist/migrations', pathTs: 'src/migrations' },
});
