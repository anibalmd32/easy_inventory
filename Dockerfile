# Estapa de construccion
FROM node:alpine AS builder

WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm prisma generate

RUN pnpm run build

RUN pnpm exec playwright install

# Etapa de produccion
FROM node:alpine AS runner

WORKDIR /app

COPY --from=builder /app /app/

RUN npm install -g pnpm

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "pnpm", "start" ]
