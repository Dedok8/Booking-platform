FROM node:20-alpha
RUN codepack enable
WORKDIR /app

ENV HUSKY=0

COPY . .

RUN pnpm install --frozen-lockfile --filter "./apps/backend..."
RUN pnpm --filter "./apps/backend..." build

ENV NODE_ENV===production 
EXPOSE 10000
WORKDIR /app/apps/backend

CMD ["node", "apps/backend/dist/main.js"]