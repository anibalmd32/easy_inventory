# Etapa de construcción
FROM node:20 AS builder

WORKDIR /app

# Copiar los archivos de configuración
COPY package.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar Prisma y construir el proyecto
RUN npx prisma generate
RUN npm run build

# Instalar Playwright
RUN npx playwright install

# Instalar dependencias necesarias para Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgbm1 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev

# Etapa de producción
FROM node:20 AS runner

WORKDIR /app

# Copiar el resultado de la construcción
COPY --from=builder /app /app/

# Exponer el puerto
EXPOSE 3000

# Establecer entorno
ENV NODE_ENV=production
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Comando de inicio
CMD [ "npm", "start" ]
