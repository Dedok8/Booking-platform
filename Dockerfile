FROM node:24-alpine
RUN corepack enable
WORKDIR /app

ENV HUSKY=0

COPY . .

RUN pnpm install --frozen-lockfile --filter "backend..."
RUN pnpm --filter "@booking-platform/shared" build
RUN pnpm --filter "backend" build

ENV NODE_ENV=production
EXPOSE 10000
WORKDIR /app/apps/backend

CMD ["node", "dist/main.js"]