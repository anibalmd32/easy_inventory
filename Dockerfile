# Etapa de construcción
FROM node:alpine AS builder

WORKDIR /app

COPY package.json ./ 
COPY pnpm-lock.yaml ./

# Instala pnpm y dependencias
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

# Generar Prisma y construir la app
RUN pnpm prisma generate
RUN pnpm run build

# Instalar Chromium y dependencias del sistema
RUN apk add --no-cache \
  nss \
  chromium \
  harfbuzz \
  ca-certificates \
  ttf-freefont

RUN pnpm playwright install

# Etapa de producción
FROM node:alpine AS runner

WORKDIR /app

COPY --from=builder /app /app/

RUN apk update && \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories && \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories && \
  apk add --no-cache \
  nss \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  libstdc++ \
  libx11 \
  libxcomposite \
  libxdamage \
  libxi \
  libxtst \
  libnss \
  libxrandr \
  libcups \
  libpangocairo \
  libpango \
  libatk \
  libatk-bridge2.0 \
  libepoxy \
  libdrm \
  libgbm \
  libxshmfence \
  libxcb \
  libxkbcommon

ENV NODE_ENV=production
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000

CMD [ "pnpm", "start" ]
