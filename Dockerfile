# Étape 1 : Construction de l'image de build
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Étape 2 : Construction de l'image de production
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app ./

EXPOSE 3000

# Démarrer l'application
CMD ["node", "app.js"]
