# Étape 1: Build de l'application (stage 'builder')
# Utilise une image Node.js 20 Alpine comme base pour la construction
FROM node:20-alpine AS builder

# Définit le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copie package.json et package-lock.json en premier pour tirer parti du cache Docker.
# Cette étape garantit que si seul le code source change, 'npm ci' n'est pas réexécuté.
COPY package.json package-lock.json ./

# Installe les dépendances de manière déterministe en utilisant le lockfile.
RUN npm ci

# Copie le reste du code source de l'application
COPY . .

# Construit l'application Next.js pour la production.
# L'option 'output: "standalone"' dans next.config.ts créera un build auto-contenu.
RUN npm run build

# Étape 2: Exécution de l'application (stage 'runner')
# Utilise une image Node.js 20 Alpine minimale pour l'image finale de production
FROM node:20-alpine AS runner

# Définit le répertoire de travail
WORKDIR /app

# Définit les variables d'environnement pour la production
ENV NODE_ENV=production

# Copie la sortie 'standalone' de l'étape 'builder'.
# Cela inclut l'application construite, node_modules, et server.js.
COPY --from=builder /app/.next/standalone ./

# Copie les assets publics séparément
COPY --from=builder /app/public ./public

# Les fichiers package.json et package-lock.json ne sont pas nécessaires dans l'image finale 'runner'
# car l'application standalone est auto-contenue.
# La commande npm prune --production est également redondante car seules les dépendances de production
# sont incluses dans le build standalone.

# Expose le port sur lequel Next.js s'exécute
EXPOSE 3000

# Commande pour démarrer le serveur de production Next.js
CMD ["node", "server.js"]