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

# Copiar la app y dependencias de producción
COPY --from=builder /app /app/
COPY --from=builder /usr/bin/chromium-browser /usr/bin/chromium-browser
COPY --from=builder /usr/lib/chromium/ /usr/lib/chromium/

RUN apk add --no-cache \
  nss \
  harfbuzz \
  ca-certificates \
  ttf-freefont \
  # Necesario para Chromium
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
  libatk1.0 \
  libatk-bridge2.0 \
  libepoxy \
  libdrm \
  libgbm \
  libxshmfence \
  libxcb \
  libxkbcommon

# Evitar instalar pnpm en la segunda etapa
RUN pnpm install --prod --frozen-lockfile

# Variables de entorno
ENV NODE_ENV=production
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 3000

CMD [ "pnpm", "start" ]
