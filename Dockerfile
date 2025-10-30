# Étape 1: Build de l'application
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers de dépendances pour l'installation
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances avec pnpm
RUN pnpm install --frozen-lockfile

# Copie du reste du code source
COPY . .

# Build de l'application Next.js en mode standalone
RUN pnpm run build

# Étape 2: Exécution de l'application
FROM node:20-alpine AS runner
WORKDIR /app

# Définition de l'environnement de production
ENV NODE_ENV=production

# Copie des fichiers nécessaires depuis l'étape de build
# Le dossier .next/standalone contient le serveur et les dépendances
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

# Installation des dépendances de production uniquement avec pnpm
RUN pnpm install --omit=dev

# Expose le port sur lequel l'application Next.js s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]