FROM node:22-alpine

WORKDIR /app

# Copia los archivos del proyecto
COPY package.json pnpm-lock.yaml ./

# Instala pnpm y las dependencias del proyecto
RUN npm install -g pnpm
RUN pnpm install

# Copia el resto de los archivos del proyecto
COPY . .

# Empaqueta la aplicación para producción
RUN pnpm run build

# Instala el servidor estático 'serve' globalmente
RUN npm install -g serve

# Expone el puerto por defecto de 'serve'
EXPOSE 3000

# Comando para iniciar la aplicación en modo producción con 'serve'
CMD ["serve", "-s", "dist"]