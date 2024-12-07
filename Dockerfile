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

# Etapa de producción
FROM node:20 AS runner

WORKDIR /app

# Copiar el resultado de la construcción
COPY --from=builder /app /app/

# Instalar Playwright y sus dependencias
RUN npx playwright install --with-deps

# Exponer el puerto
EXPOSE 3000

# Establecer entorno
ENV NODE_ENV=production

# Comando de inicio
CMD ["npm", "start"]
