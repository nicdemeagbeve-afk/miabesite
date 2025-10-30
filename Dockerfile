# Étape 1: Build de l'application
FROM node:20-alpine AS builder
WORKDIR /app

# Copie des fichiers de dépendances pour l'installation
COPY package.json pnpm-lock.yaml ./

# Installation des dépendances
# Utilisez 'npm ci' si vous avez un package-lock.json ou 'pnpm install --frozen-lockfile' pour pnpm
RUN npm ci

# Copie du reste du code source
COPY . .

# Build de l'application Next.js en mode standalone
# Le mode standalone génère un dossier .next/standalone avec tout le nécessaire
RUN npm run build

# Étape 2: Exécution de l'application
FROM node:20-alpine AS runner
WORKDIR /app

# Définition de l'environnement de production
ENV NODE_ENV=production

# Copie des fichiers nécessaires depuis l'étape de build
# Le dossier .next/standalone contient le serveur et les dépendances
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./ # Nécessaire pour 'npm ci --omit=dev'
COPY --from=builder /app/pnpm-lock.yaml ./ # Nécessaire pour 'npm ci --omit=dev'

# Installation des dépendances de production uniquement
# Le mode standalone réduit déjà les dépendances, mais ceci assure qu'aucune devDependency n'est présente
RUN npm ci --omit=dev

# Expose le port sur lequel l'application Next.js s'exécute
EXPOSE 3000

# Commande pour démarrer l'application
# Le fichier server.js est généré par Next.js en mode standalone
CMD ["node", "server.js"]